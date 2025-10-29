'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';
import TiltedCard from '@/components/ui/TiltedCard';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Login successful
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-primary via-background-secondary to-background-primary p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <TiltedCard
          backgroundColor="rgba(24, 24, 27, 0.8)"
          gradientColors={['rgba(24, 24, 27, 0.9)', 'rgba(39, 39, 42, 0.7)']}
          containerHeight="auto"
          imageHeight="auto"
          scaleOnHover={1.02}
          rotateAmplitude={8}
          showTooltip={false}
        >
          <div className="w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
              <p className="text-text-secondary">Sign in to manage content</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background-secondary/50 border border-border-primary rounded-lg text-white placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background-secondary/50 border border-border-primary rounded-lg text-white placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="p-3 bg-accent-error/10 border border-accent-error rounded-lg">
                  <p className="text-sm text-accent-error">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </div>
        </TiltedCard>
      </motion.div>
    </div>
  );
}
