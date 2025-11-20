'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import EventYearSection from './EventYearSection';
import UpcomingEventCard from './UpcomingEventCard';
import { EmptyState, GradientText } from '@/components/ui';
import type { EventWithMeta, EventsResponse } from '@/types/event';

export interface EventGalleryProps {
  className?: string;
}

interface PastEventsByYear {
  year: number;
  events: EventWithMeta[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const EventGallery: React.FC<EventGalleryProps> = ({ className }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<EventWithMeta[]>([]);
  const [pastEvents, setPastEvents] = useState<EventWithMeta[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/events', {
          next: { revalidate: 60 },
        });

        if (!response.ok) {
          throw new Error('Failed to load events');
        }

        const payload = (await response.json()) as EventsResponse;
        if (!isMounted) return;

        setUpcomingEvents(payload.upcoming);
        setPastEvents(payload.past);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError('Unable to load events at this time.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const pastEventsByYear: PastEventsByYear[] = useMemo(() => {
    const grouped = pastEvents.reduce<Record<number, EventWithMeta[]>>((acc, event) => {
      if (!acc[event.year]) {
        acc[event.year] = [];
      }
      acc[event.year].push(event);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([year, events]) => ({
        year: Number(year),
        events: events.sort((a, b) => b.date.localeCompare(a.date)),
      }))
      .sort((a, b) => b.year - a.year);
  }, [pastEvents]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={cn('space-y-16', className)}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 font-display tracking-tight">
          <GradientText
            colors={['#BBD6FF', '#DCEBFF', '#A5C8F8', '#DCEBFF', '#BBD6FF']}
            animationSpeed={3}
            showBorder={false}
          >
            Events & Activities
          </GradientText>
        </h2>
        <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
          Join us for exciting calisthenics workshops, training sessions, and community events.
          Check out our past events and stay tuned for upcoming activities.
        </p>
      </motion.div>

      {/* Upcoming Events */}
      <motion.div variants={itemVariants}>
        <div className="mb-8">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center font-display tracking-tight">Upcoming Events</h3>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto">
              <EmptyState
                title="Unable to load events"
                description="Please refresh the page or try again later."
              />
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="max-w-md mx-auto">
              <UpcomingEventCard event={upcomingEvents[0]} />
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

      {/* Past Events */}
      <motion.div variants={itemVariants}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary-400 animate-spin" />
          </div>
        ) : error ? (
          <EmptyState
            title="Unable to load events"
            description="Please refresh the page or try again later."
          />
        ) : pastEventsByYear.length > 0 ? (
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center font-display tracking-tight">Past Events</h3>

            <div className="space-y-6">
              {pastEventsByYear.map((group, index) => (
                <EventYearSection
                  key={group.year}
                  year={group.year}
                  events={group.events}
                  isDefaultExpanded={index === 0}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <EmptyState
              title="No Past Events"
              description="We haven't held any events yet, but exciting activities are coming soon!"
            />
          </div>
        )}
      </motion.div>

      {/* Call to Action */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="bg-gradient-to-r from-primary-500/10 to-accent-blue/10 border border-primary-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-white mb-4">Stay Updated</h3>
          <p className="text-text-secondary mb-6">
            Follow us on Instagram and join our community to stay updated on upcoming events,
            workshops, and training sessions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://instagram.com/uacs_uoa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-white hover:text-black transition-all duration-300 font-medium border-2 border-white hover:border-primary-500"
            >
              Follow on Instagram
            </a>
            <a
              href="mailto:uoacalisthenicssociety@gmail.com"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-primary-400 rounded-lg hover:bg-white hover:text-black transition-all duration-300 font-medium"
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
