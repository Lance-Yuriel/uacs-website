'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
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
        const response = await fetch('/api/members');
        
        if (!response.ok) {
          throw new Error('Failed to fetch member count');
        }
        
        const data: MemberCountResponse = await response.json();
        setMemberCount(data.count);
        setLastUpdated(data.lastUpdated);
        setError(null);
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
        <Card className="max-w-md w-full" hover={true}>
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-3 text-text-tertiary">
              <Users className="h-8 w-8 animate-pulse" />
              <span className="text-lg">Loading member count...</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (error || memberCount === null) {
    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 }
        }}
        className={`flex justify-center ${className || ''}`}
      >
        <Card className="max-w-md w-full" hover={true}>
          <CardContent className="p-8">
            <div className="text-center">
              <Users className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
              <p className="text-text-secondary text-lg">
                Member count unavailable. Please check back later.
              </p>
            </div>
          </CardContent>
        </Card>
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
      <Card className="max-w-md w-full" hover={true}>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <Users className="h-16 w-16 text-primary-500" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute -top-1 -right-1 bg-accent-success rounded-full p-1"
                >
                  <TrendingUp className="h-4 w-4 text-white" />
                </motion.div>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="space-y-2"
            >
              <div className="text-4xl md:text-5xl font-bold text-white">
                {memberCount.toLocaleString()}
              </div>
              <p className="text-text-secondary text-lg font-medium">
                {currentYear} Member Count
              </p>
              {lastUpdated && (
                <p className="text-text-tertiary text-sm">
                  Updated {formatLastUpdated(lastUpdated)}
                </p>
              )}
            </motion.div>

            {/* Growth indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-4 flex items-center justify-center gap-2 text-accent-success text-sm"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Growing community</span>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HeroMemberCount;
