import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

/**
 * Client-side Firebase Web configuration options retrieved from environment variables.
 * Used to establish client-side connections to Firebase services.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

/**
 * Boolean flag indicating if the client-side Firebase configuration environment variables
 * are fully provided. Used to determine if fallback mocks should be used during static builds.
 */
const isConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.appId
);

if (typeof window !== 'undefined') {
  console.info('Firebase Client Config status:', isConfigured ? 'Configured' : 'Missing (using mock fallback)');
}

/**
 * The initialized client-side Firebase App instance.
 * Defaults to a mock configuration during static site pre-rendering or builds
 * if environment keys are missing, preventing pre-render runtime crashes.
 */
const app = getApps().length === 0 
  ? initializeApp(
      isConfigured 
        ? firebaseConfig 
        : {
            apiKey: 'mock-api-key-for-build-prerendering-purposes',
            authDomain: 'mock-project-id.firebaseapp.com',
            projectId: 'mock-project-id',
            storageBucket: 'mock-project-id.firebasestorage.app',
            messagingSenderId: '000000000000',
            appId: '1:000000000000:web:0000000000000000000000',
          }
    ) 
  : getApp();

/**
 * The client-side Firebase Authentication service instance.
 */
const auth = getAuth(app);

/**
 * The client-side Firebase Storage service instance.
 */
const storage = getStorage(app);

export { app, auth, storage, isConfigured };
