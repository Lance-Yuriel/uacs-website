'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui';
import { MemberCountResponse } from '@/types/site';

export interface MemberCounterProps {
  className?: string;
}

const MemberCounter: React.FC<MemberCounterProps> = ({ className }) => {
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
      <div className={`flex items-center justify-center p-8 ${className || ''}`}>
        <LoadingSpinner size="lg" text="Loading member count..." />
      </div>
    );
  }

  if (error || memberCount === null) {
    return (
      <div className={`text-center p-8 ${className || ''}`}>
        <Users className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
        <p className="text-text-secondary text-sm">
          Member count unavailable. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`text-center ${className || ''}`}
    >
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
        <p className="text-text-secondary text-lg">
          Active Members
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
    </motion.div>
  );
};

export default MemberCounter;
