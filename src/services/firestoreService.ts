// ============================================================
// SchemeSetu - Firestore Service
// All Firestore database operations in one place
// ============================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  documentId,
  serverTimestamp,
  increment,
  onSnapshot,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
  type Firestore,
} from 'firebase/firestore';
import { getDbInstance, isFirebaseReady } from './firebase';

// ── Types ────────────────────────────────────────────────────────────────────

export interface Scheme {
  id: string;
  name: string;
  nameHindi: string;
  ministry: string;
  category: string;
  categories: string[];
  shortDesc: string;
  description: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
  deadline: string;
  amount: string;
  isNew: boolean;
  isPopular: boolean;
  applicationUrl: string;
  officialLink?: string;
  ministryLink?: string;
  verificationStatus?: 'verified' | 'needs-review' | 'unverified';
  tags: string[];
  state: string;
  searchKeywords: string[];
  createdAt?: string;
  updatedAt?: string;

  // Eligibility rules for smart matching
  eligibleStates?: string[];
  eligibleOccupations?: string[];
  maxIncome?: number;
  minIncome?: number;
  eligibleCategories?: string[];
  minimumMarks?: number;
  genderEligibility?: string[];
  ageRange?: { min?: number; max?: number };
  disabilityEligible?: boolean;
}

export interface CategoryStats {
  id: string;
  label: string;
  emoji: string;
  icon: string;
  color: string;
  description: string;
  count: number;
}

export interface AppStats {
  totalSchemes: number;
  totalCategories: number;
  newSchemes: number;
  popularSchemes: number;
  lastUpdated: string;
  categories: Record<string, number>;
}

// ── Helper: check Firebase ───────────────────────────────────────────────────

const PAGE_SIZE = 20;

function checkFirebase(): Firestore | null {
  if (!isFirebaseReady()) {
    console.warn('Firebase not configured. Returning empty results.');
    return null;
  }
  return getDbInstance();
}

// ── Schemes CRUD ─────────────────────────────────────────────────────────────

/**
 * Get all schemes (paginated)
 */
export async function getAllSchemes(page = 1): Promise<{ schemes: Scheme[]; hasMore: boolean }> {
  const db = checkFirebase();
  if (!db) return { schemes: [], hasMore: false };

  try {
    let q = query(
      collection(db, 'schemes'),
      orderBy('name'),
      limit(PAGE_SIZE)
    );

    if (page > 1) {
      // For pagination support — would need last doc from previous page
      // For simplicity, we'll skip to approximate offset
    }

    const snapshot = await getDocs(q);
    const schemes = snapshot.docs.map(docToScheme);
    return { schemes, hasMore: snapshot.docs.length === PAGE_SIZE };
  } catch (err) {
    console.error('Error fetching schemes:', err);
    return { schemes: [], hasMore: false };
  }
}

/**
 * Get scheme by ID
 */
export async function getSchemeById(id: string): Promise<Scheme | null> {
  const db = checkFirebase();
  if (!db) return null;

  try {
    const docRef = doc(db, 'schemes', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return docToScheme(docSnap);
  } catch (err) {
    console.error('Error fetching scheme:', err);
    return null;
  }
}

/**
 * Get schemes by category (supports multi-category via array-contains)
 */
export async function getSchemesByCategory(
  category: string,
  page = 1
): Promise<{ schemes: Scheme[]; hasMore: boolean }> {
  const db = checkFirebase();
  if (!db) return { schemes: [], hasMore: false };

  try {
    let q = query(
      collection(db, 'schemes'),
      where('categories', 'array-contains', category),
      orderBy('name'),
      limit(PAGE_SIZE)
    );

    const snapshot = await getDocs(q);
    const schemes = snapshot.docs.map(docToScheme);
    return { schemes, hasMore: snapshot.docs.length === PAGE_SIZE };
  } catch (err) {
    console.error('Error fetching schemes by category:', err);
    return { schemes: [], hasMore: false };
  }
}

/**
 * Get all categories with computed scheme counts from Firestore
 */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const db = checkFirebase();
  if (!db) return {};

  try {
    const snapshot = await getDocs(collection(db, 'schemes'));
    const counts: Record<string, number> = {};
    snapshot.docs.forEach(doc => {
      const cats = doc.data().categories as string[] | undefined;
      if (Array.isArray(cats)) {
        cats.forEach(c => {
          counts[c] = (counts[c] || 0) + 1;
        });
      }
    });
    return counts;
  } catch {
    return {};
  }
}

