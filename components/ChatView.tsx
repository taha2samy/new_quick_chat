import React, { useEffect, useRef } from 'react';
import { Channel, Message, User, ServerRole } from '../types';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import { DynamicChannelIcon, MenuIcon } from './icons';

interface ChatViewProps {
  channel: Channel | undefined;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  botUser: User;
  onOpenSidebar: () => void;
  currentUser: User;
  currentUserRole: ServerRole | undefined;
}

const TypingIndicator: React.FC<{ botUser: User }> = ({ botUser }) => (
    <div className="flex items-center px-4 mb-2 text-sm text-on-surface-secondary">
        {/* Placeholder for bot avatar, using a simple div if no URL */}
        <div className="w-6 h-6 rounded-full mr-2 bg-primary flex items-center justify-center text-xs font-bold text-white">G</div>
        <span>{botUser.name} is typing...</span>
        <div className="flex items-end ml-1">
            <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1 h-1 bg-current rounded-full ml-1 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1 h-1 bg-current rounded-full ml-1 animate-bounce"></span>
        </div>
    </div>
);


const ChatView: React.FC<ChatViewProps> = ({ channel, messages, onSendMessage, isLoading, botUser, onOpenSidebar, currentUser, currentUserRole }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (!channel) {
    return (
        <div className="flex-1 bg-background-primary flex flex-col items-center justify-center text-center p-4">
            <div className="md:hidden">
                 <button onClick={onOpenSidebar} className="absolute top-4 left-4 text-on-surface-secondary p-2">
                    <MenuIcon className="w-6 h-6"/>
                </button>
            </div>
            <h3 className="text-2xl font-bold text-white">No text channels</h3>
            <p className="text-on-surface-tertiary mt-2">You find yourself in a strange place. You don't have access to any text channels, or they don't exist in this server.</p>
        </div>
    );
  }

  const isReadOnlyForUser = channel.permissions === 'read-only' && currentUserRole !== 'admin';


  return (
    <main className="flex-1 bg-background-primary flex flex-col min-w-0">
      {/* Channel Header */}
      <header className="h-12 px-4 shadow-md flex items-center border-b border-black/20 flex-shrink-0">
        <button className="md:hidden mr-4 text-on-surface-secondary" onClick={onOpenSidebar} aria-label="Open navigation">
            <MenuIcon className="w-6 h-6"/>
        </button>
        <DynamicChannelIcon iconName={channel.icon} className="w-6 h-6 text-on-surface-tertiary mr-2" />
        <div className="flex-1 truncate">
            <h2 className="font-bold text-white truncate">{channel.name}</h2>
            {channel.topic && <p className="text-xs text-on-surface-tertiary truncate">{channel.topic}</p>}
        </div>
      </header>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {isLoading && <TypingIndicator botUser={botUser} />}

      {/* Message Input */}
      <div className="p-4 pt-0">
        <MessageInput 
            onSendMessage={onSendMessage} 
            channelName={channel.name} 
            disabled={isLoading || isReadOnlyForUser}
            isReadOnly={isReadOnlyForUser}
        />
      </div>
    </main>
  );
};

export default ChatView;