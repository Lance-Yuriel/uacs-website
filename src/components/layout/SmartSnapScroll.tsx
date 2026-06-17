'use client';

import { useEffect } from 'react';

export default function SmartSnapScroll() {
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let isScrolling = false;
    let lastScrollTop = 0;
    let scrollDirection: 'up' | 'down' | null = null;

    const getSections = () => {
      return Array.from(document.querySelectorAll('[data-section]')) as HTMLElement[];
    };

    const findNearestSection = (scrollY: number): HTMLElement | null => {
      const sections = getSections();
      if (sections.length === 0) return null;

      let nearest: HTMLElement | null = null;
      let minDistance = Infinity;
      const threshold = window.innerHeight * 0.25; // 25% of viewport height

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = scrollY + rect.top;
        const distance = Math.abs(scrollY - sectionTop);

        // Only consider sections within threshold
        if (distance < threshold && distance < minDistance) {
          minDistance = distance;
          nearest = section;
        }
      });

      return nearest;
    };

    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDelta = Math.abs(currentScrollTop - lastScrollTop);
      
      // Determine scroll direction
      if (currentScrollTop > lastScrollTop) {
        scrollDirection = 'down';
      } else if (currentScrollTop < lastScrollTop) {
        scrollDirection = 'up';
      }
      lastScrollTop = currentScrollTop;

      isScrolling = true;
      clearTimeout(scrollTimeout);

      // After scrolling stops, check if we should snap
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        
        // Only snap on gentle scrolls (not fast swipes)
        if (scrollDelta < 100) {
          const nearestSection = findNearestSection(currentScrollTop);
          
          if (nearestSection) {
            const rect = nearestSection.getBoundingClientRect();
            const sectionTop = window.pageYOffset + rect.top;
            const distance = Math.abs(currentScrollTop - sectionTop);
            
            // Only snap if within 180px threshold and not currently scrolling
            if (distance < 180 && !isScrolling) {
              window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
              });
            }
          }
        }
      }, 170); // Wait 170ms after scrolling stops
    };

    // Use passive listeners for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, []);

  return null;
}

