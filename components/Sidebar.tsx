
import React from 'react';
import ServerList from './ServerList';
import ChannelList from './ChannelList';
import { Server, Channel, User } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  servers: Server[];
  activeServerId: string;
  onSelectServer: (id: string) => void;
  onOpenCreateGroupModal: () => void;
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

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, ...props }) => {

  const handleSelectChannel = (id: string) => {
    props.onSelectChannel(id);
    onClose(); // Close sidebar on mobile after channel selection
  };

  return (
    <>
        {/* Mobile Sidebar */}
        <div className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
            <div className="relative flex h-full w-[calc(20rem+80px)] max-w-full">
                <ServerList 
                    servers={props.servers}
                    activeServerId={props.activeServerId}
                    onSelectServer={props.onSelectServer}
                    onOpenCreateGroupModal={props.onOpenCreateGroupModal}
                />
                <ChannelList 
                    server={props.server}
                    channels={props.channels}
                    activeChannelId={props.activeChannelId}
                    onSelectChannel={handleSelectChannel} // Use wrapped handler
                    currentUser={props.currentUser}
                    onOpenProfile={props.onOpenProfile}
                    onOpenCreateChannelModal={props.onOpenCreateChannelModal}
                    onOpenApiPortal={props.onOpenApiPortal}
                    onLogout={props.onLogout}
                    onOpenManageGroupModal={props.onOpenManageGroupModal}
                />
            </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-shrink-0">
             <ServerList 
                servers={props.servers}
                activeServerId={props.activeServerId}
                onSelectServer={props.onSelectServer}
                onOpenCreateGroupModal={props.onOpenCreateGroupModal}
            />
            <ChannelList 
                server={props.server}
                channels={props.channels}
                activeChannelId={props.activeChannelId}
                onSelectChannel={props.onSelectChannel} // Use direct handler
                currentUser={props.currentUser}
                onOpenProfile={props.onOpenProfile}
                onOpenCreateChannelModal={props.onOpenCreateChannelModal}
                onOpenApiPortal={props.onOpenApiPortal}
                onLogout={props.onLogout}
                onOpenManageGroupModal={props.onOpenManageGroupModal}
            />
        </div>
    </>
  );
};

export default Sidebar;
