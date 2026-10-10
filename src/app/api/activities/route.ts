import { NextRequest, NextResponse } from 'next/server';
import { getPublishedActivities } from '@/services/activities';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const difficultyStr = searchParams.get('difficulty');
    const difficulty = difficultyStr ? parseInt(difficultyStr, 10) : undefined;
    const search = searchParams.get('search') || undefined;

    const activities = await getPublishedActivities({ category, difficulty, search });

    return NextResponse.json({
      status: 'ok',
      total: activities.length,
      data: activities,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
