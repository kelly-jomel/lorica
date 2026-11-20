import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Lorica Firebase configuration
// Values can be provided via Vite environment variables or fallback defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyLoricaMockKeyForLocalAndDemoUsage',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'lorica-prayer-app.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'lorica-prayer-app',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'lorica-prayer-app.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '669995171000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:669995171000:web:loricawebapp2026'
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
