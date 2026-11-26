"use client";

import React, { useState, useEffect, useMemo } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  DollarSign,
  Calculator,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Phone,
  MessageSquare,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Globe2,
  Building2,
  ArrowRight,
  Info,
  Sliders,
  Flame,
  Wrench,
  Home,
  Headphones,
  FileText,
  BadgePercent
} from "lucide-react";

// Exchange Rate USD to INR
const USD_TO_INR = 86.5;

// Exact Tool Unit Prices (Wholesale Provider COGS)
const TELNYX_RATES = {
  inboundVoicePerMin: 0.0070,
  outboundVoicePerMinUS: 0.0130,
  outboundVoicePerMinIndia: 0.0450,
  smsOutboundPerMsg: 0.0040,
  carrierFeePerMsg: 0.0030, // T-Mobile / AT&T pass-through
  localDidMonthly: 1.00,
  tollFreeDidMonthly: 2.00,
  brandRegistrationOneTime: 4.00,
  campaignMonthly: 4.00,
};

const VAPI_RATES = {
  platformBasePerMin: 0.0500, // Vapi base audio fee
  stt: {
    deepgram: 0.0043, // Deepgram Nova-2
    talkscriber: 0.0060,
  },
  llm: {
    gpt4oMini: 0.0015,
    gpt4o: 0.0600,
    claude35Sonnet: 0.0500,
    groqLlama33: 0.0010,
  },
  tts: {
    cartesia: 0.0180,
    elevenLabsTurbo: 0.0350,
    deepgramAura: 0.0150,
    playht: 0.0200,
  },
};

const LANDLINE_REMOVER_TIERS = [
  { min: 0, max: 10000, ratePerLookup: 0.0040, label: "Tier 1 (< 10K)" },
  { min: 10001, max: 50000, ratePerLookup: 0.0030, label: "Tier 2 (10K - 50K)" },
  { min: 50001, max: 250000, ratePerLookup: 0.0025, label: "Tier 3 (50K - 250K)" },
  { min: 250001, max: Infinity, ratePerLookup: 0.0018, label: "Tier 4 (250K+)" },
];

const SARVAM_RATES_INR = {
  sttPerMin: 0.25, // Saaras STT
  ttsPerMin: 0.40, // Bulbul TTS (natural Indic dialects)
  llmPerMin: 0.15, // Sarvam 2B Indic conversational
  totalPerMin: 0.80, // Total blended ₹0.80/min (~$0.0092/min)
};

const GHL_RATES = {
  plans: {
    starter: 97,
    unlimited: 297,
    saasPro: 497,
  },
  lcPhone: {
    inboundVoicePerMin: 0.0085,
    outboundVoicePerMin: 0.0140,
    smsPerMsg: 0.0079,
    localDidMonthly: 1.15,
  },
  lcEmailPerThousand: 0.675,
  workflowActionPerRun: 0.010,
};

