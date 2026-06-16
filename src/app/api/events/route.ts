import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { buildCountdownMeta, determineEventStatus } from '@/lib/events';
import type { EventStatus, EventWithMeta, EventsResponse } from '@/types/event';

export const dynamic = 'force-dynamic';

const EVENT_STATUS: Record<'UPCOMING' | 'PAST', EventStatus> = {
  UPCOMING: 'upcoming',
  PAST: 'past',
};

// Compatible helper that maps stored Firestore doc to the enriched front-end EventWithMeta model
export function mapRowToMetaEvent(doc: any): EventWithMeta {
  const countdown = buildCountdownMeta(doc.eventName, doc.date);
  return {
    id: doc.id,
    eventName: doc.eventName,
    date: doc.date,
    time: doc.time || null,
    location: doc.location || null,
    description: doc.description || null,
    upcomingDescription: doc.upcomingDescription || null,
    eventPhotoUrl: doc.eventPhotoUrl || null,
    googleDriveLink: doc.googleDriveLink || null,
    registrationLink: doc.registrationLink || null,
    status: doc.status,
    createdAt: doc.createdAt || new Date().toISOString(),
    updatedAt: doc.updatedAt || new Date().toISOString(),
    year: countdown.year || new Date(doc.date).getFullYear(),
    daysUntil: countdown.daysUntil,
    countdownMessage: countdown.countdownMessage,
    isHappeningToday: countdown.isHappeningToday,
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

// Extract & verify the authorization Bearer token from the incoming request headers
export async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized - Admin access required');
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Unauthorized - Admin token invalid');
  }
}

export async function GET() {
  try {
    const snapshot = await adminDb.collection('events').get();
    const data: any[] = [];
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    if (data.length === 0) {
      const emptyResponse: EventsResponse = { upcoming: [], past: [] };
      return NextResponse.json(emptyResponse);
    }

    const todayStatus = data.map((doc) => {
      const computedStatus = determineEventStatus(doc.date);
      return { doc, computedStatus };
    });

    // Automatically transition statuses in Firestore if current date requires it
    const updates = todayStatus
      .filter(({ doc, computedStatus }) => doc.status !== computedStatus)
      .map(({ doc, computedStatus }) => ({ id: doc.id, status: computedStatus }));

    if (updates.length > 0) {
      const batch = adminDb.batch();
      updates.forEach(({ id, status }) => {
        batch.update(adminDb.collection('events').doc(id), { status });
      });
      await batch.commit();
    }

    const enriched = todayStatus.map(({ doc, computedStatus }) =>
      mapRowToMetaEvent({ ...doc, status: computedStatus })
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
    console.error('API GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request);

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

    const timestamp = new Date().toISOString();
    const eventData = {
      id,
      eventName,
      date,
      time,
      location,
      description,
      upcomingDescription,
      eventPhotoUrl,
      googleDriveLink,
      registrationLink,
      status,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await adminDb.collection('events').doc(id).set(eventData);

    const enriched = mapRowToMetaEvent(eventData);
    return NextResponse.json(enriched, { status: 201 });
  } catch (error: any) {
    if (error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error?.details) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.details },
        { status: 400 }
      );
    }

    console.error('API POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
