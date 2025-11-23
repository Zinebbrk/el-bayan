import { useState } from 'react';
import { BookOpen, ChevronRight, Lock, CheckCircle, PlayCircle } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Page } from '../App';
import { Button } from './ui/button';

interface LessonsProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Lessons({ onNavigate, onLogout }: LessonsProps) {
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const lessons = {
    beginner: [
      { id: 1, title: 'Introduction to Arabic Grammar', status: 'completed', progress: 100 },
      { id: 2, title: 'The Arabic Alphabet & Diacritics', status: 'completed', progress: 100 },
      { id: 3, title: 'Nouns (الأسماء)', status: 'completed', progress: 100 },
      { id: 4, title: 'Definite & Indefinite Articles', status: 'in-progress', progress: 65 },
      { id: 5, title: 'Gender in Arabic', status: 'locked', progress: 0 },
      { id: 6, title: 'Basic Sentence Structure', status: 'locked', progress: 0 },
    ],
    intermediate: [
      { id: 7, title: 'Verb Conjugation Basics', status: 'completed', progress: 100 },
      { id: 8, title: 'Past Tense (الفعل الماضي)', status: 'completed', progress: 100 },
      { id: 9, title: 'Present Tense (الفعل المضارع)', status: 'in-progress', progress: 75 },
      { id: 10, title: 'Future Tense', status: 'locked', progress: 0 },
      { id: 11, title: 'Imperative (الأمر)', status: 'locked', progress: 0 },
      { id: 12, title: 'Negation Rules', status: 'locked', progress: 0 },
    ],
    advanced: [
      { id: 13, title: 'Case Endings (الإعراب)', status: 'locked', progress: 0 },
      { id: 14, title: 'Nominative Case (المرفوع)', status: 'locked', progress: 0 },
      { id: 15, title: 'Accusative Case (المنصوب)', status: 'locked', progress: 0 },
      { id: 16, title: 'Genitive Case (المجرور)', status: 'locked', progress: 0 },
      { id: 17, title: 'Advanced Morphology (الصرف)', status: 'locked', progress: 0 },
      { id: 18, title: 'Rhetorical Devices (البلاغة)', status: 'locked', progress: 0 },
    ],
  };