/**
 * Search schemes by name, tags, or keywords
 */
export async function searchSchemes(
  searchQuery: string
): Promise<Scheme[]> {
  const db = checkFirebase();
  if (!db) return [];

  if (!searchQuery.trim()) return [];

  const query_lower = searchQuery.toLowerCase().trim();

  try {
    // Firestore doesn't support native full-text search,
    // so we fetch all and filter client-side for now.
    // For production, consider Algolia or Meilisearch.
    let q = query(
      collection(db, 'schemes'),
      orderBy('name'),
      limit(100)
    );

    const snapshot = await getDocs(q);
    const allSchemes = snapshot.docs.map(docToScheme);

    // Filter by search keywords, tags, name, and category
    return allSchemes.filter(scheme => {
      const searchName = scheme.name.toLowerCase();
      const searchNameHindi = scheme.nameHindi.toLowerCase();
      const searchTags = scheme.tags.join(' ').toLowerCase();
      const searchKeywords = (scheme.searchKeywords || []).join(' ').toLowerCase();
      const searchDesc = scheme.shortDesc.toLowerCase();
      const searchCategories = (scheme.categories || []).join(' ').toLowerCase();

      const fullText = `${searchName} ${searchNameHindi} ${searchTags} ${searchKeywords} ${searchDesc} ${searchCategories}`;
      return fullText.includes(query_lower);
    });
  } catch (err) {
    console.error('Error searching schemes:', err);
    return [];
  }
}

/**
 * Get featured/popular schemes
 */
export async function getFeaturedSchemes(): Promise<Scheme[]> {
  const db = checkFirebase();
  if (!db) return [];

  try {
    let q = query(
      collection(db, 'schemes'),
      where('isPopular', '==', true),
      orderBy('name'),
      limit(10)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToScheme);
  } catch (err) {
    console.error('Error fetching featured schemes:', err);
    return [];
  }
}

/**
 * Get newly added schemes
 */
export async function getNewSchemes(): Promise<Scheme[]> {
  const db = checkFirebase();
  if (!db) return [];

  try {
    let q = query(
      collection(db, 'schemes'),
      where('isNew', '==', true),
      orderBy('name'),
      limit(10)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToScheme);
  } catch (err) {
    console.error('Error fetching new schemes:', err);
    return [];
  }
}

// ── Stats ────────────────────────────────────────────────────────────────────

/**
 * Get app statistics from Firestore
 */
export async function getStats(): Promise<AppStats | null> {
  const db = checkFirebase();
  if (!db) return null;

  try {
    const statsRef = doc(db, 'stats', 'overview');
    const statsSnap = await getDoc(statsRef);
    if (!statsSnap.exists()) return null;
    return statsSnap.data() as AppStats;
  } catch (err) {
    console.error('Error fetching stats:', err);
    return null;
  }
}

/**
 * All 14 categories with metadata
 */
