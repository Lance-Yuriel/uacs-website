'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Section } from '@/components/layout';
import { Button } from '@/components/ui';

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
    <Section id="constitution" className={className}>
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
            Constitution
          </h2>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
            Our constitution outlines the fundamental principles, structure, and governance 
            of the University of Auckland Calisthenics Society.
          </p>
        </motion.div>

        {/* Constitution Content */}
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
          <div className="bg-surface-card/50 backdrop-blur-sm border border-border-default rounded-2xl p-8 md:p-12">
            <div className="text-center space-y-8">
              {/* Icon */}
              <div className="mx-auto w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center">
                <FileText className="h-10 w-10 text-primary-400" />
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-white">
                  UACS Constitution
                </h3>
                <p className="text-text-secondary leading-relaxed max-w-2xl mx-auto">
                  Our constitution establishes the framework for our organization, including 
                  our mission, membership guidelines, executive roles, and operational procedures. 
                  It ensures transparency, accountability, and effective governance of our society.
                </p>
              </div>

              {/* Key Sections Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-white">Core Principles</h4>
                  <ul className="space-y-1 text-text-secondary text-sm">
                    <li>• Democratic governance</li>
                    <li>• Inclusive membership</li>
                    <li>• Skill development focus</li>
                    <li>• Community building</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-white">Key Sections</h4>
                  <ul className="space-y-1 text-text-secondary text-sm">
                    <li>• Executive roles & responsibilities</li>
                    <li>• Membership requirements</li>
                    <li>• Meeting procedures</li>
                    <li>• Financial management</li>
                  </ul>
                </div>
              </div>

              {/* Download Button */}
              <div className="pt-8">
                <Button
                  href="[TO BE PROVIDED - PDF URL]"
                  external={true}
                  variant="primary"
                  size="lg"
                  className="min-w-[200px]"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Constitution
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
                <p className="text-text-tertiary text-sm mt-4">
                  Constitution will be available for download once finalized
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary-500/5 to-accent-blue/5 border border-primary-500/20 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Questions About Our Constitution?
            </h3>
            <p className="text-text-secondary mb-6">
              If you have any questions about our constitution, governance structure, 
              or how our society operates, feel free to contact our executive team.
            </p>
            <Button
              href="mailto:uoacalisthenicssociety@gmail.com"
              variant="secondary"
              size="md"
            >
              Contact Executive Team
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default Constitution;
