'use client';

import { useState, useEffect } from 'react';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show footer after scrolling 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer 
      className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-12 sm:h-14 flex items-center justify-between w-full">
        <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis pr-2">
          &copy; {new Date().getFullYear()} Gridrr Inc.
          <span className="hidden xs:inline"> A subsidiary of Xys Holdings</span>
        </p>
        
        <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4 md:space-x-6">
          <a href="/about" className="text-[10px] xs:text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap">About</a>
          <a href="/privacy" className="text-[10px] xs:text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap">Privacy</a>
          <a href="/terms" className="text-[10px] xs:text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap">Terms</a>
          <a href="/contact" className="text-[10px] xs:text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap">Contact</a>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <a 
            href="https://twitter.com/gridrrofficial" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-gray-500 hover:text-[#1DA1F2] transition-colors whitespace-nowrap"
            aria-label="Twitter"
          >
            <span className="hidden sm:inline">Twitter</span>
            <svg className="w-4 h-4 sm:hidden" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
            </svg>
          </a>
          <a 
            href="https://instagram.com/gridrrofficial" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-gray-500 hover:text-[#E1306C] transition-colors whitespace-nowrap"
            aria-label="Instagram"
          >
            <span className="hidden sm:inline">Instagram</span>
            <svg className="w-4 h-4 sm:hidden" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12.001 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>
          <a 
            href="https://linkedin.com/company/gridrr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-gray-500 hover:text-[#0A66C2] transition-colors whitespace-nowrap"
            aria-label="LinkedIn"
          >
            <span className="hidden sm:inline">LinkedIn</span>
            <svg className="w-4 h-4 sm:hidden" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
