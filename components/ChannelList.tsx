
import React, { useState, useRef, useEffect } from 'react';
import { Server, Channel, User } from '../types';
import { DynamicChannelIcon, SettingsIcon, PlusIcon, ApiIcon, LogoutIcon, ChevronDownIcon, CloseIcon } from './icons';

interface ChannelListProps {
  server: Server;
  channels: Channel[];
  activeChannelId: string;
  onSelectChannel: (id: string) => void;
  currentUser: User;
  onOpenProfile: () => void;
  onOpenCreateChannelModal: () => void;
  onOpenApiPortal: () => void;
  onLogout: () => void;
  onOpenManageGroupModal: () => void;
}

const ServerMenu: React.FC<{ serverName: string, onManageGroup: () => void, onClose: () => void }> = ({ serverName, onManageGroup, onClose }) => (
    <div 
        className="absolute top-14 left-2 w-56 bg-background-tertiary rounded-md shadow-lg z-10 text-sm text-on-surface p-1.5"
        role="menu"
    >
        <button 
            onClick={() => { onManageGroup(); onClose(); }}
            className="w-full text-left px-2 py-1.5 rounded hover:bg-primary hover:text-white flex justify-between items-center"
            role="menuitem"
        >
            Server Settings <SettingsIcon className="w-4 h-4" />
        </button>
    </div>
);


const ChannelList: React.FC<ChannelListProps> = ({ 
    server, 
    channels, 
    activeChannelId, 
    onSelectChannel, 
    currentUser, 
    onOpenProfile, 
    onOpenCreateChannelModal, 
    onOpenApiPortal, 
    onLogout,
    onOpenManageGroupModal
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-60 bg-background-secondary flex flex-col flex-shrink-0">
      {/* Server Name Header */}
      <header className="p-4 shadow-md h-12 flex items-center relative" ref={menuRef}>
        <button 
            className="flex items-center justify-between w-full hover:bg-white/5 p-2 rounded -ml-2"
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
        >
            <h1 className="font-bold text-white text-lg truncate">{server?.name}</h1>
            {isMenuOpen ? <CloseIcon className="w-4 h-4 text-on-surface-tertiary" /> : <ChevronDownIcon className="w-4 h-4 text-on-surface-tertiary" />}
        </button>
        {isMenuOpen && server && <ServerMenu serverName={server.name} onManageGroup={onOpenManageGroupModal} onClose={() => setIsMenuOpen(false)} />}
      </header>

      {/* Channel List */}
      <div className="flex-grow p-2 overflow-y-auto">
        <div className="flex items-center justify-between px-2 mb-2">
            <h2 className="text-xs font-bold uppercase text-on-surface-tertiary">Text Channels</h2>
            <button 
                onClick={onOpenCreateChannelModal}
                className="text-on-surface-tertiary hover:text-white"
                aria-label="Create Channel"
            >
                <PlusIcon className="w-4 h-4" />
            </button>
        </div>
        <ul>
          {channels.map(channel => (
            <li key={channel.id}>
              <button 
                onClick={() => onSelectChannel(channel.id)}
                className={`flex items-center w-full p-2 rounded group transition-colors duration-150 ${
                  channel.id === activeChannelId 
                  ? 'bg-surface text-white' 
                  // eslint-disable-next-line indent
                  : 'text-on-surface-tertiary hover:bg-surface/50 hover:text-on-surface'
                }`}
              >
                <DynamicChannelIcon 
                    iconName={channel.icon} 
                    className={`w-5 h-5 mr-2 ${
                        channel.id === activeChannelId ? 'text-on-surface' : 'text-on-surface-tertiary'
                    }`}
                />
                <span className="font-medium truncate">{channel.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* User Panel */}
      <footer className="h-14 bg-surface/30 p-2 flex items-center">
         <div className="flex items-center min-w-0 flex-1">
           <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full mr-2" />
           <div className="text-left min-w-0">
             <p className="font-bold text-sm text-white truncate">{currentUser.name}</p>
              {currentUser.role && <p className="text-xs text-on-surface-tertiary truncate">{currentUser.role}</p>}
           </div>
         </div>
         <div className="flex items-center space-x-1 text-on-surface-secondary">
             <button onClick={onOpenApiPortal} className="p-2 rounded-full hover:bg-white/10" aria-label="Open API Portal">
                 <ApiIcon className="w-5 h-5"/>
             </button>
             <button onClick={onOpenProfile} className="p-2 rounded-full hover:bg-white/10" aria-label="Open user profile">
                 <SettingsIcon className="w-5 h-5"/>
             </button>
              <button onClick={onLogout} className="p-2 rounded-full hover:bg-error/20 text-on-surface-secondary hover:text-error transition-colors" aria-label="Log out">
                 <LogoutIcon className="w-5 h-5"/>
             </button>
         </div>
      </footer>
    </div>
  );
};

export default ChannelList;
