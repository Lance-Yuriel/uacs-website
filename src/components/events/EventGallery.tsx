'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import PastEventCard from './PastEventCard';
import EventModal from './EventModal';
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
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventWithMeta | null>(null);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const yearDropdownRef = useRef<HTMLDivElement>(null);

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

  // Set default selected year to the latest year
  useEffect(() => {
    if (pastEventsByYear.length > 0 && selectedYear === null) {
      setSelectedYear(pastEventsByYear[0].year);
    }
  }, [pastEventsByYear, selectedYear]);

  const filteredEvents = useMemo(() => {
    if (selectedYear === null) return [];
    const yearGroup = pastEventsByYear.find(group => group.year === selectedYear);
    return yearGroup?.events || [];
  }, [pastEventsByYear, selectedYear]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setIsYearDropdownOpen(false);
      }
    };

    if (isYearDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isYearDropdownOpen]);

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <h3 className="text-3xl md:text-4xl font-bold text-white text-center md:text-left font-display tracking-tight">
                Past Events
              </h3>
              
              {/* Year Selector Dropdown */}
              <div className="flex items-center gap-3 justify-center md:justify-end" ref={yearDropdownRef}>
                <span className="text-text-secondary text-sm">Year:</span>
                <div className="relative z-50">
                  <button
                    onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 text-sm",
                      "bg-surface-card/70 backdrop-blur-sm text-white/90 border border-border-default hover:border-primary-400/60",
                      "min-w-[120px] justify-between shadow-sm hover:shadow-md",
                      "hover:bg-surface-card/80",
                      isYearDropdownOpen && "border-primary-400/80 bg-surface-card/90"
                    )}
                  >
                    <span className={cn(
                      "transition-colors duration-200",
                      selectedYear ? "text-white" : "text-text-secondary"
                    )}>
                      {selectedYear || 'Select year'}
                    </span>
                    <ChevronDown 
                      className={cn(
                        "h-4 w-4 text-text-secondary transition-all duration-300 flex-shrink-0",
                        isYearDropdownOpen && "rotate-180"
                      )} 
                    />
                  </button>

                  {/* Backdrop when dropdown is open */}
                  <AnimatePresence>
                    {isYearDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setIsYearDropdownOpen(false)}
                      />
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {isYearDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 mt-2 w-full min-w-[120px] bg-surface-card border border-primary-400/40 rounded-lg shadow-2xl z-50 overflow-hidden backdrop-blur-sm"
                        style={{ 
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <div className="max-h-[200px] overflow-y-auto">
                          {pastEventsByYear.map((group) => (
                            <button
                              key={group.year}
                              onClick={() => {
                                setSelectedYear(group.year);
                                setIsYearDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full text-left px-4 py-2.5 text-sm transition-colors duration-200",
                                "hover:bg-primary-500/20 hover:text-white",
                                selectedYear === group.year
                                  ? "bg-primary-500/30 text-primary-300 font-semibold"
                                  : "text-text-secondary"
                              )}
                            >
                              {group.year}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length > 0 ? (
              <div className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative",
                isYearDropdownOpen && "z-0"
              )}>
                {filteredEvents.map((event) => (
                  <PastEventCard
                    key={event.id}
                    event={event}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <EmptyState
                  title="No Events"
                  description={`No events found for ${selectedYear}.`}
                />
              </div>
            )}
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

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Call to Action */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="bg-gradient-to-r from-primary-500/10 to-accent-blue/10 border-2 border-[#BBD6FF] rounded-2xl p-8 max-w-2xl mx-auto shadow-[0_0_12px_rgba(187,214,255,0.5)]">
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
