import React from 'react';
import { Executive } from '@/types/executive';
import ExecutiveProfileContent from '@/components/executives/ExecutiveProfileContent';

interface ExecutivePreviewProps {
  executive: Executive;
  className?: string;
}

const ExecutivePreview: React.FC<ExecutivePreviewProps> = ({ executive, className = '' }) => {
  return (
    <div className={`bg-[#1a1a1a] border border-white/20 rounded-2xl p-4 md:p-6 lg:p-8 w-full max-w-[800px] mx-auto ${className}`}>
      <ExecutiveProfileContent executive={executive} variant="preview" />
    </div>
  );
};

export default ExecutivePreview;
