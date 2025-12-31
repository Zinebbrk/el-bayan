import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Icons as SVG components
const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5F7A3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

// Markdown parser for assistant messages
const MarkdownRenderer = ({ content }) => {
  const parseMarkdown = (text) => {
    if (!text) return [];
    
    const lines = text.split('\n');
    const elements = [];
    let listItems = [];
    let inCodeBlock = false;
    let codeContent = [];
    
    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={'list-' + elements.length} className="examples-list">
            {listItems.map((item, idx) => (
              <li key={idx} className="example-item">
                <span className="bullet">•</span>
                {parseInline(item)}
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };
    
    const parseInline = (text) => {
      const parts = [];
      let key = 0;
      
      const boldRegex = /\*\*(.+?)\*\*/g;
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.slice(lastIndex, match.index));
        }
        parts.push(
          <strong key={key++} className="text-bold">
            {match[1]}
          </strong>
        );
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }
      
      return parts.length > 0 ? parts : text;
    };
    
    lines.forEach((line, idx) => {
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={'code-' + idx} className="code-block">
              <code>{codeContent.join('\n')}</code>
            </pre>
          );
          codeContent = [];
          inCodeBlock = false;
        } else {
          flushList();
          inCodeBlock = true;
        }
        return;
      }
      
      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }
      
      if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h4 key={idx} className="section-header">{parseInline(line.substring(4))}</h4>
        );
        return;
      }
      
      if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h3 key={idx} className="section-header">{parseInline(line.substring(3))}</h3>
        );
        return;
      }
      
      if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <h2 key={idx} className="section-header main">{parseInline(line.substring(2))}</h2>
        );
        return;
      }
      
      if (line.startsWith('**') && line.endsWith('**') && line.indexOf('**', 2) === line.length - 2) {
        flushList();
        const text = line.slice(2, -2);
        elements.push(
          <h4 key={idx} className="section-header">{text}</h4>
        );
        return;
      }
      
      if (line.trim().startsWith('• ') || line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().substring(2);
        listItems.push(itemText);
        return;
      }
      
      const numberedMatch = line.trim().match(/^(\d+)\.\s+(.+)/);
      if (numberedMatch) {
        flushList();
        elements.push(
          <div key={idx} className="numbered-item">
            <span className="number">{numberedMatch[1]}.</span>
            <span>{parseInline(numberedMatch[2])}</span>
          </div>
        );
        return;
      }
      
      if (line.trim()) {
        flushList();
        elements.push(
          <p key={idx} className="paragraph">{parseInline(line)}</p>
        );
      } else if (elements.length > 0) {
        flushList();
        elements.push(<div key={idx} className="spacer" />);
      }
    });
    
    flushList();
    return elements;
  };
  
  return <div className="markdown-content">{parseMarkdown(content)}</div>;
};

// Header component
const Header = ({ connected, health }) => (
  <header className="header">
    <div className="header-content">
      <BookOpenIcon />
      <div className="header-text">
        <h1 className="header-title">البيان – المساعد النحوي الذكي</h1>
        <p className="header-subtitle">Arabic Grammar Assistant</p>
      </div>
      <div className="connection-status">
        {!connected ? (
          <span className="status-badge error">غير متصل</span>
        ) : health.indexed ? (
          <span className="status-badge success">متصل • {health.num_documents} وثيقة</span>
        ) : (
          <span className="status-badge warning">غير مفهرس</span>
        )}
      </div>
    </div>
  </header>
);

// User message component
const UserMessage = ({ content }) => (
  <div className="message-row user">
    <div className="message-label user-label">أنت</div>
    <div className="user-message">
      {content}
    </div>
  </div>
);

// Assistant message component
const AssistantMessage = ({ content, isStreaming, error }) => (
  <div className="message-row assistant">
    <div className="message-label assistant-label">البيان</div>
    <div className={'assistant-message ' + (error ? 'error' : '')}>
      <MarkdownRenderer content={content} />
      {isStreaming && <span className="streaming-cursor">▊</span>}
    </div>
  </div>
);

