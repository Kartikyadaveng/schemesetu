import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const schemesPath = join(__dirname, '..', 'src', 'data', 'schemes.json');
const schemes = JSON.parse(readFileSync(schemesPath, 'utf-8'));

const CATEGORY_OCCUPATION_MAP = {
  students: ['student'],
  farmers: ['farmer'],
  education: ['student', 'job-seeker'],
  'skill-development': ['student', 'job-seeker', 'worker-labourer', 'disabled-person'],
  insurance: ['farmer', 'worker-labourer', 'senior-citizen', 'job-seeker'],
  health: ['senior-citizen', 'disabled-person', 'woman', 'worker-labourer', 'student', 'homemaker'],
  women: ['woman', 'homemaker'],
  business: ['business-owner'],
  'senior-citizens': ['senior-citizen'],
  jobs: ['job-seeker', 'worker-labourer'],
  housing: ['farmer', 'worker-labourer', 'senior-citizen', 'homemaker'],
  'child-development': ['woman', 'homemaker'],
  'food-processing': ['farmer', 'business-owner'],
  infrastructure: ['farmer', 'worker-labourer', 'senior-citizen'],
  sanitation: ['homemaker', 'worker-labourer'],
  livelihood: ['woman', 'worker-labourer', 'disabled-person'],
  'digital-literacy': ['student', 'job-seeker', 'senior-citizen', 'homemaker'],
  'urban-development': ['business-owner', 'job-seeker'],
};

