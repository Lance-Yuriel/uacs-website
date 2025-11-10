import { NextRequest, NextResponse } from 'next/server';
import { createClientFromRequest } from '@/lib/supabase-server';

// POST /api/executives/reorder - Update display order of executives
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClientFromRequest(request);
    
    // Check if user is authenticated (admin)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { order } = body; // Array of { id, display_order }

    if (!Array.isArray(order)) {
      return NextResponse.json(
        { error: 'Invalid request: order must be an array' },
        { status: 400 }
      );
    }

    // Update each executive's display_order
    const updatePromises = order.map(({ id, display_order }: { id: string; display_order: number }) =>
      supabase
        .from('executives')
        .update({ display_order })
        .eq('id', id)
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

