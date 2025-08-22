'use client';

import { useActionState } from 'react';
import { updateProfile, UserProfile } from './actions';
import { useState } from 'react';

interface ProfileFormProps {
  userProfile: UserProfile;
}

export function ProfileForm({ userProfile }: ProfileFormProps) {
  const [state, formAction] = useActionState(updateProfile, { success: false, message: '' });
  const [showPgpTextarea, setShowPgpTextarea] = useState(!!userProfile.pgp_public_key);

  return (
    <form action={formAction} className="space-y-6">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={userProfile.email || ''}
          placeholder="your.email@example.com"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <p className="mt-1 text-xs text-gray-400">
          Optional. Used for account recovery and important notifications.
        </p>
      </div>

      {/* PGP Public Key */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="pgp_public_key" className="block text-sm font-medium text-gray-300">
            PGP Public Key
          </label>
          <button
            type="button"
            onClick={() => setShowPgpTextarea(!showPgpTextarea)}
            className="text-xs text-indigo-300 hover:text-indigo-200"
          >
            {showPgpTextarea ? 'Hide' : 'Show'} PGP Field
          </button>
        </div>
        
        {showPgpTextarea && (
          <>
            <textarea
              id="pgp_public_key"
              name="pgp_public_key"
              rows={8}
              defaultValue={userProfile.pgp_public_key || ''}
              placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----&#10;&#10;Paste your PGP public key here...&#10;&#10;-----END PGP PUBLIC KEY BLOCK-----"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            />
            <p className="mt-1 text-xs text-gray-400">
              Optional. Enables encrypted communication with other users. Make sure to paste your complete public key.
            </p>
          </>
        )}
      </div>

      {/* Account Information (Read-only) */}
      <div className="pt-4 border-t border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Username
            </label>
            <div className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300 text-sm">
              {userProfile.username}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              User ID
            </label>
            <div className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300 text-sm">
              #{userProfile.id}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Member Since
            </label>
            <div className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300 text-sm">
              {new Date(userProfile.created_at).toLocaleDateString()}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Last Updated
            </label>
            <div className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300 text-sm">
              {new Date(userProfile.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800"
        >
          Update Profile
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