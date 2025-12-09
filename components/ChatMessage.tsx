
import React from 'react';
import { Message } from '../types';
import { GeminiIcon } from './icons';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { author, content, timestamp } = message;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isBot = author.id === 'gemini-bot';

  return (
    <div className="flex items-start p-2 rounded hover:bg-black/10 transition-colors duration-150">
      <div className="w-10 h-10 flex-shrink-0 mr-4 mt-1">
        {isBot ? (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <GeminiIcon className="w-6 h-6 text-white"/>
            </div>
        ) : (
            <img src={author.avatarUrl} alt={author.name} className="w-10 h-10 rounded-full" />
        )}
      </div>
      <div>
        <div className="flex items-baseline">
          <span className={`font-bold mr-2 ${isBot ? 'text-primary' : 'text-green-400'}`}>{author.name}</span>
          <span className="text-xs text-on-surface-tertiary">{formatDate(timestamp)}</span>
        </div>
        <p className="text-on-surface whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
