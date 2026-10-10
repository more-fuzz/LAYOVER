import { NextRequest, NextResponse } from 'next/server';
import { createSubmission, getUserSubmissions } from '@/services/submissions';
import { createClient } from '@/lib/supabase/server';
import { submissionCreateSchema } from '@/validation/schemas';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: authUser } = await supabase.auth.getUser();
    const userId = authUser.user?.id || 'u6';

    const submissions = await getUserSubmissions(userId);
    return NextResponse.json({ status: 'ok', data: submissions });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = submissionCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: 'error', errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: authUser } = await supabase.auth.getUser();
    const userId = authUser.user?.id || body.user_id || 'u6';
    const userDisplayName = authUser.user?.user_metadata?.display_name || body.user_display_name || 'Traveler';

    const result = await createSubmission({
      userId,
      userDisplayName,
      activityId: parsed.data.activity_id,
      evidencePath: parsed.data.evidence_path,
      claimedLatitude: parsed.data.claimed_latitude,
      claimedLongitude: parsed.data.claimed_longitude,
    });

    return NextResponse.json({
      status: 'ok',
      message: 'Evidence submission registered and awaiting reviewer verification',
      submission_id: result.id,
      submission_status: result.status,
      is_demo: result.is_demo,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to process submission' },
      { status: 500 }
    );
  }
}
