import React from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
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

      {/* Header */}
      <header className="relative z-10 bg-gray-900/30 backdrop-blur-sm border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-light text-gray-100 hover:text-white transition-colors duration-300 tracking-wide">
                Cipher Market
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/listings"
                className="text-gray-300 hover:text-white px-4 py-2 rounded-2xl text-sm font-light transition-all duration-300 hover:bg-gray-800/30 backdrop-blur-sm"
              >
                Browse Listings
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md p-8 space-y-8 bg-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-800/50 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}

