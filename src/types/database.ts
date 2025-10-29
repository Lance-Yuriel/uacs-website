// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      executives: {
        Row: {
          id: string;
          name: string;
          position: string;
          title: string | null;
          photo_url: string | null;
          short_bio: string | null;
          introduction: string | null;
          degree: string | null;
          favourite_skills: string[] | null;
          email: string | null;
          instagram: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          position: string;
          title?: string | null;
          photo_url?: string | null;
          short_bio?: string | null;
          introduction?: string | null;
          degree?: string | null;
          favourite_skills?: string[] | null;
          email?: string | null;
          instagram?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          position?: string;
          title?: string | null;
          photo_url?: string | null;
          short_bio?: string | null;
          introduction?: string | null;
          degree?: string | null;
          favourite_skills?: string[] | null;
          email?: string | null;
          instagram?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          event_name: string;
          date: string;
          time: string | null;
          location: string | null;
          description: string | null;
          google_drive_link: string | null;
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
          google_drive_link?: string | null;
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
          google_drive_link?: string | null;
          status?: 'upcoming' | 'past';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
