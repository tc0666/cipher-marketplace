import { getSession } from '@/app/(auth)/login/actions';
import { getUserProfile, getUserStats } from './actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ProfileForm } from './profile-form';
import { PasswordChangeForm } from './password-form';

export default async function ProfilePage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const [userProfile, userStats] = await Promise.all([
    getUserProfile(session.userId),
    getUserStats(session.userId)
  ]);

  if (!userProfile) {
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
      


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8 hover:border-green-500/30 transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600/80 to-emerald-600/80 rounded-full flex items-center justify-center border border-green-500/30">
                <span className="text-2xl font-light text-white">
                  {userProfile.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-wide">
                  <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-medium">{userProfile.username}</span>
                </h1>
                <p className="text-xl text-gray-300 font-light leading-relaxed">Member since {new Date(userProfile.created_at).toLocaleDateString()}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-xl text-xs font-light backdrop-blur-sm ${
                    userProfile.is_verified_seller 
                      ? 'bg-green-900/50 text-green-300 border border-green-500/30' 
                      : 'bg-gray-700/50 text-gray-300 border border-gray-600/30'
                  }`}>
                    {userProfile.is_verified_seller ? 'Verified Seller' : 'Standard User'}
                  </span>
                  <span className="px-3 py-1 rounded-xl text-xs font-light bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                    {userProfile.subscription_tier.charAt(0).toUpperCase() + userProfile.subscription_tier.slice(1)} Tier
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8">
              <h2 className="text-2xl font-light text-white mb-8 tracking-wide">Profile Information</h2>
              <ProfileForm userProfile={userProfile} />
            </div>

            {/* Security Settings */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8">
              <h2 className="text-2xl font-light text-white mb-8 tracking-wide">Security Settings</h2>
              <PasswordChangeForm />
              
              {/* 2FA Status */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-100">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      userProfile.two_factor_enabled 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {userProfile.two_factor_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <Link
                      href="/profile/2fa"
                      className="px-3 py-1 text-sm font-medium text-indigo-300 hover:text-indigo-200 border border-indigo-600 hover:border-indigo-500 rounded-md"
                    >
                      {userProfile.two_factor_enabled ? 'Manage' : 'Setup'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Communication */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8">
            <h2 className="text-2xl font-light text-white mb-8 tracking-wide">Privacy & Communication</h2>
            
            {/* PGP Key Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-light text-white mb-2 tracking-wide">PGP Public Key</h3>
                <p className="text-sm text-gray-400 mb-4 font-light">
                  Upload your PGP public key to enable encrypted communication with buyers and sellers.
                </p>
                {userProfile.pgp_public_key ? (
                  <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-600/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-light text-green-400">✓ PGP Key Configured</span>
                      <button className="text-sm text-green-300 hover:text-green-200 font-light transition-colors duration-300">
                        Update Key
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 font-mono bg-gray-800/50 p-2 rounded-xl overflow-x-auto border border-gray-700/30">
                      {userProfile.pgp_public_key.substring(0, 100)}...
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-600/50 rounded-2xl p-6 text-center bg-gray-700/20 backdrop-blur-sm">
                    <div className="text-gray-400 mb-2">🔐</div>
                    <p className="text-sm text-gray-400 mb-4 font-light">No PGP key configured</p>
                    <button className="px-4 py-2 text-sm font-light text-white bg-green-600/80 hover:bg-green-600 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-green-500/30">
                      Upload PGP Key
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8">
            <h2 className="text-2xl font-light text-white mb-8 tracking-wide">Account Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 hover:border-green-500/30 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-400 text-sm font-medium tracking-wide">Active Listings</p>
                    <p className="text-3xl font-light text-white mt-2">{userStats.activeListings}</p>
                  </div>
                  <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-400 text-sm font-medium tracking-wide">Completed Orders</p>
                    <p className="text-3xl font-light text-white mt-2">{userStats.completedOrders}</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-400 text-sm font-medium tracking-wide">Total XMR Earned</p>
                    <p className="text-3xl font-light text-white mt-2">{userStats.totalEarned}</p>
                  </div>
                  <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}