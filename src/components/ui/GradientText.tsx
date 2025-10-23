import React, { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export default function GradientText({
  children,
  className = '',
  colors = ['#BBD6FF', '#DCEBFF', '#A5C8F8', '#DCEBFF', '#BBD6FF'],
  animationSpeed = 5,
  showBorder = false
}: GradientTextProps) {
  return (
    <span
      className={`inline-block gradient-text ${className}`}
      style={{
        background: `linear-gradient(90deg, ${colors.join(', ')})`,
        backgroundSize: '300% 100%',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
        animation: `gradient-move ${animationSpeed}s linear infinite`
      }}
    >
      {children}
    </span>
  );
}
