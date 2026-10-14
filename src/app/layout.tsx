import type { Metadata } from "next";
import { League_Spartan, Kumbh_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";

const leagueSpartan = League_Spartan({ 
  subsets: ["latin"],
  variable: '--font-league-spartan'
});

const kumbhSans = Kumbh_Sans({ 
  subsets: ["latin"],
  variable: '--font-kumbh-sans'
});

export const metadata: Metadata = {
  title: "Spyke AI Tech | HVAC Voice Agents & Messaging",
  description: "Never miss an emergency AC repair call. AI voice agents for HVAC, plumbing, and electrical businesses in the USA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} ${kumbhSans.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans">
        <AppLayoutWrapper>
          {children}
        </AppLayoutWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
