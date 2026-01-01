import { User, Edit2, Award, BookOpen, Target, TrendingUp, Calendar } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Page } from '../App';
import { Button } from './ui/button';

interface ProfileProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Profile({ onNavigate, onLogout }: ProfileProps) {
  const badges = [
    { id: 1, name: 'First Steps', icon: '🎯', earned: true, date: 'Nov 1, 2025' },
    { id: 2, name: 'Grammar Novice', icon: '📚', earned: true, date: 'Nov 5, 2025' },
    { id: 3, name: 'Week Warrior', icon: '🔥', earned: true, date: 'Nov 8, 2025' },
    { id: 4, name: 'Perfect Score', icon: '💯', earned: true, date: 'Nov 12, 2025' },
    { id: 5, name: 'Quick Learner', icon: '⚡', earned: true, date: 'Nov 14, 2025' },
    { id: 6, name: 'Verb Master', icon: '👑', earned: true, date: 'Nov 16, 2025' },
    { id: 7, name: 'Consistency King', icon: '🌟', earned: true, date: 'Nov 18, 2025' },
    { id: 8, name: 'Iʿrāb Expert', icon: '🎓', earned: false, date: null },
    { id: 9, name: 'Grammar Guru', icon: '✨', earned: false, date: null },
  ];

  const activityData = [
    { day: 'Mon', hours: 1.5 },
    { day: 'Tue', hours: 2.0 },
    { day: 'Wed', hours: 1.0 },
    { day: 'Thu', hours: 2.5 },
    { day: 'Fri', hours: 1.8 },
    { day: 'Sat', hours: 3.0 },
    { day: 'Sun', hours: 2.2 },
  ];

  const maxHours = Math.max(...activityData.map(d => d.hours));

  const topicMastery = [
    { topic: 'Noun Cases', mastery: 85, status: 'good' },
    { topic: 'Verb Conjugation', mastery: 92, status: 'excellent' },
    { topic: 'Sentence Structure', mastery: 78, status: 'good' },
    { topic: 'Iʿrāb Analysis', mastery: 65, status: 'needs-work' },
    { topic: 'Diacritics', mastery: 88, status: 'good' },
    { topic: 'Morphology', mastery: 45, status: 'needs-work' },
  ];

