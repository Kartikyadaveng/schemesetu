import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { DUMMY_SCHEMES, type Scheme } from '../constants/dummyData';
import { type Lang } from '../constants/strings';
import { initFirebase, isFirebaseReady, getAuthInstance, onAuthChange } from '../services/firebase';
import * as firestore from '../services/firestoreService';
import type { Occupation } from '../types/profile';

// ── Types ────────────────────────────────────────────────────────────────────

export type Screen =
  | 'splash'
  | 'login'
  | 'signup'
  | 'onboarding'
  | 'home'
  | 'chat'
  | 'saved'
  | 'notifications'
  | 'profile'
  | 'editProfile'
  | 'schemeDetail'
  | 'categorySchemes'
  | 'allSchemes';

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  isGuest?: boolean;
  provider?: 'email' | 'google' | 'guest';
}

export interface UserProfileData {
  occupation?: Occupation;
  profileDetails?: Record<string, string>;
  completedOnboarding: boolean;
}

// Allow saving profile data (works for both Firebase users and guests)
export const GUEST_PROFILE_KEY = 'schemesetu_guest_profile';

interface AppContextType {
  currentScreen: Screen;
  setScreen: (screen: Screen, params?: Record<string, unknown>) => void;
  screenParams: Record<string, unknown>;

  isDark: boolean;
  toggleTheme: () => void;

  language: Lang;
  setLanguage: (lang: Lang) => void;

  user: User | null;
  userProfile: UserProfileData | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  loginWithGoogle: () => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  completeOnboarding: (occupation: Occupation, profileDetails: Record<string, string>) => Promise<void>;

  savedSchemes: string[];
  toggleSave: (schemeId: string) => void;
  isSaved: (schemeId: string) => boolean;

  schemes: Scheme[];
  getSchemeById: (id: string) => Scheme | undefined;

  unreadCount: number;
  setUnreadCount: (count: number) => void;

  isLoading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [screenParams, setScreenParams] = useState<Record<string, unknown>>({});
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState<Lang>('en');
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [savedSchemes, setSavedSchemes] = useState<string[]>([]);
  const [unreadCount, setUnreadCount] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Initialize Firebase on mount
  useEffect(() => {
    initFirebase();
  }, []);

  const loadProfile = useCallback(async (uid: string) => {
    if (!isFirebaseReady()) return;
    setProfileLoading(true);
    try {
      const data = await firestore.getUserProfile(uid) as Record<string, unknown> | null;
      if (data) {
        setUserProfile({
          occupation: data.occupation as Occupation | undefined,
          profileDetails: data.profileDetails as Record<string, string> | undefined,
          completedOnboarding: data.completedOnboarding === true,
        });
        if (!data.completedOnboarding && !user?.isGuest) {
          setCurrentScreen('onboarding');
        }
      } else {
        setUserProfile({ completedOnboarding: false });
        if (!user?.isGuest) {
          setCurrentScreen('onboarding');
        }
      }
    } catch {
      setUserProfile({ completedOnboarding: false });
    } finally {
      setProfileLoading(false);
    }
  }, [user?.isGuest]);

