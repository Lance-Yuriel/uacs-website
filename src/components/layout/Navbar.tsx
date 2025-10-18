'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Instagram, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useActiveSection } from '@/hooks/useActiveSection';
import { Button } from '@/components/ui';
import navigationData from '@/data/navigation.json';
import { NavigationData } from '@/types/navigation';

const navigation = navigationData as NavigationData;

export interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeSection, scrollToSection } = useActiveSection();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const sectionId = href.replace('#', '');
      scrollToSection(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'mail':
        return <Mail className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-smooth',
          'glass-navbar',
          isScrolled && 'shadow-lg',
          className
        )}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button
                onClick={() => handleNavClick('#hero')}
                className="text-2xl font-bold text-white hover:text-primary-400 transition-colors"
              >
                {navigation.logo.text}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navigation.mainNav.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className={cn(
                      'px-3 py-2 text-sm font-medium transition-colors',
                      'text-text-secondary hover:text-white',
                      activeSection === item.href.replace('#', '') && 
                      'text-white border-b-2 border-primary-500'
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop CTA and Social Links */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Social Links */}
              <div className="flex items-center space-x-3">
                {navigation.socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-primary-400 transition-colors"
                    aria-label={social.platform}
                  >
                    {getSocialIcon(social.icon)}
                  </a>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                href={navigation.ctaButton.href}
                external={navigation.ctaButton.external}
                variant="primary"
                size="sm"
              >
                {navigation.ctaButton.label}
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-text-secondary hover:text-white transition-colors p-2"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background-primary/95 backdrop-blur-md border-t border-border-default">
              {navigation.mainNav.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    'block px-3 py-2 text-base font-medium transition-colors w-full text-left',
                    'text-text-secondary hover:text-white hover:bg-white/5 rounded-lg',
                    activeSection === item.href.replace('#', '') && 
                    'text-white bg-primary-500/10'
                  )}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile CTA Button */}
              <div className="pt-4 border-t border-border-default">
                <Button
                  href={navigation.ctaButton.href}
                  external={navigation.ctaButton.external}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  {navigation.ctaButton.label}
                </Button>
              </div>

              {/* Mobile Social Links */}
              <div className="pt-4 border-t border-border-default">
                <div className="flex items-center justify-center space-x-4">
                  {navigation.socialLinks.map((social) => (
                    <a
                      key={social.platform}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary hover:text-primary-400 transition-colors p-2"
                      aria-label={social.platform}
                    >
                      {getSocialIcon(social.icon)}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
