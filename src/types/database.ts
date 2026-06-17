// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          event_name: string;
          date: string;
          time: string | null;
          location: string | null;
          description: string | null;
          upcoming_description: string | null;
          event_photo_url: string | null;
          google_drive_link: string | null;
          registration_link: string | null;
          status: 'upcoming' | 'past';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_name: string;
          date: string;
          time?: string | null;
          location?: string | null;
          description?: string | null;
          upcoming_description?: string | null;
          event_photo_url?: string | null;
          google_drive_link?: string | null;
          registration_link?: string | null;
          status?: 'upcoming' | 'past';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_name?: string;
          date?: string;
          time?: string | null;
          location?: string | null;
          description?: string | null;
          upcoming_description?: string | null;
          event_photo_url?: string | null;
          google_drive_link?: string | null;
          registration_link?: string | null;
          status?: 'upcoming' | 'past';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
