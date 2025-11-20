'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, GradientText } from '@/components/ui';
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
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-primary flex items-center">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 font-display tracking-tight">
              <GradientText
                colors={['#BBD6FF', '#DCEBFF', '#A5C8F8', '#DCEBFF', '#BBD6FF']}
                animationSpeed={3}
              >
                UACS Admin Dashboard
              </GradientText>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary">Welcome, {user.email}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              glass={false} 
              hover={false} 
              className="cursor-pointer bg-surface-card transition-all duration-300 hover:bg-white hover:scale-[1.02] [&:hover_*]:text-black"
              onClick={() => router.push('/admin/executives')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary-500/10 rounded-lg">
                    <Users className="h-8 w-8 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1 font-display tracking-tight">Executives</h2>
                    <p className="text-text-secondary">Manage team members</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              glass={false} 
              hover={false} 
              className="cursor-pointer bg-surface-card transition-all duration-300 hover:bg-white hover:scale-[1.02] [&:hover_*]:text-black"
              onClick={() => router.push('/admin/events')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary-500/10 rounded-lg">
                    <Calendar className="h-8 w-8 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1 font-display tracking-tight">Events</h2>
                    <p className="text-text-secondary">Manage events and photos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card hover={false}>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-4 font-display tracking-tight">Quick Stats</h2>
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
