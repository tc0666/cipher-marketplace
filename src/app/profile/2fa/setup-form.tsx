'use client';

import { useFormState } from 'react-dom';
import { useState, useEffect } from 'react';
import { generate2FASetup, enable2FA } from './actions';
import Image from 'next/image';

interface SetupFormProps {
  onSetupComplete: () => void;
}

export function Setup2FAForm({ onSetupComplete }: SetupFormProps) {
  const [setupData, setSetupData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'generate' | 'verify'>('generate');
  const [state, formAction] = useFormState(enable2FA, { success: false, message: '' });
  const [showManualEntry, setShowManualEntry] = useState(false);

  const handleGenerateSetup = async () => {
    setLoading(true);
    try {
      const result = await generate2FASetup();
      if (result.success) {
        setSetupData(result);
        setStep('verify');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to generate 2FA setup');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state.success) {
      onSetupComplete();
    }
  }, [state.success, onSetupComplete]);

  if (step === 'generate') {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Enable Two-Factor Authentication</h2>
        <p className="text-gray-400 mb-6">
          Two-factor authentication adds an extra layer of security to your account by requiring a verification code from your authenticator app.
        </p>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              1
            </div>
            <span className="text-gray-300">Install an authenticator app (Google Authenticator, Authy, etc.)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              2
            </div>
            <span className="text-gray-400">Scan QR code or enter setup key</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              3
            </div>
            <span className="text-gray-400">Enter verification code to complete setup</span>
          </div>
        </div>

        <button
          onClick={handleGenerateSetup}
          disabled={loading}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Start Setup'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Complete 2FA Setup</h2>
      
      {setupData && (
        <div className="space-y-6">
          {/* QR Code */}
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              <Image
                src={setupData.qrCodeDataUrl}
                alt="2FA QR Code"
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>
            <p className="text-sm text-gray-400 mb-2">
              Scan this QR code with your authenticator app
            </p>
            <button
              onClick={() => setShowManualEntry(!showManualEntry)}
              className="text-sm text-indigo-300 hover:text-indigo-200"
            >
              {showManualEntry ? 'Hide' : 'Show'} manual entry key
            </button>
          </div>

          {/* Manual Entry */}
          {showManualEntry && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-100 mb-2">Manual Entry</h3>
              <p className="text-xs text-gray-400 mb-2">
                If you can't scan the QR code, enter this key manually:
              </p>
              <div className="bg-gray-800 p-3 rounded border font-mono text-sm text-gray-300 break-all">
                {setupData.manualEntryKey}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                <p><strong>Account:</strong> {setupData.accountName}</p>
                <p><strong>Service:</strong> {setupData.serviceName}</p>
              </div>
            </div>
          )}

          {/* Verification Form */}
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="secret" value={setupData.secret} />
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Your Password
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

            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-800"
            >
              Enable 2FA
            </button>

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
      )}
    </div>
  );
}