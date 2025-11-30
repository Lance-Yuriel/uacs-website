'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink, ClipboardCheck } from 'lucide-react';
import { GradientText, TiltedCard } from '@/components/ui';
import { EventWithMeta } from '@/types/event';
import { formatDate, formatTime12Hour } from '@/lib/utils';

interface UpcomingEventCardProps {
  event: EventWithMeta;
  className?: string;
}

const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({ event, className }) => {
  const formattedTime = formatTime12Hour(event.time);

  const message =
    event.countdownMessage ??
    (event.daysUntil === null
      ? 'Stay tuned for more details.'
      : `${event.eventName} is coming soon!`);

  // Extract the number of days if available
  const daysMatch = message.match(/(\d+)\s+days?/i);
  const daysNumber = daysMatch ? daysMatch[1] : null;
  const isToday = event.isHappeningToday;

  // Check if description is empty
  const hasDescription = event.upcomingDescription && event.upcomingDescription.trim().length > 0;

  // Adjust top margin based on description presence
  // Only shift content down when description is completely empty
  const getCountdownTopMargin = () => {
    if (daysNumber && !isToday) {
      // When there's a countdown, use negative margin but adjust based on description
      if (!hasDescription) {
        return 'mt-2 md:mt-4'; // Push down when no description
      }
      return '-mt-6 md:-mt-8'; // Original negative margin when description exists
    }
    // When "Happening Today!" or no countdown, add margin if no description
    if (!hasDescription) {
      return 'mt-4 md:mt-6'; // Push down when no description
    }
    return ''; // Default spacing when description exists
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <TiltedCard
        backgroundColor="#0e0d1c"
        gradientColors={['#0e0d1c', '#0e0d1c']}
        altText={`${event.eventName} - Upcoming Event`}
        captionText={event.eventName}
        containerHeight="500px"
        containerWidth="100%"
        imageHeight="500px"
        imageWidth="100%"
        rotateAmplitude={8}
        scaleOnHover={1.02}
        showMobileWarning={false}
        showTooltip={false}
        displayOverlayContent={true}
      >
        <div className="px-8 md:px-10 py-5 md:py-6 flex flex-col items-center text-center h-full min-h-0">
          {/* Countdown Message - Hero Section */}
          <div className={`w-full space-y-1 flex-shrink-0 mb-3 ${getCountdownTopMargin()}`}>
            {daysNumber && !isToday ? (
              <div className="space-y-1">
                <div className="text-6xl md:text-7xl font-extrabold leading-none">
                  <GradientText
                    colors={['#BBD6FF', '#DCEBFF', '#A5C8F8', '#DCEBFF', '#BBD6FF']}
                    animationSpeed={3}
                    showBorder={false}
                  >
                    {daysNumber}
                  </GradientText>
                </div>
                <p className="text-lg md:text-xl text-text-secondary font-medium">
                  {daysNumber === '1' ? 'day until' : 'days until'}
                </p>
              </div>
            ) : isToday ? (
              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-extrabold leading-tight whitespace-nowrap pb-1">
                  <GradientText
                    colors={['#BBD6FF', '#DCEBFF', '#A5C8F8', '#DCEBFF', '#BBD6FF']}
                    animationSpeed={3}
                    showBorder={false}
                  >
                    Happening Today!
                  </GradientText>
                </div>
              </div>
            ) : (
              <p className="text-xl md:text-2xl text-text-secondary font-medium">
                {message}
              </p>
            )}
          </div>

          {/* Event Title - Large and Prominent */}
          <div className={`w-full flex-shrink-0 ${!hasDescription ? 'mb-5 md:mb-6' : 'mb-4'}`}>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight font-display tracking-tight">
              {event.eventName}
            </h2>
          </div>

          {/* Event Details - Subtle and Centered */}
          <div className={`w-full flex-shrink-0 ${!hasDescription ? 'mb-6 md:mb-8' : 'mb-5'}`}>
            {/* Date, Time, and Location on one line (wraps if needed) */}
            <div className="flex items-center justify-center gap-3 md:gap-4 text-text-secondary text-sm md:text-base flex-nowrap md:flex-wrap">
              <div className="flex items-center flex-shrink-0">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                <span>{formatDate(event.date)}</span>
              </div>
              {formattedTime && (
                <div className="flex items-center flex-shrink-0">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                  <span>{formattedTime}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center flex-shrink-0 min-w-0">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                  <span className="whitespace-normal break-words" title={event.location}>
                    {event.location}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Description - If Available */}
          {event.upcomingDescription && (
            <div className="w-full flex-shrink-0 mb-4 md:mb-5">
              <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto break-words line-clamp-3">
                {event.upcomingDescription}
              </p>
            </div>
          )}

          {/* CTA Button */}
          <div className="w-full pt-4 border-t border-border-default flex-shrink-0 mt-auto">
            {event.registrationLink ? (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all duration-300 bg-primary-500 text-white hover:bg-white hover:text-black border-2 border-primary-500 hover:border-white text-base"
              >
                <ClipboardCheck className="h-5 w-5" />
                Sign Up for Event
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all duration-300 bg-surface-card text-text-tertiary cursor-not-allowed border border-border-default text-base"
              >
                <ClipboardCheck className="h-5 w-5" />
                Registration Coming Soon
              </button>
            )}
          </div>
        </div>
      </TiltedCard>
    </motion.div>
  );
};

export default UpcomingEventCard;

