import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database schema
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  xp: number;
  current_level: number;
  streak_days: number;
  last_active_date: string;
  created_at: string;
  updated_at: string;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  order_index: number;
  content: any; // JSONB
  is_locked: boolean;
  created_at: string;
};

export type UserLessonProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  progress_percentage: number;
  completed_at: string | null;
  started_at: string;
  updated_at: string;
};

export type Assessment = {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time_minutes: number;
  topic: string;
  created_at: string;
};

export type AssessmentSession = {
  id: string;
  user_id: string;
  assessment_id: string;
  questions: any; // JSONB
  answers: any; // JSONB
  score: number | null;
  completed_at: string | null;
  created_at: string;
};

export type ChatbotConversation = {
  id: string;
  user_id: string;
  title: string; 
  messages: any; // JSONB - array of {role: 'user' | 'assistant', content: string, timestamp: string}
  created_at: string;
  updated_at: string;
};

export type GameSession = {
  id: string;
  user_id: string;
  game_type: string;
  game_data: any; // JSONB
  score: number;
  xp_earned: number;
  completed_at: string;
  created_at: string;
};

export type UserMistake = {
  id: string;
  user_id: string;
  topic: string;
  mistake_type: string;
  context: string;
  count: number;
  last_occurred_at: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: any; // JSONB
  created_at: string;
};

export type UserBadge = {
  user_id: string;
  badge_id: string;
  earned_at: string;
};
