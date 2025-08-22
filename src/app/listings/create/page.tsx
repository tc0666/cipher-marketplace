'use client';

import { useActionState } from 'react';
import { createListingAction } from './actions';
import { getSession } from '@/app/(auth)/login/actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function CreateListingPage() {
  const [state, formAction] = useActionState(createListingAction, { success: false, message: '' });

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-900/30 backdrop-blur-sm rounded-3xl p-10 border border-gray-800/50">
          <h1 className="text-4xl font-light text-white mb-8 tracking-wide">Create New Listing</h1>
          
          {/* Legal Disclaimer */}
          <div className="bg-orange-900/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-light text-orange-400 tracking-wide">Legal Notice</h3>
                <div className="mt-3 text-sm text-orange-200/80 font-light leading-relaxed">
                  <p>
                    Cipher Market is intended for <strong>legal</strong> privacy-focused items only. 
                    The platform explicitly prohibits the listing of illegal goods, including but not limited to 
                    drugs, weapons, stolen property, and any other illegal items.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form action={formAction} className="space-y-8">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light"
                placeholder="Enter a descriptive title for your listing"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                required
                className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light resize-none"
                placeholder="Provide a detailed description of your item..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="images" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
                Images (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-700/50 rounded-2xl p-8 bg-gray-800/30 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-400 font-light">
                    <label htmlFor="images" className="relative cursor-pointer bg-gray-700/50 rounded-xl px-4 py-2 font-medium text-green-400 hover:text-green-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500/50 transition-all duration-300">
                      <span>Upload images</span>
                      <input id="images" name="images" type="file" className="sr-only" multiple accept="image/*" />
                    </label>
                    <p className="pl-2 py-2">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 font-light mt-2">PNG, JPG, GIF up to 10MB each (max 5 images)</p>
                </div>
              </div>
            </div>

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="price_xmr" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
                  Price (XMR) *
                </label>
                <input
                  id="price_xmr"
                  name="price_xmr"
                  type="number"
                  step="0.00000001"
                  min="0"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light"
                  placeholder="0.00000000"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light"
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Books">Books</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Sports & Outdoors">Sports & Outdoors</option>
                  <option value="Collectibles">Collectibles</option>
                  <option value="Art & Crafts">Art & Crafts</option>
                  <option value="Digital Goods">Digital Goods</option>
                  <option value="Services">Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Condition and Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="condition" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
                  Condition *
                </label>
                <select
                  id="condition"
                  name="condition"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light"
                >
                  <option value="">Select condition</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                  <option value="Digital">Digital</option>
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
                  Location (Optional)
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light"
                  placeholder="General location (e.g., Country, Region)"
                />
              </div>
            </div>

            {/* Privacy Options */}
            <div className="space-y-6">
              <h3 className="text-xl font-light text-gray-200 tracking-wide">Privacy Options</h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl transition-all duration-300 hover:bg-gray-800/50">
                  <input
                    id="is_hidden"
                    name="is_hidden"
                    type="checkbox"
                    className="h-5 w-5 text-green-500 focus:ring-green-500/50 border-gray-600 bg-gray-700/50 rounded-lg"
                  />
                  <label htmlFor="is_hidden" className="ml-4 block text-sm text-gray-300 font-light">
                    Hidden Listing (Only accessible via direct link)
                  </label>
                </div>
                
                <div className="flex items-center p-4 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl transition-all duration-300 hover:bg-gray-800/50">
                  <input
                    id="is_time_locked"
                    name="is_time_locked"
                    type="checkbox"
                    className="h-5 w-5 text-green-500 focus:ring-green-500/50 border-gray-600 bg-gray-700/50 rounded-lg"
                    onChange={(e) => {
                      const timeLockOptions = document.getElementById('time-lock-options');
                      if (timeLockOptions) {
                        timeLockOptions.style.display = e.target.checked ? 'block' : 'none';
                      }
                    }}
                  />
                  <label htmlFor="is_time_locked" className="ml-4 block text-sm text-gray-300 font-light">
                    Time-Locked Listing (Schedule visibility)
                  </label>
                </div>
              </div>
            </div>

            {/* Time Lock Options (shown when time_locked is checked) */}
            <div id="time-lock-options" className="space-y-6 hidden">
              <div className="p-6 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl">
                <h4 className="text-lg font-light text-gray-200 mb-6 tracking-wide">Time Lock Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="visible_from" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
                      Visible From
                    </label>
                    <input
                      id="visible_from"
                      name="visible_from"
                      type="datetime-local"
                      className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light"
                    />
                  </div>

                  <div>
                    <label htmlFor="visible_until" className="block text-sm font-light text-gray-300 mb-3 tracking-wide">
                      Visible Until (Optional)
                    </label>
                    <input
                      id="visible_until"
                      name="visible_until"
                      type="datetime-local"
                      className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-6 pt-4">
              <Link
                href="/dashboard"
                className="px-8 py-3 text-sm font-light text-gray-300 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-600/50 rounded-2xl transition-all duration-300 tracking-wide"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-8 py-3 text-sm font-light text-white bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-sm border border-green-500/30 hover:from-green-500/80 hover:to-emerald-500/80 hover:border-green-400/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 tracking-wide shadow-lg shadow-green-500/20"
              >
                Create Listing
              </button>
            </div>

            {/* Status Message */}
            {state.message && (
              <div className={`p-4 rounded-md ${
                state.success 
                  ? 'bg-green-900 border border-green-700 text-green-300' 
                  : 'bg-red-900 border border-red-700 text-red-300'
              }`}>
                {state.message}
              </div>
            )}
          </form>
        </div>
      </main>

      {/* JavaScript for time lock options */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const timeLockCheckbox = document.getElementById('is_time_locked');
            const timeLockOptions = document.getElementById('time-lock-options');
            
            timeLockCheckbox.addEventListener('change', function() {
              if (this.checked) {
                timeLockOptions.classList.remove('hidden');
              } else {
                timeLockOptions.classList.add('hidden');
              }
            });
          });
        `
      }} />
    </div>
  );
}