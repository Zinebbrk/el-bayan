import { useState, useEffect } from 'react';
import { Gamepad2, Star, Trophy, Zap, Target, Loader2 } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Page } from '../App';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { gameService } from '../services/gameService';
import { userService } from '../services/userService';
import type { UserProfile } from '../utils/supabase/client';

interface GamesProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  xp: number;
  gameType: string;
}

const availableGames: Game[] = [
  {
    id: 'build-sentence',
    title: 'Build the Sentence',
    description: 'Drag and drop words to create grammatically correct sentences',
    icon: '🧩',
    difficulty: 'Beginner',
    xp: 50,
    gameType: 'build-sentence',
  },
  {
    id: 'haraka-matching',
    title: 'Haraka Matching',
    description: 'Match the correct diacritical marks to words',
    icon: '✨',
    difficulty: 'Beginner',
    xp: 40,
    gameType: 'haraka-matching',
  },
  {
    id: 'beat-clock',
    title: 'Beat the Clock',
    description: 'Conjugate verbs as fast as you can before time runs out',
    icon: '⚡',
    difficulty: 'Intermediate',
    xp: 75,
    gameType: 'beat-clock',
  },
  {
    id: 'grammar-puzzle',
    title: 'Grammar Puzzle',
    description: 'Solve grammar puzzles by identifying parts of speech',
    icon: '🎯',
    difficulty: 'Intermediate',
    xp: 60,
    gameType: 'grammar-puzzle',
  },
  {
    id: 'irab-master',
    title: 'Iʿrāb Master',
    description: 'Identify the correct grammatical case in complex sentences',
    icon: '👑',
    difficulty: 'Advanced',
    xp: 100,
    gameType: 'irab-master',
  },
  {
    id: 'sentence-reorder',
    title: 'Sentence Reorder',
    description: 'Arrange scrambled words into proper Arabic sentence structure',
    icon: '🔄',
    difficulty: 'Intermediate',
    xp: 65,
    gameType: 'sentence-reorder',
  },
];

