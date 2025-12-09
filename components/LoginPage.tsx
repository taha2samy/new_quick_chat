
import React, { useState } from 'react';
import { GeminiIcon } from './icons';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

type LoginMode = 'login' | 'guest';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<LoginMode>('login');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // In a real app, you'd validate the password for 'login' mode.
      // Here, we proceed if the username is present.
      setIsLoading(true);
      setTimeout(() => {
        onLogin(username.trim());
      }, 500);
    }
  };
  
  const isSubmitDisabled = isLoading || !username.trim() || (mode === 'login' && !password.trim());

  return (
    <div className="w-full h-full flex items-center justify-center bg-background-primary">
      <div className="w-full max-w-md bg-background-secondary p-8 rounded-lg shadow-2xl m-4">
        <div className="text-center mb-8">
            <GeminiIcon className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to Gemini Chat</h1>
            <p className="text-on-surface-secondary">Join the conversation.</p>
        </div>
        
        <div className="flex border-b border-black/20 mb-6">
            <button 
                onClick={() => setMode('login')}
                className={`flex-1 py-2 text-sm font-bold transition-colors duration-200 ${mode === 'login' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-tertiary hover:text-on-surface'}`}
                aria-pressed={mode === 'login'}
            >
                LOG IN
            </button>
            <button 
                onClick={() => setMode('guest')}
                className={`flex-1 py-2 text-sm font-bold transition-colors duration-200 ${mode === 'guest' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-tertiary hover:text-on-surface'}`}
                aria-pressed={mode === 'guest'}
            >
                GUEST
            </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
             <div className="text-left">
                <label htmlFor="username" className="block text-xs font-bold uppercase text-on-surface-tertiary mb-2">
                 Username
               </label>
               <input
                 id="username"
                 type="text"
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 placeholder="Enter your username"
                 className="w-full bg-background-tertiary border border-black/20 rounded-md p-3 text-on-surface placeholder-on-surface-tertiary focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                 required
                 autoFocus
               />
             </div>
             
             {mode === 'login' && (
                <div className="text-left">
                    <label htmlFor="password"
                           className="block text-xs font-bold uppercase text-on-surface-tertiary mb-2">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-background-tertiary border border-black/20 rounded-md p-3 text-on-surface placeholder-on-surface-tertiary focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                        required={mode === 'login'}
                    />
                </div>
             )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full bg-primary text-white font-bold py-3 rounded-md mt-8 hover:bg-primary-focus transition-all duration-200 disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                 {mode === 'login' ? 'Logging In...' : 'Joining...'}
                </>
            ) : (
                mode === 'login' ? 'Log In' : 'Continue as Guest'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
