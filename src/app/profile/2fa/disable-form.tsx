'use client';

import { useActionState } from 'react';
import { useState, useEffect } from 'react';
import { disable2FA } from './actions';

interface DisableFormProps {
  onDisableComplete: () => void;
}

export function Disable2FAForm({ onDisableComplete }: DisableFormProps) {
  const [state, formAction] = useActionState(disable2FA, { success: false, message: '' });
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (state.success) {
      onDisableComplete();
    }
  }, [state.success, onDisableComplete]);

  if (!showConfirmation) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Disable Two-Factor Authentication</h2>
        
        <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="text-yellow-400 text-xl">⚠️</div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-100 mb-2">Security Warning</h3>
              <p className="text-yellow-200 text-sm mb-4">
                Disabling two-factor authentication will make your account less secure. You will only need your password to log in.
              </p>
              <div className="space-y-2 text-sm text-yellow-200">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <span>Your account will be more vulnerable to unauthorized access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <span>You can re-enable 2FA at any time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <span>Consider using a strong, unique password</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setShowConfirmation(true)}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800"
          >
            I Understand, Disable 2FA
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Confirm Disable 2FA</h2>
      
      <p className="text-gray-400 mb-6">
        To disable two-factor authentication, please enter your password and a verification code from your authenticator app.
      </p>

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Current Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-300 mb-2">
            Verification Code
          </label>
          <input
            id="token"
            name="token"
            type="text"
            required
            maxLength={6}
            pattern="[0-9]{6}"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center text-lg font-mono"
            placeholder="000000"
          />
          <p className="mt-1 text-xs text-gray-400">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setShowConfirmation(false)}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800"
          >
            Disable 2FA
          </button>
        </div>

        {state.message && (
          <div className={`p-3 rounded-md text-sm ${
            state.success 
              ? 'bg-green-900 text-green-300 border border-green-700' 
              : 'bg-red-900 text-red-300 border border-red-700'
          }`}>
            {state.message}
          </div>
        )}
      </form>
    </div>
  );
}