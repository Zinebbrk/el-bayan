import { useState, useEffect } from 'react';
import { supabase, UserProfile, Lesson, UserLessonProgress, UserBadge } from '../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export function useUserProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserLessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setProgress([]);
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('user_lesson_progress')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setProgress(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching user progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  return { progress, loading, error, refresh: () => setLoading(true) };
}

export function useLessons(level?: string) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        let query = supabase.from('lessons').select('*').order('order_index');

        if (level) {
          query = query.eq('level', level);
        }

        const { data, error } = await query;

        if (error) throw error;
        setLessons(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching lessons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [level]);

  return { lessons, loading, error };
}

export function useUserBadges() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setBadges([]);
      setLoading(false);
      return;
    }

    const fetchBadges = async () => {
      try {
        const { data, error } = await supabase
          .from('user_badges')
          .select(`
            *,
            badge:badges(*)
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        setBadges(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching badges:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [user]);

  return { badges, loading, error };
}

export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  progressPercentage: number
) {
  try {
    const { data, error } = await supabase
      .from('user_lesson_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        progress_percentage: progressPercentage,
        completed_at: progressPercentage === 100 ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error updating lesson progress:', err);
    return { data: null, error: err as Error };
  }
}

export async function addXP(userId: string, amount: number) {
  try {
    // Get current profile
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('xp, current_level')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

    const newXP = (profile?.xp || 0) + amount;
    const newLevel = Math.floor(newXP / 500) + 1; // 500 XP per level

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        xp: newXP,
        current_level: newLevel,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error adding XP:', err);
    return { data: null, error: err as Error };
  }
}
