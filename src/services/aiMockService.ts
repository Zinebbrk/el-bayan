/**
 * Mock AI Service for El-Bayan Arabic Grammar Learning Platform
 * 
 * This service simulates AI-powered features with realistic Arabic grammar content.
 * 
 * TODO: Replace with real AI service when ready
 * - OpenAI GPT-4 for advanced grammar explanations
 * - Custom fine-tuned model for Arabic grammar
 * - To swap: Set environment variable AI_ENABLED=true and implement RealAIService
 */

export interface Question {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'true-false' | 'matching' | 'irab-analysis';
  question: string;
  options?: string[];
  correct: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

export interface Exercise {
  id: string;
  type: 'translation' | 'conjugation' | 'sentence-construction' | 'error-correction';
  instruction: string;
  content: string;
  answer: string;
  hints?: string[];
}

export interface GameContent {
  type: string;
  title: string;
  instructions: string;
  data: any;
  timeLimit?: number;
  difficulty: string;
}

export class MockAIService {
  private questionBank = {
    'Basic Concepts': [
      {
        id: 'q1',
        type: 'multiple-choice' as const,
        question: 'What are the three types of words in Arabic grammar?',
        options: ['Noun, Verb, Adjective', 'Noun, Verb, Particle', 'Subject, Verb, Object', 'Past, Present, Future'],
        correct: 'Noun, Verb, Particle',
        explanation: 'Arabic words are classified into: اسم (Noun), فعل (Verb), and حرف (Particle).',
        difficulty: 'easy' as const,
        topic: 'Basic Concepts'
      },
      {
        id: 'q2',
        type: 'multiple-choice' as const,
        question: 'Which of the following is a حرف (particle)?',
        options: ['كتاب', 'في', 'يكتب', 'طالب'],
        correct: 'في',
        explanation: 'في (in/at) is a preposition particle. The others are: كتاب (book - noun), يكتب (writes - verb), طالب (student - noun).',
        difficulty: 'easy' as const,
        topic: 'Basic Concepts'
      }
    ],
    'Vowel Marks': [
      {
        id: 'q3',
        type: 'multiple-choice' as const,
        question: 'What sound does the فتحة (fatha) make?',
        options: ['u sound', 'a sound', 'i sound', 'o sound'],
        correct: 'a sound',
        explanation: 'The فتحة (fatha) mark ــَـ produces a short "a" sound, like in "cat".',
        difficulty: 'easy' as const,
        topic: 'Vowel Marks'
      },
      {
        id: 'q4',
        type: 'fill-blank' as const,
        question: 'The mark that doubles a consonant is called _____.',
        correct: 'shadda',
        explanation: 'The شدة (shadda) mark ـّـ indicates that a consonant is doubled.',
        difficulty: 'easy' as const,
        topic: 'Vowel Marks'
      }
    ],
    'Iʿrāb': [
      {
        id: 'q5',
        type: 'multiple-choice' as const,
        question: 'What is the correct harakah for the فاعل (subject) in this sentence?\nالطالب_ يدرس الدرس',
        options: ['َ (fatha)', 'ُ (dammah)', 'ِ (kasra)', 'ْ (sukun)'],
        correct: 'ُ (dammah)',
        explanation: 'The فاعل (subject) is in the nominative case (مرفوع), marked with dammah (ُ).',
        difficulty: 'medium' as const,
        topic: 'Iʿrāb'
      },
      {
        id: 'q6',
        type: 'multiple-choice' as const,
        question: 'In the sentence "رأيتُ الطالبَ", what is the case of الطالبَ?',
        options: ['Nominative (مرفوع)', 'Accusative (منصوب)', 'Genitive (مجرور)', 'None'],
        correct: 'Accusative (منصوب)',
        explanation: 'الطالبَ is the direct object (مفعول به), which takes the accusative case marked with fatha.',
        difficulty: 'medium' as const,
        topic: 'Iʿrāb'
      }
    ],
    'Verbal Sentences': [
      {
        id: 'q7',
        type: 'multiple-choice' as const,
        question: 'What is the word order in a الجملة الفعلية (verbal sentence)?',
        options: ['Subject-Verb-Object', 'Verb-Subject-Object', 'Object-Verb-Subject', 'Verb-Object-Subject'],
        correct: 'Verb-Subject-Object',
        explanation: 'Arabic verbal sentences follow VSO order: فعل (verb) - فاعل (subject) - مفعول به (object).',
        difficulty: 'medium' as const,
        topic: 'Verbal Sentences'
      }
    ],
    'Past Tense': [
      {
        id: 'q8',
        type: 'multiple-choice' as const,
        question: 'How do you conjugate كتب (to write) for "she" in past tense?',
        options: ['كتب', 'كتبت', 'كتبا', 'كتبوا'],
        correct: 'كتبت',
        explanation: 'For feminine singular in past tense, add ت: كتبت (katabat) - she wrote.',
        difficulty: 'medium' as const,
        topic: 'Past Tense'
      }
    ]
  };

