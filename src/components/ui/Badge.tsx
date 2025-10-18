import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'co-founder';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'md', className, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center gap-1.5 rounded-full font-semibold transition-fast';
    
    const variants = {
      default: 'bg-primary-500/15 text-primary-400',
      success: 'bg-accent-success/15 text-accent-success',
      warning: 'bg-accent-warning/15 text-accent-warning',
      error: 'bg-accent-error/15 text-accent-error',
      'co-founder': 'bg-gradient-to-r from-primary-500/20 to-accent-blue/20 text-primary-400 border border-primary-500/30'
    };
    
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base'
    };

    const classes = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      className
    );

    return (
      <span
        ref={ref}
        className={classes}
        {...props}
      >
        {variant === 'co-founder' && (
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
