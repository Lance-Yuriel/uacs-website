export type EventStatus = 'upcoming' | 'past';

export interface EventDTO {
  id: string;
  eventName: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string | null; // HH:MM or HH:MM:SS
  location: string | null;
  description: string | null; // For past events (summary, max 210 chars)
  upcomingDescription: string | null; // For upcoming events (promotional caption, max 100 chars)
  eventPhotoUrl: string | null;
  googleDriveLink: string | null;
  registrationLink: string | null;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EventWithMeta extends EventDTO {
  year: number;
  daysUntil: number | null;
  countdownMessage: string | null;
  isHappeningToday: boolean;
}

export interface EventsResponse {
  upcoming: EventWithMeta[];
  past: EventWithMeta[];
}

export interface EventFormState {
  id?: string;
  eventName: string;
  date: string;
  time: string;
  location: string;
  description: string;
  upcomingDescription: string;
  eventPhotoUrl: string;
  googleDriveLink: string;
  registrationLink: string;
}
