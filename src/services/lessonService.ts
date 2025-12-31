import { supabase } from '../utils/supabase/client';
import type { Lesson, UserLessonProgress } from '../utils/supabase/client';

export const lessonService = {
  // Get all lessons by level
  async getLessonsByLevel(level: 'beginner' | 'intermediate' | 'advanced'): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('level', level)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching lessons:', error);
      return [];
    }

    return data || [];
  },

  // Get a single lesson by ID
  async getLessonById(id: string): Promise<Lesson | null> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching lesson:', error);
      return null;
    }

    return data;
  },

  // Get user's progress for all lessons
  async getUserLessonProgress(userId: string): Promise<UserLessonProgress[]> {
    const { data, error } = await supabase
      .from('user_lesson_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching progress:', error);
      return [];
    }

    return data || [];
  },

  // Get user's progress for a specific lesson
  async getLessonProgress(userId: string, lessonId: string): Promise<UserLessonProgress | null> {
    const { data, error } = await supabase
      .from('user_lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching lesson progress:', error);
      return null;
    }

    return data;
  },

  // Update or create lesson progress
  async updateLessonProgress(
    userId: string,
    lessonId: string,
    progressPercentage: number
  ): Promise<boolean> {
    const existingProgress = await this.getLessonProgress(userId, lessonId);

    if (existingProgress) {
      const { error } = await supabase
        .from('user_lesson_progress')
        .update({
          progress_percentage: progressPercentage,
          completed_at: progressPercentage >= 100 ? new Date().toISOString() : null,
        })
        .eq('id', existingProgress.id);

      if (error) {
        console.error('Error updating progress:', error);
        return false;
      }
    } else {
      const { error } = await supabase
        .from('user_lesson_progress')
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          progress_percentage: progressPercentage,
          completed_at: progressPercentage >= 100 ? new Date().toISOString() : null,
        });

      if (error) {
        console.error('Error creating progress:', error);
        return false;
      }
    }

    return true;
  },

  // Get lessons with user progress
  async getLessonsWithProgress(
    userId: string,
    level: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<Array<Lesson & { progress?: number; completed?: boolean }>> {
    const lessons = await this.getLessonsByLevel(level);
    const progress = await this.getUserLessonProgress(userId);

    return lessons.map(lesson => {
      const lessonProgress = progress.find(p => p.lesson_id === lesson.id);
      return {
        ...lesson,
        progress: lessonProgress?.progress_percentage || 0,
        completed: !!lessonProgress?.completed_at,
      };
    });
  },

  // Get completed lessons count
  async getCompletedLessonsCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('user_lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('completed_at', 'is', null);

    if (error) {
      console.error('Error counting completed lessons:', error);
      return 0;
    }

    return count || 0;
  },

  // Check if a level is completely finished (all lessons completed)
  async isLevelComplete(
    userId: string,
    level: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<boolean> {
    // Get all lessons for this level
    const lessons = await this.getLessonsByLevel(level);
    if (lessons.length === 0) return false;

    // Get all progress for this level
    const progress = await this.getUserLessonProgress(userId);
    const levelProgress = progress.filter(p => 
      lessons.some(lesson => lesson.id === p.lesson_id)
    );

    // Check if all lessons are completed (progress = 100% and completed_at is not null)
    const allCompleted = lessons.every(lesson => {
      const lessonProgress = levelProgress.find(p => p.lesson_id === lesson.id);
      return lessonProgress?.progress_percentage === 100 && lessonProgress?.completed_at !== null;
    });

    return allCompleted;
  },

  // Check if a level should be locked (previous level not complete)
  async isLevelLocked(
    userId: string,
    level: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<boolean> {
    // Beginner level is never locked
    if (level === 'beginner') return false;

    // Check if previous level is complete
    const previousLevel = level === 'intermediate' ? 'beginner' : 'intermediate';
    const previousLevelComplete = await this.isLevelComplete(userId, previousLevel);

    // Level is locked if previous level is not complete
    return !previousLevelComplete;
  },

  // Get lessons with progress and apply level locking
  async getLessonsWithProgressAndLocking(
    userId: string,
    level: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<Array<Lesson & { progress?: number; completed?: boolean; is_locked?: boolean }>> {
    const lessonsWithProgress = await this.getLessonsWithProgress(userId, level);
    const isLocked = await this.isLevelLocked(userId, level);

    // If level is locked, mark all lessons as locked
    if (isLocked) {
      return lessonsWithProgress.map(lesson => ({
        ...lesson,
        is_locked: true,
      }));
    }

    return lessonsWithProgress;
  },
};
