import { NextResponse } from 'next/server';
import { getMemberCountWithTimestamp } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getMemberCountWithTimestamp();
    
    // Add CORS headers for better compatibility
    const response = NextResponse.json(data);
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    response.headers.set('Access-Control-Allow-Origin', '*');
    
    return response;
  } catch (error) {
    console.error('API Error:', error);
    
    // Return a fallback response instead of error
    const fallbackData = {
      count: 0,
      lastUpdated: new Date().toISOString(),
      error: 'Unable to fetch member count'
    };
    
    return NextResponse.json(fallbackData, { status: 200 });
  }
}

// Cache for 5 minutes, but allow stale data for up to 10 minutes
export const revalidate = 300;
