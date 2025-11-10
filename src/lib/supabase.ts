import { createBrowserClient } from '@supabase/ssr';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Database features will be disabled.');
}

// Create Supabase client for client-side usage with SSR cookie support
// This ensures cookies are set properly for API routes to read them
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);

// Export types for TypeScript
export type { Database } from '@/types/database';
