import type { EligibilityRuleSet, MatchBreakdown, MatchCheck, MatchLabel, AnswerMap } from '../types/eligibility';
import { parseIncomeValue, parseIncomeMinMax, parseMarksValue } from '../types/eligibility';

const CRITICAL_WEIGHT = 25;
const STANDARD_WEIGHT = 10;
const OPTIONAL_WEIGHT = 5;

function checkValue(
  key: string,
  label: string,
  userValue: string | undefined,
  ruleValue: string[] | undefined,
  weight: number,
): MatchCheck {
  if (!ruleValue || ruleValue.length === 0) {
    return { key, label, passed: true, weight: 0 };
  }
  if (!userValue) {
    return { key, label, passed: false, weight };
  }
  const passed = ruleValue.some(r => r.toLowerCase() === userValue.toLowerCase());
  return { key, label, passed, weight };
}

function checkNumberMin(
  key: string,
  label: string,
  userValue: string | undefined,
  minThreshold: number | undefined,
  weight: number,
): MatchCheck {
  if (minThreshold === undefined || minThreshold === null) {
    return { key, label, passed: true, weight: 0 };
  }
  const val = parseFloat(userValue || '');
  if (isNaN(val)) {
    return { key, label, passed: false, weight };
  }
  return { key, label, passed: val >= minThreshold, weight };
}

function checkNumberMax(
  key: string,
  label: string,
  userValue: string | undefined,
  maxThreshold: number | undefined,
  weight: number,
): MatchCheck {
  if (maxThreshold === undefined || maxThreshold === null) {
    return { key, label, passed: true, weight: 0 };
  }
  const val = parseFloat(userValue || '');
  if (isNaN(val)) {
    return { key, label, passed: false, weight };
  }
  return { key, label, passed: val <= maxThreshold, weight };
}

function checkYesNo(
  key: string,
  label: string,
  userValue: string | undefined,
  expectedYes: boolean | undefined,
  weight: number,
): MatchCheck {
  if (expectedYes === undefined || expectedYes === null) {
    return { key, label, passed: true, weight: 0 };
  }
  if (!userValue) {
    return { key, label, passed: false, weight };
  }
  const isYes = userValue === 'yes' || userValue === 'true' || userValue === '1';
  return { key, label, passed: isYes === expectedYes, weight };
}

