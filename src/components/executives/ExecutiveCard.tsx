'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, Linkedin, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, Badge } from '@/components/ui';
import { Executive } from '@/types/executive';

export interface ExecutiveCardProps {
  executive: Executive;
  className?: string;
}

const ExecutiveCard: React.FC<ExecutiveCardProps> = ({ executive, className }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'mail':
        return <Mail className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  const socialLinks = [
    { platform: 'Email', href: `mailto:${executive.email}`, icon: 'mail' },
    ...(executive.instagram ? [{ platform: 'Instagram', href: executive.instagram, icon: 'instagram' }] : []),
    ...(executive.linkedIn ? [{ platform: 'LinkedIn', href: executive.linkedIn, icon: 'linkedin' }] : [])
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <Card className="h-full group" hover={true}>
        <CardHeader className="pb-4">
          {/* Profile Image */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            {!imageError ? (
              <Image
                src={executive.image}
                alt={`${executive.name} - ${executive.position}`}
                fill
                className="rounded-full object-cover border-2 border-border-default group-hover:border-primary-500/50 transition-colors"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-surface-card border-2 border-border-default group-hover:border-primary-500/50 transition-colors flex items-center justify-center">
                <span className="text-2xl font-bold text-text-secondary">
                  {executive.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
          </div>

          {/* Name and Position */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
              {executive.name}
            </h3>
            <p className="text-text-secondary font-medium">
              {executive.position}
            </p>
            
            {/* Co-Founder Badge */}
            {executive.foundingPosition === 'Co-Founder' && (
              <Badge variant="co-founder" size="sm">
                {executive.foundingPosition}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Bio */}
          <div className="text-center">
            <p className="text-text-secondary text-sm leading-relaxed">
              {executive.bio}
            </p>
          </div>

          {/* Responsibilities */}
          {executive.responsibilities.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Key Responsibilities</h4>
              <ul className="space-y-1">
                {executive.responsibilities.map((responsibility, index) => (
                  <li key={index} className="text-text-secondary text-sm flex items-start">
                    <span className="text-primary-400 mr-2 mt-1">•</span>
                    {responsibility}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Links */}
          <div className="pt-4 border-t border-border-default">
            <div className="flex items-center justify-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-tertiary hover:text-primary-400 transition-colors p-2 rounded-lg hover:bg-primary-500/10"
                  aria-label={`${executive.name}'s ${social.platform}`}
                >
                  {getSocialIcon(social.icon)}
                </a>
              ))}
            </div>
          </div>

          {/* Joined Year */}
          <div className="text-center">
            <p className="text-text-muted text-xs">
              Joined {executive.joinedYear}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExecutiveCard;
