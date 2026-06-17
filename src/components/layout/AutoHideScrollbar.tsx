'use client';

import { useEffect } from 'react';

export default function AutoHideScrollbar() {
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const html = document.documentElement;

    const handleScroll = () => {
      // Add scrolling class
      html.classList.add('scrolling');

      // Clear existing timeout
      clearTimeout(scrollTimeout);

      // Remove scrolling class after scrolling stops (1 second delay)
      scrollTimeout = setTimeout(() => {
        html.classList.remove('scrolling');
      }, 1000);
    };

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });

    // Cleanup
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, []);

  return null;
}

