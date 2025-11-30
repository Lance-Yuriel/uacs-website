'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { TiltedCard } from '@/components/ui';
import { MemberCountResponse } from '@/types/site';

export interface HeroMemberCountProps {
  className?: string;
}

const HeroMemberCount: React.FC<HeroMemberCountProps> = ({ className }) => {
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/members', {
          cache: 'no-store', // Always fetch fresh data
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch member count`);
        }
        
        const data: MemberCountResponse = await response.json();
        
        // Handle API errors gracefully
        if (data.error) {
          console.warn('API returned error:', data.error);
          setError(data.error);
          setMemberCount(data.count || 0);
        } else {
          setMemberCount(data.count);
          setError(null);
        }
        
        setLastUpdated(data.lastUpdated);
      } catch (err) {
        console.error('Error fetching member count:', err);
        setError('Unable to load member count');
        setMemberCount(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberCount();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchMemberCount, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const currentYear = new Date().getFullYear();

  const formatLastUpdated = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 }
        }}
        className={`flex justify-center ${className || ''}`}
      >
        <div className="w-full max-w-md">
          <TiltedCard
            backgroundColor="#0e0d1c"
            gradientColors={['#0e0d1c', '#0e0d1c']}
            altText="Loading member count"
            captionText=""
            containerHeight="220px"
            containerWidth="100%"
            imageHeight="220px"
            imageWidth="100%"
            rotateAmplitude={12}
            scaleOnHover={1.03}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          >
          <div className="w-full h-full flex flex-col items-center justify-center text-center">
            <User className="h-12 w-12 text-text-tertiary mx-auto mb-4 animate-pulse" />
            <p className="text-text-secondary text-lg">Loading member count...</p>
          </div>
        </TiltedCard>
        </div>
      </motion.div>
    );
  }

  // Show error state when there's an error and no valid count
  if (error && (memberCount === null || memberCount === 0)) {
    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 }
        }}
        className={`flex justify-center ${className || ''}`}
      >
        <div className="w-full max-w-md">
          <TiltedCard
            backgroundColor="#0e0d1c"
            gradientColors={['#0e0d1c', '#0e0d1c']}
            altText="Member count error"
            captionText=""
            containerHeight="220px"
            containerWidth="100%"
            imageHeight="220px"
            imageWidth="100%"
            rotateAmplitude={12}
            scaleOnHover={1.03}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          >
            <div className="w-full h-full flex flex-col items-center justify-center text-center">
              <User className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
              <p className="text-text-secondary text-lg">
                Unable to retrieve member count at this time
              </p>
            </div>
          </TiltedCard>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
      }}
      className={`flex justify-center ${className || ''}`}
    >
      <div className="w-full max-w-md">
        <TiltedCard
          backgroundColor="#0e0d1c"
          gradientColors={['#0e0d1c', '#0e0d1c']}
          altText={`${currentYear} Member Count`}
          captionText={`${currentYear} Member Count`}
          containerHeight="240px"
          containerWidth="100%"
          imageHeight="240px"
          imageWidth="100%"
          rotateAmplitude={8}
          scaleOnHover={1.02}
          showMobileWarning={false}
          showTooltip={false}
          displayOverlayContent={true}
        >
          <div className="w-full h-full flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center mb-4">
              <User className="h-16 w-16 text-primary-500" />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="space-y-2"
            >
              <div className="text-4xl md:text-5xl font-bold text-white">
                {memberCount?.toLocaleString() || '0'}
              </div>
              <p className="text-text-secondary text-lg font-medium">
                {currentYear} Member Count
              </p>
              {error && (
                <p className="text-accent-warning text-xs">
                  {error}
                </p>
              )}
              {lastUpdated && (
                <p className="text-text-tertiary text-sm">
                  Updated {formatLastUpdated(lastUpdated)}
                </p>
              )}
            </motion.div>
          </div>
        </TiltedCard>
      </div>
    </motion.div>
  );
};

export default HeroMemberCount;
