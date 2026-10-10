import { NextResponse } from 'next/server';
import { getOptionalPublicEnv } from '@/lib/env';

/**
 * Health check endpoint to verify that the Next.js server is operational
 * and environment configuration status.
 */
export async function GET() {
  const env = getOptionalPublicEnv();

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Adventure Passport API Foundation',
    environment: {
      supabase_configured: Boolean(env?.NEXT_PUBLIC_SUPABASE_URL && env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    },
    planned_endpoints: [
      { method: 'GET', path: '/api/activities', description: 'List published adventure sports & activities' },
      { method: 'GET', path: '/api/destinations', description: 'List published historic/mysterious destinations' },
      { method: 'POST', path: '/api/submissions', description: 'Submit adventure proof for verification' },
      { method: 'POST', path: '/api/admin/submissions/[id]/review', description: 'Admin approval/rejection endpoint' },
      { method: 'GET', path: '/api/leaderboard', description: 'Leaderboard aggregated rankings' },
      { method: 'GET', path: '/api/memoir', description: 'User personal memoir entries' },
      { method: 'GET', path: '/api/rewards', description: 'Catalog of active redeemable rewards' },
      { method: 'POST', path: '/api/rewards/[id]/redeem', description: 'Atomic reward redemption' },
    ],
  });
}
