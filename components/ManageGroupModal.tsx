import React, { useState, useEffect, useRef } from 'react';
import { Server, User, Member, ServerRole, UpdateServerData } from '../types';
import { CloseIcon, CrownIcon, TrashIcon, UserPlusIcon, UploadIcon, SettingsIcon } from './icons';

interface ManageGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  server: Server;
  currentUser: User;
  onRemoveMember: (server: Server, member: Member) => void;
  onInviteMember: (serverId: string, username: string, role: ServerRole) => boolean;
  onChangeMemberRole: (serverId: string, memberUserId: string, newRole: ServerRole) => void;
  onUpdateServer: (serverId: string, data: UpdateServerData) => void;
}

type ActiveTab = 'overview' | 'members' | 'invites';

const ManageGroupModal: React.FC<ManageGroupModalProps> = ({ 
    isOpen, 
    onClose, 
    server, 
    currentUser, 
    onRemoveMember,
    onInviteMember,
    onChangeMemberRole,
    onUpdateServer
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  
  // Invite Tab State
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteRole, setInviteRole] = useState<ServerRole>('user');
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Overview Tab State
  const [formState, setFormState] = useState<UpdateServerData>({
    name: server.name,
    iconUrl: server.iconUrl,
    category: server.category,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDirty = JSON.stringify(formState) !== JSON.stringify({
    name: server.name,
    iconUrl: server.iconUrl,
    category: server.category,
  });

  useEffect(() => {
    if (isOpen) {
        // Reset all states when modal opens or server changes
        setActiveTab('overview');
        setFormState({
            name: server.name,
            iconUrl: server.iconUrl,
            category: server.category,
        });
        setInviteUsername('');
        setInviteRole('user');
        setInviteStatus('idle');
    }
  }, [isOpen, server]);


  if (!isOpen) return null;

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteUsername.trim()) return;
    const success = onInviteMember(server.id, inviteUsername.trim(), inviteRole);
    setInviteStatus(success ? 'success' : 'error');
    if (success) {
      setInviteUsername('');
      setInviteRole('user');
    }
    setTimeout(() => setInviteStatus('idle'), 2000); // Reset status after 2 seconds
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState(prev => ({ ...prev, iconUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormChange = (field: keyof UpdateServerData, value: any) => {
    setFormState(prev => ({...prev, [field]: value }));
  };
  
  const handleSaveChanges = () => {
    onUpdateServer(server.id, formState);
  };
  
  const handleResetChanges = () => {
    setFormState({
        name: server.name,
        iconUrl: server.iconUrl,
        category: server.category,
    });
  };

  const isOwner = server.ownerId === currentUser.id;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-group-title"
    >
      <div
        className="bg-background-secondary w-full max-w-4xl h-[90vh] max-h-[700px] rounded-xl shadow-2xl flex flex-col overflow-hidden m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-black/20 flex-shrink-0">
          <h2 id="manage-group-title" className="text-xl font-bold text-white">Manage '{server.name}'</h2>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors" aria-label="Close settings">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex flex-1 min-h-0 relative">
          <nav className="w-56 bg-background-tertiary p-4 flex-shrink-0">
            <h3 className="text-xs font-bold uppercase text-on-surface-tertiary mb-2">Server Settings</h3>
            <ul className="space-y-1">
              <li><button onClick={() => setActiveTab('overview')} className={`w-full text-left p-2 rounded ${activeTab === 'overview' ? 'bg-primary text-white' : 'hover:bg-surface'}`}>Overview</button></li>
              <li><button onClick={() => setActiveTab('members')} className={`w-full text-left p-2 rounded ${activeTab === 'members' ? 'bg-primary text-white' : 'hover:bg-surface'}`}>Members</button></li>
              <li><button onClick={() => setActiveTab('invites')} className={`w-full text-left p-2 rounded ${activeTab === 'invites' ? 'bg-primary text-white' : 'hover:bg-surface'}`}>Invites</button></li>
            </ul>
          </nav>
          
          <main className="flex-1 p-6 overflow-y-auto">
             {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Server Overview</h3>
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <img src={formState.iconUrl || `https://api.dicebear.com/8.x/shapes/svg?seed=${encodeURIComponent(server.name)}`} alt="Server Icon" className="w-24 h-24 rounded-full object-cover"/>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-surface p-2 rounded-full hover:bg-surface/80">
                                <UploadIcon className="w-4 h-4 text-on-surface"/>
                            </button>
                        </div>
                        <p className="text-sm text-on-surface-secondary">Upload a new icon for your server. Recommended size: 256x256.</p>
                    </div>
                    <div>
                        <label htmlFor="server-name" className="block text-xs font-bold uppercase text-on-surface-tertiary mb-2">Server Name</label>
                        <input id="server-name" type="text" value={formState.name} onChange={(e) => handleFormChange('name', e.target.value)} className="w-full bg-background-tertiary border border-black/20 rounded-md p-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"/>
                    </div>
                     <div>
                        <label htmlFor="server-category" className="block text-xs font-bold uppercase text-on-surface-tertiary mb-2">Category</label>
                        <select id="server-category" value={formState.category} onChange={(e) => handleFormChange('category', e.target.value as Server['category'])} className="w-full bg-background-tertiary border border-black/20 rounded-md p-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary">
                            <option>General</option><option>Team</option><option>Project</option><option>Hobby</option><option>Other</option>
                        </select>
                    </div>
                </div>
              </div>
            )}
            {activeTab === 'members' && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Members ({server.members.length})</h3>
                <div className="space-y-2">
                  {server.members.map(member => (
                    <div key={member.user.id} className="flex items-center justify-between p-2 rounded hover:bg-surface/50">
                      <div className="flex items-center">
                        <img src={member.user.avatarUrl} alt={member.user.name} className="w-8 h-8 rounded-full mr-3" />
                        <div>
                          <p className="font-semibold text-on-surface flex items-center">
                            {member.user.name}
                            {member.user.id === server.ownerId && <CrownIcon className="w-4 h-4 ml-2 text-yellow-400" />}
                          </p>
                          <p className="text-xs text-on-surface-tertiary capitalize">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isOwner && member.user.id !== currentUser.id && (
                          <select 
                            value={member.role}
                            onChange={(e) => onChangeMemberRole(server.id, member.user.id, e.target.value as ServerRole)}
                            className="bg-background-tertiary text-sm rounded p-1 border border-transparent hover:border-surface focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                        {isOwner && member.user.id !== currentUser.id && (
                          <button 
                            onClick={() => onRemoveMember(server, member)}
                            className="p-2 rounded-full text-on-surface-tertiary hover:bg-error/20 hover:text-error" 
                            aria-label={`Remove ${member.user.name}`}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'invites' && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Invite Members</h3>
                 <p className="text-sm text-on-surface-secondary mb-4">
                  Invite someone to the server by entering their username. (This is a mock feature and only works for predefined mock users: Alice, Bob, Charlie, Diana).
                </p>
                <form onSubmit={handleInviteSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="invite-username" className="block text-xs font-bold uppercase text-on-surface-tertiary mb-2">Username</label>
                        <input id="invite-username" type="text" value={inviteUsername} onChange={(e) => setInviteUsername(e.target.value)} placeholder="Enter a username" className="w-full bg-background-tertiary border border-black/20 rounded-md p-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                     <div>
                        <label htmlFor="invite-role" className="block text-xs font-bold uppercase text-on-surface-tertiary mb-2">Role</label>
                        <select id="invite-role" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as ServerRole)} className="w-full bg-background-tertiary border border-black/20 rounded-md p-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="user">User</option><option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center">
                        <UserPlusIcon className="w-5 h-5 mr-2" />
                        Send Invite
                    </button>
                </form>
                {inviteStatus === 'success' && <p className="text-sm text-green-400 mt-2">User successfully invited!</p>}
                {inviteStatus === 'error' && <p className="text-sm text-error mt-2">User not found or is already a member.</p>}
              </div>
            )}
          </main>
        </div>
        
        {isDirty && activeTab === 'overview' && (
            <div className="absolute bottom-0 left-0 right-0 bg-background-tertiary/90 p-4 backdrop-blur-sm flex justify-between items-center transition-transform duration-300">
                <p className="text-sm text-on-surface-secondary">Careful — you have unsaved changes!</p>
                <div>
                    <button onClick={handleResetChanges} className="text-on-surface py-2 px-4 rounded-md hover:underline">Reset</button>
                    <button onClick={handleSaveChanges} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">Save Changes</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ManageGroupModal;