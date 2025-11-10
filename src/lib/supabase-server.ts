import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// Create Supabase client from NextRequest (for API routes)
export async function createClientFromRequest(request: NextRequest) {
  // Use Next.js cookies() function - middleware should have refreshed the session
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // First try request cookies (if middleware didn't update cookieStore)
          const requestCookie = request.cookies.get(name);
          if (requestCookie) {
            return requestCookie.value;
          }
          // Then try cookieStore (set by middleware)
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Middleware handles setting cookies
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignore - middleware handles this
          }
        },
        remove(name: string, options: CookieOptions) {
          // Middleware handles removing cookies
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Ignore - middleware handles this
          }
        },
      },
    }
  );
}
