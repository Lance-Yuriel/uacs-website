'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GradientText, LoadingSpinner } from '@/components/ui';
import ExecutiveCarousel from './ExecutiveCarousel';
import { Executive } from '@/types/executive';

export interface ExecutiveGridProps {
  className?: string;
}

// Map database executive to frontend Executive type
function mapDatabaseExecutiveToExecutive(dbExec: any): Executive {
  return {
    id: dbExec.id,
    name: dbExec.name,
    position: dbExec.position,
    title: dbExec.title || 'Executive',
    isCoFounder: dbExec.is_co_founder || false,
    bio: dbExec.bio || '[Bio coming soon]',
    image: dbExec.image || '/images/executives/default.jpg',
    email: dbExec.email || '',
    instagram: dbExec.instagram || undefined,
    joinedYear: dbExec.joined_year || new Date().getFullYear(),
    responsibilities: dbExec.responsibilities || [],
    // Extended fields
    introduction: dbExec.introduction || undefined,
    degree: dbExec.degree || undefined,
    favouriteSkills: dbExec.favourite_skills || undefined,
  };
}

const ExecutiveGrid: React.FC<ExecutiveGridProps> = ({ className }) => {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExecutives();
  }, []);

  const fetchExecutives = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/executives');
      if (!response.ok) throw new Error('Failed to fetch executives');
      const data = await response.json();
      // Map database format to frontend format
      const mappedExecutives = data.map(mapDatabaseExecutiveToExecutive);
      setExecutives(mappedExecutives);
    } catch (err) {
      console.error('Error fetching executives:', err);
      setError('Failed to load executives');
    } finally {
      setLoading(false);
    }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1] as const
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={cn("space-y-10", className)}
    >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 font-display tracking-tight">
            <GradientText
              colors={['#BBD6FF', '#DCEBFF', '#A5C8F8', '#DCEBFF', '#BBD6FF']}
              animationSpeed={3}
              showBorder={false}
              className=""
            >
              Meet Our Team
            </GradientText>
          </h2>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
            Our dedicated executive team leads the University of Auckland Calisthenics Society 
            with passion, expertise, and a commitment to building a strong community.
          </p>
        </motion.div>

        {/* Executive Carousel */}
        <motion.div variants={itemVariants} className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">{error}</p>
            </div>
          ) : executives.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">No executives found.</p>
            </div>
          ) : (
            <ExecutiveCarousel executives={executives} />
          )}
        </motion.div>

        {/* Future Executives Message */}
        <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto">
          <div className="bg-surface-card/50 backdrop-blur-sm border-2 border-[#BBD6FF] rounded-2xl p-8 shadow-[0_0_12px_rgba(187,214,255,0.5)]">
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
