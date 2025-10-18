import { useState, useEffect } from 'react';
import { throttle } from '@/lib/utils';

export interface UseActiveSectionOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useActiveSection(options: UseActiveSectionOptions = {}) {
  const { threshold = 0.3, rootMargin = '0px 0px -80% 0px' } = options;
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    
    if (sections.length === 0) return;

    const observerCallback = throttle((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    }, 100) as (entries: IntersectionObserverEntry[]) => void;

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin,
    });

    sections.forEach((section) => {
      observer.observe(section);
    });

    // Set initial active section
    const firstSection = sections[0];
    if (firstSection) {
      const sectionId = firstSection.getAttribute('data-section');
      if (sectionId) {
        setActiveSection(sectionId);
      }
    }

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [threshold, rootMargin]);

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
