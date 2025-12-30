import { useState } from 'react';
import { Mic } from 'lucide-react';

interface InputAreaProps {
  onSend: (content: string) => void;
}

export function InputArea({ onSend }: InputAreaProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="sticky bottom-0 pt-4 pb-6 px-4" style={{ backgroundColor: '#FAF7F0' }}>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div 
          className="flex items-end gap-3 px-4 py-3 rounded-2xl"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E5DCC8',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
          }}
          dir="rtl"
        >
          <button
            type="button"
            className="p-2 rounded-lg opacity-40 cursor-not-allowed"
            disabled
            style={{
              backgroundColor: '#F5F1E8'
            }}
          >
            <Mic className="w-5 h-5" style={{ color: '#6B6560' }} />
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="مثال: ما الفرق بين الحال والتمييز؟"
            className="flex-1 bg-transparent outline-none resize-none"
            rows={1}
            dir="rtl"
            style={{
              fontFamily: 'Amiri, serif',
              fontSize: '1.0625rem',
              color: '#2E2A26',
              lineHeight: '1.6'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl transition-colors"
            style={{
              backgroundColor: input.trim() ? '#5F7A3A' : '#B8C5A3',
              color: '#FFFFFF',
              fontFamily: 'Amiri, serif',
              fontSize: '1rem',
              fontWeight: '600'
            }}
            disabled={!input.trim()}
          >
            حلّل السؤال
          </button>
        </div>
      </form>
    </div>
  );
}
