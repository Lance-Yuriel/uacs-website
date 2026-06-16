import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
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
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