  const lessonContent = {
    title: 'Present Tense (الفعل المضارع)',
    description: 'Learn how to conjugate and use present tense verbs in Arabic grammar',
    sections: [
      {
        title: 'Introduction',
        content: 'The present tense verb (الفعل المضارع) is used to describe actions happening now or in the future. It is formed by adding specific prefixes to the verb root.',
      },
      {
        title: 'Conjugation Pattern',
        content: 'The present tense follows a specific pattern based on the subject pronoun. Each pronoun has its own prefix and sometimes suffix.',
        example: '• أنا أَكْتُبُ - I write\n• أنتَ تَكْتُبُ - You (masc.) write\n• هو يَكْتُبُ - He writes',
      },
      {
        title: 'Case Marking',
        content: 'Present tense verbs are normally in the nominative case (مرفوع) unless preceded by certain particles that change the case to accusative (منصوب) or jussive (مجزوم).',
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-[#FFFDF6]">
      <Sidebar currentPage="lessons" onNavigate={onNavigate} onLogout={onLogout} />
      
      <main className="flex-1 ml-64 p-8">
        {!selectedLesson ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 
                className="text-4xl text-[#2D2A26] mb-2"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Learning Path
              </h1>
              <p className="text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Progress through structured lessons adapted to your level
              </p>
            </div>

            {/* Level Selector */}
            <div className="flex gap-4 mb-8">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-6 py-3 rounded-xl transition-all duration-200 ${
                    selectedLevel === level
                      ? 'bg-[#688837] text-white shadow-lg'
                      : 'bg-[#E1CB98]/30 text-[#2D2A26]/70 hover:bg-[#E1CB98]/50'
                  }`}
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>

            {/* Lessons Grid */}
            <div className="grid gap-4">
              {lessons[selectedLevel].map((lesson) => (
                <div
                  key={lesson.id}
                  className={`group p-6 rounded-2xl border-2 transition-all duration-300 ${
                    lesson.status === 'locked'
                      ? 'bg-[#FFFDF6]/50 border-[#E1CB98]/30 opacity-60 cursor-not-allowed'
                      : 'bg-[#FFFDF6] border-[#E1CB98] hover:border-[#688837] cursor-pointer hover:shadow-lg'
                  }`}
                  onClick={() => lesson.status !== 'locked' && setSelectedLesson(lesson.id)}
                >
                  <div className="flex items-center gap-6">
                    {/* Status Icon */}
                    <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
                      lesson.status === 'completed'
                        ? 'bg-green-100'
                        : lesson.status === 'in-progress'
                        ? 'bg-[#C8A560]/20'
                        : 'bg-gray-100'
                    }`}>
                      {lesson.status === 'completed' ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      ) : lesson.status === 'in-progress' ? (
                        <PlayCircle className="w-8 h-8 text-[#C8A560]" />
                      ) : (
                        <Lock className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-[#688837]/10 text-[#688837] text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          Lesson {lesson.id}
                        </span>
                        {lesson.status === 'completed' && (
                          <span className="text-xs text-green-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
                            ✓ Completed
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl text-[#2D2A26] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                        {lesson.title}
                      </h3>
                      
                      {lesson.progress > 0 && (
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-[#E1CB98]/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#688837] to-[#C8A560] rounded-full transition-all duration-300"
                              style={{ width: `${lesson.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                            {lesson.progress}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Arrow */}
                    {lesson.status !== 'locked' && (
                      <ChevronRight className="w-6 h-6 text-[#688837] group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#688837]/10 to-transparent border-2 border-[#688837]/20">
                <div className="text-3xl text-[#688837] mb-2">24</div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Lessons Completed
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#C8A560]/10 to-transparent border-2 border-[#C8A560]/20">
                <div className="text-3xl text-[#C8A560] mb-2">5</div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  In Progress
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#E1CB98]/20 to-transparent border-2 border-[#E1CB98]">
                <div className="text-3xl text-[#688837] mb-2">12</div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Hours Studied
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Lesson Content View */}
            <div className="max-w-4xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => setSelectedLesson(null)}
                className="mb-6 text-[#688837] hover:text-[#688837]/80"
              >
                ← Back to Lessons
              </Button>

              {/* Lesson Header */}
              <div className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-[#688837]/10 to-[#C8A560]/10 border-2 border-[#C8A560]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/50 text-[#688837] text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Lesson {selectedLesson}
                  </span>
                </div>
                <h1 
                  className="text-3xl text-[#2D2A26] mb-3"
                  style={{ fontFamily: 'Amiri, serif' }}
                >
                  {lessonContent.title}
                </h1>
                <p className="text-[#2D2A26]/70 text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {lessonContent.description}
                </p>
              </div>

              {/* Lesson Content */}
              <div className="space-y-6">
                {lessonContent.sections.map((section, index) => (
                  <div 
                    key={index}
                    className="p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]"
                  >
                    <h2 
                      className="text-2xl text-[#2D2A26] mb-4"
                      style={{ fontFamily: 'Amiri, serif' }}
                    >
                      {section.title}
                    </h2>
                    <p className="text-[#2D2A26]/80 leading-relaxed mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {section.content}
                    </p>
                    {section.example && (
                      <div className="p-4 rounded-xl bg-[#E1CB98]/20 border border-[#E1CB98]">
                        <div 
                          className="text-lg text-[#688837] whitespace-pre-line"
                          style={{ fontFamily: 'Amiri, serif' }}
                        >
                          {section.example}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Interactive Exercise */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-[#688837]/5 to-[#C8A560]/5 border-2 border-[#688837]/20">
                  <h2 
                    className="text-2xl text-[#2D2A26] mb-4"
                    style={{ fontFamily: 'Amiri, serif' }}
                  >
                    Practice Exercise
                  </h2>
                  <p className="text-[#2D2A26]/70 mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Fill in the correct form of the present tense verb:
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="p-4 rounded-xl bg-white border-2 border-[#E1CB98]">
                      <p className="text-lg text-[#2D2A26] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                        أنا ____ الكتاب (to read - قرأ)
                      </p>
                      <input
                        type="text"
                        placeholder="Type your answer..."
                        className="w-full px-4 py-2 rounded-lg border border-[#E1CB98] focus:border-[#688837] focus:outline-none"
                        style={{ fontFamily: 'Cairo, sans-serif' }}
                      />
                    </div>
                  </div>

                  <Button className="w-full bg-[#688837] hover:bg-[#688837]/90 text-white rounded-xl py-6">
                    Check Answer
                  </Button>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6">
                  <Button 
                    variant="outline" 
                    className="border-[#E1CB98] text-[#688837] hover:bg-[#E1CB98]/20"
                  >
                    Previous Lesson
                  </Button>
                  <Button className="bg-[#688837] hover:bg-[#688837]/90 text-white">
                    Next Lesson →
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
