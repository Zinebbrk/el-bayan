import { SourcesPanel } from './SourcesPanel';

interface AssistantMessageProps {
  sections?: {
    shortAnswer?: string;
    analysis?: string;
    examples?: string[];
  };
  sources?: string[];
}

export function AssistantMessage({ sections, sources }: AssistantMessageProps) {
  return (
    <div className="flex justify-start" dir="rtl">
      <div 
        className="max-w-3xl px-8 py-6 rounded-2xl"
        style={{
          backgroundColor: '#F5F1E8',
          color: '#2E2A26',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
        }}
      >
        {sections?.shortAnswer && (
          <div className="mb-6">
            <h3 
              className="mb-3"
              style={{
                fontFamily: 'Amiri, serif',
                fontSize: '1rem',
                color: '#5F7A3A',
                fontWeight: '700'
              }}
            >
              الجواب المختصر
            </h3>
            <p
              style={{
                fontFamily: 'Amiri, serif',
                fontSize: '1.125rem',
                lineHeight: '1.9',
                color: '#2E2A26'
              }}
            >
              {sections.shortAnswer}
            </p>
          </div>
        )}

        {sections?.analysis && (
          <>
            <div 
              className="my-6"
              style={{
                height: '1px',
                backgroundColor: '#E5DCC8'
              }}
            />
            <div className="mb-6">
              <h3 
                className="mb-3"
                style={{
                  fontFamily: 'Amiri, serif',
                  fontSize: '1rem',
                  color: '#5F7A3A',
                  fontWeight: '700'
                }}
              >
                التحليل النحوي
              </h3>
              <p
                style={{
                  fontFamily: 'Amiri, serif',
                  fontSize: '1.125rem',
                  lineHeight: '1.9',
                  color: '#2E2A26'
                }}
              >
                {sections.analysis}
              </p>
            </div>
          </>
        )}

        {sections?.examples && sections.examples.length > 0 && (
          <>
            <div 
              className="my-6"
              style={{
                height: '1px',
                backgroundColor: '#E5DCC8'
              }}
            />
            <div className="mb-6">
              <h3 
                className="mb-3"
                style={{
                  fontFamily: 'Amiri, serif',
                  fontSize: '1rem',
                  color: '#5F7A3A',
                  fontWeight: '700'
                }}
              >
                أمثلة
              </h3>
              <ul className="space-y-2">
                {sections.examples.map((example, index) => (
                  <li 
                    key={index}
                    className="pr-4"
                    style={{
                      fontFamily: 'Amiri, serif',
                      fontSize: '1.0625rem',
                      lineHeight: '1.8',
                      color: '#4A443F',
                      position: 'relative'
                    }}
                  >
                    <span 
                      style={{
                        position: 'absolute',
                        right: '0',
                        color: '#C2A24D'
                      }}
                    >
                      •
                    </span>
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {sources && sources.length > 0 && (
          <>
            <div 
              className="my-6"
              style={{
                height: '1px',
                backgroundColor: '#E5DCC8'
              }}
            />
            <SourcesPanel sources={sources} />
          </>
        )}
      </div>
    </div>
  );
}