export function calculateStrictMatch(
  rules: EligibilityRuleSet,
  occupation: string | undefined,
  answers: AnswerMap,
): MatchBreakdown {
  const checks: MatchCheck[] = [];
  const missingFields: string[] = [];

  // 1. Occupation check (CRITICAL)
  checks.push(checkValue('occupation', 'Occupation matches', occupation, rules.eligibleOccupations, CRITICAL_WEIGHT));

  // 2. State check (CRITICAL if specified)
  if (rules.eligibleStates && rules.eligibleStates.length > 0) {
    const userState = answers['state'] || '';
    const hasAllIndia = rules.eligibleStates.some(s => s.toLowerCase().includes('all india') || s.toLowerCase().includes('all'));
    if (hasAllIndia) {
      checks.push({ key: 'state', label: 'Open to all states', passed: true, weight: 0 });
    } else {
      const passed = rules.eligibleStates.some(s => s.toLowerCase() === userState.toLowerCase());
      checks.push({ key: 'state', label: 'State in eligible list', passed, weight: CRITICAL_WEIGHT });
      if (!userState) missingFields.push('state');
    }
  }

  // 3. Category check (CRITICAL)
  if (rules.eligibleCategories && rules.eligibleCategories.length > 0) {
    const userCat = (answers['category'] || '').toUpperCase();
    const isOpen = rules.eligibleCategories.some(c => c.toUpperCase() === 'ALL' || c.toUpperCase() === 'GENERAL');
    if (isOpen) {
      checks.push({ key: 'category', label: 'Open to all categories', passed: true, weight: 0 });
    } else {
      const passed = rules.eligibleCategories.some(c => c.toUpperCase() === userCat);
      checks.push({ key: 'category', label: 'Category eligible', passed, weight: CRITICAL_WEIGHT });
      if (!answers['category']) missingFields.push('category');
    }
  }

  // 4. Income check (CRITICAL)
  if (rules.maxIncome !== undefined) {
    const incomeKey = answers['familyIncome'] || answers['annualIncome'] || answers['annualTurnover'] || answers['incomeRange'] || answers['monthlyIncome'] || answers['householdIncome'] || '';
    if (incomeKey) {
      const userIncome = parseIncomeValue(incomeKey);
      checks.push({ key: 'income', label: `Income ≤ ₹${(rules.maxIncome / 100000).toFixed(1)}L`, passed: userIncome <= rules.maxIncome, weight: CRITICAL_WEIGHT });
    } else {
      checks.push({ key: 'income', label: 'Income within limit', passed: false, weight: CRITICAL_WEIGHT });
      missingFields.push('familyIncome');
    }
  }
  if (rules.minIncome !== undefined) {
    const incomeKey = answers['familyIncome'] || answers['annualIncome'] || answers['annualTurnover'] || '';
    if (incomeKey) {
      const userIncome = parseIncomeValue(incomeKey);
      checks.push({ key: 'minIncome', label: `Income ≥ ₹${(rules.minIncome / 100000).toFixed(1)}L`, passed: userIncome >= rules.minIncome, weight: STANDARD_WEIGHT });
    } else {
      checks.push({ key: 'minIncome', label: 'Meets minimum income', passed: false, weight: STANDARD_WEIGHT });
    }
  }

  // 5. Marks check (CRITICAL)
  if (rules.minimumMarks !== undefined && rules.minimumMarks > 0) {
    const userMarks = parseMarksValue(answers['marks'] || '0');
    const passed = userMarks >= rules.minimumMarks;
    checks.push({ key: 'marks', label: `Minimum ${rules.minimumMarks}% marks`, passed: passed && userMarks > 0, weight: CRITICAL_WEIGHT });
    if (userMarks === 0) missingFields.push('marks');
  }

  // 6. Age check (CRITICAL)
  if (rules.minAge !== undefined) {
    const userAge = parseInt(answers['age'] || '', 10);
    checks.push({ key: 'minAge', label: `Minimum age ${rules.minAge}`, passed: !isNaN(userAge) && userAge >= rules.minAge, weight: CRITICAL_WEIGHT });
    if (isNaN(userAge)) missingFields.push('age');
  }
  if (rules.maxAge !== undefined) {
    const userAge = parseInt(answers['age'] || '', 10);
    checks.push({ key: 'maxAge', label: `Maximum age ${rules.maxAge}`, passed: !isNaN(userAge) && userAge <= rules.maxAge, weight: CRITICAL_WEIGHT });
    if (isNaN(userAge)) missingFields.push('age');
  }

  // 7. Gender check (CRITICAL)
  if (rules.genderEligibility && rules.genderEligibility.length > 0) {
    const userGender = (answers['gender'] || '').toLowerCase();
    const isAllGenders = rules.genderEligibility.some(g => g.toLowerCase() === 'all');
    if (isAllGenders) {
      checks.push({ key: 'gender', label: 'Open to all genders', passed: true, weight: 0 });
    } else {
      const passed = rules.genderEligibility.some(g => g.toLowerCase() === userGender);
      checks.push({ key: 'gender', label: 'Gender eligible', passed, weight: CRITICAL_WEIGHT });
      if (!answers['gender']) missingFields.push('gender');
    }
  }

  // 8. Disability (STANDARD)
  if (rules.disabilityEligible === true) {
    const isDisabled = answers['disability'] === 'yes' || occupation === 'disabled-person';
    checks.push({ key: 'disability', label: 'Disability eligible', passed: isDisabled, weight: STANDARD_WEIGHT });
  }

  // ── STANDARD / OPTIONAL CHECKS ─────────────────────────────────────────

  if (rules.courseTypes && rules.courseTypes.length > 0) {
    const userCourse = answers['course'] || '';
    const passed = rules.courseTypes.some(c => userCourse.toLowerCase().includes(c.toLowerCase()));
    checks.push({ key: 'courseType', label: 'Course type eligible', passed, weight: STANDARD_WEIGHT });
  }

  if (rules.degreeTypes && rules.degreeTypes.length > 0) {
    const userDegree = answers['degreeType'] || '';
    const passed = rules.degreeTypes.some(d => userDegree.toLowerCase().includes(d.toLowerCase()));
    checks.push({ key: 'degreeType', label: 'Degree type eligible', passed, weight: STANDARD_WEIGHT });
  }

  if (rules.streams && rules.streams.length > 0) {
    const userStream = answers['stream'] || '';
    const passed = rules.streams.some(s => userStream.toLowerCase().includes(s.toLowerCase()));
    checks.push({ key: 'stream', label: 'Stream eligible', passed, weight: STANDARD_WEIGHT });
  }

  if (rules.hostelRequired !== undefined) {
    checks.push(checkYesNo('hostel', 'Hostel resident', answers['hosteller'], rules.hostelRequired, OPTIONAL_WEIGHT));
  }

  if (rules.singleGirlChild !== undefined) {
    checks.push(checkYesNo('singleGirlChild', 'Single girl child', answers['singleGirlChild'], rules.singleGirlChild, OPTIONAL_WEIGHT));
  }

  if (rules.exServicemanFamily !== undefined) {
    checks.push(checkYesNo('exServiceman', 'Ex-serviceman family', answers['exServiceman'], rules.exServicemanFamily, OPTIONAL_WEIGHT));
  }

  if (rules.orphanEligible !== undefined) {
    checks.push(checkYesNo('orphan', 'Orphan eligible', answers['orphan'], rules.orphanEligible, OPTIONAL_WEIGHT));
  }

  if (rules.ruralRequired !== undefined) {
    const userRural = answers['rural'] || answers['ruralUrban'] || '';
    const isRural = userRural === 'rural' || userRural === 'yes';
    checks.push({ key: 'rural', label: 'Rural residence', passed: isRural === rules.ruralRequired, weight: OPTIONAL_WEIGHT });
  }

  if (rules.govtSchoolRequired !== undefined) {
    checks.push(checkYesNo('govtSchool', 'Government school student', answers['govtSchool'], rules.govtSchoolRequired, OPTIONAL_WEIGHT));
  }

  if (rules.bplRequired !== undefined) {
    checks.push(checkYesNo('bpl', 'BPL family', answers['bpl'], rules.bplRequired, OPTIONAL_WEIGHT));
  }

  if (rules.minorityEligible !== undefined) {
    checks.push(checkYesNo('minority', 'Minority community', answers['minority'], rules.minorityEligible, OPTIONAL_WEIGHT));
  }

  // ── SCORING ────────────────────────────────────────────────────────────

  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const passedWeight = checks.reduce((sum, c) => sum + (c.passed ? c.weight : 0), 0);

  if (totalWeight === 0) {
    return { score: 100, label: 'perfect', checks, missingFields };
  }

  const rawScore = (passedWeight / totalWeight) * 100;
  const score = Math.round(rawScore);

  let label: MatchLabel = 'none';
  if (score === 100) label = 'perfect';
  else if (score >= 75) label = 'high';
  else if (score >= 40) label = 'partial';
  else if (score > 0) label = 'low';
  else label = 'none';

  return { score, label, checks, missingFields };
}

export function getMatchColor(label: MatchLabel): string {
  switch (label) {
    case 'perfect': return '#00C896';
    case 'high': return '#00C896';
    case 'partial': return '#FFB800';
    case 'low': return '#FF6B35';
    case 'none': return '#EF4444';
  }
}

export function getMatchBg(label: MatchLabel): string {
  switch (label) {
    case 'perfect': return 'rgba(0,200,150,0.12)';
    case 'high': return 'rgba(0,200,150,0.12)';
    case 'partial': return 'rgba(255,184,0,0.12)';
    case 'low': return 'rgba(255,107,53,0.12)';
    case 'none': return 'rgba(239,68,68,0.12)';
  }
}

export function getMatchLabel(label: MatchLabel): string {
  switch (label) {
    case 'perfect': return 'Perfect Match';
    case 'high': return 'High Match';
    case 'partial': return 'Partial Match';
    case 'low': return 'Low Match';
    case 'none': return 'Not Eligible';
  }
}
