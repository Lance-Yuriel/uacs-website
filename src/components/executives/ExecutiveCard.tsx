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
    <div className={className}>
      <Card className="h-[520px] flex flex-col !border-white bg-[#1a1a1a]/90" hover={false} glass={false}>
        <CardContent className="flex-1 flex flex-col p-6 text-center h-full">
          {/* Top Section - Fixed height */}
          <div className="flex-shrink-0">
            {/* Profile Image */}
            <div className="relative w-20 h-20 mx-auto mb-3">
              {!imageError ? (
                <Image
                  src={executive.image}
                  alt={`${executive.name} - ${executive.position}`}
                  fill
                  className="rounded-full object-cover border-2 border-border-default"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-surface-card border-2 border-border-default flex items-center justify-center">
                  <span className="text-lg font-bold text-text-secondary">
                    {executive.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>

            {/* Name and Position */}
            <div className="space-y-2 mb-3">
              <h3 className="text-xl font-bold text-white">
                {executive.name}
              </h3>
              <p className="text-text-secondary font-medium">
                {executive.position}
              </p>
              
              {/* Badges */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {executive.isCoFounder && (
                  <Badge variant="co-founder" size="sm">
                    Co-Founder
                  </Badge>
                )}
                <Badge variant="co-founder" size="sm">
                  {executive.title}
                </Badge>
              </div>
            </div>

            {/* Bio - Fixed height */}
            <div className="text-center mb-3 min-h-[40px]">
              <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
                {executive.bio}
              </p>
            </div>
          </div>

          {/* Responsibilities - Flexible middle section */}
          <div className="flex-1 flex flex-col mb-4 min-h-[120px]">
            <h4 className="text-sm font-semibold text-white mb-2">Key Responsibilities</h4>
            <ul className="space-y-1 flex-1">
              {executive.responsibilities.map((responsibility, index) => (
                <li key={index} className="text-text-secondary text-sm flex items-start">
                  <span className="text-primary-400 mr-2 mt-1">•</span>
                  {responsibility}
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Section - Fixed position separator */}
          <div className="flex-shrink-0 pt-4 border-t border-white/20">
            <div className="flex items-center justify-center space-x-4 mb-3">
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

            {/* Joined Year - At the bottom */}
            <div className="text-center">
              <p className="text-text-muted text-xs">
                Joined {executive.joinedYear}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveCard;
