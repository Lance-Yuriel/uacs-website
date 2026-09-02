import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Fallback to Google Service Account variables if Firebase-specific ones are not explicitly defined
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'uacs-website';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY;

if (getApps().length === 0) {
  try {
    if (clientEmail && privateKey) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      console.info('Firebase Admin SDK initialized successfully with service account cert.');
    } else {
      // Fallback to default application credentials or system environment config
      initializeApp({
        projectId,
      });
      console.info('Firebase Admin SDK initialized with project ID fallback.');
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
  }
}

/**
 * Firebase Firestore database administrative instance.
 * Running exclusively on the server side via the Admin SDK, this instance
 * bypasses all database Firestore Security Rules.
 */
export const adminDb = getFirestore();

/**
 * Firebase Authentication administrative service instance.
 * Used to verify ID tokens (JWTs) and manage users on the server side.
 */
export const adminAuth = getAuth();

/**
 * Firebase Storage administrative service instance.
 * Used for bucket operations and server-side file management.
 */
export const adminStorage = getStorage();
