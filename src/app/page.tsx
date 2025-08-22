import Link from 'next/link'
import { getActiveListings } from '@/lib/listing-utils'
import FeaturedCarousel from '@/components/FeaturedCarousel'

export default async function Home() {
  const listings = await getActiveListings(6) // Get 6 listings for 2 slides of 3 each
  
  return (
    <div className="bg-black">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            {/* Floating particles */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
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
            
            {/* Gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
              <div className="h-full w-full" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }} />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-6 text-center z-10">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 tracking-tight">
                Private.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 animate-gradient">Secure.</span>
                <br />
                Simple.
              </h1>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                The future of anonymous commerce, powered by Monero.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/listings"
                className="group px-10 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-all duration-500 text-lg transform hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
              >
                <span className="relative z-10">Explore Marketplace</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
              <Link
                href="/auth"
                className="group relative px-10 py-4 border border-white/20 text-white font-medium rounded-full hover:border-white/40 hover:bg-white/5 transition-all duration-500 text-lg overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Link>
            </div>
          </div>
          

        </section>

        {/* Featured Section */}
      <section className="py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">Featured Listings</h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">Discover premium items from verified sellers</p>
          </div>
          
          <FeaturedCarousel listings={listings} />
          
          <div className="text-center mt-16">
            <Link
              href="/listings"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-300 font-medium text-lg group"
            >
              View All Listings
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

        {/* Features Section */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6">Built for Privacy</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">Advanced security meets seamless experience</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-white mb-4">Anonymous</h3>
                <p className="text-gray-400 leading-relaxed">Complete privacy with Monero's untraceable transactions</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-white mb-4">Instant</h3>
                <p className="text-gray-400 leading-relaxed">Lightning-fast transactions with optimized infrastructure</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-white mb-4">Secure</h3>
                <p className="text-gray-400 leading-relaxed">Military-grade encryption and escrow protection</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-32 bg-black relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="h-full w-full" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }} />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">How It Works</h2>
              <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
                Getting started with private commerce is simple and secure.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
              <div className="group text-center">
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-110">
                    <span className="text-green-400 text-xl font-light">1</span>
                  </div>
                </div>
                <h3 className="text-2xl font-light text-white mb-4">Create Account</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  Sign up with minimal information. No personal data required.
                </p>
              </div>
              
              <div className="group text-center">
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-110">
                    <span className="text-green-400 text-xl font-light">2</span>
                  </div>
                </div>
                <h3 className="text-2xl font-light text-white mb-4">Browse Marketplace</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  Explore listings from verified sellers in complete anonymity.
                </p>
              </div>
              
              <div className="group text-center">
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-110">
                    <span className="text-green-400 text-xl font-light">3</span>
                  </div>
                </div>
                <h3 className="text-2xl font-light text-white mb-4">Secure Payment</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  Pay with Monero for untraceable, private transactions.
                </p>
              </div>
              
              <div className="group text-center">
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-110">
                    <span className="text-green-400 text-xl font-light">4</span>
                  </div>
                </div>
                <h3 className="text-2xl font-light text-white mb-4">Receive Goods</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  Get your items delivered with full privacy protection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-32 bg-black relative overflow-hidden">
          {/* Subtle animated background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-8 tracking-tight">Start Trading</h2>
            <p className="text-xl text-gray-400 mb-12 font-light leading-relaxed max-w-2xl mx-auto">Experience the future of private commerce</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/auth/register"
                className="group px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
              >
                <span className="relative z-10">Get Started</span>
              </Link>
              <Link
                href="/listings"
                className="group relative px-8 py-4 text-gray-400 hover:text-white font-medium transition-all duration-500 overflow-hidden border border-white/20 rounded-full hover:border-white/40 hover:bg-white/5"
              >
                <span className="relative z-10">Browse Marketplace</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Link>
            </div>
          </div>
        </section>
    </div>
  )
}

