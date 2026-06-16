'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Card, CardContent } from '@/components/ui';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
      await signInWithEmailAndPassword(auth, email, password);

      // Login successful
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      console.error('Login error:', err);
      let message = 'An unexpected error occurred';
      if (
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/invalid-email'
      ) {
        message = 'Invalid email or password';
      } else if (err?.message) {
        message = err.message;
      }
      setError(message);
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
        <Card className="w-full" hover={false}>
          <CardContent className="p-8">
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
                  className="w-full px-4 py-3 bg-background-secondary border border-border-primary rounded-lg text-white placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="w-full px-4 py-3 bg-background-secondary border border-border-primary rounded-lg text-white placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="p-3 bg-accent-error/10 border border-accent-error rounded-lg">
                  <p className="text-sm text-accent-error">{error}</p>
                </div>
              )}

              <div className="pt-4 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    'w-full px-6 py-3 text-base rounded-lg font-bold whitespace-nowrap cursor-pointer transition-all duration-300 ease-out',
                    'text-white hover:bg-white hover:text-black border border-gray-700',
                    'bg-[#1a1a1a] hover:border-white',
                    loading && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
