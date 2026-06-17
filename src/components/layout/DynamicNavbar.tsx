'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Instagram, Mail } from 'lucide-react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { useActiveSection } from '@/hooks/useActiveSection';
import { Button } from '@/components/ui';
import navigationData from '@/data/navigation.json';
import { NavigationData } from '@/types/navigation';

const navigation = navigationData as NavigationData;

export interface DynamicNavbarProps {
  className?: string;
}

const DynamicNavbar: React.FC<DynamicNavbarProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeSection, scrollToSection } = useActiveSection();
  
  // Refs for GSAP animations
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLButtonElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initial animation on mount
  useEffect(() => {
    if (navRef.current && logoRef.current && navItemsRef.current) {
      // Set initial states
      gsap.set(logoRef.current, { opacity: 0, y: -20 });
      gsap.set(navItemsRef.current, { opacity: 0, y: -20 });
      
      // Animate in
      const tl = gsap.timeline();
      tl.to(logoRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        ease: "power2.out" 
      })
      .to(navItemsRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        ease: "power2.out" 
      }, "-=0.3");
    }
  }, []);

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const sectionId = href.replace('#', '');
      scrollToSection(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavItemHover = (index: number, isHover: boolean) => {
    const navItem = navItemRefs.current[index];
    if (!navItem) return;

    if (isHover) {
      gsap.to(navItem, {
        color: '#ffffff',
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      const isActive = activeSection === navigation.mainNav[index].href.replace('#', '');
      gsap.to(navItem, {
        color: isActive ? '#ffffff' : '#9CA3AF', // white for active, gray for inactive
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease: "power2.out" });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease: "power2.out" });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: "power2.out" });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: "power2.out" });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: -20, scaleY: 0.8 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.4,
            ease: "power2.out",
            transformOrigin: 'top center'
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: -20,
          scaleY: 0.8,
          duration: 0.3,
          ease: "power2.out",
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' });
          }
        });
      }
    }
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
        ref={navRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-smooth',
          'glass-navbar',
          isScrolled && 'shadow-lg',
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button
                ref={logoRef}
                onClick={() => handleNavClick('#hero')}
                className="text-2xl font-bold text-white hover:text-primary-400 transition-colors"
              >
                {navigation.logo.text}
              </button>
            </div>

            {/* Desktop Navigation - Centered */}
            <div ref={navItemsRef} className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center space-x-8">
                {navigation.mainNav.map((item, index) => {
                  const isActive = activeSection === item.href.replace('#', '');
                  return (
                    <button
                      key={item.label}
                      ref={(el) => {
                        navItemRefs.current[index] = el;
                      }}
                      onClick={() => handleNavClick(item.href)}
                      onMouseEnter={() => handleNavItemHover(index, true)}
                      onMouseLeave={() => handleNavItemHover(index, false)}
                      className={cn(
                        'px-3 py-2 text-sm font-medium transition-all duration-300',
                        'relative overflow-hidden',
                        isActive ? 'text-white' : 'text-text-secondary'
                      )}
                      style={{
                        color: isActive ? '#ffffff' : '#9CA3AF'
                      }}
                    >
                      {item.label}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 transform scale-x-100 transition-transform duration-300" />
                      )}
                    </button>
                  );
                })}
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
                ref={hamburgerRef}
                onClick={toggleMobileMenu}
                className="text-text-secondary hover:text-white transition-colors p-2"
                aria-label="Toggle mobile menu"
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <span
                    className="hamburger-line w-5 h-0.5 bg-current rounded origin-center transition-all duration-300"
                  />
                  <span
                    className="hamburger-line w-5 h-0.5 bg-current rounded origin-center transition-all duration-300"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 right-0 bg-background-primary/95 backdrop-blur-md border-t border-border-default"
          style={{ visibility: 'hidden' }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
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

export default DynamicNavbar;
