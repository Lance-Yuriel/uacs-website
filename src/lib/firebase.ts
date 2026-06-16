import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Check if actual configuration is provided
const isConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.appId
);

if (!isConfigured && typeof window !== 'undefined') {
  console.warn(
    'Firebase environment variables are missing. Database, Auth, and Storage features will run in mock mode.'
  );
}

// Initialize Firebase with mock configuration fallback if actual keys are not defined yet
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

const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage, isConfigured };
