'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { EventWithMeta } from '@/types/event';
import { formatDate, formatTime12Hour } from '@/lib/utils';

export interface PastEventCardProps {
  event: EventWithMeta;
  className?: string;
  onClick?: () => void;
}

const PastEventCard: React.FC<PastEventCardProps> = ({ event, className, onClick }) => {
  const formattedTime = formatTime12Hour(event.time);
  const hasValidDriveLink = event.googleDriveLink && 
    event.googleDriveLink !== '[TO BE PROVIDED - Google Drive folder link]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div
        className="group border-2 border-[#BBD6FF] rounded-2xl overflow-hidden hover:border-primary-400/60 transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full flex flex-col shadow-[0_0_12px_rgba(187,214,255,0.5)]"
        style={{ backgroundColor: '#0e0d1c' }}
        onClick={onClick}
      >
        {/* Event Image */}
        {event.eventPhotoUrl ? (
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={event.eventPhotoUrl}
              alt={event.eventName}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="relative w-full h-48 bg-gradient-to-br from-primary-500/20 to-accent-blue/20 flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-text-tertiary/40" />
          </div>
        )}

        {/* Event Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Event Title */}
          <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-primary-300 transition-colors">
            {event.eventName}
          </h3>

          {/* Date & Time */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-text-secondary text-sm">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{formatDate(event.date)}</span>
            </div>

            {formattedTime && (
              <div className="flex items-center text-text-secondary text-sm">
                <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{formattedTime}</span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center text-text-secondary text-sm">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-grow"></div>

          {/* Action Button */}
          <div className="pt-4 border-t border-border-default mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (hasValidDriveLink) {
                  window.open(event.googleDriveLink!, '_blank', 'noopener,noreferrer');
                }
              }}
              disabled={!hasValidDriveLink}
              className={`
                w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 text-sm
                ${hasValidDriveLink 
                  ? 'bg-primary-500/10 text-primary-400 hover:bg-white hover:text-black border border-primary-500/30 hover:border-primary-500' 
                  : 'bg-surface-card text-text-tertiary cursor-not-allowed border border-border-default'
                }
              `}
            >
              {hasValidDriveLink ? (
                <>
                  <span>View Photos</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  <span>Photos Coming Soon</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PastEventCard;

