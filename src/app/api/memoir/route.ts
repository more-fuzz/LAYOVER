import { NextRequest, NextResponse } from 'next/server';
import { getUserMemoir } from '@/services/memoir';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: authUser } = await supabase.auth.getUser();
    const userId = authUser.user?.id || 'u6';

    const memoir = await getUserMemoir(userId);
    return NextResponse.json({
      status: 'ok',
      data: memoir,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch memoir' },
      { status: 500 }
    );
  }
}