export function Games({ onNavigate, onLogout }: GamesProps) {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [gameStats, setGameStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [gameData, setGameData] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentSentence, setCurrentSentence] = useState<any>(null);
  const [droppedWords, setDroppedWords] = useState<string[]>([]);
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Different sentences for each level
  const sentenceLevels = [
    {
      words: ['الطالبُ', 'يدرسُ', 'الدرسَ', 'في', 'المكتبةِ'],
      correctOrder: ['الطالبُ', 'يدرسُ', 'الدرسَ', 'في', 'المكتبةِ'],
      translation: 'The student studies the lesson in the library',
    },
    {
      words: ['المعلمُ', 'يشرحُ', 'القاعدةَ', 'للطلابِ'],
      correctOrder: ['المعلمُ', 'يشرحُ', 'القاعدةَ', 'للطلابِ'],
      translation: 'The teacher explains the rule to the students',
    },
    {
      words: ['الكتابُ', 'على', 'الطاولةِ', 'جديدٌ'],
      correctOrder: ['الكتابُ', 'على', 'الطاولةِ', 'جديدٌ'],
      translation: 'The book on the table is new',
    },
  ];

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
      const [profile, stats] = await Promise.all([
        userService.getUserProfile(user.id),
        gameService.getGameStats(user.id),
      ]);
      setUserProfile(profile);
      setGameStats(stats);
    } catch (error) {
      console.error('Error loading game data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = async (gameType: string) => {
    if (!user) return;
    
    try {
      const result = await gameService.startGame(user.id, gameType, 'medium');
      if (result) {
        setSelectedGame(gameType);
        setCurrentSession(result.session);
        setGameData(result.gameData);
        setScore(0);
        setLevel(1);
        setDroppedWords([]);
        setAnswerFeedback(null);
        // Set first level sentence
        if (gameType === 'build-sentence') {
          setCurrentSentence(sentenceLevels[0]);
        }
      }
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const handleDrop = (word: string) => {
    if (!droppedWords.includes(word)) {
      setDroppedWords([...droppedWords, word]);
    }
  };

  const handleRemoveWord = (index: number) => {
    setDroppedWords(droppedWords.filter((_, i) => i !== index));
  };

  const handleCheckAnswer = async () => {
    if (!currentSession || !currentSentence) return;
    
    if (droppedWords.length !== currentSentence.words.length) return;

    setIsChecking(true);
    setAnswerFeedback(null);

    // Check if order is correct
    const isCorrect = JSON.stringify(droppedWords) === JSON.stringify(currentSentence.correctOrder);
    
    // Show visual feedback
    setAnswerFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      const newScore = score + 50;
      setScore(newScore);
      
      // Wait a moment to show green feedback, then move to next level
      setTimeout(() => {
        const currentLevel = level; // Capture current level
        if (currentLevel < 3) {
          // Move to next level
          const nextLevel = currentLevel + 1;
          setLevel(nextLevel);
          setCurrentSentence(sentenceLevels[nextLevel - 1]);
          setDroppedWords([]);
          setAnswerFeedback(null);
          setIsChecking(false);
        } else {
          // Game complete - submit
          setIsChecking(false);
          handleSubmitGame(newScore);
        }
      }, 1500); // 1.5 second delay to show feedback
    } else {
      // Show red feedback, then reset after delay
      setTimeout(() => {
        setDroppedWords([]);
        setAnswerFeedback(null);
        setIsChecking(false);
      }, 1500);
    }
  };

  const handleSubmitGame = async (finalScore: number) => {
    if (!currentSession) return;

    try {
      const result = await gameService.submitGame(currentSession.id, finalScore);
      if (result) {
        // Reload data to update stats
        await loadData();
        // Show success message
        alert(`Game Complete! You earned ${result.xpEarned} XP!`);
        // Reset and return to games list
        setSelectedGame(null);
        setCurrentSession(null);
        setScore(0);
        setLevel(1);
        setDroppedWords([]);
        setCurrentSentence(null);
        setAnswerFeedback(null);
        setIsChecking(false);
      }
    } catch (error) {
      console.error('Error submitting game:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FFFDF6]">
        <Sidebar currentPage="games" onNavigate={onNavigate} onLogout={onLogout} />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#688837]" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FFFDF6]">
      <Sidebar currentPage="games" onNavigate={onNavigate} onLogout={onLogout} />
      
      <main className="flex-1 ml-64 p-8">
        {!selectedGame ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 
                className="text-4xl text-[#2D2A26] mb-2"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Gamified Learning
              </h1>
              <p className="text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Master grammar through fun and engaging games
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#688837]/10 to-transparent border-2 border-[#688837]/20">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-6 h-6 text-[#C8A560]" />
                  <div className="text-2xl text-[#688837]">
                    {userProfile?.xp.toLocaleString() || 0}
                  </div>
                </div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Total XP
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#C8A560]/10 to-transparent border-2 border-[#C8A560]/20">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-6 h-6 text-[#C8A560]" />
                  <div className="text-2xl text-[#C8A560]">
                    Level {userProfile?.current_level || 1}
                  </div>
                </div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Current Level
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#688837]/10 to-transparent border-2 border-[#688837]/20">
                <div className="flex items-center gap-3 mb-2">
                  <Gamepad2 className="w-6 h-6 text-[#688837]" />
                  <div className="text-2xl text-[#688837]">
                    {gameStats?.totalGames || 0}
                  </div>
                </div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Games Played
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#E1CB98]/20 to-transparent border-2 border-[#E1CB98]">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6 text-[#C8A560]" />
                  <div className="text-2xl text-[#688837]">
                    {userProfile?.streak_days || 0}
                  </div>
                </div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Day Streak
                </div>
              </div>
            </div>

            {/* Games Grid */}
            <div>
              <h2 
                className="text-2xl text-[#2D2A26] mb-6"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Available Games
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableGames.map((game) => (
                  <div
                    key={game.id}
                    className="group p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98] hover:border-[#688837] transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1"
                    onClick={() => handleStartGame(game.gameType)}
                  >
                    <div className="text-5xl mb-4">{game.icon}</div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        game.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                        game.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {game.difficulty}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#688837]/10 text-[#688837] text-xs flex items-center gap-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        <Star className="w-3 h-3" />
                        +{game.xp} XP
                      </span>
                    </div>

                    <h3 className="text-xl text-[#2D2A26] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                      {game.title}
                    </h3>
                    <p className="text-sm text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {game.description}
                    </p>

                    <Button className="w-full mt-4 bg-[#688837] hover:bg-[#688837]/90 text-white rounded-xl">
                      Play Now
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Challenge */}
            {user && (
              <div className="mt-8 p-8 rounded-3xl bg-gradient-to-br from-[#688837]/10 to-[#C8A560]/10 border-2 border-[#C8A560]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 
                      className="text-2xl text-[#2D2A26] mb-1"
                      style={{ fontFamily: 'Amiri, serif' }}
                    >
                      Daily Challenge
                    </h2>
                    <p className="text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Complete today's challenge for bonus XP!
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="col-span-2 p-6 rounded-2xl bg-white/50 border border-[#E1CB98]">
                    <h3 className="text-lg text-[#2D2A26] mb-3" style={{ fontFamily: 'Amiri, serif' }}>
                      Today's Challenge: Verb Conjugation Sprint
                    </h3>
                    <p className="text-sm text-[#2D2A26]/70 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Conjugate 15 verbs correctly in under 3 minutes
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-[#E1CB98]/30 rounded-full overflow-hidden">
                        <div className="h-full w-2/5 bg-gradient-to-r from-[#688837] to-[#C8A560] rounded-full"></div>
                      </div>
                      <span className="text-sm text-[#688837]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        6/15
                      </span>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#688837] to-[#C8A560] text-white">
                    <div className="text-3xl mb-2">+200</div>
                    <div className="text-sm opacity-90 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Bonus XP
                    </div>
                    <Button 
                      className="w-full bg-white text-[#688837] hover:bg-white/90"
                      onClick={() => handleStartGame('daily-challenge')}
                    >
                      Start Challenge
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard Preview - Placeholder for now */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 
                  className="text-2xl text-[#2D2A26]"
                  style={{ fontFamily: 'Amiri, serif' }}
                >
                  Leaderboard
                </h2>
                <Button variant="ghost" className="text-[#688837]">
                  View All
                </Button>
              </div>

              <div className="p-8 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98] text-center">
                <p className="text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Leaderboard coming soon!
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Game Play */}
            {currentSession && (
              <div className="max-w-4xl mx-auto">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedGame(null);
                    setCurrentSession(null);
                    setScore(0);
                    setLevel(1);
                    setDroppedWords([]);
                    setCurrentSentence(null);
                    setAnswerFeedback(null);
                    setIsChecking(false);
                  }}
                  className="mb-6 text-[#688837] hover:text-[#688837]/80"
                >
                  ← Back to Games
                </Button>

                <div className="p-8 rounded-3xl bg-gradient-to-br from-[#688837]/10 to-[#C8A560]/10 border-2 border-[#C8A560] mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 
                        className="text-3xl text-[#2D2A26] mb-2"
                        style={{ fontFamily: 'Amiri, serif' }}
                      >
                        🧩 Build the Sentence
                      </h1>
                      <p className="text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        Level {level}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-2 rounded-full bg-white/50 flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#C8A560]" />
                        <span className="text-[#688837]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          {score} Points
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-8">
                    <p className="text-lg text-[#2D2A26] mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Arrange the words to form a correct sentence:
                    </p>
                    {currentSentence && (
                      <p className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        "{currentSentence.translation}"
                      </p>
                    )}
                  </div>

                  {/* Drop Zone */}
                  <div className={`min-h-[120px] p-6 rounded-2xl mb-6 transition-all duration-300 ${
                    answerFeedback === 'correct' 
                      ? 'bg-green-100 border-2 border-green-500' 
                      : answerFeedback === 'incorrect'
                      ? 'bg-red-100 border-2 border-red-500'
                      : 'bg-white border-2 border-dashed border-[#688837]'
                  }`}>
                    {droppedWords.length === 0 ? (
                      <p className="text-center text-[#2D2A26]/40" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        Click words below to build your sentence
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {droppedWords.map((word, index) => (
                          <button
                            key={index}
                            onClick={() => !isChecking && handleRemoveWord(index)}
                            disabled={isChecking}
                            className={`px-6 py-3 rounded-xl text-white text-2xl transition-all ${
                              answerFeedback === 'correct'
                                ? 'bg-green-600 hover:bg-green-700'
                                : answerFeedback === 'incorrect'
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-[#688837] hover:bg-[#688837]/80'
                            } ${isChecking ? 'cursor-not-allowed opacity-75' : ''}`}
                            style={{ fontFamily: 'Amiri, serif' }}
                          >
                            {word}
                          </button>
                        ))}
                      </div>
                    )}
                    {answerFeedback === 'correct' && (
                      <div className="text-center mt-4">
                        <p className="text-green-700 text-lg font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          ✓ Correct! Moving to next level...
                        </p>
                      </div>
                    )}
                    {answerFeedback === 'incorrect' && (
                      <div className="text-center mt-4">
                        <p className="text-red-700 text-lg font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          ✗ Incorrect. Try again!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Word Bank */}
                  {currentSentence && (
                    <div className="mb-6">
                      <p className="text-sm text-[#2D2A26]/60 mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        Available words:
                      </p>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {currentSentence.words
                          .filter(word => !droppedWords.includes(word))
                          .map((word: string, index: number) => (
                            <button
                              key={index}
                              onClick={() => !isChecking && handleDrop(word)}
                              disabled={isChecking}
                              className={`px-6 py-3 rounded-xl border-2 text-[#2D2A26] text-2xl transition-all ${
                                isChecking 
                                  ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-50'
                                  : 'bg-[#E1CB98]/30 hover:bg-[#E1CB98]/50 border-[#E1CB98] hover:scale-105'
                              }`}
                              style={{ fontFamily: 'Amiri, serif' }}
                            >
                              {word}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      onClick={() => {
                        if (!isChecking) {
                          setDroppedWords([]);
                          setAnswerFeedback(null);
                        }
                      }}
                      variant="outline"
                      disabled={isChecking}
                      className="flex-1 border-[#E1CB98] text-[#688837] hover:bg-[#E1CB98]/20 disabled:opacity-50"
                    >
                      Clear
                    </Button>
                    <Button
                      disabled={
                        isChecking || 
                        !currentSentence || 
                        droppedWords.length !== currentSentence.words.length
                      }
                      onClick={handleCheckAnswer}
                      className="flex-1 bg-[#688837] hover:bg-[#688837]/90 text-white disabled:opacity-50"
                    >
                      {isChecking ? 'Checking...' : 'Check Answer'}
                    </Button>
                  </div>
                </div>

                {/* Progress */}
                <div className="p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#2D2A26]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Game Progress
                    </span>
                    <span className="text-[#688837]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Level {level}/3
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#E1CB98]/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#688837] to-[#C8A560] rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((level / 3) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
