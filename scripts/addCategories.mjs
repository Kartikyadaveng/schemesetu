import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMES_PATH = resolve(__dirname, '../src/data/schemes.json');

// Map scheme category to multi-category tags
function deriveCategories(scheme) {
  const cat = scheme.category || '';
  const name = (scheme.name || '').toLowerCase();
  const desc = (scheme.shortDesc || '').toLowerCase();
  const tags = (scheme.tags || []).map(t => t.toLowerCase());
  const keywords = (scheme.searchKeywords || []).map(k => k.toLowerCase());
  const all = [...tags, ...keywords, name, desc];

  const cats = new Set();

  // Primary category always included
  if (cat) cats.add(cat);

  // Education-related
  if (all.some(t => /scholarship|student|education|coaching|hostel|college|school|learn|skill|exam|marks|course|degree|tuition/.test(t))) {
    cats.add('education');
    if (cat !== 'students') cats.add('students');
  }

  // Farmer / agriculture
  if (all.some(t => /farmer|agriculture|crop|farm|kisan|irrigation|land|soil|seed|fertilizer|organic|horticulture/.test(t))) {
    cats.add('farmers');
  }

  // Women
  if (all.some(t => /woman|women|female|girl|beti|binti|stree|mahila|maternal|mother|pregnancy/.test(t))) {
    cats.add('women');
  }

  // Jobs / employment
  if (all.some(t => /job|employment|career|placement|recruitment|apprentice|employ|hire/.test(t))) {
    cats.add('jobs');
  }

  // Business / MSME
  if (all.some(t => /business|enterprise|msme|entrepreneur|loan|mudra|udyog|vyaapaar/.test(t))) {
    cats.add('business');
  }

  // Health
  if (all.some(t => /health|medical|hospital|insurance|ayushman|disease|treatment|medicine|surgery|wellness|cardiac|cancer|diagnostic/.test(t))) {
    cats.add('health');
  }

  // Senior / pension
  if (all.some(t => /senior|pension|old age|retirement|elderly|vriddh|seva|pramaan/.test(t))) {
    cats.add('senior');
    cats.add('pension');
  }

  // Housing
  if (all.some(t => /housing|home|house|shelter|aawas|residence|property|apartment|flat/.test(t))) {
    cats.add('housing');
  }

  // Disability
  if (all.some(t => /disab|divyang|handicap|blind|deaf|special|differently-abled|wheelchair/.test(t))) {
    cats.add('disability');
  }

  // Startup
  if (all.some(t => /startup|seed fund|incubation|innovation|pitch|venture|early stage/.test(t))) {
    cats.add('startup');
    if (cat !== 'business') cats.add('business');
  }

  // Subsidy / DBT
  if (all.some(t => /subsidy|dbt|direct benefit|financial assistance|grant|incentive|support|aid|allowance|stipend/.test(t))) {
    cats.add('subsidy');
  }

  // Skill development
  if (all.some(t => /skill|training|vocational|apprentice|course|certification|upskill|reskill|workshop/.test(t))) {
    cats.add('skill-development');
  }

  // Map non-standard categories to official ones
  const official = ['students','farmers','women','jobs','business','health','senior','housing','disability','startup','education','pension','subsidy','skill-development'];
  const categoryMap = {
    'senior-citizens': 'senior',
    'child-development': 'education',
    'food-processing': 'business',
    'infrastructure': 'subsidy',
    'insurance': 'health',
    'livelihood': 'jobs',
    'sanitation': 'health',
    'urban-development': 'housing',
    'digital-literacy': 'education',
  };

  const result = [...cats].map(c => categoryMap[c] || c).filter(c => official.includes(c));
  if (result.length === 0 && cat && official.includes(cat)) {
    result.push(cat);
  }

  return [...new Set(result)].sort();
}

// Load schemes
const schemes = JSON.parse(readFileSync(SCHEMES_PATH, 'utf-8'));

let added = 0;
schemes.forEach(s => {
  s.categories = deriveCategories(s);
  added++;
});

writeFileSync(SCHEMES_PATH, JSON.stringify(schemes, null, 2) + '\n', 'utf-8');
console.log(`✅ Added categories to ${added} schemes (total: ${schemes.length})`);
console.log('📋 Category assignments:');
const counts = {};
schemes.forEach(s => {
  (s.categories || []).forEach(c => {
    counts[c] = (counts[c] || 0) + 1;
  });
});
Object.entries(counts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} schemes`);
  });
