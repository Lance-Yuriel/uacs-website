'use client';

import type { SpringOptions } from 'framer-motion';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface TiltedCardProps {
  backgroundColor?: string;
  gradientColors?: string[];
  altText?: string;
  captionText?: string;
  containerHeight?: React.CSSProperties['height'];
  containerWidth?: React.CSSProperties['width'];
  imageHeight?: React.CSSProperties['height'];
  imageWidth?: React.CSSProperties['width'];
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  children?: React.ReactNode;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltedCard({
  backgroundColor = 'rgba(24, 24, 27, 0.8)',
  gradientColors = ['rgba(24, 24, 27, 0.8)', 'rgba(39, 39, 42, 0.6)'],
  altText = 'Tilted card',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '100%',
  scaleOnHover = 1.05,
  rotateAmplitude = 12,
  showMobileWarning = false,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = true,
  children
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  const backgroundStyle = gradientColors.length > 1 
    ? `linear-gradient(135deg, ${gradientColors.join(', ')})`
    : backgroundColor;

  return (
    <figure
      ref={ref}
      className={`relative w-full [perspective:800px] flex flex-col items-center justify-center ${containerHeight === 'auto' ? '' : 'h-full'}`}
      style={{
        height: containerHeight === 'auto' ? undefined : containerHeight,
        width: containerWidth
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d] rounded-2xl overflow-hidden border-2 border-[#BBD6FF] shadow-[0_0_12px_rgba(187,214,255,0.5)]"
        style={{
          width: imageWidth,
          height: imageHeight === 'auto' ? undefined : imageHeight,
          minHeight: imageHeight === 'auto' ? '100%' : undefined,
          rotateX,
          rotateY,
          scale,
          background: backgroundStyle
        }}
      >
        {/* Background layer */}
        <div 
          className="absolute inset-0"
          style={{
            background: backgroundStyle
          }}
        />

        {/* Content layer */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-8 pb-8 px-6">
          {children || overlayContent}
        </div>
      </motion.div>

      {showTooltip && captionText && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[3] hidden sm:block"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