const ALL_CATEGORIES: Record<string, { label: string; emoji: string; icon: string; color: string; description: string }> = {
  students:         { label: 'Students',       emoji: '🎓', icon: 'graduation-cap', color: '#7C3AED', description: 'Scholarships, coaching, hostel & education schemes' },
  farmers:          { label: 'Farmers',         emoji: '🌾', icon: 'leaf',           color: '#059669', description: 'Agriculture, irrigation, crop insurance & farmer welfare' },
  women:            { label: 'Women',           emoji: '👩', icon: 'shield',         color: '#DB2777', description: 'Women empowerment, safety, health & welfare' },
  jobs:             { label: 'Jobs',            emoji: '💼', icon: 'briefcase',      color: '#2563EB', description: 'Employment, apprenticeship & career opportunities' },
  business:         { label: 'Business',        emoji: '🏪', icon: 'building',       color: '#D97706', description: 'Loans, MSME support & entrepreneurship' },
  health:           { label: 'Health',          emoji: '🏥', icon: 'health',         color: '#DC2626', description: 'Health insurance, medical & wellness schemes' },
  senior:           { label: 'Senior Citizens', emoji: '👴', icon: 'users',          color: '#0D9488', description: 'Pension, healthcare & welfare for senior citizens' },
  housing:          { label: 'Housing',         emoji: '🏠', icon: 'home',           color: '#475569', description: 'Affordable housing & home loan schemes' },
  disability:       { label: 'Disability',      emoji: '♿', icon: 'accessibility',  color: '#9333EA', description: 'Schemes for persons with disabilities' },
  startup:          { label: 'Startup',         emoji: '🚀', icon: 'rocket',         color: '#F59E0B', description: 'Startup funding, incubation & innovation support' },
  education:        { label: 'Education',       emoji: '📖', icon: 'book',           color: '#3B82F6', description: 'Educational scholarships, loans & skill training' },
  pension:          { label: 'Pension',         emoji: '💳', icon: 'credit-card',    color: '#0891B2', description: 'Pension & retirement benefit schemes' },
  subsidy:          { label: 'Subsidy',         emoji: '💰', icon: 'coins',          color: '#84CC16', description: 'Financial subsidies & direct benefit transfers' },
  'skill-development': { label: 'Skill Development', emoji: '🔧', icon: 'wrench',   color: '#F97316', description: 'Skill training, apprenticeship & vocational courses' },
};

export const CATEGORY_META = ALL_CATEGORIES;

/**
 * Get categories with scheme counts (computed dynamically from Firestore)
 */
export async function getCategories(): Promise<CategoryStats[]> {
  const counts = await getCategoryCounts();

  return Object.entries(ALL_CATEGORIES).map(([id, meta]) => ({
    id,
    label: meta.label,
    emoji: meta.emoji,
    icon: meta.icon,
    color: meta.color,
    description: meta.description,
    count: counts[id] || 0,
  }));
}

// ── Bookmarks (Legacy) ───────────────────────────────────────────────────────

/**
 * Get all bookmarked scheme IDs for a user (legacy bookmark collection)
 */
export async function getUserBookmarks(userId: string): Promise<string[]> {
  const db = checkFirebase();
  if (!db) return [];

  try {
    const bookmarksRef = collection(db, 'bookmarks', userId, 'schemes');
    const snapshot = await getDocs(bookmarksRef);
    return snapshot.docs.map(d => d.id);
  } catch (err) {
    console.error('Error fetching bookmarks:', err);
    return [];
  }
}

/**
 * Toggle a bookmark (add if not exists, remove if exists) — legacy method
 */
export async function toggleBookmark(
  userId: string,
  schemeId: string
): Promise<boolean> {
  const db = checkFirebase();
  if (!db) return false;

  try {
    const bookmarkRef = doc(db, 'bookmarks', userId, 'schemes', schemeId);
    const bookmarkSnap = await getDoc(bookmarkRef);

    if (bookmarkSnap.exists()) {
      await deleteDoc(bookmarkRef);
      return false;
    } else {
      await setDoc(bookmarkRef, {
        schemeId,
        savedAt: serverTimestamp(),
      });
      return true;
    }
  } catch (err) {
    console.error('Error toggling bookmark:', err);
    return false;
  }
}

/**
 * Check if a scheme is bookmarked by the user
 */
export async function isSchemeBookmarked(
  userId: string,
  schemeId: string
): Promise<boolean> {
  const db = checkFirebase();
  if (!db) return false;

  try {
    const bookmarkRef = doc(db, 'bookmarks', userId, 'schemes', schemeId);
    const bookmarkSnap = await getDoc(bookmarkRef);
    return bookmarkSnap.exists();
  } catch {
    return false;
  }
}

/**
 * Get full bookmark scheme objects for a user (legacy)
 */
