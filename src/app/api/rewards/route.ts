import { NextRequest, NextResponse } from 'next/server';
import { getActiveRewards, getUserRedemptions } from '@/services/rewards';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const viewMy = searchParams.get('mine') === 'true';

    if (viewMy) {
      const supabase = await createClient();
      const { data: authUser } = await supabase.auth.getUser();
      const userId = authUser.user?.id || 'u6';
      const redemptions = await getUserRedemptions(userId);
      return NextResponse.json({ status: 'ok', data: redemptions });
    }

    const rewards = await getActiveRewards();
    return NextResponse.json({
      status: 'ok',
      total: rewards.length,
      data: rewards,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch rewards' },
      { status: 500 }
    );
  }
}
