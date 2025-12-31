import { supabase } from '../utils/supabase/client';
import type { UserProfile, UserBadge, Badge } from '../utils/supabase/client';

export const userService = {
  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }

    return true;
  },

  // Add XP to user
  async addXP(userId: string, xpAmount: number): Promise<boolean> {
    const profile = await this.getUserProfile(userId);
    if (!profile) return false;

    const newXP = profile.xp + xpAmount;
    const newLevel = Math.floor(newXP / 1000) + 1; // Level up every 1000 XP

    return await this.updateUserProfile(userId, {
      xp: newXP,
      current_level: newLevel,
    });
  },

  // Update streak
  async updateStreak(userId: string): Promise<boolean> {
    const profile = await this.getUserProfile(userId);
    if (!profile) return false;

    const today = new Date().toISOString().split('T')[0];
    const lastActive = new Date(profile.last_active_date).toISOString().split('T')[0];
    
    let newStreak = profile.streak_days;
    
    // If last active was yesterday, increment streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (lastActive === yesterdayStr) {
      newStreak += 1;
    } else if (lastActive !== today) {
      // If last active was more than a day ago, reset streak
      newStreak = 1;
    }

    return await this.updateUserProfile(userId, {
      streak_days: newStreak,
      last_active_date: today,
    });
  },

  // Get user badges
  async getUserBadges(userId: string): Promise<Array<Badge & { earned_at: string }>> {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*, badges(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user badges:', error);
      return [];
    }

    return (data || []).map((item: any) => ({
      ...item.badges,
      earned_at: item.earned_at,
    }));
  },

  // Award badge to user
  async awardBadge(userId: string, badgeId: string): Promise<boolean> {
    // Check if user already has the badge
    const { data: existing } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_id', badgeId)
      .single();

    if (existing) return false; // Already has badge

    const { error } = await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: badgeId,
      });

    if (error) {
      console.error('Error awarding badge:', error);
      return false;
    }

    return true;
  },

  // Get all available badges
  async getAllBadges(): Promise<Badge[]> {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching badges:', error);
      return [];
    }

    return data || [];
  },

  // Check and award badges based on user activity
  async checkAndAwardBadges(userId: string): Promise<string[]> {
    const profile = await this.getUserProfile(userId);
    if (!profile) return [];

    const allBadges = await this.getAllBadges();
    const userBadges = await this.getUserBadges(userId);
    const userBadgeIds = new Set(userBadges.map(b => b.id));
    const awardedBadges: string[] = [];

    for (const badge of allBadges) {
      if (userBadgeIds.has(badge.id)) continue; // Already has badge

      const criteria = badge.criteria as any;
      let shouldAward = false;

      // Check criteria
      if (criteria.type === 'xp_earned' && profile.xp >= criteria.threshold) {
        shouldAward = true;
      } else if (criteria.type === 'streak_days' && profile.streak_days >= criteria.count) {
        shouldAward = true;
      }
      // Add more criteria checks as needed

      if (shouldAward) {
        await this.awardBadge(userId, badge.id);
        awardedBadges.push(badge.id);
      }
    }

    return awardedBadges;
  },
};
