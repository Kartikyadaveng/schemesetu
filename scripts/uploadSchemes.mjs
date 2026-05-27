// ============================================================
// SchemeSetu - Firestore Schemes Upload Script
// 
// This script uploads all schemes from schemes.json to Firestore.
// Run it ONCE after setting up Firebase.
// 
// Usage:
//   node scripts/uploadSchemes.mjs
//
// Prerequisites:
//   1. Set up Firebase project (https://console.firebase.google.com)
//   2. Enable Firestore Database
//   3. Set EXPO_PUBLIC_FIREBASE_* env vars OR update firebaseConfig below
//   4. npm install firebase
// ============================================================

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  writeBatch,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';

// ── Resolve paths ────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const schemesPath = join(__dirname, '..', 'src', 'data', 'schemes.json');

// ── Firebase Config ──────────────────────────────────────────────────────────
// 🔥 IMPORTANT: Replace these with your actual Firebase project config
// Or set the EXPO_PUBLIC_FIREBASE_* environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'YOUR_FIREBASE_API_KEY',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef123456',
};

// ── Stats counters ───────────────────────────────────────────────────────────
let added = 0;
let updated = 0;
let skipped = 0;
let errors = 0;

// ── Main upload function ─────────────────────────────────────────────────────
async function uploadSchemes() {
  console.log('='.repeat(50));
  console.log('🔥 SchemeSetu — Firestore Upload Script');
  console.log('='.repeat(50));

  // Validate config
  if (firebaseConfig.apiKey === 'YOUR_FIREBASE_API_KEY') {
    console.error('\n❌ ERROR: Firebase not configured!');
    console.error('  1. Go to https://console.firebase.google.com');
    console.error('  2. Create a project and enable Firestore');
    console.error('  3. Set env vars or update firebaseConfig in this script');
    console.error('\n  Example:');
    console.error('  $env:EXPO_PUBLIC_FIREBASE_API_KEY="your-key"');
    console.error('  $env:EXPO_PUBLIC_FIREBASE_PROJECT_ID="your-project"');
    console.error('  node scripts/uploadSchemes.mjs\n');
    process.exit(1);
  }

  // Initialize Firebase
  console.log('\n📡 Connecting to Firebase...');
  const app = initializeApp(firebaseConfig, 'schemesetu-upload');
  const db = getFirestore(app);
  console.log('✅ Connected to project:', firebaseConfig.projectId);

  // Read schemes data
  console.log('\n📖 Reading schemes data...');
  const rawData = readFileSync(schemesPath, 'utf-8');
  const schemes = JSON.parse(rawData);
  console.log(`✅ Found ${schemes.length} schemes in schemes.json`);

  // Upload each scheme
  console.log('\n📤 Uploading schemes to Firestore...\n');
  const schemesCollection = collection(db, 'schemes');

  for (let i = 0; i < schemes.length; i++) {
    const scheme = schemes[i];
    const schemeId = scheme.id;
    const schemeRef = doc(schemesCollection, schemeId);

    try {
      const existingDoc = await getDoc(schemeRef);
      const exists = existingDoc.exists();

      const data = {
        ...scheme,
        createdAt: exists ? existingDoc.data()?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(schemeRef, data);
      if (exists) {
        console.log(`  🔄 [${i + 1}/${schemes.length}] UPDATED: ${scheme.name}`);
        updated++;
      } else {
        console.log(`  ✅ [${i + 1}/${schemes.length}] ADDED: ${scheme.name}`);
        added++;
      }
    } catch (err) {
      console.error(`  ❌ [${i + 1}/${schemes.length}] ERROR: ${scheme.name} —`, err.message);
      errors++;
    }
  }

  // ── Update stats ──────────────────────────────────────────────────────
  console.log('\n📊 Updating stats...');
  try {
    const statsRef = doc(db, 'stats', 'overview');

    // Count schemes by categories (multi-category)
    const categoryMap = {};
    schemes.forEach(s => {
      const cats = s.categories || [s.category];
      cats.forEach(c => {
        categoryMap[c] = (categoryMap[c] || 0) + 1;
      });
    });

    // Count featured/popular
    const newCount = schemes.filter(s => s.isNew).length;
    const popularCount = schemes.filter(s => s.isPopular).length;

    // Update stats document
    await setDoc(statsRef, {
      totalSchemes: schemes.length,
      totalCategories: Object.keys(categoryMap).length,
      categories: categoryMap,
      newSchemes: newCount,
      popularSchemes: popularCount,
      lastUpdated: new Date().toISOString(),
    }, { merge: true });

    console.log('✅ Stats updated successfully');
    console.log(`  • Total schemes: ${schemes.length}`);
    console.log(`  • Categories: ${Object.keys(categoryMap).length}`);
    console.log(`  • New: ${newCount}, Popular: ${popularCount}`);
  } catch (err) {
    console.error('❌ Failed to update stats:', err.message);
  }

  // ── Summary ───────────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(50));
  console.log('📋 UPLOAD SUMMARY');
  console.log('='.repeat(50));
  console.log(`  ✅ Added:   ${added}`);
  console.log(`  🔄 Updated: ${updated}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  console.log(`  ❌ Errors:  ${errors}`);
  console.log(`  📁 Total:   ${schemes.length}`);
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Upload complete!');
  console.log('💡 Run: node scripts/uploadSchemes.mjs');
  console.log('='.repeat(50));

  process.exit(0);
}

uploadSchemes();
