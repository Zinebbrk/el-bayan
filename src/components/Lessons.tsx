import { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, Lock, CheckCircle, PlayCircle, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Page } from '../App';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useLessons, useUserProgress, updateLessonProgress, addXP } from '../hooks/useUserData';
import { lessonService } from '../services/lessonService';
import { lessonAIService, type AdaptiveExample, type ReviewQuestion } from '../services/lessons/lessonAIService';
import type { Lesson } from '../utils/supabase/client';
import { Input } from './ui/input';

interface LessonsProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Lessons({ onNavigate, onLogout }: LessonsProps) {
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedLessonData, setSelectedLessonData] = useState<Lesson | null>(null);
  const [lessonsWithProgress, setLessonsWithProgress] = useState<Array<Lesson & { progress?: number; completed?: boolean }>>([]);
  const [stats, setStats] = useState({ completed: 0, inProgress: 0, total: 0 });
  const [levelLockStatus, setLevelLockStatus] = useState<{
    beginner: boolean;
    intermediate: boolean;
    advanced: boolean;
  }>({ beginner: false, intermediate: false, advanced: false });
  
  // AI-generated content state
  const [adaptiveExamples, setAdaptiveExamples] = useState<AdaptiveExample[]>([]);
  const [reviewQuestions, setReviewQuestions] = useState<ReviewQuestion[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [ragAvailable, setRagAvailable] = useState(false);
  // Track selected answers for review questions
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  
  const { lessons, loading: lessonsLoading, error: lessonsError } = useLessons(selectedLevel);
  const { progress: userProgress, loading: progressLoading } = useUserProgress();

  // Fetch lessons with progress when level or user changes
  useEffect(() => {
    const fetchLessonsWithProgress = async () => {
      // If no lessons yet, clear state
      if (lessons.length === 0) {
        setLessonsWithProgress([]);
        setStats({ completed: 0, inProgress: 0, total: 0 });
        return;
      }

      if (!user) {
        // No user - show lessons without progress
        setLessonsWithProgress(lessons.map(lesson => ({ ...lesson, progress: 0, completed: false })));
        setStats({ completed: 0, inProgress: 0, total: lessons.length });
        return;
      }

      try {
        // Use new function that applies level locking
        const lessonsWithProgressData = await lessonService.getLessonsWithProgressAndLocking(user.id, selectedLevel);
        setLessonsWithProgress(lessonsWithProgressData);
        
        // Calculate stats
        const completed = lessonsWithProgressData.filter(l => l.completed).length;
        const inProgress = lessonsWithProgressData.filter(l => l.progress && l.progress > 0 && l.progress < 100).length;
        setStats({ completed, inProgress, total: lessonsWithProgressData.length });
      } catch (error) {
        console.error('Error fetching lessons with progress:', error);
        // Fallback: show lessons without progress data
        setLessonsWithProgress(lessons.map(lesson => ({ ...lesson, progress: 0, completed: false })));
        setStats({ completed: 0, inProgress: 0, total: lessons.length });
      }
    };

    fetchLessonsWithProgress();
  }, [lessons, selectedLevel, user, userProgress]);

  // Check level lock status when user or progress changes
  useEffect(() => {
    const checkLevelLocks = async () => {
      if (!user) {
        // No user - only beginner is unlocked
        setLevelLockStatus({ beginner: false, intermediate: true, advanced: true });
        return;
      }

      try {
        const intermediateLocked = await lessonService.isLevelLocked(user.id, 'intermediate');
        const advancedLocked = await lessonService.isLevelLocked(user.id, 'advanced');
        
        setLevelLockStatus({
          beginner: false, // Beginner is always unlocked
          intermediate: intermediateLocked,
          advanced: advancedLocked,
        });
      } catch (error) {
        console.error('Error checking level locks:', error);
        // Default: only beginner unlocked
        setLevelLockStatus({ beginner: false, intermediate: true, advanced: true });
      }
    };

    checkLevelLocks();
  }, [user, userProgress]);
  
  // AI service is always available (uses free API or mock)
  useEffect(() => {
    setRagAvailable(true); // Lesson AI service is always available
  }, []);

  // Fetch lesson content and generate AI content when a lesson is selected
  useEffect(() => {
    console.log('🟡 [Lessons] useEffect triggered. selectedLessonId:', selectedLessonId);
    
    const fetchLessonContent = async () => {
      if (!selectedLessonId) {
        console.log('🟡 [Lessons] No selectedLessonId, clearing content');
        setSelectedLessonData(null);
        setAdaptiveExamples([]);
        setReviewQuestions([]);
        return;
      }

      try {
        console.log('🟡 [Lessons] Fetching lesson with ID:', selectedLessonId);
        const lesson = await lessonService.getLessonById(selectedLessonId);
        console.log('🟡 [Lessons] Lesson fetched:', lesson);
        console.log('🟡 [Lessons] Lesson title:', lesson?.title);
        console.log('🟡 [Lessons] lessonAIService available:', typeof lessonAIService);
        
        setSelectedLessonData(lesson);
        
        // Mark lesson as started if not already started
        if (user && lesson) {
          const lessonProgressData = userProgress.find(p => p.lesson_id === lesson.id);
          if (!lessonProgressData || lessonProgressData.progress_percentage === 0) {
            await updateLessonProgress(user.id, lesson.id, 0);
          }
        }

        // Generate AI content (non-blocking, always available)
        if (lesson && lesson.title) {
          console.log('🟢 [Lessons] Starting AI generation for lesson:', lesson.title);
          setLoadingAI(true);
          
          // Use async IIFE to generate AI content
          (async () => {
            try {
              console.log('🟢 [Lessons] Inside AI generation async function');
              
              // Generate adaptive examples (always generate, even if empty)
              console.log('🔵 [Lessons] Calling generateAdaptiveExamples for:', lesson.title);
              try {
                const examples = await lessonAIService.generateAdaptiveExamples(
                  lesson.title,
                  undefined, // user interests - could be from profile
                  undefined, // context
                  3 // Generate 3 examples
                );
                console.log('✅ [Lessons] Received examples:', examples);
                console.log('✅ [Lessons] Examples count:', examples?.length);
                
                if (examples && Array.isArray(examples)) {
                  setAdaptiveExamples(examples);
                  console.log('✅ [Lessons] Examples set in state:', examples.length, 'examples');
                } else {
                  console.warn('⚠️ [Lessons] Examples is not an array:', examples);
                  setAdaptiveExamples([]);
                }
              } catch (error) {
                console.error('❌ [Lessons] Error generating adaptive examples:', error);
                setAdaptiveExamples([]);
              }

              // Generate review questions if lesson is completed
              const lessonProgressData = userProgress.find(p => p.lesson_id === lesson.id);
              if (lessonProgressData?.completed_at) {
                console.log('🔵 [Lessons] Lesson completed, generating review questions...');
                const questions = await lessonAIService.generateReviewQuestions(
                  lesson.title,
                  lesson.id,
                  selectedLevel,
                  5
                );
                setReviewQuestions(questions);
                console.log('✅ [Lessons] Review questions set');
              }
            } catch (error) {
              console.error('❌ [Lessons] Error generating AI content:', error);
              console.error('❌ [Lessons] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
              // Don't block UI on AI errors
              setAdaptiveExamples([]);
            } finally {
              setLoadingAI(false);
              console.log('🟢 [Lessons] AI generation complete, loadingAI set to false');
            }
          })();
        } else {
          console.warn('⚠️ [Lessons] No lesson or no title. Lesson:', lesson, 'Title:', lesson?.title);
          // No lesson - clear AI content
          setAdaptiveExamples([]);
        }
      } catch (error) {
        console.error('❌ [Lessons] Error fetching lesson content:', error);
      }
    };

    fetchLessonContent();
  }, [selectedLessonId, user, selectedLevel, userProgress]);

  // Determine lesson status
  const getLessonStatus = (lesson: Lesson & { progress?: number; completed?: boolean }) => {
    if (lesson.is_locked) return 'locked';
    if (lesson.completed) return 'completed';
    if (lesson.progress && lesson.progress > 0) return 'in-progress';
    return 'available';
  };

  // Handle lesson click
  const handleLessonClick = async (lesson: Lesson & { progress?: number; completed?: boolean }) => {
    if (lesson.is_locked || getLessonStatus(lesson) === 'locked') return;
    
    setSelectedLessonId(lesson.id);
    
    // Mark lesson as started if not already started
    if (user && (!lesson.progress || lesson.progress === 0)) {
      await lessonService.updateLessonProgress(user.id, lesson.id, 0);
    }
  };

  // Handle progress update (when user completes a section)
  const handleProgressUpdate = async (progressPercentage: number) => {
    if (!user || !selectedLessonId) return;

    const success = await lessonService.updateLessonProgress(user.id, selectedLessonId, progressPercentage);
    if (success && progressPercentage === 100) {
      // Award XP for completing lesson
      await addXP(user.id, 50);
      // Refresh progress
      const updatedProgress = await lessonService.getLessonsWithProgressAndLocking(user.id, selectedLevel);
      setLessonsWithProgress(updatedProgress);
      
      // Recheck level locks in case this completion unlocked the next level
      try {
        const intermediateLocked = await lessonService.isLevelLocked(user.id, 'intermediate');
        const advancedLocked = await lessonService.isLevelLocked(user.id, 'advanced');
        setLevelLockStatus({
          beginner: false,
          intermediate: intermediateLocked,
          advanced: advancedLocked,
        });
      } catch (error) {
        console.error('Error rechecking level locks:', error);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFFDF6]">
      <Sidebar currentPage="lessons" onNavigate={onNavigate} onLogout={onLogout} />
      
      <main className="flex-1 ml-64 p-8">
        {!selectedLessonId ? (
          <>
            {/* Not Signed In Banner */}
            {!user && (
              <div className="mb-6 p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                <p className="text-blue-700" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  <strong>Demo Mode:</strong> You're viewing lessons without signing in. Progress won't be saved. 
                  <Button 
                    variant="link" 
                    onClick={() => onNavigate('landing')}
                    className="text-blue-700 underline ml-2 p-0 h-auto"
                  >
                    Sign in to save your progress
                  </Button>
                </p>
              </div>
            )}

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
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
                const isLocked = levelLockStatus[level];
                const levelName = level.charAt(0).toUpperCase() + level.slice(1);
                
                return (
                  <button
                    key={level}
                    onClick={() => !isLocked && setSelectedLevel(level)}
                    disabled={isLocked}
                    className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                      isLocked
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                        : selectedLevel === level
                        ? 'bg-[#688837] text-white shadow-lg'
                        : 'bg-[#E1CB98]/30 text-[#2D2A26]/70 hover:bg-[#E1CB98]/50'
                    }`}
                    style={{ fontFamily: 'Cairo, sans-serif' }}
                    title={isLocked ? `Complete all ${level === 'intermediate' ? 'beginner' : 'intermediate'} lessons to unlock` : undefined}
                  >
                    {isLocked && <Lock className="w-4 h-4" />}
                    {levelName}
                    {isLocked && (
                      <span className="text-xs ml-1">(Locked)</span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Level Lock Info */}
            {user && (levelLockStatus.intermediate || levelLockStatus.advanced) && (
              <div className="mb-6 p-4 rounded-xl bg-yellow-50 border-2 border-yellow-200">
                <p className="text-yellow-800" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  <strong>🔒 Level Locked:</strong> Complete all lessons and exercises in the current level to unlock the next level.
                </p>
              </div>
            )}

            {/* Loading State */}
            {(lessonsLoading || progressLoading) && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#688837] animate-spin" />
                <span className="ml-3 text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Loading lessons...
                </span>
              </div>
            )}

            {/* Error State */}
            {lessonsError && (
              <div className="p-6 rounded-2xl bg-red-50 border-2 border-red-200">
                <p className="text-red-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Error loading lessons: {lessonsError.message}
                </p>
              </div>
            )}

            {/* Lessons Grid */}
            {!lessonsLoading && !progressLoading && !lessonsError && (
            <div className="grid gap-4">
                {lessonsWithProgress.length === 0 && lessons.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#E1CB98]/20 border-2 border-[#E1CB98] text-center">
                    <p className="text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      No lessons available for this level yet.
                    </p>
                    <p className="text-xs text-[#2D2A26]/40 mt-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Make sure you've run the database migrations (002_seed_data.sql)
                    </p>
                  </div>
                ) : lessonsWithProgress.length === 0 && lessons.length > 0 ? (
                  <div className="p-8 rounded-2xl bg-yellow-50 border-2 border-yellow-200 text-center">
                    <p className="text-yellow-700" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Loading lesson progress...
                    </p>
                  </div>
                ) : (
                  lessonsWithProgress.map((lesson) => {
                    const status = getLessonStatus(lesson);
                    const isLocked = status === 'locked' || lesson.is_locked;
                    
                    return (
                <div
                  key={lesson.id}
                  className={`group p-6 rounded-2xl border-2 transition-all duration-300 ${
                          isLocked
                      ? 'bg-[#FFFDF6]/50 border-[#E1CB98]/30 opacity-60 cursor-not-allowed'
                      : 'bg-[#FFFDF6] border-[#E1CB98] hover:border-[#688837] cursor-pointer hover:shadow-lg'
                  }`}
                        onClick={() => !isLocked && handleLessonClick(lesson)}
                >
                  <div className="flex items-center gap-6">
                    {/* Status Icon */}
                    <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
                            status === 'completed'
                        ? 'bg-green-100'
                              : status === 'in-progress'
                        ? 'bg-[#C8A560]/20'
                        : 'bg-gray-100'
                    }`}>
                            {status === 'completed' ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                            ) : status === 'in-progress' ? (
                        <PlayCircle className="w-8 h-8 text-[#C8A560]" />
                      ) : (
                        <Lock className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-[#688837]/10 text-[#688837] text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                Lesson {lesson.order_index}
                        </span>
                              {status === 'completed' && (
                          <span className="text-xs text-green-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
                            ✓ Completed
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl text-[#2D2A26] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                        {lesson.title}
                      </h3>
                            <p className="text-sm text-[#2D2A26]/60 mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                              {lesson.description}
                            </p>
                      
                            {lesson.progress && lesson.progress > 0 && (
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
                          {!isLocked && (
                      <ChevronRight className="w-6 h-6 text-[#688837] group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </div>
                    );
                  })
                )}
            </div>
            )}

            {/* Stats Section */}
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#688837]/10 to-transparent border-2 border-[#688837]/20">
                <div className="text-3xl text-[#688837] mb-2">{stats.completed}</div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Lessons Completed
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#C8A560]/10 to-transparent border-2 border-[#C8A560]/20">
                <div className="text-3xl text-[#C8A560] mb-2">{stats.inProgress}</div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  In Progress
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#E1CB98]/20 to-transparent border-2 border-[#E1CB98]">
                <div className="text-3xl text-[#688837] mb-2">{stats.total}</div>
                <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Total Lessons
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
                onClick={() => {
                  setSelectedLessonId(null);
                  setSelectedLessonData(null);
                }}
                className="mb-6 text-[#688837] hover:text-[#688837]/80"
              >
                ← Back to Lessons
              </Button>

              {/* Loading State for Lesson Content */}
              {!selectedLessonData && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#688837] animate-spin" />
                  <span className="ml-3 text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Loading lesson...
                  </span>
                </div>
              )}

              {/* Lesson Content */}
              {selectedLessonData && (
                <>
              {/* Lesson Header */}
              <div className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-[#688837]/10 to-[#C8A560]/10 border-2 border-[#C8A560]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/50 text-[#688837] text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        Lesson {selectedLessonData.order_index} • {selectedLessonData.level}
                  </span>
                </div>
                <h1 
                  className="text-3xl text-[#2D2A26] mb-3"
                  style={{ fontFamily: 'Amiri, serif' }}
                >
                      {selectedLessonData.title}
                </h1>
                <p className="text-[#2D2A26]/70 text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {selectedLessonData.description}
                </p>
              </div>

                  {/* Lesson Content Sections */}
              <div className="space-y-6">
                    {selectedLessonData.content && typeof selectedLessonData.content === 'object' && (
                      <>
                        {/* Render sections if they exist */}
                        {selectedLessonData.content.sections && Array.isArray(selectedLessonData.content.sections) && (
                          selectedLessonData.content.sections.map((section: any, index: number) => (
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
                              {section.content && (
                    <p className="text-[#2D2A26]/80 leading-relaxed mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {section.content}
                    </p>
                              )}
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
                              {/* Render examples if they exist */}
                              {section.examples && Array.isArray(section.examples) && (
                                <div className="mt-4 space-y-3">
                                  {section.examples.map((example: any, exIndex: number) => (
                                    <div key={exIndex} className="p-4 rounded-xl bg-[#E1CB98]/20 border border-[#E1CB98]">
                                      {example.arabic && (
                                        <div className="text-xl text-[#688837] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                                          {example.arabic}
                                        </div>
                                      )}
                                      {example.transliteration && (
                                        <div className="text-sm text-[#2D2A26]/70 mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                          {example.transliteration}
                                        </div>
                                      )}
                                      {example.translation && (
                                        <div className="text-sm text-[#2D2A26]/80" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                          {example.translation}
                                        </div>
                                      )}
                                      {example.analysis && (
                                        <div className="text-xs text-[#2D2A26]/60 mt-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                          {example.analysis}
                      </div>
                    )}
                  </div>
                ))}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                        
                        {/* Fallback: Display raw content if sections don't exist */}
                        {(!selectedLessonData.content.sections || selectedLessonData.content.sections.length === 0) && (
                          <div className="p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
                            <p className="text-[#2D2A26]/80 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
                              {JSON.stringify(selectedLessonData.content, null, 2)}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {/* AI-Generated Adaptive Examples - Always show section */}
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-[#C8A560]/10 to-[#E1CB98]/10 border-2 border-[#C8A560]/20 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[#688837]" />
                          <h2 
                            className="text-2xl text-[#2D2A26]"
                            style={{ fontFamily: 'Amiri, serif' }}
                          >
                            أمثلة توضيحية مخصصة
                          </h2>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            if (!selectedLessonData) return;
                            setLoadingAI(true);
                            try {
                              const examples = await lessonAIService.generateAdaptiveExamples(
                                selectedLessonData.title,
                                undefined,
                                undefined,
                                3
                              );
                              setAdaptiveExamples(examples || []);
                            } catch (error) {
                              console.error('Error regenerating examples:', error);
                            } finally {
                              setLoadingAI(false);
                            }
                          }}
                          disabled={loadingAI}
                          className="text-[#688837]"
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${loadingAI ? 'animate-spin' : ''}`} />
                          تحديث
                        </Button>
                      </div>
                      
                      {loadingAI ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 text-[#688837] animate-spin" />
                          <span className="ml-3 text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                            جاري إنشاء الأمثلة...
                          </span>
                        </div>
                      ) : adaptiveExamples.length > 0 ? (
                        <div className="space-y-4">
                          {adaptiveExamples.map((example, idx) => (
                            <div key={idx} className="p-6 rounded-xl bg-white border-2 border-[#E1CB98] hover:border-[#688837] transition-colors">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 rounded-full bg-[#688837]/10 text-[#688837] text-xs font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                  مثال {idx + 1}
                                </span>
                              </div>
                              {example.arabic && (
                                <div className="text-2xl text-[#688837] mb-3 leading-relaxed" style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}>
                                  {example.arabic}
                                </div>
                              )}
                              {example.transliteration && (
                                <div className="text-sm text-[#2D2A26]/70 mb-2 italic" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                  {example.transliteration}
                                </div>
                              )}
                              {example.translation && (
                                <div className="text-base text-[#2D2A26]/80 mb-3 font-medium" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                  {example.translation}
                                </div>
                              )}
                              {example.analysis && (
                                <div className="text-sm text-[#2D2A26]/70 mt-3 p-3 bg-[#E1CB98]/20 rounded-lg border border-[#E1CB98]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                  <span className="font-semibold text-[#688837]">التحليل النحوي:</span> {example.analysis}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-[#2D2A26]/60 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
                            لا توجد أمثلة متاحة حالياً
                          </p>
                          <Button
                            variant="outline"
                            onClick={async () => {
                              if (!selectedLessonData) return;
                              setLoadingAI(true);
                              try {
                                const examples = await lessonAIService.generateAdaptiveExamples(
                                  selectedLessonData.title,
                                  undefined,
                                  undefined,
                                  3
                                );
                                setAdaptiveExamples(examples || []);
                              } catch (error) {
                                console.error('Error generating examples:', error);
                              } finally {
                                setLoadingAI(false);
                              }
                            }}
                            disabled={loadingAI}
                            className="border-[#688837] text-[#688837] hover:bg-[#688837]/10"
                          >
                            {loadingAI ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                جاري الإنشاء...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                إنشاء أمثلة
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Review Questions for Completed Lessons */}
                    {reviewQuestions.length > 0 && (
                      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#C8A560]/10 to-[#E1CB98]/10 border-2 border-[#C8A560]/20 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h2 
                            className="text-2xl text-[#2D2A26]"
                            style={{ fontFamily: 'Amiri, serif' }}
                          >
                            أسئلة مراجعة
                          </h2>
                        </div>
                        <p className="text-sm text-[#2D2A26]/70 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          اختبر فهمك للدرس من خلال هذه الأسئلة:
                        </p>
                        <div className="space-y-4">
                          {reviewQuestions.map((question, idx) => {
                            const selectedAnswer = selectedAnswers[question.id];
                            const isCorrect = selectedAnswer === question.correctAnswer;
                            const hasAnswered = selectedAnswer !== undefined;
                            
                            return (
                              <div key={question.id} className="p-4 rounded-xl bg-white border-2 border-[#E1CB98]">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-semibold text-[#688837]">{idx + 1}.</span>
                                  <p className="text-[#2D2A26]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                    {question.question}
                                  </p>
                                </div>
                                {question.type === 'multiple-choice' && question.options && (
                                  <div className="space-y-2 mt-3">
                                    {question.options.map((option, optIdx) => {
                                      const isSelected = selectedAnswer === option;
                                      const isCorrectOption = option === question.correctAnswer;
                                      
                                      // Determine button styling
                                      let buttonClass = "w-full text-right p-3 rounded-lg border-2 transition-all text-sm font-medium ";
                                      
                                      if (hasAnswered) {
                                        if (isSelected && isCorrect) {
                                          // Selected and correct - green
                                          buttonClass += "bg-green-100 border-green-500 text-green-800";
                                        } else if (isSelected && !isCorrect) {
                                          // Selected and wrong - red
                                          buttonClass += "bg-red-100 border-red-500 text-red-800";
                                        } else if (isCorrectOption) {
                                          // Correct answer (not selected) - show as green
                                          buttonClass += "bg-green-50 border-green-300 text-green-700";
                                        } else {
                                          // Other options - neutral
                                          buttonClass += "bg-gray-50 border-gray-200 text-gray-600";
                                        }
                                      } else {
                                        // Not answered yet - normal hover state
                                        buttonClass += "border-[#E1CB98] hover:border-[#688837] hover:bg-[#688837]/5 text-[#2D2A26]";
                                      }
                                      
                                      return (
                                        <button
                                          key={optIdx}
                                          onClick={() => {
                                            if (!hasAnswered) {
                                              setSelectedAnswers(prev => ({
                                                ...prev,
                                                [question.id]: option
                                              }));
                                            }
                                          }}
                                          disabled={hasAnswered}
                                          className={buttonClass}
                                          style={{ fontFamily: 'Cairo, sans-serif' }}
                                        >
                                          {option}
                                          {hasAnswered && isSelected && isCorrect && (
                                            <span className="mr-2">✓</span>
                                          )}
                                          {hasAnswered && isSelected && !isCorrect && (
                                            <span className="mr-2">✗</span>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                                {question.type === 'true-false' && (
                                  <div className="space-y-2 mt-3">
                                    {['صح', 'خطأ'].map((option) => {
                                      const isSelected = selectedAnswer === option;
                                      const isCorrectOption = option === question.correctAnswer;
                                      
                                      let buttonClass = "w-full text-right p-3 rounded-lg border-2 transition-all text-sm font-medium ";
                                      
                                      if (hasAnswered) {
                                        if (isSelected && isCorrect) {
                                          buttonClass += "bg-green-100 border-green-500 text-green-800";
                                        } else if (isSelected && !isCorrect) {
                                          buttonClass += "bg-red-100 border-red-500 text-red-800";
                                        } else if (isCorrectOption) {
                                          buttonClass += "bg-green-50 border-green-300 text-green-700";
                                        } else {
                                          buttonClass += "bg-gray-50 border-gray-200 text-gray-600";
                                        }
                                      } else {
                                        buttonClass += "border-[#E1CB98] hover:border-[#688837] hover:bg-[#688837]/5 text-[#2D2A26]";
                                      }
                                      
                                      return (
                                        <button
                                          key={option}
                                          onClick={() => {
                                            if (!hasAnswered) {
                                              setSelectedAnswers(prev => ({
                                                ...prev,
                                                [question.id]: option
                                              }));
                                            }
                                          }}
                                          disabled={hasAnswered}
                                          className={buttonClass}
                                          style={{ fontFamily: 'Cairo, sans-serif' }}
                                        >
                                          {option}
                                          {hasAnswered && isSelected && isCorrect && (
                                            <span className="mr-2">✓</span>
                                          )}
                                          {hasAnswered && isSelected && !isCorrect && (
                                            <span className="mr-2">✗</span>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                                {question.type === 'short-answer' && (
                                  <div className="mt-3">
                                    <Input
                                      type="text"
                                      placeholder="اكتب إجابتك هنا..."
                                      value={selectedAnswer || ''}
                                      onChange={(e) => {
                                        if (!hasAnswered) {
                                          setSelectedAnswers(prev => ({
                                            ...prev,
                                            [question.id]: e.target.value
                                          }));
                                        }
                                      }}
                                      disabled={hasAnswered}
                                      className={`w-full border-2 ${
                                        hasAnswered
                                          ? isCorrect
                                            ? 'bg-green-50 border-green-500 text-green-800'
                                            : 'bg-red-50 border-red-500 text-red-800'
                                          : 'border-[#E1CB98] focus:border-[#688837]'
                                      }`}
                                      style={{ fontFamily: 'Cairo, sans-serif' }}
                                    />
                                  </div>
                                )}
                                {/* Show explanation only after answer is selected */}
                                {hasAnswered && question.explanation && (
                                  <div className={`mt-4 p-4 rounded-lg border-2 ${
                                    isCorrect 
                                      ? 'bg-green-50 border-green-200' 
                                      : 'bg-red-50 border-red-200'
                                  }`}>
                                    <p className={`text-sm font-semibold mb-2 ${
                                      isCorrect ? 'text-green-800' : 'text-red-800'
                                    }`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                                      {isCorrect ? '✓ إجابة صحيحة!' : '✗ إجابة خاطئة'}
                                    </p>
                                    <p className="text-sm text-[#2D2A26]/80 mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                      <strong>الإجابة الصحيحة:</strong> {question.correctAnswer}
                                    </p>
                                    <p className="text-sm text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                      {question.explanation}
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                    </div>
                  </div>
                    )}

                    {/* Complete Lesson Button */}
                    {user && (
                      <div className="flex justify-center pt-6">
                        <Button 
                          onClick={async () => {
                            await handleProgressUpdate(100);
                            // Refresh the lesson list
                            if (user) {
                              const updated = await lessonService.getLessonsWithProgress(user.id, selectedLevel);
                              setLessonsWithProgress(updated);
                            }
                          }}
                          className="bg-[#688837] hover:bg-[#688837]/90 text-white rounded-xl px-8 py-6 text-lg"
                        >
                          ✓ Mark as Complete
                  </Button>
                </div>
                    )}

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6">
                  <Button 
                        variant="outline" 
                        onClick={() => {
                          const currentIndex = lessonsWithProgress.findIndex(l => l.id === selectedLessonId);
                          const prevLesson = lessonsWithProgress[currentIndex - 1];
                          if (prevLesson && !prevLesson.is_locked) {
                            setSelectedLessonId(prevLesson.id);
                          }
                        }}
                        disabled={!lessonsWithProgress.find(l => l.id === selectedLessonId) || 
                                 lessonsWithProgress.findIndex(l => l.id === selectedLessonId) === 0}
                        className="border-[#E1CB98] text-[#688837] hover:bg-[#E1CB98]/20"
                      >
                        ← Previous Lesson
                      </Button>
                      <Button 
                        onClick={() => {
                          setSelectedLessonId(null);
                          setSelectedLessonData(null);
                        }}
                    variant="outline" 
                    className="border-[#E1CB98] text-[#688837] hover:bg-[#E1CB98]/20"
                  >
                        Back to List
                  </Button>
                      <Button 
                        onClick={() => {
                          const currentIndex = lessonsWithProgress.findIndex(l => l.id === selectedLessonId);
                          const nextLesson = lessonsWithProgress[currentIndex + 1];
                          if (nextLesson && !nextLesson.is_locked) {
                            setSelectedLessonId(nextLesson.id);
                          }
                        }}
                        disabled={!lessonsWithProgress.find(l => l.id === selectedLessonId) || 
                                 lessonsWithProgress.findIndex(l => l.id === selectedLessonId) === lessonsWithProgress.length - 1}
                        className="bg-[#688837] hover:bg-[#688837]/90 text-white"
                      >
                    Next Lesson →
                  </Button>
                </div>
              </div>
                  </>
                )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
