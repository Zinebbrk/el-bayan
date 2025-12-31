/**
 * Lesson AI Service - Generates AI content for lessons
 * Uses free APIs (Hugging Face Inference API) or can be configured with other providers
 */

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
  context?: string;
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

class LessonAIService {
  // Set to true to use Hugging Face API (requires API key in .env)
  // Set to false to use smart mock (works immediately, no API needed)
  private useHuggingFace = false;
  private huggingFaceApiUrl = 'https://api-inference.huggingface.co/models';
  private huggingFaceApiKey = (import.meta.env as any).VITE_HUGGINGFACE_API_KEY || '';
  private model = 'meta-llama/Meta-Llama-3-8B-Instruct'; // Free model

  /**
   * Generate practice exercises using AI
   */
  async generatePracticeExercises(
    lessonTopic: string,
    proficiencyLevel: 'beginner' | 'intermediate' | 'advanced',
    commonMistakes?: string[],
    count: number = 1
  ): Promise<PracticeExercise[]> {
    console.log('🔵 [AI Service] Generating practice exercises for:', lessonTopic, 'level:', proficiencyLevel, 'count:', count);
    
    if (this.useHuggingFace && this.huggingFaceApiKey) {
      try {
        const result = await this.generateWithHuggingFace('exercises', {
          topic: lessonTopic,
          level: proficiencyLevel,
          count,
          mistakes: commonMistakes,
        });
        console.log('✅ [AI Service] Hugging Face exercises:', result);
        return result;
      } catch (error) {
        console.warn('⚠️ [AI Service] Hugging Face failed, using mock:', error);
      }
    }
    
    // Use mock (synchronous, immediate)
    const exercises = this.generateMockExercises(lessonTopic, proficiencyLevel, count);
    console.log('✅ [AI Service] Generated mock exercises:', exercises.length, 'exercises');
    console.log('📝 [AI Service] Exercise details:', exercises);
    
    // Detailed output for terminal visibility
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📚 AI GENERATED PRACTICE EXERCISES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    exercises.forEach((exercise, index) => {
      console.log(`\n📝 Exercise ${index + 1}:`);
      console.log(`   Type: ${exercise.type}`);
      console.log(`   Question: ${exercise.question}`);
      console.log(`   Instruction: ${exercise.instruction}`);
      if (exercise.options) {
        console.log(`   Options: ${exercise.options.join(', ')}`);
      }
      console.log(`   Correct Answer: ${exercise.correctAnswer}`);
      console.log(`   Explanation: ${exercise.explanation}`);
      console.log(`   Difficulty: ${exercise.difficulty}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Return as Promise for consistency
    return Promise.resolve(exercises);
  }

  /**
   * Generate adaptive examples
   */
  async generateAdaptiveExamples(
    lessonTopic: string,
    userInterests?: string[],
    context?: string,
    count: number = 3
  ): Promise<AdaptiveExample[]> {
    console.log('🔵 [AI Service] Generating adaptive examples for:', lessonTopic, 'count:', count);
    
    if (this.useHuggingFace && this.huggingFaceApiKey) {
      try {
        const result = await this.generateWithHuggingFace('examples', {
          topic: lessonTopic,
          interests: userInterests,
          context,
          count,
        });
        if (result && Array.isArray(result) && result.length > 0) {
          return result;
        }
      } catch (error) {
        console.warn('⚠️ [AI Service] Hugging Face failed, using mock:', error);
      }
    }
    
    const examples = this.generateMockExamples(lessonTopic, count);
    console.log('✅ [AI Service] Generated mock examples:', examples.length, 'examples');
    
    // Detailed output for terminal visibility
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📖 AI GENERATED ADAPTIVE EXAMPLES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    examples.forEach((example, index) => {
      console.log(`\n📖 Example ${index + 1}:`);
      console.log(`   Arabic: ${example.arabic}`);
      console.log(`   Transliteration: ${example.transliteration}`);
      console.log(`   Translation: ${example.translation}`);
      console.log(`   Analysis: ${example.analysis}`);
      if (example.context) {
        console.log(`   Context: ${example.context}`);
      }
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return Promise.resolve(examples);
  }

  /**
   * Generate personalized explanation
   */
  async generatePersonalizedExplanation(
    lessonTopic: string,
    userUnderstanding: 'basic' | 'intermediate' | 'advanced',
    userLevel: 'beginner' | 'intermediate' | 'advanced',
    weakAreas?: string[]
  ): Promise<PersonalizedExplanation> {
    console.log('Generating personalized explanation for:', lessonTopic);
    
    if (this.useHuggingFace && this.huggingFaceApiKey) {
      try {
        return await this.generateWithHuggingFace('explanation', {
          topic: lessonTopic,
          understanding: userUnderstanding,
          level: userLevel,
          weakAreas,
        });
      } catch (error) {
        console.warn('Hugging Face failed, using mock:', error);
      }
    }
    
    const explanation = this.generateMockExplanation(lessonTopic, userUnderstanding);
    console.log('✅ [AI Service] Generated mock explanation');
    
    // Detailed output for terminal visibility
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 AI GENERATED PERSONALIZED EXPLANATION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📚 Topic: ${lessonTopic}`);
    console.log(`📊 Depth: ${explanation.depth}`);
    console.log(`\n📝 Explanation:\n${explanation.explanation}`);
    if (explanation.examples && explanation.examples.length > 0) {
      console.log(`\n📖 Examples (${explanation.examples.length}):`);
      explanation.examples.forEach((example, index) => {
        console.log(`\n   Example ${index + 1}:`);
        console.log(`   Arabic: ${example.arabic}`);
        console.log(`   Transliteration: ${example.transliteration}`);
        console.log(`   Translation: ${example.translation}`);
        console.log(`   Analysis: ${example.analysis}`);
      });
    }
    if (explanation.commonMistakes && explanation.commonMistakes.length > 0) {
      console.log(`\n⚠️ Common Mistakes:`);
      explanation.commonMistakes.forEach((mistake, index) => {
        console.log(`   ${index + 1}. ${mistake}`);
      });
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return Promise.resolve(explanation);
  }

  /**
   * Generate review questions
   */
  async generateReviewQuestions(
    lessonTopic: string,
    lessonId: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced',
    count: number = 5
  ): Promise<ReviewQuestion[]> {
    console.log('🔵 [AI Service] Generating review questions for:', lessonTopic);
    
    if (this.useHuggingFace && this.huggingFaceApiKey) {
      try {
        return await this.generateWithHuggingFace('review', {
          topic: lessonTopic,
          lesson_id: lessonId,
          level: userLevel,
          count,
        });
      } catch (error) {
        console.warn('⚠️ [AI Service] Hugging Face API failed, using mock:', error);
      }
    }
    
    const questions = this.generateMockReviewQuestions(lessonTopic, lessonId, count);
    console.log('✅ [AI Service] Generated mock review questions:', questions.length, 'questions');
    
    // Detailed output for terminal visibility
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('❓ AI GENERATED REVIEW QUESTIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    questions.forEach((question, index) => {
      console.log(`\n❓ Question ${index + 1}:`);
      console.log(`   Type: ${question.type}`);
      console.log(`   Question: ${question.question}`);
      if (question.options) {
        console.log(`   Options: ${question.options.join(', ')}`);
      }
      console.log(`   Correct Answer: ${question.correctAnswer}`);
      console.log(`   Explanation: ${question.explanation}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return Promise.resolve(questions);
  }

  /**
   * Generate content using Hugging Face API (free, but requires API key)
   */
  private async generateWithHuggingFace(
    type: 'exercises' | 'examples' | 'explanation' | 'review',
    params: any
  ): Promise<any> {
    if (!this.huggingFaceApiKey) {
      console.warn('Hugging Face API key not set, using mock');
      return this.generateMockContent(type, params);
    }

    try {
      const prompt = this.buildPrompt(type, params);
      
      const response = await fetch(`${this.huggingFaceApiUrl}/${this.model}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.huggingFaceApiKey}`,
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = Array.isArray(data) ? data[0]?.generated_text || '' : data.generated_text || '';
      
      return this.parseResponse(type, text, params);
    } catch (error) {
      console.warn('Hugging Face API failed, using mock:', error);
      // Fallback to mock
      return this.generateMockContent(type, params);
    }
  }

  /**
   * Build prompt for AI
   */
  private buildPrompt(type: string, params: any): string {
    const { topic, level, count, mistakes, interests, context, understanding, weakAreas } = params;
    
    switch (type) {
      case 'exercises':
        return `Create ${count} Arabic grammar practice exercises for topic "${topic}" at ${level} level. ${mistakes ? `Address these common mistakes: ${mistakes.join(', ')}.` : ''} Return as JSON array with fields: type, question, instruction, options (if multiple-choice), correctAnswer, explanation.`;
      
      case 'examples':
        return `Create ${count} Arabic grammar examples for topic "${topic}". ${interests ? `User interests: ${interests.join(', ')}.` : ''} ${context ? `Context: ${context}.` : ''} Return as JSON array with fields: arabic, transliteration, translation, analysis.`;
      
      case 'explanation':
        return `Explain Arabic grammar topic "${topic}" at ${understanding} level for ${level} students. ${weakAreas ? `Focus on weak areas: ${weakAreas.join(', ')}.` : ''} Return as JSON with fields: explanation, depth, examples (array), commonMistakes (array).`;
      
      case 'review':
        return `Create ${count} review questions for Arabic grammar topic "${topic}" at ${level} level. Return as JSON array with fields: question, type, options (if multiple-choice), correctAnswer, explanation.`;
      
      default:
        return `Generate content for Arabic grammar topic "${topic}"`;
    }
  }

  /**
   * Parse AI response
   */
  private parseResponse(type: string, text: string, params: any): any {
    try {
      // Try to extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Failed to parse AI response, using mock');
    }
    
    // Fallback to mock
    return this.generateMockContent(type, params);
  }

  /**
   * Generate mock content (fallback)
   */
  private generateMockContent(type: string, params: any): any {
    switch (type) {
      case 'exercises':
        return this.generateMockExercises(params.topic, params.level, params.count);
      case 'examples':
        return this.generateMockExamples(params.topic, params.count);
      case 'explanation':
        return this.generateMockExplanation(params.topic, params.understanding);
      case 'review':
        return this.generateMockReviewQuestions(params.topic, params.lessonId || 'lesson', params.count);
      default:
        return [];
    }
  }

  /**
   * Smart mock exercises generator (context-aware)
   */
  private generateMockExercises(
    topic: string,
    level: 'beginner' | 'intermediate' | 'advanced',
    count: number
  ): PracticeExercise[] {
    console.log('🟡 [AI Service] generateMockExercises called with:', { topic, level, count });
    const exercises: PracticeExercise[] = [];
    
    // Comprehensive topic-specific exercise templates for all lessons
    const exerciseTemplates: Record<string, any> = {
      // Beginner Level
      'مقدمة في النحو': {
        question: 'ما هي أنواع الكلمات في اللغة العربية؟',
        instruction: 'اختر الإجابة الصحيحة',
        options: ['نوعان: الاسم والفعل', 'ثلاثة أنواع: الاسم والفعل والحرف', 'أربعة أنواع', 'خمسة أنواع'],
        correctAnswer: 'ثلاثة أنواع: الاسم والفعل والحرف',
        explanation: 'الكلمات في العربية ثلاثة أنواع: الاسم (noun)، والفعل (verb)، والحرف (particle)',
      },
      'الحركات': {
        question: 'ما هي علامة الرفع في كلمة "كِتابٌ"؟',
        instruction: 'اختر الحركة الصحيحة',
        options: ['الفتحة (َ)', 'الضمة (ُ)', 'الكسرة (ِ)', 'السكون (ْ)'],
        correctAnswer: 'الضمة (ُ)',
        explanation: 'الضمة (ُ) هي علامة الرفع، وتظهر على الباء في "كِتابٌ"',
      },
      'المعرفة والنكرة': {
        question: 'ما الفرق بين "الكتاب" و "كتابٌ"؟',
        instruction: 'اختر الإجابة الصحيحة',
        options: ['لا فرق', '"الكتاب" معرفة و "كتابٌ" نكرة', '"الكتاب" نكرة و "كتابٌ" معرفة', 'كلاهما معرفة'],
        correctAnswer: '"الكتاب" معرفة و "كتابٌ" نكرة',
        explanation: '"الكتاب" معرفة لأنها تبدأ بأداة التعريف "ال"، و "كتابٌ" نكرة لأنها منونة',
      },
      'الجملة الاسمية': {
        question: 'حدد المبتدأ والخبر في: "الطالبُ مجتهدٌ"',
        instruction: 'اختر الإجابة الصحيحة',
        options: ['الطالبُ / مجتهدٌ', 'مجتهدٌ / الطالبُ', 'كلاهما مبتدأ', 'كلاهما خبر'],
        correctAnswer: 'الطالبُ / مجتهدٌ',
        explanation: 'الطالبُ: مبتدأ مرفوع، مجتهدٌ: خبر مرفوع',
      },
      'الجملة الفعلية': {
        question: 'حدد الفعل والفاعل في: "كتبَ الطالبُ الدرسَ"',
        instruction: 'اختر الإجابة الصحيحة',
        options: ['كتبَ / الطالبُ', 'الطالبُ / الدرسَ', 'الدرسَ / كتبَ', 'الطالبُ / كتبَ'],
        correctAnswer: 'كتبَ / الطالبُ',
        explanation: 'كتبَ: فعل ماضٍ، الطالبُ: فاعل مرفوع',
      },
      // Intermediate Level
      'الإعراب': {
        question: 'ما إعراب كلمة "الطالبُ" في: "الطالبُ مجتهدٌ"؟',
        instruction: 'اختر الإعراب الصحيح',
        options: ['مرفوع', 'منصوب', 'مجرور', 'مجزوم'],
        correctAnswer: 'مرفوع',
        explanation: 'الطالبُ مرفوع لأنه مبتدأ، وعلامة رفعه الضمة الظاهرة',
      },
      'الفعل المضارع': {
        question: 'صرف الفعل "يقرأ" مع الضمير "أنت"',
        instruction: 'اختر الصيغة الصحيحة',
        options: ['يقرأ', 'تقرأ', 'أقرأ', 'نقرأ'],
        correctAnswer: 'تقرأ',
        explanation: 'الفعل المضارع مع "أنت" يبدأ بتاء: تقرأ',
      },
      'Verb Conjugation: Present Tense': {
        question: 'صرف الفعل "يكتب" مع الضمير "أنا"',
        instruction: 'اختر الصيغة الصحيحة',
        options: ['يكتب', 'تكتب', 'أكتب', 'نكتب'],
        correctAnswer: 'أكتب',
        explanation: 'الفعل المضارع مع "أنا" يبدأ بألف: أكتب',
      },
      'الفعل الماضي': {
        question: 'صرف الفعل "كتب" في الماضي مع الضمير "هما"',
        instruction: 'اختر الصيغة الصحيحة',
        options: ['كتبا', 'كتبتا', 'كتبوا', 'كتبن'],
        correctAnswer: 'كتبا',
        explanation: 'الفعل الماضي مع المثنى المذكر "هما" يضاف إليه ألف: كتبا',
      },
      'Verb Conjugation: Past Tense': {
        question: 'صرف الفعل "قرأ" في الماضي مع الضمير "هم"',
        instruction: 'اختر الصيغة الصحيحة',
        options: ['قرأ', 'قرأوا', 'قرأنا', 'قرأت'],
        correctAnswer: 'قرأوا',
        explanation: 'الفعل الماضي مع "هم" يضاف إليه واو الجماعة: قرأوا',
      },
      'الأسماء الخمسة': {
        question: 'ما إعراب "أبوك" في: "جاء أبوك"؟',
        instruction: 'اختر الإعراب الصحيح',
        options: ['فاعل مرفوع بالضمة', 'فاعل مرفوع بالواو', 'مفعول به منصوب', 'اسم مجرور'],
        correctAnswer: 'فاعل مرفوع بالواو',
        explanation: 'الأسماء الخمسة (أب، أخ، حم، فو، ذو) ترفع بالواو وتنصب بالألف وتجر بالياء',
      },
      'The Five Nouns: الأسماء الخمسة': {
        question: 'ما هي الأسماء الخمسة؟',
        instruction: 'اختر الإجابة الصحيحة',
        options: ['أب، أخ، حم، فو، ذو', 'أب، أم، أخ، أخت، عم', 'كتاب، قلم، مدرسة', 'كل ما سبق'],
        correctAnswer: 'أب، أخ، حم، فو، ذو',
        explanation: 'الأسماء الخمسة هي: أب، أخ، حم، فو، ذو',
      },
      'جمع التكسير': {
        question: 'ما هو جمع "كتاب"؟',
        instruction: 'اختر الجمع الصحيح',
        options: ['كتب', 'كتبات', 'كتابون', 'كتابين'],
        correctAnswer: 'كتب',
        explanation: '"كتب" هو جمع تكسير لكلمة "كتاب"',
      },
      'Broken Plurals: جمع التكسير': {
        question: 'ما هو جمع "طالب"؟',
        instruction: 'اختر الجمع الصحيح',
        options: ['طلاب', 'طالبون', 'طالبات', 'طالبين'],
        correctAnswer: 'طلاب',
        explanation: '"طلاب" هو جمع تكسير لكلمة "طالب"',
      },
      // Advanced Level
      'الصرف': {
        question: 'ما هو وزن الفعل "كَتَّبَ"؟',
        instruction: 'اختر الوزن الصحيح',
        options: ['فَعَلَ', 'فَعَّلَ', 'فَاعَلَ', 'أَفْعَلَ'],
        correctAnswer: 'فَعَّلَ',
        explanation: '"كَتَّبَ" على وزن "فَعَّلَ" وهو من الصيغة الثانية (التفعيل)',
      },
      'Advanced Morphology: الصرف': {
        question: 'ما هو وزن الفعل "كَاتَبَ"؟',
        instruction: 'اختر الوزن الصحيح',
        options: ['فَعَلَ', 'فَعَّلَ', 'فَاعَلَ', 'أَفْعَلَ'],
        correctAnswer: 'فَاعَلَ',
        explanation: '"كَاتَبَ" على وزن "فَاعَلَ" وهو من الصيغة الثالثة (المفاعلة)',
      },
      'البلاغة': {
        question: 'ما نوع الاستعارة في: "رأيت أسداً يحارب"؟',
        instruction: 'اختر النوع الصحيح',
        options: ['استعارة تصريحية', 'استعارة مكنية', 'تشبيه', 'كناية'],
        correctAnswer: 'استعارة مكنية',
        explanation: 'الاستعارة المكنية هي التي حُذف فيها المشبه به (الأسد) وذكر شيء من لوازمه',
      },
      'Rhetoric: البلاغة': {
        question: 'ما هي علوم البلاغة؟',
        instruction: 'اختر الإجابة الصحيحة',
        options: ['المعاني والبيان', 'المعاني والبيان والبديع', 'البيان فقط', 'المعاني فقط'],
        correctAnswer: 'المعاني والبيان والبديع',
        explanation: 'علوم البلاغة ثلاثة: علم المعاني، علم البيان، علم البديع',
      },
      'Complex Sentence Analysis': {
        question: 'ما إعراب "الطالب" في: "إنّ الطالبَ الذي اجتهدَ نجحَ"؟',
        instruction: 'اختر الإعراب الصحيح',
        options: ['اسم إنّ منصوب', 'فاعل مرفوع', 'مبتدأ مرفوع', 'خبر مرفوع'],
        correctAnswer: 'اسم إنّ منصوب',
        explanation: '"الطالب" اسم إنّ منصوب بالفتحة، و "الذي اجتهد" صلة الموصول',
      },
      'إعراب Analysis': {
        question: 'ما إعراب "الكتاب" في: "الكتابُ الذي قرأته مفيدٌ"؟',
        instruction: 'اختر الإعراب الصحيح',
        options: ['مبتدأ مرفوع', 'فاعل مرفوع', 'اسم موصول', 'خبر مرفوع'],
        correctAnswer: 'مبتدأ مرفوع',
        explanation: '"الكتابُ" مبتدأ مرفوع بالضمة، و "الذي قرأته" صلة الموصول',
      },
    };

    // Check for English lesson titles and map them to Arabic concepts
    // Map English lesson titles to Arabic concepts for exercises
    const topicMapping: Record<string, string> = {
      'Introduction to Arabic Grammar': 'مقدمة في النحو',
      'Harakāt - Vowel Marks': 'الحركات',
      'Harakāt: The Vowel Marks': 'الحركات',
      'Definite and Indefinite Nouns': 'المعرفة والنكرة',
      'The Definite Article (ال)': 'المعرفة والنكرة',
      'Sentence Structure: الجملة الاسمية': 'الجملة الاسمية',
      'Sentence Structure: الجملة الفعلية': 'الجملة الفعلية',
      'Noun Cases: الإعراب': 'الإعراب',
      'Noun Cases (الإعراب)': 'الإعراب',
      'Verb Conjugation: Present Tense': 'الفعل المضارع',
      'Verb Conjugation: Past Tense': 'الفعل الماضي',
      'The Five Nouns: الأسماء الخمسة': 'الأسماء الخمسة',
      'Broken Plurals: جمع التكسير': 'جمع التكسير',
      'Advanced Morphology: الصرف': 'الصرف',
      'Advanced Morphology': 'الصرف',
      'Rhetoric: البلاغة': 'البلاغة',
      'Complex Sentence Analysis': 'Complex Sentence Analysis',
      'إعراب Analysis': 'Complex Sentence Analysis',
    };
    
    const arabicTopic = topicMapping[topic] || topic;
    const template = exerciseTemplates[arabicTopic] || exerciseTemplates[topic] || {
      question: `تمرين في ${topic}`,
      instruction: 'أكمل الجملة التالية بشكل صحيح',
      options: ['الخيار أ', 'الخيار ب', 'الخيار ج'],
      correctAnswer: 'الإجابة الصحيحة',
      explanation: `شرح: هذا التمرين يختبر فهمك لـ ${topic}`,
    };
    
    for (let i = 0; i < count; i++) {
      const exercise = {
        id: `ex_${Date.now()}_${i}`,
        type: (template.options ? 'multiple-choice' : 'fill-blank') as 'fill-blank' | 'multiple-choice',
        question: i === 0 ? template.question : `تمرين ${i + 1} في ${topic}`,
        instruction: template.instruction,
        options: template.options,
        correctAnswer: template.correctAnswer,
        explanation: template.explanation,
        difficulty: level,
      };
      console.log(`🟡 [AI Service] Created exercise ${i + 1}:`, exercise);
      exercises.push(exercise);
    }
    
    console.log('🟢 [AI Service] Returning exercises array with length:', exercises.length);
    return exercises;
  }

  /**
   * Smart mock examples generator (topic-specific)
   */
  private generateMockExamples(topic: string, count: number): AdaptiveExample[] {
    console.log('🟡 [AI Service] generateMockExamples called with:', { topic, count });
    const examples: AdaptiveExample[] = [];
    
    // Map English lesson titles to Arabic concepts
    const topicMapping: Record<string, string> = {
      'Introduction to Arabic Grammar': 'مقدمة في النحو',
      'Harakāt - Vowel Marks': 'الحركات',
      'Harakāt: The Vowel Marks': 'الحركات',
      'Definite and Indefinite Nouns': 'المعرفة والنكرة',
      'The Definite Article (ال)': 'المعرفة والنكرة',
      'Sentence Structure: الجملة الاسمية': 'الجملة الاسمية',
      'Sentence Structure: الجملة الفعلية': 'الجملة الفعلية',
      'Noun Cases: الإعراب': 'الإعراب',
      'Noun Cases (الإعراب)': 'الإعراب',
      'Verb Conjugation: Present Tense': 'الفعل المضارع',
      'Verb Conjugation: Past Tense': 'الفعل الماضي',
      'The Five Nouns: الأسماء الخمسة': 'الأسماء الخمسة',
      'Broken Plurals: جمع التكسير': 'جمع التكسير',
      'Advanced Morphology: الصرف': 'الصرف',
      'Advanced Morphology': 'الصرف',
      'Rhetoric: البلاغة': 'البلاغة',
      'Complex Sentence Analysis': 'Complex Sentence Analysis',
      'إعراب Analysis': 'Complex Sentence Analysis',
    };
    
    const arabicTopic = topicMapping[topic] || topic;
    
    // Topic-specific examples
    const exampleTemplates: Record<string, any[]> = {
      'مقدمة في النحو': [
        {
          arabic: 'الكتابُ مفيدٌ',
          transliteration: 'al-kitābu mufīdun',
          translation: 'The book is useful',
          analysis: 'الكتابُ: اسم (noun) - مفيدٌ: صفة (adjective)',
        },
        {
          arabic: 'قرأَ الطالبُ',
          transliteration: 'qara\'a at-talibu',
          translation: 'The student read',
          analysis: 'قرأَ: فعل (verb) - الطالبُ: فاعل (subject)',
        },
        {
          arabic: 'في البيتِ',
          transliteration: 'fī al-bayti',
          translation: 'In the house',
          analysis: 'في: حرف جر (preposition) - البيتِ: اسم مجرور (noun in genitive)',
        },
      ],
      'الحركات': [
        {
          arabic: 'كِتابٌ',
          transliteration: 'kitābun',
          translation: 'a book',
          analysis: 'الضمة (ُ) على الباء: علامة الرفع',
        },
        {
          arabic: 'كِتاباً',
          transliteration: 'kitāban',
          translation: 'a book (accusative)',
          analysis: 'الفتحة (َ) على الباء: علامة النصب',
        },
        {
          arabic: 'كِتابٍ',
          transliteration: 'kitābin',
          translation: 'of a book',
          analysis: 'الكسرة (ِ) على الباء: علامة الجر',
        },
      ],
      'الجملة الاسمية': [
        {
          arabic: 'الطالبُ مجتهدٌ',
          transliteration: 'at-talibu mujtahidun',
          translation: 'The student is diligent',
          analysis: 'الطالبُ: مبتدأ مرفوع - مجتهدٌ: خبر مرفوع',
        },
        {
          arabic: 'الشمسُ مشرقةٌ',
          transliteration: 'ash-shamsu mushriqatun',
          translation: 'The sun is rising',
          analysis: 'الشمسُ: مبتدأ مرفوع - مشرقةٌ: خبر مرفوع',
        },
      ],
      'الجملة الفعلية': [
        {
          arabic: 'كتبَ الطالبُ الدرسَ',
          transliteration: 'kataba at-talibu ad-darsa',
          translation: 'The student wrote the lesson',
          analysis: 'كتبَ: فعل ماضٍ - الطالبُ: فاعل مرفوع - الدرسَ: مفعول به منصوب',
        },
        {
          arabic: 'يقرأُ المعلمُ الكتابَ',
          transliteration: 'yaqra\'u al-mu\'allimu al-kitāba',
          translation: 'The teacher reads the book',
          analysis: 'يقرأُ: فعل مضارع مرفوع - المعلمُ: فاعل مرفوع - الكتابَ: مفعول به منصوب',
        },
      ],
      'المعرفة والنكرة': [
        {
          arabic: 'الكتابُ مفيدٌ',
          transliteration: 'al-kitābu mufīdun',
          translation: 'The book is useful',
          analysis: 'الكتابُ: اسم معرفة (definite) - يبدأ بأداة التعريف "ال"',
        },
        {
          arabic: 'كتابٌ مفيدٌ',
          transliteration: 'kitābun mufīdun',
          translation: 'A book is useful',
          analysis: 'كتابٌ: اسم نكرة (indefinite) - منونة بالضمة',
        },
        {
          arabic: 'قرأتُ الكتابَ',
          transliteration: 'qara\'tu al-kitāba',
          translation: 'I read the book',
          analysis: 'الكتابَ: معرفة منصوبة بالفتحة',
        },
      ],
      'الإعراب': [
        {
          arabic: 'البيتُ جميلٌ',
          transliteration: 'al-baytu jamīlun',
          translation: 'The house is beautiful',
          analysis: 'البيتُ: مبتدأ مرفوع بالضمة - جميلٌ: خبر مرفوع بالضمة',
        },
        {
          arabic: 'إنّ العلمَ نورٌ',
          transliteration: 'inna al-\'ilma nūrun',
          translation: 'Indeed, knowledge is light',
          analysis: 'العلمَ: اسم إنّ منصوب بالفتحة - نورٌ: خبر إنّ مرفوع بالضمة',
        },
        {
          arabic: 'في البيتِ',
          transliteration: 'fī al-bayti',
          translation: 'In the house',
          analysis: 'البيتِ: اسم مجرور بالكسرة بعد حرف الجر "في"',
        },
      ],
      'الفعل المضارع': [
        {
          arabic: 'أكتبُ الدرسَ',
          transliteration: 'aktubu ad-darsa',
          translation: 'I write the lesson',
          analysis: 'أكتبُ: فعل مضارع مرفوع بالضمة - الفاعل مستتر تقديره "أنا"',
        },
        {
          arabic: 'تقرأُ المعلمةُ',
          transliteration: 'taqra\'u al-mu\'allimatu',
          translation: 'The teacher (female) reads',
          analysis: 'تقرأُ: فعل مضارع مرفوع بالضمة - المعلمةُ: فاعل مرفوع',
        },
        {
          arabic: 'ندرسُ معاً',
          transliteration: 'nadrusu ma\'an',
          translation: 'We study together',
          analysis: 'ندرسُ: فعل مضارع مرفوع بالضمة - الفاعل مستتر تقديره "نحن"',
        },
      ],
      'الفعل الماضي': [
        {
          arabic: 'كتبَ الطالبُ',
          transliteration: 'kataba at-talibu',
          translation: 'The student wrote',
          analysis: 'كتبَ: فعل ماضٍ مبني على الفتح - الطالبُ: فاعل مرفوع',
        },
        {
          arabic: 'كتبت المعلمةُ',
          transliteration: 'katabat al-mu\'allimatu',
          translation: 'The teacher (female) wrote',
          analysis: 'كتبت: فعل ماضٍ مبني على الفتح - المعلمةُ: فاعل مرفوع',
        },
        {
          arabic: 'كتبنا الدرسَ',
          transliteration: 'katabnā ad-darsa',
          translation: 'We wrote the lesson',
          analysis: 'كتبنا: فعل ماضٍ مبني على السكون - نا: ضمير متصل في محل رفع فاعل',
        },
      ],
      'الأسماء الخمسة': [
        {
          arabic: 'جاء أبوك',
          transliteration: 'jā\'a abūka',
          translation: 'Your father came',
          analysis: 'أبوك: فاعل مرفوع وعلامة رفعه الواو لأنه من الأسماء الخمسة',
        },
        {
          arabic: 'رأيت أخاك',
          transliteration: 'ra\'aytu akhāka',
          translation: 'I saw your brother',
          analysis: 'أخاك: مفعول به منصوب وعلامة نصبه الألف لأنه من الأسماء الخمسة',
        },
        {
          arabic: 'مررت بأبيك',
          transliteration: 'marartu bi-abīka',
          translation: 'I passed by your father',
          analysis: 'أبيك: اسم مجرور وعلامة جره الياء لأنه من الأسماء الخمسة',
        },
      ],
      'جمع التكسير': [
        {
          arabic: 'الكتبُ مفيدةٌ',
          transliteration: 'al-kutubu mufīdatun',
          translation: 'The books are useful',
          analysis: 'الكتبُ: جمع تكسير لكلمة "كتاب" - مرفوع بالضمة',
        },
        {
          arabic: 'الطلابُ مجتهدون',
          transliteration: 'at-ṭullābu mujtahidūna',
          translation: 'The students are diligent',
          analysis: 'الطلابُ: جمع تكسير لكلمة "طالب" - مرفوع بالضمة',
        },
        {
          arabic: 'قرأتُ الكتبَ',
          transliteration: 'qara\'tu al-kutuba',
          translation: 'I read the books',
          analysis: 'الكتبَ: جمع تكسير منصوب بالفتحة',
        },
      ],
      'الصرف': [
        {
          arabic: 'كَتَّبَ المعلمُ الطالبَ',
          transliteration: 'kattaba al-mu\'allimu at-taliba',
          translation: 'The teacher made the student write',
          analysis: 'كَتَّبَ: فعل على وزن "فَعَّلَ" (Form II) - تفيد التكثير أو التسبب',
        },
        {
          arabic: 'كَاتَبَ الطالبُ صديقه',
          transliteration: 'kātaba at-talibu ṣadīqahu',
          translation: 'The student corresponded with his friend',
          analysis: 'كَاتَبَ: فعل على وزن "فَاعَلَ" (Form III) - تفيد المشاركة',
        },
        {
          arabic: 'أَكْتَبَ المعلمُ الدرسَ',
          transliteration: 'aktaba al-mu\'allimu ad-darsa',
          translation: 'The teacher dictated the lesson',
          analysis: 'أَكْتَبَ: فعل على وزن "أَفْعَلَ" (Form IV) - تفيد التسبب',
        },
      ],
      'البلاغة': [
        {
          arabic: 'رأيت أسداً يحارب',
          transliteration: 'ra\'aytu asadan yuḥāribu',
          translation: 'I saw a lion fighting',
          analysis: 'استعارة مكنية: "أسداً" استعارة للشجاع - حُذف المشبه به وذكر شيء من لوازمه',
        },
        {
          arabic: 'الليل يبكي',
          transliteration: 'al-laylu yabkī',
          translation: 'The night cries',
          analysis: 'تشبيه: الليل يشبه الإنسان في البكاء - تشبيه بليغ',
        },
      ],
      'Complex Sentence Analysis': [
        {
          arabic: 'إنّ الطالبَ الذي اجتهدَ نجحَ',
          transliteration: 'inna at-taliba alladhī ijtahada najaha',
          translation: 'Indeed, the student who worked hard succeeded',
          analysis: 'الطالبَ: اسم إنّ منصوب - الذي: اسم موصول - اجتهدَ: فعل ماضٍ - نجحَ: فعل ماضٍ وفاعله مستتر',
        },
        {
          arabic: 'الكتابُ الذي قرأته مفيدٌ',
          transliteration: 'al-kitābu alladhī qara\'tuhu mufīdun',
          translation: 'The book that I read is useful',
          analysis: 'الكتابُ: مبتدأ مرفوع - الذي: اسم موصول - قرأته: فعل وفاعل ومفعول به - مفيدٌ: خبر مرفوع',
        },
      ],
      'الفاعل': [
        {
          arabic: 'قرأَ الطالبُ الكتابَ',
          transliteration: 'qara\'a at-talibu al-kitaba',
          translation: 'The student read the book',
          analysis: 'الطالبُ: فاعل مرفوع وعلامة رفعه الضمة الظاهرة',
        },
        {
          arabic: 'كتبت المعلمةُ الدرسَ',
          transliteration: 'katabat al-mu\'allimatu ad-darsa',
          translation: 'The teacher (female) wrote the lesson',
          analysis: 'المعلمةُ: فاعل مرفوع وعلامة رفعه الضمة الظاهرة',
        },
      ],
      'المفعول به': [
        {
          arabic: 'قرأَ الطالبُ الكتابَ',
          transliteration: 'qara\'a at-talibu al-kitaba',
          translation: 'The student read the book',
          analysis: 'الكتابَ: مفعول به منصوب وعلامة نصبه الفتحة الظاهرة',
        },
      ],
    };

    const templates = exampleTemplates[arabicTopic] || exampleTemplates[topic] || [
      {
        arabic: 'الطالبُ يدرسُ',
        transliteration: 'at-talibu yadrusu',
        translation: 'The student studies',
        analysis: `مثال توضيحي في ${topic}`,
      },
      {
        arabic: 'الكتابُ مفيدٌ',
        transliteration: 'al-kitābu mufīdun',
        translation: 'The book is useful',
        analysis: `مثال آخر في ${topic}`,
      },
      {
        arabic: 'في المدرسةِ',
        transliteration: 'fī al-madrasati',
        translation: 'In the school',
        analysis: `مثال ثالث في ${topic}`,
      },
    ];
    
    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length] || templates[0];
      examples.push({
        arabic: template.arabic,
        transliteration: template.transliteration,
        translation: template.translation,
        analysis: template.analysis,
        context: `Example for ${topic}`,
      });
      console.log(`🟡 [AI Service] Created example ${i + 1}:`, examples[i]);
    }
    console.log('🟢 [AI Service] Returning examples array with length:', examples.length);
    return examples;
  }

  /**
   * Smart mock explanation generator (topic-specific)
   */
  private generateMockExplanation(
    topic: string,
    understanding: 'basic' | 'intermediate' | 'advanced'
  ): PersonalizedExplanation {
    const explanations: Record<string, Record<string, string>> = {
      'الفاعل': {
        basic: 'الفاعل هو من قام بالفعل. مثال: في "قرأَ الطالبُ"، الطالبُ هو الفاعل لأنه من قام بفعل القراءة.',
        intermediate: 'الفاعل هو اسم مرفوع يأتي بعد الفعل ويدل على من قام بالفعل. يكون دائماً مرفوعاً وعلامة رفعه الضمة للاسم المفرد.',
        advanced: 'الفاعل: اسم مرفوع يأتي بعد الفعل المبني للمعلوم، ويدل على من قام بالفعل أو اتصف به. يكون مرفوعاً دائماً، وعلامة رفعه الضمة للاسم المفرد، والواو للجمع المذكر السالم، والألف للمثنى.',
      },
      'المفعول به': {
        basic: 'المفعول به هو ما وقع عليه الفعل. مثال: في "قرأَ الطالبُ الكتابَ"، الكتابَ هو المفعول به.',
        intermediate: 'المفعول به هو اسم منصوب يأتي بعد الفعل المتعدي ويدل على ما وقع عليه الفعل. يكون دائماً منصوباً وعلامة نصبه الفتحة.',
        advanced: 'المفعول به: اسم منصوب يأتي بعد الفعل المتعدي، ويدل على ما وقع عليه الفعل. يكون منصوباً دائماً، وعلامة نصبه الفتحة للاسم المفرد، والياء للمثنى والجمع المذكر السالم.',
      },
    };

    const explanation = explanations[topic]?.[understanding] || 
      `شرح ${understanding} لموضوع ${topic}. هذا الموضوع مهم في قواعد اللغة العربية.`;

    return {
      explanation,
      depth: understanding,
      examples: this.generateMockExamples(topic, 2),
      commonMistakes: [
        `خطأ شائع: الخلط بين ${topic} والمكونات الأخرى في الجملة`,
        `خطأ شائع: نسيان علامة الإعراب الصحيحة لـ ${topic}`,
      ],
    };
  }

  /**
   * Smart mock review questions generator (topic-aware)
   */
  private generateMockReviewQuestions(
    topic: string,
    lessonId: string,
    count: number
  ): ReviewQuestion[] {
    console.log('🟡 [AI Service] generateMockReviewQuestions called with:', { topic, lessonId, count });
    const questions: ReviewQuestion[] = [];
    
    // Comprehensive topic-specific question templates for all lessons
    const questionTemplates: Record<string, any[]> = {
      'Introduction to Arabic Grammar': [
        {
          question: 'كم عدد أنواع الكلمات في اللغة العربية؟',
          type: 'multiple-choice',
          options: ['نوعان', 'ثلاثة أنواع', 'أربعة أنواع', 'خمسة أنواع'],
          correctAnswer: 'ثلاثة أنواع',
          explanation: 'الكلمات في العربية ثلاثة أنواع: الاسم (noun)، والفعل (verb)، والحرف (particle)',
        },
        {
          question: 'ما هو الاسم في اللغة العربية؟',
          type: 'multiple-choice',
          options: ['كلمة تدل على حدث', 'كلمة تدل على معنى في نفسها', 'كلمة تربط بين الكلمات', 'كل ما سبق'],
          correctAnswer: 'كلمة تدل على معنى في نفسها',
          explanation: 'الاسم هو كلمة تدل على معنى في نفسها ولا تحتاج إلى كلمات أخرى',
        },
        {
          question: 'الحرف هو نوع من أنواع الكلمات في العربية',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'نعم، الحرف هو النوع الثالث من أنواع الكلمات في اللغة العربية',
        },
        {
          question: 'ما هو الفعل؟',
          type: 'multiple-choice',
          options: ['كلمة تدل على حدث مقترن بزمن', 'كلمة تدل على معنى', 'كلمة تربط', 'كل ما سبق'],
          correctAnswer: 'كلمة تدل على حدث مقترن بزمن',
          explanation: 'الفعل هو كلمة تدل على حدث مقترن بزمن (ماضي، مضارع، أمر)',
        },
        {
          question: 'مثال على الاسم: كتاب، مثال على الفعل: كتب، مثال على الحرف: في',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'صحيح: كتاب (اسم)، كتب (فعل)، في (حرف جر)',
        },
      ],
      'Harakāt - Vowel Marks': [
        {
          question: 'كم عدد الحركات الأساسية في اللغة العربية؟',
          type: 'multiple-choice',
          options: ['حركتان', 'ثلاث حركات', 'أربع حركات', 'خمس حركات'],
          correctAnswer: 'أربع حركات',
          explanation: 'الحركات الأساسية هي: الفتحة (َ)، الضمة (ُ)، الكسرة (ِ)، والسكون (ْ)',
        },
        {
          question: 'ما هي علامة الفتحة؟',
          type: 'multiple-choice',
          options: ['َ', 'ُ', 'ِ', 'ْ'],
          correctAnswer: 'َ',
          explanation: 'الفتحة هي الخط المائل فوق الحرف (َ)',
        },
        {
          question: 'الضمة (ُ) هي علامة الرفع',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'صحيح، الضمة هي علامة الرفع الأصلية',
        },
        {
          question: 'ما هي علامة النصب الأصلية؟',
          type: 'multiple-choice',
          options: ['الضمة', 'الفتحة', 'الكسرة', 'السكون'],
          correctAnswer: 'الفتحة',
          explanation: 'الفتحة هي علامة النصب الأصلية',
        },
        {
          question: 'الكسرة (ِ) هي علامة الجر',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'صحيح، الكسرة هي علامة الجر الأصلية',
        },
      ],
      'Definite and Indefinite Nouns': [
        {
          question: 'ما هو الاسم المعرفة في العربية؟',
          type: 'multiple-choice',
          options: ['الاسم الذي يبدأ بال', 'الاسم الذي ينتهي بالتنوين', 'الاسم الذي لا يحدد', 'كل ما سبق'],
          correctAnswer: 'الاسم الذي يبدأ بال',
          explanation: 'الاسم المعرفة يبدأ بأداة التعريف "ال" مثل "الكتاب"',
        },
        {
          question: 'التنوين يدل على الاسم النكرة',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'نعم، التنوين (ٌ، ٍ، ً) يدل على أن الاسم نكرة',
        },
        {
          question: 'ما الفرق بين "الكتاب" و "كتابٌ"؟',
          type: 'multiple-choice',
          options: ['لا فرق', '"الكتاب" معرفة و "كتابٌ" نكرة', '"الكتاب" نكرة و "كتابٌ" معرفة', 'كلاهما معرفة'],
          correctAnswer: '"الكتاب" معرفة و "كتابٌ" نكرة',
          explanation: '"الكتاب" معرفة (يبدأ بال)، "كتابٌ" نكرة (منونة)',
        },
        {
          question: 'أداة التعريف "ال" تجعل الاسم معرفة',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'صحيح، إضافة "ال" للاسم تجعله معرفة',
        },
      ],
      'Sentence Structure: الجملة الاسمية': [
        {
          question: 'ما هي مكونات الجملة الاسمية؟',
          type: 'multiple-choice',
          options: ['فعل + فاعل', 'مبتدأ + خبر', 'فعل + مفعول به', 'كل ما سبق'],
          correctAnswer: 'مبتدأ + خبر',
          explanation: 'الجملة الاسمية تتكون من المبتدأ (الموضوع) والخبر (المسند)',
        },
        {
          question: 'في الجملة "الطالبُ مجتهدٌ"، ما هو المبتدأ؟',
          type: 'multiple-choice',
          options: ['الطالبُ', 'مجتهدٌ', 'كلاهما', 'لا شيء'],
          correctAnswer: 'الطالبُ',
          explanation: 'المبتدأ هو "الطالبُ" لأنه يقع في أول الجملة الاسمية',
        },
        {
          question: 'المبتدأ والخبر كلاهما مرفوعان',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'صحيح، المبتدأ والخبر كلاهما مرفوعان',
        },
        {
          question: 'ما هو الخبر في: "الشمسُ مشرقةٌ"؟',
          type: 'multiple-choice',
          options: ['الشمسُ', 'مشرقةٌ', 'كلاهما', 'لا شيء'],
          correctAnswer: 'مشرقةٌ',
          explanation: 'الخبر هو "مشرقةٌ" لأنه يخبر عن المبتدأ "الشمسُ"',
        },
      ],
      'Sentence Structure: الجملة الفعلية': [
        {
          question: 'ما هي مكونات الجملة الفعلية؟',
          type: 'multiple-choice',
          options: ['فعل + فاعل', 'فعل + فاعل + مفعول به', 'مبتدأ + خبر', 'فعل فقط'],
          correctAnswer: 'فعل + فاعل + مفعول به',
          explanation: 'الجملة الفعلية تتكون من الفعل والفاعل، وقد تحتوي على مفعول به',
        },
        {
          question: 'في الجملة "كتبَ الطالبُ الدرسَ"، ما هو الفاعل؟',
          type: 'multiple-choice',
          options: ['كتبَ', 'الطالبُ', 'الدرسَ', 'كل ما سبق'],
          correctAnswer: 'الطالبُ',
          explanation: 'الفاعل هو "الطالبُ" لأنه من قام بالفعل',
        },
        {
          question: 'الجملة الفعلية تبدأ بفعل',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'صحيح، الجملة الفعلية تبدأ بفعل (ماضي، مضارع، أو أمر)',
        },
        {
          question: 'ما هو المفعول به في: "قرأَ الطالبُ الكتابَ"؟',
          type: 'multiple-choice',
          options: ['قرأَ', 'الطالبُ', 'الكتابَ', 'كل ما سبق'],
          correctAnswer: 'الكتابَ',
          explanation: 'المفعول به هو "الكتابَ" لأنه من وقع عليه الفعل',
        },
      ],
      'Noun Cases: الإعراب': [
        {
          question: 'كم عدد حالات الإعراب الأساسية في العربية؟',
          type: 'multiple-choice',
          options: ['حالتان', 'ثلاث حالات', 'أربع حالات', 'خمس حالات'],
          correctAnswer: 'ثلاث حالات',
          explanation: 'حالات الإعراب الأساسية هي: الرفع (nominative)، النصب (accusative)، الجر (genitive)',
        },
        {
          question: 'ما هي علامة الرفع الأصلية؟',
          type: 'multiple-choice',
          options: ['الفتحة', 'الضمة', 'الكسرة', 'السكون'],
          correctAnswer: 'الضمة',
          explanation: 'علامة الرفع الأصلية هي الضمة (ُ)',
        },
        {
          question: 'علامة النصب الأصلية هي الفتحة',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'صحيح، الفتحة (َ) هي علامة النصب الأصلية',
        },
        {
          question: 'ما هي علامة الجر الأصلية؟',
          type: 'multiple-choice',
          options: ['الضمة', 'الفتحة', 'الكسرة', 'السكون'],
          correctAnswer: 'الكسرة',
          explanation: 'الكسرة (ِ) هي علامة الجر الأصلية',
        },
        {
          question: 'في "البيتُ جميلٌ"، إعراب "البيتُ" هو مبتدأ مرفوع',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'صحيح، "البيتُ" مبتدأ مرفوع بالضمة',
        },
      ],
      'Verb Conjugation: Present Tense': [
        {
          question: 'صرف الفعل "يقرأ" مع الضمير "أنا"',
          type: 'multiple-choice',
          options: ['يقرأ', 'تقرأ', 'أقرأ', 'نقرأ'],
          correctAnswer: 'أقرأ',
          explanation: 'الفعل المضارع مع "أنا" يبدأ بألف: أقرأ',
        },
        {
          question: 'صرف الفعل "يكتب" مع الضمير "هي"',
          type: 'multiple-choice',
          options: ['يكتب', 'تكتب', 'أكتب', 'نكتب'],
          correctAnswer: 'تكتب',
          explanation: 'الفعل المضارع مع "هي" يبدأ بتاء: تكتب',
        },
        {
          question: 'الفعل المضارع يبدأ بحروف المضارعة (أ، ن، ي، ت)',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'صحيح، الفعل المضارع يبدأ بأحد حروف المضارعة الأربعة',
        },
      ],
      'Verb Conjugation: Past Tense': [
        {
          question: 'صرف الفعل "كتب" في الماضي مع الضمير "هم"',
          type: 'multiple-choice',
          options: ['كتبوا', 'كتبن', 'كتبا', 'كتب'],
          correctAnswer: 'كتبوا',
          explanation: 'الفعل الماضي مع "هم" يضاف إليه واو الجماعة: كتبوا',
        },
        {
          question: 'صرف الفعل "قرأ" في الماضي مع الضمير "أنت"',
          type: 'multiple-choice',
          options: ['قرأ', 'قرأت', 'قرأنا', 'قرأوا'],
          correctAnswer: 'قرأت',
          explanation: 'الفعل الماضي مع "أنت" يضاف إليه تاء المخاطب: قرأت',
        },
        {
          question: 'الفعل الماضي مبني على الفتح في الأصل',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'صحيح، الفعل الماضي مبني على الفتح في الأصل',
        },
      ],
      'The Five Nouns: الأسماء الخمسة': [
        {
          question: 'ما هي الأسماء الخمسة؟',
          type: 'multiple-choice',
          options: ['أب، أخ، حم، فو، ذو', 'أب، أم، أخ، أخت، عم', 'كتاب، قلم، مدرسة', 'كل ما سبق'],
          correctAnswer: 'أب، أخ، حم، فو، ذو',
          explanation: 'الأسماء الخمسة هي: أب، أخ، حم، فو، ذو',
        },
        {
          question: 'إعراب الأسماء الخمسة: ترفع بالواو وتنصب بالألف وتجر بالياء',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'صحيح، الأسماء الخمسة لها علامات إعراب خاصة',
        },
        {
          question: 'ما إعراب "أبوك" في: "جاء أبوك"؟',
          type: 'multiple-choice',
          options: ['فاعل مرفوع بالضمة', 'فاعل مرفوع بالواو', 'مفعول به', 'خبر'],
          correctAnswer: 'فاعل مرفوع بالواو',
          explanation: '"أبوك" من الأسماء الخمسة، مرفوع بالواو',
        },
      ],
      'Broken Plurals: جمع التكسير': [
        {
          question: 'ما هو جمع "كتاب"؟',
          type: 'multiple-choice',
          options: ['كتب', 'كتبات', 'كتابون', 'كتابين'],
          correctAnswer: 'كتب',
          explanation: '"كتب" هو جمع تكسير لكلمة "كتاب"',
        },
        {
          question: 'جمع التكسير يغير بنية الكلمة',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'صحيح، جمع التكسير يغير بنية الكلمة الأصلية',
        },
        {
          question: 'ما هو جمع "طالب"؟',
          type: 'multiple-choice',
          options: ['طلاب', 'طالبون', 'طالبات', 'طالبين'],
          correctAnswer: 'طلاب',
          explanation: '"طلاب" هو جمع تكسير لكلمة "طالب"',
        },
      ],
      'Advanced Morphology: الصرف': [
        {
          question: 'ما هو وزن الفعل "كَتَّبَ"؟',
          type: 'multiple-choice',
          options: ['فَعَلَ', 'فَعَّلَ', 'فَاعَلَ', 'أَفْعَلَ'],
          correctAnswer: 'فَعَّلَ',
          explanation: '"كَتَّبَ" على وزن "فَعَّلَ" وهو من الصيغة الثانية',
        },
        {
          question: 'الصيغة الثانية (فَعَّلَ) تفيد التكثير أو التسبب',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'صحيح، الصيغة الثانية تفيد التكثير أو التسبب',
        },
      ],
      'Rhetoric: البلاغة': [
        {
          question: 'ما نوع الاستعارة في: "رأيت أسداً يحارب"؟',
          type: 'multiple-choice',
          options: ['استعارة تصريحية', 'استعارة مكنية', 'تشبيه', 'كناية'],
          correctAnswer: 'استعارة مكنية',
          explanation: 'الاستعارة المكنية هي التي حُذف فيها المشبه به وذكر شيء من لوازمه',
        },
        {
          question: 'البلاغة تنقسم إلى ثلاثة علوم: المعاني والبيان والبديع',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'صحيح، علوم البلاغة ثلاثة: المعاني والبيان والبديع',
        },
      ],
      'Complex Sentence Analysis': [
        {
          question: 'ما إعراب "الطالب" في: "إنّ الطالبَ الذي اجتهدَ نجحَ"؟',
          type: 'multiple-choice',
          options: ['اسم إنّ منصوب', 'فاعل مرفوع', 'مبتدأ مرفوع', 'خبر مرفوع'],
          correctAnswer: 'اسم إنّ منصوب',
          explanation: '"الطالب" اسم إنّ منصوب بالفتحة',
        },
        {
          question: 'الجملة المعقدة تحتوي على أكثر من جملة',
          type: 'true-false',
          correctAnswer: 'صح',
          explanation: 'صحيح، الجملة المعقدة تحتوي على جملة رئيسية وجملة أو أكثر فرعية',
        },
      ],
    };
    
    // Get questions for this topic or generate generic ones
    const templates = questionTemplates[topic] || this.generateGenericQuestions(topic, count);
    
    // Use templates or generate based on count
    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length] || this.generateGenericQuestion(topic, i);
      questions.push({
        id: `review_${lessonId}_${Date.now()}_${i}`,
        question: template.question,
        type: template.type,
        options: template.options,
        correctAnswer: template.correctAnswer,
        explanation: template.explanation,
        lessonTopic: topic,
      });
    }
    
    return questions;
  }
  
  /**
   * Generate generic questions for topics without specific templates
   */
  private generateGenericQuestions(topic: string, count: number): any[] {
    const questions: any[] = [];
    const questionTypes = [
      {
        question: `ما هو المفهوم الأساسي في درس "${topic}"؟`,
        type: 'multiple-choice',
        options: ['مفهوم النحو', 'مفهوم الصرف', 'مفهوم البلاغة', 'مفهوم النحو والصرف'],
        correctAnswer: 'مفهوم النحو والصرف',
        explanation: `هذا الدرس يتناول مفاهيم أساسية في ${topic}`,
      },
      {
        question: `هل درس "${topic}" مهم لفهم قواعد اللغة العربية؟`,
        type: 'true-false',
        correctAnswer: 'صح',
        explanation: `نعم، درس ${topic} مهم جداً لفهم قواعد اللغة العربية`,
      },
      {
        question: `ما الذي تعلمناه في درس "${topic}"؟`,
        type: 'short-answer',
        correctAnswer: 'تعلمنا مفاهيم أساسية في النحو والصرف',
        explanation: `في هذا الدرس تعلمنا ${topic}`,
      },
    ];
    
    for (let i = 0; i < Math.min(count, questionTypes.length); i++) {
      questions.push(questionTypes[i]);
    }
    
    return questions;
  }
  
  /**
   * Generate a single generic question
   */
  private generateGenericQuestion(topic: string, index: number): any {
    return {
      question: `سؤال مراجعة ${index + 1} حول "${topic}"؟`,
      type: index % 2 === 0 ? 'multiple-choice' : 'true-false',
      options: index % 2 === 0 ? ['الخيار أ', 'الخيار ب', 'الخيار ج', 'الخيار د'] : undefined,
      correctAnswer: index % 2 === 0 ? 'الخيار ب' : 'صح',
      explanation: `هذا السؤال يختبر فهمك لـ ${topic}`,
    };
  }
}

// Export singleton instance
export const lessonAIService = new LessonAIService();

