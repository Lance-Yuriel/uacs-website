'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui';
import { motion } from 'framer-motion';
import { Users, Calendar, LogOut } from 'lucide-react';
import { Button } from '@/components/ui';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        router.push('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-primary p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-text-secondary">Welcome, {user.email}</p>
            </div>
            <div className="flex gap-4">
              <Button
                href="/"
                variant="secondary"
              >
                View Website
              </Button>
              <Button
                onClick={handleLogout}
                variant="secondary"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary-500/10 rounded-lg">
                    <Users className="h-8 w-8 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Executives</h2>
                    <p className="text-text-secondary">Manage team members</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary-500/10 rounded-lg">
                    <Calendar className="h-8 w-8 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Events</h2>
                    <p className="text-text-secondary">Manage events and photos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
                <p className="text-text-secondary">
                  Admin features coming soon. You can now sign in and out securely!
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
