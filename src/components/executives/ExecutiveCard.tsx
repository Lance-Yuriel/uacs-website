'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Instagram, ExternalLink, Maximize2, X } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, Badge } from '@/components/ui';
import { Executive } from '@/types/executive';
import ExecutiveModal from './ExecutiveModal';

export interface ExecutiveCardProps {
  executive: Executive;
  className?: string;
}

const ExecutiveCard: React.FC<ExecutiveCardProps> = ({ executive, className }) => {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  useEffect(() => {
    setImageError(false);
  }, [executive.image]);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'mail':
        return <Mail className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  const socialLinks = [
    { platform: 'Email', href: `mailto:${executive.email}`, icon: 'mail' },
    ...(executive.instagram ? [{ platform: 'Instagram', href: executive.instagram, icon: 'instagram' }] : [])
  ];

  return (
    <>
      <div className={className}>
        <Card className="min-h-[520px] flex flex-col !border-2 !border-[#BBD6FF] bg-[#0e0d1c]/90 shadow-[0_0_12px_rgba(187,214,255,0.5)]" hover={false} glass={false}>
          <CardContent className="flex-1 flex flex-col p-4 md:p-6 text-center h-full relative min-h-0">
            {/* Expand Icon - Top Right */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-lg bg-surface-card/50 backdrop-blur-sm border border-white/20 transition-all duration-300 group hover:bg-primary-500/25 hover:border-primary-400 hover:shadow-primary-500/40 hover:shadow-2xl hover:scale-110 active:scale-95 touch-manipulation"
              aria-label={`Expand ${executive.name}'s profile`}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <Maximize2 className="h-4 w-4 text-text-secondary group-hover:text-primary-200 transition-all duration-300 group-hover:scale-125 group-hover:rotate-90" />
            </button>

            {/* Top Section - Profile & Header */}
            <div className="flex-shrink-0 mb-4 md:mb-5">
              {/* Profile Image */}
              <div className="relative w-20 h-20 mx-auto mb-3 md:mb-4">
                {executive.image && !imageError ? (
                  <Image
                    src={executive.image}
                    alt={`${executive.name} - ${executive.position}`}
                    fill
                    className="rounded-full object-cover border-2 border-border-default"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-surface-card border-2 border-white/60 flex items-center justify-center">
                    <span className="text-lg font-bold text-white font-display tracking-tight">
                      {getInitials(executive.name)}
                    </span>
                  </div>
                )}
              </div>

              {/* Name and Position */}
              <div className="space-y-2 md:space-y-2.5 mb-3 md:mb-4">
                <h3 className="text-lg md:text-xl font-bold text-white font-display tracking-tight">
                  {executive.name}
                </h3>
                <p className="text-text-secondary font-medium text-xs md:text-sm">
                  {executive.position}
                </p>
                
                {/* Badges */}
                {(executive.isCoFounder || executive.title) && (
                  <div className="flex items-center justify-center gap-2 flex-wrap mt-2 md:mt-2.5">
                    {executive.isCoFounder && (
                      <Badge variant="co-founder" size="sm">
                        Co-Founder
                      </Badge>
                    )}
                    {executive.title && (
                      <Badge variant="co-founder" size="sm">
                        {executive.title}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Bio */}
              {executive.bio && (
                <div className="text-center mb-4 md:mb-5">
                  <p className="text-text-secondary text-xs md:text-sm leading-relaxed line-clamp-2 px-2">
                    {executive.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Responsibilities - Flexible middle section */}
            <div className="flex-1 flex flex-col justify-start mb-3 md:mb-4 min-h-0">
              <h4 className="text-xs md:text-sm font-semibold text-white mb-2 md:mb-3 font-display tracking-tight">Key Responsibilities</h4>
              <ul className="space-y-1 md:space-y-1.5">
                {executive.responsibilities.map((responsibility, index) => (
                  <li key={index} className="text-text-secondary text-xs md:text-sm flex items-start justify-center text-left max-w-sm mx-auto">
                    <span className="leading-relaxed">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Section - Social & Joined */}
            <div className="flex-shrink-0 pt-3 md:pt-4 border-t border-white/20">
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

              {/* Joined Year */}
              <div className="text-center">
                <p className="text-text-muted text-xs">
                  Joined {executive.joinedYear}
                </p>
              </div>
            </div>
        </CardContent>
      </Card>
    </div>

    {/* Modal */}
    <AnimatePresence>
      {isModalOpen && (
        <ExecutiveModal
          executive={executive}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </AnimatePresence>
  </>
  );
};

export default ExecutiveCard;
