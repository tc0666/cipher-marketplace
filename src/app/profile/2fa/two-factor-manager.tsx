'use client';

import { useState, useEffect } from 'react';
import { Setup2FAForm } from './setup-form';
import { Disable2FAForm } from './disable-form';
import { UserProfile } from '../actions';

interface TwoFactorManagerProps {
  userProfile: UserProfile;
}

export function TwoFactorManager({ userProfile }: TwoFactorManagerProps) {
  const [is2FAEnabled, setIs2FAEnabled] = useState(userProfile.two_factor_enabled);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetupComplete = () => {
    setIs2FAEnabled(true);
    setIsLoading(false);
  };

  const handleDisableComplete = () => {
    setIs2FAEnabled(false);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-gray-300">Processing...</span>
        </div>
      </div>
    );
  }

  if (!is2FAEnabled) {
    return (
      <div className="space-y-6">
        {/* 2FA Status - Disabled */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">Two-Factor Authentication</h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-900 text-red-300 border border-red-700">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
              Disabled
            </span>
          </div>
          
          <p className="text-gray-400 mb-6">
            Two-factor authentication adds an extra layer of security to your account. When enabled, you'll need both your password and a verification code from your authenticator app to log in.
          </p>

          <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-blue-400 text-xl">🔒</div>
              <div>
                <h3 className="text-lg font-semibold text-blue-100 mb-2">Enhanced Security</h3>
                <div className="space-y-2 text-sm text-blue-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span>Protects against password theft and phishing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span>Works with Google Authenticator, Authy, and other TOTP apps</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span>Backup codes provided for account recovery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Form */}
        <Setup2FAForm onSetupComplete={handleSetupComplete} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 2FA Status - Enabled */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-100">Two-Factor Authentication</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300 border border-green-700">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            Enabled
          </span>
        </div>
        
        <p className="text-gray-400 mb-6">
          Two-factor authentication is currently enabled on your account. Your account is protected with an additional layer of security.
        </p>

        <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="text-green-400 text-xl">✅</div>
            <div>
              <h3 className="text-lg font-semibold text-green-100 mb-2">Account Protected</h3>
              <div className="space-y-2 text-sm text-green-200">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Login requires both password and authenticator code</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Account is protected against unauthorized access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Backup codes available for emergency access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-100 mb-3">Management Options</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center space-x-3">
              <span className="text-blue-400">📱</span>
              <span>Use your authenticator app to generate verification codes</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-yellow-400">🔑</span>
              <span>Keep your backup codes in a safe place</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-red-400">⚠️</span>
              <span>You can disable 2FA below if needed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disable Form */}
      <Disable2FAForm onDisableComplete={handleDisableComplete} />
    </div>
  );
}