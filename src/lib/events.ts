import type { EventStatus } from '@/types/event';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export interface CountdownMeta {
  year: number | null;
  daysUntil: number | null;
  countdownMessage: string | null;
  isHappeningToday: boolean;
}

/**
 * Converts a "YYYY-MM-DD" date string into a local Date object.
 * Manually parses components to prevent JavaScript from defaulting to UTC midnight,
 * which causes timezone offset shifts on the client side.
 * 
 * @param dateStr - The date string in YYYY-MM-DD format.
 * @returns A local Date object representing the calendar day, or null if invalid.
 * 
 * @example
 * toLocalDate("2026-08-20") // Returns Date: 2026-08-20 in local system time
 */
export function toLocalDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

/**
 * Gets a Date object representing the start of the current calendar day (00:00:00)
 * in the local system timezone.
 * 
 * @returns A Date object at midnight today.
 */
export function getStartOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Determines whether an event is in the future/today ('upcoming') or in the past
 * relative to the local calendar day.
 * 
 * @param dateStr - The event date string in YYYY-MM-DD format.
 * @returns The event status ('upcoming' or 'past').
 */
export function determineEventStatus(dateStr: string | null | undefined): EventStatus {
  const eventDate = toLocalDate(dateStr ?? '');
  if (!eventDate) {
    return 'upcoming';
  }

  const today = getStartOfToday();
  return eventDate >= today ? 'upcoming' : 'past';
}

/**
 * Calculates countdown details and builds metadata messages for an event
 * relative to the current local calendar date.
 * 
 * @param eventName - The name of the event.
 * @param dateStr - The event date string in YYYY-MM-DD format.
 * @returns Metadata object containing days until, happening status, and display message.
 * 
 * @example
 * buildCountdownMeta("Main Meet", "2026-08-25")
 * // Returns { year: 2026, daysUntil: 5, countdownMessage: "5 days until Main Meet!", isHappeningToday: false }
 */
export function buildCountdownMeta(eventName: string, dateStr: string | null | undefined): CountdownMeta {
  const eventDate = toLocalDate(dateStr ?? '');
  if (!eventDate) {
    return {
      year: null,
      daysUntil: null,
      countdownMessage: null,
      isHappeningToday: false,
    };
  }

  const today = getStartOfToday();
  const diffDays = Math.round((eventDate.getTime() - today.getTime()) / DAY_IN_MS);

  const isHappeningToday = diffDays === 0;
  const daysUntil = diffDays >= 0 ? diffDays : null;

  let countdownMessage: string | null = null;
  if (diffDays > 1) {
    countdownMessage = `${diffDays} days until ${eventName}!`;
  } else if (diffDays === 1) {
    countdownMessage = `1 day until ${eventName}!`;
  } else if (diffDays === 0) {
    countdownMessage = `${eventName} is happening today!`;
  }

  return {
    year: eventDate.getFullYear(),
    daysUntil,
    countdownMessage,
    isHappeningToday,
  };
}

