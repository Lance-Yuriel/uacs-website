import { useState, useEffect } from 'react';
import { throttle } from '@/lib/utils';

export interface UseActiveSectionOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useActiveSection(options: UseActiveSectionOptions = {}) {
  const { threshold = 0.5, rootMargin = '-20% 0px -60% 0px' } = options;
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    
    if (sections.length === 0) return;

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + 100; // Offset for navbar
      
      let currentSection = 'hero'; // Default to hero
      
      sections.forEach((section) => {
        const element = section as HTMLElement;
        const sectionTop = element.offsetTop;
        const sectionHeight = element.offsetHeight;
        const sectionId = element.getAttribute('data-section');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          if (sectionId) {
            currentSection = sectionId;
          }
        }
      });
      
      // If we're at the very top, make sure hero is active
      if (window.scrollY < 100) {
        currentSection = 'hero';
      }
      
      setActiveSection(currentSection);
    };

    const throttledUpdate = throttle(updateActiveSection, 100);

    // Initial check
    updateActiveSection();

    // Listen to scroll
    window.addEventListener('scroll', throttledUpdate);
    
    return () => {
      window.removeEventListener('scroll', throttledUpdate);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return {
    activeSection,
    scrollToSection,
  };
}
