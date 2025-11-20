'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, GradientText, Button } from '@/components/ui';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ArrowLeft, Loader2, GripVertical } from 'lucide-react';
import ExecutiveForm from '@/components/admin/ExecutiveForm';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Executive {
  id: string;
  name: string;
  position: string;
  title: string | null;
  is_co_founder: boolean | null;
  bio: string | null;
  image: string | null;
  responsibilities: string[] | null;
  joined_year: number | null;
  email: string | null;
  instagram: string | null;
  introduction: string | null;
  degree: string | null;
  favourite_skills: string[] | null;
  display_order: number | null;
}

interface SortableExecutiveCardProps {
  executive: Executive;
  onEdit: (exec: Executive) => void;
  onDelete: (id: string) => void;
  deleting: string | null;
}

function SortableExecutiveCard({ executive, onEdit, onDelete, deleting }: SortableExecutiveCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: executive.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="bg-surface-card transition-transform duration-300 hover:scale-[1.02] h-full flex flex-col">
        <CardContent className="p-5 flex flex-col flex-1">
          {/* Header Section */}
          <div className="flex items-start gap-3 mb-4">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-2 hover:bg-surface-card-hover rounded transition-colors mt-0.5 flex-shrink-0 touch-manipulation"
              aria-label="Drag to reorder"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <GripVertical className="h-4 w-4 text-text-tertiary hover:text-text-secondary" />
            </button>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1.5 font-display tracking-tight leading-tight">
                {executive.name}
              </h3>
              <p className="text-text-secondary text-sm font-medium mb-2">
                {executive.position}
              </p>
              {(executive.title || executive.is_co_founder) && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {executive.is_co_founder && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-primary-500/20 text-primary-300 rounded-md border border-primary-500/30">
                      Co-Founder
                    </span>
                  )}
                  {executive.title && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-primary-500/20 text-primary-300 rounded-md border border-primary-500/30">
                      {executive.title}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Bio Section */}
          {executive.bio && (
            <div className="mb-4 flex-1 min-h-[48px] ml-[56px]">
              <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
                {executive.bio}
              </p>
            </div>
          )}

          {/* Actions Section */}
          <div className="flex gap-2 pt-4 border-t border-border-default mt-auto">
            <button
              onClick={() => onEdit(executive)}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 rounded-lg transition-all duration-200 text-sm font-medium border border-primary-500/30 hover:border-primary-500/50 touch-manipulation"
              style={{ minHeight: '44px' }}
            >
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete(executive.id)}
              disabled={deleting === executive.id}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-200 text-sm font-medium border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              style={{ minHeight: '44px' }}
            >
              {deleting === executive.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminExecutivesPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExecutive, setEditingExecutive] = useState<Executive | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    checkUser();
    fetchExecutives();

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

  const fetchExecutives = async () => {
    try {
      setFetching(true);
      const response = await fetch('/api/executives', {
        credentials: 'include', // Include cookies for authentication
      });
      if (!response.ok) throw new Error('Failed to fetch executives');
      const data = await response.json();
      setExecutives(data);
    } catch (error) {
      console.error('Error fetching executives:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleAddClick = () => {
    setEditingExecutive(null);
    setShowForm(true);
  };

  const handleEditClick = (exec: Executive) => {
    setEditingExecutive(exec);
    setShowForm(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm('Are you sure you want to delete this executive? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(id);
      const response = await fetch(`/api/executives/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) throw new Error('Failed to delete executive');
      
      await fetchExecutives();
    } catch (error) {
      console.error('Error deleting executive:', error);
      alert('Failed to delete executive. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingExecutive(null);
    fetchExecutives();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = executives.findIndex((exec) => exec.id === active.id);
    const newIndex = executives.findIndex((exec) => exec.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistically update UI
    const newExecutives = arrayMove(executives, oldIndex, newIndex);
    setExecutives(newExecutives);

    // Update display_order for all affected executives
    setReordering(true);
    try {
      const orderUpdates = newExecutives.map((exec, index) => ({
        id: exec.id,
        display_order: index,
      }));

      const response = await fetch('/api/executives/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ order: orderUpdates }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      // Refresh to ensure consistency
      await fetchExecutives();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order. Please try again.');
      // Revert on error
      await fetchExecutives();
    } finally {
      setReordering(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-primary py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => router.push('/admin')}
                className="p-2.5 hover:bg-surface-card rounded-lg transition-colors touch-manipulation"
                style={{ minWidth: '44px', minHeight: '44px' }}
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight">
                <GradientText
                  colors={['#BBD6FF', '#DCEBFF', '#A5C8F8', '#DCEBFF', '#BBD6FF']}
                  animationSpeed={3}
                >
                  Manage Executives
                </GradientText>
              </h1>
            </div>
            <Button
              onClick={handleAddClick}
              className="bg-primary-500 hover:bg-primary-600 text-white touch-manipulation w-full sm:w-auto"
              style={{ minHeight: '44px' }}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Executive</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

          {/* Executives List */}
          {fetching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary-400 animate-spin" />
            </div>
          ) : executives.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-text-secondary">No executives found. Click "Add Executive" to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={executives.map((exec) => exec.id)}
                strategy={verticalListSortingStrategy}
              >
                <motion.div 
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  {executives.map((exec, index) => (
                    <motion.div
                      key={exec.id}
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
                      <SortableExecutiveCard
                        executive={exec}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        deleting={deleting}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </SortableContext>
            </DndContext>
          )}

          {/* Form Modal */}
          {showForm && (
            <ExecutiveForm
              executive={editingExecutive}
              onClose={handleFormClose}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

