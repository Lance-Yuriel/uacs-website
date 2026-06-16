'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Link as LinkIcon,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Badge, Button, Card, CardContent, GradientText } from '@/components/ui';
import { motion } from 'framer-motion';
import EventForm from '@/components/admin/EventForm';
import { formatTime12Hour } from '@/lib/utils';
import type { EventWithMeta, EventsResponse } from '@/types/event';

export default function AdminEventsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<EventWithMeta[]>([]);
  const [pastEvents, setPastEvents] = useState<EventWithMeta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventWithMeta | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/admin/login');
        return;
      }
      setUser(firebaseUser);
      setInitializing(false);
      await fetchEvents();
    });

    return () => unsubscribe();
  }, [router]);

  const fetchEvents = async () => {
    try {
      setFetching(true);
      setError(null);

      const response = await fetch('/api/events', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const payload = (await response.json()) as EventsResponse;
      setUpcomingEvents(payload.upcoming);
      setPastEvents(payload.past);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to fetch events');
    } finally {
      setFetching(false);
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEditEvent = (event: EventWithMeta) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleFormClose = async (hasChanged?: boolean) => {
    setShowForm(false);
    setEditingEvent(null);
    if (hasChanged) {
      await fetchEvents();
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to delete event');
      }

      await fetchEvents();
    } catch (err: any) {
      console.error('Error deleting event:', err);
      alert(err.message || 'Failed to delete event. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-primary py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="p-2.5 hover:bg-surface-card rounded-lg transition-colors touch-manipulation"
              aria-label="Back to Dashboard"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight">
                <GradientText
                  colors={['#BBD6FF', '#DCEBFF', '#A5C8F8', '#DCEBFF', '#BBD6FF']}
                  animationSpeed={3}
                >
                  Manage Events
                </GradientText>
              </h1>
              <p className="text-text-secondary mt-2 text-sm sm:text-base">
                Create upcoming events, update details, and upload photo galleries for past sessions.
              </p>
            </div>
          </div>
          <Button
            onClick={handleAddEvent}
            className="border border-white text-white hover:bg-white hover:text-black transition-all duration-300 self-start md:self-auto touch-manipulation w-full sm:w-auto"
            style={{ minHeight: '44px' }}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Event</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </header>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-display tracking-tight">Upcoming Events</h2>
            {fetching && <Loader2 className="h-4 w-4 text-primary-300 animate-spin" />}
          </div>

          {fetching && upcomingEvents.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary-400 animate-spin" />
            </div>
          ) : upcomingEvents.length === 0 ? (
            <Card className="bg-surface-card border-dashed">
              <CardContent className="py-12 text-center text-text-secondary">
                No upcoming events scheduled. Click &ldquo;Add Event&rdquo; to create one.
              </CardContent>
            </Card>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.1,
                  },
                },
              }}
            >
              {upcomingEvents.map((item) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.95 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1] as const,
                      },
                    },
                  }}
                >
                  <Card key={item.id} className="bg-surface-card transition-transform duration-300 hover:scale-[1.02] h-full flex flex-col">
                    <CardContent className="p-6 flex flex-col flex-1 space-y-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-semibold text-white font-display tracking-tight">{item.eventName}</h3>
                        <p className="text-sm text-text-secondary">
                          Event ID: <span className="font-mono text-xs">{item.id}</span>
                        </p>
                      </div>
                      <Badge variant="success" size="sm">
                        Upcoming
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-text-secondary">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{item.date}</span>
                      </div>
                      {item.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime12Hour(item.time) || item.time}</span>
                        </div>
                      )}
                      {item.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>

                    {item.countdownMessage && (
                      <div className="rounded-lg border border-primary-500/20 bg-primary-500/10 px-4 py-3 text-sm text-primary-100">
                        {item.countdownMessage}
                      </div>
                    )}

                    <div className="flex gap-2 mt-auto">
                      <Button
                        onClick={() => handleEditEvent(item)}
                        className="flex-1 bg-primary-500/20 hover:bg-primary-500/30 text-primary-200"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteEvent(item.id)}
                        disabled={deletingId === item.id}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 disabled:opacity-60"
                      >
                        {deletingId === item.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-display tracking-tight">Past Events</h2>
            {fetching && <Loader2 className="h-4 w-4 text-primary-300 animate-spin" />}
          </div>

          {fetching && pastEvents.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary-400 animate-spin" />
            </div>
          ) : pastEvents.length === 0 ? (
            <Card className="bg-surface-card border-dashed">
              <CardContent className="py-12 text-center text-text-secondary">
                No past events recorded yet. Completed events will move here automatically.
              </CardContent>
            </Card>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.1,
                  },
                },
              }}
            >
              {pastEvents.map((item) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.95 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1] as const,
                      },
                    },
                  }}
                >
                  <Card key={item.id} className="bg-surface-card transition-transform duration-300 hover:scale-[1.02] h-full flex flex-col">
                    <CardContent className="p-6 flex flex-col flex-1 space-y-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-semibold text-white font-display tracking-tight">{item.eventName}</h3>
                        <p className="text-sm text-text-secondary">
                          Event ID: <span className="font-mono text-xs">{item.id}</span>
                        </p>
                      </div>
                      <Badge variant="default" size="sm">
                        Past Event
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-text-secondary">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{item.date}</span>
                      </div>
                      {item.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime12Hour(item.time) || item.time}</span>
                        </div>
                      )}
                      {item.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="rounded-lg border border-border-default px-4 py-3 bg-background-secondary/40 text-sm text-text-secondary min-h-[80px] max-h-[120px] overflow-y-auto">
                      {item.description
                        ? item.description
                        : 'No description yet. Add highlights once photos are ready.'}
                    </div>

                    <div className="flex items-center justify-between text-sm mt-auto">
                      {item.googleDriveLink ? (
                        <a
                          href={item.googleDriveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary-300 hover:text-primary-200 transition-colors"
                        >
                          <LinkIcon className="h-4 w-4" />
                          View Photos
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-text-tertiary">
                          <LinkIcon className="h-4 w-4" />
                          Photos coming soon
                        </span>
                      )}

                      <span className="text-xs text-text-tertiary">
                        Updated {new Date(item.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button
                        onClick={() => handleEditEvent(item)}
                        className="flex-1 bg-primary-500/20 hover:bg-primary-500/30 text-primary-200"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteEvent(item.id)}
                        disabled={deletingId === item.id}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 disabled:opacity-60"
                      >
                        {deletingId === item.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>

      {showForm && (
        <EventForm event={editingEvent} onClose={handleFormClose} />
      )}
    </div>
  );
}

