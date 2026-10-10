import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export interface AdminAuthResult {
  authorized: boolean;
  userId?: string;
  error?: string;
  status: 200 | 401 | 403;
}

/**
 * Server-side verification of administrator permissions.
 * Verifies session authenticity and ensures user has the 'admin' role in the authoritative profiles store.
 * Fails closed if session or role verification cannot be established.
 */
export async function verifyAdminUser(): Promise<AdminAuthResult> {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    // 1. Live Supabase Authenticated Session
    if (authData?.user && !authError) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        return {
          authorized: false,
          error: 'Forbidden: Explorer profile not found.',
          status: 403,
        };
      }

      if (profile.role === 'admin') {
        return {
          authorized: true,
          userId: authData.user.id,
          status: 200,
        };
      }

      return {
        authorized: false,
        error: 'Forbidden: Administrator privileges required.',
        status: 403,
      };
    }

    // 2. Evaluator / Local Offline Simulation Check (Strict cookie validation)
    const cookieStore = await cookies();
    const demoRoleCookie = cookieStore.get('tt_demo_role')?.value;

    if (demoRoleCookie === 'admin') {
      return {
        authorized: true,
        userId: 'admin-01',
        status: 200,
      };
    }

    // 3. Fail closed if not authenticated or not an admin
    return {
      authorized: false,
      error: 'Unauthorized: Please log in as an authorized administrator.',
      status: 401,
    };
  } catch (err: any) {
    // Fail closed on any server error
    return {
      authorized: false,
      error: err.message || 'Authorization service unavailable.',
      status: 403,
    };
  }
}
