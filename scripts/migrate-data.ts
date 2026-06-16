/**
 * Migration script to populate Supabase database with existing data
 * Run this script after setting up your Supabase project
 * 
 * Usage: npx tsx scripts/migrate-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import eventsData from '../src/data/events.json';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
  console.error('Please make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateEvents() {
  console.log('📅 Migrating events data...');
  
  // First, delete all existing events to avoid duplicates
  console.log('🗑️  Clearing existing events...');
  const { error: deleteError } = await supabase
    .from('events')
    .delete()
    .not('id', 'is', null); // Delete all rows
  
  if (deleteError) {
    console.error('⚠️  Warning: Could not clear existing events:', deleteError);
    console.log('Continuing with migration (you may have duplicates)...');
  } else {
    console.log('✅ Cleared existing events');
  }
  
  // Parse date strings to proper DATE format
  const events = eventsData.events.map((event) => {
    // Convert date like "Mon 29th Oct" to a proper date
    let dateStr = event.date;
    let parsedDate: string;
    
    // Parse date format like "Mon 29th Oct" or "Tue 14th Oct"
    try {
      if (dateStr.includes('Oct')) {
        // Extract day number from strings like "29th" or "6th" or "14th"
        const dayMatch = dateStr.match(/(\d+)(?:st|nd|rd|th)/);
        const day = dayMatch ? dayMatch[1].padStart(2, '0') : '01';
        parsedDate = `${event.year || 2025}-10-${day}`;
      } else if (dateStr.includes('[TO BE PROVIDED]') || dateStr === '[TO BE PROVIDED]') {
        // Use a placeholder date for events that aren't scheduled yet
        parsedDate = new Date().toISOString().split('T')[0];
      } else {
        // Try to parse as-is or use current date as fallback
        parsedDate = new Date().toISOString().split('T')[0];
      }
    } catch {
      parsedDate = new Date().toISOString().split('T')[0];
    }

    // Determine status based on date
    const eventDate = new Date(parsedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    const status = eventDate >= today ? 'upcoming' : 'past';

    return {
      id: event.id,
      event_name: event.title,
      date: parsedDate,
      time: null,
      location: null,
      description: event.description || null,
      google_drive_link: event.googleDriveLink || null,
      status: status,
    };
  });

  const { error } = await supabase.from('events').insert(events);

  if (error) {
    console.error('❌ Error migrating events:', error);
    return false;
  }

  console.log(`✅ Successfully migrated ${events.length} events`);
  return true;
}

async function main() {
  console.log('🚀 Starting database migration...\n');

  const eventsSuccess = await migrateEvents();

  console.log('\n📋 Migration Summary:');
  console.log(`Events: ${eventsSuccess ? '✅' : '❌'}`);

  if (eventsSuccess) {
    console.log('\n🎉 Migration completed successfully!');
  } else {
    console.log('\n⚠️  Migration completed with errors. Please check the logs above.');
  }
}

main().catch(console.error);
