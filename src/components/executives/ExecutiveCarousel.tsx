'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ExecutiveCard from './ExecutiveCard';
import { Executive } from '@/types/executive';

export interface ExecutiveCarouselProps {
  executives: Executive[];
  className?: string;
}

const ExecutiveCarousel: React.FC<ExecutiveCarouselProps> = ({ executives, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [centeredCardIndex, setCenteredCardIndex] = useState(executives.length); // Start at middle section, card 0
  const centeredCardIndexRef = useRef(executives.length); // Ref for synchronous access
  const updateIndexRef = useRef<(() => void) | null>(null);
  const isJumpingRef = useRef(false); // Track if we're currently jumping to prevent loops
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Track when scrolling has settled

  const getCardScrollPosition = (cardIndex: number, section: number = 1) => {
    if (!containerRef.current) return 0;
    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const padding = 16; // px-16 = 1rem
    const gap = 24; // gap-6 = 1.5rem
    const visibleWidth = containerWidth - padding * 2;
    const cardWidth = visibleWidth / 3;
    // Calculate scroll position: section * total_width + card_index * (cardWidth + gap) + padding
    const totalCardsInSection = executives.length;
    const sectionStart = section * totalCardsInSection * (cardWidth + gap);
    const cardOffset = cardIndex * (cardWidth + gap);
    return sectionStart + cardOffset + padding;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateIndex = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.offsetWidth;
      const padding = 16;
      const gap = 24;
      const visibleWidth = containerWidth - padding * 2;
      const cardWidth = visibleWidth / 3;
      
      if (cardWidth <= 0) return;
      
      // Calculate which card is visually centered (same logic as isCenter in map)
      // Viewport center in scroll coordinates
      const viewportCenter = scrollLeft + (containerWidth / 2);
      // Position of viewport center relative to content start (accounting for padding)
      const contentCenterPosition = viewportCenter - padding;
      // Which card index this center position falls on (in the infinite array)
      const calculatedCenteredIndex = Math.round(contentCenterPosition / (cardWidth + gap));
      
      // Handle infinite loop seamlessly - check when scroll has settled
      const totalCards = executives.length;
      const middleSectionStart = totalCards;
      const middleSectionEnd = totalCards * 2;
      
      // Update state immediately if we're in the safe zone (middle section) for instant emphasis
      // Also handle boundary cases (just outside middle section) to prevent jitter during transitions
      const isInMiddleSection = calculatedCenteredIndex >= middleSectionStart && calculatedCenteredIndex < middleSectionEnd;
      // Allow updates when just outside middle section (within 1 card) during transitions between boundary cards
      const isNearMiddleSection = calculatedCenteredIndex >= (middleSectionStart - 1) && calculatedCenteredIndex < (middleSectionEnd + 1);
      
      // Update immediately if in safe zone OR near boundary during transition (to prevent jitter)
      if (isInMiddleSection || isNearMiddleSection) {
        // Update if absolute index changed (emphasis uses absolute index)
        if (calculatedCenteredIndex !== centeredCardIndexRef.current) {
          setCenteredCardIndex(calculatedCenteredIndex);
        }
      }
      
      // Always update ref immediately for accurate tracking
      centeredCardIndexRef.current = calculatedCenteredIndex;
      
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Debounce the jump check - only jump after scrolling has settled slightly
      // This allows smooth scroll animations to complete before we jump, making it seamless
      scrollTimeoutRef.current = setTimeout(() => {
        if (!containerRef.current || isJumpingRef.current) return;
        
        const container = containerRef.current;
        const currentScrollLeft = container.scrollLeft;
        const currentViewportCenter = currentScrollLeft + (containerWidth / 2);
        const currentContentCenterPosition = currentViewportCenter - padding;
        const currentCalculatedIndex = Math.round(currentContentCenterPosition / (cardWidth + gap));
        
        // Check if we need to jump (after scroll has settled)
        // Only jump if we're clearly outside the middle section by more than 1 card
        // This prevents jittery jumps during transitions between boundary cards
        const isFarFromMiddleSection = currentCalculatedIndex < (middleSectionStart - 1) || currentCalculatedIndex >= (middleSectionEnd + 1);
        
        if (isFarFromMiddleSection) {
          isJumpingRef.current = true;
          
          // Calculate relative position
          const relativeIndex = currentCalculatedIndex % totalCards;
          const normalizedRelative = relativeIndex < 0 ? totalCards + relativeIndex : relativeIndex;
          // Map to middle section
          const targetIndex = totalCards + normalizedRelative;
          
          // Calculate exact scroll position for this card in middle section
          const cardStartPosition = targetIndex * (cardWidth + gap);
          const cardCenterPosition = cardStartPosition + (cardWidth / 2);
          const viewportCenter = containerWidth / 2;
          const newScroll = cardCenterPosition - viewportCenter + padding;
          
          // Use instant jump when scroll has settled
          container.style.scrollBehavior = 'auto';
          container.scrollLeft = newScroll;
          
          // Always update state after jump to ensure emphasis is correct
          // Always update ref and state to reflect the new position
          // The map function uses centeredCardIndex (state) with absolute index to determine which card is centered
          centeredCardIndexRef.current = targetIndex;
          setCenteredCardIndex(targetIndex);
          
          // Reset smooth behavior and jumping flag
          requestAnimationFrame(() => {
            if (containerRef.current) {
              containerRef.current.style.scrollBehavior = 'smooth';
              isJumpingRef.current = false;
            }
          });
        } else {
          // Not jumping, update state to ensure emphasis is correct
          // Check if we're in middle section or near boundary
          const isInMiddleSection = currentCalculatedIndex >= middleSectionStart && currentCalculatedIndex < middleSectionEnd;
          
          if (isInMiddleSection) {
            // In middle section - update if absolute index changed
            // If we already updated immediately, this might be redundant but React batches it
            if (currentCalculatedIndex !== centeredCardIndex) {
              setCenteredCardIndex(currentCalculatedIndex);
            }
            centeredCardIndexRef.current = currentCalculatedIndex;
          } else {
            // Near boundary - didn't update immediately, update now
            // Also check if relative index changed to avoid unnecessary updates
            const relativeIndexChanged = ((currentCalculatedIndex % totalCards) + totalCards) % totalCards !== ((centeredCardIndexRef.current % totalCards) + totalCards) % totalCards;
            
            if (relativeIndexChanged) {
              setCenteredCardIndex(currentCalculatedIndex);
              centeredCardIndexRef.current = currentCalculatedIndex;
            } else {
              // Same relative card, just sync ref
              centeredCardIndexRef.current = currentCalculatedIndex;
            }
          }
        }
      }, 30); // Short delay to let smooth scroll settle slightly - makes jump seamless but keeps animation instant
      
      // Calculate relative index (0 to executives.length - 1)
      const finalRelativeIndex = calculatedCenteredIndex % executives.length;
      const finalIndex = finalRelativeIndex < 0 ? executives.length + finalRelativeIndex : finalRelativeIndex;
      setCurrentIndex(finalIndex);
    };

    updateIndexRef.current = updateIndex;
    container.addEventListener('scroll', updateIndex);
    
    // Initialize scroll position to center card at index 0
    // Display order should be: [last_card, card_0, card_1]
    // Card 0 from middle section should be centered
    const initializeScroll = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const padding = 16;
      const gap = 24;
      const visibleWidth = containerWidth - padding * 2;
      const cardWidth = visibleWidth / 3;
      
      if (containerWidth > 0 && cardWidth > 0) {
        // We want to center card 0 from the middle section
        // In the tripled array, card 0 is at index: executives.length (middle section start)
        // To show [last_card, card_0, card_1], card 0 needs to be centered
        const middleSectionStart = executives.length;
        const targetCardIndex = middleSectionStart; // Card 0 in middle section
        
        // Calculate scroll position to center this card
        // Position of card start: targetCardIndex * (cardWidth + gap)
        // To center it: scroll to position where card center aligns with viewport center
        const cardStartPosition = targetCardIndex * (cardWidth + gap);
        const cardCenterPosition = cardStartPosition + (cardWidth / 2);
        const viewportCenter = containerWidth / 2;
        const targetScroll = cardCenterPosition - viewportCenter + padding;
        
        container.scrollLeft = targetScroll;
        setCurrentIndex(0);
        setCenteredCardIndex(middleSectionStart); // Set initial centered card index
        centeredCardIndexRef.current = middleSectionStart; // Set ref synchronously
        
        // Verify after snap takes effect
        setTimeout(() => {
          if (containerRef.current) {
            updateIndex();
          }
        }, 200);
      } else {
        requestAnimationFrame(initializeScroll);
      }
    };

    // Use timeout to ensure layout is fully complete
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(initializeScroll);
      });
    }, 50);
    
    return () => {
      clearTimeout(timeoutId);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      container.removeEventListener('scroll', updateIndex);
    };

  }, [executives.length]);

  const scrollToIndex = (index: number, useMiddleSection: boolean = true) => {
    if (!containerRef.current) return;
    const section = useMiddleSection ? 1 : 0;
    const scrollPosition = getCardScrollPosition(index, section);
    
    containerRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  const handlePrev = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const padding = 16;
    const gap = 24;
    const visibleWidth = containerWidth - padding * 2;
    const cardWidth = visibleWidth / 3;
    const scrollDistance = cardWidth + gap;
    
    if (cardWidth <= 0) return;
    
    // Continuous scrolling: scroll relative to current position
    const newScroll = container.scrollLeft - scrollDistance;
    container.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
  };

  const handleNext = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const padding = 16;
    const gap = 24;
    const visibleWidth = containerWidth - padding * 2;
    const cardWidth = visibleWidth / 3;
    const scrollDistance = cardWidth + gap;
    
    if (cardWidth <= 0) return;
    
    // Continuous scrolling: scroll relative to current position
    const newScroll = container.scrollLeft + scrollDistance;
    container.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
  };

  // Create infinite loop by tripling the array
  const infiniteExecutives = [...executives, ...executives, ...executives];

  return (
    <div className={`relative ${className || ''}`}>
      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-surface-card/90 backdrop-blur-sm border border-border-default rounded-full p-3 md:p-3 transition-all duration-300 shadow-lg group hover:bg-primary-500/25 hover:border-primary-400 hover:shadow-primary-500/40 hover:shadow-2xl hover:scale-110 active:scale-95 touch-manipulation"
        aria-label="Previous executive"
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        <ChevronLeft className="h-5 w-5 md:h-5 md:w-5 text-white group-hover:text-primary-200 transition-colors duration-300" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-surface-card/90 backdrop-blur-sm border border-border-default rounded-full p-3 md:p-3 transition-all duration-300 shadow-lg group hover:bg-primary-500/25 hover:border-primary-400 hover:shadow-primary-500/40 hover:shadow-2xl hover:scale-110 active:scale-95 touch-manipulation"
        aria-label="Next executive"
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        <ChevronRight className="h-5 w-5 md:h-5 md:w-5 text-white group-hover:text-primary-200 transition-colors duration-300" />
      </button>

      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 sm:px-8 md:px-16 py-4"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x',
        } as React.CSSProperties}
        onScroll={() => updateIndexRef.current?.()}
      >
        {infiniteExecutives.map((executive, index) => {
          const position = index % executives.length;
          // Determine if this card instance is in the visual center
          // Use the state value which is updated by updateIndex
          const tolerance = 0.5;
          const isCenter = Math.abs(index - centeredCardIndex) < tolerance;
          
          return (
            <div
              key={`${executive.id}-${index}`}
              className="flex-shrink-0 snap-center w-[85%] sm:w-[70%] md:w-[48%] lg:w-[35%] px-2"
              style={{
                transform: isCenter ? 'scale(1)' : 'scale(0.85)',
                opacity: isCenter ? 1 : 0.6,
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
              }}
            >
              <ExecutiveCard executive={executive} />
            </div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {executives.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`h-2 rounded-full transition-all touch-manipulation ${
              index === currentIndex
                ? 'bg-primary-500 w-8'
                : 'bg-border-default w-2 hover:bg-border-emphasis'
            }`}
            aria-label={`Go to executive ${index + 1}`}
            style={{ minWidth: '32px', minHeight: '32px', padding: '8px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default ExecutiveCarousel;
