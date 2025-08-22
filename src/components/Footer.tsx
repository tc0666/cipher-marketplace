import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-medium text-sm">CM</span>
              </div>
              <h3 className="text-xl font-light text-white">Cipher Market</h3>
            </div>
            <p className="text-gray-400 mb-8 max-w-md font-light leading-relaxed">
              The future of private commerce. Experience true digital freedom with our secure, 
              anonymous marketplace.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-medium text-white mb-6">Navigation</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors duration-300 font-light">Home</Link></li>
              <li><Link href="/listings" className="text-gray-400 hover:text-white transition-colors duration-300 font-light">Marketplace</Link></li>
              <li><Link href="/auth" className="text-gray-400 hover:text-white transition-colors duration-300 font-light">Get Started</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium text-white mb-6">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-light">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-light">Security Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-light">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-light">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800/50 text-center">
          <p className="text-gray-500 font-light">
            © 2025 Cipher Market. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}