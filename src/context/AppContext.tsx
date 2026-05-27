import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { DUMMY_SCHEMES, type Scheme } from '../constants/dummyData';
import { type Lang } from '../constants/strings';
import { initFirebase, isFirebaseReady, getAuthInstance, onAuthChange, handleRedirectResult } from '../services/firebase';
import * as firestore from '../services/firestoreService';
import type { Occupation } from '../types/profile';
import { isMobileDevice } from '../utils/device';

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
export const GUEST_UID_KEY = 'schemesetu_guest_uid';

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
  isAuthLoading: boolean;
  isAuthenticated: boolean;
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
  profileLoading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

const makeUser = (fbUser: { uid: string; displayName: string | null; email: string | null; photoURL: string | null; providerData: { providerId: string }[] }): User => ({
  uid: fbUser.uid,
  name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
  email: fbUser.email || '',
  photoURL: fbUser.photoURL || undefined,
  provider: fbUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
});

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
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authInitDone = useRef(false);

  const loadProfile = useCallback(async (uid: string): Promise<UserProfileData | null> => {
    if (!isFirebaseReady()) return null;
    try {
      const data = await firestore.getUserProfile(uid) as Record<string, unknown> | null;
      if (data) {
        return {
          occupation: data.occupation as Occupation | undefined,
          profileDetails: data.profileDetails as Record<string, string> | undefined,
          completedOnboarding: data.completedOnboarding === true,
        };
      }
      return { completedOnboarding: false };
    } catch {
      return { completedOnboarding: false };
    }
  }, []);

  // ── ONE auth init effect — runs once on mount ──────────────────────────
  useEffect(() => {
    const fbReady = initFirebase();

    if (!fbReady) {
      // Firebase not configured — restore guest or go straight to login
      const guestUid = localStorage.getItem(GUEST_UID_KEY);
      const savedProfile = localStorage.getItem(GUEST_PROFILE_KEY);
      if (guestUid && savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile) as UserProfileData;
          setUser({
            uid: guestUid, name: 'Guest User', email: 'guest@schemesetu.in',
            isGuest: true, provider: 'guest',
          });
          setUserProfile(parsed);
          setIsAuthLoading(false);
          setCurrentScreen(parsed.completedOnboarding ? 'home' : 'onboarding');
          return;
        } catch {
          localStorage.removeItem(GUEST_UID_KEY);
          localStorage.removeItem(GUEST_PROFILE_KEY);
        }
      }
      setUser(null);
      setUserProfile(null);
      setIsAuthLoading(false);
      setCurrentScreen('login');
      return;
    }

    // Subscribe to post-init auth events (login, logout, token expiry)
    const unsub = onAuthChange((firebaseUser) => {
      if (!authInitDone.current) return;

      if (firebaseUser) {
        const appUser = makeUser(firebaseUser);
        setUser(appUser);
        setIsAuthenticated(true);
        setUserProfile(null);
        setSavedSchemes([]);
        setCurrentScreen('home');
        loadProfile(firebaseUser.uid).then(profile => {
          if (profile) setUserProfile(profile);
          setCurrentScreen(profile?.completedOnboarding ? 'home' : 'onboarding');
        });
        firestore.getUserBookmarks(firebaseUser.uid).then(b => setSavedSchemes(b)).catch(() => {});
      } else {
        setUser(null);
        setUserProfile(null);
        setSavedSchemes([]);
        setIsAuthenticated(false);
        setCurrentScreen('login');
      }
    });

    // Wait for Firebase to resolve the initial auth state
    getAuthInstance().authStateReady().then(async () => {
      const currentUser = getAuthInstance().currentUser;

      if (currentUser) {
        localStorage.removeItem(GUEST_UID_KEY);
        localStorage.removeItem(GUEST_PROFILE_KEY);

        const appUser = makeUser(currentUser);
        setUser(appUser);
        setIsAuthenticated(true);

        try {
          const existing = await firestore.getUserProfile(currentUser.uid);
          if (!existing) {
            await firestore.updateUserProfile(currentUser.uid, {
              name: appUser.name, email: appUser.email,
              photoURL: appUser.photoURL, provider: appUser.provider,
            });
          }
        } catch (e) {
          console.warn('Failed to create/verify Firestore profile:', e);
        }

        const profile = await loadProfile(currentUser.uid);
        if (profile) setUserProfile(profile);

        try {
          const bookmarks = await firestore.getUserBookmarks(currentUser.uid);
          setSavedSchemes(bookmarks);
        } catch (e) {
          console.warn('Failed to load bookmarks:', e);
        }

        // ── Everything loaded — navigate and unlock in one batch ──
        authInitDone.current = true;
        setIsAuthLoading(false);
        setCurrentScreen(profile?.completedOnboarding ? 'home' : 'onboarding');
      } else {
        // No Firebase user — attempt guest restore
        const guestUid = localStorage.getItem(GUEST_UID_KEY);
        const savedProfile = localStorage.getItem(GUEST_PROFILE_KEY);
        if (guestUid && savedProfile) {
          try {
            const parsed = JSON.parse(savedProfile) as UserProfileData;
            if (parsed.completedOnboarding) {
              setUser({
                uid: guestUid, name: 'Guest User', email: 'guest@schemesetu.in',
                isGuest: true, provider: 'guest',
              });
              setUserProfile(parsed);
              authInitDone.current = true;
              setIsAuthLoading(false);
              setCurrentScreen('home');
              return;
            }
          } catch {
            localStorage.removeItem(GUEST_UID_KEY);
            localStorage.removeItem(GUEST_PROFILE_KEY);
          }
        }

        // Guest without completed onboarding or no guest at all
        localStorage.removeItem(GUEST_UID_KEY);
        setUser(null);
        setUserProfile(null);
        authInitDone.current = true;
        setIsAuthLoading(false);
        setCurrentScreen('login');
      }
    });

    return () => {
      unsub();
    };
  }, []);

  // Handle Google redirect result (mobile) — catches errors from redirect flow
  useEffect(() => {
    if (!isFirebaseReady()) return;

    handleRedirectResult().then((result) => {
      if (result) {
        console.log('Redirect sign-in successful');
      }
    }).catch((err: unknown) => {
      const e = err as { code?: string; message?: string };
      if (e.code === 'auth/popup-closed-by-user') return;
      if (e.code === 'auth/redirect-cancelled') return;
      if (e.code === 'auth/unauthorized-domain') {
        alert(`Add "${window.location.hostname}" to Firebase Auth → Authorized domains in your Firebase Console.`);
      } else if (e.message) {
        console.warn('Redirect sign-in error:', e.message);
      }
    });
  }, []);

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
    const uid = 'guest_' + Date.now();
    localStorage.setItem(GUEST_UID_KEY, uid);
    setUser({
      uid,
      name: 'Guest User',
      email: 'guest@schemesetu.in',
      isGuest: true,
      provider: 'guest',
    });
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
        const { signInWithPopup, signInWithRedirect, GoogleAuthProvider } = await import('firebase/auth');
        const auth = getAuthInstance();
        const provider = new GoogleAuthProvider();
        if (isMobileDevice()) {
          await signInWithRedirect(auth, provider);
        } else {
          await signInWithPopup(auth, provider);
        }
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
      if (e.code === 'auth/redirect-cancelled') return;
      const messages: Record<string, string> = {
        'auth/popup-blocked': 'Pop-up was blocked. Please allow pop-ups for this site.',
        'auth/redirect-cancelled': 'Sign-in was cancelled. Please try again.',
        'auth/unauthorized-domain': `Add "${window.location.hostname}" to Firebase Auth → Authorized domains in your Firebase Console.`,
      };
      alert(messages[e.code as string] || e.message || 'Google login failed. Please try again.');
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
    localStorage.removeItem(GUEST_UID_KEY);
    localStorage.removeItem(GUEST_PROFILE_KEY);
    setUser(null);
    setUserProfile(null);
    setSavedSchemes([]);
    setIsAuthenticated(false);
    setIsAuthLoading(false);
    setScreen('login');
  };

  const refreshProfile = async () => {
    if (user && !user.isGuest) {
      setProfileLoading(true);
      try {
        const profile = await loadProfile(user.uid);
        if (profile) setUserProfile(profile);
      } finally {
        setProfileLoading(false);
      }
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

    setSavedSchemes(prev =>
      isCurrentlySaved
        ? prev.filter(id => id !== schemeId)
        : [...prev, schemeId]
    );

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
        isAuthLoading,
        isAuthenticated,
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
        profileLoading,
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
