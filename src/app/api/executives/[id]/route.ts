import { NextRequest, NextResponse } from 'next/server';
import { createClientFromRequest } from '@/lib/supabase-server';

// GET /api/executives/[id] - Get a single executive
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClientFromRequest(request);
    const { id } = await params;

    const { data, error } = await supabase
      .from('executives')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return NextResponse.json(
          { error: 'Executive not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching executive:', error);
      return NextResponse.json(
        { error: 'Failed to fetch executive' },
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

// PUT /api/executives/[id] - Update an executive (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Debug: Log all cookies
    const allCookies = request.cookies.getAll();
    console.log('All cookies:', allCookies.map(c => c.name));
    
    const supabase = await createClientFromRequest(request);
    const { id } = await params;
    
    // Check if user is authenticated (admin)
    // Use getUser() instead of getSession() for better cookie handling
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('Auth check - user:', user?.email || 'none', 'error:', authError?.message || 'none');
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required', details: authError?.message || 'No user found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
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
    if (!name || !position) {
      return NextResponse.json(
        { error: 'Missing required fields: name, position' },
        { status: 400 }
      );
    }

    // Validate name length
    if (typeof name === 'string' && name.trim().length > 32) {
      const approxWords = Math.max(1, Math.floor(name.trim().length / 6.5));
      return NextResponse.json(
        { error: `Name must be 32 characters or fewer (currently ${name.trim().length}, approx ${approxWords} words)` },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (position !== undefined) updateData.position = position;
    if (title !== undefined) updateData.title = title;
    if (is_co_founder !== undefined) updateData.is_co_founder = is_co_founder;
    if (bio !== undefined) updateData.bio = bio;
    if (image !== undefined) updateData.image = image;
    if (responsibilities !== undefined) updateData.responsibilities = responsibilities;
    if (joined_year !== undefined) updateData.joined_year = joined_year;
    if (email !== undefined) updateData.email = email;
    if (instagram !== undefined) updateData.instagram = instagram;
    if (introduction !== undefined) updateData.introduction = introduction;
    if (degree !== undefined) updateData.degree = degree;
    if (favourite_skills !== undefined) updateData.favourite_skills = favourite_skills;

    const { data, error } = await supabase
      .from('executives')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Executive not found' },
          { status: 404 }
        );
      }
      console.error('Error updating executive:', error);
      return NextResponse.json(
        { error: 'Failed to update executive', details: error.message },
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

// DELETE /api/executives/[id] - Delete an executive (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClientFromRequest(request);
    const { id } = await params;
    
    // Check if user is authenticated (admin)
    // Use getUser() instead of getSession() for better cookie handling
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('executives')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting executive:', error);
      return NextResponse.json(
        { error: 'Failed to delete executive', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Executive deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

