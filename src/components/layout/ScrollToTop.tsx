'use client';

import { useEffect } from 'react';

export default function ScrollToTop() {
  useEffect(() => {
    // Only scroll to top on initial page load/refresh
    // Use a more targeted approach that doesn't interfere with tab switching
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Run immediately on mount (only happens on page load/refresh)
    scrollToTop();

    // Add a small delay as fallback for cases where initial scroll might be overridden
    const timeoutId = setTimeout(scrollToTop, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return null; // This component doesn't render anything
}