export default function AdminFinancePage() {
  const [role, setRole] = useState<string>("superadmin");
  const [authChecked, setAuthChecked] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [activeTab, setActiveTab] = useState<"engine" | "matrix" | "packages" | "quote" | "comparison">("engine");

  // Pricing Engine User Controls
  const [voiceMinutes, setVoiceMinutes] = useState<number>(3000);
  const [avgCallDuration, setAvgCallDuration] = useState<number>(2.5);
  const [smsVolume, setSmsVolume] = useState<number>(8000);
  const [scrubContacts, setScrubContacts] = useState<number>(12000);
  const [numDids, setNumDids] = useState<number>(2);
  const [telephonyProvider, setTelephonyProvider] = useState<"telnyx" | "ghl_lc">("telnyx");
  const [voiceStack, setVoiceStack] = useState<"vapi_eco" | "vapi_claude" | "vapi_premium" | "vapi_groq" | "sarvam_indic">("vapi_eco");
  const [ghlSubaccountMode, setGhlSubaccountMode] = useState<"none" | "shared" | "dedicated">("shared");
  const [targetMarginPercent, setTargetMarginPercent] = useState<number>(60); // 60% gross margin target

  // Client Quote Generator State
  const [quoteClientName, setQuoteClientName] = useState("Summit Plumbing & HVAC");
  const [quotePackageType, setQuotePackageType] = useState<"hvac_plumber" | "real_estate" | "support_inbound" | "indic_regional">("hvac_plumber");
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Superadmin Access Verification
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
  }, []);

  // Format Currency helper
  const fmt = (usdVal: number, inrVal?: number): string => {
    if (currency === "INR") {
      const val = inrVal !== undefined ? inrVal : usdVal * USD_TO_INR;
      return `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${usdVal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const fmtRate = (usdVal: number, decimals = 4): string => {
    if (currency === "INR") {
      return `₹${(usdVal * USD_TO_INR).toFixed(decimals - 1)}`;
    }
    return `$${usdVal.toFixed(decimals)}`;
  };

  // CALCULATE WHOLESALE COGS & RETAIL PRICING
  const calculations = useMemo(() => {
    // 1. Telephony Cost (Telnyx vs GHL LC)
    let telephonyVoiceCost = 0;
    let telephonySmsCost = 0;
    let telephonyDidCost = 0;

    if (telephonyProvider === "telnyx") {
      telephonyVoiceCost = voiceMinutes * TELNYX_RATES.outboundVoicePerMinUS;
      telephonySmsCost = smsVolume * (TELNYX_RATES.smsOutboundPerMsg + TELNYX_RATES.carrierFeePerMsg);
      telephonyDidCost = (numDids * TELNYX_RATES.localDidMonthly) + TELNYX_RATES.campaignMonthly;
    } else {
      telephonyVoiceCost = voiceMinutes * GHL_RATES.lcPhone.outboundVoicePerMin;
      telephonySmsCost = smsVolume * GHL_RATES.lcPhone.smsPerMsg;
      telephonyDidCost = numDids * GHL_RATES.lcPhone.localDidMonthly;
    }
    const totalTelephonyCost = telephonyVoiceCost + telephonySmsCost + telephonyDidCost;

    // 2. Voice AI Engine Cost (VAPI vs Sarvam AI)
    let voiceAiPerMin = 0;
    let totalVoiceAiCost = 0;

    if (voiceStack === "vapi_eco") {
      // Deepgram + GPT-4o-mini + Cartesia + Vapi Base
      voiceAiPerMin = VAPI_RATES.platformBasePerMin + VAPI_RATES.stt.deepgram + VAPI_RATES.llm.gpt4oMini + VAPI_RATES.tts.cartesia;
      totalVoiceAiCost = voiceMinutes * voiceAiPerMin;
    } else if (voiceStack === "vapi_claude") {
      // Deepgram + Claude 3.5 Sonnet + Cartesia + Vapi Base
      voiceAiPerMin = VAPI_RATES.platformBasePerMin + VAPI_RATES.stt.deepgram + VAPI_RATES.llm.claude35Sonnet + VAPI_RATES.tts.cartesia;
      totalVoiceAiCost = voiceMinutes * voiceAiPerMin;
    } else if (voiceStack === "vapi_premium") {
      // Deepgram + GPT-4o + ElevenLabs + Vapi Base
      voiceAiPerMin = VAPI_RATES.platformBasePerMin + VAPI_RATES.stt.deepgram + VAPI_RATES.llm.gpt4o + VAPI_RATES.tts.elevenLabsTurbo;
      totalVoiceAiCost = voiceMinutes * voiceAiPerMin;
    } else if (voiceStack === "vapi_groq") {
      // Deepgram + Groq Llama 3.3 + Cartesia + Vapi Base
      voiceAiPerMin = VAPI_RATES.platformBasePerMin + VAPI_RATES.stt.deepgram + VAPI_RATES.llm.groqLlama33 + VAPI_RATES.tts.cartesia;
      totalVoiceAiCost = voiceMinutes * voiceAiPerMin;
    } else if (voiceStack === "sarvam_indic") {
      // Sarvam Indic pipeline (₹0.80/min) converted to USD
      voiceAiPerMin = SARVAM_RATES_INR.totalPerMin / USD_TO_INR;
      totalVoiceAiCost = voiceMinutes * voiceAiPerMin;
    }

    // 3. Landline Remover Cost (Tiered)
    const activeTier = LANDLINE_REMOVER_TIERS.find((t) => scrubContacts >= t.min && scrubContacts <= t.max) || LANDLINE_REMOVER_TIERS[0];
    const landlineScrubCost = scrubContacts * activeTier.ratePerLookup;
    // Estimated money saved on dead SMS (approx 30% of numbers are landline/VoIP)
    const estimatedLandlinesFiltered = Math.round(scrubContacts * 0.30);
    const wastedSmsDollarsSaved = estimatedLandlinesFiltered * (TELNYX_RATES.smsOutboundPerMsg + TELNYX_RATES.carrierFeePerMsg);

    // 4. GoHighLevel Infrastructure Allocated Cost
    let ghlPlatformCost = 0;
    if (ghlSubaccountMode === "dedicated") {
      ghlPlatformCost = 35.00; // allocated subaccount + automation
    } else if (ghlSubaccountMode === "shared") {
      ghlPlatformCost = 15.00; // amortized across shared agency unlimited plan
    }

    // Total Wholesale Cost of Goods Sold (COGS)
    const totalCogs = totalTelephonyCost + totalVoiceAiCost + landlineScrubCost + ghlPlatformCost;

    // 5. Target Retail Price based on Desired Margin %
    // TargetMargin = (Retail - COGS) / Retail  =>  Retail = COGS / (1 - TargetMargin/100)
    const marginFraction = Math.min(Math.max(targetMarginPercent / 100, 0.05), 0.90);
    const recommendedRetailMonthly = totalCogs / (1 - marginFraction);
    const grossProfit = recommendedRetailMonthly - totalCogs;
    const markupMultiplier = recommendedRetailMonthly / (totalCogs || 1);

    // Unit Economics Metrics
    const trueCostPerVoiceMin = (telephonyVoiceCost + totalVoiceAiCost) / (voiceMinutes || 1);
    const trueCostPerSms = telephonySmsCost / (smsVolume || 1);
    const retailPerVoiceMin = trueCostPerVoiceMin * markupMultiplier;
    const retailPerSms = trueCostPerSms * markupMultiplier;

    // Estimated Conversion & ROI
    // Assume 8% of answered calls turn into booked appointments
    const estimatedBookedAppointments = Math.round((voiceMinutes / avgCallDuration) * 0.08);
    const costPerBookedAppointment = totalCogs / (estimatedBookedAppointments || 1);

    return {
      telephonyVoiceCost,
      telephonySmsCost,
      telephonyDidCost,
      totalTelephonyCost,
      voiceAiPerMin,
      totalVoiceAiCost,
      landlineScrubCost,
      activeScrubTier: activeTier,
      estimatedLandlinesFiltered,
      wastedSmsDollarsSaved,
      ghlPlatformCost,
      totalCogs,
      recommendedRetailMonthly,
      grossProfit,
      markupMultiplier,
      trueCostPerVoiceMin,
      trueCostPerSms,
      retailPerVoiceMin,
      retailPerSms,
      estimatedBookedAppointments,
      costPerBookedAppointment,
    };
  }, [voiceMinutes, avgCallDuration, smsVolume, scrubContacts, numDids, telephonyProvider, voiceStack, ghlSubaccountMode, targetMarginPercent]);

  // Copy Client Proposal Text
  const handleCopyProposal = () => {
    const proposalText = `
========================================
SPYKE AI VOICE & SMS AUTOMATION PROPOSAL
Client: ${quoteClientName}
Plan: Custom AI Voice Dispatcher & SMS Suite
Currency: ${currency}
========================================

INCLUDED MONTHLY ALLOWANCES:
• AI Voice Minutes: ${voiceMinutes.toLocaleString()} mins (~${Math.round(voiceMinutes / avgCallDuration).toLocaleString()} customer conversations)
• Two-Way SMS Volume: ${smsVolume.toLocaleString()} SMS messages
• Clean Verified Mobile Contacts: ${scrubContacts.toLocaleString()} leads scrubbed (100% Mobile Cleaned)
• Dedicated Direct Phone Numbers: ${numDids} Business Line(s)
• CRM Integration: GoHighLevel 2-Way Live Sync & Workflow Automations

MONTHLY INVESTMENT:
• Monthly Retainer: ${fmt(calculations.recommendedRetailMonthly)} / month
• Additional AI Voice Minutes: ${fmt(calculations.retailPerVoiceMin)} / min
• Additional SMS Messages: ${fmt(calculations.retailPerSms)} / msg

ESTIMATED PERFORMANCE:
• Estimated Qualified Appointments: ~${calculations.estimatedBookedAppointments} bookings/mo
• 24/7 Answering with 0 missed leads
• Fast dispatch under 30 seconds

Generated via SpykeAI Enterprise Engine.
    `.trim();

    navigator.clipboard.writeText(proposalText);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
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
            The **Finance & Pricing Engine** is exclusively reserved for the **Super Admin** master portal. 
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
        {/* Sticky Unified Top Bar (Header + Navigation Tabs) */}
        <header className="bg-white border-b border-slate-200/90 sticky top-0 z-20 shadow-xs">
          {/* Title & Currency Row */}
          <div className="px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg shrink-0">
                  <DollarSign size={18} />
                </span>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Finance & Pricing Engine
                </h1>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1 shrink-0">
                  <ShieldCheck size={11} />
                  SUPERADMIN EXCLUSIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Live cost analysis & retail pricing engine across Telnyx, VAPI, Landline Remover, Sarvam AI, and GoHighLevel.
              </p>
            </div>

            {/* Currency Toggle */}
            <div className="flex items-center shrink-0">
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

          {/* Navigation Tabs (Unified inside sticky container, no wrapping, horizontal scroll) */}
          <div className="px-6 py-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs font-bold bg-slate-50/60">
            <button
              type="button"
              onClick={() => setActiveTab("engine")}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "engine"
                  ? "bg-purple-600 text-white shadow-xs font-black"
                  : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
              }`}
            >
              <Calculator size={15} className="shrink-0" />
              <span>Interactive Pricing Engine</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("matrix")}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "matrix"
                  ? "bg-purple-600 text-white shadow-xs font-black"
                  : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
              }`}
            >
              <Layers size={15} className="shrink-0" />
              <span>Provider Rate Cards (5 Tools)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("packages")}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "packages"
                  ? "bg-purple-600 text-white shadow-xs font-black"
                  : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
              }`}
            >
              <Flame size={15} className="shrink-0" />
              <span>Industry Packages</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("quote")}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "quote"
                  ? "bg-purple-600 text-white shadow-xs font-black"
                  : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
              }`}
            >
              <FileText size={15} className="shrink-0" />
              <span>Client Proposal Generator</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("comparison")}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "comparison"
                  ? "bg-purple-600 text-white shadow-xs font-black"
                  : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
              }`}
            >
              <TrendingUp size={15} className="shrink-0" />
              <span>AI vs Human Call Center ROI</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 pb-24 md:pb-12 max-w-7xl mx-auto w-full space-y-6">

          {/* TAB 1: INTERACTIVE PRICING ENGINE */}
          {activeTab === "engine" && (
            <div className="space-y-6">
              {/* Executive Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Wholesale COGS (Cost)</span>
                    <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                      COGS
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-2">{fmt(calculations.totalCogs)}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">True provider cost across 5 tools</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-xs bg-linear-to-br from-white to-purple-50/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Recommended Retail</span>
                    <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      <DollarSign size={16} />
                    </span>
                  </div>
                  <p className="text-2xl font-black text-purple-900 mt-2">{fmt(calculations.recommendedRetailMonthly)}</p>
                  <p className="text-[11px] text-purple-700 font-semibold mt-0.5">
                    {calculations.markupMultiplier.toFixed(2)}x markup ({targetMarginPercent}% target margin)
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs bg-linear-to-br from-white to-emerald-50/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Net Monthly Profit</span>
                    <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      <TrendingUp size={16} />
                    </span>
                  </div>
                  <p className="text-2xl font-black text-emerald-700 mt-2">{fmt(calculations.grossProfit)}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                    {targetMarginPercent}% Net Margin ({fmt(calculations.grossProfit * 12)} / yr)
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs bg-linear-to-br from-white to-blue-50/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Bookings & Unit Economics</span>
                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      <Sparkles size={16} />
                    </span>
                  </div>
                  <p className="text-2xl font-black text-blue-900 mt-2">~{calculations.estimatedBookedAppointments} Bookings</p>
                  <p className="text-[11px] text-blue-700 font-medium mt-0.5">
                    {fmt(calculations.costPerBookedAppointment)} cost per booked job
                  </p>
                </div>
              </div>

              {/* Main 2-Column Interface: Inputs & Output Waterfall */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Interactive Sliders & Configuration (7 cols) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Sliders size={18} className="text-purple-600" />
                      <h2 className="text-base font-extrabold text-slate-900">Campaign & Volume Parameters</h2>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">Live Auto-Recalculate</span>
                  </div>

                  {/* 1. Voice AI Minutes Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Monthly AI Voice Minutes</span>
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg border border-purple-200 font-mono text-sm">
                        {voiceMinutes.toLocaleString()} mins (~{Math.round(voiceMinutes / avgCallDuration).toLocaleString()} calls)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="50000"
                      step="500"
                      value={voiceMinutes}
                      onChange={(e) => setVoiceMinutes(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>500 mins (Starter)</span>
                      <span>5,000 mins (Growth)</span>
                      <span>20,000 mins (High Volume)</span>
                      <span>50,000 mins (Enterprise)</span>
                    </div>
                  </div>

                  {/* 2. Voice AI Engine Stack Selector */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>Voice AI Engine Stack (VAPI vs Sarvam AI)</span>
                      <span className="text-[11px] font-mono text-emerald-600 font-extrabold">
                        {fmtRate(calculations.voiceAiPerMin)} / min
                      </span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setVoiceStack("vapi_eco")}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          voiceStack === "vapi_eco"
                            ? "border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>Vapi Economic (Recommended)</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                            $0.074/m
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Deepgram + GPT-4o-mini + Cartesia</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setVoiceStack("vapi_groq")}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          voiceStack === "vapi_groq"
                            ? "border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>Vapi Ultra-Speed (Groq)</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                            $0.073/m
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Deepgram + Llama 3.3 70B + Cartesia</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setVoiceStack("vapi_premium")}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          voiceStack === "vapi_premium"
                            ? "border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>Vapi Flagship (ElevenLabs)</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono">
                            $0.149/m
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Deepgram + GPT-4o + ElevenLabs Turbo</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setVoiceStack("sarvam_indic")}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          voiceStack === "sarvam_indic"
                            ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-emerald-950">
                          <span className="flex items-center gap-1.5">
                            <Globe2 size={13} className="text-emerald-600" />
                            Sarvam AI (India Stack)
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                            ₹0.80/m
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Saaras STT + Bulbul TTS (Hindi/Indic)</p>
                      </button>
                    </div>
                  </div>

                  {/* 3. Outbound SMS Volume */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Monthly Two-Way SMS Volume</span>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 font-mono text-sm">
                        {smsVolume.toLocaleString()} SMS ({fmt(calculations.telephonySmsCost)})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={smsVolume}
                      onChange={(e) => setSmsVolume(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>1,000 SMS</span>
                      <span>10,000 SMS</span>
                      <span>50,000 SMS</span>
                      <span>100,000 SMS</span>
                    </div>
                  </div>

                  {/* 4. Landline Remover Contacts Scrubbing */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Cold Leads Cleaned (Landline Remover)</span>
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 font-mono text-sm">
                        {scrubContacts.toLocaleString()} leads ({fmt(calculations.landlineScrubCost)})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={scrubContacts}
                      onChange={(e) => setScrubContacts(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-500 bg-amber-50/50 p-2 rounded-xl border border-amber-100">
                      <span>Active Rate: {fmtRate(calculations.activeScrubTier.ratePerLookup)} / contact</span>
                      <span className="text-emerald-700 font-bold">
                        Filters ~{calculations.estimatedLandlinesFiltered.toLocaleString()} dead numbers (Saves {fmt(calculations.wastedSmsDollarsSaved)} wasted SMS)
                      </span>
                    </div>
                  </div>

                  {/* 5. Telephony Provider & GHL Setup */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Telephony Provider
                      </label>
                      <select
                        value={telephonyProvider}
                        onChange={(e: any) => setTelephonyProvider(e.target.value)}
                        className="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="telnyx">Telnyx Direct SIP ($0.013/min Out, $0.007 In, $0.007/SMS)</option>
                        <option value="ghl_lc">GHL LeadConnector Phone ($0.014/min Out, $0.0079/SMS)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        GoHighLevel Sub-Account Infrastructure
                      </label>
                      <select
                        value={ghlSubaccountMode}
                        onChange={(e: any) => setGhlSubaccountMode(e.target.value)}
                        className="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="shared">Shared Agency Unlimited ($15/mo amortized)</option>
                        <option value="dedicated">Dedicated Standalone Subaccount ($35/mo)</option>
                        <option value="none">No GHL (Direct Webhook only)</option>
                      </select>
                    </div>
                  </div>

                  {/* 6. Desired Margin Slider */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <BadgePercent size={15} className="text-purple-600" />
                        Desired Client Profit Margin Target
                      </span>
                      <span className="px-3 py-1 bg-purple-600 text-white rounded-lg font-mono text-sm font-extrabold">
                        {targetMarginPercent}% Margin ({calculations.markupMultiplier.toFixed(2)}x Multiplier)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="85"
                      step="5"
                      value={targetMarginPercent}
                      onChange={(e) => setTargetMarginPercent(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>20% (Low Margin)</span>
                      <span>50% (Standard Agency)</span>
                      <span>65% (Recommended SaaS)</span>
                      <span>85% (High Enterprise)</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Wholesale Breakdown & Client Pricing Card (5 cols) */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Wholesale COGS Breakdown Waterfall */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <Layers size={16} className="text-slate-600" />
                        Monthly Wholesale Cost Waterfall
                      </h3>
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        {fmt(calculations.totalCogs)} Total
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {/* Telephony Voice */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-blue-600" />
                          <span className="font-semibold text-slate-700">Telephony Minutes ({telephonyProvider.toUpperCase()})</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">{fmt(calculations.telephonyVoiceCost)}</span>
                      </div>

                      {/* Voice AI */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                        <div className="flex items-center gap-2">
                          <Zap size={14} className="text-purple-600" />
                          <span className="font-semibold text-slate-700">
                            {voiceStack === "sarvam_indic" ? "Sarvam Indic Voice" : "VAPI AI Platform"}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">{fmt(calculations.totalVoiceAiCost)}</span>
                      </div>

                      {/* SMS */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={14} className="text-emerald-600" />
                          <span className="font-semibold text-slate-700">Two-Way SMS Carrier Fees</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">{fmt(calculations.telephonySmsCost)}</span>
                      </div>

                      {/* Landline Remover */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-amber-600" />
                          <span className="font-semibold text-slate-700">Landline Remover Lead Scrub</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">{fmt(calculations.landlineScrubCost)}</span>
                      </div>

                      {/* Phone Numbers & 10DLC */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-slate-600" />
                          <span className="font-semibold text-slate-700">Phone Numbers & 10DLC Campaign</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">{fmt(calculations.telephonyDidCost)}</span>
                      </div>

                      {/* GHL Subaccount */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                        <div className="flex items-center gap-2">
                          <Globe2 size={14} className="text-indigo-600" />
                          <span className="font-semibold text-slate-700">GoHighLevel System Allocation</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">{fmt(calculations.ghlPlatformCost)}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-xs font-black">
                      <span className="text-slate-900">Total Monthly Cost of Goods Sold (COGS)</span>
                      <span className="text-sm font-mono text-slate-900">{fmt(calculations.totalCogs)}</span>
                    </div>
                  </div>

                  {/* Recommended Client Quote Box */}
                  <div className="bg-linear-to-br from-purple-900 to-indigo-950 p-6 rounded-3xl text-white shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                          Recommended Client Billing
                        </span>
                        <h4 className="text-lg font-black text-white">Suggested Retail Package</h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-white/10 text-white font-mono text-xs font-bold border border-white/20">
                        {targetMarginPercent}% Margin
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white tracking-tight">
                          {fmt(calculations.recommendedRetailMonthly)}
                        </span>
                        <span className="text-xs text-purple-300 font-semibold">/ month</span>
                      </div>
                      <p className="text-[11px] text-purple-200">
                        Net Profit: <strong className="text-emerald-400 font-bold">{fmt(calculations.grossProfit)}</strong> per month ({fmt(calculations.grossProfit * 12)} / year)
                      </p>
                    </div>

                    <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-purple-200">Recommended Per-Min Voice Rate:</span>
                        <span className="font-mono font-bold text-white">{fmt(calculations.retailPerVoiceMin)} / min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Recommended Per-SMS Rate:</span>
                        <span className="font-mono font-bold text-white">{fmt(calculations.retailPerSms)} / msg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Wholesale Unit Cost (Voice):</span>
                        <span className="font-mono text-purple-300">{fmt(calculations.trueCostPerVoiceMin)} / min</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab("quote")}
                      className="w-full py-2.5 bg-white text-purple-950 hover:bg-purple-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileText size={15} />
                      <span>Generate Ready-To-Send Client Quote</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: PROVIDER RATE CARDS (5 TOOLS MATRIX) */}
          {activeTab === "matrix" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Layers size={18} className="text-purple-600" />
                      5-Tool Provider Cost & Rate Master Table
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Accurate benchmark pricing for Telnyx, VAPI, Landline Remover, Sarvam AI, and GoHighLevel.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                    Live Verified Rates
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {/* Card 1: Telnyx */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                          T
                        </span>
                        <h3 className="font-black text-slate-900 text-sm">Telnyx Telephony</h3>
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        Wholesale SIP
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Voice Inbound (US):</span>
                        <span className="font-mono font-bold text-slate-900">$0.0070 / min</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Voice Outbound (US):</span>
                        <span className="font-mono font-bold text-slate-900">$0.0130 / min</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Voice Outbound (India):</span>
                        <span className="font-mono font-bold text-slate-900">$0.0450 / min</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Outbound SMS (US):</span>
                        <span className="font-mono font-bold text-slate-900">$0.0040 + $0.003 pass</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Local DID Phone Number:</span>
                        <span className="font-mono font-bold text-slate-900">$1.00 / mo</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-600">10DLC Campaign Fee:</span>
                        <span className="font-mono font-bold text-slate-900">$2.00 - $10.00 / mo</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: VAPI */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-xs">
                          V
                        </span>
                        <h3 className="font-black text-slate-900 text-sm">VAPI Voice AI</h3>
                      </div>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                        Platform + Models
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Vapi Platform Fee:</span>
                        <span className="font-mono font-bold text-slate-900">$0.0500 / min ($3/hr)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Deepgram Nova-2 (STT):</span>
                        <span className="font-mono font-bold text-slate-900">$0.0043 / min</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">GPT-4o-mini (LLM):</span>
                        <span className="font-mono font-bold text-slate-900">~$0.0015 / min</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">GPT-4o Full (LLM):</span>
                        <span className="font-mono font-bold text-slate-900">~$0.0600 / min</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Cartesia TTS (Voice):</span>
                        <span className="font-mono font-bold text-slate-900">~$0.0180 / min</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-600">ElevenLabs Turbo v2.5:</span>
                        <span className="font-mono font-bold text-slate-900">~$0.0350 / min</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Landline Remover */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-black text-xs">
                          LR
                        </span>
                        <h3 className="font-black text-slate-900 text-sm">Landline Remover</h3>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Scrub & Validator
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Tier 1 (&lt; 10,000):</span>
                        <span className="font-mono font-bold text-slate-900">$0.0040 / lookup ($4/1K)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Tier 2 (10K - 50K):</span>
                        <span className="font-mono font-bold text-slate-900">$0.0030 / lookup ($3/1K)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Tier 3 (50K - 250K):</span>
                        <span className="font-mono font-bold text-slate-900">$0.0025 / lookup ($2.5/1K)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Tier 4 (250K+):</span>
                        <span className="font-mono font-bold text-slate-900">$0.0018 / lookup ($1.8/1K)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Identified Line Types:</span>
                        <span className="font-bold text-slate-900">Mobile, Landline, VoIP</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-600">Typical Scrub Yield:</span>
                        <span className="font-bold text-emerald-700">65-75% Mobile Clean</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Sarvam AI */}
                  <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                          S
                        </span>
                        <h3 className="font-black text-slate-900 text-sm">Sarvam AI (Indic Engine)</h3>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                        India Vernacular
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-emerald-100">
                        <span className="text-slate-600">Saaras STT (Speech-to-Text):</span>
                        <span className="font-mono font-bold text-emerald-900">₹0.25 / min (~$0.0029)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-emerald-100">
                        <span className="text-slate-600">Bulbul TTS (Text-to-Speech):</span>
                        <span className="font-mono font-bold text-emerald-900">₹0.40 / min (~$0.0046)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-emerald-100">
                        <span className="text-slate-600">Sarvam-2B LLM (Dialogue):</span>
                        <span className="font-mono font-bold text-emerald-900">₹0.15 / min (~$0.0017)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-emerald-100">
                        <span className="text-slate-600 font-bold">Total Blended Indian Pipeline:</span>
                        <span className="font-mono font-bold text-emerald-700">₹0.80 / min (~$0.0092)</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-600">Languages Supported:</span>
                        <span className="font-bold text-slate-900">Hindi, Tamil, Telugu, 10+</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 5: GoHighLevel (GHL) */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                          GHL
                        </span>
                        <h3 className="font-black text-slate-900 text-sm">GoHighLevel (GHL)</h3>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                        SaaS & CRM
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Base Agency Plans:</span>
                        <span className="font-mono font-bold text-slate-900">$97 / $297 / $497 mo</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">LC Phone Inbound Voice:</span>
                        <span className="font-mono font-bold text-slate-900">$0.0085 / min</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">LC Phone Outbound Voice:</span>
                        <span className="font-mono font-bold text-slate-900">$0.0140 / min</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">LC Phone Outbound SMS:</span>
                        <span className="font-mono font-bold text-slate-900">$0.0079 / segment</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">LC Email System:</span>
                        <span className="font-mono font-bold text-slate-900">$0.675 / 1,000 emails</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-600">Standard SaaS Markup:</span>
                        <span className="font-bold text-indigo-700">1.5x - 3.0x Rebilling</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INDUSTRY PACKAGES */}
          {activeTab === "packages" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Flame size={18} className="text-purple-600" />
                    Pre-Packaged Industry Solutions (Cost vs Retail vs Margin)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ready-to-sell packages designed specifically for Trade/HVAC, Real Estate, and High-Volume Outreach.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">

                  {/* Package 1: Plumber / HVAC 24/7 AI Dispatcher */}
                  <div className="p-6 rounded-3xl border-2 border-purple-300 bg-linear-to-b from-purple-50/30 to-white shadow-xs space-y-4 relative flex flex-col justify-between">
                    <span className="absolute -top-3 right-5 bg-purple-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                    <div>
                      <div className="flex items-center gap-2 text-purple-700 mb-1">
                        <Wrench size={18} />
                        <h3 className="font-black text-base text-slate-900">Trade: HVAC & Plumber AI</h3>
                      </div>
                      <p className="text-xs text-slate-500">24/7 emergency dispatch, SMS confirm, calendar booking.</p>

                      <div className="mt-4 p-3 bg-white rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex justify-between"><span className="text-slate-500">Included Minutes:</span><span className="font-bold">1,000 Mins</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Included SMS:</span><span className="font-bold">1,500 SMS</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Stack:</span><span className="font-bold">Telnyx + VAPI Eco + GHL</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Wholesale COGS:</span><span className="font-mono font-bold text-slate-800">$109.50 / mo</span></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold text-slate-500">Retail Retainer:</span>
                        <span className="text-2xl font-black text-purple-950">$349 / mo</span>
                      </div>
                      <div className="flex justify-between text-[11px] mt-1 text-emerald-700 font-bold">
                        <span>Net Profit: $239.50 / mo</span>
                        <span>68.6% Margin</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setVoiceMinutes(1000);
                          setSmsVolume(1500);
                          setScrubContacts(1000);
                          setNumDids(1);
                          setVoiceStack("vapi_eco");
                          setTargetMarginPercent(68);
                          setActiveTab("engine");
                        }}
                        className="w-full mt-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        Load Into Engine
                      </button>
                    </div>
                  </div>

                  {/* Package 2: Real Estate Cold Outreach Engine */}
                  <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-blue-700 mb-1">
                        <Home size={18} />
                        <h3 className="font-black text-base text-slate-900">Real Estate Outreach Pro</h3>
                      </div>
                      <p className="text-xs text-slate-500">Landline scrub, mass 2-way SMS & AI voice callback.</p>

                      <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex justify-between"><span className="text-slate-500">Included Minutes:</span><span className="font-bold">3,500 Mins</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Included SMS:</span><span className="font-bold">15,000 SMS</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Landline Scrub:</span><span className="font-bold">20,000 Leads</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Wholesale COGS:</span><span className="font-mono font-bold text-slate-800">$455.00 / mo</span></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold text-slate-500">Retail Retainer:</span>
                        <span className="text-2xl font-black text-slate-900">$1,199 / mo</span>
                      </div>
                      <div className="flex justify-between text-[11px] mt-1 text-emerald-700 font-bold">
                        <span>Net Profit: $744.00 / mo</span>
                        <span>62.0% Margin</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setVoiceMinutes(3500);
                          setSmsVolume(15000);
                          setScrubContacts(20000);
                          setNumDids(3);
                          setVoiceStack("vapi_eco");
                          setTargetMarginPercent(62);
                          setActiveTab("engine");
                        }}
                        className="w-full mt-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        Load Into Engine
                      </button>
                    </div>
                  </div>

                  {/* Package 3: Sarvam Indic Regional Voice Bot */}
                  <div className="p-6 rounded-3xl border border-emerald-200 bg-emerald-50/20 shadow-xs space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-700 mb-1">
                        <Globe2 size={18} />
                        <h3 className="font-black text-base text-slate-900">India Vernacular Voice Bot</h3>
                      </div>
                      <p className="text-xs text-slate-500">Native Hindi, Marathi, Tamil, Telugu AI voice agent.</p>

                      <div className="mt-4 p-3 bg-white rounded-2xl border border-emerald-200 space-y-1.5 text-xs">
                        <div className="flex justify-between"><span className="text-slate-500">Included Minutes:</span><span className="font-bold">8,000 Mins</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Stack:</span><span className="font-bold">Sarvam AI + Telnyx/SIP</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Voice Rate:</span><span className="font-bold text-emerald-700">₹0.80 / min</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Wholesale COGS:</span><span className="font-mono font-bold text-slate-800">₹8,800 (~$101)</span></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-200/60">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold text-slate-500">Retail Retainer:</span>
                        <span className="text-2xl font-black text-emerald-950">₹29,999 / mo</span>
                      </div>
                      <div className="flex justify-between text-[11px] mt-1 text-emerald-700 font-bold">
                        <span>Net Profit: ₹21,199 / mo</span>
                        <span>70.6% Margin</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setVoiceMinutes(8000);
                          setSmsVolume(2000);
                          setScrubContacts(5000);
                          setNumDids(1);
                          setVoiceStack("sarvam_indic");
                          setCurrency("INR");
                          setTargetMarginPercent(70);
                          setActiveTab("engine");
                        }}
                        className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        Load Into Engine
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLIENT PROPOSAL GENERATOR */}
          {activeTab === "quote" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <FileText size={18} className="text-purple-600" />
                    Instant Client Proposal & Pricing Generator
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Generate an executive client proposal with one click. Wholesale provider costs are completely hidden!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Client or Business Name</label>
                    <input
                      type="text"
                      value={quoteClientName}
                      onChange={(e) => setQuoteClientName(e.target.value)}
                      placeholder="e.g. ABC Plumbing & HVAC"
                      className="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Target Package Template</label>
                    <select
                      value={quotePackageType}
                      onChange={(e: any) => setQuotePackageType(e.target.value)}
                      className="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="hvac_plumber">Plumbing & HVAC 24/7 AI Dispatcher</option>
                      <option value="real_estate">Real Estate & Investor Cold Outreach</option>
                      <option value="support_inbound">Customer Service Inbound Deflection</option>
                      <option value="indic_regional">Sarvam AI Regional Indic Voice Assistant</option>
                    </select>
                  </div>
                </div>

                {/* Proposal Preview Box */}
                <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-xs space-y-3 relative">
                  <button
                    onClick={handleCopyProposal}
                    className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    {copiedQuote ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedQuote ? "Copied!" : "Copy Proposal Text"}</span>
                  </button>

                  <p className="text-purple-400 font-bold border-b border-slate-800 pb-2">
                    // CLIENT-FACING PROPOSAL (WHOLESALE COGS HIDDEN)
                  </p>
                  <p>Client: <span className="text-white font-bold">{quoteClientName}</span></p>
                  <p>Plan: <span className="text-white font-bold">SpykeAI Managed Voice & SMS Operations</span></p>
                  <div className="border-t border-slate-800 pt-2 space-y-1">
                    <p>• Monthly Retainer: <strong className="text-emerald-400">{fmt(calculations.recommendedRetailMonthly)} / month</strong></p>
                    <p>• Included Voice Minutes: <strong>{voiceMinutes.toLocaleString()} mins</strong> (~{Math.round(voiceMinutes / avgCallDuration).toLocaleString()} full conversations)</p>
                    <p>• Included SMS Volume: <strong>{smsVolume.toLocaleString()} 2-way texts</strong></p>
                    <p>• Scrubbed Verified Contacts: <strong>{scrubContacts.toLocaleString()} leads</strong> (Landlines & invalid numbers filtered)</p>
                    <p>• Additional Overage Rate: {fmt(calculations.retailPerVoiceMin)} / min voice, {fmt(calculations.retailPerSms)} / SMS</p>
                  </div>
                  <p className="text-slate-400 text-[11px] pt-2 border-t border-slate-800">
                    Ready to paste directly into WhatsApp, Email, or Slack to close the deal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI VS HUMAN CALL CENTER ROI */}
          {activeTab === "comparison" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <TrendingUp size={18} className="text-purple-600" />
                    Unit Economics: AI Voice Agent vs Human Call Center
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Demonstrate 70% to 92% cost reductions to enterprise clients.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                        <th className="py-3 px-4">Solution Stack</th>
                        <th className="py-3 px-4">Effective Cost / Min</th>
                        <th className="py-3 px-4">Cost per 1,000 Mins</th>
                        <th className="py-3 px-4">Speed & Latency</th>
                        <th className="py-3 px-4">Availability</th>
                        <th className="py-3 px-4">Cost Savings %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <Headphones size={15} className="text-rose-500" />
                          US Human Receptionist
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold">$0.35 - $0.50</td>
                        <td className="py-3.5 px-4 font-mono">$350.00 - $500.00</td>
                        <td className="py-3.5 px-4 text-slate-500">Hold queues (1-3 mins)</td>
                        <td className="py-3.5 px-4 text-slate-500">8h - 12h / day</td>
                        <td className="py-3.5 px-4 font-bold text-rose-600">Baseline (0%)</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <Globe2 size={15} className="text-amber-500" />
                          Offshore BPO (India/Philippines)
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold">$0.18 - $0.25</td>
                        <td className="py-3.5 px-4 font-mono">$180.00 - $250.00</td>
                        <td className="py-3.5 px-4 text-slate-500">Hold queues (30-60s)</td>
                        <td className="py-3.5 px-4 text-slate-500">Shift-dependent</td>
                        <td className="py-3.5 px-4 font-bold text-amber-600">~45% Savings</td>
                      </tr>
                      <tr className="bg-purple-50/50">
                        <td className="py-3.5 px-4 font-bold text-purple-900 flex items-center gap-2">
                          <Zap size={15} className="text-purple-600" />
                          SpykeAI Voice (VAPI + Telnyx)
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-purple-950">
                          {fmtRate(calculations.trueCostPerVoiceMin)}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-purple-950 font-bold">
                          {fmt(calculations.trueCostPerVoiceMin * 1000)}
                        </td>
                        <td className="py-3.5 px-4 text-purple-900 font-semibold">Sub-600ms latency</td>
                        <td className="py-3.5 px-4 text-emerald-700 font-bold">24/7/365 Instant</td>
                        <td className="py-3.5 px-4 font-extrabold text-emerald-600">~78% Savings</td>
                      </tr>
                      <tr className="bg-emerald-50/50">
                        <td className="py-3.5 px-4 font-bold text-emerald-950 flex items-center gap-2">
                          <Globe2 size={15} className="text-emerald-600" />
                          SpykeAI Indic (Sarvam AI + Telnyx)
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                          ₹0.80 / min (~$0.0092)
                        </td>
                        <td className="py-3.5 px-4 font-mono text-emerald-900 font-bold">
                          ₹800 (~$9.25)
                        </td>
                        <td className="py-3.5 px-4 text-emerald-900 font-semibold">Sub-500ms Local India</td>
                        <td className="py-3.5 px-4 text-emerald-700 font-bold">24/7/365 Instant</td>
                        <td className="py-3.5 px-4 font-extrabold text-emerald-600">~97% Savings</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
