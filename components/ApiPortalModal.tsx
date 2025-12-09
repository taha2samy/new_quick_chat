import React from 'react';
import { CloseIcon } from './icons';

interface ApiPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-background-tertiary text-sm text-on-surface-secondary rounded-lg p-4 my-2 overflow-x-auto">
        <code>
            {children}
        </code>
    </pre>
);

const DetailSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <details className="bg-surface/30 rounded-lg mb-4 open:shadow-lg" open>
        <summary className="font-bold text-lg text-white p-4 cursor-pointer hover:bg-surface/50 rounded-t-lg">{title}</summary>
        <div className="p-4 border-t border-black/20">
            {children}
        </div>
    </details>
);

const Endpoint: React.FC<{ method: 'GET'|'POST'|'PATCH'|'DELETE', path: string, description: React.ReactNode }> = ({ method, path, description }) => {
    const methodColor = {
        'GET': 'text-green-400',
        'POST': 'text-blue-400',
        'PATCH': 'text-yellow-400',
        'DELETE': 'text-red-400',
    }[method];

    return (
        <div className="mb-2">
            <div className="flex items-baseline">
                <span className={`font-bold text-md w-16 text-right mr-3 ${methodColor}`}>{method}</span>
                <span className="font-mono text-md text-white">{path}</span>
            </div>
            <div className="ml-[80px] text-sm text-on-surface-secondary">{description}</div>
        </div>
    );
};


