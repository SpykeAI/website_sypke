"use client";

import React from "react";
import Link from "next/link";
import { Phone, MessageSquare, Sparkles, ArrowRight } from "lucide-react";

interface MobileStickyCTAProps {
  customAuditLink?: string;
}

export default function MobileStickyCTA({ customAuditLink = "/contact#lead-form" }: MobileStickyCTAProps) {
  return (
    <div className="md:hidden fixed bottom-3 left-0 right-0 z-50 px-3 pointer-events-none safe-area-pb">
      <div className="flex items-center gap-2 max-w-lg mx-auto pointer-events-auto">
        {/* 1. Call Button */}
        <a
          href="tel:+13464770028"
          className="flex flex-col items-center justify-center w-14 h-12 rounded-2xl bg-white hover:bg-gray-50 text-gray-900 border border-gray-200/90 shadow-md transition active:scale-95 shrink-0"
          aria-label="Call Spyke AI"
          title="Call +1 (346) 477-0028"
        >
          <Phone size={17} className="text-[#00DF81] fill-[#00DF81]/20 mb-0.5" />
          <span className="text-[10px] font-bold text-gray-800 tracking-tight">Call</span>
        </a>

        {/* 2. Chat Button (WhatsApp Direct) */}
        <a
          href="https://wa.me/919014107407?text=Hi%20SpykeAI%2C%20I%20want%20to%20learn%20more%20about%20HVAC%20Voice%20Agents"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center w-14 h-12 rounded-2xl bg-white hover:bg-gray-50 text-gray-900 border border-gray-200/90 shadow-md transition active:scale-95 shrink-0"
          aria-label="Chat with Spyke AI on WhatsApp"
          title="Chat on WhatsApp"
        >
          <MessageSquare size={17} className="text-[#00DF81] fill-[#00DF81]/20 mb-0.5" />
          <span className="text-[10px] font-bold text-gray-800 tracking-tight">Chat</span>
        </a>

        {/* 3. Book Technical Audit Primary Action (Exact Spyke AI Brand Green #00DF81) */}
        <Link
          href={customAuditLink}
          className="flex-1 h-12 bg-[#00DF81] hover:bg-[#00c271] active:scale-[0.98] text-gray-900 font-extrabold text-xs sm:text-sm rounded-2xl px-3 flex items-center justify-center gap-1.5 shadow-lg shadow-[#00DF81]/30 transition-all border border-[#00DF81]"
        >
          <Sparkles size={16} className="text-gray-900 fill-gray-900/20 shrink-0" />
          <span className="truncate">Book Technical Audit</span>
          <ArrowRight size={14} className="text-gray-900 shrink-0 opacity-80" />
        </Link>
      </div>
    </div>
  );
}