// Input area component
const InputArea = ({ input, setInput, onSend, disabled, isStreaming }) => {
  const textareaRef = useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled && !isStreaming) {
      onSend();
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <div className="input-area">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="مثال: ما الفرق بين الحال والتمييز؟"
            disabled={disabled || isStreaming}
            rows={1}
            dir="rtl"
            className="input-textarea"
          />
          <button
            type="submit"
            disabled={!input.trim() || disabled || isStreaming}
            className="send-button"
          >
            {isStreaming ? 'جارٍ...' : 'حلّل السؤال'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Welcome screen component
const WelcomeScreen = ({ onExampleClick, connected }) => (
  <div className="welcome-screen">
    <div className="welcome-icon">
      <BookOpenIcon />
    </div>
    <h2 className="welcome-title">مرحباً بك في البيان</h2>
    <p className="welcome-subtitle">اسأل أي سؤال عن قواعد اللغة العربية، النحو، والصرف</p>
    
    <div className="example-questions">
      <p className="examples-label">أمثلة على الأسئلة:</p>
      <div className="examples-grid">
        <button onClick={() => onExampleClick('ما هو الإعراب؟')} className="example-button">
          ما هو الإعراب؟
        </button>
        <button onClick={() => onExampleClick('ما الفرق بين الفعل المعتل والصحيح؟')} className="example-button">
          ما الفرق بين الفعل المعتل والصحيح؟
        </button>
        <button onClick={() => onExampleClick('كيف نعرب الأسماء الخمسة؟')} className="example-button">
          كيف نعرب الأسماء الخمسة؟
        </button>
        <button onClick={() => onExampleClick('ما إعراب كلمة "العلم" في جملة: "العلم نور"؟')} className="example-button">
          ما إعراب "العلم" في "العلم نور"؟
        </button>
      </div>
    </div>
    
    {!connected && (
      <div className="connection-warning">
        <p>⚠️ غير متصل بالخادم</p>
        <code>./start_backend_only.sh</code>
      </div>
    )}
  </div>
);

// Main App component
function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [health, setHealth] = useState({ indexed: false, num_documents: 0 });
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkHealth = async () => {
    try {
      const response = await axios.get(API_URL + '/health', { timeout: 5000 });
      setHealth(response.data);
      setConnected(true);
    } catch (error) {
      console.error('Backend connection failed:', error.message);
      setConnected(false);
      setHealth({ indexed: false, num_documents: 0 });
    }
  };

  const streamResponse = useCallback(async (question) => {
    setIsStreaming(true);
    const messageId = Date.now();
    
    setMessages(prev => [...prev, {
      id: messageId,
      role: 'assistant',
      content: '',
      isStreaming: true
    }]);

    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

    try {
      const response = await fetch(API_URL + '/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                // Error message - ALWAYS replace content entirely, never concatenate
                setMessages(prev => prev.map(msg =>
                  msg.id === messageId
                    ? { 
                        ...msg, 
                        content: parsed.error, 
                        error: true 
                      }
                    : msg
                ));
              } else if (parsed.content) {
                setMessages(prev => prev.map(msg =>
                  msg.id === messageId
                    ? { ...msg, content: msg.content + parsed.content }
                    : msg
                ));
              }
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      let errorMessage = 'حدث خطأ في معالجة السؤال. يرجى المحاولة مرة أخرى.';
      
      if (error.name === 'AbortError') {
        errorMessage = 'انتهت مهلة الاستجابة. يرجى المحاولة مرة أخرى.';
      }
      
      // Replace any existing content with error message (don't concatenate)
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content: errorMessage, error: true }
          : msg
      ));
    } finally {
      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, isStreaming: false } : msg
      ));
      setIsStreaming(false);
    }
  }, []);

  const handleSend = () => {
    if (!input.trim() || isStreaming || !connected) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    // Small delay to ensure unique IDs
    setTimeout(() => streamResponse(currentInput), 1);
  };

  const handleExampleClick = (question) => {
    if (isStreaming || !connected) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: question,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Stream response with small delay to ensure unique IDs
    setTimeout(() => streamResponse(question), 1);
  };

  return (
    <div className="app">
      <Header connected={connected} health={health} />
      
      <main className="main-content">
        <div className="chat-area">
          {messages.length === 0 ? (
            <WelcomeScreen 
              onExampleClick={handleExampleClick} 
              connected={connected}
            />
          ) : (
            <div className="messages-container">
              {messages.map((msg) => (
                msg.role === 'user' ? (
                  <UserMessage key={msg.id} content={msg.content} />
                ) : (
                  <AssistantMessage 
                    key={msg.id} 
                    content={msg.content}
                    isStreaming={msg.isStreaming}
                    error={msg.error}
                  />
                )
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <InputArea 
          input={input}
          setInput={setInput}
          onSend={handleSend}
          disabled={!connected || !health.indexed}
          isStreaming={isStreaming}
        />
      </main>
    </div>
  );
}

export default App;
