import { useState } from 'react';
import { Gamepad2, Star, Trophy, Zap, Target } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Page } from '../App';
import { Button } from './ui/button';

interface GamesProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Games({ onNavigate, onLogout }: GamesProps) {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const games = [
    {
      id: 1,
      title: 'Build the Sentence',
      description: 'Drag and drop words to create grammatically correct sentences',
      icon: '🧩',
      difficulty: 'Beginner',
      xp: 50,
      color: 'from-green-400 to-green-600',
    },
    {
      id: 2,
      title: 'Haraka Matching',
      description: 'Match the correct diacritical marks to words',
      icon: '✨',
      difficulty: 'Beginner',
      xp: 40,
      color: 'from-blue-400 to-blue-600',
    },
    {
      id: 3,
      title: 'Beat the Clock',
      description: 'Conjugate verbs as fast as you can before time runs out',
      icon: '⚡',
      difficulty: 'Intermediate',
      xp: 75,
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      id: 4,
      title: 'Grammar Puzzle',
      description: 'Solve grammar puzzles by identifying parts of speech',
      icon: '🎯',
      difficulty: 'Intermediate',
      xp: 60,
      color: 'from-purple-400 to-purple-600',
    },
    {
      id: 5,
      title: 'Iʿrāb Master',
      description: 'Identify the correct grammatical case in complex sentences',
      icon: '👑',
      difficulty: 'Advanced',
      xp: 100,
      color: 'from-red-400 to-red-600',
    },
    {
      id: 6,
      title: 'Sentence Reorder',
      description: 'Arrange scrambled words into proper Arabic sentence structure',
      icon: '🔄',
      difficulty: 'Intermediate',
      xp: 65,
      color: 'from-pink-400 to-pink-600',
    },
  ];

  const dragDropWords = ['الطالبُ', 'يدرسُ', 'الدرسَ', 'في', 'المكتبةِ'];
  const [droppedWords, setDroppedWords] = useState<string[]>([]);

  const handleDrop = (word: string) => {
    if (!droppedWords.includes(word)) {
      setDroppedWords([...droppedWords, word]);
    }
  };

  const handleRemoveWord = (index: number) => {
    setDroppedWords(droppedWords.filter((_, i) => i !== index));
  };

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
                  <div className="text-2xl text-[#688837]">2,450</div>
                </div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Total XP
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#C8A560]/10 to-transparent border-2 border-[#C8A560]/20">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-6 h-6 text-[#C8A560]" />
                  <div className="text-2xl text-[#C8A560]">Level 12</div>
                </div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Current Level
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#688837]/10 to-transparent border-2 border-[#688837]/20">
                <div className="flex items-center gap-3 mb-2">
                  <Gamepad2 className="w-6 h-6 text-[#688837]" />
                  <div className="text-2xl text-[#688837]">47</div>
                </div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Games Played
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#E1CB98]/20 to-transparent border-2 border-[#E1CB98]">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6 text-[#C8A560]" />
                  <div className="text-2xl text-[#688837]">7</div>
                </div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Win Streak
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
                {games.map((game) => (
                  <div
                    key={game.id}
                    className="group p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98] hover:border-[#688837] transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1"
                    onClick={() => {
                      if (game.id === 2) {
                        // Haraka Matching
                        onNavigate('harakaMatching');
                      } else if (game.id === 5) {
                        // Iʿrāb Master
                        onNavigate('irabMaster');
                      } else {
                        setSelectedGame(game.id);
                      }
                    }}
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
                  <Button className="w-full bg-white text-[#688837] hover:bg-white/90">
                    Start Challenge
                  </Button>
                </div>
              </div>
            </div>

            {/* Leaderboard Preview */}
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

              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Fatima A.', xp: 5420, avatar: 'F' },
                  { rank: 2, name: 'Ahmed M.', xp: 4890, avatar: 'A' },
                  { rank: 3, name: 'You', xp: 2450, avatar: 'Y', highlight: true },
                  { rank: 4, name: 'Sara K.', xp: 2180, avatar: 'S' },
                  { rank: 5, name: 'Omar H.', xp: 1950, avatar: 'O' },
                ].map((player) => (
                  <div
                    key={player.rank}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                      player.highlight
                        ? 'bg-gradient-to-r from-[#688837]/20 to-[#C8A560]/20 border-2 border-[#688837]'
                        : 'bg-[#FFFDF6] border border-[#E1CB98]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        player.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                        player.rank === 2 ? 'bg-gray-300 text-gray-700' :
                        player.rank === 3 ? 'bg-amber-600 text-white' :
                        'bg-[#E1CB98] text-[#2D2A26]'
                      }`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {player.rank}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center text-white">
                        {player.avatar}
                      </div>
                      <span className="text-[#2D2A26]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {player.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#688837]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      <Star className="w-4 h-4 text-[#C8A560]" />
                      {player.xp.toLocaleString()} XP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Game Play - Build the Sentence */}
            <div className="max-w-4xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => setSelectedGame(null)}
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
                        {score} XP
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <p className="text-lg text-[#2D2A26] mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Arrange the words to form a correct sentence:
                  </p>
                  <p className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    "The student studies the lesson in the library"
                  </p>
                </div>

                {/* Drop Zone */}
                <div className="min-h-[120px] p-6 rounded-2xl bg-white border-2 border-dashed border-[#688837] mb-6">
                  {droppedWords.length === 0 ? (
                    <p className="text-center text-[#2D2A26]/40" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Drag words here to build your sentence
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-3 justify-center">
                      {droppedWords.map((word, index) => (
                        <button
                          key={index}
                          onClick={() => handleRemoveWord(index)}
                          className="px-6 py-3 rounded-xl bg-[#688837] text-white text-2xl hover:bg-[#688837]/80 transition-all"
                          style={{ fontFamily: 'Amiri, serif' }}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Word Bank */}
                <div className="mb-6">
                  <p className="text-sm text-[#2D2A26]/60 mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Available words:
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {dragDropWords.filter(word => !droppedWords.includes(word)).map((word, index) => (
                      <button
                        key={index}
                        onClick={() => handleDrop(word)}
                        className="px-6 py-3 rounded-xl bg-[#E1CB98]/30 hover:bg-[#E1CB98]/50 border-2 border-[#E1CB98] text-[#2D2A26] text-2xl transition-all hover:scale-105"
                        style={{ fontFamily: 'Amiri, serif' }}
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setDroppedWords([])}
                    variant="outline"
                    className="flex-1 border-[#E1CB98] text-[#688837] hover:bg-[#E1CB98]/20"
                  >
                    Clear
                  </Button>
                  <Button
                    disabled={droppedWords.length !== dragDropWords.length}
                    onClick={() => {
                      setScore(score + 50);
                      setLevel(level + 1);
                      setDroppedWords([]);
                    }}
                    className="flex-1 bg-[#688837] hover:bg-[#688837]/90 text-white"
                  >
                    Check Answer
                  </Button>
                </div>
              </div>

              {/* Progress */}
              <div className="p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#2D2A26]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Progress to next level
                  </span>
                  <span className="text-[#688837]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {score}/100 XP
                  </span>
                </div>
                <div className="w-full h-3 bg-[#E1CB98]/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#688837] to-[#C8A560] rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((score / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