export async function getBookmarkedSchemes(userId: string): Promise<Scheme[]> {
  const db = checkFirebase();
  if (!db) return [];

  try {
    const bookmarkIds = await getUserBookmarks(userId);
    if (bookmarkIds.length === 0) return [];

    const chunks = chunkArray(bookmarkIds, 30);
    const results: Scheme[] = [];

    for (const chunk of chunks) {
      let q = query(
        collection(db, 'schemes'),
        where(documentId(), 'in', chunk)
      );
      const snapshot = await getDocs(q);
      results.push(...snapshot.docs.map(docToScheme));
    }

    return results;
  } catch (err) {
    console.error('Error fetching bookmarked schemes:', err);
    return [];
  }
}

// ── Saved Schemes (New: users/{userId}/savedSchemes) ────────────────────────

export interface SavedSchemeData {
  schemeId: string;
  savedAt: Date;
  category: string;
  schemeName: string;
  schemeEmoji: string;
}

/**
 * Save a scheme to user's saved collection
 */
export async function saveScheme(
  userId: string,
  schemeId: string,
  scheme: { category: string; name: string; emoji: string }
): Promise<boolean> {
  const db = checkFirebase();
  if (!db) return false;

  try {
    const ref = doc(db, 'users', userId, 'savedSchemes', schemeId);
    await setDoc(ref, {
      schemeId,
      savedAt: serverTimestamp(),
      category: scheme.category,
      schemeName: scheme.name,
      schemeEmoji: scheme.emoji,
    });
    return true;
  } catch (err) {
    console.error('Error saving scheme:', err);
    return false;
  }
}

/**
 * Unsave (remove) a scheme from user's saved collection
 */
export async function unsaveScheme(
  userId: string,
  schemeId: string
): Promise<boolean> {
  const db = checkFirebase();
  if (!db) return false;

  try {
    const ref = doc(db, 'users', userId, 'savedSchemes', schemeId);
    await deleteDoc(ref);
    return true;
  } catch (err) {
    console.error('Error unsaving scheme:', err);
    return false;
  }
}

/**
 * Get all saved scheme IDs for a user
 */
export async function getSavedSchemeIds(userId: string): Promise<string[]> {
  const db = checkFirebase();
  if (!db) return [];

  try {
    const ref = collection(db, 'users', userId, 'savedSchemes');
    const q = query(ref, orderBy('savedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.id);
  } catch (err) {
    console.error('Error fetching saved scheme IDs:', err);
    return [];
  }
}

/**
 * Get all saved scheme data (with metadata) for a user
 */
export async function getSavedSchemeData(userId: string): Promise<SavedSchemeData[]> {
  const db = checkFirebase();
  if (!db) return [];

  try {
    const ref = collection(db, 'users', userId, 'savedSchemes');
    const q = query(ref, orderBy('savedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => {
      const data = d.data();
      return {
        schemeId: d.id,
        savedAt: data.savedAt?.toDate ? data.savedAt.toDate() : new Date(),
        category: data.category || '',
        schemeName: data.schemeName || '',
        schemeEmoji: data.schemeEmoji || '📋',
      };
    });
  } catch (err) {
    console.error('Error fetching saved scheme data:', err);
    return [];
  }
}

/**
 * Real-time listener for saved scheme IDs
 */
export function listenSavedSchemes(
  userId: string,
  callback: (ids: string[]) => void
): () => void {
  const db = checkFirebase();
  if (!db) {
    callback([]);
    return () => {};
  }

  const ref = collection(db, 'users', userId, 'savedSchemes');
  const q = query(ref, orderBy('savedAt', 'desc'));
  const unsub = onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(d => d.id));
  }, (err) => {
    console.error('Error in saved schemes listener:', err);
    callback([]);
  });
  return unsub;
}

// ── Notifications ────────────────────────────────────────────────────────────

export interface NotificationData {
  id: string;
  type: 'new_match' | 'deadline' | 'eligibility_update' | 'application_reminder' | 'scheme_bookmarked' | 'govt_update';
  title: string;
  body: string;
  schemeId?: string;
  schemeName?: string;
  read: boolean;
  createdAt: Date;
  icon: string;
}

const NOTIF_ICONS: Record<string, string> = {
  'new_match': '✨',
  'deadline': '⏰',
  'eligibility_update': '📢',
  'application_reminder': '🔔',
  'scheme_bookmarked': '🔖',
  'govt_update': '🏛️',
};

/**
 * Add a notification for a user
 */