  /**
   * Generate assessment questions based on topic and difficulty
   */
  generateQuestions(
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    count: number,
    userLevel?: string,
    weakAreas?: string[]
  ): Question[] {
    // Map difficulty to question difficulty
    const questionDifficulty = difficulty === 'beginner' ? 'easy' : difficulty === 'intermediate' ? 'medium' : 'hard';
    
    // Get questions from bank
    let questions: Question[] = [];
    
    // Prioritize weak areas if provided
    if (weakAreas && weakAreas.length > 0) {
      weakAreas.forEach(area => {
        if (this.questionBank[area as keyof typeof this.questionBank]) {
          questions.push(...this.questionBank[area as keyof typeof this.questionBank]);
        }
      });
    }
    
    // Add questions from topic
    if (this.questionBank[topic as keyof typeof this.questionBank]) {
      questions.push(...this.questionBank[topic as keyof typeof this.questionBank]);
    }
    
    // If still not enough, add from all topics
    if (questions.length < count) {
      Object.values(this.questionBank).forEach(topicQuestions => {
        questions.push(...topicQuestions);
      });
    }
    
    // Filter by difficulty and shuffle
    questions = questions.filter(q => q.difficulty === questionDifficulty);
    questions = this.shuffle(questions);
    
    // Return requested count
    return questions.slice(0, count);
  }

  /**
   * Generate chatbot response
   */
  async chat(message: string, context?: Array<{ role: string; content: string }>): Promise<string> {
    const lowerMessage = message.toLowerCase();
    
    // Grammar rule inquiries
    if (lowerMessage.includes('فاعل') || lowerMessage.includes('subject')) {
      return 'الفاعل (al-fāʿil) is the doer of the action in a sentence. It always takes the nominative case (مرفوع) and is marked with dammah (ُ) or its variants. For example, in "كتبَ الطالبُ الدرسَ", الطالبُ is the فاعل.\n\nWould you like me to explain more about subjects in different sentence types?';
    }
    
    if (lowerMessage.includes('مفعول') || lowerMessage.includes('object')) {
      return 'المفعول به (al-mafʿūl bihi) is the direct object that receives the action. It takes the accusative case (منصوب) marked with fatha (َ). Example: "قرأَ أحمدُ الكتابَ" - الكتابَ is the object.\n\nShall I provide more examples?';
    }
    
    if (lowerMessage.includes('إعراب') || lowerMessage.includes('irab') || lowerMessage.includes('case')) {
      return 'الإعراب (iʿrāb) refers to the grammatical case system in Arabic. There are three main cases:\n\n1. مرفوع (Nominative) - marked with dammah ُ\n2. منصوب (Accusative) - marked with fatha َ\n3. مجرور (Genitive) - marked with kasra ِ\n\nEach case is used in specific grammatical contexts. Which case would you like to learn about?';
    }
    
    if (lowerMessage.includes('haraka') || lowerMessage.includes('vowel') || lowerMessage.includes('تشكيل')) {
      return 'الحركات (harakāt) are the vowel marks in Arabic:\n\n• فتحة (fatha) َ - "a" sound\n• ضمة (damma) ُ - "u" sound\n• كسرة (kasra) ِ - "i" sound\n• سكون (sukūn) ْ - no vowel\n\nThese marks are essential for proper pronunciation and understanding grammatical cases.';
    }
    
    if (lowerMessage.includes('verb') || lowerMessage.includes('فعل')) {
      return 'Arabic verbs (الأفعال) have three tenses:\n\n1. الماضي (Past) - e.g., كتبَ (he wrote)\n2. المضارع (Present/Future) - e.g., يكتبُ (he writes)\n3. الأمر (Command) - e.g., اُكتب (write!)\n\nVerbs conjugate based on person, number, and gender. Which tense would you like to practice?';
    }
    
    if (lowerMessage.includes('sentence') || lowerMessage.includes('جملة')) {
      return 'Arabic has two main sentence types:\n\n1. الجملة الاسمية (Nominal) - starts with a noun\n   Example: الطالبُ مجتهدٌ (The student is diligent)\n\n2. الجملة الفعلية (Verbal) - starts with a verb\n   Example: كتبَ الطالبُ الدرسَ (The student wrote the lesson)\n\nWhich type would you like to practice?';
    }
    
    // Default helpful response
    return `I'm here to help you learn Arabic grammar! I can assist you with:\n\n• Grammar rules and concepts (إعراب, فاعل, مفعول)\n• Sentence analysis and construction\n• Verb conjugation\n• Vowel marks and pronunciation\n• Common mistakes and corrections\n\nWhat would you like to learn about?`;
  }

