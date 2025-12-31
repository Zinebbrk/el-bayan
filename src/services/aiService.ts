// Mock AI Service for El-Bayan Arabic Grammar Learning Platform
// TODO: Replace with real AI service when ready (OpenAI, Anthropic, etc.)

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'sentence-analysis';
  question: string;
  options?: string[];
  correct: string | string[];
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface Exercise {
  id: string;
  type: string;
  instruction: string;
  content: any;
  answer?: string;
}

export interface GameChallenge {
  id: string;
  type: string;
  title: string;
  description: string;
  content: any;
  timeLimit?: number;
  points: number;
}

class MockAIService {
  // Generate assessment questions based on topic and difficulty
  generateQuestions(
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    userLevel?: string,
    weakAreas?: string[]
  ): Question[] {
    const questions: Question[] = [];
    
    const questionBank = this.getQuestionBank(topic, difficulty);
    
    // Select random questions from the bank
    for (let i = 0; i < Math.min(count, questionBank.length); i++) {
      questions.push({
        ...questionBank[i],
        id: `q_${Date.now()}_${i}`,
      });
    }
    
    return questions;
  }

  // Chat with the AI tutor
  chat(message: string, context?: ChatMessage[]): string {
    const lowerMessage = message.toLowerCase();
    
    // Pattern matching for common grammar questions
    if (lowerMessage.includes('حرف') || lowerMessage.includes('harakah') || lowerMessage.includes('vowel')) {
      return `Great question about harakāt! The Arabic vowel marks are:\n\n` +
        `• َ (fatha) - produces an "a" sound\n` +
        `• ُ (dammah) - produces an "u" sound\n` +
        `• ِ (kasra) - produces an "i" sound\n` +
        `• ْ (sukun) - indicates no vowel\n\n` +
        `For example: كَتَبَ (kataba - he wrote) vs كُتُب (kutub - books)\n\n` +
        `Would you like to practice identifying harakāt in sentences?`;
    }
    
    if (lowerMessage.includes('فاعل') || lowerMessage.includes('subject')) {
      return `The subject (الفاعل) in Arabic grammar:\n\n` +
        `• Always comes after the verb in a verbal sentence (الجملة الفعلية)\n` +
        `• Always takes the nominative case (مرفوع)\n` +
        `• Marked with dammah (ُ) for singular nouns\n\n` +
        `Example: كتبَ الطالبُ الدرسَ\n` +
        `(The student wrote the lesson)\n\n` +
        `Here, الطالبُ is the subject with dammah.\n\n` +
        `Do you want to see more examples?`;
    }
    
    if (lowerMessage.includes('مفعول') || lowerMessage.includes('object')) {
      return `The object (المفعول به) in Arabic:\n\n` +
        `• Receives the action of the verb\n` +
        `• Always takes the accusative case (منصوب)\n` +
        `• Marked with fatha (َ) for singular nouns\n\n` +
        `Example: قرأَ الطالبُ الكتابَ\n` +
        `(The student read the book)\n\n` +
        `الكتابَ is the object with fatha.\n\n` +
        `Would you like practice exercises?`;
    }
    
    if (lowerMessage.includes('إعراب') || lowerMessage.includes('irab') || lowerMessage.includes('case')) {
      return `Iʿrāb (الإعراب) - Grammatical Case:\n\n` +
        `Arabic has three main cases:\n\n` +
        `1. Nominative (مرفوع) - marked with dammah ُ\n` +
        `   Used for: subjects, predicates\n\n` +
        `2. Accusative (منصوب) - marked with fatha َ\n` +
        `   Used for: objects, circumstances\n\n` +
        `3. Genitive (مجرور) - marked with kasra ِ\n` +
        `   Used for: nouns after prepositions, second part of إضافة\n\n` +
        `Example sentence analysis:\n` +
        `ذهبَ الطالبُ إلى المدرسةِ\n` +
        `• ذهبَ - verb (past tense)\n` +
        `• الطالبُ - subject (nominative)\n` +
        `• إلى - preposition\n` +
        `• المدرسةِ - object of preposition (genitive)\n\n` +
        `Shall we practice with more sentences?`;
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('مساعدة')) {
      return `I'm here to help you master Arabic grammar! I can assist with:\n\n` +
        `✓ Explaining grammar rules (Iʿrāb, harakāt, sentence structure)\n` +
        `✓ Analyzing Arabic sentences\n` +
        `✓ Correcting your grammar mistakes\n` +
        `✓ Providing examples and practice exercises\n` +
        `✓ Answering questions about specific topics\n\n` +
        `Try asking me about:\n` +
        `• "What is the subject (فاعل)?"\n` +
        `• "Explain harakāt"\n` +
        `• "How do I analyze this sentence: ___?"\n` +
        `• "What's the difference between nominal and verbal sentences?"\n\n` +
        `What would you like to learn today?`;
    }
    
    // Default response
    return `Thank you for your question! While I'm still learning, I can help you with:\n\n` +
      `• Arabic grammar rules and concepts\n` +
      `• Sentence analysis (إعراب)\n` +
      `• Harakāt and vowel marks\n` +
      `• Noun cases (الإعراب)\n` +
      `• Verb conjugation\n\n` +
      `Could you rephrase your question or ask about a specific grammar topic? ` +
      `For example, try asking "What is the subject?" or "Explain iʿrāb"`;
  }

