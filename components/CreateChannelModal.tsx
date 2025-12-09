import React, { useState, useEffect } from 'react';
import { Channel } from '../types';
import { CloseIcon, DynamicChannelIcon } from './icons';

type CreateChannelData = Pick<Channel, 'name' | 'topic' | 'icon' | 'permissions'>;

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateChannelData) => void;
}

const iconOptions: Channel['icon'][] = ['chat', 'code', 'gaming', 'book'];

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<Channel['icon']>('chat');
  const [permissions, setPermissions] = useState<Channel['permissions']>('read-write');

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setName('');
      setTopic('');
      setSelectedIcon('chat');
      setPermissions('read-write');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim().toLowerCase().replace(/\s+/g, '-'), // Sanitize name
      topic,
      icon: selectedIcon,
      permissions,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-channel-title"
    >
      <div
        className="bg-background-secondary w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6">
          <h2 id="create-channel-title" className="text-xl font-bold text-white">Create Text Channel</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Close form"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="p-6 pt-0 space-y-4">
            <div>
              <label htmlFor="channel-name" className="block text-xs font-bold uppercase text-on-surface-tertiary mb-2">Channel Name</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <DynamicChannelIcon iconName={selectedIcon} className="w-5 h-5 text-on-surface-tertiary"/>
                </div>
                <input
                    id="channel-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="new-channel"
                    className="w-full bg-background-tertiary border border-black/20 rounded-md p-2 pl-10 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    autoFocus
                />
              </div>
            </div>

            <div>
              <label htmlFor="channel-permissions" className="block text-xs font-bold uppercase text-on-surface-tertiary mb-2">Channel Permissions</label>
              <select
                id="channel-permissions"
                value={permissions}
                onChange={(e) => setPermissions(e.target.value as Channel['permissions'])}
                className="w-full bg-background-tertiary border border-black/20 rounded-md p-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="read-write">Read & Write</option>
                <option value="read-only">Read-Only (for Admins)</option>
              </select>
            </div>

            <div>
              <label htmlFor="channel-topic" className="block text-xs font-bold uppercase text-on-surface-tertiary mb-2">Topic (optional)</label>
              <textarea
                id="channel-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={2}
                placeholder="Let everyone know what this channel is about."
                className="w-full bg-background-tertiary border border-black/20 rounded-md p-2 text-on-surface resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
             <div>
              <label className="block text-xs font-bold uppercase text-on-surface-tertiary mb-2">Channel Icon</label>
              <div className="flex space-x-2 bg-background-tertiary p-2 rounded-md">
                {iconOptions.map(icon => (
                    <button
                        type="button"
                        key={icon}
                        onClick={() => setSelectedIcon(icon)}
                        className={`p-2 rounded-md transition-colors ${selectedIcon === icon ? 'bg-primary' : 'bg-surface hover:bg-surface/80'}`}
                        aria-label={`Select ${icon} icon`}
                    >
                       <DynamicChannelIcon iconName={icon} className="w-6 h-6 text-white"/>
                    </button>
                ))}
              </div>
            </div>

          </div>

          <footer className="bg-background-tertiary p-4 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="text-on-surface py-2 px-4 rounded-md hover:underline">Cancel</button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed"
            >
              Create Channel
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CreateChannelModal;