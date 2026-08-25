import type { Metadata } from "next";
import { League_Spartan, Kumbh_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Mic, MessageCircle, Phone, ArrowRight, PhoneCall } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const leagueSpartan = League_Spartan({ 
  subsets: ["latin"],
  variable: '--font-league-spartan'
});

const kumbhSans = Kumbh_Sans({ 
  subsets: ["latin"],
  variable: '--font-kumbh-sans'
});

export const metadata: Metadata = {
  title: "Spyke AI Tech | HVAC Voice Agents",
  description: "Never miss an emergency AC repair call. AI voice agents for HVAC, plumbing, and electrical businesses in the USA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} ${kumbhSans.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans pb-24 md:pb-0">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-3xl font-bold text-[#00DF81] font-heading tracking-tight">
                  Spyke<span className="text-gray-900">AI</span>
                </Link>
              </div>
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
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-50 text-gray-900 py-16 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                <span className="text-3xl font-bold text-[#00DF81] font-heading tracking-tight">Spyke<span className="text-gray-900">AI</span></span>
                <p className="mt-6 text-gray-600 max-w-sm leading-relaxed font-medium">
                  Empowering HVAC companies with AI voice agents that never sleep, never drop the ball, and drive better conversions.
                </p>
                <div className="flex flex-wrap gap-4 mt-8">
                  <a href="https://www.facebook.com/Spykeaitech/" target="_blank" className="text-gray-400 hover:text-[#00DF81] transition" aria-label="Facebook">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/spykeai/" target="_blank" className="text-gray-400 hover:text-[#00DF81] transition" aria-label="Instagram">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/company/spykeai/" target="_blank" className="text-gray-400 hover:text-[#00DF81] transition" aria-label="LinkedIn">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="https://x.com/spykeai" target="_blank" className="text-gray-400 hover:text-[#00DF81] transition" aria-label="X">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                  </a>
                  <a href="https://www.youtube.com/@SpykeAITech" target="_blank" className="text-gray-400 hover:text-[#00DF81] transition" aria-label="YouTube">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a href="https://linktr.ee/spykeai" target="_blank" className="text-gray-400 hover:text-[#00DF81] transition" aria-label="Linktree">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="m13.736 5.853 4.005-4.117 2.325 2.38-4.2 4.005h5.908v3.305h-5.937l4.229 4.108-2.325 2.334-5.74-5.769v11.722h-3.328V12.1l-5.74 5.769-2.325-2.325 4.229-4.108H4.225V8.126h5.908l-4.2-4.005 2.325-2.38 4.005 4.117V.11h3.473v5.743z"/></svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-6 font-heading text-gray-900 uppercase tracking-wider">Quick Links</h3>
                <ul className="space-y-4 font-medium text-gray-600">
                  <li><Link href="/" className="hover:text-[#00DF81] transition">Home</Link></li>
                  <li><Link href="/aboutus" className="hover:text-[#00DF81] transition">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-[#00DF81] transition">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-6 font-heading text-gray-900 uppercase tracking-wider">Legal</h3>
                <ul className="space-y-4 font-medium text-gray-600">
                  <li><Link href="/privacy-policy" className="hover:text-[#00DF81] transition">Privacy Policy</Link></li>
                  <li><Link href="/terms-and-conditions" className="hover:text-[#00DF81] transition">Terms & Conditions</Link></li>
                  <li><Link href="/refund-and-cancellation" className="hover:text-[#00DF81] transition">Refund Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 font-medium">
              <p>&copy; {new Date().getFullYear()} Spyke AI Technologies. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Floating Fixed WhatsApp Button (Desktop) */}
        <div className="fixed bottom-28 md:bottom-8 left-6 z-40 hidden md:block">
          <a 
            href="http://wa.link/18sxk1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#25D366] text-gray-900 p-4 rounded-full shadow-2xl border-2 border-[#25D366] hover:bg-[#1ebe5d] transition flex items-center justify-center transform hover:scale-105 active:scale-95"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle size={28} />
          </a>
        </div>

        {/* Floating Voice Widget */}
        <div className="fixed bottom-28 md:bottom-8 right-6 z-40 hidden md:block">
          <button className="bg-[#00DF81] text-gray-900 p-4 rounded-full shadow-2xl border-2 border-[#00DF81] hover:bg-[#00c271] transition flex items-center justify-center transform hover:scale-105 active:scale-95 animate-bounce">
            <Mic size={28} />
          </button>
        </div>

        {/* Sticky Bottom Mobile CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 flex justify-between items-center gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] md:hidden">
          <a href="http://wa.link/18sxk1" target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-gray-900 py-3.5 rounded-xl font-bold">
            <MessageCircle size={20} />
            WhatsApp
          </a>
          <a href="#lead-form" className="flex-1 flex items-center justify-center gap-2 bg-[#00DF81] text-gray-900 py-3.5 rounded-xl font-bold">
            <PhoneCall size={20} />
            Book a Call
          </a>
        </div>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
