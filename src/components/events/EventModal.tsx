'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { EventWithMeta } from '@/types/event';
import { formatDate, formatTime12Hour } from '@/lib/utils';

interface EventModalProps {
  event: EventWithMeta;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const [mounted, setMounted] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = React.useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleExitComplete = React.useCallback(() => {
    onClose();
  }, [onClose]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [handleClose]);

  if (!mounted) return null;

  const formattedTime = formatTime12Hour(event.time);
  const hasValidDriveLink = event.googleDriveLink && 
    event.googleDriveLink !== '[TO BE PROVIDED - Google Drive folder link]';

  const modalContent = (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      {isVisible && (
        <>
          <motion.div
            key="event-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          <motion.div
            key="event-modal-container"
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-[500px] bg-[#0e0d1ce8] backdrop-blur-xl border border-[#BBD6FF]/20 rounded-2xl z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(187,214,255,0.15)] flex flex-col max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6 md:p-8 w-full h-full flex flex-col overflow-hidden">
              {/* Circular Glass Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all duration-300 z-30 hover:scale-110 active:scale-95 shadow-md"
                aria-label="Close modal"
                style={{ minWidth: '40px', minHeight: '40px' }}
              >
                <X className="h-4 w-4" />
              </button>

              <div 
                id="event-modal-scroll-container"
                className="flex-1 overflow-y-auto scroll-smooth pr-1 -mr-1" 
                style={{ 
                  scrollBehavior: 'smooth'
                } as React.CSSProperties}
              >
                <div className="pr-1 flex flex-col gap-6">
                  {/* Event Image Banner */}
                  {event.eventPhotoUrl ? (
                    <div className="relative w-full h-64 overflow-hidden rounded-xl border border-white/5 shadow-inner">
                      <img
                        src={event.eventPhotoUrl}
                        alt={event.eventName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d1c] via-[#0e0d1c]/10 to-transparent" />
                    </div>
                  ) : (
                    <div className="relative w-full h-64 overflow-hidden bg-slate-950 flex items-center justify-center rounded-xl border border-white/5">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-[#0e0d1c] to-accent-blue/20" />
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#BBD6FF_1px,transparent_1px)] [background-size:20px_20px]" />
                      <div className="absolute w-40 h-40 -top-10 -left-10 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
                      <div className="absolute w-40 h-40 -bottom-10 -right-10 bg-accent-blue/10 rounded-full blur-3xl animate-pulse" />
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-primary-300 shadow-xl backdrop-blur-sm">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] text-text-secondary/80 font-bold tracking-wider uppercase">UACS Club Event</span>
                      </div>
                    </div>
                  )}

                  {/* Event Content Header */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight leading-tight">
                      {event.eventName}
                    </h2>
                  </div>

                  {/* Metadata Detail Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Date */}
                    <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 shadow-sm">
                      <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Date</span>
                        <span className="text-sm font-semibold text-white/90">{formatDate(event.date)}</span>
                      </div>
                    </div>

                    {/* Time */}
                    {formattedTime && (
                      <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 shadow-sm">
                        <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Time</span>
                          <span className="text-sm font-semibold text-white/90">{formattedTime}</span>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 shadow-sm sm:col-span-2">
                        <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0 w-full">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Location</span>
                          <span className="text-sm font-semibold text-white/90 break-words leading-snug">{event.location}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description Detail Section */}
                  {event.description && (
                    <div className="space-y-2.5 bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 shadow-inner">
                      <h4 className="text-xs uppercase font-bold tracking-wider text-text-tertiary">About the Event</h4>
                      <p className="text-sm sm:text-base text-text-secondary leading-relaxed break-words whitespace-pre-line">
                        {event.description}
                      </p>
                    </div>
                  )}

                  {/* View Photos Button */}
                  {hasValidDriveLink && (
                    <div className="pt-4 border-t border-border-default mt-auto">
                      <a
                        href={event.googleDriveLink!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 bg-primary-500/5 text-primary-300 hover:bg-white hover:text-black border border-primary-500/30 hover:border-white shadow-sm hover:shadow-md text-sm"
                      >
                        <span>View Event Photos</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default EventModal;

