import { getSession } from '@/app/(auth)/login/actions';
import { getUserProfile } from '../actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { TwoFactorManager } from './two-factor-manager';

export default async function TwoFactorPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const userProfile = await getUserProfile(session.userId);

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
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-600/80 to-orange-600/80 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
              <span className="text-2xl">🚧</span>
            </div>
            <h1 className="text-2xl font-light text-white mb-2 tracking-wide">Two-Factor Authentication</h1>
            <p className="text-gray-400 font-light">
              Enhanced security for your account
            </p>
          </div>

          {/* Current Status */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-light text-white tracking-wide">Current Status</h2>
                <p className="text-gray-400 text-sm mt-1 font-light">
                  Two-factor authentication adds an extra layer of security to your account
                </p>
              </div>
              <div className={`px-3 py-1 rounded-xl text-sm font-light backdrop-blur-sm ${
                userProfile.two_factor_enabled 
                  ? 'bg-green-900/50 text-green-300 border border-green-500/30' 
                  : 'bg-red-900/50 text-red-300 border border-red-500/30'
              }`}>
                {userProfile.two_factor_enabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          </div>

          {/* 2FA Management */}
          <TwoFactorManager userProfile={userProfile} />

          {/* Back to Profile */}
          <div className="mt-8 text-center">
            <Link
              href="/profile"
              className="inline-flex items-center px-6 py-3 text-sm font-light text-gray-300 bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/50 rounded-2xl transition-all duration-300"
            >
              ← Back to Profile Settings
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}