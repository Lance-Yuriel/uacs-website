'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Target, Users, Calendar, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, GradientText, TiltedCard } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface AboutProps {
  className?: string;
}

const About: React.FC<AboutProps> = ({ className }) => {
  const features = [
    {
      icon: Target,
      title: 'Skill Development',
      description: 'Master calisthenics fundamentals and advanced techniques with structured progression.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Join a supportive community of like-minded individuals passionate about bodyweight training.'
    },
    {
      icon: Calendar,
      title: 'Regular Sessions',
      description: 'Training sessions and workshops to keep you motivated and progressing.'
    },
    {
      icon: Trophy,
      title: 'All Skill Levels',
      description: 'From beginners to advanced practitioners, everyone is welcome to join and grow.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={cn("space-y-16", className)}
    >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            <GradientText
              colors={['#BBD6FF', '#DCEBFF', '#A5C8F8', '#DCEBFF', '#BBD6FF']}
              animationSpeed={3}
              showBorder={false}
              className=""
            >
              Who We Are
            </GradientText>
          </h2>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
            The University of Auckland Calisthenics Society is a student-led club
            dedicated to promoting bodyweight training and building a strong, supportive 
            fitness community across all skill levels.
          </p>
        </motion.div>

        {/* Group Photo */}
        <motion.div variants={itemVariants} className="w-full">
          <div className="relative w-full max-w-4xl mx-auto">
            <Image
              src="/images/about/group-photo.jpg"
              alt="UACS Group Photo - Members posing in the gym"
              width={1200}
              height={675}
              className="rounded-2xl shadow-2xl object-cover w-full h-auto"
              priority
            />
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="group h-full"
                >
                  <TiltedCard
                    backgroundColor="rgba(24, 24, 27, 0.8)"
                    gradientColors={['rgba(24, 24, 27, 0.8)', 'rgba(39, 39, 42, 0.6)']}
                    altText={`${feature.title} - UACS`}
                    captionText={feature.title}
                    containerHeight="280px"
                    containerWidth="100%"
                    imageHeight="280px"
                    imageWidth="100%"
                    rotateAmplitude={12}
                    scaleOnHover={1.05}
                    showMobileWarning={false}
                    showTooltip={false}
                    displayOverlayContent={true}
                  >
                    <div className="text-center space-y-4">
                      <div className="mx-auto mb-4 p-4 bg-primary-500/10 rounded-full w-fit group-hover:bg-primary-500/20 transition-colors">
                        <IconComponent className="h-8 w-8 text-primary-400 group-hover:text-primary-300 transition-colors" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </TiltedCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
    </motion.div>
  );
};

export default About;
