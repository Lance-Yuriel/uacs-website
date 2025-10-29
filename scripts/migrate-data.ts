/**
 * Migration script to populate Supabase database with existing data
 * Run this script after setting up your Supabase project
 * 
 * Usage: npx tsx scripts/migrate-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import executivesData from '../src/data/executives.json';
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

async function migrateExecutives() {
  console.log('📊 Migrating executives data...');
  
  const executives = executivesData.executives.map((exec) => ({
    name: exec.name,
    position: exec.position,
    title: exec.foundingPosition || null,
    photo_url: exec.image || null,
    short_bio: exec.bio || null,
    introduction: null, // Will be added via admin interface later
    degree: null, // Will be added via admin interface later
    favourite_skills: null, // Will be added via admin interface later
    email: exec.email || null,
    instagram: exec.instagram || null,
  }));

  const { data, error } = await supabase
    .from('executives')
    .insert(executives);

  if (error) {
    console.error('❌ Error migrating executives:', error);
    return false;
  }

  console.log(`✅ Successfully migrated ${executives.length} executives`);
  return true;
}

async function migrateEvents() {
  console.log('📅 Migrating events data...');
  
  // Parse date strings to proper DATE format
  const events = eventsData.events.map((event) => {
    // Convert date like "Mon 29th Oct" to a proper date
    // For now, we'll use the current year and the month/day
    let dateStr = event.date;
    
    // If it's a simple date format, try to parse it
    // Otherwise, use a placeholder date
    let parsedDate: string;
    
    try {
      // Try to parse different date formats
      if (dateStr.includes('Oct')) {
        parsedDate = '2025-10-29'; // Placeholder - you may need to adjust
      } else {
        parsedDate = new Date().toISOString().split('T')[0];
      }
    } catch {
      parsedDate = new Date().toISOString().split('T')[0];
    }

    return {
      event_name: event.title,
      date: parsedDate,
      time: null,
      location: null,
      description: event.description || null,
      google_drive_link: event.googleDriveLink || null,
      status: 'past', // Assume past events for now
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

  const executivesSuccess = await migrateExecutives();
  console.log();
  const eventsSuccess = await migrateEvents();

  console.log('\n📋 Migration Summary:');
  console.log(`Executives: ${executivesSuccess ? '✅' : '❌'}`);
  console.log(`Events: ${eventsSuccess ? '✅' : '❌'}`);

  if (executivesSuccess && eventsSuccess) {
    console.log('\n🎉 Migration completed successfully!');
  } else {
    console.log('\n⚠️  Migration completed with errors. Please check the logs above.');
  }
}

main().catch(console.error);
