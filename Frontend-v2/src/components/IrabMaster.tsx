import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ProgressBar } from "./ProgressBar";
import { GamificationBadge } from "./GamificationBadge";
import { LevelBadge } from "./LevelBadge";
import { Sidebar } from "./Sidebar";
import { Page } from "../App";
import { Check, X, ChevronDown, ChevronUp, ArrowLeft, Lightbulb } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface Sentence {
  id: string;
  text: string;
  highlightedWord: string;
  highlightStart: number;
  highlightEnd: number;
  correctAnswer: string;
  explanation: string;
}

interface IrabMasterProps {
  onBack: () => void;
  onNavigate?: (page: Page) => void;
  onLogout?: () => void;
}

export function IrabMaster({ onBack, onNavigate, onLogout }: IrabMasterProps) {
  const [currentSentence] = useState<Sentence>({
    id: "1",
    text: "ذهب الطالب إلى المدرسة.",
    highlightedWord: "الطالب",
    highlightStart: 5,
    highlightEnd: 12,
    correctAnswer: "فاعل",
    explanation: "الطالب هو من قام بالفعل (ذهب)، وبالتالي يُعرب فاعلاً مرفوعاً وعلامة رفعه الضمة الظاهرة على آخره."
  });

  const options = [
    { id: "fa3il", text: "فاعل", description: "من قام بالفعل" },
    { id: "maf3oul", text: "مفعول به", description: "من وقع عليه الفعل" },
    { id: "mubtada", text: "مبتدأ", description: "اسم مرفوع في بداية الجملة" },
    { id: "khabar", text: "خبر", description: "ما يُخبر به عن المبتدأ" },
  ];

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [progress] = useState({ current: 6, total: 10 });
  const [earnedXp, setEarnedXp] = useState(0);

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (selectedOption === currentSentence.correctAnswer) {
      setEarnedXp(100);
    }
  };

  const renderSentence = () => {
    const { text, highlightStart, highlightEnd } = currentSentence;
    const before = text.substring(0, highlightStart);
    const highlighted = text.substring(highlightStart, highlightEnd);
    const after = text.substring(highlightEnd);

    return (
      <div className="text-2xl text-right leading-relaxed font-serif">
        <span>{before}</span>
        <span className="px-2 py-1 rounded-lg border-2" style={{ backgroundColor: '#FFE4A3', color: '#5A4A2F', borderColor: '#D4A574' }}>
          {highlighted}
        </span>
        <span>{after}</span>
      </div>
    );
  };

  const isCorrect = selectedOption === currentSentence.correctAnswer;

  return (
    <div className="flex min-h-screen bg-[#FFFDF6]">
      {onNavigate && onLogout && (
        <Sidebar currentPage="games" onNavigate={onNavigate} onLogout={onLogout} />
      )}
      <main className={`flex-1 ${onNavigate ? 'ml-64' : ''} p-4 md:p-8`}>
        <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 mb-6 hover:underline"
          style={{ color: '#6B8F3D' }}
        >
          <ArrowLeft className="size-4" />
          Back to Games
        </button>

        {/* Main Card */}
        <Card className="p-6 md:p-8 border-[#E1CB98] border-2 shadow-md bg-white rounded-2xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="size-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(to bottom right, #FFE4E8, #FFC0CB)' }}>
                  <span className="text-2xl">👑</span>
                </div>
                <div>
                  <h1 className="font-serif mb-1">I'râb Master</h1>
                  <p className="text-muted-foreground">Identify the correct grammatical case in complex sentences</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LevelBadge level="Advanced" />
                {earnedXp > 0 && <GamificationBadge type="xp" value={earnedXp} />}
              </div>
            </div>
            <ProgressBar 
              progress={progress.current} 
              total={progress.total}
            />
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Sentence Display */}
              <div>
                <p className="text-muted-foreground mb-3">Analyze this sentence:</p>
                <Card className="p-6 border-2 shadow-sm" style={{ backgroundColor: '#FFFCF5', borderColor: '#D4A574' }}>
                  {renderSentence()}
                </Card>
              </div>

              {/* Options */}
              <div>
                <p className="text-muted-foreground mb-3">
                  Choose the grammatical role for "<span className="text-foreground">{currentSentence.highlightedWord}</span>"
                </p>
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  {options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => !isSubmitted && setSelectedOption(option.text)}
                      disabled={isSubmitted}
                      className={`p-4 rounded-xl border-2 transition-all text-right ${isSubmitted ? 'cursor-default' : 'hover:shadow-sm'}`}
                      style={{
                        borderColor: isSubmitted && selectedOption === option.text
                          ? option.text === currentSentence.correctAnswer ? '#0F7B5E' : '#C41E3A'
                          : selectedOption === option.text ? '#6B8F3D' : '#D4A574',
                        backgroundColor: isSubmitted && selectedOption === option.text
                          ? option.text === currentSentence.correctAnswer ? '#D4F1E8' : '#FFE4E8'
                          : selectedOption === option.text ? '#F0F7E8' : '#FFF9E6'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubmitted && selectedOption !== option.text) {
                          e.currentTarget.style.borderColor = '#6B8F3D';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubmitted && selectedOption !== option.text) {
                          e.currentTarget.style.borderColor = '#D4A574';
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-left flex-1">
                          <div className="text-muted-foreground">{option.description}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-xl font-serif">{option.text}</div>
                          {isSubmitted && selectedOption === option.text && (
                            option.text === currentSentence.correctAnswer ? (
                              <Check className="size-5" style={{ color: '#0F7B5E' }} />
                            ) : (
                              <X className="size-5" style={{ color: '#C41E3A' }} />
                            )
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Explanation Card */}
              {showExplanation && isSubmitted && (
                <Card className="p-5 shadow-sm" style={{ backgroundColor: '#E8F4FD', borderColor: '#7FB3D5' }}>
                  <div className="flex gap-3">
                    <div className="size-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#B8D9F0' }}>
                      <Lightbulb className="size-5" style={{ color: '#2C5F7F' }} />
                    </div>
                    <div className="flex-1 text-right">
                      <h4 className="mb-1.5" style={{ color: '#2C5F7F' }}>شرح مفصل</h4>
                      <p className="leading-relaxed" style={{ color: 'rgba(44, 95, 127, 0.9)' }}>
                        {currentSentence.explanation}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowExplanation(!showExplanation)}
                  disabled={!isSubmitted}
                  variant="outline"
                  className="flex-1 hover:bg-accent"
                  style={{ borderColor: '#D4A574' }}
                >
                  Show Explanation
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!selectedOption || isSubmitted}
                  className="flex-1 text-white"
                  style={{ backgroundColor: '#6B8F3D' }}
                  onMouseEnter={(e) => {
                    if (selectedOption && !isSubmitted) {
                      e.currentTarget.style.backgroundColor = '#5A7732';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedOption && !isSubmitted) {
                      e.currentTarget.style.backgroundColor = '#6B8F3D';
                    }
                  }}
                >
                  Submit Analysis
                </Button>
              </div>

              {/* Grammar Breakdown Collapsible */}
              <Card className="shadow-sm overflow-hidden" style={{ borderColor: '#D4A574' }}>
                <Collapsible open={isBreakdownOpen} onOpenChange={setIsBreakdownOpen}>
                  <CollapsibleTrigger className="w-full p-4 flex items-center justify-between transition-colors" style={{ '--hover-bg': '#FFFCF5' } as React.CSSProperties} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFFCF5'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <h3 className="font-serif">Grammar Breakdown – التحليل النحوي</h3>
                    {isBreakdownOpen ? (
                      <ChevronUp className="size-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="size-5 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 border-t space-y-3" style={{ borderColor: '#E8E2D5' }}>
                      <div className="p-3 rounded-lg border" style={{ backgroundColor: '#FFF9E6', borderColor: '#D4A574' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-muted-foreground">الفعل</span>
                          <span className="font-serif">ذهب</span>
                        </div>
                        <p className="text-muted-foreground">فعل ماضٍ مبني على الفتح</p>
                      </div>
                      <div className="p-3 rounded-lg border" style={{ backgroundColor: '#FFF9E6', borderColor: '#D4A574' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-muted-foreground">الفاعل</span>
                          <span className="font-serif">الطالب</span>
                        </div>
                        <p className="text-muted-foreground">فاعل مرفوع وعلامة رفعه الضمة</p>
                      </div>
                      <div className="p-3 rounded-lg border" style={{ backgroundColor: '#FFF9E6', borderColor: '#D4A574' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-muted-foreground">حرف الجر</span>
                          <span className="font-serif">إلى</span>
                        </div>
                        <p className="text-muted-foreground">حرف جر</p>
                      </div>
                      <div className="p-3 rounded-lg border" style={{ backgroundColor: '#FFF9E6', borderColor: '#D4A574' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-muted-foreground">الاسم المجرور</span>
                          <span className="font-serif">المدرسة</span>
                        </div>
                        <p className="text-muted-foreground">اسم مجرور بـ (إلى) وعلامة جره الكسرة</p>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-4">
              {/* Progress Card */}
              <Card className="p-5 shadow-sm" style={{ borderColor: '#D4A574', backgroundColor: '#FFFCF5' }}>
                <div className="text-center">
                  <div className="size-14 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E0F2E9' }}>
                    <span className="text-2xl">📊</span>
                  </div>
                  <h4 className="mb-1" style={{ color: '#0F7B5E' }}>Mastery Level</h4>
                  <div className="text-3xl mb-1" style={{ color: '#0F7B5E' }}>67%</div>
                  <p className="text-muted-foreground">I'râb Analysis</p>
                </div>
              </Card>

              {/* Streak Card */}
              <Card className="p-5 shadow-sm" style={{ borderColor: '#D4A574', backgroundColor: '#FFFCF5' }}>
                <div className="text-center">
                  <div className="size-14 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFE4A3' }}>
                    <span className="text-2xl">🔥</span>
                  </div>
                  <h4 className="mb-1" style={{ color: '#B8860B' }}>Current Streak</h4>
                  <div className="text-3xl mb-1" style={{ color: '#B8860B' }}>12 days</div>
                  <p className="text-muted-foreground">Keep it going!</p>
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="p-5 shadow-sm" style={{ borderColor: '#D4A574' }}>
                <h4 className="font-serif mb-3">Today's Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Exercises Completed</span>
                    <span>6/10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Accuracy Rate</span>
                    <span style={{ color: '#0F7B5E' }}>89%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time Spent</span>
                    <span>28 min</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>
        </div>
      </main>
    </div>
  );
}
