export interface EligibilityRules {
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

export interface MatchResult {
  score: number;
  label: 'high' | 'medium' | 'low' | 'none';
  matched: string[];
  partial: string[];
  missed: string[];
}

function incomeValue(incomeKey: string): number {
  const map: Record<string, number> = {
    'below-1lakh': 100000,
    '1-2.5lakh': 250000,
    '2.5-5lakh': 500000,
    '5-10lakh': 1000000,
    'above-10lakh': 1500000,
  };
  return map[incomeKey] || 500000;
}

function parseIncome(incomeKey: string): { min: number; max: number } {
  const map: Record<string, { min: number; max: number }> = {
    'below-1lakh': { min: 0, max: 100000 },
    '1-2.5lakh': { min: 100000, max: 250000 },
    '2.5-5lakh': { min: 250000, max: 500000 },
    '5-10lakh': { min: 500000, max: 1000000 },
    'above-10lakh': { min: 1000000, max: Infinity },
  };
  return map[incomeKey] || { min: 0, max: Infinity };
}

function marksValue(marksStr: string): number {
  const cleaned = marksStr.replace(/%/g, '').trim();
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  if (num <= 10 && cleaned.includes('.')) return num * 10;
  return num;
}

export function calculateMatch(
  rules: EligibilityRules,
  profile: { occupation?: string; details?: Record<string, string> }
): MatchResult {
  const details = profile.details || {};
  const matched: string[] = [];
  const partial: string[] = [];
  const missed: string[] = [];
  let totalChecks = 0;
  let passed = 0;

  // Occupation check
  if (rules.eligibleOccupations && rules.eligibleOccupations.length > 0) {
    totalChecks++;
    if (profile.occupation && rules.eligibleOccupations.includes(profile.occupation)) {
      passed++;
      matched.push('Occupation matches');
    } else {
      const partialMatch = rules.eligibleOccupations.some(o =>
        profile.occupation === 'student' && ['students', 'education'].includes(o) ||
        profile.occupation === 'farmer' && ['farmers', 'agriculture'].includes(o) ||
        profile.occupation === 'senior-citizen' && ['senior-citizens', 'senior'].includes(o)
      );
      if (partialMatch) {
        partial.push('Occupation partially matches');
        passed += 0.5;
      } else {
        missed.push('Occupation not eligible');
      }
    }
  }

  // State check
  if (rules.eligibleStates && rules.eligibleStates.length > 0) {
    totalChecks++;
    const userState = details['state'] || '';
    if (rules.eligibleStates.some(s => s.toLowerCase() === userState.toLowerCase())) {
      passed++;
      matched.push('State matches');
    } else {
      const isAllIndia = rules.eligibleStates.some(s =>
        s.toLowerCase().includes('all india') || s.toLowerCase().includes('all')
      );
      if (isAllIndia) {
        passed++;
        matched.push('Open to all states');
      } else {
        missed.push('State not eligible');
      }
    }
  }

  // Income check
  const incomeKey = details['familyIncome'] || details['annualIncome'] || details['annualTurnover'] || '';
  if (incomeKey && rules.maxIncome) {
    totalChecks++;
    const userIncome = incomeValue(incomeKey);
    if (userIncome <= rules.maxIncome) {
      passed++;
      matched.push('Income within limit');
    } else if (userIncome <= rules.maxIncome * 1.5) {
      partial.push('Income slightly above limit');
      passed += 0.5;
    } else {
      missed.push('Income exceeds limit');
    }
  }
  if (incomeKey && rules.minIncome) {
    totalChecks++;
    const userIncome = incomeValue(incomeKey);
    if (userIncome >= rules.minIncome) {
      passed++;
      matched.push('Meets minimum income');
    } else {
      missed.push('Income below minimum');
    }
  }

  // Category (caste) check
  if (rules.eligibleCategories && rules.eligibleCategories.length > 0) {
    totalChecks++;
    const userCategory = (details['category'] || '').toUpperCase();
    if (rules.eligibleCategories.some(c => c.toUpperCase() === userCategory)) {
      passed++;
      matched.push('Category matches');
    } else {
      const isGeneralOpen = rules.eligibleCategories.some(c => c.toUpperCase() === 'ALL' || c.toUpperCase() === 'GENERAL');
      if (isGeneralOpen) {
        passed++;
        matched.push('Open to all categories');
      } else {
        missed.push('Category not in eligibility');
      }
    }
  }

  // Marks check
  if (rules.minimumMarks && rules.minimumMarks > 0) {
    totalChecks++;
    const userMarks = marksValue(details['marks'] || '0');
    if (userMarks >= rules.minimumMarks) {
      passed++;
      matched.push('Marks meet requirement');
    } else if (userMarks > 0) {
      missed.push(`Marks below ${rules.minimumMarks}%`);
    }
  }

  // Gender check
  if (rules.genderEligibility && rules.genderEligibility.length > 0) {
    totalChecks++;
    const userGender = (details['gender'] || '').toLowerCase();
    if (rules.genderEligibility.some(g => g.toLowerCase() === userGender)) {
      passed++;
      matched.push('Gender matches');
    } else if (rules.genderEligibility.includes('all')) {
      passed++;
      matched.push('Open to all genders');
    } else {
      const isWomanScheme = rules.genderEligibility.some(g => g.toLowerCase() === 'female' || g.toLowerCase() === 'woman');
      if (isWomanScheme && profile.occupation === 'woman') {
        partial.push('Considered as woman');
        passed += 0.5;
      } else {
        missed.push('Gender not eligible');
      }
    }
  }

  // Disability check
  if (rules.disabilityEligible === true) {
    totalChecks++;
    if (details['disability'] === 'yes' || profile.occupation === 'disabled-person') {
      passed++;
      matched.push('Disability eligible');
    } else {
      // Not a requirement (scheme is open to all, disabled are also eligible)
      passed++;
      matched.push('Open to all (includes disabled)');
    }
  }

  if (totalChecks === 0) return { score: 100, label: 'high', matched: ['Open to all'], partial: [], missed: [] };

  const rawScore = (passed / totalChecks) * 100;
  const score = Math.round(rawScore);
  let label: MatchResult['label'] = 'low';
  if (score >= 80) label = 'high';
  else if (score >= 50) label = 'medium';
  else if (score > 0) label = 'low';
  else label = 'none';

  return { score, label, matched, partial, missed };
}

export function getEligibilityColor(label: MatchResult['label']): string {
  switch (label) {
    case 'high': return '#00C896';
    case 'medium': return '#FFB800';
    case 'low': return '#FF6B35';
    case 'none': return '#EF4444';
  }
}

export function getEligibilityBg(label: MatchResult['label']): string {
  switch (label) {
    case 'high': return 'rgba(0,200,150,0.12)';
    case 'medium': return 'rgba(255,184,0,0.12)';
    case 'low': return 'rgba(255,107,53,0.12)';
    case 'none': return 'rgba(239,68,68,0.12)';
  }
}
