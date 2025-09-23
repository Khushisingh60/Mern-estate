import React from 'react'

export default function Footer() {
  return (
    <div className="bg-slate-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Estate Ease</h3>
              </div>
              <p className="text-white text-sm leading-relaxed opacity-90">
                Your trusted partner in finding the perfect home. We make real estate transactions simple, transparent, and stress-free.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-blue-400 transition-colors opacity-90 hover:opacity-100">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-blue-400 transition-colors opacity-90 hover:opacity-100">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-blue-400 transition-colors opacity-90 hover:opacity-100">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.085.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.986C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-blue-400 transition-colors opacity-90 hover:opacity-100">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white hover:text-blue-400 transition-colors text-sm opacity-90 hover:opacity-100">Buy Properties</a></li>
                <li><a href="#" className="text-white hover:text-blue-400 transition-colors text-sm opacity-90 hover:opacity-100">Sell Properties</a></li>
                <li><a href="#" className="text-white hover:text-blue-400 transition-colors text-sm opacity-90 hover:opacity-100">Rent Properties</a></li>
                <li><a href="#" className="text-white hover:text-blue-400 transition-colors text-sm opacity-90 hover:opacity-100">Property Management</a></li>
                <li><a href="#" className="text-white hover:text-blue-400 transition-colors text-sm opacity-90 hover:opacity-100">Market Analysis</a></li>
                <li><a href="#" className="text-white hover:text-blue-400 transition-colors text-sm opacity-90 hover:opacity-100">About Us</a></li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Our Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white hover:text-blue-400 transition-colors text-sm opacity-90 hover:opacity-100">Residential Sales</a></li>
                <li><a href="#" className="text-white hover:text-blue-400 transition-colors text-sm opacity-90 hover:opacity-100">Commercial Real Estate</a></li>
                <li><a href="#" className="text-white hover:text-blue-400 transition-colors text-sm opacity-90 hover:opacity-100">Property Valuation</a></li>
                <li><a href="#" className="text-white hover:text-blue-400 transition-colors text-sm opacity-90 hover:opacity-100">Investment Consulting</a></li>
                <li><a href="#" className="text-white hover:text-blue-400 transition-colors text-sm opacity-90 hover:opacity-100">Mortgage Assistance</a></li>
                <li><a href="#" className="text-white hover:text-blue-400 transition-colors text-sm opacity-90 hover:opacity-100">Legal Support</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-white mt-1 opacity-90" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-white text-sm opacity-90">123 Real Estate Ave<br />City Center, State 12345</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-white opacity-90" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  <span className="text-white text-sm opacity-90">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-white opacity-90" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span className="text-white text-sm opacity-90">info@estateease.com</span>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-white mt-1 opacity-90" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-white text-sm opacity-90">Mon-Fri: 9AM-6PM<br />Sat: 10AM-4PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-slate-600 py-8">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-4">Stay Updated with Market Trends</h4>
            <p className="text-white text-sm mb-6 opacity-90">Subscribe to our newsletter for the latest property listings and market insights.</p>
            <div className="max-w-md mx-auto flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-2 border border-slate-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-600 text-white placeholder-slate-300"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-600 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white text-sm opacity-90">
              © 2025 Estate Ease. 
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              <a href="#" className="text-white hover:text-blue-400 transition-colors text-sm opacity-90 hover:opacity-100">Privacy Policy</a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors text-sm opacity-90 hover:opacity-100">Terms of Service</a>
            
            </div>
          </div>
        </div>

        {/* Professional Certifications */}
        
      </div>
    </div>
  )
}