import { useState } from 'react';
import { ChatArea } from './components/ChatArea';
import { InputArea } from './components/InputArea';
import { Header } from './components/Header';

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  sections?: {
    shortAnswer?: string;
    analysis?: string;
    examples?: string[];
  };
  sources?: string[];
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'user',
      content: 'ما إعراب كلمة "العلم" في جملة: "العلم نور"؟'
    },
    {
      id: '2',
      type: 'assistant',
      content: '',
      sections: {
        shortAnswer: 'كلمة "العلم" مبتدأ مرفوع وعلامة رفعه الضمة الظاهرة على آخره.',
        analysis: 'هذه الجملة جملة اسمية تتكون من مبتدأ وخبر. "العلم" هو المبتدأ المرفوع، و"نور" خبر المبتدأ مرفوع أيضاً. الجملة الاسمية تبدأ باسم، ويكون المبتدأ فيها مرفوعاً دائماً، والخبر كذلك مرفوع.',
        examples: [
          'الصدق منجاة - الصدق: مبتدأ مرفوع',
          'الكتاب مفيد - الكتاب: مبتدأ مرفوع',
          'المعلم حاضر - المعلم: مبتدأ مرفوع'
        ]
      },
      sources: ['سيبويه - الكتاب', 'ابن هشام - شرح قطر الندى', 'الجرجاني - المقتصد']
    }
  ]);

  const handleSendMessage = (content: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content
    };

    setMessages(prev => [...prev, newUserMessage]);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '',
        sections: {
          shortAnswer: 'جارٍ تحليل السؤال...',
          analysis: 'سيتم توفير التحليل النحوي الكامل بناءً على المصادر المعتمدة.',
          examples: []
        },
        sources: ['القرآن الكريم', 'سيبويه - الكتاب']
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF7F0' }}>
      <Header />
      <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-6 py-8">
        <ChatArea messages={messages} />
        <InputArea onSend={handleSendMessage} />
      </main>
    </div>
  );
}
