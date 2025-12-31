import { supabase } from '../utils/supabase/client';
import { aiService } from './aiService';
import type { Assessment, AssessmentSession } from '../utils/supabase/client';

export const assessmentService = {
  // Get all assessments
  async getAssessments(): Promise<Assessment[]> {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching assessments:', error);
      return [];
    }

    return data || [];
  },

  // Get assessment by ID
  async getAssessmentById(id: string): Promise<Assessment | null> {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching assessment:', error);
      return null;
    }

    return data;
  },

  // Start an assessment session
  async startAssessment(
    userId: string,
    assessmentId: string
  ): Promise<{ session: AssessmentSession; questions: any[] } | null> {
    const assessment = await this.getAssessmentById(assessmentId);
    if (!assessment) return null;

    // Generate questions using AI service
    const questions = aiService.generateQuestions(
      assessment.topic,
      assessment.difficulty,
      10 // Generate 10 questions
    );

    // Create assessment session
    const { data, error } = await supabase
      .from('assessment_sessions')
      .insert({
        user_id: userId,
        assessment_id: assessmentId,
        questions,
        answers: [],
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating assessment session:', error);
      return null;
    }

    return {
      session: data,
      questions,
    };
  },

  // Submit assessment answers
  async submitAssessment(
    sessionId: string,
    answers: any[]
  ): Promise<{ score: number; results: any } | null> {
    const { data: session, error: fetchError } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError || !session) {
      console.error('Error fetching session:', fetchError);
      return null;
    }

    const questions = session.questions as any[];
    
    // Calculate score
    let correctCount = 0;
    const results = questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correct;
      if (isCorrect) correctCount++;

      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correct,
        isCorrect,
        explanation: question.explanation,
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);

    // Update session
    const { error: updateError } = await supabase
      .from('assessment_sessions')
      .update({
        answers,
        score,
        completed_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Error updating session:', updateError);
      return null;
    }

    return { score, results };
  },

  // Get user's assessment history
  async getAssessmentHistory(userId: string): Promise<AssessmentSession[]> {
    const { data, error } = await supabase
      .from('assessment_sessions')
      .select('*, assessments(*)')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching assessment history:', error);
      return [];
    }

    return data || [];
  },

  // Get assessment results
  async getAssessmentResults(sessionId: string): Promise<any | null> {
    const { data: session, error } = await supabase
      .from('assessment_sessions')
      .select('*, assessments(*)')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('Error fetching results:', error);
      return null;
    }

    if (!session.completed_at) {
      return null; // Assessment not completed yet
    }

    const questions = session.questions as any[];
    const answers = session.answers as any[];

    const results = questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correct;

      return {
        questionId: question.id,
        question: question.question,
        options: question.options,
        userAnswer,
        correctAnswer: question.correct,
        isCorrect,
        explanation: question.explanation,
      };
    });

    return {
      session,
      assessment: session.assessments,
      score: session.score,
      results,
    };
  },

  // Get user's best scores
  async getBestScores(userId: string): Promise<Record<string, number>> {
    const history = await this.getAssessmentHistory(userId);
    const bestScores: Record<string, number> = {};

    history.forEach(session => {
      const assessmentId = session.assessment_id;
      const score = session.score || 0;

      if (!bestScores[assessmentId] || score > bestScores[assessmentId]) {
        bestScores[assessmentId] = score;
      }
    });

    return bestScores;
  },
};
