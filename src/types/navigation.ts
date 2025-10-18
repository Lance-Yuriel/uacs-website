export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
}

export interface NavigationData {
  logo: {
    text: string;
    alt: string;
  };
  mainNav: NavLink[];
  ctaButton: NavLink;
  socialLinks: SocialLink[];
}
