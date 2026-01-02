import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, HelpCircle, BookOpen, FileText, Pen, Loader2, Plus, MessageSquare, Trash2, Edit2, Check, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Page } from '../App';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase/client';
import type { ChatbotConversation } from '../utils/supabase/client';

interface ChatbotTutorProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const RAG_API_URL = import.meta.env.VITE_RAG_API_URL || 'http://localhost:8001';

export function ChatbotTutor({ onNavigate, onLogout }: ChatbotTutorProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ChatbotConversation[]>([]);
  const [ragStatus, setRagStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [showSidebar, setShowSidebar] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { icon: HelpCircle, text: 'اشرح هذه القاعدة', prompt: 'ما هو الفاعل في اللغة العربية؟' },
    { icon: Pen, text: 'صحح جملتي', prompt: 'صحح هذه الجملة: الطالب يدرس الدرس' },
    { icon: FileText, text: 'أعطني تمارين', prompt: 'أعطني تمارين على الإعراب' },
    { icon: BookOpen, text: 'حلل الإعراب', prompt: 'ما هو إعراب: الطالبُ يكتبُ الدرسَ' },
  ];

  useEffect(() => {
    checkRagHealth();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const checkRagHealth = async () => {
    try {
      const response = await fetch(`${RAG_API_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        setRagStatus(data.status === 'healthy' || data.status === 'initializing' ? 'available' : 'unavailable');
      } else {
        setRagStatus('unavailable');
      }
    } catch (error) {
      console.error('RAG API health check failed:', error);
      setRagStatus('unavailable');
    }
  };

  const loadConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chatbot_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setConversations(data || []);

      // Load the most recent conversation if exists
      if (data && data.length > 0 && !conversationId) {
        loadConversation(data[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadConversation = async (convId: string) => {
    try {
      const { data, error } = await supabase
        .from('chatbot_conversations')
        .select('*')
        .eq('id', convId)
        .single();

      if (error) throw error;

      setConversationId(convId);
      
      const loadedMessages = (data.messages as any[]) || [];
      const formattedMessages = loadedMessages.map((msg: any, idx: number) => ({
        id: idx + 1,
        type: msg.role === 'user' ? 'user' : 'ai',
        content: msg.content,
        timestamp: new Date(msg.timestamp || data.created_at),
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const createNewConversation = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chatbot_conversations')
        .insert({
          user_id: user.id,
          title: 'محادثة جديدة',
          messages: [{
            role: 'assistant',
            content: 'السلام عليكم! أنا مساعدك لتعلم قواعد اللغة العربية بالذكاء الاصطناعي. اسألني عن أي قاعدة نحوية، تصحيح الجمل، أو تحليل الإعراب.',
            timestamp: new Date().toISOString(),
          }],
        })
        .select()
        .single();

      if (error) throw error;

      setConversationId(data.id);
      setMessages([{
        id: 1,
        type: 'ai',
        content: 'السلام عليكم! أنا مساعدك لتعلم قواعد اللغة العربية بالذكاء الاصطناعي. اسألني عن أي قاعدة نحوية، تصحيح الجمل، أو تحليل الإعراب.',
        timestamp: new Date(),
      }]);

      await loadConversations();
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const saveMessageToDatabase = async (updatedMessages: Message[]) => {
    if (!user || !conversationId) return;

    try {
      const dbMessages = updatedMessages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
      }));

      // Auto-generate title from first user message if still default
      const conversation = conversations.find(c => c.id === conversationId);
      let title = conversation?.title || 'محادثة جديدة';
      
      if (title === 'محادثة جديدة' && dbMessages.length > 1) {
        const firstUserMsg = dbMessages.find(m => m.role === 'user');
        if (firstUserMsg) {
          title = firstUserMsg.content.length > 50 
            ? firstUserMsg.content.substring(0, 50) + '...' 
            : firstUserMsg.content;
        }
      }

      const { error } = await supabase
        .from('chatbot_conversations')
        .update({
          messages: dbMessages,
          title: title,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId);

      if (error) throw error;

      await loadConversations();
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const deleteConversation = async (convId: string) => {
    try {
      const { error } = await supabase
        .from('chatbot_conversations')
        .delete()
        .eq('id', convId);

      if (error) throw error;

      // If deleting current conversation, create a new one
      if (convId === conversationId) {
        await createNewConversation();
      }

      await loadConversations();
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const updateConversationTitle = async (convId: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('chatbot_conversations')
        .update({ title: newTitle })
        .eq('id', convId);

      if (error) throw error;

      setEditingId(null);
      await loadConversations();
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const queryRAG = async (question: string): Promise<string> => {
    try {
      const response = await fetch(`${RAG_API_URL}/chat`, {
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
      return data.answer || 'عذراً، لم أتمكن من توليد إجابة. يرجى إعادة صياغة سؤالك.';
    } catch (error) {
      console.error('Error querying RAG:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    const updatedMessagesWithUser = [...messages, userMessage];
    setMessages(updatedMessagesWithUser);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await queryRAG(inputMessage);

      const aiMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessagesWithUser, aiMessage];
      setMessages(finalMessages);
      await saveMessageToDatabase(finalMessages);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: ragStatus === 'unavailable' 
          ? '⚠️ خدمة الذكاء الاصطناعي غير متاحة حالياً. تأكد من تشغيل الخادم على http://localhost:8001'
          : 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessagesWithUser, errorMessage];
      setMessages(finalMessages);
      await saveMessageToDatabase(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="flex min-h-screen bg-[#FFFDF6]">
      <Sidebar currentPage="chatbot" onNavigate={onNavigate} onLogout={onLogout} />
      
      {/* Conversations Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 ml-64 border-r border-[#E1CB98]/30 bg-white overflow-hidden`}>
        <div className="p-4 h-screen flex flex-col">
          {/* New Conversation Button */}
          <button
            onClick={createNewConversation}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-gradient-to-br from-[#688837] to-[#C8A560] text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            <Plus className="w-5 h-5" />
            <span>محادثة جديدة</span>
          </button>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            <h3 className="text-sm font-bold text-[#2D2A26]/60 mb-2 px-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
              المحادثات السابقة
            </h3>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                  conv.id === conversationId
                    ? 'bg-[#688837]/10 border-2 border-[#688837]'
                    : 'bg-[#FFFDF6] border-2 border-[#E1CB98]/30 hover:border-[#E1CB98]'
                }`}
                onClick={() => loadConversation(conv.id)}
              >
                {editingId === conv.id ? (
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-[#E1CB98] rounded"
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                      autoFocus
                    />
                    <button
                      onClick={() => updateConversationTitle(conv.id, editTitle)}
                      className="p-1 hover:bg-[#688837]/10 rounded"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 hover:bg-red-500/10 rounded"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-[#688837] mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#2D2A26] truncate" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          {conv.title || 'محادثة جديدة'}
                        </p>
                        <p className="text-xs text-[#2D2A26]/40 mt-1">
                          {new Date(conv.updated_at).toLocaleDateString('ar-DZ')}
                        </p>
                      </div>
                    </div>
                    <div className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(conv.id);
                          setEditTitle(conv.title || 'محادثة جديدة');
                        }}
                        className="p-1 hover:bg-[#688837]/10 rounded"
                      >
                        <Edit2 className="w-3 h-3 text-[#688837]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('هل تريد حذف هذه المحادثة؟')) {
                            deleteConversation(conv.id);
                          }
                        }}
                        className="p-1 hover:bg-red-500/10 rounded"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className={`flex-1 flex flex-col h-screen ${!showSidebar ? 'ml-64' : ''}`}>
        {/* Header */}
        <div className="p-6 border-b border-[#E1CB98]/30 bg-[#FFFDF6]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-[#2D2A26]" style={{ fontFamily: 'Amiri, serif' }}>
                  مساعد القواعد النحوية
                </h1>
                <p className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  معلمك الذكي لقواعد اللغة العربية
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 rounded-lg hover:bg-[#E1CB98]/20 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-[#688837]" />
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E1CB98]">
                <div className={`w-2 h-2 rounded-full ${
                  ragStatus === 'available' ? 'bg-green-500' :
                  ragStatus === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-xs text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {ragStatus === 'available' ? 'الذكاء الاصطناعي متصل' :
                   ragStatus === 'checking' ? 'جاري الفحص...' : 'الذكاء الاصطناعي غير متصل'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl ${
                message.type === 'user'
                  ? 'bg-[#688837] text-white rounded-[24px_24px_4px_24px]'
                  : 'bg-[#FFFDF6] border-2 border-[#E1CB98] rounded-[24px_24px_24px_4px]'
              } p-6 shadow-lg relative`}>
                {message.type === 'ai' && (
                  <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`whitespace-pre-line ${message.type === 'user' ? 'text-white' : 'text-[#2D2A26]'}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {message.content}
                </div>
                <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-white/70' : 'text-[#2D2A26]/40'}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-2xl bg-[#FFFDF6] border-2 border-[#E1CB98] rounded-[24px_24px_24px_4px] p-6 shadow-lg relative">
                <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center shadow-lg">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="flex items-center gap-2 text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري التفكير...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts & Input */}
        <div className="px-6 py-4 border-t border-[#E1CB98]/30 bg-[#FFFDF6]">
          <div className="flex gap-3 flex-wrap justify-center mb-4">
            {quickPrompts.map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#E1CB98]/30 hover:bg-[#E1CB98]/50 border border-[#E1CB98] text-[#688837] transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{prompt.text}</span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="اكتب سؤالك أو الصق جملة لتحليلها..."
                disabled={isLoading}
                className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-[#E1CB98] focus:border-[#688837] focus:outline-none text-[#2D2A26] placeholder:text-[#2D2A26]/40 disabled:opacity-50"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-4 rounded-2xl bg-[#688837] hover:bg-[#688837]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>

          <p className="text-center text-xs text-[#2D2A26]/40 mt-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
            💡 نصيحة: يمكنك الكتابة بالعربية أو الإنجليزية. الذكاء الاصطناعي يفهم كلاهما!
          </p>
        </div>
      </main>
    </div>
  );
}