const ApiPortalModal: React.FC<ApiPortalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const errorFormat = `{
  "error": {
    "code": "UNIQUE_ERROR_CODE",
    "message": "A human-readable error message."
  }
}`;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-portal-title"
    >
      <div
        className="bg-background-secondary w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-black/20 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 id="api-portal-title" className="text-2xl font-bold text-white">API Portal for Gemini Chat</h2>
            <p className="text-on-surface-secondary mt-1">
                A comprehensive backend specification for building the chat application.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Close API Portal"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto">
            <DetailSection title="1. General Information">
                <h4 className="font-bold text-white mb-2">Authentication</h4>
                <p className="mb-2">The API is protected using JSON Web Tokens (JWT). The token must be included in the <code className="bg-background-tertiary px-1 rounded">Authorization</code> header for all protected endpoints.</p>
                <CodeBlock>Authorization: Bearer &lt;JWT_TOKEN&gt;</CodeBlock>
                
                <h4 className="font-bold text-white mb-2 mt-4">Standard Error Response</h4>
                <p className="mb-2">All API errors should consistently return a JSON object with the following structure:</p>
                <CodeBlock>{errorFormat}</CodeBlock>
            </DetailSection>

            <DetailSection title="2. Data Models">
                <p className="mb-4">These are the core TypeScript interfaces representing the data structures the API will handle.</p>
                <CodeBlock>
{`// User Object
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role?: string;
}

// Server Object
export interface Server {
  id: string;
  name: string;
  iconUrl: string;
  category?: 'Team' | 'Project' | 'Hobby' | 'General' | 'Other';
  description?: string;
}

// Channel Object
export interface Channel {
  id: string;
  name: string;
  serverId: string;
  icon?: string;
  topic?: string;
}

// Message Object
export interface Message {
  id: string;
  content: string;
  timestamp: string; // ISO 8601 string
  author: User; // Embedded author object
  channelId: string;
}`}
                </CodeBlock>
            </DetailSection>
            
            <DetailSection title="3. REST API Endpoints">
                <h4 className="font-bold text-white text-lg mb-2 mt-4">Authentication</h4>
                <Endpoint method="POST" path="/api/auth/login" description="Authenticates with username & password." />
                 <p className="text-sm font-semibold text-on-surface-secondary ml-[80px]">Success (200 OK): Returns JWT and User object.</p>
                 <p className="text-sm font-semibold text-on-surface-secondary ml-[80px]">Error (401 Unauthorized): Invalid credentials.</p>

                <Endpoint method="POST" path="/api/auth/guest" description="Logs in as a guest with a username." />
                 <p className="text-sm font-semibold text-on-surface-secondary ml-[80px]">Success (200 OK): Returns JWT and User object.</p>

                <Endpoint method="POST" path="/api/auth/logout" description="Logs out user, invalidates token." />
                 <p className="text-sm font-semibold text-on-surface-secondary ml-[80px]">Success (204 No Content): Successfully logged out.</p>

                <h4 className="font-bold text-white text-lg mb-2 mt-6">Users</h4>
                <Endpoint method="GET" path="/api/users/me" description="Gets the profile of the current user." />
                 <p className="text-sm font-semibold text-on-surface-secondary ml-[80px]">Success (200 OK): Returns the full User object.</p>
                <Endpoint method="PATCH" path="/api/users/me" description="Updates the current user's profile." />
                 <p className="text-sm font-semibold text-on-surface-secondary ml-[80px]">Success (200 OK): Returns the updated User object.</p>
                 <p className="text-sm font-semibold text-on-surface-secondary ml-[80px]">Error (400 Bad Request): Invalid input data.</p>


                <h4 className="font-bold text-white text-lg mb-2 mt-6">Servers & Channels</h4>
                <Endpoint method="GET" path="/api/servers" description="Gets a list of servers the user is in." />
                <Endpoint method="POST" path="/api/servers" description="Creates a new server." />
                <Endpoint method="GET" path="/api/servers/:serverId/channels" description="Gets channels for a specific server." />
                <Endpoint method="POST" path="/api/servers/:serverId/channels" description="Creates a new channel in a server." />
                 <p className="text-sm font-semibold text-on-surface-secondary ml-[80px]">Error (404 Not Found): If `serverId` does not exist.</p>
                 <p className="text-sm font-semibold text-on-surface-secondary ml-[80px]">Error (403 Forbidden): If user is not a member of the server.</p>


                <h4 className="font-bold text-white text-lg mb-2 mt-6">Messages</h4>
                <Endpoint method="GET" path="/api/channels/:channelId/messages" description={<>Gets message history for a channel. Supports pagination via query params: <code className="bg-background-tertiary px-1 rounded">?limit=50&cursor=MSG_ID</code></>} />
            </DetailSection>

            <DetailSection title="4. Real-time API (WebSockets)">
                <p className="mb-4">Client connects to <code className="bg-background-tertiary px-1 rounded">ws://your-domain/ws?token=JWT_TOKEN</code> for live events.</p>
                
                <h4 className="font-bold text-white mb-2 mt-6">Client-to-Server Events</h4>
                <CodeBlock>
{`// User sends a new message
{
  "event": "SEND_MESSAGE",
  "payload": {
    "channelId": "channel-3",
    "content": "Hello from the frontend!"
  }
}

// User starts typing in a channel
{
  "event": "START_TYPING",
  "payload": {
    "channelId": "channel-3"
  }
}`}
                </CodeBlock>

                 <h4 className="font-bold text-white mb-2 mt-6">Server-to-Client Events</h4>
                <CodeBlock>
{`// Broadcast a new message to all clients in a channel
{
  "event": "NEW_MESSAGE",
  "payload": {
    // A full Message object, see Data Models
  }
}

// Notify clients that a new channel has been created
{
  "event": "CHANNEL_CREATED",
  "payload": {
    // A full Channel object
  }
}

// Notify clients who is typing in a channel
{
  "event": "USER_TYPING",
  "payload": {
    "channelId": "channel-3",
    "user": { "id": "user-1", "name": "John Doe" }
  }
}

// Send an error message to a specific client
{
  "event": "ERROR",
  "payload": {
    // Standard error object
    "code": "INVALID_MESSAGE",
    "message": "Message content cannot be empty."
  }
}`}
                </CodeBlock>
            </DetailSection>
        </div>
      </div>
    </div>
  );
};

export default ApiPortalModal;