import { getActiveListings, getCategories, searchListings } from '@/lib/listing-utils';
import Link from 'next/link';
import { Suspense } from 'react';

interface SearchParams {
  search?: string;
  category?: string;
  page?: string;
}

interface ListingsPageProps {
  searchParams?: SearchParams;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const search = searchParams?.search || '';
  const category = searchParams?.category || '';
  const page = parseInt(searchParams?.page || '1');
  const limit = 15;
  const offset = (page - 1) * limit;

  // Get listings based on search/filter
  const listings = search 
    ? await searchListings(search, limit, offset)
    : await getActiveListings(limit, offset, category || undefined);

  const categories = await getCategories();

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
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-wide">
            Browse <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-medium">Listings</span>
          </h1>
          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Discover unique items and services in our secure marketplace
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/50 sticky top-8">
              <h2 className="text-2xl font-medium text-white mb-8 tracking-wide">Filters</h2>
              
              <form method="GET" className="space-y-8">
                {/* Search Input */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-3">
                    Search
                  </label>
                  <input
                    id="search"
                    name="search"
                    type="text"
                    defaultValue={search}
                    placeholder="Search listings..."
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 backdrop-blur-sm transition-all duration-300"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-3">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={category}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Price Range (XMR)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      name="min_price"
                      type="number"
                      step="0.001"
                      placeholder="Min"
                      className="px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 backdrop-blur-sm transition-all duration-300"
                    />
                    <input
                      name="max_price"
                      type="number"
                      step="0.001"
                      placeholder="Max"
                      className="px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 backdrop-blur-sm transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Condition Filter */}
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-300 mb-3">
                    Condition
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="">Any Condition</option>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Used - Excellent">Used - Excellent</option>
                    <option value="Used - Good">Used - Good</option>
                    <option value="Used - Fair">Used - Fair</option>
                    <option value="For Parts">For Parts</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-3">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="City, State, Country..."
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 backdrop-blur-sm transition-all duration-300"
                  />
                </div>

                {/* Sort By Filter */}
                <div>
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-300 mb-3">
                    Sort By
                  </label>
                  <select
                    id="sort"
                    name="sort"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="title_asc">Title: A to Z</option>
                    <option value="title_desc">Title: Z to A</option>
                  </select>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Apply Filters
                </button>
              </form>

              {/* Active Filters */}
              {(search || category) && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Active Filters</h3>
                  <div className="space-y-3">
                    {search && (
                      <div className="flex items-center justify-between px-4 py-3 bg-green-900/30 rounded-2xl border border-green-800/50">
                        <span className="text-sm text-green-300">Search: {search}</span>
                        <Link
                          href={`/listings${category ? `?category=${category}` : ''}`}
                          className="text-green-400 hover:text-green-300 text-lg font-medium transition-colors duration-200"
                        >
                          ×
                        </Link>
                      </div>
                    )}
                    {category && (
                      <div className="flex items-center justify-between px-4 py-3 bg-green-900/30 rounded-2xl border border-green-800/50">
                        <span className="text-sm text-green-300">Category: {category}</span>
                        <Link
                          href={`/listings${search ? `?search=${search}` : ''}`}
                          className="text-green-400 hover:text-green-300 text-lg font-medium transition-colors duration-200"
                        >
                          ×
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Right Content - Listings */}
          <div className="flex-1">
            <div className="mb-12">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-medium text-white tracking-wide">Available Listings</h2>
                  <p className="text-gray-300 mt-2 font-light">{listings.length} listings found</p>
                </div>
                <Link
                  href="/listings/create"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create Listing</span>
                </Link>
              </div>
            </div>

            {/* Listings - Horizontal Layout */}
            <Suspense fallback={<ListingsLoading />}>
          {listings.length > 0 ? (
            <div className="space-y-6">
              {listings.map((listing) => (
                <div key={listing.id} className="group bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Image Placeholder */}
                    <div className="lg:w-80 flex-shrink-0">
                      <div className="aspect-video bg-gray-700/50 rounded-2xl flex items-center justify-center border border-gray-600/30">
                        {listing.images && listing.images.length > 0 ? (
                          <img 
                            src={listing.images[0]} 
                            alt={listing.title}
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        ) : (
                          <div className="text-center">
                            <svg className="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500 text-sm">No image</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                        <div className="flex-1">
                          {/* Category and Condition Badges */}
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs text-gray-300 bg-gray-800/50 px-3 py-2 rounded-full font-medium border border-gray-700/50">
                              {listing.category}
                            </span>
                            <span className="text-xs text-amber-400 bg-amber-400/20 px-3 py-2 rounded-full border border-amber-400/30">
                              {listing.condition}
                            </span>
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-2xl font-medium text-white leading-relaxed group-hover:text-green-400 transition-colors duration-300 mb-2">
                            <Link href={`/listings/${listing.id}`} className="hover:text-green-400">
                              {listing.title}
                            </Link>
                          </h3>
                        </div>
                        
                        {/* Price */}
                        <div className="text-right">
                          <div className="flex items-baseline justify-end">
                            <span className="text-3xl font-medium text-white">{listing.price_xmr.toFixed(3)}</span>
                            <span className="text-green-400 font-medium ml-3 text-lg">XMR</span>
                          </div>
                          <p className="text-gray-400 text-sm mt-1 font-light">Private, secure payment</p>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-gray-300 text-base mb-6 leading-relaxed font-light flex-grow">
                        {listing.description.length > 200 ? listing.description.substring(0, 200) + '...' : listing.description}
                      </p>
                      
                      {/* Footer */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-row items-center gap-4 text-sm text-gray-400">
                          <span className="font-light">by {listing.seller_username}</span>
                          <span className="font-light">{new Date(listing.created_at).toLocaleDateString()}</span>
                          {listing.location && (
                            <div className="flex items-center font-light">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                              </svg>
                              {listing.location}
                            </div>
                          )}
                        </div>
                        
                        {/* View Details Button */}
                        <Link
                          href={`/listings/${listing.id}`}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
                        >
                          <span>View Details</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mb-8">
                <svg className="w-24 h-24 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-2xl font-medium text-white mb-4">
                  {search || category ? 'No listings found' : 'No listings available yet'}
                </h3>
                <p className="text-gray-400 text-lg font-light mb-8">
                  {search || category ? 'Try adjusting your search criteria.' : 'Be the first to create a listing in our marketplace.'}
                </p>
              </div>
              <Link
                href="/listings/create"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl space-x-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create the first listing</span>
              </Link>
            </div>
          )}
        </Suspense>

        {/* Pagination */}
        {listings.length === limit && (
          <div className="mt-16 flex justify-center">
            <div className="flex items-center space-x-3">
              {page > 1 && (
                <Link
                  href={`/listings?${new URLSearchParams({ 
                    ...(search && { search }), 
                    ...(category && { category }), 
                    page: (page - 1).toString() 
                  }).toString()}`}
                  className="px-6 py-3 bg-gray-900/50 text-white rounded-2xl hover:bg-gray-800/50 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </Link>
              )}
              
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
                {page}
              </div>
              
              <Link
                href={`/listings?${new URLSearchParams({ 
                  ...(search && { search }), 
                  ...(category && { category }), 
                  page: (page + 1).toString() 
                }).toString()}`}
                className="px-6 py-3 bg-gray-900/50 text-white rounded-2xl hover:bg-gray-800/50 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 flex items-center space-x-2"
              >
                <span>Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingsLoading() {
  return (
    <div className="space-y-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 animate-pulse">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image Placeholder */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="aspect-video bg-gray-700/50 rounded-2xl"></div>
            </div>
            
            {/* Content Placeholder */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="h-6 w-20 bg-gray-700 rounded-full mb-3"></div>
                  <div className="h-8 bg-gray-700 rounded mb-2"></div>
                  <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
                </div>
                <div className="text-right">
                  <div className="h-10 w-32 bg-gray-700 rounded mb-1"></div>
                  <div className="h-4 w-28 bg-gray-700 rounded"></div>
                </div>
              </div>
              
              {/* Description */}
              <div className="space-y-2 mb-6 flex-grow">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
              
              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="h-4 w-20 bg-gray-700 rounded"></div>
                  <div className="h-4 w-16 bg-gray-700 rounded"></div>
                  <div className="h-4 w-24 bg-gray-700 rounded"></div>
                </div>
                <div className="h-10 w-32 bg-gray-700 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}