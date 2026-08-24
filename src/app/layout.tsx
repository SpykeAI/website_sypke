import type { Metadata } from "next";
import { League_Spartan, Kumbh_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Mic, MessageCircle, Phone, ArrowRight, PhoneCall, Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";

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
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-600 hover:text-[#00DF81] font-bold transition text-sm">Home</Link>
                <Link href="/about" className="text-gray-600 hover:text-[#00DF81] font-bold transition text-sm">About Us</Link>
                <Link href="/contact" className="text-gray-600 hover:text-[#00DF81] font-bold transition text-sm">Contact Us</Link>
              </nav>
              <div className="hidden md:flex items-center space-x-4">
                <a
                  href="#lead-form"
                  className="bg-[#00DF81] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#00c271] transition shadow-lg shadow-[#00DF81]/20"
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
                <div className="flex space-x-4 mt-8">
                  <a href="https://www.facebook.com/Spykeaitech/" target="_blank" className="text-gray-400 hover:text-[#00DF81] transition"><Facebook size={24} /></a>
                  <a href="https://www.instagram.com/spykeai/" target="_blank" className="text-gray-400 hover:text-[#00DF81] transition"><Instagram size={24} /></a>
                  <a href="https://www.linkedin.com/company/spykeai/" target="_blank" className="text-gray-400 hover:text-[#00DF81] transition"><Linkedin size={24} /></a>
                  <a href="https://x.com/spykeai" target="_blank" className="text-gray-400 hover:text-[#00DF81] transition"><Twitter size={24} /></a>
                  <a href="https://www.youtube.com/@SpykeAITech" target="_blank" className="text-gray-400 hover:text-[#00DF81] transition"><Youtube size={24} /></a>
                  <a href="https://linktr.ee/spykeai" target="_blank" className="text-gray-400 hover:text-[#00DF81] font-bold transition flex items-center ml-2">Linktree</a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-6 font-heading text-gray-900 uppercase tracking-wider">Quick Links</h3>
                <ul className="space-y-4 font-medium text-gray-600">
                  <li><Link href="/" className="hover:text-[#00DF81] transition">Home</Link></li>
                  <li><Link href="/about" className="hover:text-[#00DF81] transition">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-[#00DF81] transition">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-6 font-heading text-gray-900 uppercase tracking-wider">Legal</h3>
                <ul className="space-y-4 font-medium text-gray-600">
                  <li><Link href="/privacy" className="hover:text-[#00DF81] transition">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-[#00DF81] transition">Terms & Conditions</Link></li>
                  <li><Link href="/refund" className="hover:text-[#00DF81] transition">Refund Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 font-medium">
              <p>&copy; {new Date().getFullYear()} Spyke AI Technologies. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Floating Voice Widget */}
        <div className="fixed bottom-28 md:bottom-8 right-6 z-40 hidden md:block">
          <button className="bg-white text-[#00DF81] p-4 rounded-full shadow-2xl border-2 border-[#00DF81] hover:bg-gray-50 transition flex items-center justify-center transform hover:scale-105 active:scale-95">
            <Mic size={28} />
          </button>
        </div>

        {/* Sticky Bottom Mobile CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 flex justify-between items-center gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] md:hidden">
          <a href="http://wa.link/18sxk1" target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-xl font-bold">
            <MessageCircle size={20} />
            WhatsApp
          </a>
          <a href="#lead-form" className="flex-1 flex items-center justify-center gap-2 bg-[#00DF81] text-white py-3.5 rounded-xl font-bold">
            <PhoneCall size={20} />
            Book a Call
          </a>
        </div>
      </body>
    </html>
  );
}
