export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role?: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  author: User;
}

export type ServerRole = 'admin' | 'user';

export interface Member {
    user: User;
    role: ServerRole;
}

export interface Channel {
  id: string;
  name: string;
  serverId: string;
  icon?: 'chat' | 'code' | 'gaming' | 'book' | string; // Allow for custom strings too
  topic?: string;
  permissions: 'read-write' | 'read-only';
}

export interface Server {
  id: string;
  name: string;
  iconUrl: string;
  category?: 'Team' | 'Project' | 'Hobby' | 'General' | 'Other';
  description?: string;
  ownerId: string;
  members: Member[];
}


// Type for the data submitted from the CreateGroupModal
export interface CreateChannelData {
    name: string;
    permissions: 'read-write' | 'read-only';
}
export interface CreateServerData extends Omit<Server, 'id' | 'iconUrl' | 'ownerId' | 'members'> {
    iconUrl: string | null;
    channels: CreateChannelData[];
}

export type UpdateServerData = Partial<Pick<Server, 'name' | 'iconUrl' | 'category'>>;