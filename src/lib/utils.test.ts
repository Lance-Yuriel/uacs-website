import { describe, it, expect } from 'vitest';
import { cn, formatTime12Hour } from './utils';

describe('Utility Functions', () => {
  describe('cn (classNames merger)', () => {
    it('should join class names together', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });

    it('should handle conditional classes', () => {
      const active = true;
      const disabled = false;
      expect(cn('px-4 py-2', active && 'bg-blue-500', disabled && 'opacity-50')).toBe('px-4 py-2 bg-blue-500');
    });

    it('should resolve Tailwind conflicts correctly', () => {
      expect(cn('p-4', 'p-6')).toBe('p-6');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });
  });

  describe('formatTime12Hour', () => {
    it('should return null for falsy values', () => {
      expect(formatTime12Hour(null)).toBeNull();
      expect(formatTime12Hour(undefined)).toBeNull();
      expect(formatTime12Hour('')).toBeNull();
    });

    it('should format afternoon/evening time correctly to PM', () => {
      expect(formatTime12Hour('14:30')).toBe('2:30 PM');
      expect(formatTime12Hour('23:59')).toBe('11:59 PM');
    });

    it('should format morning time correctly to AM', () => {
      expect(formatTime12Hour('09:05')).toBe('9:05 AM');
      expect(formatTime12Hour('11:15')).toBe('11:15 AM');
    });

    it('should format midnight (00:00) to 12:00 AM', () => {
      expect(formatTime12Hour('00:00')).toBe('12:00 AM');
    });

    it('should format noon (12:00) to 12:00 PM', () => {
      expect(formatTime12Hour('12:00')).toBe('12:00 PM');
    });

    it('should return the original string if the format is invalid', () => {
      expect(formatTime12Hour('invalid')).toBe('invalid');
      expect(formatTime12Hour('25:00')).toBe('25:00');
      expect(formatTime12Hour('12:61')).toBe('12:61');
    });
  });
});
