'use client';

import { useMemo, useState, useRef } from 'react';
import { X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { auth } from '@/lib/firebase';
import Image from 'next/image';
import UpcomingEventCard from '@/components/events/UpcomingEventCard';
import PastEventCard from '@/components/events/PastEventCard';
import { buildCountdownMeta, determineEventStatus } from '@/lib/events';
import type { EventWithMeta } from '@/types/event';

interface EventFormProps {
  event: EventWithMeta | null;
  onClose: (hasChanged?: boolean) => void;
}

const MAX_EVENT_NAME_CHARACTERS = 32;
const MAX_LOCATION_CHARACTERS = 50;
const MAX_DESCRIPTION_CHARACTERS = 210;
const MAX_UPCOMING_DESCRIPTION_CHARACTERS = 100;
const ESTIMATED_DESCRIPTION_WORD_LENGTH = 8.75;

function estimateDescriptionWords(characters: number): number {
  return Math.max(1, Math.round(characters / ESTIMATED_DESCRIPTION_WORD_LENGTH));
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidUrl(value: string): boolean {
  if (!value) return true;
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function formatTimeForDisplay(time: string | null | undefined): string {
  if (!time) return '';
  const [hourStr, minuteStr = '00'] = time.split(':');
  const hourNum = Number.parseInt(hourStr, 10);
  if (Number.isNaN(hourNum)) return '';
  const minuteNum = Number.parseInt(minuteStr, 10) || 0;
  const period = hourNum >= 12 ? 'PM' : 'AM';
  let displayHour = hourNum % 12;
  if (displayHour === 0) displayHour = 12;
  return `${displayHour}:${String(minuteNum).padStart(2, '0')} ${period}`;
}

function normalizeTimeInput(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*$/i);
  if (!match) return null;

  let hour = Number.parseInt(match[1], 10);
  const minute = match[2] ? Number.parseInt(match[2], 10) : 0;
  const period = match[3]?.toLowerCase();

  if (Number.isNaN(hour) || Number.isNaN(minute) || hour > 12 || minute > 59 || hour === 0) {
    if (!period && hour <= 23 && minute <= 59) {
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
    return null;
  }

  if (period) {
    if (hour === 12) {
      hour = period === 'am' ? 0 : 12;
    } else if (period === 'pm') {
      hour += 12;
    }
  }

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

const EventForm: React.FC<EventFormProps> = ({ event, onClose }) => {
  const isEditing = Boolean(event);
  const eventIdRef = useRef(event?.id ?? null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    eventName: event?.eventName ?? '',
    date: event?.date ?? '',
    time: formatTimeForDisplay(event?.time),
    location: event?.location ?? '',
    description: event?.description ?? '',
    upcomingDescription: event?.upcomingDescription ?? '',
    eventPhotoUrl: event?.eventPhotoUrl ?? '',
    googleDriveLink: event?.googleDriveLink ?? '',
    registrationLink: event?.registrationLink ?? '',
  });

  const eventNameLength = useMemo(() => formData.eventName.length, [formData.eventName]);
  const locationLength = useMemo(() => formData.location.length, [formData.location]);
  const descriptionLength = useMemo(() => formData.description.length, [formData.description]);
  const descriptionEstimatedWords = useMemo(
    () => estimateDescriptionWords(descriptionLength),
    [descriptionLength]
  );
  const upcomingDescriptionLength = useMemo(() => formData.upcomingDescription.length, [formData.upcomingDescription]);

  const normalizedPreviewTime = useMemo(() => normalizeTimeInput(formData.time) ?? null, [formData.time]);

  const previewEvent = useMemo<EventWithMeta>(() => {
    const previewName = formData.eventName || 'Event Name';
    const countdown = buildCountdownMeta(previewName, formData.date || null);

    const fallbackTimestamp = new Date().toISOString();
    const fallbackDate = formData.date || fallbackTimestamp.slice(0, 10);

    return {
      id: eventIdRef.current || 'preview-event',
      eventName: previewName,
      date: fallbackDate,
      time: normalizedPreviewTime,
      location: formData.location ? formData.location : null,
      description: formData.description || '',
      upcomingDescription: formData.upcomingDescription || '',
      eventPhotoUrl: formData.eventPhotoUrl || null,
      googleDriveLink: formData.googleDriveLink || null,
      registrationLink: formData.registrationLink || null,
      status: determineEventStatus(formData.date || null),
      createdAt: event?.createdAt ?? fallbackTimestamp,
      updatedAt: event?.updatedAt ?? fallbackTimestamp,
      year: countdown.year ?? new Date(fallbackDate).getFullYear(),
      daysUntil: countdown.daysUntil,
      countdownMessage: countdown.countdownMessage,
      isHappeningToday: countdown.isHappeningToday,
    };
  }, [event, formData, normalizedPreviewTime]);

  const pastPreviewEvent = useMemo<EventWithMeta>(() => ({
    ...previewEvent,
    eventPhotoUrl: formData.eventPhotoUrl || null,
    upcomingDescription: null, // Past events don't show upcoming description
    status: 'past',
    daysUntil: null,
    countdownMessage: null,
    isHappeningToday: false,
  }), [previewEvent, formData.eventPhotoUrl]);

  // No client-side uploader methods needed since we're pasting image URLs directly.

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.eventName.trim()) {
      nextErrors.eventName = 'Event name is required';
    } else if (formData.eventName.trim().length > MAX_EVENT_NAME_CHARACTERS) {
      const approxWords = Math.max(1, Math.floor(formData.eventName.trim().length / 6.5));
      nextErrors.eventName = `Event name must be ${MAX_EVENT_NAME_CHARACTERS} characters or fewer (currently ${formData.eventName.trim().length}, approx ${approxWords} words)`;
    }

    if (!formData.date) {
      nextErrors.date = 'Date is required';
    } else if (!isValidDate(formData.date)) {
      nextErrors.date = 'Date must be in YYYY-MM-DD format';
    }

    if (formData.time.trim() && !normalizeTimeInput(formData.time)) {
      nextErrors.time = 'Enter a valid time (e.g. 7:30 PM or 19:30)';
    }

    if (formData.location.trim().length > MAX_LOCATION_CHARACTERS) {
      const approxWords = Math.max(1, Math.floor(formData.location.trim().length / 6.5));
      nextErrors.location = `Location must be ${MAX_LOCATION_CHARACTERS} characters or fewer (currently ${formData.location.trim().length}, approx ${approxWords} words)`;
    }

    if (descriptionLength > MAX_DESCRIPTION_CHARACTERS) {
      nextErrors.description = `Description must be ${MAX_DESCRIPTION_CHARACTERS} characters or fewer (currently ${descriptionLength}, approx ${descriptionEstimatedWords} words)`;
    }

    if (upcomingDescriptionLength > MAX_UPCOMING_DESCRIPTION_CHARACTERS) {
      const approxWords = Math.max(1, Math.round(upcomingDescriptionLength / 8.75));
      nextErrors.upcomingDescription = `Upcoming description must be ${MAX_UPCOMING_DESCRIPTION_CHARACTERS} characters or fewer (currently ${upcomingDescriptionLength}, approx ${approxWords} words)`;
    }

    if (!isValidUrl(formData.googleDriveLink)) {
      nextErrors.googleDriveLink = 'Please enter a valid URL (including https://)';
    }

    if (formData.registrationLink.trim() && !isValidUrl(formData.registrationLink)) {
      nextErrors.registrationLink = 'Please enter a valid URL (including https://)';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setSubmitError(null);
    if (!validateForm()) {
      return;
    }

    if (isEditing && !eventIdRef.current) {
      setSubmitError('Unable to determine which event to update. Please close the form and try again.');
      return;
    }

    const trimmedTime = formData.time.trim();
    const normalizedTime = trimmedTime.length > 0 ? normalizeTimeInput(trimmedTime) : null;

    if (trimmedTime.length > 0 && !normalizedTime) {
      setSubmitError('Please enter a valid time, such as 7:30 PM or 19:30.');
      return;
    }

    setLoading(true);
    try {
      const trimmedName = formData.eventName.trim();
      const trimmedLocation = formData.location.trim();
      const trimmedDescription = formData.description.trim();
      const trimmedUpcomingDescription = formData.upcomingDescription.trim();
      const trimmedPhotoUrl = formData.eventPhotoUrl.trim();
      const trimmedDriveLink = formData.googleDriveLink.trim();
      const trimmedRegistrationLink = formData.registrationLink.trim();

      const payload = {
        eventName: trimmedName,
        date: formData.date,
        time: normalizedTime,
        location: trimmedLocation.length > 0 ? trimmedLocation : null,
        description: trimmedDescription.length > 0 ? trimmedDescription : null,
        upcomingDescription: trimmedUpcomingDescription.length > 0 ? trimmedUpcomingDescription : null,
        eventPhotoUrl: trimmedPhotoUrl.length > 0 ? trimmedPhotoUrl : null,
        googleDriveLink: trimmedDriveLink.length > 0 ? trimmedDriveLink : null,
        registrationLink: trimmedRegistrationLink.length > 0 ? trimmedRegistrationLink : null,
      };

      const url = isEditing ? `/api/events/${eventIdRef.current}` : '/api/events';
      const method = isEditing ? 'PUT' : 'POST';

      const token = await auth.currentUser?.getIdToken();

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error || 'Failed to save event');
      }

      onClose(true);
    } catch (error: any) {
      console.error('Error saving event:', error);
      setSubmitError(error.message || 'Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-10">
      <Card className="w-full max-w-6xl max-h-[90vh] bg-background-primary/95 border border-border-default/60 shadow-2xl flex flex-col">
        <CardContent className="p-0 flex-1 flex flex-col min-h-0">
          <div className="flex flex-col lg:flex-row flex-1 min-h-0">
            <div className="flex-1 border-b border-border-default lg:border-b-0 lg:border-r flex flex-col min-h-0">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {isEditing ? 'Edit Event' : 'Add Event'}
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Configure event details, descriptions, and photo links. Description is optional until the event is over.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-text-tertiary hover:text-white transition-colors"
                  aria-label="Close form"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6 lg:px-8 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Event Name (max 32 characters ≈ 4-5 words) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-background-secondary border rounded-lg text-white focus:outline-none ${
                      errors.eventName ? 'border-red-500 focus:border-red-500' : 'border-border-default focus:border-primary-500'
                    }`}
                    placeholder="Calisthenics Training Night"
                  />
                  <div className="flex justify-between mt-1">
                    <span className={`text-xs ${eventNameLength > MAX_EVENT_NAME_CHARACTERS ? 'text-red-400' : 'text-text-secondary'}`}>
                      {eventNameLength}/{MAX_EVENT_NAME_CHARACTERS} characters
                    </span>
                  {errors.eventName && (
                      <span className="text-xs text-red-400">{errors.eventName}</span>
                  )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Date (DD-MM-YYYY) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-background-secondary border rounded-lg text-white focus:outline-none ${
                        errors.date ? 'border-red-500 focus:border-red-500' : 'border-border-default focus:border-primary-500'
                      }`}
                    />
                    {errors.date && (
                      <p className="mt-1 text-xs text-red-400">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Time (optional — include AM/PM)
                    </label>
                    <input
                      type="text"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      placeholder="e.g. 7:30 PM or 19:30"
                      className={`w-full px-4 py-2 bg-background-secondary border rounded-lg text-white focus:outline-none ${
                        errors.time ? 'border-red-500 focus:border-red-500' : 'border-border-default focus:border-primary-500'
                      }`}
                    />
                    <p className="mt-2 text-xs text-text-secondary">
                      Accepts 12-hour (7:30 PM) or 24-hour (19:30) times. Leave blank if unknown.
                    </p>
                    {errors.time && (
                      <p className="text-xs text-red-400 mt-1">{errors.time}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Location (max 50 characters)
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-background-secondary border rounded-lg text-white focus:outline-none ${
                      errors.location ? 'border-red-500 focus:border-red-500' : 'border-border-default focus:border-primary-500'
                    }`}
                    placeholder="UoA Recreation Centre"
                  />
                  <div className="flex justify-between mt-1">
                    <span className={`text-xs ${locationLength > MAX_LOCATION_CHARACTERS ? 'text-red-400' : 'text-text-secondary'}`}>
                      {locationLength}/{MAX_LOCATION_CHARACTERS} characters
                    </span>
                  {errors.location && (
                      <span className="text-xs text-red-400">{errors.location}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Upcoming Event Description (optional, max {MAX_UPCOMING_DESCRIPTION_CHARACTERS} characters ≈ 12 words)
                  </label>
                  <p className="text-xs text-text-secondary mb-2">
                    Short promotional caption for upcoming events. This won't appear in past events.
                  </p>
                  <textarea
                    name="upcomingDescription"
                    value={formData.upcomingDescription}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-2 bg-background-secondary border rounded-lg text-white focus:outline-none ${
                      errors.upcomingDescription ? 'border-red-500 focus:border-red-500' : 'border-border-default focus:border-primary-500'
                    }`}
                    placeholder="A short, exciting caption to promote this upcoming event..."
                  />
                  <div className="flex justify-between mt-1 text-xs">
                    <span className={upcomingDescriptionLength > MAX_UPCOMING_DESCRIPTION_CHARACTERS ? 'text-red-400' : 'text-text-secondary'}>
                      {upcomingDescriptionLength}/{MAX_UPCOMING_DESCRIPTION_CHARACTERS} characters
                    </span>
                    {errors.upcomingDescription && (
                      <span className="text-red-400">{errors.upcomingDescription}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Past Event Description (optional, max {MAX_DESCRIPTION_CHARACTERS} characters ≈ 24 words)
                  </label>
                  <p className="text-xs text-text-secondary mb-2">
                    Summary/highlights for past events. This won't appear in upcoming events.
                  </p>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-2 bg-background-secondary border rounded-lg text-white focus:outline-none ${
                      errors.description ? 'border-red-500 focus:border-red-500' : 'border-border-default focus:border-primary-500'
                    }`}
                    placeholder="Share highlights once the event has finished to recap the experience."
                  />
                  <div className="flex justify-between mt-1 text-xs">
                    <span className={descriptionLength > MAX_DESCRIPTION_CHARACTERS ? 'text-red-400' : 'text-text-secondary'}>
                      {descriptionLength}/{MAX_DESCRIPTION_CHARACTERS} characters
                    </span>
                    {errors.description && (
                      <span className="text-red-400">{errors.description}</span>
                    )}
                  </div>
                </div>

                <div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Event Photo URL (optional — host on postimages.org or imgur.com)
                  </label>
                  <p className="text-xs text-text-secondary mb-2">
                    Upload your image to a free service (like <a href="https://postimages.org" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">postimages.org</a>) and paste the **direct image link** here.
                  </p>
                  <input
                    type="url"
                    name="eventPhotoUrl"
                    value={formData.eventPhotoUrl}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-background-secondary border rounded-lg text-white focus:outline-none ${
                      errors.eventPhotoUrl ? 'border-red-500 focus:border-red-500' : 'border-border-default focus:border-primary-500'
                    }`}
                    placeholder="https://i.postimg.cc/your-image.png"
                  />

                  {formData.eventPhotoUrl && (
                    <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl bg-background-secondary/40 p-5">
                      <div className="relative w-full max-w-md h-48">
                        <Image
                          src={formData.eventPhotoUrl}
                          alt="Event photo preview"
                          fill
                          unoptimized
                          className="object-cover rounded-lg border-2 border-primary-500/40 shadow-lg"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, eventPhotoUrl: '' }))}
                        className="text-xs text-red-400 hover:text-red-300 underline underline-offset-4 transition-colors"
                      >
                        Remove photo
                      </button>
                    </div>
                  )}
                </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Google Drive Link (optional)
                  </label>
                  <input
                    type="url"
                    name="googleDriveLink"
                    value={formData.googleDriveLink}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-background-secondary border rounded-lg text-white focus:outline-none ${
                      errors.googleDriveLink ? 'border-red-500 focus:border-red-500' : 'border-border-default focus:border-primary-500'
                    }`}
                    placeholder="https://drive.google.com/..."
                  />
                  {errors.googleDriveLink && (
                    <p className="mt-1 text-xs text-red-400">{errors.googleDriveLink}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Registration Link (optional)
                  </label>
                  <input
                    type="url"
                    name="registrationLink"
                    value={formData.registrationLink}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-background-secondary border rounded-lg text-white focus:outline-none ${
                      errors.registrationLink ? 'border-red-500 focus:border-red-500' : 'border-border-default focus:border-primary-500'
                    }`}
                    placeholder="https://forms.gle/..."
                  />
                  <p className="mt-2 text-xs text-text-secondary">
                    Add a Google Form or other signup link for this event. Leave blank if registration isn't available yet.
                  </p>
                  {errors.registrationLink && (
                    <p className="mt-1 text-xs text-red-400">{errors.registrationLink}</p>
                  )}
                </div>

                {submitError && (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {submitError}
                  </div>
                )}

                <div className="flex gap-3 pt-2 justify-center">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="px-6 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      isEditing ? 'Update Event' : 'Create Event'
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-6 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>

            <div className="flex-1 px-6 py-6 lg:px-8 bg-background-secondary/40 overflow-y-auto">
              <div className="max-w-md mx-auto space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">Preview</h3>
                  <p className="text-sm text-text-secondary">
                    See how this event will display in both upcoming and past sections.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Upcoming appearance</span>
                  <UpcomingEventCard event={previewEvent} />
                </div>

                <div className="space-y-2 pt-4 border-t border-border-default/40">
                  <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Past appearance</span>
                  <PastEventCard event={pastPreviewEvent} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default EventForm;

