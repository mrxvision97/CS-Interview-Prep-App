import { Message } from '../types';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex gap-4 p-6 ${
        isUser ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
      } animate-fadeIn`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-purple-500'
            : 'bg-gradient-to-br from-green-500 to-teal-500'
        }`}
      >
        {isUser ? (
          <User size={20} className="text-white" />
        ) : (
          <Bot size={20} className="text-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {isUser ? 'You' : 'AI Coach'}
        </div>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
}

