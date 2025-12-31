import { supabase } from '../utils/supabase/client';
import { aiService, ChatMessage } from './aiService';
import type { ChatbotConversation } from '../utils/supabase/client';

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
  async createConversation(userId: string): Promise<ChatbotConversation | null> {
    const { data, error } = await supabase
      .from('chatbot_conversations')
      .insert({
        user_id: userId,
        messages: [],
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }

    return data;
  },

  // Send a message and get AI response
  async sendMessage(
    userId: string,
    message: string,
    conversationId?: string
  ): Promise<{
    conversation: ChatbotConversation;
    response: string;
  } | null> {
    let conversation: ChatbotConversation | null;

    // Get or create conversation
    if (conversationId) {
      conversation = await this.getConversation(conversationId);
    } else {
      conversation = await this.createConversation(userId);
    }

    if (!conversation) return null;

    // Get existing messages
    const messages = (conversation.messages as ChatMessage[]) || [];

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    messages.push(userMessage);

    // Get AI response
    const aiResponse = aiService.chat(message, messages);

    // Add AI message
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
    };

    messages.push(assistantMessage);

    // Update conversation
    const { data, error } = await supabase
      .from('chatbot_conversations')
      .update({
        messages,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversation.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating conversation:', error);
      return null;
    }

    return {
      conversation: data,
      response: aiResponse,
    };
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

  // Get recent conversations (last 5)
  async getRecentConversations(userId: string, limit: number = 5): Promise<ChatbotConversation[]> {
    const { data, error } = await supabase
      .from('chatbot_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent conversations:', error);
      return [];
    }

    return data || [];
  },
};