  /**
   * Correct an Arabic sentence
   */
  correctSentence(sentence: string): {
    isCorrect: boolean;
    corrections: Array<{ original: string; corrected: string; explanation: string }>;
    explanation: string;
  } {
    // Example corrections based on common mistakes
    const corrections: Array<{ original: string; corrected: string; explanation: string }> = [];
    
    if (sentence.includes('الطالب يذهب')) {
      corrections.push({
        original: 'الطالب',
        corrected: 'الطالبُ',
        explanation: 'المبتدأ (subject) should be in nominative case with dammah'
      });
    }
    
    return {
      isCorrect: corrections.length === 0,
      corrections,
      explanation: corrections.length === 0 
        ? 'The sentence appears grammatically correct!' 
        : 'I found some grammatical issues that need correction.'
    };
  }

  /**
   * Analyze إعراب (grammatical case) of a sentence
   */
  analyzeIrab(sentence: string): {
    words: Array<{
      word: string;
      function: string;
      case: string;
      explanation: string;
    }>;
  } {
    // Example analysis
    if (sentence.includes('كتب') && sentence.includes('الطالب')) {
      return {
        words: [
          {
            word: 'كتبَ',
            function: 'فعل ماضٍ',
            case: 'مبني على الفتح',
            explanation: 'Past tense verb, built on fatha'
          },
          {
            word: 'الطالبُ',
            function: 'فاعل',
            case: 'مرفوع وعلامة رفعه الضمة',
            explanation: 'Subject (doer), nominative case with dammah'
          },
          {
            word: 'الدرسَ',
            function: 'مفعول به',
            case: 'منصوب وعلامة نصبه الفتحة',
            explanation: 'Direct object, accusative case with fatha'
          }
        ]
      };
    }
    
    return {
      words: [{
        word: sentence,
        function: 'تحليل عام',
        case: 'يحتاج إلى مراجعة',
        explanation: 'Please provide a complete sentence for detailed analysis'
      }]
    };
  }

  /**
   * Generate exercises for a lesson
   */
  generateExercises(
    lessonId: string,
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    count: number
  ): Exercise[] {
    const exercises: Exercise[] = [
      {
        id: 'ex1',
        type: 'conjugation',
        instruction: 'Conjugate the verb كتب (to write) in past tense for "I"',
        content: 'أنا _____ الرسالة',
        answer: 'كتبتُ',
        hints: ['Add تُ to the root كتب', 'The answer is كتبتُ']
      },
      {
        id: 'ex2',
        type: 'fill-blank',
        instruction: 'Add the correct harakah to make الطالب the subject',
        content: 'الطالب_ يدرس',
        answer: 'الطالبُ',
        hints: ['Subject takes nominative case', 'Use dammah (ُ)']
      },
      {
        id: 'ex3',
        type: 'sentence-construction',
        instruction: 'Construct a nominal sentence using: الكتاب - جديد',
        content: 'الكتاب / جديد',
        answer: 'الكتابُ جديدٌ',
        hints: ['Nominal sentence: subject + predicate', 'Both words are nominative']
      },
      {
        id: 'ex4',
        type: 'error-correction',
        instruction: 'Correct the grammatical error in this sentence',
        content: 'رأيتُ الطالبُ في المدرسة',
        answer: 'رأيتُ الطالبَ في المدرسة',
        hints: ['Check the case of الطالب', 'Object should be accusative (منصوب)']
      }
    ];
    
    return exercises.slice(0, count);
  }

