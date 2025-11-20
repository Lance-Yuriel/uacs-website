import { NextRequest, NextResponse } from 'next/server';
import { createClientFromRequest } from '@/lib/supabase-server';
import { determineEventStatus } from '@/lib/events';
import { mapRowToMetaEvent, validateEventPayload } from '../route';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClientFromRequest(request);
    const { id } = await context.params;

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching event:', error);
      return NextResponse.json(
        { error: 'Failed to fetch event' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(mapRowToMetaEvent(data));
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClientFromRequest(request);
    const { id } = await context.params;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    validateEventPayload(body);

    const eventName = body.eventName.trim();
    const date = body.date;
    const time = typeof body.time === 'string' && body.time.trim().length > 0 ? body.time.trim() : null;
    const location = typeof body.location === 'string' && body.location.trim().length > 0 ? body.location.trim() : null;
    const description = typeof body.description === 'string' && body.description.trim().length > 0 ? body.description.trim() : null;
    const googleDriveLink = typeof body.googleDriveLink === 'string' && body.googleDriveLink.trim().length > 0 ? body.googleDriveLink.trim() : null;
    const registrationLink = typeof body.registrationLink === 'string' && body.registrationLink.trim().length > 0 ? body.registrationLink.trim() : null;

    const status = determineEventStatus(date);

    const { data, error } = await supabase
      .from('events')
      .update({
        event_name: eventName,
        date,
        time,
        location,
        description,
        google_drive_link: googleDriveLink,
        registration_link: registrationLink,
        status,
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating event:', error);
      return NextResponse.json(
        { error: 'Failed to update event', details: error.message },
        { status: 500 }
      );
    }

    let updated = data;

    if (!updated) {
      const { data: fetched, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching updated event:', fetchError);
        return NextResponse.json(
          { error: 'Failed to fetch updated event', details: fetchError.message },
          { status: 500 }
        );
      }

      if (!fetched) {
        return NextResponse.json(
          { success: true, message: 'Event updated' },
          { status: 200 }
        );
      }

      updated = fetched;
    }

    return NextResponse.json(mapRowToMetaEvent(updated));
  } catch (error: any) {
    if (error?.details) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.details },
        { status: 400 }
      );
    }

    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClientFromRequest(request);
    const { id } = await context.params;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      return NextResponse.json(
        { error: 'Failed to delete event', details: error.message },
        { status: 500 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error?.details) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.details },
        { status: 400 }
      );
    }

    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