  // Correct an Arabic sentence and provide feedback
  correctSentence(sentence: string): {
    original: string;
    corrected: string;
    errors: Array<{ type: string; description: string; correction: string }>;
    isCorrect: boolean;
  } {
    // Mock correction logic
    return {
      original: sentence,
      corrected: sentence, // Would be different if errors found
      errors: [],
      isCorrect: true,
    };
  }

  // Analyze Iʿrāb of a sentence
  analyzeIrab(sentence: string): {
    sentence: string;
    words: Array<{
      word: string;
      role: string;
      case: string;
      explanation: string;
    }>;
  } {
    // Mock analysis
    return {
      sentence,
      words: [
        {
          word: 'الطالبُ',
          role: 'فاعل (subject)',
          case: 'مرفوع (nominative)',
          explanation: 'Marked with dammah',
        },
      ],
    };
  }

  // Generate lesson exercises
  generateExercises(
    lessonId: string,
    topic: string,
    difficulty: string,
    count: number
  ): Exercise[] {
    const exercises: Exercise[] = [];
    
    for (let i = 0; i < count; i++) {
      exercises.push({
        id: `ex_${Date.now()}_${i}`,
        type: 'fill-blank',
        instruction: `Fill in the correct harakah for the word marked with _`,
        content: {
          sentence: 'الطالب_ يدرسُ الدرسَ',
          blank_position: 'subject',
        },
        answer: 'ُ',
      });
    }
    
    return exercises;
  }

  // Generate game content
  generateGameContent(
    gameType: string,
    difficulty: string,
    level: string
  ): GameChallenge {
    const challenges: Record<string, GameChallenge> = {
      'harakah-match': {
        id: `game_${Date.now()}`,
        type: 'harakah-match',
        title: 'Harakāt Matching',
        description: 'Match the correct harakāt to complete the words',
        content: {
          words: [
            { word: 'كتاب', needsHarakah: true, correct: 'ُ', position: 4 },
            { word: 'مدرسة', needsHarakah: true, correct: 'ِ', position: 5 },
          ],
          options: ['َ', 'ُ', 'ِ', 'ْ'],
        },
        timeLimit: 60,
        points: 100,
      },
      'sentence-builder': {
        id: `game_${Date.now()}`,
        type: 'sentence-builder',
        title: 'Sentence Constructor',
        description: 'Arrange words to form a grammatically correct sentence',
        content: {
          words: ['الطالبُ', 'الكتابَ', 'قرأَ'],
          correctOrder: ['قرأَ', 'الطالبُ', 'الكتابَ'],
          translation: 'The student read the book',
        },
        timeLimit: 90,
        points: 150,
      },
      'irab-quiz': {
        id: `game_${Date.now()}`,
        type: 'irab-quiz',
        title: 'Iʿrāb Challenge',
        description: 'Identify the correct grammatical case',
        content: {
          sentence: 'ذهبَ الطالبُ إلى المدرسةِ',
          questions: [
            { word: 'الطالبُ', correct: 'مرفوع' },
            { word: 'المدرسةِ', correct: 'مجرور' },
          ],
          options: ['مرفوع', 'منصوب', 'مجرور'],
        },
        timeLimit: 120,
        points: 200,
      },
    };
    
    return challenges[gameType] || challenges['harakah-match'];
  }

