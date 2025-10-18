import { NextResponse } from 'next/server';
import { getMemberCountWithTimestamp } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getMemberCountWithTimestamp();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member count' },
      { status: 500 }
    );
  }
}

// Cache for 5 minutes
export const revalidate = 300;
