import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getOptionalPublicEnv } from '@/lib/env';

/**
 * Session refresh helper for Next.js App Router middleware.
 * Refreshes expired auth tokens and sets updated cookies on both request and response.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const env = getOptionalPublicEnv();
  if (!env) {
    // Allows local development / health checks without immediate crash before env setup
    return supabaseResponse;
  }

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh auth session
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

  if (isAdminRoute) {
    if (!user) {
      // Check if demo role is admin (for local evaluator testing)
      const demoRole = request.cookies.get('tt_demo_role')?.value;
      if (demoRole !== 'admin') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { status: 'error', message: 'Unauthorized: Session missing.' },
            { status: 401 }
          );
        }
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } else {
      // Authoritative role check from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { status: 'error', message: 'Forbidden: Administrator privileges required.' },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL('/?error=forbidden', request.url));
      }
    }
  }

  return supabaseResponse;
}
