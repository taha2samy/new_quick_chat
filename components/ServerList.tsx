
import React from 'react';
import { Server } from '../types';
import { PlusIcon, GeminiIcon } from './icons';

interface ServerListProps {
  servers: Server[];
  activeServerId: string;
  onSelectServer: (id: string) => void;
  onOpenCreateGroupModal: () => void;
}

const ServerIcon: React.FC<{ server: Server; isActive: boolean; onClick: () => void; }> = ({ server, isActive, onClick }) => {
  const activeClasses = 'rounded-2xl bg-primary';
  const inactiveClasses = 'rounded-full bg-surface group-hover:rounded-2xl group-hover:bg-primary';

  return (
    <div className="relative group mb-2">
      <div 
        className={`absolute left-0 w-1 bg-white rounded-r-full transition-all duration-200 ${isActive ? 'h-10' : 'h-2 group-hover:h-5'}`} 
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
      <button 
        onClick={onClick}
        aria-label={server.name}
        className={`w-12 h-12 flex items-center justify-center transition-all duration-300 ease-in-out mx-auto ${isActive ? activeClasses : inactiveClasses}`}
      >
        {server.iconUrl ? (
          <img src={server.iconUrl} alt={server.name} className="w-full h-full object-cover rounded-inherit" />
        ) : (
          <GeminiIcon className="w-7 h-7 text-white" />
        )}
      </button>
    </div>
  );
};

const ActionIcon: React.FC<{ children: React.ReactNode; label: string; onClick: () => void; }> = ({ children, label, onClick }) => (
    <div className="relative group mb-2">
         <button 
            onClick={onClick}
            aria-label={label}
            className="w-12 h-12 flex items-center justify-center transition-all duration-300 ease-in-out mx-auto rounded-full bg-surface group-hover:rounded-2xl group-hover:bg-green-500"
        >
            {children}
        </button>
    </div>
);


const ServerList: React.FC<ServerListProps> = ({ servers, activeServerId, onSelectServer, onOpenCreateGroupModal }) => {
  return (
    <nav className="w-20 bg-background-tertiary p-2 flex-shrink-0 flex flex-col items-center space-y-2 overflow-y-auto">
      {servers.map(server => (
        <ServerIcon 
          key={server.id}
          server={server}
          isActive={server.id === activeServerId}
          onClick={() => onSelectServer(server.id)}
        />
      ))}
      <div className="w-8 h-px bg-surface my-2"></div>
      <ActionIcon label="Add a Server" onClick={onOpenCreateGroupModal}>
        <PlusIcon className="w-6 h-6 text-green-400" />
      </ActionIcon>
    </nav>
  );
};

export default ServerList;
