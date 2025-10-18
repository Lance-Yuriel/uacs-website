import React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className, ...props }, ref) => {
    const defaultIcon = (
      <svg className="h-12 w-12 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12c0 3.314-2.686 6-6 6s-6-2.686-6-6c0-1.658.673-3.16 1.764-4.25" />
      </svg>
    );

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12 px-6 text-center',
          className
        )}
        {...props}
      >
        <div className="mb-4">
          {icon || defaultIcon}
        </div>
        
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {title}
        </h3>
        
        <p className="text-text-secondary text-sm max-w-sm mb-6">
          {description}
        </p>
        
        {action && (
          <div>
            {action}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
