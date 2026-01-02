/**
 * Dashboard-related TypeScript types
 * Place in: src/types/dashboard.ts
 */

export interface DashboardStats {
  id: string;
  name: string;
  email: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  xp: number;
  current_level: number;
  streak_days: number;
  weekly_active_days: number;
  weekly_goal_days: number;
  avatar_url: string | null;
  lessons_completed: number;
  badges_earned: number;
  current_lesson: CurrentLesson | null;
  top_mistakes: TopMistake[] | null;
}

export interface CurrentLesson {
  id: string;
  title: string;
  progress: number;
}

export interface TopMistake {
  topic: string;
  count: number;
}

export interface RecommendedLesson {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress_percentage: number;
}

export interface DailyTip {
  id: string;
  title_arabic: string;
  title_english: string;
  description: string;
  tip: string | null;
  level: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
}

export interface WeeklyProgress {
  active_days: number;
  goal_days: number;
  percentage: number;
}