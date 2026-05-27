import type { Scheme, CategoryStats } from './firestoreService';
import type { MatchBreakdown as MatchResult, AnswerMap } from '../types/eligibility';
import { calculateStrictMatch, getMatchColor, getMatchBg } from './eligibilityEngine';
import { isFirebaseReady } from './firebase';
import * as firestore from './firestoreService';

import schemeData from '../data/schemes.json';

export type { MatchResult };

export interface ScoredScheme {
  scheme: Scheme;
  match: MatchResult;
}

const ALL_SCHEMES: Scheme[] = (Array.isArray(schemeData) ? schemeData : []) as Scheme[];

function getByIdFallback(id: string): Scheme | undefined {
  return ALL_SCHEMES.find(s => s.id === id);
}

function searchFallback(query: string): Scheme[] {
  const q = query.toLowerCase();
  return ALL_SCHEMES.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.shortDesc.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q) ||
    (s.categories || []).some(c => c.toLowerCase().includes(q)) ||
    s.tags.some(t => t.toLowerCase().includes(q))
  );
}

export async function getAllSchemes(): Promise<Scheme[]> {
  if (isFirebaseReady()) {
    const result = await firestore.getAllSchemes();
    if (result.schemes.length > 0) return result.schemes;
  }
  return ALL_SCHEMES;
}

export async function getSchemeById(id: string): Promise<Scheme | undefined> {
  if (isFirebaseReady()) {
    const result = await firestore.getSchemeById(id);
    if (result) return result;
  }
  return getByIdFallback(id);
}

export async function searchSchemes(query: string): Promise<Scheme[]> {
  if (isFirebaseReady()) {
    const result = await firestore.searchSchemes(query);
    if (result.length > 0) return result;
  }
  return searchFallback(query);
}

export async function getSchemesByCategory(category: string): Promise<Scheme[]> {
  if (isFirebaseReady()) {
    const result = await firestore.getSchemesByCategory(category);
    if (result.schemes.length > 0) return result.schemes;
  }
  return ALL_SCHEMES.filter(s =>
    (s.categories || [s.category]).includes(category)
  );
}

export async function getFeaturedSchemes(): Promise<Scheme[]> {
  if (isFirebaseReady()) {
    const result = await firestore.getFeaturedSchemes();
    if (result.length > 0) return result;
  }
  return ALL_SCHEMES.filter(s => s.isNew || s.isPopular);
}

export async function getNewSchemes(): Promise<Scheme[]> {
  if (isFirebaseReady()) {
    const result = await firestore.getNewSchemes();
    if (result.length > 0) return result;
  }
  return ALL_SCHEMES.filter(s => s.isNew);
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
  ALL_SCHEMES.forEach(s => {
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

export async function getScoredSchemes(
  occupation?: string,
  answers?: AnswerMap,
  matchLimit = 50
): Promise<ScoredScheme[]> {
  let all: Scheme[] = [];
  if (isFirebaseReady()) {
    const fromFs = await firestore.getAllSchemes();
    if (fromFs.schemes.length > 0) all = fromFs.schemes;
  }
  if (all.length === 0) {
    all = ALL_SCHEMES;
  }

  const scored = all.map(scheme => ({
    scheme,
    match: calculateStrictMatch(
      {
        eligibleStates: scheme.eligibleStates,
        eligibleOccupations: scheme.eligibleOccupations,
        maxIncome: scheme.maxIncome,
        minIncome: scheme.minIncome,
        eligibleCategories: scheme.eligibleCategories,
        minimumMarks: scheme.minimumMarks,
        genderEligibility: scheme.genderEligibility,
        minAge: scheme.ageRange?.min,
        maxAge: scheme.ageRange?.max,
        disabilityEligible: scheme.disabilityEligible,
      },
      occupation,
      answers || {},
    ),
  }));

  scored.sort((a, b) => b.match.score - a.match.score);
  return scored.slice(0, matchLimit);
}

export async function getRecommendedSchemes(
  occupation?: string,
  answers?: AnswerMap,
  count = 6
): Promise<Scheme[]> {
  const scored = await getScoredSchemes(occupation, answers, count);
  return scored.map(s => s.scheme);
}

export async function getSchemesByCategoryWithScore(
  category: string,
  occupation?: string,
  answers?: AnswerMap
): Promise<ScoredScheme[]> {
  const all = await getScoredSchemes(occupation, answers);
  return all.filter(s => (s.scheme.categories || [s.scheme.category]).includes(category));
}

export { getMatchColor, getMatchBg };