  /**
   * Generate game content
   */
  generateGameContent(
    gameType: 'word_builder' | 'sentence_unscrambler' | 'grammar_quiz' | 'daily_challenge',
    difficulty: 'easy' | 'medium' | 'hard',
    level: string
  ): GameContent {
    switch (gameType) {
      case 'word_builder':
        return {
          type: 'word_builder',
          title: 'Arabic Word Builder',
          instructions: 'Build words from the root letters',
          difficulty,
          data: {
            root: 'ك-ت-ب',
            targetWords: ['كتاب', 'كاتب', 'مكتوب', 'مكتبة'],
            timeLimit: 60
          }
        };
      
      case 'sentence_unscrambler':
        return {
          type: 'sentence_unscrambler',
          title: 'Unscramble the Sentence',
          instructions: 'Put the words in correct order',
          difficulty,
          data: {
            scrambled: ['الدرسَ', 'الطالبُ', 'كتبَ'],
            correct: ['كتبَ', 'الطالبُ', 'الدرسَ'],
            translation: 'The student wrote the lesson'
          },
          timeLimit: 30
        };
      
      case 'grammar_quiz':
        return {
          type: 'grammar_quiz',
          title: 'Quick Grammar Quiz',
          instructions: 'Answer as many questions correctly as you can',
          difficulty,
          data: {
            questions: this.generateQuestions('Basic Concepts', 'beginner', 5)
          },
          timeLimit: 120
        };
      
      case 'daily_challenge':
        return {
          type: 'daily_challenge',
          title: 'Daily Grammar Challenge',
          instructions: 'Complete today\'s special challenge',
          difficulty,
          data: {
            challenge: 'Find and correct all grammatical errors',
            sentence: 'الطالب يدرس الدرس في المكتبة',
            errors: [],
            points: 100
          },
          timeLimit: 180
        };
      
      default:
        return {
          type: 'grammar_quiz',
          title: 'Grammar Challenge',
          instructions: 'Test your knowledge',
          difficulty,
          data: {}
        };
    }
  }

  /**
   * Generate daily tip
   */
  generateDailyTip(userContext?: { level?: string; weakAreas?: string[] }): {
    arabic: string;
    title: string;
    explanation: string;
    example: string;
  } {
    const tips = [
      {
        arabic: 'الفعل المضارع المرفوع',
        title: 'Present Tense in Nominative',
        explanation: 'The present tense verb (الفعل المضارع) is in the nominative case (مرفوع) when it is not preceded by a particle that causes it to be in the accusative or jussive case.',
        example: '💡 Tip: Look for the dammah (ُ) on the last letter!'
      },
      {
        arabic: 'التنوين علامة على التنكير',
        title: 'Tanwīn Indicates Indefiniteness',
        explanation: 'The double vowel marks (tanwīn: ًٌٍ) indicate that a noun is indefinite, like "a book" instead of "the book".',
        example: '💡 Example: كتابٌ (a book) vs الكتاب (the book)'
      },
      {
        arabic: 'الفاعل مرفوع دائماً',
        title: 'The Subject is Always Nominative',
        explanation: 'In Arabic, the فاعل (subject/doer) is always in the nominative case (مرفوع), regardless of sentence type.',
        example: '💡 Remember: Subject = Dammah (ُ)'
      }
    ];
    
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  }

  /**
   * Recommend lessons based on user progress
   */
  recommendLessons(
    userId: string,
    userProgress: Array<{ lesson_id: string; progress_percentage: number }>,
    userLevel: string
  ): Array<{ lessonId: string; reason: string; priority: number }> {
    return [
      {
        lessonId: 'l6',
        reason: 'Master noun cases to advance to intermediate level',
        priority: 1
      },
      {
        lessonId: 'l3',
        reason: 'Build strong foundation in nominal sentences',
        priority: 2
      },
      {
        lessonId: 'l4',
        reason: 'Complete your understanding of sentence types',
        priority: 3
      }
    ];
  }

  /**
   * Utility: Shuffle array
   */
  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Export singleton instance
export const aiService = new MockAIService();
