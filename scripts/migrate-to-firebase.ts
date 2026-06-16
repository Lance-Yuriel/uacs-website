/**
 * Migration script to populate Firestore database with existing event data.
 * Run this script after setting up your Firebase project.
 * 
 * Usage: npx tsx scripts/migrate-to-firebase.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import eventsData from '../src/data/events.json';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

// Load environment variables
dotenv.config({ path: '.env.local' });

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'uacs-website';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY;

if (!clientEmail || !privateKey) {
  console.error('❌ Error: Firebase / Google service account credentials not found in .env.local');
  console.error('Please make sure GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY (or FIREBASE_ equivalents) are set');
  process.exit(1);
}

// Initialize Admin SDK
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

// Helper to determine event status based on date
function determineEventStatus(dateStr: string): 'upcoming' | 'past' {
  const eventDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  return eventDate >= today ? 'upcoming' : 'past';
}

async function migrateEvents() {
  console.log('📅 Migrating events data to Firestore...');
  const eventsCollection = db.collection('events');

  // Clear existing events to avoid duplicates
  console.log('🗑️  Clearing existing events from Firestore...');
  const snapshot = await eventsCollection.get();
  const batchDelete = db.batch();
  snapshot.forEach((doc) => {
    batchDelete.delete(doc.ref);
  });
  await batchDelete.commit();
  console.log('✅ Cleared existing events');

  // Convert and migrate JSON events
  const batchWrite = db.batch();
  
  const events = eventsData.events.map((event) => {
    // Parse custom date string format from json, e.g. "Mon 29th Oct"
    const dateStr = event.date;
    let parsedDate: string;

    try {
      if (dateStr.includes('Oct')) {
        const dayMatch = dateStr.match(/(\d+)(?:st|nd|rd|th)/);
        const day = dayMatch ? dayMatch[1].padStart(2, '0') : '01';
        parsedDate = `${event.year || 2025}-10-${day}`;
      } else if (dateStr.includes('[TO BE PROVIDED]') || dateStr === '[TO BE PROVIDED]') {
        parsedDate = new Date().toISOString().split('T')[0];
      } else {
        parsedDate = new Date().toISOString().split('T')[0];
      }
    } catch {
      parsedDate = new Date().toISOString().split('T')[0];
    }

    const status = determineEventStatus(parsedDate);
    const id = event.id || `event-${randomUUID()}`;
    const timestamp = new Date().toISOString();

    return {
      id,
      eventName: event.title === '[TO BE PROVIDED]' ? 'Placeholder Event' : event.title,
      date: parsedDate,
      time: null,
      location: null,
      description: event.description === '[TO BE PROVIDED]' ? null : (event.description || null),
      upcomingDescription: null,
      eventPhotoUrl: null,
      googleDriveLink: event.googleDriveLink || null,
      registrationLink: null,
      status,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });

  for (const event of events) {
    const docRef = eventsCollection.doc(event.id);
    batchWrite.set(docRef, event);
  }

  await batchWrite.commit();
  console.log(`✅ Successfully migrated ${events.length} events to Firestore`);
  return true;
}

async function main() {
  console.log('🚀 Starting Firebase database migration...\n');
  const success = await migrateEvents();
  if (success) {
    console.log('\n🎉 Migration completed successfully!');
  } else {
    console.log('\n⚠️ Migration failed.');
  }
}

main().catch((err) => {
  console.error('❌ Migration error:', err);
  process.exit(1);
});
