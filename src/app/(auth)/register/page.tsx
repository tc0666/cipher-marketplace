'use client';

import { useActionState } from 'react';
import { registerUser } from './actions';

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, { success: false, message: '' });

  return (
    <>
      <h1 className="text-3xl font-light text-center text-white tracking-wide">Create an Account</h1>
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
            className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light"
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
            className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light"
          />
        </div>
        {/* The confirm password field is not strictly needed for the server action but is good UX */}
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
            className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full px-6 py-3 text-sm font-light text-white bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-sm border border-green-500/30 hover:from-green-500/80 hover:to-emerald-500/80 hover:border-green-400/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 tracking-wide shadow-lg shadow-green-500/20"
          >
            Register
          </button>
        </div>
        {state.message && (
          <p className={`text-sm text-center ${state.success ? 'text-green-500' : 'text-red-500'}`}>
            {state.message}
          </p>
        )}
      </form>
    </>
  );
}

