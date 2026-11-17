"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" onClick={closeMenu}>
              <img src="/logo.png" alt="SpykeAI Logo" className="h-14 md:h-16 w-auto object-contain" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            <Link href="/" className="text-gray-600 hover:text-[#00DF81] font-bold transition text-sm">Home</Link>
            <Link href="/aboutus" className="text-gray-600 hover:text-[#00DF81] font-bold transition text-sm">About Us</Link>
            <Link href="/privacy-policy" className="text-gray-600 hover:text-[#00DF81] font-bold transition text-sm">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="text-gray-600 hover:text-[#00DF81] font-bold transition text-sm">Terms & Conditions</Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#00DF81] font-bold transition text-sm">Contact Us</Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/#lead-form"
              className="bg-[#00DF81] text-gray-900 px-6 py-2.5 rounded-full font-bold hover:bg-[#00c271] transition shadow-lg shadow-[#00DF81]/20"
            >
              Book a Call
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link href="/" className="block px-3 py-3 rounded-md text-base font-bold text-gray-700 hover:text-[#00DF81] hover:bg-gray-50" onClick={closeMenu}>Home</Link>
            <Link href="/aboutus" className="block px-3 py-3 rounded-md text-base font-bold text-gray-700 hover:text-[#00DF81] hover:bg-gray-50" onClick={closeMenu}>About Us</Link>
            <Link href="/privacy-policy" className="block px-3 py-3 rounded-md text-base font-bold text-gray-700 hover:text-[#00DF81] hover:bg-gray-50" onClick={closeMenu}>Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="block px-3 py-3 rounded-md text-base font-bold text-gray-700 hover:text-[#00DF81] hover:bg-gray-50" onClick={closeMenu}>Terms & Conditions</Link>
            <Link href="/contact" className="block px-3 py-3 rounded-md text-base font-bold text-gray-700 hover:text-[#00DF81] hover:bg-gray-50" onClick={closeMenu}>Contact Us</Link>
            <div className="pt-4 pb-2 px-3">
              <a
                href="/#lead-form"
                onClick={closeMenu}
                className="block text-center w-full bg-[#00DF81] text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-[#00c271] transition"
              >
                Book a Call
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
