import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { User, Server, Channel, Message, CreateServerData, Member, ServerRole, UpdateServerData } from './types';
import { sendMessage } from './services/geminiService';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import LoginPage from './components/LoginPage';
import UserProfileModal from './components/UserProfileModal';
import CreateGroupModal from './components/CreateGroupModal';
import CreateChannelModal from './components/CreateChannelModal';
import ApiPortalModal from './components/ApiPortalModal';
import ConfirmationModal, { ConfirmationModalProps } from './components/ConfirmationModal';
import ManageGroupModal from './components/ManageGroupModal';

// --- MOCKED DATA ---
// TODO: Replace this with data fetched from your backend API.
const botUser: User = {
  id: 'gemini-bot',
  name: 'Gemini',
  avatarUrl: '', // Will use GeminiIcon component
  role: 'AI Assistant',
};

const allMockUsers: User[] = [
    { id: 'user-2', name: 'Alice', avatarUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=Alice', role: 'Backend Developer' },
    { id: 'user-3', name: 'Bob', avatarUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=Bob', role: 'UI/UX Designer' },
    { id: 'user-4', name: 'Charlie', avatarUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=Charlie', role: 'Project Manager' },
    { id: 'user-5', name: 'Diana', avatarUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=Diana', role: 'QA Engineer' },
];


const createInitialData = (currentUser: User) => {
    const initialServers: Server[] = [
      { id: 'server-1', name: 'Gemini General', iconUrl: '', ownerId: currentUser.id, members: [
          { user: currentUser, role: 'admin' },
          { user: allMockUsers[0], role: 'user' },
          { user: allMockUsers[1], role: 'user' }
      ], category: 'General' },
      { id: 'server-2', name: 'Project Discussions', iconUrl: 'https://api.dicebear.com/8.x/shapes/svg?seed=Projects', ownerId: allMockUsers[2].id, members: [
          { user: currentUser, role: 'admin' },
          { user: allMockUsers[2], role: 'admin' },
          { user: allMockUsers[3], role: 'user' }
      ], category: 'Project' },
      { id: 'server-3', name: 'Random Chats', iconUrl: 'https://api.dicebear.com/8.x/shapes/svg?seed=Random', ownerId: currentUser.id, members: [
          { user: currentUser, role: 'admin' }
      ], category: 'Hobby' },
    ];

    const initialChannels: Channel[] = [
        { id: 'channel-1', name: 'welcome', serverId: 'server-1', icon: 'chat', topic: "Say hello and introduce yourself!", permissions: 'read-write' },
        { id: 'channel-2', name: 'general-chat', serverId: 'server-1', icon: 'chat', permissions: 'read-write' },
        { id: 'channel-3', name: 'frontend-dev', serverId: 'server-2', icon: 'code', topic: "All about React, CSS, and modern web dev.", permissions: 'read-write' },
        { id: 'channel-4', name: 'backend-dev', serverId: 'server-2', icon: 'code', permissions: 'read-write' },
        { id: 'channel-5', name: 'memes', serverId: 'server-3', icon: 'gaming', topic: "Only the dankest memes allowed.", permissions: 'read-write' },
        { id: 'channel-6', name: 'announcements', serverId: 'server-1', topic: "Important announcements from the admin team.", permissions: 'read-only' },
    ];
    
    return { initialServers, initialChannels };
};
// --- END MOCKED DATA ---


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeServerId, setActiveServerId] = useState<string>('');
  const [activeChannelId, setActiveChannelId] = useState<string>('');
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Modal States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const [isApiPortalModalOpen, setIsApiPortalModalOpen] = useState(false);
  const [isManageGroupModalOpen, setIsManageGroupModalOpen] = useState(false);
  const [confirmationModalProps, setConfirmationModalProps] = useState<Omit<ConfirmationModalProps, 'isOpen' | 'onClose'> | null>(null);
  
  // Responsive State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const activeServer = useMemo(() => servers.find(s => s.id === activeServerId), [activeServerId, servers]);
  const serverChannels = useMemo(() => channels.filter(c => c.serverId === activeServerId), [activeServerId, channels]);
  const currentUserRole = useMemo(() => activeServer?.members.find(m => m.user.id === currentUser?.id)?.role, [activeServer, currentUser]);

  useEffect(() => {
    if (currentUser && servers.length > 0) {
        // When switching servers, select the first channel of that server
        if (activeServer && serverChannels.length > 0) {
          const isCurrentChannelInServer = serverChannels.some(c => c.id === activeChannelId);
          if (!isCurrentChannelInServer) {
            setActiveChannelId(serverChannels[0].id);
          }
        } else if (activeServer && serverChannels.length === 0) {
          // Handle case where a server might not have channels yet
          setActiveChannelId(''); 
        }
    }
  }, [activeServerId, serverChannels, activeChannelId, activeServer, currentUser, servers]);


  const handleLogin = (username: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: username,
      avatarUrl: `https://api.dicebear.com/8.x/bottts/svg?seed=${encodeURIComponent(username)}`,
      role: 'Team Member',
    };
    const { initialServers, initialChannels } = createInitialData(newUser);
    
    setServers(initialServers);
    setChannels(initialChannels);
    setActiveServerId(initialServers[0].id);
    setActiveChannelId(initialChannels[0].id);
    setMessages({
     [initialChannels[0].id]: [{
        id: 'msg-0',
        content: `Welcome to Gemini Chat! This is the #welcome channel. Feel free to ask me anything.`,
        timestamp: new Date().toISOString(),
        author: botUser,
      }]
    });
    setCurrentUser(newUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setConfirmationModalProps(null); // Close the modal after action
    setServers([]);
    setChannels([]);
    setActiveServerId('');
    setActiveChannelId('');
  };

  const promptLogout = () => {
    setConfirmationModalProps({
        title: "Log Out",
        message: "Are you sure you want to log out?",
        confirmText: "Log Out",
        onConfirm: handleLogout,
        confirmButtonClass: "bg-error hover:bg-red-700"
    });
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setIsProfileModalOpen(false); // Close modal on save
  };

  const handleCreateServer = (serverData: CreateServerData) => {
    if (!currentUser) return;
    const { channels: channelsToCreate, ...newServerDetails } = serverData;
    
    const newServer: Server = {
      ...newServerDetails,
      id: `server-${Date.now()}`,
      iconUrl: serverData.iconUrl || `https://api.dicebear.com/8.x/shapes/svg?seed=${encodeURIComponent(serverData.name)}`,
      ownerId: currentUser.id,
      members: [{ user: currentUser, role: 'admin' }],
    };

    const newChannels: Channel[] = channelsToCreate.map((ch, index) => ({
      id: `channel-${Date.now() + index}`,
      name: ch.name,
      permissions: ch.permissions,
      serverId: newServer.id,
      icon: 'chat' // Default icon for now
    }));

    setServers(prev => [...prev, newServer]);
    setChannels(prev => [...prev, ...newChannels]);
    
    // Automatically switch to the new server and its first channel
    setActiveServerId(newServer.id);
    setActiveChannelId(newChannels[0].id);
    setIsCreateGroupModalOpen(false);
  };

  const handleUpdateServer = (serverId: string, data: UpdateServerData) => {
    setServers(prevServers => prevServers.map(s => 
        s.id === serverId ? { ...s, ...data } : s
    ));
  };

  const handleCreateChannel = (channelData: Pick<Channel, 'name' | 'topic' | 'icon' | 'permissions'>) => {
    const newChannel: Channel = {
      ...channelData,
      id: `channel-${Date.now()}`,
      serverId: activeServerId,
    };
    setChannels(prev => [...prev, newChannel]);
    setActiveChannelId(newChannel.id); // Switch to the new channel
    setIsCreateChannelModalOpen(false);
  };

  const handleRemoveMember = (serverId: string, memberUserId: string) => {
    setServers(prevServers => prevServers.map(s => {
      if (s.id === serverId) {
        return { ...s, members: s.members.filter(m => m.user.id !== memberUserId) };
      }
      return s;
    }));
    setConfirmationModalProps(null); // Close confirmation modal
  };

  const promptRemoveMember = (server: Server, member: Member) => {
    setConfirmationModalProps({
      title: `Remove ${member.user.name}`,
      message: `Are you sure you want to remove ${member.user.name} from ${server.name}? They will no longer have access to this server.`,
      confirmText: "Remove Member",
      onConfirm: () => handleRemoveMember(server.id, member.user.id),
      confirmButtonClass: "bg-error hover:bg-red-700"
    });
  };

  const handleInviteMember = (serverId: string, username: string, role: ServerRole): boolean => {
    const userToInvite = allMockUsers.find(u => u.name.toLowerCase() === username.toLowerCase());

    if (!userToInvite) {
      console.warn(`User "${username}" not found.`);
      return false;
    }

    let success = false;
    setServers(prevServers => prevServers.map(s => {
      if (s.id === serverId) {
        if (s.members.some(m => m.user.id === userToInvite.id)) {
          console.warn(`User "${username}" is already a member.`);
          return s;
        }
        const newMember: Member = { user: userToInvite, role };
        success = true;
        return { ...s, members: [...s.members, newMember] };
      }
      return s;
    }));
    return success;
  };

  const handleChangeMemberRole = (serverId: string, memberUserId: string, newRole: ServerRole) => {
    setServers(prevServers => prevServers.map(s => {
      if (s.id === serverId) {
        return {
          ...s,
          members: s.members.map(m => 
            m.user.id === memberUserId ? { ...m, role: newRole } : m
          )
        };
      }
      return s;
    }));
  };


  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !currentUser) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      timestamp: new Date().toISOString(),
      author: currentUser,
    };
    
    // Optimistically update UI
    const currentChannelMessages = messages[activeChannelId] ?? [];
    setMessages(prev => ({
      ...prev,
      [activeChannelId]: [...currentChannelMessages, userMessage],
    }));
    setIsLoading(true);

    try {
      // TODO: Replace with WebSocket message sending to a real backend.
      const history = (messages[activeChannelId] ?? []).map(msg => ({
        role: msg.author.id === currentUser.id ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      const botResponse = await sendMessage(content, history.slice(0, -1), activeChannelId);

      const botMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: botResponse,
        timestamp: new Date().toISOString(),
        author: botUser,
      };

      setMessages(prev => ({
        ...prev,
        [activeChannelId]: [...(prev[activeChannelId] || []), botMessage],
      }));

    } catch (err) {
      console.error("Failed to get response from Gemini", err);
       const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: "Sorry, I couldn't process that. Please check your API key and try again.",
        timestamp: new Date().toISOString(),
        author: botUser,
      };
       setMessages(prev => ({
        ...prev,
        [activeChannelId]: [...(prev[activeChannelId] || []), errorMessage],
      }));
    } finally {
      setIsLoading(false);
    }

  }, [activeChannelId, messages, currentUser]);
  
  const activeChannel = useMemo(() => channels.find(c => c.id === activeChannelId), [activeChannelId, channels]);
  const activeMessages = useMemo(() => messages[activeChannelId] ?? [], [messages, activeChannelId]);

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  if (!activeServer) {
    // This can happen briefly on logout before redirect.
    return <div className="h-screen w-screen bg-background-primary"></div>;
  }

  return (
    <>
      <div className="h-screen w-screen font-sans text-on-surface bg-background-primary overflow-hidden md:flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          servers={servers}
          activeServerId={activeServerId}
          onSelectServer={setActiveServerId}
          onOpenCreateGroupModal={() => setIsCreateGroupModalOpen(true)}
          server={activeServer}
          channels={serverChannels}
          activeChannelId={activeChannelId}
          onSelectChannel={setActiveChannelId}
          currentUser={currentUser}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenCreateChannelModal={() => setIsCreateChannelModalOpen(true)}
          onOpenApiPortal={() => setIsApiPortalModalOpen(true)}
          onLogout={promptLogout}
          onOpenManageGroupModal={() => setIsManageGroupModalOpen(true)}
        />
        <ChatView
          channel={activeChannel}
          messages={activeMessages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          botUser={botUser}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          currentUser={currentUser}
          currentUserRole={currentUserRole}
        />
      </div>
      {currentUser && (
         <UserProfileModal
            isOpen={isProfileModalOpen}
            user={currentUser}
            onClose={() => setIsProfileModalOpen(false)}
            onSave={handleUpdateUser}
        />
      )}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onSave={handleCreateServer}
      />
      <CreateChannelModal 
        isOpen={isCreateChannelModalOpen}
        onClose={() => setIsCreateChannelModalOpen(false)}
        onSave={handleCreateChannel}
      />
       <ManageGroupModal
        isOpen={isManageGroupModalOpen}
        onClose={() => setIsManageGroupModalOpen(false)}
        server={activeServer}
        currentUser={currentUser}
        onRemoveMember={promptRemoveMember}
        onInviteMember={handleInviteMember}
        onChangeMemberRole={handleChangeMemberRole}
        onUpdateServer={handleUpdateServer}
      />
      <ApiPortalModal 
        isOpen={isApiPortalModalOpen}
        onClose={() => setIsApiPortalModalOpen(false)}
      />
      <ConfirmationModal
        isOpen={!!confirmationModalProps}
        onClose={() => setConfirmationModalProps(null)}
        {...confirmationModalProps}
      />
    </>
  );
};

export default App;