  // Generate daily tip
  generateDailyTip(userContext?: any): {
    arabicText: string;
    title: string;
    explanation: string;
    example?: string;
  } {
    const tips = [
      {
        arabicText: 'الفعل المضارع المرفوع',
        title: 'Present Tense Nominative',
        explanation: 'The present tense verb (الفعل المضارع) is in the nominative case (مرفوع) when it is not preceded by a particle that causes it to be in the accusative or jussive case.',
        example: 'يكتبُ الطالبُ - The student writes',
      },
      {
        arabicText: 'الفاعل دائماً مرفوع',
        title: 'Subject is Always Nominative',
        explanation: 'The subject (الفاعل) in Arabic always takes the nominative case, marked with dammah (ُ) for singular nouns.',
        example: 'قرأَ الطالبُ الكتابَ - The student read the book',
      },
      {
        arabicText: 'المفعول به منصوب',
        title: 'Object is Accusative',
        explanation: 'The direct object (المفعول به) always takes the accusative case, marked with fatha (َ) for singular nouns.',
        example: 'كتبَ الطالبُ الدرسَ - The student wrote the lesson',
      },
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  }

  // Recommend lessons based on user progress and weak areas
  recommendLessons(
    userId: string,
    userProgress: any,
    weakAreas?: string[]
  ): Array<{ lessonId: string; reason: string; priority: number }> {
    // Mock recommendations
    return [
      {
        lessonId: 'lesson_1',
        reason: 'Foundation for all grammar concepts',
        priority: 1,
      },
      {
        lessonId: 'lesson_2',
        reason: 'Builds on your current progress',
        priority: 2,
      },
    ];
  }

  // Private helper: Question bank
  private getQuestionBank(topic: string, difficulty: string): Question[] {
    const banks: Record<string, Question[]> = {
      'noun-cases': [
        {
          id: '1',
          type: 'multiple-choice',
          question: 'What is the correct harakah for the subject (فاعل) in this sentence?\nالطالب_ يدرس الدرس',
          options: ['َ (fatha)', 'ُ (dammah)', 'ِ (kasra)', 'ْ (sukun)'],
          correct: 'ُ (dammah)',
          explanation: 'The subject (فاعل) is in the nominative case, marked with dammah (ُ).',
          difficulty: 'easy',
        },
        {
          id: '2',
          type: 'multiple-choice',
          question: 'What case is the word المدرسةِ in: ذهبَ الطالبُ إلى المدرسةِ',
          options: ['Nominative (مرفوع)', 'Accusative (منصوب)', 'Genitive (مجرور)'],
          correct: 'Genitive (مجرور)',
          explanation: 'After a preposition (إلى), the noun takes the genitive case with kasra (ِ).',
          difficulty: 'medium',
        },
        {
          id: '3',
          type: 'multiple-choice',
          question: 'Identify the object (المفعول به) in: قرأَ الطالبُ الكتابَ',
          options: ['قرأَ', 'الطالبُ', 'الكتابَ'],
          correct: 'الكتابَ',
          explanation: 'The direct object receives the action of the verb and is in the accusative case.',
          difficulty: 'easy',
        },
      ],
      'verb-conjugation': [
        {
          id: '4',
          type: 'multiple-choice',
          question: 'What is the present tense form of كتب for "I write"?',
          options: ['يكتبُ', 'تكتبُ', 'أكتبُ', 'نكتبُ'],
          correct: 'أكتبُ',
          explanation: 'The first person singular present tense uses the prefix أَ.',
          difficulty: 'easy',
        },
        {
          id: '5',
          type: 'multiple-choice',
          question: 'Which form is correct for "they (masculine) wrote"?',
          options: ['كتبَ', 'كتبوا', 'كتبنا', 'كتبتم'],
          correct: 'كتبوا',
          explanation: 'Third person masculine plural past tense uses the suffix وا.',
          difficulty: 'medium',
        },
      ],
      'harakāt': [
        {
          id: '6',
          type: 'multiple-choice',
          question: 'Which harakah produces an "i" sound?',
          options: ['َ (fatha)', 'ُ (dammah)', 'ِ (kasra)', 'ْ (sukun)'],
          correct: 'ِ (kasra)',
          explanation: 'Kasra (ِ) produces the "i" sound, like in the word بِسْم (bism).',
          difficulty: 'easy',
        },
      ],
      'sentence-structure': [
        {
          id: '7',
          type: 'multiple-choice',
          question: 'What type of sentence is: الطالبُ مجتهدٌ?',
          options: ['Verbal sentence (جملة فعلية)', 'Nominal sentence (جملة اسمية)'],
          correct: 'Nominal sentence (جملة اسمية)',
          explanation: 'A nominal sentence begins with a noun (المبتدأ) followed by a predicate (الخبر).',
          difficulty: 'easy',
        },
        {
          id: '8',
          type: 'multiple-choice',
          question: 'In a verbal sentence, what comes first?',
          options: ['Subject (الفاعل)', 'Verb (الفعل)', 'Object (المفعول به)'],
          correct: 'Verb (الفعل)',
          explanation: 'Verbal sentences in Arabic typically follow the order: Verb - Subject - Object.',
          difficulty: 'easy',
        },
      ],
    };
    
    return banks[topic.toLowerCase()] || banks['noun-cases'];
  }
}

// Export singleton instance
export const aiService = new MockAIService();
