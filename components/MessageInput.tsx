import React, { useState } from 'react';
import { SendIcon } from './icons';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  channelName: string;
  disabled: boolean;
  isReadOnly?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, channelName, disabled, isReadOnly }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !disabled) {
      onSendMessage(content);
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isReadOnly ? `You can't send messages in this channel.` : `Message #${channelName}`}
        disabled={disabled}
        rows={1}
        className="w-full bg-surface rounded-lg p-3 pr-12 resize-none text-on-surface placeholder-on-surface-tertiary focus:outline-none focus:ring-2 focus:ring-primary transition-shadow duration-200"
        aria-label={`Message #${channelName}`}
        readOnly={isReadOnly}
      />
      <button
        type="submit"
        disabled={disabled || !content.trim()}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-primary hover:bg-primary/20 disabled:text-on-surface-tertiary disabled:hover:bg-transparent transition-colors duration-200"
        aria-label="Send message"
      >
        <SendIcon className="w-5 h-5" />
      </button>
    </form>
  );
};

export default MessageInput;