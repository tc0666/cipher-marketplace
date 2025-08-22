import { getSession } from '@/app/(auth)/login/actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
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
      
      {/* Hero Section */}
      <div className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-wide">
              Welcome back, <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-medium">{session.username}</span>
            </h1>
            <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed mb-8">Your secure marketplace command center</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8 hover:border-green-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium tracking-wide">Total Listings</p>
                <p className="text-3xl font-light text-white mt-2">0</p>
              </div>
              <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium tracking-wide">Active Orders</p>
                <p className="text-3xl font-light text-white mt-2">0</p>
              </div>
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium tracking-wide">XMR Balance</p>
                <p className="text-3xl font-light text-white mt-2">0.000</p>
              </div>
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-light text-white tracking-wide">Quick Actions</h2>
            </div>
            <div className="space-y-6">
              <Link
                href="/listings/create"
                className="group flex items-center w-full px-8 py-5 text-left bg-gradient-to-r from-green-500/80 to-emerald-600/80 hover:from-green-500 hover:to-emerald-600 text-white font-light rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-green-500/20 hover:border-green-400/40"
              >
                <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-lg tracking-wide">Create New Listing</span>
              </Link>
              <Link
                href="/listings"
                className="group flex items-center w-full px-8 py-5 text-left bg-gray-800/30 hover:bg-gray-800/50 text-gray-300 hover:text-white font-light rounded-2xl transition-all duration-300 border border-gray-700/30 hover:border-gray-600/50 backdrop-blur-sm"
              >
                <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-lg tracking-wide">View My Listings</span>
              </Link>
              <Link
                href="/orders"
                className="group flex items-center w-full px-8 py-5 text-left bg-gray-800/30 hover:bg-gray-800/50 text-gray-300 hover:text-white font-light rounded-2xl transition-all duration-300 border border-gray-700/30 hover:border-gray-600/50 backdrop-blur-sm"
              >
                <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-lg tracking-wide">View Orders</span>
              </Link>
              <Link
                href="/profile"
                className="group flex items-center w-full px-8 py-5 text-left bg-gray-800/30 hover:bg-gray-800/50 text-gray-300 hover:text-white font-light rounded-2xl transition-all duration-300 border border-gray-700/30 hover:border-gray-600/50 backdrop-blur-sm"
              >
                <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-lg tracking-wide">Profile Settings</span>
              </Link>
            </div>
          </div>

          {/* Account Overview */}
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-light text-white tracking-wide">Account Overview</h2>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-6 bg-gray-800/20 rounded-2xl border border-gray-700/30 backdrop-blur-sm">
                <span className="text-gray-400 font-light tracking-wide">Member Since:</span>
                <span className="text-white font-light">
                  {new Date(session.loginTime).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-6 bg-gray-800/20 rounded-2xl border border-gray-700/30 backdrop-blur-sm">
                <span className="text-gray-400 font-light tracking-wide">User ID:</span>
                <span className="text-white font-light">#{session.userId}</span>
              </div>
              <div className="flex justify-between items-center p-6 bg-gray-800/20 rounded-2xl border border-gray-700/30 backdrop-blur-sm">
                <span className="text-gray-400 font-light tracking-wide">Status:</span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-light bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center p-6 bg-gray-800/20 rounded-2xl border border-gray-700/30 backdrop-blur-sm">
                <span className="text-gray-400 font-light tracking-wide">Security Level:</span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-light bg-blue-500/20 text-blue-400 border border-blue-500/30 backdrop-blur-sm">
                  Standard
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="mt-16 bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-10">
          <div className="flex items-center mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-3xl font-light text-white tracking-wide">Coming Soon</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 rounded-2xl hover:border-orange-500/40 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-orange-400 font-light mb-3 text-xl tracking-wide">Escrow System</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">Secure transactions with built-in escrow protection for both buyers and sellers</p>
            </div>
            <div className="group p-8 bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 rounded-2xl hover:border-blue-500/40 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-blue-400 font-light mb-3 text-xl tracking-wide">Messaging</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">Direct encrypted communication with buyers and sellers for seamless transactions</p>
            </div>
            <div className="group p-8 bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 rounded-2xl hover:border-purple-500/40 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-purple-400 font-light mb-3 text-xl tracking-wide">Reputation System</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">Build trust through verified reviews and transparent reputation scoring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
