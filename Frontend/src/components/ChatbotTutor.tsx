import { useState } from 'react';
import { Send, Sparkles, HelpCircle, BookOpen, FileText, Pen } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Page } from '../App';
import { Button } from './ui/button';

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

export function ChatbotTutor({ onNavigate, onLogout }: ChatbotTutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: 'السلام عليكم! I\'m your Arabic Grammar Assistant. Ask me anything about grammar rules, sentence correction, or iʿrāb analysis.',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickPrompts = [
    { icon: HelpCircle, text: 'Explain this rule', prompt: 'Can you explain the rule for...' },
    { icon: Pen, text: 'Correct my sentence', prompt: 'Please correct this sentence:' },
    { icon: FileText, text: 'Give me exercises', prompt: 'Give me practice exercises for...' },
    { icon: BookOpen, text: 'Show iʿrāb breakdown', prompt: 'Show me the iʿrāb analysis of...' },
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);

    setInputMessage('');
  };

  const generateAIResponse = (userInput: string): string => {
    if (userInput.toLowerCase().includes('correct') || userInput.includes('صحح')) {
      return `Let me help you with that sentence. Here's the corrected version:\n\n**Original:** ${userInput}\n\n**Corrected:** الطالبُ يدرسُ الدرسَ\n\n**Explanation:**\n- الطالبُ (the student) - Subject (مبتدأ) in nominative case, marked with dammah\n- يدرسُ (studies) - Present tense verb in nominative\n- الدرسَ (the lesson) - Direct object (مفعول به) in accusative case, marked with fatha\n\nWould you like me to explain any specific part in more detail?`;
    } else if (userInput.toLowerCase().includes('iʿrāb') || userInput.includes('إعراب')) {
      return `Here's the iʿrāb analysis:\n\n**الطالبُ يكتبُ الدرسَ**\n\n🔹 **الطالبُ** - مبتدأ مرفوع وعلامة رفعه الضمة الظاهرة\n   (Subject in nominative case, marked with dammah)\n\n🔹 **يكتبُ** - فعل مضارع مرفوع وعلامة رفعه الضمة\n   (Present tense verb in nominative)\n\n🔹 **الدرسَ** - مفعول به منصوب وعلامة نصبه الفتحة\n   (Direct object in accusative case, marked with fatha)\n\nDo you have questions about any of these elements?`;
    } else if (userInput.toLowerCase().includes('exercise') || userInput.includes('تمرين')) {
      return `Great! Here are some practice exercises:\n\n**Exercise 1:** Fill in the correct harakah\n- المعلم_ يشرح_ الدرس_\n\n**Exercise 2:** Identify the grammatical function\nWhat is the iʿrāb of "الكتابَ" in: قرأَ الطالبُ الكتابَ\n\n**Exercise 3:** Correct the sentence\n- الطالب يدرس الدرس في المكتبة\n\nWould you like me to provide the answers or explain the approach?`;
    } else {
      return `That's a great question! In Arabic grammar:\n\nThe key concept here relates to **iʿrāb** (grammatical case marking). Arabic nouns and verbs change their endings based on their grammatical function in a sentence.\n\nFor example:\n- **Nominative case (مرفوع)** - marked with dammah (ُ)\n- **Accusative case (منصوب)** - marked with fatha (َ)\n- **Genitive case (مجرور)** - marked with kasra (ِ)\n\nWould you like me to provide specific examples or practice exercises on this topic?`;
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="flex min-h-screen bg-[#FFFDF6]">
      <Sidebar currentPage="chatbot" onNavigate={onNavigate} onLogout={onLogout} />
      
      <main className="flex-1 ml-64 flex flex-col h-screen">
        {/* Header */}
        <div className="p-6 border-b border-[#E1CB98]/30 bg-[#FFFDF6]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 
                className="text-2xl text-[#2D2A26]"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Grammar Assistant
              </h1>
              <p className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Your AI-powered Arabic grammar tutor
              </p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="chat-bg-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <text x="20" y="50" style={{ fontFamily: 'Amiri, serif', fontSize: '60px' }} fill="#688837">✍</text>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#chat-bg-pattern)" />
            </svg>
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl ${
                  message.type === 'user'
                    ? 'bg-[#688837] text-white rounded-[24px_24px_4px_24px]'
                    : 'bg-[#FFFDF6] border-2 border-[#E1CB98] rounded-[24px_24px_24px_4px]'
                } p-6 shadow-lg relative`}
              >
                {message.type === 'ai' && (
                  <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div 
                  className={`whitespace-pre-line ${message.type === 'user' ? 'text-white' : 'text-[#2D2A26]'}`}
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  {message.content}
                </div>
                
                <div 
                  className={`text-xs mt-2 ${message.type === 'user' ? 'text-white/70' : 'text-[#2D2A26]/40'}`}
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="px-6 py-4 border-t border-[#E1CB98]/30 bg-[#FFFDF6]">
          <div className="flex gap-3 flex-wrap justify-center mb-4">
            {quickPrompts.map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#E1CB98]/30 hover:bg-[#E1CB98]/50 border border-[#E1CB98] text-[#688837] transition-all duration-200 hover:scale-105"
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{prompt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="flex gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question or paste a sentence to analyze..."
                className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-[#E1CB98] focus:border-[#688837] focus:outline-none text-[#2D2A26] placeholder:text-[#2D2A26]/40"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="px-6 py-4 rounded-2xl bg-[#688837] hover:bg-[#688837]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          {/* Helper Text */}
          <p className="text-center text-xs text-[#2D2A26]/40 mt-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
            💡 Tip: You can type in Arabic or English. The AI understands both!
          </p>
        </div>
      </main>
    </div>
  );
}
