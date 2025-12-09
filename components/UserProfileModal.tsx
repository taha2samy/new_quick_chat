
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { CloseIcon, PencilIcon } from './icons';

interface UserProfileModalProps {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, user, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedRole, setEditedRole] = useState(user.role || '');
  const [editedAvatar, setEditedAvatar] = useState(user.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens or user changes
      setEditedName(user.name);
      setEditedRole(user.role || '');
      setEditedAvatar(user.avatarUrl);
      setIsEditing(false);
    }
  }, [isOpen, user]);

  if (!isOpen) {
    return null;
  }
  
  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    onSave({
      ...user,
      name: editedName,
      role: editedRole,
      avatarUrl: editedAvatar
    });
  };
  
  const handleCancel = () => {
    // Revert changes and exit edit mode
    setEditedName(user.name);
    setEditedRole(user.role || '');
    setEditedAvatar(user.avatarUrl);
    setIsEditing(false);
  };


  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div 
        className="bg-background-secondary w-full max-w-lg rounded-xl shadow-2xl flex flex-col overflow-hidden m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
            <div className="h-24 bg-primary"></div>
            <div className="absolute top-12 left-6">
                <div className={`relative w-24 h-24 rounded-full border-4 border-background-secondary group ${isEditing ? 'cursor-pointer' : ''}`}
                    onClick={handleAvatarClick}
                >
                    <img 
                        src={editedAvatar} 
                        alt={editedName}
                        className="w-full h-full object-cover rounded-full"
                    />
                    {isEditing && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold uppercase">Change</span>
                        </div>
                    )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
             <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                aria-label="Close profile"
            >
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>

        <div className="p-6 pt-16">
            {!isEditing ? (
                 <>
                    <div className="flex items-baseline justify-between">
                         <div>
                            <h2 id="profile-modal-title" className="text-2xl font-bold text-white">{user.name}</h2>
                            {user.role && <p className="text-on-surface-secondary">{user.role}</p>}
                        </div>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-surface hover:bg-surface/80 text-on-surface font-bold py-2 px-4 rounded-md flex items-center transition-colors"
                            aria-label="Edit profile"
                        >
                           <PencilIcon className="w-4 h-4 mr-2" /> Edit Profile
                        </button>
                    </div>
                    <div className="w-full h-px bg-black/20 my-4"></div>
                     <h3 className="text-xs font-bold uppercase text-on-surface-tertiary mb-2">Member Since</h3>
                     <p className="text-on-surface">Just now (mocked)</p>
                 </>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-xs font-bold uppercase text-on-surface-tertiary mb-2">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full bg-background-tertiary border border-black/20 rounded-md p-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                     <div>
                        <label htmlFor="role" className="block text-xs font-bold uppercase text-on-surface-tertiary mb-2">Role</label>
                        <input
                            id="role"
                            type="text"
                            value={editedRole}
                            onChange={(e) => setEditedRole(e.target.value)}
                            placeholder="e.g. Frontend Developer"
                            className="w-full bg-background-tertiary border border-black/20 rounded-md p-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            )}
        </div>
        
        {isEditing && (
            <footer className="bg-background-tertiary p-4 flex justify-end space-x-2">
                <button onClick={handleCancel} className="text-on-surface py-2 px-4 rounded-md hover:underline">Cancel</button>
                <button 
                    onClick={handleSave} 
                    className="bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                    Save Changes
                </button>
            </footer>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;