export async function addNotification(
  userId: string,
  notif: Omit<NotificationData, 'id' | 'createdAt' | 'read'>
): Promise<string | null> {
  const db = checkFirebase();
  if (!db) return null;

  try {
    const ref = doc(collection(db, 'users', userId, 'notifications'));
    await setDoc(ref, {
      ...notif,
      read: false,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (err) {
    console.error('Error adding notification:', err);
    return null;
  }
}

/**
 * Get all notifications for a user (ordered by createdAt desc)
 */
export async function getNotifications(userId: string): Promise<NotificationData[]> {
  const db = checkFirebase();
  if (!db) return [];

  try {
    const ref = collection(db, 'users', userId, 'notifications');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        type: data.type || 'govt_update',
        title: data.title || '',
        body: data.body || '',
        schemeId: data.schemeId,
        schemeName: data.schemeName,
        read: data.read === true,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        icon: data.icon || NOTIF_ICONS[data.type] || '📋',
      };
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    return [];
  }
}

/**
 * Mark a single notification as read
 */
export async function markNotificationRead(
  userId: string,
  notifId: string
): Promise<void> {
  const db = checkFirebase();
  if (!db) return;

  try {
    const ref = doc(db, 'users', userId, 'notifications', notifId);
    await updateDoc(ref, { read: true });
  } catch (err) {
    console.error('Error marking notification read:', err);
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(userId: string): Promise<void> {
  const db = checkFirebase();
  if (!db) return;

  try {
    const ref = collection(db, 'users', userId, 'notifications');
    const q = query(ref, where('read', '==', false));
    const snapshot = await getDocs(q);
    const batch = snapshot.docs.map(d => updateDoc(d.ref, { read: true }));
    await Promise.all(batch);
  } catch (err) {
    console.error('Error marking all notifications read:', err);
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(
  userId: string,
  notifId: string
): Promise<void> {
  const db = checkFirebase();
  if (!db) return;

  try {
    const ref = doc(db, 'users', userId, 'notifications', notifId);
    await deleteDoc(ref);
  } catch (err) {
    console.error('Error deleting notification:', err);
  }
}

/**
 * Clear all notifications for a user
 */
export async function clearAllNotifications(userId: string): Promise<void> {
  const db = checkFirebase();
  if (!db) return;

  try {
    const ref = collection(db, 'users', userId, 'notifications');
    const snapshot = await getDocs(ref);
    const batch = snapshot.docs.map(d => deleteDoc(d.ref));
    await Promise.all(batch);
  } catch (err) {
    console.error('Error clearing notifications:', err);
  }
}

/**
 * Real-time listener for notifications
 */
export function listenNotifications(
  userId: string,
  callback: (notifications: NotificationData[]) => void
): () => void {
  const db = checkFirebase();
  if (!db) {
    callback([]);
    return () => {};
  }

  const ref = collection(db, 'users', userId, 'notifications');
  const q = query(ref, orderBy('createdAt', 'desc'));
  const unsub = onSnapshot(q, (snapshot) => {
    const notifs: NotificationData[] = snapshot.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        type: data.type || 'govt_update',
        title: data.title || '',
        body: data.body || '',
        schemeId: data.schemeId,
        schemeName: data.schemeName,
        read: data.read === true,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        icon: data.icon || NOTIF_ICONS[data.type] || '📋',
      };
    });
    callback(notifs);
  }, (err) => {
    console.error('Error in notifications listener:', err);
    callback([]);
  });
  return unsub;
}

/**
 * Generate smart notifications based on profile changes and match results
 */
export async function generateSmartNotifications(
  userId: string,
  occupation: string | undefined,
  profileDetails: Record<string, string>,
): Promise<void> {
  if (!occupation || !isFirebaseReady()) return;

  try {
    const { getScoredSchemes } = await import('./schemeService');
    const scored = await getScoredSchemes(occupation, profileDetails, 50);
    const perfect = scored.filter(s => s.match.label === 'perfect' || s.match.label === 'high');

    if (perfect.length >= 3) {
      await addNotification(userId, {
        type: 'new_match',
        title: `${perfect.length} High-Match Schemes Found!`,
        body: `You match ${perfect.length} schemes with ${perfect[0]?.match.score}%+ score. Check them now!`,
        icon: '✨',
      });
    }

    // Deadline reminders — check schemes with approaching deadlines
    const deadlineSchemes = scored
      .filter(s => s.match.label === 'perfect' || s.match.label === 'high')
      .slice(0, 3);

    for (const s of deadlineSchemes) {
      const deadline = s.scheme.deadline;
      if (deadline && deadline.toLowerCase() !== 'ongoing' && deadline.toLowerCase() !== 'open') {
        await addNotification(userId, {
          type: 'deadline',
          title: `Deadline Approaching: ${s.scheme.name}`,
          body: `Apply before ${deadline}. You have a ${s.match.score}% match!`,
          schemeId: s.scheme.id,
          schemeName: s.scheme.name,
          icon: '⏰',
        });
      }
    }
  } catch (err) {
    console.warn('Error generating smart notifications:', err);
  }
}

// ── Notification helpers ─────────────────────────────────────────────────────

export function getNotificationIcon(type: string): string {
  return NOTIF_ICONS[type] || '📋';
}

export function groupNotifications(notifs: NotificationData[]): {
  today: NotificationData[];
  week: NotificationData[];
  earlier: NotificationData[];
} {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  const today: NotificationData[] = [];
  const week: NotificationData[] = [];
  const earlier: NotificationData[] = [];

  for (const n of notifs) {
    const created = n.createdAt instanceof Date ? n.createdAt : new Date(n.createdAt);
    if (created >= todayStart) {
      today.push(n);
    } else if (created >= weekStart) {
      week.push(n);
    } else {
      earlier.push(n);
    }
  }

  return { today, week, earlier };
}

// ── Users ────────────────────────────────────────────────────────────────────

export interface OnboardingData {
  occupation: string;
  profileDetails: Record<string, string>;
  completedOnboarding: boolean;
}

/**
 * Create/update user profile in Firestore
 */
export async function updateUserProfile(
  uid: string,
  data: {
    name: string;
    email: string;
    photoURL?: string;
    provider?: string;
  }
): Promise<void> {
  const db = checkFirebase();
  if (!db) return;

  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('Error updating user profile:', err);
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string) {
  const db = checkFirebase();
  if (!db) return null;

  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch {
    return null;
  }
}

/**
 * Save onboarding data to user profile
 */
export async function saveOnboardingData(
  uid: string,
  data: OnboardingData
): Promise<void> {
  const db = checkFirebase();
  if (!db) return;

  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      occupation: data.occupation,
      profileDetails: data.profileDetails,
      completedOnboarding: data.completedOnboarding,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('Error saving onboarding data:', err);
  }
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(uid: string): Promise<boolean> {
  const profile = await getUserProfile(uid);
  return profile?.completedOnboarding === true;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function docToScheme(doc: DocumentSnapshot | QueryDocumentSnapshot): Scheme {
  const data = doc.data()!;
  return {
    id: doc.id,
    name: data.name || '',
    nameHindi: data.nameHindi || '',
    ministry: data.ministry || '',
    category: data.category || '',
    categories: data.categories || [data.category || ''].filter(Boolean),
    shortDesc: data.shortDesc || '',
    description: data.description || '',
    benefits: data.benefits || [],
    eligibility: data.eligibility || [],
    documents: data.documents || [],
    deadline: data.deadline || '',
    amount: data.amount || '',
    isNew: data.isNew || false,
    isPopular: data.isPopular || false,
    applicationUrl: data.applicationUrl || '',
    officialLink: data.officialLink || data.applicationUrl || '',
    ministryLink: data.ministryLink || '',
    verificationStatus: data.verificationStatus || 'unverified',
    tags: data.tags || [],
    state: data.state || '',
    searchKeywords: data.searchKeywords || [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    eligibleStates: data.eligibleStates,
    eligibleOccupations: data.eligibleOccupations,
    maxIncome: data.maxIncome,
    minIncome: data.minIncome,
    eligibleCategories: data.eligibleCategories,
    minimumMarks: data.minimumMarks,
    genderEligibility: data.genderEligibility,
    ageRange: data.ageRange,
    disabilityEligible: data.disabilityEligible,
  };
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
