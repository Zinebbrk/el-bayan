import { useState } from 'react';
import { FileCheck, Clock, TrendingUp, Award, ChevronRight } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Page } from '../App';
import { Button } from './ui/button';

interface AssessmentsProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Assessments({ onNavigate, onLogout }: AssessmentsProps) {
  const [activeAssessment, setActiveAssessment] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const assessments = [
    { id: 1, title: 'Noun Cases Assessment', questions: 15, time: '20 min', difficulty: 'Intermediate', completed: true, score: 87 },
    { id: 2, title: 'Verb Conjugation Quiz', questions: 20, time: '25 min', difficulty: 'Beginner', completed: true, score: 92 },
    { id: 3, title: 'Iʿrāb Analysis Test', questions: 10, time: '15 min', difficulty: 'Advanced', completed: false, score: null },
    { id: 4, title: 'Sentence Structure Quiz', questions: 12, time: '18 min', difficulty: 'Intermediate', completed: false, score: null },
  ];

  const questions = [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the correct harakah for the subject (فاعل) in this sentence?\nالطالب_ يدرس الدرس',
      options: ['َ (fatha)', 'ُ (dammah)', 'ِ (kasra)', 'ْ (sukun)'],
      correct: 'ُ (dammah)',
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: 'Identify the grammatical function of "الكتابَ" in: قرأَ الطالبُ الكتابَ',
      options: ['Subject (فاعل)', 'Direct Object (مفعول به)', 'Predicate (خبر)', 'Possessive (مضاف إليه)'],
      correct: 'Direct Object (مفعول به)',
    },
  ];

  const handleStartAssessment = (id: number) => {
    setActiveAssessment(id);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResults(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

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
                    <div className="text-2xl text-[#688837]">89%</div>
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
                    <div className="text-2xl text-[#C8A560]">24</div>
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
                    <div className="text-2xl text-[#688837]">5</div>
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

              <div className="grid gap-4">
                {assessments.map((assessment) => (
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
                            assessment.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                            assessment.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                            {assessment.difficulty}
                          </span>
                          {assessment.completed && assessment.score && (
                            <span className="px-3 py-1 rounded-full bg-[#688837]/10 text-[#688837] text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
                              Score: {assessment.score}%
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl text-[#2D2A26] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                          {assessment.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          <span className="flex items-center gap-1">
                            <FileCheck className="w-4 h-4" />
                            {assessment.questions} questions
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {assessment.time}
                          </span>
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleStartAssessment(assessment.id)}
                        className="bg-[#688837] hover:bg-[#688837]/90 text-white rounded-xl px-6"
                      >
                        {assessment.completed ? 'Retake' : 'Start'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h2 
                className="text-2xl text-[#2D2A26] mb-6"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Recent Activity
              </h2>

              <div className="space-y-3">
                {assessments.filter(a => a.completed).map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#FFFDF6] border border-[#E1CB98]"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        assessment.score && assessment.score >= 90 ? 'bg-green-100' :
                        assessment.score && assessment.score >= 70 ? 'bg-yellow-100' :
                        'bg-red-100'
                      }`}>
                        <Award className={`w-5 h-5 ${
                          assessment.score && assessment.score >= 90 ? 'text-green-600' :
                          assessment.score && assessment.score >= 70 ? 'text-yellow-600' :
                          'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <div className="text-[#2D2A26]" style={{ fontFamily: 'Amiri, serif' }}>
                          {assessment.title}
                        </div>
                        <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          Completed • Score: {assessment.score}%
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#688837]" />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : !showResults ? (
          <>
            {/* Assessment In Progress */}
            <div className="max-w-3xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setActiveAssessment(null)}
                  className="text-[#688837] hover:text-[#688837]/80"
                >
                  ← Exit Assessment
                </Button>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#E1CB98]/30">
                    <Clock className="w-4 h-4 text-[#688837]" />
                    <span className="text-[#688837]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      15:32
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
                  {questions[currentQuestion].question}
                </h2>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAnswer(option)}
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
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
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
          </>
        ) : (
          <>
            {/* Results Page */}
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
                  <div className="text-6xl text-[#688837] mb-2">85%</div>
                  <div className="text-xl text-[#2D2A26]" style={{ fontFamily: 'Amiri, serif' }}>
                    Your Score
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-white/50">
                    <div className="text-2xl text-green-600 mb-1">17</div>
                    <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Correct
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/50">
                    <div className="text-2xl text-red-600 mb-1">3</div>
                    <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Incorrect
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/50">
                    <div className="text-2xl text-[#688837] mb-1">15:24</div>
                    <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Time
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h2 
                  className="text-2xl text-[#2D2A26] mb-4"
                  style={{ fontFamily: 'Amiri, serif' }}
                >
                  Areas to Improve
                </h2>
                <div className="p-4 rounded-xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#2D2A26]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Iʿrāb identification
                    </span>
                    <span className="text-sm text-red-600">2 mistakes</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#2D2A26]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Harakāt placement
                    </span>
                    <span className="text-sm text-red-600">1 mistake</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setActiveAssessment(null)}
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
          </>
        )}
      </main>
    </div>
  );
}
