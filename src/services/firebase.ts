// ============================================================
// SchemeSetu - Firebase Service
// Initializes Firebase App, Auth, Firestore, and Storage
// ============================================================

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  getRedirectResult,
  type Auth,
  type User as FirebaseUser,
  type UserCredential,
} from 'firebase/auth';
import {
  getFirestore,
  enableIndexedDbPersistence,
  type Firestore,
} from 'firebase/firestore';
import {
  getStorage,
  type FirebaseStorage,
} from 'firebase/storage';
import { config } from '../config/env';

// ── Firebase Config ──────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId,
  measurementId: config.firebase.measurementId,
};

// ── Initialize Firebase ──────────────────────────────────────────────────────

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

export function initFirebase(): boolean {
  // Skip if already initialized
  if (app) return true;

  // Validate config
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('YOUR_')) {
    console.warn(
      '⚠️ Firebase is not configured.\n' +
      '📝 Set up Firebase:\n' +
      '1. Go to https://console.firebase.google.com\n' +
      '2. Create a project\n' +
      '3. Add a web app\n' +
      '4. Copy config values to your .env file\n' +
      '5. Restart the dev server'
    );
    return false;
  }

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn('Auth persistence setup failed:', err);
    });
    db = getFirestore(app);
    storage = getStorage(app);
    analytics = getAnalytics(app);

    // Enable offline persistence for Firestore
    if (db) {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Firestore persistence: multiple tabs open');
        } else if (err.code === 'unimplemented') {
          console.warn('Firestore persistence not supported');
        }
      });
    }

    console.log('✅ Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    return false;
  }
}

// ── Getters ──────────────────────────────────────────────────────────────────

export function getApp(): FirebaseApp {
  if (!app) throw new Error('Firebase not initialized. Call initFirebase() first.');
  return app;
}

export function getAuthInstance(): Auth {
  if (!auth) throw new Error('Firebase not initialized.');
  return auth;
}

export function getDbInstance(): Firestore {
  if (!db) throw new Error('Firebase not initialized.');
  return db;
}

export function getStorageInstance(): FirebaseStorage {
  if (!storage) throw new Error('Firebase not initialized.');
  return storage;
}

export function getAnalyticsInstance(): Analytics {
  if (!analytics) throw new Error('Firebase not initialized.');
  return analytics;
}

// ── Auth State Listener ──────────────────────────────────────────────────────
// Returns an unsubscribe function. Call it when the component unmounts.

export function onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
  const a = getAuthInstance();
  return a.onAuthStateChanged(callback);
}

// ── Wait for initial auth state resolution ───────────────────────────────────
// Resolves once Firebase has completed its initial session restore check.
// Use this to prevent "flash of login screen" when a user is already signed in.

export async function waitForAuthReady(): Promise<void> {
  const a = getAuthInstance();
  await a.authStateReady();
}

// ── Check if Firebase is ready ───────────────────────────────────────────────

export function isFirebaseReady(): boolean {
  return app !== null && !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('YOUR_');
}

// ── Redirect Result Handler ───────────────────────────────────────────────────
// Processes pending sign-in redirect results (used on mobile). Safe to call on
// every app mount — resolves to null if no redirect is pending.

export async function handleRedirectResult(): Promise<UserCredential | null> {
  const a = getAuthInstance();
  try {
    return await getRedirectResult(a);
  } catch {
    return null;
  }
}

// Export types
export type { FirebaseUser };
