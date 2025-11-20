'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Sparkles, ExternalLink, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <Card className="h-full group bg-surface-card/70 backdrop-blur border border-border-default hover:border-primary-400/60 transition-all duration-300 hover:scale-[1.02]">
        <CardHeader className="pb-4 space-y-3">
          <CardTitle className="text-xl group-hover:text-primary-300 transition-colors">
            {event.eventName}
          </CardTitle>

          <div className="flex items-center text-text-secondary text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>

          {formattedTime && (
            <div className="flex items-center text-text-secondary text-sm">
              <Clock className="h-4 w-4 mr-2" />
              <span>{formattedTime}</span>
            </div>
          )}

          {event.location && (
            <div className="flex items-center text-text-secondary text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.location}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          <div className="flex items-start gap-3 rounded-lg bg-primary-500/10 p-4 border border-primary-500/20">
            <Sparkles className="h-5 w-5 text-primary-300 mt-1" />
            <div>
              <p className="text-sm text-primary-100 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {event.description && (
            <p className="text-sm text-text-secondary leading-relaxed">
              {event.description}
            </p>
          )}

          <div className="pt-4 border-t border-border-default">
            {event.registrationLink ? (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 bg-primary-500/10 text-primary-400 hover:bg-white hover:text-black border border-primary-500/30 hover:border-primary-500"
              >
                <ClipboardCheck className="h-4 w-4" />
                Sign Up for Event
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 bg-surface-card text-text-tertiary cursor-not-allowed border border-border-default"
              >
                <ClipboardCheck className="h-4 w-4" />
                Registration Coming Soon
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UpcomingEventCard;

