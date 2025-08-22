'use client';

import { useFormState } from 'react-dom';
import { useState, useEffect } from 'react';
import { loginUser } from './actions';

export default function LoginPage() {
  const [state, formAction] = useFormState(loginUser, { success: false, message: '' });
  const [requires2FA, setRequires2FA] = useState(false);
  const [savedUsername, setSavedUsername] = useState('');

  useEffect(() => {
    if (state.requires2FA) {
      setRequires2FA(true);
      setSavedUsername(state.username || '');
    }
  }, [state]);

  return (
    <>
      <h1 className="text-3xl font-light text-center text-white tracking-wide">
        {requires2FA ? 'Two-Factor Authentication' : 'Sign in to your account'}
      </h1>
      
      {requires2FA && (
        <div className="bg-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="text-blue-400 text-2xl">🔒</div>
            <div>
              <p className="text-blue-200/80 text-sm font-light leading-relaxed">
                Please enter the 6-digit verification code from your authenticator app.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form action={formAction} className="space-y-8">
        <div>
          <label htmlFor="username" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            defaultValue={savedUsername}
            readOnly={requires2FA}
            className={`w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light ${requires2FA ? 'opacity-75' : ''}`}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            readOnly={requires2FA}
            className={`w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light ${requires2FA ? 'opacity-75' : ''}`}
          />
        </div>
        
        {requires2FA && (
          <div>
            <label htmlFor="token" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
              Verification Code
            </label>
            <input
              id="token"
              name="token"
              type="text"
              required
              maxLength={6}
              pattern="[0-9]{6}"
              className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 text-center text-lg font-mono"
              placeholder="000000"
              autoComplete="off"
            />
            <p className="mt-3 text-xs text-gray-400 font-light">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>
        )}
        
        <div>
          <button
            type="submit"
            className="w-full px-6 py-3 text-sm font-light text-white bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-sm border border-green-500/30 hover:from-green-500/80 hover:to-emerald-500/80 hover:border-green-400/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 tracking-wide shadow-lg shadow-green-500/20"
          >
            {requires2FA ? 'Verify & Sign in' : 'Sign in'}
          </button>
        </div>
        
        {requires2FA && (
          <div>
            <button
              type="button"
              onClick={() => {
                setRequires2FA(false);
                setSavedUsername('');
              }}
              className="w-full px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Back to Login
            </button>
          </div>
        )}
        
        {state.message && (
          <p className={`text-sm text-center ${state.success ? 'text-green-500' : 'text-red-500'}`}>
            {state.message}
          </p>
        )}
      </form>
    </>
  );
}

