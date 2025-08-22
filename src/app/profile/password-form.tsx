'use client';

import { useActionState } from 'react';
import { changePassword } from './actions';
import { useState } from 'react';

export function PasswordChangeForm() {
  const [state, formAction] = useActionState(changePassword, { success: false, message: '' });
  const [showPasswords, setShowPasswords] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      {/* Current Password */}
      <div>
        <label htmlFor="current_password" className="block text-sm font-medium text-gray-300 mb-2">
          Current Password
        </label>
        <input
          id="current_password"
          name="current_password"
          type={showPasswords ? 'text' : 'password'}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* New Password */}
      <div>
        <label htmlFor="new_password" className="block text-sm font-medium text-gray-300 mb-2">
          New Password
        </label>
        <input
          id="new_password"
          name="new_password"
          type={showPasswords ? 'text' : 'password'}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <p className="mt-1 text-xs text-gray-400">
          Must be at least 8 characters long.
        </p>
      </div>

      {/* Confirm New Password */}
      <div>
        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-300 mb-2">
          Confirm New Password
        </label>
        <input
          id="confirm_password"
          name="confirm_password"
          type={showPasswords ? 'text' : 'password'}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Show/Hide Passwords Toggle */}
      <div className="flex items-center">
        <input
          id="show_passwords"
          type="checkbox"
          checked={showPasswords}
          onChange={(e) => setShowPasswords(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
        />
        <label htmlFor="show_passwords" className="ml-2 block text-sm text-gray-300">
          Show passwords
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800"
        >
          Change Password
        </button>
      </div>

      {/* Status Message */}
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
  );
}