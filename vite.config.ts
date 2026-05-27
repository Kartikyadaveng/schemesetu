import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Load env from .env files (local dev) with fallback to process.env (Vercel)
  const env = loadEnv(mode, process.cwd(), '');

  const getEnv = (key: string): string => {
    return env[key] || process.env[key] || '';
  };

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    define: {
      'import.meta.env.EXPO_PUBLIC_OPENROUTER_API_KEY': JSON.stringify(getEnv('EXPO_PUBLIC_OPENROUTER_API_KEY')),
      'import.meta.env.EXPO_PUBLIC_FIREBASE_API_KEY': JSON.stringify(getEnv('EXPO_PUBLIC_FIREBASE_API_KEY')),
      'import.meta.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN': JSON.stringify(getEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN')),
      'import.meta.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID': JSON.stringify(getEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID')),
      'import.meta.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET': JSON.stringify(getEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET')),
      'import.meta.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(getEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID')),
      'import.meta.env.EXPO_PUBLIC_FIREBASE_APP_ID': JSON.stringify(getEnv('EXPO_PUBLIC_FIREBASE_APP_ID')),
      'import.meta.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID': JSON.stringify(getEnv('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID')),
    },
    build: {
      // Generate sourcemap for production debugging (optional)
      sourcemap: false,
      // Chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            ai: ['openai'],
          },
        },
      },
    },
  };
});
