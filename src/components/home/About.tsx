'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Calendar, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import MemberCounter from './MemberCounter';
import { Section } from '@/components/layout';

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
    <Section id="about" className={className}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="space-y-16"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Who We Are
          </h2>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
            The University of Auckland Calisthenics Society is a student-led club
            dedicated to promoting bodyweight training and building a strong, supportive 
            community of fitness enthusiasts across all skill levels.
          </p>
        </motion.div>

        {/* Member Counter */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <Card className="max-w-md w-full" hover={true}>
            <CardContent className="p-8">
              <MemberCounter />
            </CardContent>
          </Card>
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
                  className="group"
                >
                  <Card className="h-full text-center" hover={true}>
                    <CardHeader className="pb-4">
                      <div className="mx-auto mb-4 p-4 bg-primary-500/10 rounded-full w-fit group-hover:bg-primary-500/20 transition-colors">
                        <IconComponent className="h-8 w-8 text-primary-400 group-hover:text-primary-300 transition-colors" />
                      </div>
                      <CardTitle className="text-lg font-semibold">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default About;
