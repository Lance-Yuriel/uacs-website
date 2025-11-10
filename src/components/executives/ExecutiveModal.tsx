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
            className="fixed left-4 right-4 md:left-16 md:right-16 lg:left-24 lg:right-24 xl:left-32 xl:right-32 top-16 md:top-16 bottom-8 md:bottom-12 bg-[#1a1a1a] border border-white/20 rounded-2xl z-[100] overflow-hidden max-w-[800px] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-4 md:p-6 lg:p-8 w-full max-w-none h-full flex flex-col">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-lg bg-surface-card/50 backdrop-blur-sm border border-white/20 hover:bg-primary-500/20 hover:border-primary-400 transition-all duration-200 group z-10"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-text-secondary group-hover:text-primary-400 transition-colors" />
              </button>

              <div className="flex-1 overflow-y-auto">
                <ExecutiveProfileContent executive={executive} />
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

