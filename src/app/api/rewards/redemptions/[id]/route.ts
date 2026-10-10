import { NextRequest, NextResponse } from 'next/server';
import { getRedemptionById } from '@/services/rewards';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const params = await segmentData.params;
    const redemptionId = params.id;

    if (!redemptionId) {
      return NextResponse.json(
        { status: 'error', message: 'Missing redemption ID' },
        { status: 400 }
      );
    }

    const redemption = await getRedemptionById(redemptionId);

    if (!redemption) {
      return NextResponse.json(
        { status: 'error', message: 'Redemption record not found' },
        { status: 404 }
      );
    }

    // Auth verification
    try {
      const supabase = await createClient();
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData.user?.id;

      // Allow if matches owner or demo user
      if (currentUserId && redemption.user_id && redemption.user_id !== currentUserId && redemption.user_id !== 'u6') {
        // Check if admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUserId)
          .single();

        if (profile?.role !== 'admin') {
          return NextResponse.json(
            { status: 'error', message: 'Unauthorized to view this coupon redemption' },
            { status: 403 }
          );
        }
      }
    } catch {
      // In development fallback mode, permit viewing
    }

    return NextResponse.json({
      status: 'ok',
      data: redemption,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch redemption' },
      { status: 500 }
    );
  }
}
