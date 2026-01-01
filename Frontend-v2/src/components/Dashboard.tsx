import { MessageCircle, BookOpen, AlertCircle, Target, FileText, Flame, Trophy, TrendingUp } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Page } from '../App';
import { Button } from './ui/button';

interface DashboardProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Dashboard({ onNavigate, onLogout }: DashboardProps) {
  return (
    <div className="flex min-h-screen bg-[#FFFDF6]">
      <Sidebar currentPage="dashboard" onNavigate={onNavigate} onLogout={onLogout} />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 
              className="text-4xl text-[#2D2A26]"
              style={{ fontFamily: 'Amiri, serif' }}
            >
              Welcome back, Ahmed
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#688837]/10 border border-[#688837]/20">
                <Flame className="w-5 h-5 text-[#C8A560]" />
                <span className="text-[#688837]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  7 day streak
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center text-white">
                A
              </div>
            </div>
          </div>
          <p className="text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
            Continue your journey to master Arabic grammar
          </p>
        </div>

        {/* Primary Spotlight - Chatbot */}
        <div className="mb-8">
          <div 
            className="group relative p-8 rounded-3xl bg-gradient-to-br from-[#688837] to-[#688837]/80 border-2 border-[#C8A560] shadow-2xl hover:shadow-[#688837]/30 transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => onNavigate('chatbot')}
          >
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="chat-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <circle cx="30" cy="30" r="20" fill="none" stroke="white" strokeWidth="2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#chat-pattern)" />
              </svg>
            </div>

            <div className="relative flex items-center gap-6">
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 
                  className="text-3xl text-white mb-2"
                  style={{ fontFamily: 'Amiri, serif' }}
                >
                  Grammar Assistant
                </h2>
                <p className="text-white/80 text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Ask questions, correct sentences, get step-by-step explanations
                </p>
              </div>
              <Button className="bg-white text-[#688837] hover:bg-white/90 rounded-xl px-8 py-6">
                Start Chat
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Access Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Continue Learning */}
          <div 
            className="group p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98] hover:border-[#688837] transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1"
            onClick={() => onNavigate('lessons')}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl text-[#2D2A26]" style={{ fontFamily: 'Amiri, serif' }}>
                Continue Learning
              </h3>
            </div>
            <p className="text-[#2D2A26]/70 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              Lesson 12: Verb Conjugation
            </p>
            <div className="w-full h-2 bg-[#E1CB98]/30 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-[#688837] to-[#C8A560] rounded-full"></div>
            </div>
            <p className="text-sm text-[#2D2A26]/60 mt-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
              75% complete
            </p>
          </div>

          {/* Recent Mistakes */}
          <div 
            className="p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98] hover:border-[#688837] transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8A560] to-[#E1CB98] flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl text-[#2D2A26]" style={{ fontFamily: 'Amiri, serif' }}>
                Recent Mistakes
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#E1CB98]/20">
                <span className="text-sm text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Iʿrāb rules
                </span>
                <span className="text-xs text-[#688837]">3 errors</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#E1CB98]/20">
                <span className="text-sm text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Harakāt placement
                </span>
                <span className="text-xs text-[#688837]">2 errors</span>
              </div>
            </div>
          </div>

          {/* Daily Challenge */}
          <div 
            className="p-6 rounded-2xl bg-gradient-to-br from-[#688837]/10 to-[#C8A560]/10 border-2 border-[#C8A560] hover:border-[#688837] transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1"
            onClick={() => onNavigate('games')}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl text-[#2D2A26]" style={{ fontFamily: 'Amiri, serif' }}>
                Daily Challenge
              </h3>
            </div>
            <p className="text-[#2D2A26]/70 mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
              Complete today's grammar puzzle
            </p>
            <Button className="w-full bg-[#688837] hover:bg-[#688837]/90 text-white rounded-xl">
              Start Challenge
            </Button>
          </div>
        </div>

        {/* Progress Tracker & Daily Tip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Section */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
            <h3 className="text-2xl text-[#2D2A26] mb-6" style={{ fontFamily: 'Amiri, serif' }}>
              Your Progress
            </h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* XP Points */}
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#688837]/10 to-transparent">
                <div className="w-12 h-12 rounded-full bg-[#688837] text-white flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-2xl text-[#688837] mb-1">2,450</div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  XP Points
                </div>
              </div>

              {/* Lessons Completed */}
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#C8A560]/10 to-transparent">
                <div className="w-12 h-12 rounded-full bg-[#C8A560] text-white flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="text-2xl text-[#C8A560] mb-1">24</div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Lessons Done
                </div>
              </div>

              {/* Badges */}
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#688837]/10 to-transparent">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#688837] to-[#C8A560] text-white flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="text-2xl text-[#688837] mb-1">7</div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Badges
                </div>
              </div>
            </div>

            {/* Weekly Goal */}
            <div className="p-4 rounded-xl bg-[#E1CB98]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#2D2A26]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Weekly Goal
                </span>
                <span className="text-[#688837]">
                  4/7 days
                </span>
              </div>
              <div className="w-full h-3 bg-[#E1CB98]/30 rounded-full overflow-hidden">
                <div className="h-full w-[57%] bg-gradient-to-r from-[#688837] to-[#C8A560] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Daily Tip */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#688837]/10 to-[#C8A560]/10 border-2 border-[#C8A560]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl text-[#2D2A26]" style={{ fontFamily: 'Amiri, serif' }}>
                Daily Tip
              </h3>
            </div>
            
            <div 
              className="text-2xl text-[#688837] mb-4 text-right leading-relaxed"
              style={{ fontFamily: 'Amiri, serif' }}
            >
              الفعل المضارع المرفوع
            </div>
            
            <p className="text-[#2D2A26]/70 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
              Remember: The present tense verb (الفعل المضارع) is in the nominative case (مرفوع) when it is not preceded by a particle that causes it to be in the accusative or jussive case.
            </p>

            <div className="mt-4 p-3 rounded-lg bg-white/50 border border-[#E1CB98]">
              <p className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                💡 Tip: Look for the dammah (ُ) on the last letter!
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Lessons */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl text-[#2D2A26]" style={{ fontFamily: 'Amiri, serif' }}>
              Recommended for You
            </h3>
            <Button 
              variant="ghost" 
              className="text-[#688837] hover:text-[#688837]/80"
              onClick={() => onNavigate('lessons')}
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Noun Cases', level: 'Intermediate', progress: 0 },
              { title: 'Sentence Structure', level: 'Beginner', progress: 40 },
              { title: 'Advanced Morphology', level: 'Advanced', progress: 0 },
            ].map((lesson, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98] hover:border-[#688837] transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1"
                onClick={() => onNavigate('lessons')}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    lesson.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                    lesson.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {lesson.level}
                  </span>
                  <BookOpen className="w-5 h-5 text-[#688837]" />
                </div>
                <h4 className="text-lg text-[#2D2A26] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                  {lesson.title}
                </h4>
                {lesson.progress > 0 && (
                  <>
                    <div className="w-full h-2 bg-[#E1CB98]/30 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-gradient-to-r from-[#688837] to-[#C8A560] rounded-full"
                        style={{ width: `${lesson.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {lesson.progress}% complete
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
