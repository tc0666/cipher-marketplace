'use client';

import { useActionState } from 'react';
import { useEffect, useState } from 'react';
import { editListingAction } from './actions';
import { getListingEditData } from './data';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listingId, setListingId] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setListingId(id);
      const { listing: fetchedListing, error: fetchError } = await getListingEditData(parseInt(id));
      if (fetchError) {
        setError(fetchError);
      } else {
        setListing(fetchedListing);
      }
      setLoading(false);
    };
    fetchData();
  }, [params]);

  const [state, formAction] = useActionState(editListingAction, { success: false, message: '' });

  if (state.success && state.redirectUrl) {
    window.location.href = state.redirectUrl;
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!listing) {
    return <div>Listing not found.</div>;
  }

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
          <h1 className="text-4xl font-light text-white mb-8 tracking-wide">Edit Listing</h1>
          
          <form action={formAction} className="space-y-8">
            <input type="hidden" name="id" value={listingId} />
            
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
                defaultValue={listing.title}
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
                defaultValue={listing.description}
                className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-light resize-none"
                placeholder="Provide a detailed description of your item..."
              />
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
                  defaultValue={listing.price_xmr}
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
                  defaultValue={listing.category}
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
                  defaultValue={listing.condition}
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
                  defaultValue={listing.location || ''}
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
                    defaultChecked={listing.is_hidden}
                    className="h-4 w-4 text-green-500 focus:ring-green-500/50 border-gray-600 rounded"
                  />
                  <label htmlFor="is_hidden" className="ml-3 block text-sm font-light text-gray-300 tracking-wide">
                    Hidden Listing
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link 
                href={`/listings/${listingId}`}
                className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700/70 text-white rounded-2xl font-medium transition-all duration-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}