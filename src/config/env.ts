const getEnvVar = (key: string): string => {
  const value = import.meta.env[key] as string | undefined;
  if (!value || value.startsWith('YOUR_')) {
    if (import.meta.env.DEV) {
      console.warn(`⚠️  ${key} is not set. Check your .env file.`);
    }
    return '';
  }
  return value;
};

export const config = {
  // ── OpenRouter AI ──────────────────────────────────────────
  openRouterApiKey: getEnvVar('EXPO_PUBLIC_OPENROUTER_API_KEY'),
  baseUrl: 'https://openrouter.ai/api/v1',

  // Primary model: openrouter/auto — automatically routes to best available model
  // Fallback models tried in order if primary fails
  model: 'openrouter/auto',
  fallbackModels: [
    'meta-llama/llama-3.1-8b-instruct:free',
    'google/gemini-2.0-flash-lite-preview-02-05:free',
    'microsoft/phi-3-mini-128k-instruct:free',
  ],

  maxTokens: 800,
  temperature: 0.6,
  timeout: 45000,

  // ── Firebase ───────────────────────────────────────────────
  firebase: {
    apiKey: getEnvVar('EXPO_PUBLIC_FIREBASE_API_KEY'),
    authDomain: getEnvVar('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnvVar('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
    storageBucket: getEnvVar('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVar('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVar('EXPO_PUBLIC_FIREBASE_APP_ID'),
    measurementId: getEnvVar('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID'),
  },
} as const;
