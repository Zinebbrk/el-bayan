interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end" dir="rtl">
      <div 
        className="max-w-2xl px-6 py-4 rounded-2xl"
        style={{
          backgroundColor: 'transparent',
          border: '1.5px solid #C2A24D',
          color: '#2E2A26',
          fontFamily: 'Amiri, serif',
          fontSize: '1.125rem',
          lineHeight: '1.8'
        }}
      >
        {content}
      </div>
    </div>
  );
}
