import { createClient } from '@supabase/supabase-js';

// Check if we're on the client or server side
const isClient = typeof window !== 'undefined';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Database features will be disabled.');
}

// Create Supabase client for server-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: isClient,
    detectSessionInUrl: isClient,
  },
});

// Export types for TypeScript
export type { Database } from '@/types/database';
