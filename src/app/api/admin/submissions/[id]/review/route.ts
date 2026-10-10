import { NextRequest, NextResponse } from 'next/server';
import { reviewSubmission } from '@/services/submissions';
import { submissionReviewSchema } from '@/validation/schemas';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const params = await segmentData.params;
    const submissionId = params.id;
    const body = await request.json();

    const parsed = submissionReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: 'error', errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: authUser } = await supabase.auth.getUser();
    const reviewerId = authUser.user?.id || 'admin-01';

    const result = await reviewSubmission(
      submissionId,
      reviewerId,
      parsed.data.status,
      parsed.data.review_notes || undefined
    );

    if (!result.success) {
      return NextResponse.json(
        { status: 'error', message: result.error || 'Review failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      message: `Submission marked as ${parsed.data.status}. Points awarded if approved.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Review action failed' },
      { status: 500 }
    );
  }
}
