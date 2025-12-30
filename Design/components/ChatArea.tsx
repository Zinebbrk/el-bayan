import { Message } from '../App';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';

interface ChatAreaProps {
  messages: Message[];
}

export function ChatArea({ messages }: ChatAreaProps) {
  return (
    <div className="flex-1 overflow-y-auto mb-8 space-y-6 px-4">
      {messages.map((message) => (
        message.type === 'user' ? (
          <UserMessage key={message.id} content={message.content} />
        ) : (
          <AssistantMessage 
            key={message.id} 
            sections={message.sections}
            sources={message.sources}
          />
        )
      ))}
    </div>
  );
}
