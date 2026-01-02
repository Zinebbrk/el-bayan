import { useState, useEffect } from 'react';
import { FileCheck, Clock, TrendingUp, Award, ChevronRight, Loader2 } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Page } from '../App';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { assessmentService } from '../services/assessmentService';
import type { Assessment, AssessmentSession } from '../utils/supabase/client';

interface AssessmentsProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Assessments({ onNavigate, onLogout }: AssessmentsProps) {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentSession[]>([]);
  const [bestScores, setBestScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [activeAssessment, setActiveAssessment] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<AssessmentSession | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<string>('00:00');

  // Fetch assessments and history on mount
  useEffect(() => {
    if (user) {
      loadAssessments();
      loadHistory();
    }
  }, [user]);

  // Timer for assessment
  useEffect(() => {
    if (startTime && !showResults) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        setTimeElapsed(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, showResults]);

  const loadAssessments = async () => {
    try {
      const data = await assessmentService.getAssessments();
      setAssessments(data);
      if (user) {
        const scores = await assessmentService.getBestScores(user.id);
        setBestScores(scores);
      }
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    if (!user) return;
    try {
      const history = await assessmentService.getAssessmentHistory(user.id);
      setAssessmentHistory(history);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleStartAssessment = async (assessmentId: string) => {
    if (!user) return;
    
    try {
      const result = await assessmentService.startAssessment(user.id, assessmentId);
      if (result) {
        setActiveAssessment(assessmentId);
        setCurrentSession(result.session);
        setQuestions(result.questions);
        setAnswers(new Array(result.questions.length).fill(''));
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResults(false);
        setStartTime(new Date());
        setTimeElapsed('00:00');
      }
    } catch (error) {
      console.error('Error starting assessment:', error);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1] || null);
    } else {
      handleSubmitAssessment();
    }
  };

  const handleSubmitAssessment = async () => {
    if (!currentSession) return;

    try {
      const result = await assessmentService.submitAssessment(currentSession.id, answers);
      if (result) {
        setResults(result);
        setShowResults(true);
        await loadHistory();
        await loadAssessments(); // Reload to update best scores
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
    }
  };

  const handleExitAssessment = () => {
    setActiveAssessment(null);
    setCurrentSession(null);
    setQuestions([]);
    setAnswers([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResults(false);
    setResults(null);
    setStartTime(null);
  };

  // Calculate statistics
  const calculateStats = () => {
    if (assessmentHistory.length === 0) {
      return { averageScore: 0, completedCount: 0, perfectScores: 0 };
    }

    const scores = assessmentHistory.map(s => s.score || 0);
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const completedCount = assessmentHistory.length;
    const perfectScores = scores.filter(s => s === 100).length;

    return { averageScore, completedCount, perfectScores };
  };

  const stats = calculateStats();

  // Get assessment display info
  const getAssessmentDisplayInfo = (assessment: Assessment) => {
    const bestScore = bestScores[assessment.id];
    const hasCompleted = bestScore !== undefined;
    const difficultyMap: Record<string, string> = {
      easy: 'Beginner',
      medium: 'Intermediate',
      hard: 'Advanced',
    };
    
    return {
      ...assessment,
      difficulty: difficultyMap[assessment.difficulty] || assessment.difficulty,
      completed: hasCompleted,
      score: bestScore,
      questions: 10, // Default from service
      time: `${assessment.estimated_time_minutes} min`,
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FFFDF6]">
        <Sidebar currentPage="assessments" onNavigate={onNavigate} onLogout={onLogout} />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#688837]" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FFFDF6]">
      <Sidebar currentPage="assessments" onNavigate={onNavigate} onLogout={onLogout} />
      
      <main className="flex-1 ml-64 p-8">
        {!activeAssessment ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 
                className="text-4xl text-[#2D2A26] mb-2"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Assessments & Quizzes
              </h1>
              <p className="text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Test your knowledge and track your progress
              </p>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#688837]/10 to-transparent border-2 border-[#688837]/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#688837] flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl text-[#688837]">{stats.averageScore}%</div>
                    <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Average Score
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#C8A560]/10 to-transparent border-2 border-[#C8A560]/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#C8A560] flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl text-[#C8A560]">{stats.completedCount}</div>
                    <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Completed
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#E1CB98]/20 to-transparent border-2 border-[#E1CB98]">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl text-[#688837]">{stats.perfectScores}</div>
                    <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Perfect Scores
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Assessments */}
            <div>
              <h2 
                className="text-2xl text-[#2D2A26] mb-6"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Available Assessments
              </h2>

              {assessments.length === 0 ? (
                <div className="text-center py-12 text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  No assessments available yet.
                </div>
              ) : (
                <div className="grid gap-4">
                  {assessments.map((assessment) => {
                    const displayInfo = getAssessmentDisplayInfo(assessment);
                    return (
                      <div
                        key={assessment.id}
                        className="group p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98] hover:border-[#688837] transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="flex items-center gap-6">
                          <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center">
                            <FileCheck className="w-8 h-8 text-white" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs ${
                                displayInfo.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                displayInfo.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                                {displayInfo.difficulty}
                              </span>
                              {displayInfo.completed && displayInfo.score !== undefined && (
                                <span className="px-3 py-1 rounded-full bg-[#688837]/10 text-[#688837] text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                  Best: {displayInfo.score}%
                                </span>
                              )}
                            </div>
                            
                            <h3 className="text-xl text-[#2D2A26] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                              {assessment.title}
                            </h3>
                            
                            <div className="flex items-center gap-4 text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                              <span className="flex items-center gap-1">
                                <FileCheck className="w-4 h-4" />
                                {displayInfo.questions} questions
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {displayInfo.time}
                              </span>
                            </div>
                          </div>

                          <Button 
                            onClick={() => handleStartAssessment(assessment.id)}
                            className="bg-[#688837] hover:bg-[#688837]/90 text-white rounded-xl px-6"
                          >
                            {displayInfo.completed ? 'Retake' : 'Start'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            {assessmentHistory.length > 0 && (
              <div className="mt-8">
                <h2 
                  className="text-2xl text-[#2D2A26] mb-6"
                  style={{ fontFamily: 'Amiri, serif' }}
                >
                  Recent Activity
                </h2>

                <div className="space-y-3">
                  {assessmentHistory.slice(0, 5).map((session) => {
                    const assessment = assessments.find(a => a.id === session.assessment_id);
                    if (!assessment) return null;
                    return (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-[#FFFDF6] border border-[#E1CB98]"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            session.score && session.score >= 90 ? 'bg-green-100' :
                            session.score && session.score >= 70 ? 'bg-yellow-100' :
                            'bg-red-100'
                          }`}>
                            <Award className={`w-5 h-5 ${
                              session.score && session.score >= 90 ? 'text-green-600' :
                              session.score && session.score >= 70 ? 'text-yellow-600' :
                              'text-red-600'
                            }`} />
                          </div>
                          <div>
                            <div className="text-[#2D2A26]" style={{ fontFamily: 'Amiri, serif' }}>
                              {assessment.title}
                            </div>
                            <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                              {session.completed_at && new Date(session.completed_at).toLocaleDateString()} • Score: {session.score || 0}%
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#688837]" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : !showResults ? (
          <>
            {/* Assessment In Progress */}
            {questions.length > 0 && currentQuestion < questions.length ? (
              <div className="max-w-3xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={handleExitAssessment}
                    className="text-[#688837] hover:text-[#688837]/80"
                  >
                    ← Exit Assessment
                  </Button>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#E1CB98]/30">
                      <Clock className="w-4 h-4 text-[#688837]" />
                      <span className="text-[#688837]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {timeElapsed}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <span className="text-sm text-[#688837]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#E1CB98]/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#688837] to-[#C8A560] rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question */}
                <div className="p-8 rounded-3xl bg-[#FFFDF6] border-2 border-[#E1CB98] mb-6">
                  <h2 
                    className="text-2xl text-[#2D2A26] mb-6 whitespace-pre-line leading-relaxed"
                    style={{ fontFamily: 'Amiri, serif' }}
                  >
                    {questions[currentQuestion]?.question}
                  </h2>

                  <div className="space-y-3">
                    {questions[currentQuestion]?.options?.map((option: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(option)}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                          selectedAnswer === option
                            ? 'bg-[#688837] text-white border-2 border-[#688837]'
                            : 'bg-white border-2 border-[#E1CB98] hover:border-[#688837] text-[#2D2A26]'
                        }`}
                        style={{ fontFamily: 'Amiri, serif' }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswer === option
                              ? 'border-white bg-white'
                              : 'border-[#E1CB98]'
                          }`}>
                            {selectedAnswer === option && (
                              <div className="w-3 h-3 rounded-full bg-[#688837]"></div>
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    disabled={currentQuestion === 0}
                    onClick={handlePreviousQuestion}
                    className="border-[#E1CB98] text-[#688837] hover:bg-[#E1CB98]/20"
                  >
                    Previous
                  </Button>
                  <Button
                    disabled={!selectedAnswer}
                    onClick={handleNextQuestion}
                    className="bg-[#688837] hover:bg-[#688837]/90 text-white"
                  >
                    {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Assessment'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#688837] mx-auto mb-4" />
                <p className="text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Loading assessment...
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Results Page */}
            {results && (
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center mx-auto mb-6">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                  <h1 
                    className="text-4xl text-[#2D2A26] mb-3"
                    style={{ fontFamily: 'Amiri, serif' }}
                  >
                    Assessment Complete!
                  </h1>
                  <p className="text-[#2D2A26]/60 text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Great job! Here are your results
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-gradient-to-br from-[#688837]/10 to-[#C8A560]/10 border-2 border-[#C8A560] mb-8">
                  <div className="text-center mb-6">
                    <div className="text-6xl text-[#688837] mb-2">{results.score}%</div>
                    <div className="text-xl text-[#2D2A26]" style={{ fontFamily: 'Amiri, serif' }}>
                      Your Score
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-xl bg-white/50">
                      <div className="text-2xl text-green-600 mb-1">
                        {results.results.filter((r: any) => r.isCorrect).length}
                      </div>
                      <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        Correct
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/50">
                      <div className="text-2xl text-red-600 mb-1">
                        {results.results.filter((r: any) => !r.isCorrect).length}
                      </div>
                      <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        Incorrect
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/50">
                      <div className="text-2xl text-[#688837] mb-1">{timeElapsed}</div>
                      <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        Time
                      </div>
                    </div>
                  </div>
                </div>

                {results.results.some((r: any) => !r.isCorrect) && (
                  <div className="space-y-4 mb-8">
                    <h2 
                      className="text-2xl text-[#2D2A26] mb-4"
                      style={{ fontFamily: 'Amiri, serif' }}
                    >
                      Review Incorrect Answers
                    </h2>
                    {results.results.filter((r: any) => !r.isCorrect).map((result: any, index: number) => (
                      <div key={index} className="p-4 rounded-xl bg-[#FFFDF6] border-2 border-red-200">
                        <div className="text-[#2D2A26] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                          {result.question}
                        </div>
                        <div className="text-sm text-red-600 mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          Your answer: {result.userAnswer}
                        </div>
                        <div className="text-sm text-green-600 mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          Correct answer: {result.correctAnswer}
                        </div>
                        {result.explanation && (
                          <div className="text-sm text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                            {result.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={handleExitAssessment}
                    variant="outline"
                    className="flex-1 border-[#E1CB98] text-[#688837] hover:bg-[#E1CB98]/20"
                  >
                    Back to Assessments
                  </Button>
                  <Button
                    onClick={() => onNavigate('lessons')}
                    className="flex-1 bg-[#688837] hover:bg-[#688837]/90 text-white"
                  >
                    Review Lessons
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
