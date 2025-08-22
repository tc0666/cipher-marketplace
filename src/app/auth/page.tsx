'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { loginUser } from '../(auth)/login/actions';
import { registerUser } from '../(auth)/register/actions';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginState, loginAction] = useActionState(loginUser, { success: false, message: '' });
  const [registerState, registerAction] = useActionState(registerUser, { success: false, message: '' });
  const [requires2FA, setRequires2FA] = useState(false);
  const [savedUsername, setSavedUsername] = useState('');
  const [hasMounted, setHasMounted] = useState(false);
 
   // Handle 2FA requirement for login
  React.useEffect(() => {
    if (loginState.requires2FA && !requires2FA) {
      setRequires2FA(true);
      setSavedUsername(loginState.username || '');
    }
  }, [loginState.requires2FA, loginState.username, requires2FA]);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);
 
    return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Floating Particles Background to match listings */}
      {/* Render particles only after mount to avoid SSR hydration mismatches */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {hasMounted && Array.from({ length: 50 }).map((_, i) => {
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const animationDelay = Math.random() * 3;
          const animationDuration = 2 + Math.random() * 3;
          return (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${animationDelay}s`,
                animationDuration: `${animationDuration}s`,
              }}
            />
          );
        })}
      </div>
 
       {/* Main Content */}
       <div className="relative z-10 flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
         <div className="w-full max-w-md p-10 space-y-8 bg-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-800/50 shadow-2xl">
           {/* Tab Switcher */}
          {!requires2FA && (
            <div className="flex bg-gray-800/40 rounded-2xl p-1 mb-2">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-light transition-all duration-300 ${
                  isLogin
                    ? 'bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white shadow-lg shadow-emerald-900/20 border border-green-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-light transition-all duration-300 ${
                  !isLogin
                    ? 'bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white shadow-lg shadow-emerald-900/20 border border-green-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Page Title */}
          <h1 className="text-3xl font-light text-center text-white tracking-wide">
            {requires2FA
              ? 'Two-Factor Authentication'
              : isLogin
              ? 'Sign in to your account'
              : 'Create an Account'}
          </h1>

          {/* 2FA Notice */}
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

          {/* Login Form */}
          {(isLogin || requires2FA) && (
            <form action={loginAction} className="space-y-8">
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
                  className={`w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light ${
                    requires2FA ? 'opacity-75' : ''
                  }`}
                />
              </div>

              {!requires2FA && (
                <div>
                  <label htmlFor="password" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light"
                  />
                </div>
              )}

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
                    placeholder="000000"
                    className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light text-center text-lg tracking-widest"
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
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    ← Back to Login
                  </button>
                )}
                <button
                  type="submit"
                  className="w-full px-6 py-3 text-sm font-light text-white bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-sm border border-green-500/30 hover:from-green-500/80 hover:to-emerald-500/80 hover:border-green-400/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
                >
                  {requires2FA ? 'Verify' : 'Sign In'}
                </button>
              </div>

              {loginState.message && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    loginState.success
                      ? 'bg-green-900/20 border border-green-700/40 text-green-200'
                      : 'bg-red-900/20 border border-red-700/40 text-red-200'
                  }`}
                >
                  {loginState.message}
                </div>
              )}
            </form>
          )}

          {/* Register Form */}
          {!isLogin && !requires2FA && (
            <form action={registerAction} className="space-y-8">
              <div>
                <label htmlFor="reg-username" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
                  Username
                </label>
                <input
                  id="reg-username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light"
                />
              </div>
              <div>
                <label htmlFor="reg-password" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
                  Password
                </label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light"
                />
              </div>
              <div>
                <label htmlFor="reg-confirm-password" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
                  Confirm Password
                </label>
                <input
                  id="reg-confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 text-sm font-light text-white bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-sm border border-green-500/30 hover:from-green-500/80 hover:to-emerald-500/80 hover:border-green-400/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
                >
                  Create Account
                </button>
              </div>

              {registerState.message && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    registerState.success
                      ? 'bg-green-900/20 border border-green-700/40 text-green-200'
                      : 'bg-red-900/20 border border-red-700/40 text-red-200'
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