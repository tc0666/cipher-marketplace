'use client';

import { getListingById, deleteListing } from '@/lib/listing-utils';
import { getSession } from '@/app/(auth)/login/actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useActionState } from 'react';
import { ContactSellerForm } from './contact-form';
import { ImageGallery } from './image-gallery';
import { deleteListingAction } from './actions';

interface ListingPageProps {
  params: Promise<{
    id: string;
  }>;
}

import { deleteListingAction } from './actions';

// Delete form handler
  
  const session = await getSession();
  if (!session) {
    return { success: false, message: 'You must be logged in to delete a listing.' };
  }

  const listingId = formData.get('id') as string;
  if (!listingId) {
    return { success: false, message: 'Listing ID is required.' };
  }

  try {
    const success = await deleteListing(parseInt(listingId), session.userId);
    if (!success) {
      return { success: false, message: 'Failed to delete listing.' };
    }

    return { 
      success: true, 
      message: 'Listing successfully deleted',
      redirectUrl: '/listings'
    };
  } catch (error) {
    console.error('Delete listing error:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
}

const [deleteState, deleteFormAction] = useActionState(deleteListingAction, { success: false, message: '' });

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  
  if (deleteState.success && deleteState.redirectUrl) {
    window.location.href = deleteState.redirectUrl;
    return null;
  }
  const listingId = parseInt(id);
  
  if (isNaN(listingId)) {
    notFound();
  }

  const listing = await getListingById(listingId);
  
  if (!listing) {
    notFound();
  }

  const session = await getSession();
  const isOwner = session?.userId === listing.seller_id;

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

      {/* Breadcrumb Navigation */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200">
            Cipher Market
          </Link>
          <span className="text-gray-600">•</span>
          <Link href="/listings" className="text-gray-400 hover:text-white transition-colors duration-200">
            Listings
          </Link>
          <span className="text-gray-600">•</span>
          <span className="text-white font-medium">{listing.title}</span>
        </nav>
      </div>

      {/* Report Listing Button */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex justify-end">
          <button className="inline-flex items-center px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-xl text-sm font-medium transition-all duration-300 border border-red-600/30 hover:border-red-500/50 space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>Report Listing</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="aspect-video bg-gray-700/50 rounded-2xl flex items-center justify-center border border-gray-600/30 mb-8">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">No image available</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
              {/* Listing Header */}
              <div className="mb-8">
                <div className="flex justify-between items-start mb-6">
                  <h1 className="text-4xl font-light text-white tracking-wide">{listing.title}</h1>
                  <div className="flex items-center space-x-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${
                      listing.status === 'active' 
                        ? 'bg-green-900/50 text-green-300 border-green-700/50' 
                        : listing.status === 'sold'
                        ? 'bg-red-900/50 text-red-300 border-red-700/50'
                        : 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50'
                    }`}>
                      {listing.status.toUpperCase()}
                    </span>
                    <span className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-full text-sm font-medium border border-gray-600/50">
                      {listing.condition}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-gray-300 font-light">
                  <span className="text-green-400">Category: {listing.category}</span>
                  {listing.location && (
                    <>
                      <span className="text-gray-600">•</span>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <span>{listing.location}</span>
                      </div>
                    </>
                  )}
                  <span className="text-gray-600">•</span>
                  <span>Listed {new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-8 p-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl border border-green-700/30">
                <div className="text-center">
                  <div className="text-4xl font-light text-green-400 mb-3 tracking-wide">
                    {listing.price_xmr.toFixed(8)} XMR
                  </div>
                  <div className="text-gray-300 font-light">
                    Private, secure payment with Monero
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-light text-white mb-6 tracking-wide">Description</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed font-light text-lg">{listing.description}</p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-light text-white mb-4 tracking-wide">Listing Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-light">Condition:</span>
                      <span className="text-white font-medium">{listing.condition}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-light">Category:</span>
                      <span className="text-green-400 font-medium">{listing.category}</span>
                    </div>
                    {listing.location && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-light">Location:</span>
                        <span className="text-white font-medium">{listing.location}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-light">Listed:</span>
                      <span className="text-white font-medium">{new Date(listing.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-light text-white mb-4 tracking-wide">Privacy Features</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-light">Hidden Listing:</span>
                      <span className={`font-medium ${listing.is_hidden ? 'text-green-400' : 'text-gray-500'}`}>
                        {listing.is_hidden ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Actions */}
              {isOwner && (
                <div className="border-t border-gray-700/50 pt-8">
                  <h3 className="text-xl font-light text-white mb-6 tracking-wide">Manage Listing</h3>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href={`/listings/${listing.id}/edit`}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Edit Listing
                    </Link>
                    <form action={deleteListingAction} method="POST" className="inline">
                      <input type="hidden" name="id" value={listing.id} />
                      <button 
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Delete Listing
                      </button>
                    </form>
                    {listing.status === 'active' && (
                      <button className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        Mark as Sold
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Seller Info */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 mb-8">
              <h3 className="text-xl font-light text-white mb-6 tracking-wide">Seller Information</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-semibold text-lg">
                      {(listing.seller_username || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-white text-lg">{listing.seller_username || 'Unknown'}</div>
                    <div className="text-gray-400 font-light">Seller</div>
                  </div>
                </div>
                
                <div className="text-gray-300 font-light">
                  Member since {new Date(listing.created_at).getFullYear()}
                </div>
              </div>
            </div>

            {/* Contact Seller */}
            {!isOwner && session && listing.status === 'active' && (
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 mb-8">
                <h3 className="text-xl font-light text-white mb-6 tracking-wide">Contact Seller</h3>
                <ContactSellerForm listingId={listing.id} sellerId={listing.seller_id} />
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-light text-white tracking-wide">Security Notice</h3>
              </div>
              <div className="space-y-4 text-gray-300 font-light leading-relaxed">
                <p>
                  All transactions on Cipher Market use Monero (XMR) for maximum privacy and security.
                </p>
                <p>
                  Always use the built-in escrow system for safe transactions. Never send payment directly.
                </p>
                <p>
                  Report suspicious listings or users to maintain marketplace integrity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}