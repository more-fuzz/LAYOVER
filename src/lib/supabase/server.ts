import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';
import { getPublicEnv } from '@/lib/env';

/**
 * Creates a public, cookie-free client safe for static page prerendering.
 */
export function createPublicClient() {
  const env = getPublicEnv();
  return createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

/**
 * Creates an isolated, cookie-aware Supabase client for server execution.
 * Suitable for Server Components, Server Actions, and Route Handlers.
 *
 * Notice: A new client is instantiated per request context to ensure no user session
 * leak occurs across different concurrent requests.
 * Service-role secrets are never used for general user requests.
 */
export async function createClient() {
  const env = getPublicEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // In Next.js App Router, cookies can only be mutated in Server Actions or Route Handlers.
            // Session refresh for Server Components is handled by middleware.
          }
        },
      },
    }
  );
}
