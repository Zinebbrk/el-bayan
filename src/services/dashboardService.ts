/**
 * Dashboard Service
 * Place in: src/services/dashboardService.ts
 * 
 * Handles all dashboard data fetching and operations
 */

import { supabase } from '../utils/supabase/client';
import type { 
  DashboardStats, 
  RecommendedLesson, 
  DailyTip,
  WeeklyProgress 
} from '../types/dashboard';

export const dashboardService = {
  /**
   * Get comprehensive dashboard statistics for a user
   */
  async getDashboardStats(userId: string): Promise<DashboardStats | null> {
    try {
      const { data, error } = await supabase
        .from('user_dashboard_stats')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching dashboard stats:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception in getDashboardStats:', error);
      return null;
    }
  },

  /**
   * Get recommended lessons for user based on level and progress
   */
  async getRecommendedLessons(
    userId: string, 
    limit: number = 3
  ): Promise<RecommendedLesson[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_recommended_lessons', {
          p_user_id: userId,
          p_limit: limit
        });

      if (error) {
        console.error('Error fetching recommended lessons:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception in getRecommendedLessons:', error);
      return [];
    }
  },

  /**
   * Get daily tip (random or based on user level)
   */
  async getDailyTip(userLevel?: 'beginner' | 'intermediate' | 'advanced'): Promise<DailyTip | null> {
    try {
      let query = supabase
        .from('daily_tips')
        .select('*');

      // Filter by level if provided
      if (userLevel) {
        query = query.eq('level', userLevel);
      }

      // Get random tip
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching daily tip:', error);
        return null;
      }

      if (!data || data.length === 0) {
        return null;
      }

      // Return random tip
      const randomIndex = Math.floor(Math.random() * data.length);
      return data[randomIndex];
    } catch (error) {
      console.error('Exception in getDailyTip:', error);
      return null;
    }
  },

  /**
   * Update user's weekly statistics
   */
  async updateWeeklyStats(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .rpc('update_weekly_stats', {
          p_user_id: userId
        });

      if (error) {
        console.error('Error updating weekly stats:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in updateWeeklyStats:', error);
      return false;
    }
  },

  /**
   * Get weekly progress percentage
   */
  getWeeklyProgress(stats: DashboardStats): WeeklyProgress {
    return {
      active_days: stats.weekly_active_days,
      goal_days: stats.weekly_goal_days,
      percentage: Math.round((stats.weekly_active_days / stats.weekly_goal_days) * 100)
    };
  },

  /**
   * Get user's current level name
   */
  getLevelName(level: 'beginner' | 'intermediate' | 'advanced'): string {
    const levelNames = {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced'
    };
    return levelNames[level] || 'Beginner';
  },

  /**
   * Get level badge color
   */
  getLevelColor(level: 'beginner' | 'intermediate' | 'advanced'): string {
    const colors = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-red-100 text-red-700'
    };
    return colors[level] || colors.beginner;
  },

  /**
   * Calculate XP progress to next level
   * Assuming 1000 XP per level
   */
  getXPProgress(xp: number): { current: number; nextLevel: number; percentage: number } {
    const XP_PER_LEVEL = 1000;
    const currentLevelXP = xp % XP_PER_LEVEL;
    const percentage = Math.round((currentLevelXP / XP_PER_LEVEL) * 100);
    
    return {
      current: currentLevelXP,
      nextLevel: XP_PER_LEVEL,
      percentage
    };
  },

  /**
   * Get user initials for avatar
   */
  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  },

  /**
   * Format number with commas
   */
  formatNumber(num: number): string {
    return num.toLocaleString();
  },

  /**
   * Get top mistakes formatted for display
   */
  getTopMistakesDisplay(mistakes: Array<{ topic: string; count: number }> | null, limit: number = 2) {
    if (!mistakes || mistakes.length === 0) {
      return [
        { topic: 'No mistakes yet', count: 0 },
        { topic: 'Keep learning!', count: 0 }
      ];
    }

    return mistakes.slice(0, limit);
  }
};