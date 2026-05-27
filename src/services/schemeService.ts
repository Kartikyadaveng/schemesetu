// ============================================================
// SchemeSetu - Scheme Service
// Provides scheme data — tries Firestore first, falls back to dummy data
// ============================================================

import { DUMMY_SCHEMES } from '../constants/dummyData';
import * as firestore from './firestoreService';
import { isFirebaseReady } from './firebase';
import { calculateMatch, getEligibilityColor, getEligibilityBg } from './eligibilityEngine';
import type { Scheme, CategoryStats } from './firestoreService';
import type { MatchResult } from './eligibilityEngine';

export type { MatchResult };

// ── Helpers ──────────────────────────────────────────────────────────────────

function convertDummyToScheme(d: typeof DUMMY_SCHEMES[0]): Scheme {
  return {
    id: d.id,
    name: d.name,
    nameHindi: d.nameHindi,
    ministry: d.ministry,
    category: d.category,
    categories: d.categories || [d.category],
    shortDesc: d.shortDesc,
    description: d.description,
    benefits: d.benefits,
    eligibility: d.eligibility,
    documents: d.documents,
    deadline: d.deadline,
    amount: d.amount || '',
    isNew: d.isNew || false,
    isPopular: d.isPopular || false,
    applicationUrl: d.applicationUrl,
    officialLink: d.officialLink || d.applicationUrl,
    ministryLink: d.ministryLink || '',
    verificationStatus: d.verificationStatus || 'unverified',
    tags: d.tags,
    state: 'Central',
    searchKeywords: [d.name.toLowerCase()],
  };
}

export interface ScoredScheme {
  scheme: Scheme;
  match: MatchResult;
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getAllSchemes(): Promise<Scheme[]> {
  if (isFirebaseReady()) {
    const result = await firestore.getAllSchemes();
    if (result.schemes.length > 0) return result.schemes;
  }
  return DUMMY_SCHEMES.map(convertDummyToScheme);
}

export async function getSchemeById(id: string): Promise<Scheme | undefined> {
  if (isFirebaseReady()) {
    const result = await firestore.getSchemeById(id);
    if (result) return result;
  }
  const dummy = DUMMY_SCHEMES.find(s => s.id === id);
  return dummy ? convertDummyToScheme(dummy) : undefined;
}

export async function searchSchemes(query: string): Promise<Scheme[]> {
  if (isFirebaseReady()) {
    const result = await firestore.searchSchemes(query);
    if (result.length > 0) return result;
  }
  const q = query.toLowerCase();
  return DUMMY_SCHEMES
    .filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.shortDesc.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      (s.categories || []).some(c => c.toLowerCase().includes(q)) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    )
    .map(convertDummyToScheme);
}

export async function getSchemesByCategory(category: string): Promise<Scheme[]> {
  if (isFirebaseReady()) {
    const result = await firestore.getSchemesByCategory(category);
    if (result.schemes.length > 0) return result.schemes;
  }
  return DUMMY_SCHEMES
    .filter(s => s.categories?.includes(category) || s.category === category)
    .map(convertDummyToScheme);
}

export async function getFeaturedSchemes(): Promise<Scheme[]> {
  if (isFirebaseReady()) {
    const result = await firestore.getFeaturedSchemes();
    if (result.length > 0) return result;
  }
  return DUMMY_SCHEMES
    .filter(s => s.isNew || s.isPopular)
    .map(convertDummyToScheme);
}

export async function getNewSchemes(): Promise<Scheme[]> {
  if (isFirebaseReady()) {
    const result = await firestore.getNewSchemes();
    if (result.length > 0) return result;
  }
  return DUMMY_SCHEMES
    .filter(s => s.isNew)
    .map(convertDummyToScheme);
}

export async function getStats() {
  if (isFirebaseReady()) {
    const result = await firestore.getStats();
    if (result) return result;
  }
  return null;
}

const FALLBACK_CATEGORIES: Record<string, { label: string; emoji: string; icon: string; color: string; description: string }> = {
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

export async function getCategories(): Promise<CategoryStats[]> {
  if (isFirebaseReady()) {
    const result = await firestore.getCategories();
    if (result.some(c => c.count > 0)) return result;
  }
  const counts: Record<string, number> = {};
  DUMMY_SCHEMES.forEach(s => {
    const cats = s.categories || [s.category];
    cats.forEach(c => { counts[c] = (counts[c] || 0) + 1; });
  });
  return Object.entries(FALLBACK_CATEGORIES).map(([id, meta]) => ({
    id,
    label: meta.label,
    emoji: meta.emoji,
    icon: meta.icon,
    color: meta.color,
    description: meta.description,
    count: counts[id] || 0,
  }));
}

export async function saveScheme(userId: string, schemeId: string): Promise<void> {
  if (isFirebaseReady()) {
    await firestore.toggleBookmark(userId, schemeId);
  }
}

export async function unsaveScheme(userId: string, schemeId: string): Promise<void> {
  if (isFirebaseReady()) {
    await firestore.toggleBookmark(userId, schemeId);
  }
}

export async function getBookmarkedSchemes(userId: string): Promise<Scheme[]> {
  if (isFirebaseReady()) {
    return await firestore.getBookmarkedSchemes(userId);
  }
  return [];
}

/**
 * Score all schemes against the user profile using the eligibility engine
 */
export async function getScoredSchemes(
  profile?: { occupation?: string; details?: Record<string, string> },
  matchLimit = 50
): Promise<ScoredScheme[]> {
  let all: Scheme[] = [];
  if (isFirebaseReady()) {
    const fromFs = await firestore.getAllSchemes();
    if (fromFs.schemes.length > 0) all = fromFs.schemes;
  }
  if (all.length === 0) {
    all = DUMMY_SCHEMES.map(convertDummyToScheme);
  }

  const scored = all.map(scheme => ({
    scheme,
    match: calculateMatch(
      {
        eligibleStates: scheme.eligibleStates,
        eligibleOccupations: scheme.eligibleOccupations,
        maxIncome: scheme.maxIncome,
        minIncome: scheme.minIncome,
        eligibleCategories: scheme.eligibleCategories,
        minimumMarks: scheme.minimumMarks,
        genderEligibility: scheme.genderEligibility,
        ageRange: scheme.ageRange,
        disabilityEligible: scheme.disabilityEligible,
      },
      { occupation: profile?.occupation, details: profile?.details }
    ),
  }));

  scored.sort((a, b) => b.match.score - a.match.score);
  return scored.slice(0, matchLimit);
}

/**
 * Get top recommended schemes based on eligibility score
 */
export async function getRecommendedSchemes(
  occupation?: string,
  details?: Record<string, string>,
  count = 6
): Promise<Scheme[]> {
  const scored = await getScoredSchemes(
    occupation ? { occupation, details } : undefined,
    count * 2
  );
  return scored.slice(0, count).map(s => s.scheme);
}

/**
 * Get schemes with match scores for a category, sorted by eligibility
 */
export async function getSchemesByCategoryWithScore(
  category: string,
  profile?: { occupation?: string; details?: Record<string, string> }
): Promise<ScoredScheme[]> {
  const all = await getScoredSchemes(profile);
  return all.filter(s => (s.scheme.categories || [s.scheme.category]).includes(category));
}

export function getMatchColor(match: MatchResult): string {
  return getEligibilityColor(match.label);
}

export function getMatchBg(match: MatchResult): string {
  return getEligibilityBg(match.label);
}
