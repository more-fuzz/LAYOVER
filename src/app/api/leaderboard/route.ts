import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard } from '@/services/leaderboard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '25', 10);

    const rankings = await getLeaderboard(limit);
    return NextResponse.json({
      status: 'ok',
      total: rankings.length,
      data: rankings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
