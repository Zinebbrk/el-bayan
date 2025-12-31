import { supabase } from '../utils/supabase/client';
import { aiService } from './aiService';
import type { GameSession } from '../utils/supabase/client';
import { userService } from './userService';

export const gameService = {
  // Get daily challenge
  async getDailyChallenge(userId: string): Promise<any> {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if user already completed today's challenge
    const { data: existing } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('game_type', 'daily-challenge')
      .gte('completed_at', `${today}T00:00:00`)
      .lte('completed_at', `${today}T23:59:59`)
      .single();

    if (existing) {
      return {
        completed: true,
        session: existing,
      };
    }

    // Generate new daily challenge
    const challenge = aiService.generateGameContent('irab-quiz', 'medium', 'intermediate');

    return {
      completed: false,
      challenge,
    };
  },

  // Start a game session
  async startGame(
    userId: string,
    gameType: string,
    difficulty: string = 'medium'
  ): Promise<{ session: GameSession; gameData: any } | null> {
    // Generate game content
    const gameData = aiService.generateGameContent(gameType, difficulty, 'beginner');

    // Create game session
    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        user_id: userId,
        game_type: gameType,
        game_data: gameData,
        score: 0,
        xp_earned: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating game session:', error);
      return null;
    }

    return {
      session: data,
      gameData,
    };
  },

  // Submit game results
  async submitGame(
    sessionId: string,
    score: number,
    answers?: any[]
  ): Promise<{ xpEarned: number; newLevel: number; badges: string[] } | null> {
    const { data: session, error: fetchError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError || !session) {
      console.error('Error fetching game session:', fetchError);
      return null;
    }

    // Calculate XP based on score
    const xpEarned = Math.round(score * 0.5); // 50% of score as XP

    // Update game session
    const { error: updateError } = await supabase
      .from('game_sessions')
      .update({
        score,
        xp_earned: xpEarned,
        completed_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Error updating game session:', updateError);
      return null;
    }

    // Add XP to user
    await userService.addXP(session.user_id, xpEarned);

    // Check for new badges
    const newBadges = await userService.checkAndAwardBadges(session.user_id);

    // Get updated user profile
    const profile = await userService.getUserProfile(session.user_id);

    return {
      xpEarned,
      newLevel: profile?.current_level || 1,
      badges: newBadges,
    };
  },

  // Get user's game history
  async getGameHistory(userId: string, limit: number = 10): Promise<GameSession[]> {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching game history:', error);
      return [];
    }

    return data || [];
  },

  // Get game statistics
  async getGameStats(userId: string): Promise<{
    totalGames: number;
    totalScore: number;
    averageScore: number;
    highestScore: number;
    favoriteGameType: string;
  }> {
    const history = await this.getGameHistory(userId, 1000);

    if (history.length === 0) {
      return {
        totalGames: 0,
        totalScore: 0,
        averageScore: 0,
        highestScore: 0,
        favoriteGameType: 'none',
      };
    }

    const totalGames = history.length;
    const totalScore = history.reduce((sum, game) => sum + game.score, 0);
    const averageScore = Math.round(totalScore / totalGames);
    const highestScore = Math.max(...history.map(game => game.score));

    // Find favorite game type
    const gameTypeCounts: Record<string, number> = {};
    history.forEach(game => {
      gameTypeCounts[game.game_type] = (gameTypeCounts[game.game_type] || 0) + 1;
    });

    const favoriteGameType = Object.entries(gameTypeCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';

    return {
      totalGames,
      totalScore,
      averageScore,
      highestScore,
      favoriteGameType,
    };
  },

  // Get leaderboard (top scores for a specific game type)
  async getLeaderboard(gameType: string, limit: number = 10): Promise<any[]> {
    // This would require a more complex query joining with user_profiles
    // For now, return empty array
    return [];
  },
};
