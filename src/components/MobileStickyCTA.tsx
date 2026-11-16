"use client";

import React from "react";
import Link from "next/link";
import { Phone, MessageSquare, Sparkles, ArrowRight } from "lucide-react";

interface MobileStickyCTAProps {
  customAuditLink?: string;
}

export default function MobileStickyCTA({ customAuditLink = "/contact#lead-form" }: MobileStickyCTAProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/90 px-3 py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.35)] safe-area-pb">
      <div className="flex items-center gap-2 max-w-lg mx-auto">
        {/* 1. Call Button */}
        <a
          href="tel:+13464770028"
          className="flex flex-col items-center justify-center w-14 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition active:scale-95 shrink-0"
          aria-label="Call Spyke AI"
          title="Call +1 (346) 477-0028"
        >
          <Phone size={18} className="text-emerald-400 mb-0.5" />
          <span className="text-[10px] font-bold text-slate-300 tracking-tight">Call</span>
        </a>

        {/* 2. Chat Button (WhatsApp Direct) */}
        <a
          href="https://wa.me/919014107407?text=Hi%20SpykeAI%2C%20I%20want%20to%20learn%20more%20about%20HVAC%20Voice%20Agents"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center w-14 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition active:scale-95 shrink-0"
          aria-label="Chat with Spyke AI on WhatsApp"
          title="Chat on WhatsApp"
        >
          <MessageSquare size={18} className="text-emerald-400 mb-0.5" />
          <span className="text-[10px] font-bold text-slate-300 tracking-tight">Chat</span>
        </a>

        {/* 3. Book Technical Audit Primary Action */}
        <Link
          href={customAuditLink}
          className="flex-1 h-12 bg-gradient-to-r from-emerald-500 via-emerald-400 to-[#00DF81] hover:brightness-105 active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm rounded-xl px-3 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all border border-emerald-300/40"
        >
          <Sparkles size={16} className="text-slate-950 fill-slate-950/20 shrink-0" />
          <span className="truncate">Book Technical Audit</span>
          <ArrowRight size={14} className="text-slate-950 shrink-0 opacity-75" />
        </Link>
      </div>
    </div>
  );
}
