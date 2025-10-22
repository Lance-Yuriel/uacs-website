'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import EventYearSection from './EventYearSection';
import { EventData, UpcomingEventData } from '@/types/event';
import { EmptyState } from '@/components/ui';
import eventsData from '@/data/events.json';
import upcomingEventsData from '@/data/upcoming-events.json';

const events = eventsData as EventData;
const upcomingEvents = upcomingEventsData as UpcomingEventData;

export interface EventGalleryProps {
  className?: string;
}

const EventGallery: React.FC<EventGalleryProps> = ({ className }) => {
  // Group events by year, filtering out placeholder events
  const eventsByYear = events.events.reduce((acc, event) => {
    if (!acc[event.year]) {
      acc[event.year] = [];
    }
    // Only add non-placeholder events to the array
    if (!(event as any).isPlaceholder) {
      acc[event.year].push(event);
    }
    return acc;
  }, {} as Record<number, typeof events.events>);

  // Get years in descending order (most recent first)
  const years = Object.keys(eventsByYear)
    .map(Number)
    .sort((a, b) => b - a);

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
            Events & Activities
          </h2>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
            Join us for exciting calisthenics workshops, training sessions, and community events. 
            Check out our past events and stay tuned for upcoming activities.
          </p>
        </motion.div>

        {/* Upcoming Events Section */}
        <motion.div variants={itemVariants}>
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Upcoming Events
            </h3>
            
            {upcomingEvents.events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Render upcoming events here when they exist */}
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <EmptyState
                  title="No Upcoming Events"
                  description="There are no upcoming events right now. Check back soon for new activities and workshops!"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Past Events Section */}
        <motion.div variants={itemVariants}>
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Past Events
            </h3>
            
            {years.length > 0 ? (
              <div className="space-y-6">
                {years.map((year, index) => (
                  <EventYearSection
                    key={year}
                    year={year}
                    events={eventsByYear[year]}
                    isDefaultExpanded={index === 0} // Expand most recent year by default
                  />
                ))}
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <EmptyState
                  title="No Past Events"
                  description="We haven't held any events yet, but exciting activities are coming soon!"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="bg-gradient-to-r from-primary-500/10 to-accent-blue/10 border border-primary-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-text-secondary mb-6">
              Follow us on Instagram and join our community to stay updated on upcoming events, 
              workshops, and training sessions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://instagram.com/uacs_uoa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium border-2 border-white"
              >
                Follow on Instagram
              </a>
              <a
                href="mailto:uoacalisthenicssociety@gmail.com"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-primary-400 rounded-lg hover:bg-primary-500/10 transition-colors font-medium"
              >
                Contact Us
              </a>
            </div>
          </div>
        </motion.div>
    </motion.div>
  );
};

export default EventGallery;
