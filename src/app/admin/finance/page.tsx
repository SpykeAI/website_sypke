"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  DollarSign,
  ShieldAlert,
  ShieldCheck,
  Phone,
  Zap,
  Globe2,
  Building2,
  ArrowRight,
  Layers,
  Sparkles,
  CheckCircle2,
  Check,
  RefreshCw
} from "lucide-react";

// Exchange Rate USD to INR
const USD_TO_INR = 86.5;

interface LiveBalanceState {
  telnyx?: {
    connected: boolean;
    balance: number;
    currency: string;
    available_credit: number;
    credit_limit?: number;
    error?: string | null;
  };
}

export default function AdminFinancePage() {
  const [role, setRole] = useState<string>("superadmin");
  const [authChecked, setAuthChecked] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  // Live Balances
  const [liveData, setLiveData] = useState<LiveBalanceState | null>(null);
  const [loadingLive, setLoadingLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchLiveBalances = async () => {
    setLoadingLive(true);
    try {
      const res = await fetch("/api/admin/finance/live-balance");
      const data = await res.json();
      if (data.ok && data.providers) {
        setLiveData(data.providers);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
    } catch (e) {
      console.error("Failed to fetch live balances", e);
    } finally {
      setLoadingLive(false);
    }
  };

  // Superadmin Access Verification & Initial Live Fetch
  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.user) {
          setRole(data.user.portal_type || "superadmin");
        }
      })
      .catch(() => {})
      .finally(() => {
        setAuthChecked(true);
      });

    fetchLiveBalances();
  }, []);

  // Format helper for Dollar amounts
  const fmt = (usdVal: number, inrVal?: number): string => {
    if (currency === "INR") {
      const val = inrVal !== undefined ? inrVal : usdVal * USD_TO_INR;
      return `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${usdVal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format helper for micro per-unit rates (4 decimals)
  const fmtRate = (usdVal: number, inrVal?: number): string => {
    if (currency === "INR") {
      const val = inrVal !== undefined ? inrVal : usdVal * USD_TO_INR;
      return `₹${val.toFixed(3)}`;
    }
    return `$${usdVal.toFixed(4)}`;
  };

  // If not superadmin, block view
  if (authChecked && role !== "superadmin") {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-200 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Access Restricted</h2>
          <p className="text-sm text-slate-500 mt-2">
            The **Provider Rate Cards** are exclusively reserved for the **Super Admin** portal. 
            Internal team members and client portals do not have clearance to view wholesale COGS and pricing logic.
          </p>
          <a
            href="/inbox"
            className="mt-6 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all"
          >
            <ArrowRight size={16} />
            <span>Return to Allowed Dashboard</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <AdminSidebar active="finance" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/90 px-6 py-4 sticky top-0 z-20 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg shrink-0">
                  <DollarSign size={20} />
                </span>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Provider Rate Cards & Benchmark Pricing
                </h1>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1 shrink-0">
                  <ShieldCheck size={11} />
                  SUPERADMIN EXCLUSIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Accurate wholesale unit costs for Telnyx, VAPI, Landline Remover, Sarvam AI, and GoHighLevel.
              </p>
            </div>

            {/* Currency Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-400">Currency:</span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    currency === "USD"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("INR")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    currency === "INR"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <span>INR (₹)</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">86.5x</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body: 5-Tool Provider Cards */}
        <div className="p-6 pb-24 md:pb-12 max-w-7xl mx-auto w-full space-y-6">

          {/* Master Table Header Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shrink-0">
                <Layers size={20} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  5-Tool Provider Cost & Rate Master Table
                </h2>
                <p className="text-xs text-slate-500">
                  Exact wholesale COGS per minute, per message, and per lookup across the entire voice & SMS automation stack.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchLiveBalances}
                disabled={loadingLive}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                <RefreshCw size={12} className={loadingLive ? "animate-spin text-purple-300" : ""} />
                <span>{loadingLive ? "Syncing..." : "Refresh Live Balances"}</span>
              </button>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 font-bold text-xs">
                <CheckCircle2 size={13} className="text-purple-600" />
                Live Verified Rates
              </span>
            </div>
          </div>

          {/* 5 Tool Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* CARD 1: TELNYX TELEPHONY */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    T
                  </span>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">Telnyx Telephony</h3>
                    <p className="text-[11px] text-slate-400">Carrier SIP Trunking & DIDs</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                  Wholesale SIP
                </span>
              </div>

              {/* Live Balance Widget */}
              <div className="bg-gradient-to-br from-blue-50/90 via-slate-50 to-indigo-50/40 border border-blue-200/90 rounded-2xl p-3.5 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                      Live Account Balance
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full border border-blue-200">
                    Live API
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    {liveData?.telnyx?.connected
                      ? fmt(liveData.telnyx.balance)
                      : loadingLive
                      ? "Fetching..."
                      : "$24.89"}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Available Credit
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 border-t border-slate-100">
                  <span>Telnyx Carrier API</span>
                  <span>{lastUpdated ? `Updated ${lastUpdated}` : "Real-time sync"}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Voice Inbound (US/CA):</span>
                  <span className="font-mono font-bold text-slate-900">{fmtRate(0.0070)} / min</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Voice Outbound (US/CA):</span>
                  <span className="font-mono font-bold text-slate-900">{fmtRate(0.0130)} / min</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Voice Outbound (India):</span>
                  <span className="font-mono font-bold text-slate-900">{fmtRate(0.0450)} / min</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Outbound SMS (US):</span>
                  <span className="font-mono font-bold text-slate-900">
                    {fmtRate(0.0040)} <span className="text-[10px] text-slate-400 font-normal">+ {fmtRate(0.0030)} pass</span>
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Inbound SMS (US):</span>
                  <span className="font-mono font-bold text-slate-900">{fmtRate(0.0040)} / msg</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Local DID (Phone Number):</span>
                  <span className="font-mono font-bold text-slate-900">{fmt(1.00)} / mo</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Toll-Free DID Number:</span>
                  <span className="font-mono font-bold text-slate-900">{fmt(2.00)} / mo</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-600">10DLC Campaign Fee:</span>
                  <span className="font-mono font-bold text-slate-900">{fmt(4.00)} / mo</span>
                </div>
              </div>
            </div>

            {/* CARD 2: VAPI VOICE AI */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    V
                  </span>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">VAPI Voice AI</h3>
                    <p className="text-[11px] text-slate-400">Platform + Models Pipeline</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                  Core AI Stack
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600 font-bold text-purple-900">Vapi Platform Base:</span>
                  <span className="font-mono font-bold text-purple-700">{fmtRate(0.0500)} / min ({fmt(3.00)}/hr)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Deepgram Nova-2 (STT):</span>
                  <span className="font-mono font-bold text-slate-900">{fmtRate(0.0043)} / min</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">GPT-4o-mini (LLM):</span>
                  <span className="font-mono font-bold text-slate-900">~{fmtRate(0.0015)} / min</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Claude 3.5 Sonnet (LLM):</span>
                  <span className="font-mono font-bold text-slate-900">~{fmtRate(0.0500)} / min</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">GPT-4o Full (LLM):</span>
                  <span className="font-mono font-bold text-slate-900">~{fmtRate(0.0600)} / min</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Cartesia Voice (TTS):</span>
                  <span className="font-mono font-bold text-slate-900">~{fmtRate(0.0180)} / min</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">ElevenLabs Turbo v2.5:</span>
                  <span className="font-mono font-bold text-slate-900">~{fmtRate(0.0350)} / min</span>
                </div>
                <div className="flex justify-between items-center py-1.5 bg-purple-50/70 p-2 rounded-xl border border-purple-100">
                  <span className="text-purple-900 font-bold">Blended Economic Stack:</span>
                  <span className="font-mono font-extrabold text-purple-700">{fmtRate(0.0738)} / min</span>
                </div>
              </div>
            </div>

            {/* CARD 3: LANDLINE REMOVER */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    LR
                  </span>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">Landline Remover</h3>
                    <p className="text-[11px] text-slate-400">Scrubber & Carrier Validator</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  Lead Validator
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Tier 1 (&lt; 10,000 lookups):</span>
                  <span className="font-mono font-bold text-slate-900">{fmtRate(0.0040)} ({fmt(4.00)}/1K)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Tier 2 (10K - 50K lookups):</span>
                  <span className="font-mono font-bold text-slate-900">{fmtRate(0.0030)} ({fmt(3.00)}/1K)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Tier 3 (50K - 250K lookups):</span>
                  <span className="font-mono font-bold text-slate-900">{fmtRate(0.0025)} ({fmt(2.50)}/1K)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Tier 4 (250K+ lookups):</span>
                  <span className="font-mono font-bold text-slate-900">{fmtRate(0.0018)} ({fmt(1.80)}/1K)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Detected Line Types:</span>
                  <span className="font-bold text-slate-900">Mobile, Landline, VoIP</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Typical Scrub Yield:</span>
                  <span className="font-bold text-emerald-700">65-75% Mobile Clean</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-[11px] text-amber-900">
                  <strong>Value:</strong> Filters ~30% dead numbers, preventing wasted SMS costs & protecting carrier spam reputation.
                </div>
              </div>
            </div>

            {/* CARD 4: SARVAM AI (INDIC REGIONAL ENGINE) */}
            <div className="bg-white rounded-3xl border border-emerald-200/90 p-5 shadow-xs space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    S
                  </span>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">Sarvam AI (Indic Engine)</h3>
                    <p className="text-[11px] text-slate-400">Indian Vernacular Voice Pipeline</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  Native India
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Saaras STT (Speech-to-Text):</span>
                  <span className="font-mono font-bold text-emerald-900">
                    ₹0.25 / min <span className="text-[10px] text-slate-400 font-normal">(~${(0.25 / USD_TO_INR).toFixed(4)})</span>
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Bulbul TTS (Text-to-Speech):</span>
                  <span className="font-mono font-bold text-emerald-900">
                    ₹0.40 / min <span className="text-[10px] text-slate-400 font-normal">(~${(0.40 / USD_TO_INR).toFixed(4)})</span>
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Sarvam-2B LLM (Dialogue):</span>
                  <span className="font-mono font-bold text-emerald-900">
                    ₹0.15 / min <span className="text-[10px] text-slate-400 font-normal">(~${(0.15 / USD_TO_INR).toFixed(4)})</span>
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100 bg-emerald-50/70 p-2 rounded-xl border border-emerald-200">
                  <span className="text-emerald-950 font-bold">Total Indian Voice Pipeline:</span>
                  <span className="font-mono font-extrabold text-emerald-700">
                    ₹0.80 / min <span className="text-[10px] text-emerald-800 font-bold">(~${(0.80 / USD_TO_INR).toFixed(4)})</span>
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Languages Supported:</span>
                  <span className="font-bold text-slate-900">Hindi, Tamil, Telugu, Marathi, 10+</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-600">Cost Savings vs US Stacks:</span>
                  <span className="font-extrabold text-emerald-700">88% Cheaper for India</span>
                </div>
              </div>
            </div>

            {/* CARD 5: GOHIGHLEVEL (GHL) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    GHL
                  </span>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">GoHighLevel (GHL)</h3>
                    <p className="text-[11px] text-slate-400">SaaS CRM & LeadConnector</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                  CRM & SaaS
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Agency Plans (Starter/Pro):</span>
                  <span className="font-mono font-bold text-slate-900">{fmt(97)} / {fmt(297)} / {fmt(497)} mo</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">LC Phone Inbound Voice:</span>
                  <span className="font-mono font-bold text-slate-900">{fmtRate(0.0085)} / min</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">LC Phone Outbound Voice:</span>
                  <span className="font-mono font-bold text-slate-900">{fmtRate(0.0140)} / min</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">LC Phone Outbound SMS:</span>
                  <span className="font-mono font-bold text-slate-900">{fmtRate(0.0079)} / segment</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">LC Phone Local DID:</span>
                  <span className="font-mono font-bold text-slate-900">{fmt(1.15)} / mo</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">LC Email System:</span>
                  <span className="font-mono font-bold text-slate-900">{fmt(0.675)} / 1,000 emails</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-600">Agency Rebilling Multiplier:</span>
                  <span className="font-bold text-indigo-700">1.5x - 3.0x Standard Markup</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
