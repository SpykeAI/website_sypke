import type { Metadata } from "next";
import { League_Spartan, Kumbh_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

const leagueSpartan = League_Spartan({ 
  subsets: ["latin"],
  variable: '--font-league-spartan'
});

const kumbhSans = Kumbh_Sans({ 
  subsets: ["latin"],
  variable: '--font-kumbh-sans'
});

export const metadata: Metadata = {
  title: "Spyke AI Tech | AI Voice Agents",
  description: "Next-gen AI voice agents that solve missed calls, handle follow-ups, and reactivate dormant leads.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} ${kumbhSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        <header className="bg-[#0a0a0a] border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-3xl font-bold text-[#00DF81] font-heading tracking-tight">
                  Spyke<span className="text-white">AI</span>
                </Link>
              </div>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-300 hover:text-[#00DF81] font-medium transition text-sm">Home</Link>
                <Link href="/about" className="text-gray-300 hover:text-[#00DF81] font-medium transition text-sm">About Us</Link>
                <Link href="/contact" className="text-gray-300 hover:text-[#00DF81] font-medium transition text-sm">Contact Us</Link>
                <Link href="/privacy" className="text-gray-300 hover:text-[#00DF81] font-medium transition text-sm">Privacy</Link>
                <Link href="/terms" className="text-gray-300 hover:text-[#00DF81] font-medium transition text-sm">Terms</Link>
              </nav>
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/contact"
                  className="bg-[#00DF81] text-black px-6 py-2.5 rounded-md font-bold hover:bg-[#00C271] transition"
                >
                  Book an Appointment
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col">{children}</main>

        <footer className="bg-[#0a0a0a] text-white py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <span className="text-3xl font-bold text-[#00DF81] font-heading tracking-tight">Spyke<span className="text-white">AI</span></span>
                <p className="mt-4 text-gray-400 max-w-sm">
                  Empowering businesses with AI voice agents that never sleep, never drop the ball, and drive better conversions.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4 font-heading text-white">Quick Links</h3>
                <ul className="space-y-3 text-gray-400">
                  <li><Link href="/" className="hover:text-[#00DF81] transition">Home</Link></li>
                  <li><Link href="/about" className="hover:text-[#00DF81] transition">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-[#00DF81] transition">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4 font-heading text-white">Legal</h3>
                <ul className="space-y-3 text-gray-400">
                  <li><Link href="/privacy" className="hover:text-[#00DF81] transition">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-[#00DF81] transition">Terms & Conditions</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-600">
              <p>&copy; {new Date().getFullYear()} Spyke AI Technologies. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Floating Voice Widget */}
        <div className="fixed bottom-6 right-6 z-50">
          <button className="bg-[#00DF81] text-black p-4 rounded-full shadow-2xl hover:bg-[#00C271] transition flex items-center justify-center transform hover:scale-105 active:scale-95 animate-bounce">
            <MessageSquare size={28} />
          </button>
        </div>
      </body>
    </html>
  );
}
