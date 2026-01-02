import { supabase } from '../utils/supabase/client';
import type { ChatbotConversation } from '../utils/supabase/client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const chatbotService = {
  // Get all conversations for a user
  async getConversations(userId: string): Promise<ChatbotConversation[]> {
    const { data, error } = await supabase
      .from('chatbot_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }

    return data || [];
  },

  // Get a single conversation
  async getConversation(conversationId: string): Promise<ChatbotConversation | null> {
    const { data, error } = await supabase
      .from('chatbot_conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }

    return data;
  },

  // Create a new conversation
  async createConversation(
    userId: string,
    title: string = 'محادثة جديدة'
  ): Promise<ChatbotConversation | null> {
    const { data, error } = await supabase
      .from('chatbot_conversations')
      .insert({
        user_id: userId,
        title: title,
        messages: [{
          role: 'assistant',
          content: 'السلام عليكم! أنا مساعدك لتعلم قواعد اللغة العربية بالذكاء الاصطناعي. اسألني عن أي قاعدة نحوية، تصحيح الجمل، أو تحليل الإعراب.',
          timestamp: new Date().toISOString(),
        }],
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }

    return data;
  },

  // Update conversation messages
  async updateConversation(
    conversationId: string,
    messages: ChatMessage[]
  ): Promise<boolean> {
    const { error } = await supabase
      .from('chatbot_conversations')
      .update({
        messages,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    if (error) {
      console.error('Error updating conversation:', error);
      return false;
    }

    return true;
  },

  // Update conversation title
  async updateConversationTitle(
    conversationId: string,
    title: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from('chatbot_conversations')
      .update({
        title,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    if (error) {
      console.error('Error updating conversation title:', error);
      return false;
    }

    return true;
  },

  // Delete a conversation
  async deleteConversation(conversationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('chatbot_conversations')
      .delete()
      .eq('id', conversationId);

    if (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }

    return true;
  },

  // Generate title from first user message
  generateTitle(messages: ChatMessage[]): string {
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      const content = firstUserMessage.content;
      return content.length > 50 ? content.substring(0, 50) + '...' : content;
    }
    return 'محادثة جديدة';
  },

  // Search conversations by title or content
  async searchConversations(userId: string, query: string): Promise<ChatbotConversation[]> {
    const { data, error } = await supabase
      .from('chatbot_conversations')
      .select('*')
      .eq('user_id', userId)
      .ilike('title', `%${query}%`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error searching conversations:', error);
      return [];
    }

    return data || [];
  },
};