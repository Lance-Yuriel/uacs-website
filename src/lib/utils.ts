import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple CSS class names together. Combines clsx for conditional class joining
 * and tailwind-merge to resolve Tailwind CSS class conflicts.
 * 
 * @param inputs - List of class names, conditional objects, or arrays.
 * @returns A consolidated class name string.
 * 
 * @example
 * cn("px-2 py-1", isPrimary && "bg-primary-500", "px-4") // Returns "py-1 bg-primary-500 px-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats an ISO date string into a standard readable long-date string (US English).
 * 
 * @param date - The ISO date string to format.
 * @returns The formatted date string, e.g., "August 20, 2026".
 * 
 * @example
 * formatDate("2026-08-20") // Returns "August 20, 2026"
 */
export function formatDate(date: string): string {
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return date;
  }
}

/**
 * Formats a 24-hour time string (HH:MM or HH:MM:SS) into a 12-hour AM/PM string.
 * Falls back to the original string if parsing fails or components are out of range.
 * 
 * @param time - The 24-hour time string.
 * @returns The formatted 12-hour string (e.g., "7:30 PM"), or null if inputs are null/undefined.
 * 
 * @example
 * formatTime12Hour("19:30") // Returns "7:30 PM"
 * formatTime12Hour("08:15:00") // Returns "8:15 AM"
 */
export function formatTime12Hour(time: string | null | undefined): string | null {
  if (!time) return null;
  
  try {
    // Handle HH:MM or HH:MM:SS format
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr || '0', 10);
    
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return time; // Return original if invalid
    }
    
    const period = hour >= 12 ? 'PM' : 'AM';
    let displayHour = hour % 12;
    if (displayHour === 0) displayHour = 12; // 0 and 12 both become 12
    
    return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return time; // Return original on error
  }
}

/**
 * Smoothly scrolls the window viewport to the target HTML element on the page.
 * 
 * @param sectionId - The ID selector or hashtag of the target element.
 * 
 * @example
 * scrollToSection("#events") // Scrolls viewport to <div id="events">
 */
export function scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId.replace('#', ''));
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

/**
 * Creates a debounced version of a function that delays execution until after
 * a specified wait time has elapsed since the last time the function was invoked.
 * 
 * @param func - The callback function to debounce.
 * @param wait - The delay in milliseconds.
 * @returns The debounced wrapper function.
 * 
 * @example
 * const debouncedSearch = debounce(searchAPI, 300);
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Creates a throttled version of a function that only permits execution once
 * per specified limit interval.
 * 
 * @param func - The callback function to throttle.
 * @param limit - The throttle limit interval in milliseconds.
 * @returns The throttled wrapper function.
 * 
 * @example
 * const throttledScroll = throttle(handleScroll, 100);
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
