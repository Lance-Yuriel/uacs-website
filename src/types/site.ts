export interface SiteConfig {
  name: string;
  abbreviation: string;
  tagline: string;
  email: string;
  founded: number;
  socialMedia: {
    instagram: string;
    instagramHandle: string;
  };
  links: {
    joinForm: string;
    constitution: string;
  };
  meta: {
    description: string;
    keywords: string[];
  };
}

export interface MemberCountResponse {
  count: number;
  lastUpdated: string;
}
