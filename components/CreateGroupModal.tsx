import React, { useState, useRef, useEffect } from 'react';
import { Server, CreateServerData, CreateChannelData } from '../types';
import { CloseIcon, UploadIcon, PlusIcon, TrashIcon } from './icons';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateServerData) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onSave }) => {
  // Server State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Server['category']>('General');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Channels State
  const [channelsToCreate, setChannelsToCreate] = useState<CreateChannelData[]>([
    { name: 'general', permissions: 'read-write' },
  ]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setName('');
      setCategory('General');
      setDescription('');
      setAvatar(null);
      setChannelsToCreate([{ name: 'general', permissions: 'read-write' }]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddChannel = () => {
    setChannelsToCreate([...channelsToCreate, { name: '', permissions: 'read-write' }]);
  };

  const handleRemoveChannel = (index: number) => {
    if (channelsToCreate.length > 1) { // Prevent removing the last channel
      setChannelsToCreate(channelsToCreate.filter((_, i) => i !== index));
    }
  };

  const handleChannelChange = (index: number, field: keyof CreateChannelData, value: string) => {
    const updatedChannels = [...channelsToCreate];
    const channelName = field === 'name' ? value.toLowerCase().replace(/\s+/g, '-') : value;
    updatedChannels[index] = { ...updatedChannels[index], [field]: channelName };
    setChannelsToCreate(updatedChannels);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || channelsToCreate.some(c => !c.name.trim())) return;
    onSave({
      name,
      category,
      description,
      iconUrl: avatar,
      channels: channelsToCreate,
    });
  };
  
  const isSubmitDisabled = !name.trim() || channelsToCreate.some(c => !c.name.trim());

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-group-title"
    >
      <div
        className="bg-background-secondary w-full max-w-lg rounded-xl shadow-2xl flex flex-col m-4 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 text-center border-b border-black/20 flex-shrink-0">
          <h2 id="create-group-title" className="text-2xl font-bold text-white">Create Your Server</h2>
          <p className="text-on-surface-secondary mt-1">
            Configure your server and create its first channels.
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Close form"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Server Details Section */}
            <h3 className="text-lg font-bold text-white border-b border-black/20 pb-2">Server Details</h3>
            <div className="flex flex-col items-center">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <button
                type="button"
                onClick={handleAvatarClick}
                className="w-24 h-24 rounded-full bg-background-tertiary border-2 border-dashed border-on-surface-tertiary flex items-center justify-center text-on-surface-tertiary hover:border-primary hover:text-primary transition-colors"
              >
                {avatar ? (
                  <img src={avatar} alt="Server preview" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="text-center">
                    <UploadIcon className="w-8 h-8 mx-auto" />
                    <span className="text-xs font-semibold">UPLOAD</span>
                  </div>
                )}
              </button>
            </div>
            <div>
              <label htmlFor="group-name" className="block text-xs font-bold uppercase text-on-surface-tertiary mb-2">Server Name</label>
              <input
                id="group-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-background-tertiary border border-black/20 rounded-md p-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            {/* Additional Server Details */}
            <div>
              <label htmlFor="group-category" className="block text-xs font-bold uppercase text-on-surface-tertiary mb-2">Category</label>
              <select
                id="group-category" value={category} onChange={(e) => setCategory(e.target.value as Server['category'])}
                className="w-full bg-background-tertiary border border-black/20 rounded-md p-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>General</option> <option>Team</option> <option>Project</option> <option>Hobby</option> <option>Other</option>
              </select>
            </div>

            {/* Channels Section */}
            <h3 className="text-lg font-bold text-white border-b border-black/20 pb-2 pt-4">Create Channels</h3>
            <div className="space-y-4">
              {channelsToCreate.map((channel, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <label htmlFor={`channel-name-${index}`} className="sr-only">Channel Name</label>
                    <input
                      id={`channel-name-${index}`}
                      type="text"
                      placeholder="new-channel"
                      value={channel.name}
                      onChange={(e) => handleChannelChange(index, 'name', e.target.value)}
                      className="w-full bg-background-tertiary border border-black/20 rounded-md p-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="w-40">
                    <label htmlFor={`channel-permissions-${index}`} className="sr-only">Permissions</label>
                    <select
                      id={`channel-permissions-${index}`}
                      value={channel.permissions}
                      onChange={(e) => handleChannelChange(index, 'permissions', e.target.value)}
                      className="w-full bg-background-tertiary border border-black/20 rounded-md p-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="read-write">Read & Write</option>
                      <option value="read-only">Read-Only</option>
                    </select>
                  </div>
                  <button type="button" onClick={() => handleRemoveChannel(index)} disabled={channelsToCreate.length <= 1} className="p-2 text-on-surface-tertiary hover:text-error disabled:text-on-surface-tertiary/20 disabled:cursor-not-allowed">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddChannel}
              className="w-full bg-surface/50 hover:bg-surface/80 text-on-surface font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Channel
            </button>
          </div>

          <footer className="bg-background-tertiary p-4 flex justify-end space-x-2 flex-shrink-0">
            <button type="button" onClick={onClose} className="text-on-surface py-2 px-4 rounded-md hover:underline">Cancel</button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed"
            >
              Create Server
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;