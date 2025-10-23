'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import EventCard from './EventCard';
import { Event } from '@/types/event';
import { EmptyState } from '@/components/ui';

// const events = eventsData as EventData;

export interface EventYearSectionProps {
  year: number;
  events: Event[];
  isDefaultExpanded?: boolean;
  className?: string;
}

const EventYearSection: React.FC<EventYearSectionProps> = ({
  year,
  events,
  isDefaultExpanded = false,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (events.length === 0) {
    return (
      <div className={className}>
        <button
          onClick={toggleExpanded}
          className="w-full flex items-center justify-between p-6 bg-surface-card/50 backdrop-blur-sm border border-border-default rounded-2xl hover:bg-white hover:text-black transition-all duration-300 group"
        >
          <div className="text-left">
            <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-black">
              {year}
            </h3>
            <p className="text-text-secondary text-sm group-hover:text-gray-600">
              No events yet for this year
            </p>
          </div>
          <ChevronDown className={`h-5 w-5 text-text-tertiary group-hover:text-black transition-all duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6">
                <EmptyState
                  title="No Events Yet"
                  description={`There are no events scheduled for ${year} yet. Check back soon for updates!`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between p-6 bg-surface-card/50 backdrop-blur-sm border border-border-default rounded-2xl hover:bg-white hover:text-black transition-all duration-300 group"
      >
        <div className="text-left">
          <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-black transition-colors">
            {year}
          </h3>
          <p className="text-text-secondary text-sm group-hover:text-gray-600">
            {events.length} {events.length === 1 ? 'event' : 'events'}
          </p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-5 w-5 text-text-tertiary group-hover:text-black transition-colors" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventYearSection;
