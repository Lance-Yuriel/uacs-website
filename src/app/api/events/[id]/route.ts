import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { determineEventStatus } from '@/lib/events';
import { mapRowToMetaEvent, validateEventPayload, verifyAdmin } from '../route';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const doc = await adminDb.collection('events').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const data = { id: doc.id, ...doc.data() };
    return NextResponse.json(mapRowToMetaEvent(data));
  } catch (error) {
    console.error('API GET ID Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin(request);
    const { id } = await context.params;

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
    const updatedAt = new Date().toISOString();

    const docRef = adminDb.collection('events').doc(id);
    const existingDoc = await docRef.get();
    if (!existingDoc.exists) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const updatedData = {
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
      updatedAt,
    };

    await docRef.update(updatedData);

    const completeDoc = {
      id,
      ...existingDoc.data(),
      ...updatedData,
    };

    return NextResponse.json(mapRowToMetaEvent(completeDoc));
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

    console.error('API PUT ID Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin(request);
    const { id } = await context.params;

    const docRef = adminDb.collection('events').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    await docRef.delete();
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error('API DELETE ID Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
