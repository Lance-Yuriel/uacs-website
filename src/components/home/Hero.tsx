'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui';
import HeroMemberCount from './HeroMemberCount';
import siteConfig from '@/data/siteConfig.json';
import navigationData from '@/data/navigation.json';
import { SiteConfig } from '@/types/site';
import { NavigationData } from '@/types/navigation';

const site = siteConfig as SiteConfig;
const navigation = navigationData as NavigationData;

export interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  const scrollToEvents = () => {
    const eventsSection = document.getElementById('events');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.8
      }
    }
  };

  return (
    <section
      id="hero"
      data-section="hero"
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${className || ''}`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent opacity-50" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
          >
            <span className="gradient-text">
              {site.abbreviation}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl font-light text-text-secondary max-w-3xl mx-auto leading-relaxed"
          >
            {site.name}
          </motion.p>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-text-tertiary max-w-2xl mx-auto leading-relaxed"
          >
            {site.tagline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={buttonVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Button
              href={navigation.ctaButton.href}
              external={navigation.ctaButton.external}
              variant="primary"
              size="lg"
              className="min-w-[200px] font-semibold text-lg px-8 py-4"
            >
              {navigation.ctaButton.label}
            </Button>
            
            <Button
              onClick={scrollToEvents}
              variant="secondary"
              size="lg"
              className="min-w-[200px] font-semibold text-lg px-8 py-4"
            >
              Learn More
            </Button>
          </motion.div>

          {/* Member Count */}
          <HeroMemberCount />

          {/* Founded info */}
          <motion.div
            variants={itemVariants}
            className="pt-4"
          >
            <p className="text-text-muted text-sm">
              Founded in {site.founded} • University of Auckland
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <button
          onClick={scrollToEvents}
          className="flex flex-col items-center text-text-tertiary hover:text-text-secondary transition-colors group"
          aria-label="Scroll to next section"
        >
          <span className="text-sm mb-2">Discover More</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-6 w-6 group-hover:text-primary-400 transition-colors" />
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
};

export default Hero;
