import { NextRequest, NextResponse } from 'next/server';
import { getAllSubmissions } from '@/services/submissions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;

    const list = await getAllSubmissions(status);
    return NextResponse.json({ status: 'ok', data: list });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to list submissions' },
      { status: 500 }
    );
  }
}
