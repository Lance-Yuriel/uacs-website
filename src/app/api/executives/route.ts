import { NextRequest, NextResponse } from 'next/server';
import { createClientFromRequest } from '@/lib/supabase-server';

// GET /api/executives - Get all executives
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClientFromRequest(request);
    
    const { data, error } = await supabase
      .from('executives')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true }); // Secondary sort by name

    if (error) {
      console.error('Error fetching executives:', error);
      return NextResponse.json(
        { error: 'Failed to fetch executives' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/executives - Create a new executive (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClientFromRequest(request);
    
    // Check if user is authenticated (admin)
    // Use getUser() instead of getSession() for better cookie handling
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      id,
      name,
      position,
      title,
      is_co_founder,
      bio,
      image,
      responsibilities,
      joined_year,
      email,
      instagram,
      introduction,
      degree,
      favourite_skills,
    } = body;

    // Validate required fields
    if (!id || !name || !position) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, position' },
        { status: 400 }
      );
    }

    // Get max display_order to append new executive at the end
    const { data: maxOrderData } = await supabase
      .from('executives')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .single();

    const newDisplayOrder = (maxOrderData?.display_order ?? -1) + 1;

    const { data, error } = await supabase
      .from('executives')
      .insert({
        id,
        name,
        position,
        title: title || null,
        is_co_founder: is_co_founder ?? false,
        bio: bio || null,
        image: image || null,
        responsibilities: responsibilities || null,
        joined_year: joined_year || null,
        email: email || null,
        instagram: instagram || null,
        introduction: introduction || null,
        degree: degree || null,
        favourite_skills: favourite_skills || null,
        display_order: newDisplayOrder,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating executive:', error);
      return NextResponse.json(
        { error: 'Failed to create executive', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

