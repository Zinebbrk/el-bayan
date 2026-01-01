import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ProgressBar } from "./ProgressBar";
import { GamificationBadge } from "./GamificationBadge";
import { LevelBadge } from "./LevelBadge";
import { HintCard } from "./HintCard";
import { Sidebar } from "./Sidebar";
import { Page } from "../App";
import { Check, X, ArrowLeft } from "lucide-react";

interface Word {
  id: string;
  text: string;
  correctHaraka: string;
  matched?: string;
}

interface HarakaMatchingProps {
  onBack: () => void;
  onNavigate?: (page: Page) => void;
  onLogout?: () => void;
}

export function HarakaMatching({ onBack, onNavigate, onLogout }: HarakaMatchingProps) {
  const [words, setWords] = useState<Word[]>([
    { id: "1", text: "كَتَبَ", correctHaraka: "َ" },
    { id: "2", text: "دَخَلَ", correctHaraka: "َ" },
    { id: "3", text: "لَعِبَ", correctHaraka: "ِ" },
  ]);
  
  const harakatOptions = [
    { id: "fat", symbol: "َ", name: "فتحة" },
    { id: "kas", symbol: "ِ", name: "كسرة" },
    { id: "dam", symbol: "ُ", name: "ضمة" },
  ];
  
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<{ [key: string]: boolean }>({});
  const [progress] = useState({ current: 3, total: 10 });
  const [earnedXp, setEarnedXp] = useState(0);

  const handleWordClick = (wordId: string) => {
    if (!isChecking) {
      setSelectedWord(wordId);
    }
  };

  const handleHarakaClick = (haraka: string) => {
    if (!isChecking && selectedWord) {
      setWords(words.map(w => 
        w.id === selectedWord ? { ...w, matched: haraka } : w
      ));
      setSelectedWord(null);
    }
  };

  const handleCheckAnswers = () => {
    setIsChecking(true);
    const newResults: { [key: string]: boolean } = {};
    let correctCount = 0;
    
    words.forEach(word => {
      if (word.matched) {
        const isCorrect = word.matched === word.correctHaraka;
        newResults[word.id] = isCorrect;
        if (isCorrect) correctCount++;
      }
    });
    
    setResults(newResults);
    if (correctCount === words.length) {
      setEarnedXp(40);
    }
  };

  const handleNextSet = () => {
    setWords([
      { id: "4", text: "ذَهَبَ", correctHaraka: "َ" },
      { id: "5", text: "جَلَسَ", correctHaraka: "َ" },
      { id: "6", text: "فَهِمَ", correctHaraka: "ِ" },
    ]);
    setResults({});
    setIsChecking(false);
    setSelectedWord(null);
    setEarnedXp(0);
  };

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
                <div className="size-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(to bottom right, #FFE4A3, #FFD666)' }}>
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h1 className="font-serif mb-1">Haraka Matching</h1>
                  <p className="text-muted-foreground">Match the correct diacritical marks to words</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LevelBadge level="Beginner" />
                {earnedXp > 0 && <GamificationBadge type="xp" value={earnedXp} />}
              </div>
            </div>
            <ProgressBar 
              progress={progress.current} 
              total={progress.total}
            />
          </div>

          <div className="grid lg:grid-cols-[1fr_300px] gap-6">
            {/* Main Matching Area */}
            <div>
              <div className="mb-4">
                <p className="text-muted-foreground">Arrange the words to form a correct sentence:</p>
                <p className="mt-1" style={{ color: '#5A4A2F' }}>"Match each word with its correct haraka to build grammar fluency."</p>
              </div>

              {/* Drop Zone */}
              <div className="min-h-[120px] border-2 border-dashed rounded-xl p-6 mb-6 flex items-center justify-center" style={{ borderColor: '#D4A574', backgroundColor: '#FFFCF5' }}>
                <p className="text-muted-foreground text-center">
                  {selectedWord ? "Now select a haraka to match" : "Select a word below to start"}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-muted-foreground mb-3">Available words:</p>
                <div className="flex flex-wrap gap-3">
                  {words.map((word) => (
                    <button
                      key={word.id}
                      onClick={() => handleWordClick(word.id)}
                      disabled={isChecking}
                      className={`px-6 py-3 rounded-xl border-2 transition-all text-right min-w-[120px] ${isChecking ? 'cursor-default' : 'hover:shadow-sm'}`}
                      style={{
                        borderColor: isChecking && results[word.id] !== undefined
                          ? results[word.id] ? '#0F7B5E' : '#C41E3A'
                          : selectedWord === word.id ? '#6B8F3D' : '#D4A574',
                        backgroundColor: isChecking && results[word.id] !== undefined
                          ? results[word.id] ? '#D4F1E8' : '#FFE4E8'
                          : selectedWord === word.id ? '#F0F7E8' : '#FFF9E6'
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          {isChecking && results[word.id] !== undefined && (
                            results[word.id] ? (
                              <Check className="size-5" style={{ color: '#0F7B5E' }} />
                            ) : (
                              <X className="size-5" style={{ color: '#C41E3A' }} />
                            )
                          )}
                        </div>
                        <div>
                          <div className="text-xl">{word.text}</div>
                          {word.matched && (
                            <span className="text-muted-foreground">+ {word.matched}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-muted-foreground mb-3">Harakat options:</p>
                <div className="flex flex-wrap gap-3">
                  {harakatOptions.map((haraka) => (
                    <button
                      key={haraka.id}
                      onClick={() => handleHarakaClick(haraka.symbol)}
                      disabled={!selectedWord || isChecking}
                      className={`px-6 py-3 rounded-xl border-2 transition-all min-w-[120px] ${!selectedWord || isChecking ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-sm'}`}
                      style={{ 
                        borderColor: '#D4A574', 
                        backgroundColor: '#FFF9E6',
                        ...(!selectedWord || isChecking ? {} : { '--hover-border-color': '#6B8F3D' } as React.CSSProperties)
                      }}
                      onMouseEnter={(e) => {
                        if (!selectedWord && !isChecking) {
                          e.currentTarget.style.borderColor = '#6B8F3D';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selectedWord && !isChecking) {
                          e.currentTarget.style.borderColor = '#D4A574';
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{haraka.name}</span>
                        <span className="text-2xl">{haraka.symbol}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  className="flex-1 hover:bg-accent"
                  style={{ borderColor: '#D4A574' }}
                  onClick={handleNextSet}
                  disabled={!isChecking}
                >
                  Clear
                </Button>
                <Button 
                  onClick={handleCheckAnswers}
                  disabled={words.some(w => !w.matched) || isChecking}
                  className="flex-1 text-white"
                  style={{ backgroundColor: '#6B8F3D' }}
                  onMouseEnter={(e) => {
                    if (!words.some(w => !w.matched) && !isChecking) {
                      e.currentTarget.style.backgroundColor = '#5A7732';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!words.some(w => !w.matched) && !isChecking) {
                      e.currentTarget.style.backgroundColor = '#6B8F3D';
                    }
                  }}
                >
                  Check Answer
                </Button>
              </div>
            </div>

            {/* Hint Sidebar */}
            <div className="space-y-4">
              <HintCard 
                title="Rules Hint"
                content="الفتحة (َ) تُنطق 'a'، الكسرة (ِ) تُنطق 'i'، والضمة (ُ) تُنطق 'u'. استمع للصوت وحاول التمييز بين الحركات."
              />
            </div>
          </div>
        </Card>
        </div>
      </main>
    </div>
  );
}
