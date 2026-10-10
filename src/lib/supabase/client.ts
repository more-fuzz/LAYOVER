import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';
import { getPublicEnv } from '@/lib/env';

/**
 * Creates a browser-side Supabase client using @supabase/ssr.
 * Safe for use in React Client Components ('use client').
 * Relies only on public environment variables.
 */
export function createClient() {
  const env = getPublicEnv();
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
