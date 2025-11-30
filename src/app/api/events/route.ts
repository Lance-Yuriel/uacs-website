import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClientFromRequest } from '@/lib/supabase-server';
import { buildCountdownMeta, determineEventStatus } from '@/lib/events';
import type { Database } from '@/types/database';
import type { EventDTO, EventStatus, EventWithMeta, EventsResponse } from '@/types/event';

export type EventRow = Database['public']['Tables']['events']['Row'];

export const dynamic = 'force-dynamic';

const EVENT_STATUS: Record<'UPCOMING' | 'PAST', EventStatus> = {
  UPCOMING: 'upcoming',
  PAST: 'past',
};

export function mapRowToDto(row: EventRow): EventDTO {
  return {
    id: row.id,
    eventName: row.event_name,
    date: row.date,
    time: row.time,
    location: row.location,
    description: row.description,
    upcomingDescription: row.upcoming_description,
    eventPhotoUrl: row.event_photo_url,
    googleDriveLink: row.google_drive_link,
    registrationLink: row.registration_link,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapRowToMetaEvent(row: EventRow): EventWithMeta {
  const dto = mapRowToDto(row);
  return {
    ...dto,
    ...buildCountdownMeta(dto.eventName, dto.date),
  };
}

export function validateEventPayload(body: any) {
  if (!body) {
    throw new Error('Missing request body');
  }

  const errors: Record<string, string> = {};
  if (!body.eventName || typeof body.eventName !== 'string' || body.eventName.trim().length === 0) {
    errors.eventName = 'Event name is required';
  } else if (body.eventName.trim().length > 32) {
    const approxWords = Math.max(1, Math.floor(body.eventName.trim().length / 6.5));
    errors.eventName = `Event name must be 32 characters or fewer (currently ${body.eventName.trim().length}, approx ${approxWords} words)`;
  }

  if (!body.date || typeof body.date !== 'string' || !/^[\d]{4}-[\d]{2}-[\d]{2}$/.test(body.date)) {
    errors.date = 'A valid date (YYYY-MM-DD) is required';
  }

  if (body.location && typeof body.location === 'string' && body.location.trim().length > 50) {
    const approxWords = Math.max(1, Math.floor(body.location.trim().length / 6.5));
    errors.location = `Location must be 50 characters or fewer (currently ${body.location.trim().length}, approx ${approxWords} words)`;
  }

  if (body.description) {
    const description = body.description.trim();
    if (description.length > 210) {
      const approxWords = Math.max(1, Math.round(description.length / 8.75));
      errors.description = `Description must be 210 characters or fewer (currently ${description.length}, approx ${approxWords} words)`;
    }
  }

  if (body.upcomingDescription) {
    const upcomingDescription = body.upcomingDescription.trim();
    if (upcomingDescription.length > 100) {
      const approxWords = Math.max(1, Math.round(upcomingDescription.length / 8.75));
      errors.upcomingDescription = `Upcoming description must be 100 characters or fewer (currently ${upcomingDescription.length}, approx ${approxWords} words)`;
    }
  }

  if (Object.keys(errors).length > 0) {
    const error = new Error('Validation failed');
    (error as any).details = errors;
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClientFromRequest(request);

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true, nullsLast: true });

    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      );
    }

    if (!data) {
      const emptyResponse: EventsResponse = { upcoming: [], past: [] };
      return NextResponse.json(emptyResponse);
    }

    const todayStatus = data.map((row) => {
      const computedStatus = determineEventStatus(row.date);
      return { row, computedStatus };
    });

    const updates = todayStatus
      .filter(({ row, computedStatus }) => row.status !== computedStatus)
      .map(({ row, computedStatus }) => ({ id: row.id, status: computedStatus }));

    if (updates.length > 0) {
      await Promise.all(
        updates.map(({ id, status }) =>
          supabase.from('events').update({ status }).eq('id', id)
        )
      );
    }

    const enriched = todayStatus.map(({ row, computedStatus }) =>
      mapRowToMetaEvent({ ...row, status: computedStatus })
    );

    const upcoming = enriched
      .filter((event) => event.status === EVENT_STATUS.UPCOMING)
      .sort((a, b) => {
        if (a.date === b.date) {
          if (!a.time) return 1;
          if (!b.time) return -1;
          return a.time.localeCompare(b.time);
        }
        return a.date.localeCompare(b.date);
      });

    const past = enriched
      .filter((event) => event.status === EVENT_STATUS.PAST)
      .sort((a, b) => {
        if (a.date === b.date) {
          const timeA = a.time ?? '00:00';
          const timeB = b.time ?? '00:00';
          return timeB.localeCompare(timeA);
        }
        return b.date.localeCompare(a.date);
      });

    const response: EventsResponse = { upcoming, past };
    return NextResponse.json(response);
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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClientFromRequest(request);

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
    const upcomingDescription = typeof body.upcomingDescription === 'string' && body.upcomingDescription.trim().length > 0 ? body.upcomingDescription.trim() : null;
    const eventPhotoUrl = typeof body.eventPhotoUrl === 'string' && body.eventPhotoUrl.trim().length > 0 ? body.eventPhotoUrl.trim() : null;
    const googleDriveLink = typeof body.googleDriveLink === 'string' && body.googleDriveLink.trim().length > 0 ? body.googleDriveLink.trim() : null;
    const registrationLink = typeof body.registrationLink === 'string' && body.registrationLink.trim().length > 0 ? body.registrationLink.trim() : null;

    const status = determineEventStatus(date);
    const id = body.id && typeof body.id === 'string' && body.id.trim().length > 0
      ? body.id.trim()
      : `event-${randomUUID()}`;

    const { data, error } = await supabase
      .from('events')
      .insert({
        id,
        event_name: eventName,
        date,
        time,
        location,
        description,
        upcoming_description: upcomingDescription,
        event_photo_url: eventPhotoUrl,
        google_drive_link: googleDriveLink,
        registration_link: registrationLink,
        status,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return NextResponse.json(
        { error: 'Failed to create event', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(mapRowToMetaEvent(data), { status: 201 });
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
    const upcomingDescription = typeof body.upcomingDescription === 'string' && body.upcomingDescription.trim().length > 0 ? body.upcomingDescription.trim() : null;
    const eventPhotoUrl = typeof body.eventPhotoUrl === 'string' && body.eventPhotoUrl.trim().length > 0 ? body.eventPhotoUrl.trim() : null;
    const googleDriveLink = typeof body.googleDriveLink === 'string' && body.googleDriveLink.trim().length > 0 ? body.googleDriveLink.trim() : null;

    const status = determineEventStatus(date);

    const { error } = await supabase
      .from('events')
      .update({
        event_name: eventName,
        date,
        time,
        location,
        description,
        upcoming_description: upcomingDescription,
        event_photo_url: eventPhotoUrl,
        google_drive_link: googleDriveLink,
        status,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating event:', error);
      return NextResponse.json(
        { error: 'Failed to update event', details: error.message },
        { status: 500 }
      );
    }

    const { data: refreshed, error: fetchError } = await supabase
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

    if (!refreshed) {
      return NextResponse.json(
        { success: true, message: 'Event updated' },
        { status: 200 }
      );
    }

    return NextResponse.json(mapRowToMetaEvent(refreshed));
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

