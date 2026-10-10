import { NextRequest, NextResponse } from 'next/server';
import { redeemReward } from '@/services/rewards';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const params = await segmentData.params;
    const rewardId = params.id;

    const supabase = await createClient();
    const { data: authUser } = await supabase.auth.getUser();
    const userId = authUser.user?.id || 'u6';

    const result = await redeemReward(userId, rewardId);

    if (!result.success) {
      return NextResponse.json(
        { status: 'error', message: result.error || 'Redemption failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Reward redeemed successfully! Your claim voucher code is ready.',
      claim_code: result.claim_code,
      redemption_id: result.redemption_id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Reward redemption failed' },
      { status: 500 }
    );
  }
}
