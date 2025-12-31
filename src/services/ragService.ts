/**
 * RAG Service - Connects to the RAG backend API for AI-generated content
 * 
 * This service provides:
 * - Practice Exercises
 * - Adaptive Examples
 * - Personalized Explanations
 * - Review Questions
 */

const RAG_API_URL = import.meta.env.VITE_RAG_API_URL || 'http://localhost:8001';

export interface PracticeExercise {
  id: string;
  type: 'fill-blank' | 'multiple-choice' | 'sentence-analysis' | 'translation';
  question: string;
  instruction: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface AdaptiveExample {
  arabic: string;
  transliteration: string;
  translation: string;
  analysis: string;
  context?: string; // User's interest/context
}

export interface PersonalizedExplanation {
  explanation: string;
  depth: 'basic' | 'intermediate' | 'advanced';
  examples: AdaptiveExample[];
  commonMistakes?: string[];
}

export interface ReviewQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  lessonTopic: string;
}

class RAGService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = RAG_API_URL;
  }

  /**
   * Check if RAG API is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) return false;
      const data = await response.json();
      // Return true if healthy or initializing (server is up, just loading models)
      return data.status === 'healthy' || data.status === 'initializing';
    } catch (error) {
      console.warn('RAG API not available:', error);
      return false;
    }
  }

  /**
   * Query RAG system with a question
   */
  private async queryRAG(question: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          return_context: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`RAG API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.answer || '';
    } catch (error) {
      console.error('Error querying RAG:', error);
      throw error;
    }
  }

  /**
   * Generate practice exercises based on lesson topic, proficiency level, and common mistakes
   */
  async generatePracticeExercises(
    lessonTopic: string,
    proficiencyLevel: 'beginner' | 'intermediate' | 'advanced',
    commonMistakes?: string[],
    count: number = 3
  ): Promise<PracticeExercise[]> {
    const mistakesContext = commonMistakes && commonMistakes.length > 0
      ? ` Common mistakes to address: ${commonMistakes.join(', ')}.`
      : '';

    const prompt = `أنشئ ${count} تمارين عملية لدرس "${lessonTopic}" للمستوى ${proficiencyLevel}.${mistakesContext}

التمارين يجب أن تكون:
- مناسبة للمستوى ${proficiencyLevel}
- متنوعة (ملء الفراغ، اختيار من متعدد، تحليل جملة)
- مع أمثلة واضحة
- مع الإجابات الصحيحة والشرح

أرجع النتيجة بصيغة JSON مع الحقول التالية لكل تمرين:
- type: نوع التمرين
- question: السؤال
- instruction: التعليمات
- options: الخيارات (إن وجدت)
- correctAnswer: الإجابة الصحيحة
- explanation: الشرح`;

    try {
      const answer = await this.queryRAG(prompt);
      // Parse the JSON response from RAG
      // Note: RAG might return markdown, so we need to extract JSON
      const jsonMatch = answer.match(/```json\s*([\s\S]*?)\s*```/) || answer.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const exercises = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        return exercises.map((ex: any, idx: number) => ({
          id: `ex_${Date.now()}_${idx}`,
          type: ex.type || 'fill-blank',
          question: ex.question || '',
          instruction: ex.instruction || '',
          options: ex.options || [],
          correctAnswer: ex.correctAnswer || ex.correct_answer || '',
          explanation: ex.explanation || '',
          difficulty: proficiencyLevel,
        }));
      }

      // Fallback: create a simple exercise from the answer
      return [{
        id: `ex_${Date.now()}`,
        type: 'fill-blank' as const,
        question: `تمرين في ${lessonTopic}`,
        instruction: answer.substring(0, 200),
        correctAnswer: '',
        explanation: answer,
        difficulty: proficiencyLevel,
      }];
    } catch (error) {
      console.error('Error generating practice exercises:', error);
      // Return empty array on error
      return [];
    }
  }

  /**
   * Generate adaptive examples relevant to user's interests/context
   */
  async generateAdaptiveExamples(
    lessonTopic: string,
    userInterests?: string[],
    context?: string,
    count: number = 2
  ): Promise<AdaptiveExample[]> {
    const interestsContext = userInterests && userInterests.length > 0
      ? ` اهتمامات المستخدم: ${userInterests.join(', ')}.`
      : '';
    const contextText = context ? ` السياق: ${context}.` : '';

    const prompt = `أنشئ ${count} أمثلة توضيحية لدرس "${lessonTopic}"${interestsContext}${contextText}

كل مثال يجب أن يحتوي على:
- النص العربي
- النطق (transliteration)
- الترجمة الإنجليزية
- التحليل النحوي

أرجع النتيجة بصيغة JSON مع مصفوفة من الأمثلة.`;

    try {
      const answer = await this.queryRAG(prompt);
      const jsonMatch = answer.match(/```json\s*([\s\S]*?)\s*```/) || answer.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const examples = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        return examples.map((ex: any) => ({
          arabic: ex.arabic || '',
          transliteration: ex.transliteration || '',
          translation: ex.translation || '',
          analysis: ex.analysis || '',
          context: context || undefined,
        }));
      }

      // Fallback: parse from text
      return [{
        arabic: lessonTopic,
        transliteration: '',
        translation: '',
        analysis: answer.substring(0, 300),
        context: context || undefined,
      }];
    } catch (error) {
      console.error('Error generating adaptive examples:', error);
      return [];
    }
  }

  /**
   * Generate personalized explanation based on user understanding level
   */
  async generatePersonalizedExplanation(
    lessonTopic: string,
    userUnderstanding: 'basic' | 'intermediate' | 'advanced',
    userLevel: 'beginner' | 'intermediate' | 'advanced',
    weakAreas?: string[]
  ): Promise<PersonalizedExplanation> {
    const weakAreasContext = weakAreas && weakAreas.length > 0
      ? ` المناطق الضعيفة للمستخدم: ${weakAreas.join(', ')}.`
      : '';

    const prompt = `اشرح "${lessonTopic}" بطريقة مناسبة للمستوى ${userLevel} وفهم ${userUnderstanding}.${weakAreasContext}

الشرح يجب أن يكون:
- واضحاً ومفصلاً حسب مستوى الفهم
- مع أمثلة توضيحية
- مع ذكر الأخطاء الشائعة إن وجدت

أرجع النتيجة بصيغة JSON مع الحقول:
- explanation: الشرح
- depth: مستوى العمق
- examples: مصفوفة من الأمثلة
- commonMistakes: الأخطاء الشائعة`;

    try {
      const answer = await this.queryRAG(prompt);
      const jsonMatch = answer.match(/```json\s*([\s\S]*?)\s*```/) || answer.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        return {
          explanation: data.explanation || answer,
          depth: data.depth || userUnderstanding,
          examples: data.examples || [],
          commonMistakes: data.commonMistakes || data.common_mistakes || [],
        };
      }

      return {
        explanation: answer,
        depth: userUnderstanding,
        examples: [],
        commonMistakes: [],
      };
    } catch (error) {
      console.error('Error generating personalized explanation:', error);
      return {
        explanation: `شرح ${lessonTopic}`,
        depth: userUnderstanding,
        examples: [],
        commonMistakes: [],
      };
    }
  }

  /**
   * Generate review questions for completed lessons
   */
  async generateReviewQuestions(
    lessonTopic: string,
    lessonId: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced',
    count: number = 5
  ): Promise<ReviewQuestion[]> {
    const prompt = `أنشئ ${count} أسئلة مراجعة لدرس "${lessonTopic}" للمستوى ${userLevel}.

الأسئلة يجب أن تكون:
- متنوعة (اختيار من متعدد، صح/خطأ، إجابة قصيرة)
- تغطي محتوى الدرس
- مع الإجابات الصحيحة والشرح

أرجع النتيجة بصيغة JSON مع مصفوفة من الأسئلة.`;

    try {
      const answer = await this.queryRAG(prompt);
      const jsonMatch = answer.match(/```json\s*([\s\S]*?)\s*```/) || answer.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        return questions.map((q: any, idx: number) => ({
          id: `review_${lessonId}_${Date.now()}_${idx}`,
          question: q.question || '',
          type: (q.type || 'multiple-choice') as 'multiple-choice' | 'true-false' | 'short-answer',
          options: q.options || [],
          correctAnswer: q.correctAnswer || q.correct_answer || '',
          explanation: q.explanation || '',
          lessonTopic,
        }));
      }

      return [];
    } catch (error) {
      console.error('Error generating review questions:', error);
      return [];
    }
  }
}

// Export singleton instance
export const ragService = new RAGService();