function inferEligibility(scheme) {
  const name = (scheme.name || '').toLowerCase();
  const cat = scheme.category || '';
  const tags = (scheme.tags || []).join(' ').toLowerCase();
  const desc = (scheme.description || '').toLowerCase();
  const allText = name + ' ' + tags + ' ' + desc;
  const rules = {};

  const stateMap = {
    'all india': ['All India'],
    'uttar pradesh': ['Uttar Pradesh'],
    bihar: ['Bihar'],
    'tamil nadu': ['Tamil Nadu'],
    kerala: ['Kerala'],
    karnataka: ['Karnataka'],
    maharashtra: ['Maharashtra'],
    rajasthan: ['Rajasthan'],
    gujarat: ['Gujarat'],
    'west bengal': ['West Bengal'],
    'madhya pradesh': ['Madhya Pradesh'],
    odisha: ['Odisha'],
    assam: ['Assam'],
    punjab: ['Punjab'],
    haryana: ['Haryana'],
    jharkhand: ['Jharkhand'],
    chhattisgarh: ['Chhattisgarh'],
    delhi: ['Delhi'],
  };

  let foundStates = [];
  for (const key of Object.keys(stateMap)) {
    if (allText.includes(key)) {
      foundStates = foundStates.concat(stateMap[key]);
    }
  }

  const stateValue = (scheme.state || '').toLowerCase();
  if (stateValue.includes('all india') || stateValue === 'central' || foundStates.length === 0) {
    rules.eligibleStates = ['All India'];
  } else {
    rules.eligibleStates = [...new Set(foundStates)];
  }

  if (CATEGORY_OCCUPATION_MAP[cat]) {
    const rawOccupations = CATEGORY_OCCUPATION_MAP[cat].slice();
    if (allText.includes('student') || allText.includes('scholarship') || allText.includes('education')) {
      if (!rawOccupations.includes('student')) rawOccupations.push('student');
    }
    if (allText.includes('farmer') || allText.includes('kisan') || allText.includes('agriculture')) {
      if (!rawOccupations.includes('farmer')) rawOccupations.push('farmer');
    }
    if (allText.includes('woman') || allText.includes('female') || allText.includes('maternity') || allText.includes('girl')) {
      if (!rawOccupations.includes('woman')) rawOccupations.push('woman');
    }
    if (allText.includes('senior') || allText.includes('pension') || allText.includes('elderly')) {
      if (!rawOccupations.includes('senior-citizen')) rawOccupations.push('senior-citizen');
    }
    if (allText.includes('business') || allText.includes('startup') || allText.includes('entrepreneur')) {
      if (!rawOccupations.includes('business-owner')) rawOccupations.push('business-owner');
    }
    if (allText.includes('job') || allText.includes('employment') || allText.includes('career')) {
      if (!rawOccupations.includes('job-seeker')) rawOccupations.push('job-seeker');
    }
    if (allText.includes('disab') || allText.includes('divyang')) {
      if (!rawOccupations.includes('disabled-person')) rawOccupations.push('disabled-person');
    }
    if (allText.includes('labour') || allText.includes('worker') || allText.includes('wage')) {
      if (!rawOccupations.includes('worker-labourer')) rawOccupations.push('worker-labourer');
    }
    rules.eligibleOccupations = [...new Set(rawOccupations)];
  } else {
    rules.eligibleOccupations = ['other'];
  }

  const incomeTexts = [
    { pat: /below\s*₹?\s*([\d,]+)\s*lakh/i, mult: 100000 },
    { pat: /up\s*to\s*₹?\s*([\d,]+)\s*lakh/i, mult: 100000 },
    { pat: /less\s*than\s*₹?\s*([\d,]+)\s*lakh/i, mult: 100000 },
    { pat: /up\s*to\s*₹?\s*([\d,]+)/i, mult: 1 },
    { pat: /below\s*₹?\s*([\d,]+)/i, mult: 1 },
  ];
  for (const entry of incomeTexts) {
    const m = desc.match(entry.pat);
    if (m) {
      const val = parseFloat(m[1].replace(/,/g, ''));
      const incomeVal = val * entry.mult;
      if (!rules.maxIncome || incomeVal < rules.maxIncome) {
        rules.maxIncome = incomeVal;
      }
    }
  }

  if (!rules.maxIncome) {
    if (allText.includes('bpl') || allText.includes('below poverty') || allText.includes('poor')) {
      rules.maxIncome = 100000;
    } else if (allText.includes('low income') || allText.includes('ews') || allText.includes('economically weaker')) {
      rules.maxIncome = 250000;
    } else if (allText.includes('middle income') || allText.includes('scholarship')) {
      rules.maxIncome = 500000;
    } else if (allText.includes('farmer') || allText.includes('kisan') || allText.includes('agriculture')) {
      rules.maxIncome = 500000;
    } else if (allText.includes('pension') || allText.includes('old age')) {
      rules.maxIncome = 500000;
    }
  }

  if (allText.includes('scholarship') || allText.includes('merit') || allText.includes('academic')) {
    if (allText.includes('55%') || allText.includes('55 percent')) rules.minimumMarks = 55;
    else if (allText.includes('60%') || allText.includes('60 percent')) rules.minimumMarks = 60;
    else if (allText.includes('75%') || allText.includes('75 percent')) rules.minimumMarks = 75;
    else if (allText.includes('50%') || allText.includes('50 percent')) rules.minimumMarks = 50;
    else if (allText.includes('90%') || allText.includes('90 percent')) rules.minimumMarks = 90;
    else rules.minimumMarks = 50;
  }

  const catsFound = [];
  if (allText.includes('sc') || allText.includes('scheduled caste') || allText.includes('sc/st')) catsFound.push('SC');
  if (allText.includes('st') || allText.includes('scheduled tribe')) catsFound.push('ST');
  if (allText.includes('obc') || allText.includes('other backward')) catsFound.push('OBC');
  if (allText.includes('ews') || allText.includes('economically weaker')) catsFound.push('EWS');
  if (allText.includes('general') || catsFound.length === 0) catsFound.push('General');
  if (catsFound.length > 0 && !catsFound.includes('General') && !allText.includes('only')) {
    catsFound.push('General');
  }
  if (catsFound.includes('SC') && !catsFound.includes('ST')) catsFound.push('ST');
  rules.eligibleCategories = [...new Set(catsFound)];

  const genderSpecific = ['woman', 'female', 'girl', 'maternity', 'ladies', 'women'];
  if (genderSpecific.some(function(w) { return allText.includes(w); })) {
    rules.genderEligibility = ['female', 'woman'];
  } else {
    rules.genderEligibility = ['all'];
  }

  rules.disabilityEligible = allText.includes('disab') || allText.includes('divyang');
  return rules;
}

let changed = 0;
schemes.forEach(function(s) {
  const rules = inferEligibility(s);
  s.eligibleStates = rules.eligibleStates;
  s.eligibleOccupations = rules.eligibleOccupations;
  s.maxIncome = rules.maxIncome || null;
  s.minIncome = rules.minIncome || null;
  s.eligibleCategories = rules.eligibleCategories;
  s.minimumMarks = rules.minimumMarks || null;
  s.genderEligibility = rules.genderEligibility;
  s.disabilityEligible = rules.disabilityEligible;
  changed++;
});

writeFileSync(schemesPath, JSON.stringify(schemes, null, 2));
console.log('Updated ' + changed + ' schemes with eligibility rules');
