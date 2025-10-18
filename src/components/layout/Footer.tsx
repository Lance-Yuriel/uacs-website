import React from 'react';
import { Instagram, Mail, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import siteConfig from '@/data/siteConfig.json';
import navigationData from '@/data/navigation.json';
import { NavigationData } from '@/types/navigation';
import { SiteConfig } from '@/types/site';

const navigation = navigationData as NavigationData;
const site = siteConfig as SiteConfig;

export interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  // const getSocialIcon = (platform: string) => {
  //   switch (platform.toLowerCase()) {
  //     case 'instagram':
  //       return <Instagram className="h-5 w-5" />;
  //     case 'mail':
  //       return <Mail className="h-5 w-5" />;
  //     default:
  //       return null;
  //   }
  // };

  return (
    <footer className={cn('bg-background-primary border-t border-border-default', className)}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Club Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {site.abbreviation}
              </h3>
              <p className="text-text-secondary text-sm">
                {site.name}
              </p>
              <p className="text-text-tertiary text-sm mt-1">
                Founded {site.founded}
              </p>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              {site.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <nav className="space-y-2">
              {navigation.mainNav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-text-secondary hover:text-white transition-colors text-sm"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="pt-4">
              <a
                href={site.links.constitution}
                className="inline-flex items-center text-text-secondary hover:text-white transition-colors text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Constitution
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact</h4>
            <div className="space-y-3">
              <a
                href={`mailto:${site.email}`}
                className="flex items-center text-text-secondary hover:text-white transition-colors text-sm"
              >
                <Mail className="h-4 w-4 mr-2" />
                {site.email}
              </a>
              <a
                href={site.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-text-secondary hover:text-white transition-colors text-sm"
              >
                <Instagram className="h-4 w-4 mr-2" />
                {site.socialMedia.instagramHandle}
              </a>
            </div>
            
            {/* Join CTA */}
            <div className="pt-4">
              <a
                href={site.links.joinForm}
                className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join UACS
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border-default">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-text-tertiary text-sm">
              © {currentYear} {site.name}. All rights reserved.
            </p>
            <p className="text-text-tertiary text-sm">
              Building strength, mastering movement
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
