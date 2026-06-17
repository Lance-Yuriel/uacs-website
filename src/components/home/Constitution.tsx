'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, GradientText } from '@/components/ui';

export interface ConstitutionProps {
  className?: string;
}

const Constitution: React.FC<ConstitutionProps> = ({ className }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1] as const
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 font-display tracking-tight">
            <GradientText
              colors={['#BBD6FF', '#DCEBFF', '#A5C8F8', '#DCEBFF', '#BBD6FF']}
              animationSpeed={3}
              showBorder={false}
              className=""
            >
              Constitution
            </GradientText>
          </h2>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
            Our constitution establishes the fundamental principles, structure, and governance framework 
            for UACS, ensuring transparency, accountability, and effective leadership of our society.
          </p>
        </motion.div>

        {/* Constitution Content */}
        <motion.div variants={itemVariants} className="max-w-5xl mx-auto">
          <div className="bg-surface-card/50 backdrop-blur-sm border-2 border-[#BBD6FF] rounded-2xl p-8 md:p-12 shadow-[0_0_12px_rgba(187,214,255,0.5)]">
            <div className="text-center space-y-12">
              {/* Icon and Button */}
              <div className="flex flex-col items-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center">
                  <FileText className="h-10 w-10 text-primary-400" />
                </div>
                
                <Button
                  href="https://docs.google.com/document/d/1HsYQg9iZjry3PM6Sxm8orFm7oz5FGBFDzAiAlTi8t_o/edit?usp=sharing"
                  external={true}
                  variant="primary"
                  size="lg"
                  className="min-w-[240px] font-semibold text-lg px-8 py-4 border-2 border-white shadow-lg hover:shadow-xl"
                >
                  View Constitution
                </Button>
              </div>

              {/* Key Sections Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-white flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                    Core Principles
                  </h4>
                  <ul className="space-y-3 text-text-secondary">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Promote calisthenics & street workout training</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Inclusive & supportive environment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Broaden awareness & participation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Build university community connections</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-white flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                    Key Sections
                  </h4>
                  <ul className="space-y-3 text-text-secondary">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Executive committee structure</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Membership requirements & fees</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Annual & special general meetings</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Financial management & auditing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
    </motion.div>
  );
};

export default Constitution;
