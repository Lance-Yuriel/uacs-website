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
      className={cn(spacingClasses[spacing], className)}
    >
      <div className={cn('max-w-8xl mx-auto px-4 sm:px-6 lg:px-8', containerClassName)}>
        {children}
      </div>
    </section>
  );
};

export default Section;
