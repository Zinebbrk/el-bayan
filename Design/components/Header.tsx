import { BookOpen } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b py-6 px-6" style={{ 
      borderColor: '#E5DCC8',
      backgroundColor: '#FAF7F0'
    }}>
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-4" dir="rtl">
        <BookOpen 
          className="w-8 h-8" 
          style={{ color: '#5F7A3A' }}
          strokeWidth={1.5}
        />
        <div className="text-center">
          <h1 
            className="mb-1"
            style={{ 
              color: '#2E2A26',
              fontFamily: 'Amiri, serif',
              fontSize: '2rem',
              fontWeight: '700'
            }}
          >
            البيان – المساعد النحوي الذكي
          </h1>
          <p 
            className="text-sm"
            style={{ 
              color: '#6B6560',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Arabic Grammar Assistant
          </p>
        </div>
      </div>
    </header>
  );
}
