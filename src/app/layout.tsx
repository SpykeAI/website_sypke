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
  metadataBase: new URL("https://spykeai.com"),
  title: {
    default: "Spyke AI | AI Voice Agents & Business Automation",
    template: "%s | Spyke AI",
  },
  description:
    "Never miss an emergency call or qualified lead. Human-like AI voice agents and smart automations for HVAC, real estate, and service businesses.",
  keywords: [
    "AI Voice Agents",
    "HVAC AI Answering Service",
    "Real Estate AI Voice Agent",
    "GoHighLevel Automation",
    "AI Call Dispatch",
    "Conversational AI",
    "Spyke AI",
  ],
  authors: [{ name: "Spyke AI Technologies", url: "https://spykeai.com" }],
  creator: "Spyke AI Technologies",
  publisher: "Spyke AI Technologies",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Spyke AI | AI Voice Agents & Business Automation",
    description:
      "Never miss an emergency call or qualified lead. Human-like AI voice agents for 24/7 lead capture and booking.",
    url: "https://spykeai.com",
    siteName: "Spyke AI Technologies",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Spyke AI Technologies",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spyke AI | AI Voice Agents & Business Automation",
    description:
      "24/7 AI voice agents and smart automation for home services, real estate, and high-growth businesses.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://spykeai.com/#organization",
      "name": "Spyke AI Technologies",
      "alternateName": ["Spyke AI", "SpykeAI"],
      "url": "https://spykeai.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://spykeai.com/logo.png",
      },
      "description":
        "Enterprise AI voice agents, multi-channel messaging, and CRM automation for HVAC, home services, and real estate businesses.",
      "founder": {
        "@type": "Person",
        "name": "Srikanishka Vadakattu",
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-346-477-0028",
        "contactType": "customer service",
        "email": "contact@spykeai.com",
        "areaServed": ["US", "IN"],
        "availableLanguage": ["English", "Hindi"],
      },
      "sameAs": [
        "https://www.linkedin.com/company/spyke-ai",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://spykeai.com/#website",
      "url": "https://spykeai.com",
      "name": "Spyke AI Technologies",
      "publisher": {
        "@id": "https://spykeai.com/#organization",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} ${kumbhSans.variable} h-full antialiased scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
