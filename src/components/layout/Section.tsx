import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

const Section: React.FC<SectionProps> = ({
  id,
  children,
  className,
  containerClassName,
  spacing = 'lg'
}) => {
  const spacingClasses = {
    sm: 'py-16',
    md: 'py-20',
    lg: 'py-24'
  };

  return (
    <section
      id={id}
      data-section={id}
      className={cn(spacingClasses[spacing], 'relative', className)}
    >
      {/* Subtle background overlay for text readability */}
      <div className="absolute inset-0 bg-background-primary/40 backdrop-blur-[0.5px]" />
      
      <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10', containerClassName)}>
        {children}
      </div>
    </section>
  );
};

export default Section;
