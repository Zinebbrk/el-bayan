import { BookMarked } from 'lucide-react';

interface SourcesPanelProps {
  sources: string[];
}

export function SourcesPanel({ sources }: SourcesPanelProps) {
  return (
    <div>
      <h3 
        className="mb-3 flex items-center gap-2 justify-end"
        style={{
          fontFamily: 'Amiri, serif',
          fontSize: '0.9375rem',
          color: '#5F7A3A',
          fontWeight: '700'
        }}
        dir="rtl"
      >
        <span>المصادر المعتمدة</span>
        <BookMarked className="w-4 h-4" style={{ color: '#C2A24D' }} />
      </h3>
      <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
        {sources.map((source, index) => (
          <div
            key={index}
            className="px-4 py-2 rounded-full"
            style={{
              backgroundColor: '#FFFBF5',
              border: '1px solid #C2A24D',
              fontFamily: 'Amiri, serif',
              fontSize: '0.875rem',
              color: '#5F7A3A'
            }}
          >
            {source}
          </div>
        ))}
      </div>
    </div>
  );
}