  // Firebase auth state listener
  useEffect(() => {
    if (!isFirebaseReady()) return;

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const appUser: User = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || undefined,
          provider: firebaseUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
        };
        setUser(appUser);

        // Load bookmarks from Firestore
        try {
          const bookmarks = await firestore.getUserBookmarks(firebaseUser.uid);
          setSavedSchemes(bookmarks);
        } catch (e) {
          console.warn('Failed to load bookmarks:', e);
        }

        // Load user profile (checks onboarding status)
        await loadProfile(firebaseUser.uid);
      } else if (currentScreen !== 'splash') {
        // User signed out — only reset if we're not still in splash
        setUser(null);
        setUserProfile(null);
        setSavedSchemes([]);
      }
    });

    return () => unsubscribe();
  }, [loadProfile, currentScreen]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const setScreen = (screen: Screen, params?: Record<string, unknown>) => {
    setScreenParams(params || {});
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const toggleTheme = () => setIsDark(prev => !prev);

  // ── Auth Methods (Firebase when ready, simulated fallback) ──────────────

  const navigateAfterAuth = () => {
    if (userProfile?.completedOnboarding) {
      setScreen('home');
    } else {
      setScreen('onboarding');
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (isFirebaseReady()) {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        const auth = getAuthInstance();
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await new Promise(r => setTimeout(r, 1200));
        setUser({
          uid: 'usr_' + Date.now(),
          name: email.split('@')[0].replace(/[._]/g, ' '),
          email,
          provider: 'email',
        });
        setUserProfile({ completedOnboarding: false });
        setScreen('onboarding');
      }
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      console.error('Login error:', e);
      const messages: Record<string, string> = {
        'auth/user-not-found': 'No account found with this email. Please sign up first.',
        'auth/wrong-password': 'Incorrect password. Try again or reset your password.',
        'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
        'auth/configuration-not-found': 'Authentication is not configured. Please enable Email/Password sign-in in Firebase Console.',
        'auth/unauthorized-domain': `Add "${window.location.hostname}" to Firebase Auth → Authorized domains in your Firebase Console.`,
      };
      const friendlyMsg = messages[e.code as string] || e.message || 'Login failed. Please try again.';
      alert(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      if (isFirebaseReady()) {
        const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
        const auth = getAuthInstance();
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        await firestore.updateUserProfile(cred.user.uid, {
          name,
          email,
          provider: 'email',
        });
      } else {
        setUser({
          uid: 'usr_' + Date.now(),
          name,
          email,
          provider: 'email',
        });
      }
      setUserProfile({ completedOnboarding: false });
      setScreen('onboarding');
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      console.error('Signup error:', e);
      const messages: Record<string, string> = {
        'auth/email-already-in-use': 'An account with this email already exists. Try logging in instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
        'auth/configuration-not-found': 'Authentication is not configured. Please enable Email/Password sign-in in Firebase Console.',
        'auth/unauthorized-domain': `Add "${window.location.hostname}" to Firebase Auth → Authorized domains in your Firebase Console.`,
      };
      const friendlyMsg = messages[e.code as string] || e.message || 'Signup failed. Please try again.';
      alert(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = () => {
    setUser({
      uid: 'guest_' + Date.now(),
      name: 'Guest User',
      email: 'guest@schemesetu.in',
      isGuest: true,
      provider: 'guest',
    });
    // Try to restore saved guest profile
    try {
      const saved = localStorage.getItem(GUEST_PROFILE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as UserProfileData;
        setUserProfile(parsed);
        setScreen('home');
        return;
      }
    } catch {}
    setUserProfile({ completedOnboarding: false });
    setSavedSchemes([]);
    setScreen('onboarding');
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      if (isFirebaseReady()) {
        const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
        const auth = getAuthInstance();
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } else {
        setUser({
          uid: 'google_' + Date.now(),
          name: 'Google User',
          email: 'user@gmail.com',
          photoURL: 'https://ui-avatars.com/api/?name=Google+User&background=FF6B35&color=fff',
          provider: 'google',
        });
        setUserProfile({ completedOnboarding: false });
        setScreen('onboarding');
      }
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      console.error('Google login error:', e);
      if (e.code === 'auth/popup-closed-by-user') return;
      const messages: Record<string, string> = {
        'auth/popup-blocked': 'Pop-up was blocked. Please allow pop-ups for this site.',
        'auth/unauthorized-domain': `Add "${window.location.hostname}" to Firebase Auth → Authorized domains in your Firebase Console.`,
      };
      alert(messages[e.code as string] || e.message || 'Google login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (isFirebaseReady() && !user?.isGuest) {
        const { signOut } = await import('firebase/auth');
        await signOut(getAuthInstance());
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    setUserProfile(null);
    setSavedSchemes([]);
    setScreen('login');
  };

  const refreshProfile = async () => {
    if (user && !user.isGuest) {
      await loadProfile(user.uid);
    }
  };

  const completeOnboarding = async (occupation: Occupation, profileDetails: Record<string, string>) => {
    const profile: UserProfileData = { occupation, profileDetails, completedOnboarding: true };
    setUserProfile(profile);

    if (user && !user.isGuest) {
      const { saveOnboardingData } = await import('../services/firestoreService');
      await saveOnboardingData(user.uid, { occupation, profileDetails, completedOnboarding: true });
    } else {
      localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(profile));
    }

    setScreen('home');
  };

  // ── Bookmark Methods (Firestore when ready) ─────────────────────────────

  const toggleSave = useCallback(async (schemeId: string) => {
    const isCurrentlySaved = savedSchemes.includes(schemeId);

    // Optimistic update
    setSavedSchemes(prev =>
      isCurrentlySaved
        ? prev.filter(id => id !== schemeId)
        : [...prev, schemeId]
    );

    // Sync to Firestore if logged in
    if (isFirebaseReady() && user && !user.isGuest) {
      await firestore.toggleBookmark(user.uid, schemeId);
    }
  }, [savedSchemes, user]);

  const isSaved = useCallback((schemeId: string) => {
    return savedSchemes.includes(schemeId);
  }, [savedSchemes]);

  // ── Scheme Methods ──────────────────────────────────────────────────────

  const getSchemeById = (id: string) => DUMMY_SCHEMES.find(s => s.id === id);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setScreen,
        screenParams,
        isDark,
        toggleTheme,
        language,
        setLanguage,
        user,
        userProfile,
        login,
        signup,
        loginAsGuest,
        loginWithGoogle,
        logout,
        refreshProfile,
        completeOnboarding,
        savedSchemes,
        toggleSave,
        isSaved,
        schemes: DUMMY_SCHEMES,
        getSchemeById,
        unreadCount,
        setUnreadCount,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
