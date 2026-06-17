import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './Card';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('w-full', className)}
        {...props}
      >
        <Card className="text-center">
          <CardContent className="py-8 px-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              {title}
            </h3>
            
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              {description}
            </p>
            
            {action && (
              <div>
                {action}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
