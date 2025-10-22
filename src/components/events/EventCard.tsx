'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Event } from '@/types/event';
import { formatDate } from '@/lib/utils';

export interface EventCardProps {
  event: Event;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className }) => {
  const handleViewPhotos = () => {
    if (event.googleDriveLink && event.googleDriveLink !== '[TO BE PROVIDED - Google Drive folder link]') {
      window.open(event.googleDriveLink, '_blank', 'noopener,noreferrer');
    }
  };

  const hasValidDriveLink = event.googleDriveLink && 
    event.googleDriveLink !== '[TO BE PROVIDED - Google Drive folder link]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <Card className="h-full group flex flex-col" hover={true}>
        <CardHeader className="pb-4">
          <div className="space-y-3">
            {/* Event Title */}
            <CardTitle className="text-xl group-hover:text-primary-400 transition-colors">
              {event.title}
            </CardTitle>
            
            {/* Date */}
            <div className="flex items-center text-text-secondary text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                {event.date === '[TO BE PROVIDED]' ? 'Date TBA' : event.date}
              </span>
            </div>

            {/* Attendees (if available) */}
            {event.attendees && (
              <div className="flex items-center text-text-secondary text-sm">
                <Users className="h-4 w-4 mr-2" />
                <span>{event.attendees} attendees</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-grow space-y-4">
          {/* Description */}
          <div>
            <p className="text-text-secondary text-sm leading-relaxed">
              {event.description === '[TO BE PROVIDED - Real description of the event]' 
                ? 'Event description coming soon...' 
                : event.description
              }
            </p>
          </div>

          {/* Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Event Highlights</h4>
              <ul className="space-y-1">
                {event.highlights.map((highlight, index) => (
                  <li key={index} className="text-text-secondary text-sm flex items-start">
                    <span className="text-primary-400 mr-2 mt-1">•</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Spacer to push button to bottom */}
          <div className="flex-grow"></div>

          {/* View Photos Button */}
          <div className="pt-4 border-t border-border-default">
            <button
              onClick={handleViewPhotos}
              disabled={!hasValidDriveLink}
              className={`
                w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors
                ${hasValidDriveLink 
                  ? 'bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 hover:text-primary-300 border border-primary-500/30' 
                  : 'bg-surface-card text-text-tertiary cursor-not-allowed border border-border-default'
                }
              `}
            >
              <ImageIcon className="h-4 w-4" />
              {hasValidDriveLink ? 'View Photos' : 'Photos Coming Soon'}
              {hasValidDriveLink && <ExternalLink className="h-3 w-3" />}
            </button>
            
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EventCard;
