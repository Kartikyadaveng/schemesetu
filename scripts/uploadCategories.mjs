import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const schemesPath = join(__dirname, '..', 'src', 'data', 'schemes.json');

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'YOUR_FIREBASE_API_KEY',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef123456',
};

const CATEGORY_DEFS = {
  students:         { title: 'Students',        emoji: '🎓', icon: 'graduation-cap', color: '#7C3AED', description: 'Scholarships, coaching, hostel & education schemes for students', schemeCount: 0 },
  farmers:          { title: 'Farmers',          emoji: '🌾', icon: 'leaf',           color: '#059669', description: 'Agriculture, irrigation, crop insurance & farmer welfare schemes', schemeCount: 0 },
  women:            { title: 'Women',            emoji: '👩', icon: 'shield',         color: '#DB2777', description: 'Women empowerment, safety, health & welfare schemes', schemeCount: 0 },
  jobs:             { title: 'Jobs',             emoji: '💼', icon: 'briefcase',      color: '#2563EB', description: 'Employment, apprenticeship & career opportunity schemes', schemeCount: 0 },
  business:         { title: 'Business',         emoji: '🏪', icon: 'building',       color: '#D97706', description: 'Loans, MSME support & entrepreneurship schemes', schemeCount: 0 },
  health:           { title: 'Health',           emoji: '🏥', icon: 'health',         color: '#DC2626', description: 'Health insurance, medical & wellness schemes', schemeCount: 0 },
  senior:           { title: 'Senior Citizens',  emoji: '👴', icon: 'users',          color: '#0D9488', description: 'Pension, healthcare & welfare for senior citizens', schemeCount: 0 },
  housing:          { title: 'Housing',          emoji: '🏠', icon: 'home',           color: '#475569', description: 'Affordable housing & home loan schemes', schemeCount: 0 },
  disability:       { title: 'Disability',       emoji: '♿', icon: 'accessibility',  color: '#9333EA', description: 'Schemes for persons with disabilities', schemeCount: 0 },
  startup:          { title: 'Startup',          emoji: '🚀', icon: 'rocket',         color: '#F59E0B', description: 'Startup funding, incubation & innovation support schemes', schemeCount: 0 },
  education:        { title: 'Education',        emoji: '📖', icon: 'book',           color: '#3B82F6', description: 'Educational scholarships, loans & skill training schemes', schemeCount: 0 },
  pension:          { title: 'Pension',          emoji: '💳', icon: 'credit-card',    color: '#0891B2', description: 'Pension & retirement benefit schemes', schemeCount: 0 },
  subsidy:          { title: 'Subsidy',          emoji: '💰', icon: 'coins',          color: '#84CC16', description: 'Financial subsidies & direct benefit transfer schemes', schemeCount: 0 },
  'skill-development': { title: 'Skill Development', emoji: '🔧', icon: 'wrench',    color: '#F97316', description: 'Skill training, apprenticeship & vocational course schemes', schemeCount: 0 },
};

async function uploadCategories() {
  console.log('='.repeat(50));
  console.log('📂 SchemeSetu — Category Upload Script');
  console.log('='.repeat(50));

  if (firebaseConfig.apiKey === 'YOUR_FIREBASE_API_KEY') {
    console.error('\n❌ ERROR: Firebase not configured!');
    console.error('  Set EXPO_PUBLIC_FIREBASE_* env vars or update firebaseConfig.\n');
    process.exit(1);
  }

  console.log('\n📡 Connecting to Firebase...');
  const app = initializeApp(firebaseConfig, 'schemesetu-categories');
  const db = getFirestore(app);
  console.log('✅ Connected to project:', firebaseConfig.projectId);

  // Count schemes per category from schemes.json
  console.log('\n📖 Reading schemes data...');
  const rawData = readFileSync(schemesPath, 'utf-8');
  const schemes = JSON.parse(rawData);
  console.log(`✅ Found ${schemes.length} schemes`);

  const counts = {};
  schemes.forEach(s => {
    const cats = s.categories || [s.category];
    cats.forEach(c => { counts[c] = (counts[c] || 0) + 1; });
  });

  console.log('\n📤 Uploading categories to Firestore...\n');
  let uploaded = 0;

  for (const [id, def] of Object.entries(CATEGORY_DEFS)) {
    try {
      const catRef = doc(db, 'categories', id);
      await setDoc(catRef, {
        ...def,
        id,
        schemeCount: counts[id] || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      console.log(`  ✅ ${def.title.padEnd(20)} → ${counts[id] || 0} schemes`);
      uploaded++;
    } catch (err) {
      console.error(`  ❌ ${def.title}: ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`🎉 ${uploaded} categories uploaded successfully!`);
  console.log('='.repeat(50));
  process.exit(0);
}

uploadCategories();
