'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ExecutiveCard from './ExecutiveCard';
import { ExecutiveData } from '@/types/executive';
import executivesData from '@/data/executives.json';

const executives = executivesData as ExecutiveData;

export interface ExecutiveGridProps {
  className?: string;
}

const ExecutiveGrid: React.FC<ExecutiveGridProps> = ({ className }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={cn("space-y-16", className)}
    >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Meet Our Team
          </h2>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
            Our dedicated executive team leads the University of Auckland Calisthenics Society 
            with passion, expertise, and a commitment to building a strong community.
          </p>
        </motion.div>

        {/* Executive Grid */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {executives.executives.map((executive) => (
              <ExecutiveCard
                key={executive.id}
                executive={executive}
              />
            ))}
          </div>
        </motion.div>

        {/* Future Executives Message */}
        <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto">
          <div className="bg-surface-card/50 backdrop-blur-sm border border-border-default rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Growing Leadership Team
            </h3>
            <p className="text-text-secondary leading-relaxed">
              More executive positions will be added as our team grows and we expand our 
              leadership structure. We&apos;re always looking for passionate members to take on 
              leadership roles and help shape the future of UACS.
            </p>
          </div>
        </motion.div>
    </motion.div>
  );
};

export default ExecutiveGrid;
