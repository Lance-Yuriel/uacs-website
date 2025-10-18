export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  googleDriveLink: string;
  attendees?: number;
  highlights?: string[];
  year: number;
}

export interface EventData {
  events: Event[];
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  location?: string;
  registrationLink?: string;
}

export interface UpcomingEventData {
  events: UpcomingEvent[];
}
