import { NextRequest, NextResponse } from 'next/server';
import { getPublishedDestinations } from '@/services/destinations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const spookyOnly = searchParams.get('spooky') === 'true';

    const destinations = await getPublishedDestinations({ category, search, spookyOnly });

    return NextResponse.json({
      status: 'ok',
      total: destinations.length,
      data: destinations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}
