import type { EventStatus } from '@/types/event';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export interface CountdownMeta {
  year: number | null;
  daysUntil: number | null;
  countdownMessage: string | null;
  isHappeningToday: boolean;
}

export function toLocalDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function getStartOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function determineEventStatus(dateStr: string | null | undefined): EventStatus {
  const eventDate = toLocalDate(dateStr ?? '');
  if (!eventDate) {
    return 'upcoming';
  }

  const today = getStartOfToday();
  return eventDate >= today ? 'upcoming' : 'past';
}

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

