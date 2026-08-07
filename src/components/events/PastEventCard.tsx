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
          <div className="relative w-full h-48 overflow-hidden border-b border-white/5">
            <img
              src={event.eventPhotoUrl}
              alt={event.eventName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="relative w-full h-48 overflow-hidden bg-slate-950 flex items-center justify-center border-b border-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 via-[#0e0d1c] to-accent-blue/10" />
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#BBD6FF_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="p-3.5 rounded-full bg-white/5 border border-white/10 text-primary-300 shadow-md">
                <ImageIcon className="h-5 w-5" />
              </div>
              <span className="text-[11px] text-text-secondary/70 font-semibold tracking-wider uppercase">Gallery Coming Soon</span>
            </div>
          </div>
        )}

        {/* Event Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Event Title */}
          <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary-300 transition-colors tracking-tight font-display">
            {event.eventName}
          </h3>

          {/* Date & Time Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-text-secondary">
              <Calendar className="h-3 w-3 text-primary-400" />
              {formatDate(event.date)}
            </span>

            {formattedTime && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-text-secondary">
                <Clock className="h-3 w-3 text-primary-400" />
                {formattedTime}
              </span>
            )}

            {event.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-text-secondary max-w-full">
                <MapPin className="h-3 w-3 text-primary-400 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </span>
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
                w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm border
                ${hasValidDriveLink 
                  ? 'bg-primary-500/5 text-primary-300 hover:bg-white hover:text-black border-primary-500/30 hover:border-white shadow-sm hover:shadow-md' 
                  : 'bg-surface-card/40 text-text-tertiary/60 cursor-not-allowed border-border-default'
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