  return (
    <div className="flex min-h-screen bg-[#FFFDF6]">
      <Sidebar currentPage="profile" onNavigate={onNavigate} onLogout={onLogout} />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-4xl text-[#2D2A26] mb-2"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            Your Profile
          </h1>
          <p className="text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
            Track your progress and achievements
          </p>
        </div>

        {/* Profile Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#688837]/10 to-[#C8A560]/10 border-2 border-[#C8A560] mb-8">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center text-white text-3xl">
                A
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-[#688837] flex items-center justify-center hover:bg-[#E1CB98]/20 transition-colors">
                <Edit2 className="w-4 h-4 text-[#688837]" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 
                  className="text-2xl text-[#2D2A26]"
                  style={{ fontFamily: 'Amiri, serif' }}
                >
                  Ahmed Mohammed
                </h2>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#688837] to-[#C8A560] text-white text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Level 12
                </span>
              </div>
              <p className="text-[#2D2A26]/60 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
                ahmed.m@email.com • Joined Nov 2025
              </p>

              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/50">
                  <div className="text-2xl text-[#688837] mb-1">2,450</div>
                  <div className="text-xs text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Total XP
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/50">
                  <div className="text-2xl text-[#688837] mb-1">24</div>
                  <div className="text-xs text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Lessons
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/50">
                  <div className="text-2xl text-[#688837] mb-1">7</div>
                  <div className="text-xs text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Badges
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/50">
                  <div className="text-2xl text-[#688837] mb-1">7</div>
                  <div className="text-xs text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Day Streak
                  </div>
                </div>
              </div>
            </div>

            <Button className="bg-[#688837] hover:bg-[#688837]/90 text-white rounded-xl px-6">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Learning Timeline */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-[#688837]" />
              <h2 
                className="text-2xl text-[#2D2A26]"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Learning Timeline
              </h2>
            </div>

            <div className="space-y-6">
              {[
                { date: 'Nov 18, 2025', event: 'Completed Lesson: Present Tense', type: 'lesson' },
                { date: 'Nov 17, 2025', event: 'Earned Badge: Consistency King', type: 'badge' },
                { date: 'Nov 16, 2025', event: 'Assessment Score: 92%', type: 'assessment' },
                { date: 'Nov 15, 2025', event: 'Completed 5 Games', type: 'game' },
                { date: 'Nov 14, 2025', event: 'Reached Level 12', type: 'level' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    item.type === 'lesson' ? 'bg-blue-100' :
                    item.type === 'badge' ? 'bg-yellow-100' :
                    item.type === 'assessment' ? 'bg-green-100' :
                    item.type === 'game' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    {item.type === 'lesson' && <BookOpen className="w-5 h-5 text-blue-600" />}
                    {item.type === 'badge' && <Award className="w-5 h-5 text-yellow-600" />}
                    {item.type === 'assessment' && <Target className="w-5 h-5 text-green-600" />}
                    {item.type === 'game' && <Target className="w-5 h-5 text-purple-600" />}
                    {item.type === 'level' && <TrendingUp className="w-5 h-5 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-[#2D2A26]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {item.event}
                    </div>
                    <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {item.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-[#688837]" />
                <h3 
                  className="text-xl text-[#2D2A26]"
                  style={{ fontFamily: 'Amiri, serif' }}
                >
                  This Week
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Study Time
                  </span>
                  <span className="text-[#688837]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    12.4 hrs
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Lessons
                  </span>
                  <span className="text-[#688837]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    8
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Assessments
                  </span>
                  <span className="text-[#688837]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    3
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Games Played
                  </span>
                  <span className="text-[#688837]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    12
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#688837]/10 to-[#C8A560]/10 border-2 border-[#688837]/20">
              <h3 
                className="text-xl text-[#2D2A26] mb-3"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Learning Preferences
              </h3>
              <div className="space-y-2 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                <div className="flex items-center justify-between">
                  <span className="text-[#2D2A26]/70">Level</span>
                  <span className="text-[#688837]">Intermediate</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#2D2A26]/70">Dialect</span>
                  <span className="text-[#688837]">Classical Arabic</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#2D2A26]/70">Diacritics</span>
                  <span className="text-[#688837]">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Activity Heatmap */}
        <div className="p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98] mb-8">
          <h2 
            className="text-2xl text-[#2D2A26] mb-6"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            Weekly Activity
          </h2>
          
          <div className="flex items-end justify-between gap-4 h-48">
            {activityData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-3">
                <div className="flex-1 w-full flex items-end">
                  <div 
                    className="w-full bg-gradient-to-t from-[#688837] to-[#C8A560] rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{ height: `${(data.hours / maxHours) * 100}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-[#2D2A26]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {data.day}
                  </div>
                  <div className="text-xs text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {data.hours}h
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Mastery */}
        <div className="p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98] mb-8">
          <h2 
            className="text-2xl text-[#2D2A26] mb-6"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            Topic Mastery
          </h2>

          <div className="space-y-4">
            {topicMastery.map((topic, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#2D2A26]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {topic.topic}
                  </span>
                  <span className={`text-sm ${
                    topic.status === 'excellent' ? 'text-green-600' :
                    topic.status === 'good' ? 'text-[#688837]' :
                    'text-orange-600'
                  }`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {topic.mastery}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#E1CB98]/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      topic.status === 'excellent' ? 'bg-green-500' :
                      topic.status === 'good' ? 'bg-gradient-to-r from-[#688837] to-[#C8A560]' :
                      'bg-orange-500'
                    }`}
                    style={{ width: `${topic.mastery}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Collection */}
        <div className="p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-[#688837]" />
              <h2 
                className="text-2xl text-[#2D2A26]"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Badge Collection
              </h2>
            </div>
            <span className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {badges.filter(b => b.earned).length} / {badges.length}
            </span>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`group relative p-4 rounded-2xl text-center transition-all ${
                  badge.earned
                    ? 'bg-gradient-to-br from-[#688837]/10 to-[#C8A560]/10 border-2 border-[#C8A560] cursor-pointer hover:scale-105'
                    : 'bg-gray-100 border-2 border-gray-200 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="text-xs text-[#2D2A26]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {badge.name}
                </div>
                {badge.earned && badge.date && (
                  <div className="text-[10px] text-[#2D2A26]/60 mt-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {badge.date}
                  </div>
                )}
                {!badge.earned && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-xl">
                      🔒
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
