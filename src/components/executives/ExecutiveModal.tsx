'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Executive } from '@/types/executive';
import ExecutiveProfileContent from '@/components/executives/ExecutiveProfileContent';

interface ExecutiveModalProps {
  executive: Executive;
  onClose: () => void;
}

const ExecutiveModal: React.FC<ExecutiveModalProps> = ({ executive, onClose }) => {
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

  const modalContent = (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      {isVisible && (
        <>
          <motion.div
            key="executive-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          <motion.div
            key="executive-modal-container"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed left-2 right-2 sm:left-4 sm:right-4 md:left-16 md:right-16 lg:left-24 lg:right-24 xl:left-32 xl:right-32 top-4 sm:top-8 md:top-16 bottom-4 sm:bottom-8 md:bottom-12 bg-[#0e0d1c] border border-white/20 rounded-xl sm:rounded-2xl z-[100] max-w-[800px] mx-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ overflow: 'visible' }}
          >
            <div className="relative p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-none h-full flex flex-col rounded-xl sm:rounded-2xl overflow-hidden">
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 p-2 sm:p-2.5 rounded-lg bg-surface-card/50 backdrop-blur-sm border border-white/20 transition-all duration-300 group z-10 hover:bg-primary-500/25 hover:border-primary-400 hover:shadow-primary-500/40 hover:shadow-2xl hover:scale-110 active:scale-95 touch-manipulation"
                aria-label="Close modal"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-text-secondary group-hover:text-primary-200 transition-all duration-300 group-hover:scale-125 group-hover:rotate-90" />
              </button>

              <div 
                id="executive-modal-scroll-container"
                className="flex-1 overflow-y-auto scroll-smooth pr-2 -mr-2" 
                style={{ 
                  scrollBehavior: 'smooth'
                } as React.CSSProperties}
              >
                <div className="pr-2">
                  <ExecutiveProfileContent executive={executive} />
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

export default ExecutiveModal;

