'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { loginUser } from '../(auth)/login/actions';
import { registerUser } from '../(auth)/register/actions';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginState, loginAction] = useFormState(loginUser, { success: false, message: '' });
  const [registerState, registerAction] = useFormState(registerUser, { success: false, message: '' });
  const [requires2FA, setRequires2FA] = useState(false);
  const [savedUsername, setSavedUsername] = useState('');

  // Handle 2FA requirement for login
  React.useEffect(() => {
    if (loginState.requires2FA && !requires2FA) {
      setRequires2FA(true);
      setSavedUsername(loginState.username || '');
    }
  }, [loginState.requires2FA, loginState.username, requires2FA]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-gray-100 hover:text-white">
                Cipher Market
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/listings"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Browse Listings
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
          {/* Tab Switcher */}
          {!requires2FA && (
            <div className="flex bg-gray-700 rounded-lg p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  isLogin
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  !isLogin
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Page Title */}
          <h1 className="text-2xl font-bold text-center text-gray-100">
            {requires2FA
              ? 'Two-Factor Authentication'
              : isLogin
              ? 'Sign in to your account'
              : 'Create an Account'}
          </h1>

          {/* 2FA Notice */}
          {requires2FA && (
            <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="text-blue-400 text-xl">🔒</div>
                <div>
                  <p className="text-blue-100 text-sm">
                    Please enter the 6-digit verification code from your authenticator app.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          {(isLogin || requires2FA) && (
            <form action={loginAction} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  defaultValue={savedUsername}
                  readOnly={requires2FA}
                  className={`w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    requires2FA ? 'opacity-75' : ''
                  }`}
                />
              </div>

              {!requires2FA && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}

              {requires2FA && (
                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-gray-300">
                    Verification Code
                  </label>
                  <input
                    id="token"
                    name="token"
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    placeholder="000000"
                    className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center text-lg tracking-widest"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                {requires2FA && (
                  <button
                    type="button"
                    onClick={() => {
                      setRequires2FA(false);
                      setSavedUsername('');
                    }}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    ← Back to Login
                  </button>
                )}
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  {requires2FA ? 'Verify' : 'Sign In'}
                </button>
              </div>

              {loginState.message && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    loginState.success
                      ? 'bg-green-900 border border-green-700 text-green-100'
                      : 'bg-red-900 border border-red-700 text-red-100'
                  }`}
                >
                  {loginState.message}
                </div>
              )}
            </form>
          )}

          {/* Register Form */}
          {!isLogin && !requires2FA && (
            <form action={registerAction} className="space-y-6">
              <div>
                <label htmlFor="reg-username" className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <input
                  id="reg-username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <input
                  id="reg-confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Create Account
                </button>
              </div>

              {registerState.message && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    registerState.success
                      ? 'bg-green-900 border border-green-700 text-green-100'
                      : 'bg-red-900 border border-red-700 text-red-100'
                  }`}
                >
                  {registerState.message}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}