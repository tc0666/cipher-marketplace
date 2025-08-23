import Link from 'next/link'
import { getActiveListings } from '@/lib/listing-utils'
import FeaturedCarousel from '@/components/FeaturedCarousel'
import { getSession } from '@/app/(auth)/login/actions'
import './home-animations.css'

export default async function Home() {
  const listings = await getActiveListings(6) // Get 6 listings for 2 slides of 3 each
  const session = await getSession()
  
  return (
    <div className="bg-black">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            {/* Enhanced Floating particles */}
            <div className="absolute inset-0">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                />
              ))}
            </div>
            
            {/* Enhanced Gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-green-500/15 to-blue-500/15 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-2/3 left-1/2 w-[300px] h-[300px] bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            
            {/* Enhanced Grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="h-full w-full" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }} />
            </div>
            
            {/* Diagonal lines */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '80px 80px'
            }} />
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-6 text-center z-10">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight">
                Private.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 animate-gradient font-bold">Secure.</span>
                <br />
                Simple.
              </h1>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                The future of anonymous commerce, powered by Monero.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/listings"
                className="group px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-black font-medium rounded-full hover:from-emerald-400 hover:to-green-400 transition-all duration-500 text-lg transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
              >
                <span className="relative z-10 text-white font-semibold">Explore Marketplace</span>
              </Link>
              {!session && (
                <Link
                  href="/login"
                  className="group relative px-10 py-4 border border-emerald-500/30 text-white font-medium rounded-full hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-all duration-500 text-lg overflow-hidden"
                >
                  <span className="relative z-10 font-semibold">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </Link>
              )}
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
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
        <section className="py-32 relative">
          {/* Background elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium mb-4">SECURITY FIRST</span>
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6">Built for Privacy</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">Advanced security meets seamless experience</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-emerald-500/30 group-hover:to-green-500/30 transition-all duration-300">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-medium text-white mb-4">Anonymous</h3>
                <p className="text-gray-300 leading-relaxed">Complete privacy with Monero's untraceable transactions. Your identity remains protected at all times.</p>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-emerald-500/30 group-hover:to-green-500/30 transition-all duration-300">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-medium text-white mb-4">Instant</h3>
                <p className="text-gray-300 leading-relaxed">Lightning-fast transactions with optimized infrastructure. No waiting for confirmations.</p>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-emerald-500/30 group-hover:to-green-500/30 transition-all duration-300">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-medium text-white mb-4">Secure</h3>
                <p className="text-gray-300 leading-relaxed">Military-grade encryption and escrow protection. Your transactions are always protected.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-32 bg-black relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/3 right-1/4 w-1/4 h-1/4 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium mb-4">TESTIMONIALS</span>
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6">Trusted by Users</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">See what our community has to say about their experience</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-900/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-emerald-500/20 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-emerald-400 font-medium">JD</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">John D.</h4>
                    <p className="text-gray-400 text-sm">Verified User</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"The privacy features are unmatched. I can finally trade with complete confidence knowing my data is secure."</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-900/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-emerald-500/20 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-emerald-400 font-medium">AS</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Alex S.</h4>
                    <p className="text-gray-400 text-sm">Verified Seller</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"As a seller, the platform makes it incredibly easy to list products and manage transactions securely."</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-900/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-emerald-500/20 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-emerald-400 font-medium">ML</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Maria L.</h4>
                    <p className="text-gray-400 text-sm">Verified User</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"The escrow system gives me peace of mind. Transactions are smooth and the interface is intuitive."</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
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
              {!session && (
                <Link
                  href="/auth"
                  className="group px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
                >
                  <span className="relative z-10">Get Started</span>
                </Link>
              )}
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

