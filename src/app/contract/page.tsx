"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Printer,
  Download,
  AlertCircle,
  FileText,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  ExternalLink,
  Check,
  Sparkles,
  Calendar,
  Clock,
  DollarSign,
  Flame,
  Zap,
  PhoneCall,
  MessageSquare,
  Gift,
  HelpCircle,
  BadgeCheck,
  TrendingUp,
  Award,
} from "lucide-react";

interface ContractFormData {
  companyName: string;
  website: string;
  fullName: string;
  businessAddress: string;
  email: string;
  phone: string;
  signature: string;
  consent: boolean;
}

interface ExecutedData {
  agreementId: string;
  signedAt: string;
  formattedDate: string;
  signatory: string;
  company: string;
  providerSignatory: string;
  pdfBase64?: string | null;
  pdfFilename?: string;
}

export default function ContractPage() {
  const [formData, setFormData] = useState<ContractFormData>({
    companyName: "",
    website: "",
    fullName: "",
    businessAddress: "",
    email: "",
    phone: "",
    signature: "",
    consent: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [executedData, setExecutedData] = useState<ExecutedData | null>(null);

  const handleInputChange = (field: keyof ContractFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // If typing in full name and signature is empty or matches previous name, auto-fill signature
      ...(field === "fullName" && (!prev.signature || prev.signature === prev.fullName)
        ? { signature: value }
        : {}),
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.companyName.trim()) {
      setErrorMessage("Please enter your HVAC Company / Business Name.");
      return;
    }
    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter the Full Legal Name of the authorized signatory.");
      return;
    }
    if (!formData.businessAddress.trim()) {
      setErrorMessage("Please provide your registered Business Address.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please provide a valid business email address.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Please provide a contact phone number.");
      return;
    }
    if (!formData.signature.trim()) {
      setErrorMessage("Please type your full legal name in the signature box to execute.");
      return;
    }
    if (!formData.consent) {
      setErrorMessage("You must accept the terms and electronic signature consent checkbox.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contract/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setExecutedData({
          agreementId: data.agreementId,
          signedAt: data.signedAt,
          formattedDate: data.formattedDate,
          signatory: data.signatory,
          company: data.company,
          providerSignatory: data.providerSignatory,
          pdfBase64: data.pdfBase64,
          pdfFilename: data.pdfFilename,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErrorMessage(data.error || "Execution failed. Please check your details and try again.");
      }
    } catch {
      setErrorMessage("Network error occurred during contract execution. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!executedData?.pdfBase64) {
      window.print();
      return;
    }
    try {
      const byteCharacters = atob(executedData.pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = executedData.pdfFilename || `SpykeAI_HVAC_Agreement_${executedData.agreementId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("PDF download failed, falling back to print:", e);
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-200 font-sans selection:bg-red-500/20 selection:text-red-300 pb-24">
      {/* TOP STATUS BAR */}
      <nav className="border-b border-slate-800/80 bg-[#0B0F17]/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <img src="/logo.png" alt="SpykeAI" className="h-8 w-auto object-contain shrink-0" />
            <span className="text-white font-extrabold tracking-tight text-base group-hover:text-emerald-400 transition-colors">
              SPYKE<span className="text-[#00DF81]">AI</span>
            </span>
          </Link>
          <span className="h-4 w-[1px] bg-slate-800 hidden sm:inline" />
          <span className="text-xs font-bold tracking-wider uppercase text-slate-400 hidden sm:inline">
            HVAC Booking Engine Agreement
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span className="hidden sm:inline">Official Legal Record</span>
            <span className="sm:hidden">Legal Record</span>
          </div>

          <Link
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors px-2.5 py-1 rounded-lg border border-slate-800/60 hover:border-slate-700 bg-slate-900/40"
          >
            Website Home
          </Link>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-12">
        {/* HERO TITLE HEADER */}
        <div className="space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-950/60 text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            THE HVAC BOOKING ENGINE · CLIENT SERVICES AGREEMENT
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            The HVAC Booking Engine: Final Offer &amp; Agreement
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            10 booked jobs in 30 days guaranteed from the calls &amp; leads you already get. 24/7 call answering, 60-second callbacks, automated calendar booking, and estimate follow-up without hiring staff or paying a monthly retainer.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-xs text-slate-400 font-mono">
            <span>REF: HVAC-ENGINE-2026</span>
            <span>·</span>
            <span>PAY-FOR-PERFORMANCE MODEL</span>
            <span>·</span>
            <span>10-JOB 30-DAY GUARANTEE</span>
            <span>·</span>
            <span>E-SIGN &amp; UETA COMPLIANT</span>
          </div>
        </div>

        {/* EXECUTED CONFIRMATION BANNER (SHOWN WHEN SIGNED) */}
        {executedData && (
          <div className="bg-gradient-to-br from-emerald-950/70 via-slate-900 to-[#0A1310] border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-emerald-950/50 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-500/20">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                      EXECUTED &amp; BINDING
                    </span>
                    <span className="text-xs font-mono text-emerald-400">{executedData.agreementId}</span>
                  </div>
                  <h2 className="text-xl font-black text-white mt-0.5">Agreement Successfully Executed</h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md shadow-emerald-950/40"
                >
                  <Download size={15} />
                  <span>Download Official PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-xs transition-all cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="bg-[#090D15]/80 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Company:</span>
                <span className="text-white font-bold">{executedData.company}</span>
              </div>
              <div className="bg-[#090D15]/80 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Signatory:</span>
                <span className="text-white font-bold">{executedData.signatory}</span>
              </div>
              <div className="bg-[#090D15]/80 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Execution Time:</span>
                <span className="text-emerald-400 font-bold">{executedData.formattedDate}</span>
              </div>
              <div className="bg-[#090D15]/80 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Counter-Signatory:</span>
                <span className="text-white font-bold">{executedData.providerSignatory}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              An authoritative copy of this signed agreement along with full timestamp, cryptographic record, and execution details has been sent to your email. You can download or print this page at any time for your corporate records.
            </p>
          </div>
        )}

        {/* SECTION 1: THE COMMERCIAL OFFER & VALUE STACK */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-red-500 font-extrabold text-[11px] uppercase tracking-[0.2em]">
              THE COMMERCIAL OFFER
            </span>
            <div className="flex-1 h-[1px] bg-red-900/30" />
          </div>

          {/* PROMISE & HOW IT WORKS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* The Promise */}
            <div className="bg-gradient-to-br from-[#0e1626] to-[#0b0f19] rounded-2xl border border-blue-500/30 p-6 sm:p-7 space-y-3 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-950/80 text-blue-400 border border-blue-500/30">
                <Award size={13} />
                <span>1. The Promise</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                10 booked jobs in 30 days.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                From the calls &amp; leads you <strong className="text-white">already get</strong>. We turn your missed calls, website forms, and open estimates into confirmed jobs on your calendar.
              </p>
            </div>

            {/* How */}
            <div className="bg-gradient-to-br from-[#121c17] to-[#0b0f19] rounded-2xl border border-emerald-500/30 p-6 sm:p-7 space-y-3 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                <Zap size={13} />
                <span>2. How It Works</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                The HVAC Booking Engine
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Answers, calls back, and books every customer who reaches you — <strong className="text-white">without hiring more staff or paying a monthly retainer</strong>.
              </p>
            </div>
          </div>

          {/* WHAT IT DOES: 5 CORE PILLARS */}
          <div className="bg-[#0B0F19] rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  CORE CAPABILITIES
                </span>
                <h3 className="text-lg font-black text-white">3. What It Does</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Automated 24/7/365 Answering &amp; Dispatch
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="p-4 rounded-xl bg-[#090D15] border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <PhoneCall size={18} className="text-emerald-400" />
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">24/7 Live</span>
                </div>
                <h4 className="font-bold text-white text-xs pt-1">Answers Every Call</h4>
                <p className="text-[11px] text-slate-400">24/7, nights and weekends, in under 3 rings.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#090D15] border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <Clock size={18} className="text-cyan-400" />
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">60 Seconds</span>
                </div>
                <h4 className="font-bold text-white text-xs pt-1">Calls Back Missed Calls</h4>
                <p className="text-[11px] text-slate-400">Instant outbound callback before they dial your competitor.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#090D15] border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <Flame size={18} className="text-amber-400" />
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">Instant</span>
                </div>
                <h4 className="font-bold text-white text-xs pt-1">Calls Web &amp; Ad Leads</h4>
                <p className="text-[11px] text-slate-400">Calls every website form &amp; ad lead within 60 seconds.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#090D15] border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <Calendar size={18} className="text-emerald-400" />
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">Integrated</span>
                </div>
                <h4 className="font-bold text-white text-xs pt-1">Books Jobs Directly</h4>
                <p className="text-[11px] text-slate-400">Straight into your calendar (ServiceTitan, Jobber, Housecall, Google).</p>
              </div>

              <div className="p-4 rounded-xl bg-[#090D15] border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <MessageSquare size={18} className="text-purple-400" />
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30">Automated</span>
                </div>
                <h4 className="font-bold text-white text-xs pt-1">Follows Up Estimates</h4>
                <p className="text-[11px] text-slate-400">Multi-touch text and call follow-up until the customer decides.</p>
              </div>
            </div>
          </div>

          {/* VALUE STACK VS WHAT YOU PAY (SIDE BY SIDE COMPARISON) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: What It's Worth */}
            <div className="lg:col-span-7 bg-[#0B0F19] rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-5 shadow-xl">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  MARKET COMPARISON
                </span>
                <h3 className="text-lg font-black text-white mt-1">4. What It&apos;s Worth (Market Value)</h3>
                <p className="text-xs text-slate-400">Equivalent cost if hiring full-time staff and software licenses.</p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090D15] border border-slate-800">
                  <span className="text-slate-300 font-medium">24/7 call answering (dedicated receptionist)</span>
                  <span className="font-mono font-bold text-white">$3,170/mo</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090D15] border border-slate-800">
                  <span className="text-slate-300 font-medium">60-second callbacks (appointment setter)</span>
                  <span className="font-mono font-bold text-white">$3,000/mo</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090D15] border border-slate-800">
                  <span className="text-slate-300 font-medium">Estimate follow-up (sales coordinator)</span>
                  <span className="font-mono font-bold text-white">$1,500/mo</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090D15] border border-slate-800">
                  <span className="text-slate-300 font-medium">All software, telecom, carrier calls, texts, emails</span>
                  <span className="font-mono font-bold text-white">$799/mo</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 font-bold">
                  <span className="text-white">Monthly Service Total</span>
                  <span className="font-mono text-emerald-400 font-black text-sm">~$8,500/mo</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090D15] border border-slate-800">
                  <span className="text-slate-300 font-medium">Custom AI Agent built &amp; trained for your business</span>
                  <span className="font-mono font-bold text-white">$6,500 one-time</span>
                </div>
              </div>

              {/* BONUSES */}
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Gift size={16} className="text-amber-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
                    5. Bonuses Included Free
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-[#090D15] border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Old customer &amp; estimate callbacks</span>
                    <span className="font-mono font-bold text-amber-300">$1,000</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#090D15] border border-slate-800 flex justify-between">
                    <span className="text-slate-400">5-star review requests after every job</span>
                    <span className="font-mono font-bold text-amber-300">$300/mo</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#090D15] border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Seasonal tune-up reminder engine</span>
                    <span className="font-mono font-bold text-amber-300">$500/mo</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#090D15] border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Live dashboard &amp; audio recordings</span>
                    <span className="font-mono font-bold text-amber-300">$300/mo</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#090D15] border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Emergency tech instant transfer</span>
                    <span className="font-mono font-bold text-emerald-400">Included</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#090D15] border border-slate-800 flex justify-between">
                    <span className="text-slate-400">English + Spanish bilingual voice</span>
                    <span className="font-mono font-bold text-emerald-400">Included</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-r from-slate-900 to-[#101726] border border-slate-700 text-center">
                <span className="text-xs text-slate-400 block font-mono">6. Total Combined Market Value</span>
                <span className="text-base sm:text-lg font-black text-white">~$10,000/month + $7,500 one-time build</span>
              </div>
            </div>

            {/* Right: What You Pay */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0c1322] via-[#0B0F19] to-[#0A1118] rounded-2xl border-2 border-emerald-500/40 p-6 sm:p-7 space-y-5 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                    PAY-FOR-PERFORMANCE
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                    NO RETAINER
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">7. What You Pay</h3>
                <p className="text-xs text-slate-300">You only pay when we deliver actual booked jobs.</p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#070b14] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Setup Fee (One-Time)</span>
                    <span className="text-[10px] text-slate-400">AI build, phone line, calendar &amp; carrier registration</span>
                  </div>
                  <span className="text-lg font-mono font-black text-white">$2,000</span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-300 block">Per Booked Repair Job</span>
                    <span className="text-[10px] text-slate-400">Confirmed service call placed on your calendar</span>
                  </div>
                  <span className="text-xl font-mono font-black text-emerald-400">$100</span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-300 block">Per Booked Replacement Estimate</span>
                    <span className="text-[10px] text-slate-400">In-home HVAC quote booked on your calendar</span>
                  </div>
                  <span className="text-xl font-mono font-black text-emerald-400">$200</span>
                </div>

                <div className="p-3 rounded-xl bg-[#070b14] border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300">Software, Calls &amp; Carrier Texts</span>
                  <span className="font-mono font-bold text-emerald-400">$0, We Pay</span>
                </div>

                <div className="p-3 rounded-xl bg-[#070b14] border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300">Monthly Retainer</span>
                  <span className="font-mono font-bold text-emerald-400">$0</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#081512] border border-emerald-500/30 text-xs text-slate-300 space-y-1">
                <span className="text-emerald-400 font-bold block text-[11px] uppercase tracking-wider">9. The Math</span>
                <p>You get: <strong className="text-white">~$10,000/mo</strong> of work.</p>
                <p>You pay: <strong className="text-emerald-400">~$1,200/mo</strong> (at 10 bookings).</p>
                <p className="text-white font-medium pt-1 text-[11px]">
                  💡 One single replacement job pays for half a year of bookings.
                </p>
              </div>
            </div>
          </div>

          {/* THE GUARANTEE HIGHLIGHT CARD */}
          <div className="bg-gradient-to-br from-[#071a14] via-[#091512] to-[#071310] border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl shadow-emerald-950/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    8. THE 30-DAY PERFORMANCE GUARANTEE
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    10 booked jobs in 30 days, or that month&apos;s bookings are free.
                  </h3>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-slate-950 self-start sm:self-auto">
                Risk-Free Performance
              </span>
            </div>

            <p className="text-sm text-emerald-100/90 leading-relaxed font-medium">
              If we don&apos;t book you at least 10 qualified jobs in the first 30 days after Go-Live from your incoming calls and leads, every single booking fee for that month is waived ($0). You keep every dollar of work performed.
            </p>
          </div>

          {/* ONE-PARAGRAPH VERSION */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090D15] border border-slate-800 text-slate-300 text-xs sm:text-[13px] leading-relaxed italic relative">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block not-italic mb-1.5">
              THE AGREEMENT IN ONE PARAGRAPH (SAY IT OUT LOUD)
            </span>
            &quot;We&apos;ll book you 10 HVAC jobs in 30 days, from the calls &amp; leads you already get. The HVAC Booking Engine answers every call 24/7, calls back every missed call, form and ad lead in 60 seconds, and follows up every estimate, without hiring more staff or paying a monthly retainer. That&apos;s $10,000 a month of work, and we pay all software and call costs. You pay $2,000 to set up, then $100 per booked repair and $200 per booked replacement estimate. If we don&apos;t book 10 jobs in 30 days, that month&apos;s bookings are free.&quot;
          </div>
        </section>

        {/* SECTION 2: THE PARTIES */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-red-500 font-extrabold text-[11px] uppercase tracking-[0.2em]">
              THE PARTIES
            </span>
            <div className="flex-1 h-[1px] bg-red-900/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 2A: THE PROVIDER */}
            <div className="bg-[#0B0F19] rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  THE PROVIDER (&quot;SPYKE&quot;, &quot;WE&quot;)
                </span>
                <h3 className="text-lg font-black text-white mt-1">Spyke AI Technologies</h3>
              </div>

              <div className="text-xs text-slate-400 space-y-3 leading-relaxed">
                <p>
                  <strong className="text-white">Spyke AI Technologies</strong> is the contracting provider under this Agreement and is solely responsible for engineering, deploying, and operating the HVAC Booking Engine, providing telecommunications lines, and honoring the performance guarantee.
                </p>
                <p>
                  <strong className="text-slate-300">Operations &amp; Corporate Delivery:</strong> Dallas, TX 75208, United States &amp; Hyderabad, Telangana, India. Your agreement is directly with Spyke AI Technologies.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-xs space-y-1.5 font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Email:</span>
                  <a href="mailto:contact@spykeai.com" className="text-white hover:text-emerald-400 transition-colors">
                    contact@spykeai.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Web:</span>
                  <a href="https://spykeai.com" target="_blank" className="text-white hover:text-emerald-400 transition-colors">
                    spykeai.com
                  </a>
                </div>
              </div>
            </div>

            {/* 2B: THE CLIENT FORM */}
            <div className="bg-[#0B0F19] rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  THE CLIENT (&quot;YOU&quot;)
                </span>
                <h3 className="text-lg font-black text-white mt-1">Your Business Details</h3>
              </div>

              <div className="space-y-3.5">
                {/* Company Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    HVAC Company / Legal Entity Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!executedData}
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="e.g. Apex Heating & Air Conditioning LLC"
                    className="w-full px-3.5 py-2.5 bg-[#090D15] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-60 font-medium"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Website Address
                  </label>
                  <input
                    type="text"
                    disabled={!!executedData}
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="e.g. apexhvacservices.com"
                    className="w-full px-3.5 py-2.5 bg-[#090D15] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-60 font-medium"
                  />
                </div>

                {/* Signatory Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Full Legal Name (Authorized Signatory) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!executedData}
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="e.g. Johnathan Miller"
                    className="w-full px-3.5 py-2.5 bg-[#090D15] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-60 font-medium"
                  />
                </div>

                {/* Business Address */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Business Address &amp; Service Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!executedData}
                    value={formData.businessAddress}
                    onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                    placeholder="Street, City, State/Region, Postal Code"
                    className="w-full px-3.5 py-2.5 bg-[#090D15] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-60 font-medium"
                  />
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Business Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      disabled={!!executedData}
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="owner@apexhvac.com"
                      className="w-full px-3.5 py-2.5 bg-[#090D15] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-60 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      disabled={!!executedData}
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 bg-[#090D15] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-60 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: HVAC BOOKING ENGINE: CLIENT TERMS (THE 15 CLAUSES) */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-red-500 font-extrabold text-[11px] uppercase tracking-[0.2em]">
              THE CLIENT TERMS &amp; CONDITIONS
            </span>
            <div className="flex-1 h-[1px] bg-red-900/30" />
          </div>

          <div className="bg-[#0B0F19] rounded-2xl border border-slate-800 p-6 sm:p-9 space-y-9 shadow-xl text-xs sm:text-[13px] leading-relaxed text-slate-300">
            {/* Clause 1 */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">1.</span>
                <span>Parties, Scope &amp; Definitions</span>
              </h4>
              <p className="text-slate-400">
                This agreement is between <strong className="text-white">Spyke AI Technologies</strong> (&quot;Spyke&quot;) and the client identified above (&quot;the Client&quot;), an HVAC business. <strong className="text-white">Scope:</strong> Spyke runs the HVAC Booking Engine for the Client: it answers every inbound call, calls back missed calls, website forms and ad leads, books jobs into the Client&apos;s calendar, follows up open estimates and sends confirmations and reminders.
              </p>

              {/* Definitions Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 mt-2">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0e1626] border-b border-slate-800 text-slate-300 font-bold">
                      <th className="py-2.5 px-3.5 w-1/4">Term</th>
                      <th className="py-2.5 px-3.5">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3.5 font-bold text-white">Booking Line</td>
                      <td className="py-2 px-3.5 text-slate-400 font-sans">The dedicated local phone number Spyke provides, plus the Client&apos;s existing number when forwarded to Spyke.</td>
                    </tr>
                    <tr className="bg-[#0b101c]">
                      <td className="py-2 px-3.5 font-bold text-white">Go-Live Day</td>
                      <td className="py-2 px-3.5 text-slate-400 font-sans">The day the Booking Line answers calls with AI and existing numbers are forwarded. Confirmed via email.</td>
                    </tr>
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3.5 font-bold text-white">Booked Job</td>
                      <td className="py-2 px-3.5 text-slate-400 font-sans">A homeowner in the agreed service area with a real HVAC need placed on the Client&apos;s calendar, whose first contact came through the Booking Line or Spyke outbound call within 30 days.</td>
                    </tr>
                    <tr className="bg-[#0b101c]">
                      <td className="py-2 px-3.5 font-bold text-white">Repair Job</td>
                      <td className="py-2 px-3.5 text-slate-400 font-sans">A Booked Job for repair, service, diagnosis or maintenance.</td>
                    </tr>
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3.5 font-bold text-white">Replacement Estimate</td>
                      <td className="py-2 px-3.5 text-slate-400 font-sans">A Booked Job for an in-home estimate on a new or replacement heating/cooling system.</td>
                    </tr>
                    <tr className="bg-[#0b101c]">
                      <td className="py-2 px-3.5 font-bold text-white">AI Minutes</td>
                      <td className="py-2 px-3.5 text-slate-400 font-sans">Minutes of calls handled by Spyke&apos;s AI, inbound and outbound, rounded up to the nearest minute per call.</td>
                    </tr>
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3.5 font-bold text-white">Spam</td>
                      <td className="py-2 px-3.5 text-slate-400 font-sans">Robocalls, recorded sales pitches, wrong numbers, and hang-up calls under 15 seconds.</td>
                    </tr>
                    <tr className="bg-[#0b101c]">
                      <td className="py-2 px-3.5 font-bold text-white">Statement</td>
                      <td className="py-2 px-3.5 text-slate-400 font-sans">The weekly itemized email listing each Booked Job, call recording link, and amount due.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Clause 2 */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">2.</span>
                <span>What the Client Provides</span>
              </h4>
              <p className="text-slate-400">
                Go-Live depends on these items. Spyke cannot start the 30-day guarantee period until the items marked &quot;Before Go-Live&quot; are provided.
              </p>

              <div className="overflow-x-auto rounded-xl border border-slate-800 mt-2">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0e1626] border-b border-slate-800 text-slate-300 font-bold">
                      <th className="py-2.5 px-3.5 w-1/2">Item</th>
                      <th className="py-2.5 px-3.5 w-1/4">When</th>
                      <th className="py-2.5 px-3.5">Why Needed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-[11px]">
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3.5 font-bold text-white">Business details: legal name, EIN, address, service area (ZIPs)</td>
                      <td className="py-2 px-3.5 text-emerald-400 font-mono">At signing</td>
                      <td className="py-2 px-3.5 text-slate-400">Phone setup &amp; carrier 10DLC registration</td>
                    </tr>
                    <tr className="bg-[#0b101c]">
                      <td className="py-2 px-3.5 font-bold text-white">Services offered, exclusions, pricing rules (diagnostic fee), hours</td>
                      <td className="py-2 px-3.5 text-emerald-400 font-mono">At signing</td>
                      <td className="py-2 px-3.5 text-slate-400">Training AI to answer &amp; quote correctly</td>
                    </tr>
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3.5 font-bold text-white">Calendar/FSM access (ServiceTitan, Jobber, Housecall Pro, Google)</td>
                      <td className="py-2 px-3.5 text-amber-400 font-mono font-bold">Before Go-Live</td>
                      <td className="py-2 px-3.5 text-slate-400">Booking jobs directly &amp; matching call logs</td>
                    </tr>
                    <tr className="bg-[#0b101c]">
                      <td className="py-2 px-3.5 font-bold text-white">Call forwarding from existing business number to Booking Line</td>
                      <td className="py-2 px-3.5 text-amber-400 font-mono font-bold">Before Go-Live</td>
                      <td className="py-2 px-3.5 text-slate-400">So zero calls reach voicemail</td>
                    </tr>
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3.5 font-bold text-white">On-call technician mobile number and emergency escalation rules</td>
                      <td className="py-2 px-3.5 text-amber-400 font-mono font-bold">Before Go-Live</td>
                      <td className="py-2 px-3.5 text-slate-400">Live human transfer for gas smell/no heat</td>
                    </tr>
                    <tr className="bg-[#0b101c]">
                      <td className="py-2 px-3.5 font-bold text-white">Listings manager access (Google Business Profile, Yelp, Website)</td>
                      <td className="py-2 px-3.5 text-slate-400 font-mono">Week 1</td>
                      <td className="py-2 px-3.5 text-slate-400">Displaying Booking Line on all channels</td>
                    </tr>
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3.5 font-bold text-white">Card or US bank account on file with payment authorization</td>
                      <td className="py-2 px-3.5 text-emerald-400 font-mono">At signing</td>
                      <td className="py-2 px-3.5 text-slate-400">Weekly automatic billing</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Clause 3 */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">3.</span>
                <span>Setup, Go-Live &amp; Rollout</span>
              </h4>
              <p className="text-slate-400">
                Voice goes live in about <strong className="text-white">5 to 7 days after signing</strong>. Texting follows once US carriers approve the Client&apos;s registration, which usually takes 1 to 4 weeks.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-xs pl-2">
                <li><strong className="text-white">Day 0, signing:</strong> setup fee paid, payment authorization signed, Client details received. Spyke submits texting carrier registration the same day.</li>
                <li><strong className="text-white">Days 1 to 7, voice build:</strong> Spyke sets up the dedicated Booking Line, trains the AI on Client services, connects calendar, and executes comprehensive test calls.</li>
                <li><strong className="text-white">Go-Live Day:</strong> the Booking Line answers with AI and the existing number is forwarded. Spyke emails confirmation. The 30-day guarantee period officially starts this day.</li>
                <li><strong className="text-white">Weeks 1 to 2, listings:</strong> the Booking Line is added to Google Business Profile (as primary, with existing number retained as secondary), website, Yelp, and local directories.</li>
                <li><strong className="text-white">Carrier approval:</strong> missed-call text-back, booking confirmations, reminders and review requests switch on automatically. The guarantee does not depend on texting.</li>
              </ul>
            </div>

            {/* Clause 4 */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">4.</span>
                <span>Fees</span>
              </h4>
              <p className="text-slate-400">
                The Client pays a one-time setup fee and a fee per Booked Job. There is <strong className="text-white">no monthly retainer or subscription</strong>.
              </p>

              <div className="overflow-x-auto rounded-xl border border-slate-800 mt-2">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0e1626] border-b border-slate-800 text-slate-300 font-bold">
                      <th className="py-2.5 px-3.5">Fee</th>
                      <th className="py-2.5 px-3.5">Amount (USD)</th>
                      <th className="py-2.5 px-3.5">When Charged</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3.5 font-bold text-white font-sans">Setup fee</td>
                      <td className="py-2 px-3.5 text-white font-bold">$2,000, one-time</td>
                      <td className="py-2 px-3.5 text-slate-400 font-sans">At signing</td>
                    </tr>
                    <tr className="bg-[#0b101c]">
                      <td className="py-2 px-3.5 font-bold text-emerald-400 font-sans">Per Booked Repair Job</td>
                      <td className="py-2 px-3.5 text-emerald-400 font-bold">$100</td>
                      <td className="py-2 px-3.5 text-slate-400 font-sans">Weekly, after 48-hour review window</td>
                    </tr>
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3.5 font-bold text-emerald-400 font-sans">Per Booked Replacement Estimate</td>
                      <td className="py-2 px-3.5 text-emerald-400 font-bold">$200</td>
                      <td className="py-2 px-3.5 text-slate-400 font-sans">Weekly, after 48-hour review window</td>
                    </tr>
                    <tr className="bg-[#0b101c]">
                      <td className="py-2 px-3.5 font-bold text-slate-300 font-sans">AI Minutes beyond fair-use allowance</td>
                      <td className="py-2 px-3.5 text-slate-300 font-bold">$0.15 per min</td>
                      <td className="py-2 px-3.5 text-slate-400 font-sans">Weekly, after review window (§5)</td>
                    </tr>
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3.5 font-bold text-emerald-400 font-sans">Monthly retainer</td>
                      <td className="py-2 px-3.5 text-emerald-400 font-bold">$0</td>
                      <td className="py-2 px-3.5 text-slate-400 font-sans">Not charged</td>
                    </tr>
                    <tr className="bg-[#0b101c]">
                      <td className="py-2 px-3.5 font-bold text-slate-300 font-sans">Software, phone calls and texts</td>
                      <td className="py-2 px-3.5 text-emerald-400 font-bold">$0, Spyke pays</td>
                      <td className="py-2 px-3.5 text-slate-400 font-sans">Included in service</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Clause 5 */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">5.</span>
                <span>Fair Use: 60 AI Minutes per Booked Job</span>
              </h4>
              <p className="text-slate-400">
                Each Booked Job includes <strong className="text-white">60 AI Minutes</strong>, pooled across the calendar month. Minutes above the pool are billed at <strong className="text-white">$0.15 per minute</strong>.
              </p>
              <div className="p-3 bg-[#090D15] rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                <div>Allowance = Booked Jobs in month × 60 minutes</div>
                <div>Overage = [AI Minutes used − Allowance (if positive)] × $0.15</div>
                <div className="text-slate-400 text-[11px] font-sans pt-1">
                  * Time after a call is transferred to the Client&apos;s staff does not count toward AI Minutes.
                </div>
              </div>
              <p className="text-xs text-slate-400">
                <strong className="text-white">Why this exists:</strong> Most clients never pay overage. It covers months with heavy call volume and very few bookings, ensuring Spyke&apos;s telephony carrier costs are covered without charging any monthly retainer.
              </p>
            </div>

            {/* Clause 6 */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">6.</span>
                <span>What Is Billable: The 30-Day First-Contact Test</span>
              </h4>
              <p className="text-slate-400">
                One objective test decides every case: <strong className="text-white">did this customer&apos;s first contact come through the Booking Line, or a Spyke outbound call, in the 30 days before the job was booked?</strong> If yes, it is billable, whoever closed the appointment.
              </p>

              <div className="overflow-x-auto rounded-xl border border-slate-800 mt-2">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0e1626] border-b border-slate-800 text-slate-300 font-bold">
                      <th className="py-2 px-3 w-1/2">Scenario</th>
                      <th className="py-2 px-3 w-28">Billable?</th>
                      <th className="py-2 px-3">Why</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-[11px]">
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3 font-medium text-white">AI answers an inbound call and books the job</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">Yes</td>
                      <td className="py-2 px-3 text-slate-400">Came through the Booking Line</td>
                    </tr>
                    <tr className="bg-[#0b101c]">
                      <td className="py-2 px-3 font-medium text-white">Customer calls old number, forwarded to Spyke, AI books</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">Yes</td>
                      <td className="py-2 px-3 text-slate-400">Forwarded calls are part of the Booking Line</td>
                    </tr>
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3 font-medium text-white">AI qualifies caller, transfers to staff, staff books on call</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">Yes</td>
                      <td className="py-2 px-3 text-slate-400">AI handled first contact and qualification</td>
                    </tr>
                    <tr className="bg-[#0b101c]">
                      <td className="py-2 px-3 font-medium text-white">AI qualifies, transfers, staff calls back &amp; books in 30 days</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">Yes</td>
                      <td className="py-2 px-3 text-slate-400">Same customer within 30-day window</td>
                    </tr>
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3 font-medium text-white">Website form or ad lead called by Spyke, booked in 30 days</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">Yes</td>
                      <td className="py-2 px-3 text-slate-400">Spyke outbound call was first contact</td>
                    </tr>
                    <tr className="bg-[#0b101c]">
                      <td className="py-2 px-3 font-medium text-white">Missed call, AI calls or texts back, customer books</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">Yes</td>
                      <td className="py-2 px-3 text-slate-400">Came through the Booking Line</td>
                    </tr>
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3 font-medium text-white">Old estimate or past customer reactivated by Spyke campaign</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">Yes</td>
                      <td className="py-2 px-3 text-slate-400">Spyke outbound call led to booking</td>
                    </tr>
                    <tr className="bg-[#0b101c]">
                      <td className="py-2 px-3 font-medium text-white">Customer cancels the appointment at any time</td>
                      <td className="py-2 px-3 text-amber-400 font-bold">$10 flat</td>
                      <td className="py-2 px-3 text-slate-400">AI handled call &amp; booking. One flat fee, no timing checks</td>
                    </tr>
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3 font-medium text-white">Customer doesn&apos;t show up and didn&apos;t cancel</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">Yes</td>
                      <td className="py-2 px-3 text-slate-400">Booking delivered &amp; automated reminders sent</td>
                    </tr>
                    <tr className="bg-[#0b101c]">
                      <td className="py-2 px-3 font-medium text-white">Walk-in, or customer calling technician&apos;s personal phone</td>
                      <td className="py-2 px-3 text-slate-500 font-bold">No</td>
                      <td className="py-2 px-3 text-slate-400">Never touched the Booking Line</td>
                    </tr>
                    <tr className="bg-[#090D15]">
                      <td className="py-2 px-3 font-medium text-white">Customer outside agreed service area or job type not handled</td>
                      <td className="py-2 px-3 text-slate-500 font-bold">No</td>
                      <td className="py-2 px-3 text-slate-400">Not a qualified Booked Job</td>
                    </tr>
                    <tr className="bg-[#0b101c]">
                      <td className="py-2 px-3 font-medium text-white">Spam, wrong number, vendor, solicitation, job applicant</td>
                      <td className="py-2 px-3 text-slate-500 font-bold">No</td>
                      <td className="py-2 px-3 text-slate-400">Excluded as spam</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Clause 7 */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-emerald-400 font-black">7.</span>
                <span>The Guarantee</span>
              </h4>
              <p className="text-slate-300">
                <strong className="text-white">10 Booked Jobs in the first 30 days after Go-Live</strong>, or booking fees for that period are free. The setup fee is not part of the guarantee.
              </p>
              <div className="p-3.5 bg-emerald-950/30 rounded-xl border border-emerald-500/30 text-xs text-emerald-200/90 space-y-1">
                <p><strong>Example:</strong> Spyke books 7 jobs in the first 30 days. The Client would have owed $700. The Client pays $0 for those bookings and keeps the jobs.</p>
                <p><strong>Period:</strong> The 30 days starting on Go-Live Day, as confirmed by email. Applies once, to the first 30 days only. Standard per-booking fees resume from day 31.</p>
              </div>
              <p className="text-xs text-slate-400">
                <strong className="text-white">Guarantee qualification criteria:</strong> The business receives at least 150 inbound calls and form leads during the 30 days (verified by logs); call forwarding remains active; calendar access remains connected with open slots; client attends booked appointments; and service area matches signing details.
              </p>
            </div>

            {/* Clause 8 */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">8.</span>
                <span>Refunds and Credits</span>
              </h4>
              <p className="text-slate-400">
                The setup fee is not refundable as it covers dedicated engineering and carrier setup. Billing errors and valid disputes are resolved as <strong className="text-white">statement credits</strong> on the next weekly billing cycle. Unused credits upon account termination are refunded via cash within 14 days.
              </p>
            </div>

            {/* Clause 9 */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">9.</span>
                <span>How the Client Is Charged</span>
              </h4>
              <p className="text-slate-400">
                The Client&apos;s card or US bank account is charged automatically every week, after a transparent <strong className="text-white">48-hour review window</strong>.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs pl-2">
                <li><strong className="text-white">Every Monday:</strong> Spyke emails the Statement for the prior Monday-Sunday cycle with links to each call recording.</li>
                <li><strong className="text-white">Monday to Wednesday:</strong> 48-hour review window for Client to review recordings and flag any disputes.</li>
                <li><strong className="text-white">Wednesday:</strong> The total, minus any lines under active dispute, is charged automatically.</li>
              </ul>
            </div>

            {/* Clause 10 */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">10.</span>
                <span>Disputes</span>
              </h4>
              <p className="text-slate-400">
                The Client disputes a line by replying to the Statement email within 48 hours, stating the line and valid reason (e.g., spam, out-of-area, duplicate, customer cancelled). Disputed lines are held and <strong className="text-white">not charged</strong> while Spyke reviews call recordings and makes a determination within 2 business days.
              </p>
            </div>

            {/* Clause 11 */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">11.</span>
                <span>Phone Numbers, Forwarding &amp; Listings</span>
              </h4>
              <p className="text-slate-400">
                Spyke provisions a dedicated local Booking Line in the Client&apos;s area code with custom caller ID displaying the Client&apos;s business name. <strong className="text-white">The Client&apos;s existing phone number always stays owned by the Client</strong> and is simply forwarded to the Booking Line. If Spyke&apos;s system is ever unreachable, calls immediately fall through directly to the Client&apos;s phone. Emergency calls (gas odor, no heat in freeze) route directly to the on-call technician.
              </p>
            </div>

            {/* Clause 12 */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">12.</span>
                <span>Term, Cancellation &amp; Exit</span>
              </h4>
              <p className="text-slate-400">
                The minimum term is <strong className="text-white">6 months from Go-Live Day</strong>, after which the agreement continues on a flexible month-to-month basis with 30 days&apos; written notice. After 6 months, the dedicated Booking Line transfers to the Client for free ($1,000 buyout if terminating prior). Customer records and call recordings are fully exported to the Client within 7 days.
              </p>
            </div>

            {/* Clause 13 */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">13.</span>
                <span>Compliance</span>
              </h4>
              <p className="text-slate-400">
                Calls are announced as recorded at the start of every interaction, satisfying all-party consent laws. The AI discloses it is an automated assistant when queried. Spyke never performs cold calls; outreach is strictly to inbound callers, form submissions, and opted-in estimate leads. Carrier 10DLC registration is completed on the Client&apos;s behalf.
              </p>
            </div>

            {/* Clause 14 */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">14.</span>
                <span>Data and Ownership</span>
              </h4>
              <p className="text-slate-400">
                <strong className="text-white">The Client owns all customer data</strong>, names, numbers, job details, and call recordings. Spyke owns the AI voice agent technology, prompts, workflows, and integrations. Recordings are securely retained for 12 months.
              </p>
            </div>

            {/* Clause 15 */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">15.</span>
                <span>Service Levels, Liability &amp; General Terms</span>
              </h4>
              <p className="text-slate-400">
                The Booking Line operates 24/7/365 with automated human fallback. Support tickets receive responses within 48 hours. Total liability under this Agreement is capped at the setup fee paid ($2,000). This agreement is governed by the laws of the <strong className="text-white">State of Texas, USA</strong> (venue in Dallas County). Typed names submitted with electronic consent constitute valid, legally binding signatures under the U.S. E-SIGN Act and UETA.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: CLIENT ONBOARDING PREREQUISITES CHECKLIST */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-red-500 font-extrabold text-[11px] uppercase tracking-[0.2em]">
              ONBOARDING PREREQUISITES
            </span>
            <div className="flex-1 h-[1px] bg-red-900/30" />
          </div>

          <div className="bg-[#0B0F19] rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <BadgeCheck size={18} className="text-emerald-400" />
                <span>Client Onboarding Prerequisites (Fast 5–7 Day Launch)</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">12 Fast Prep Items</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#090D15] rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">1. Business Details</span>
                <p className="text-slate-400 text-[11px]">EIN, registered address, primary contact info for 10DLC registration.</p>
              </div>
              <div className="p-3 bg-[#090D15] rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">2. Service Area</span>
                <p className="text-slate-400 text-[11px]">Specific ZIP codes and municipal service radius for AI qualification.</p>
              </div>
              <div className="p-3 bg-[#090D15] rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">3. Services &amp; Job Types</span>
                <p className="text-slate-400 text-[11px]">Repairs, maintenance, replacements, and non-serviced equipment rules.</p>
              </div>
              <div className="p-3 bg-[#090D15] rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">4. Hours &amp; Scheduling</span>
                <p className="text-slate-400 text-[11px]">Standard booking slots, arrival windows, and dispatch capacity.</p>
              </div>
              <div className="p-3 bg-[#090D15] rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">5. Emergency Transfers</span>
                <p className="text-slate-400 text-[11px]">On-call technician mobile line for immediate human transfer.</p>
              </div>
              <div className="p-3 bg-[#090D15] rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">6. Diagnostic Pricing</span>
                <p className="text-slate-400 text-[11px]">Standard trip/diagnostic fee quoted to callers before scheduling.</p>
              </div>
              <div className="p-3 bg-[#090D15] rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">7. FSM/Calendar Access</span>
                <p className="text-slate-400 text-[11px]">Connection to ServiceTitan, Jobber, Housecall Pro, or Google Calendar.</p>
              </div>
              <div className="p-3 bg-[#090D15] rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">8. Voice Tone &amp; Style</span>
                <p className="text-slate-400 text-[11px]">Professional, conversational tone configured with English/Spanish options.</p>
              </div>
              <div className="p-3 bg-[#090D15] rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">9. Billing &amp; Payment Card</span>
                <p className="text-slate-400 text-[11px]">Card or US bank account on file for automated weekly settlement.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: EXECUTION */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-red-500 font-extrabold text-[11px] uppercase tracking-[0.2em]">
              EXECUTION
            </span>
            <div className="flex-1 h-[1px] bg-red-900/30" />
          </div>

          <form onSubmit={handleExecute} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 5A: PROVIDER PRE-EXECUTED SIGNATURE */}
              <div className="bg-[#0B0F19] rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      THE PROVIDER, PRE-EXECUTED
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                      SIGNED
                    </span>
                  </div>

                  {/* Corporate Digital Seal / Authorized Signature */}
                  <div className="py-4 my-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <ShieldCheck size={22} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-1.5">
                          <span>Spyke AI Technologies</span>
                          <CheckCircle2 size={14} className="text-emerald-400" />
                        </div>
                        <p className="text-[11px] font-mono text-emerald-400/90 mt-0.5">
                          Verified Digital Corporate Seal
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">Authorized Corporate Signatory</p>
                    <p className="text-[11px] text-slate-400">for Spyke AI Technologies</p>
                    <p className="text-[10px] text-slate-400 font-mono">Operations &amp; Legal Department</p>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 font-mono pt-3 border-t border-slate-800/60">
                  Signed in advance · effective on the date of your signature below
                </p>
              </div>

              {/* 5B: CLIENT SIGNATURE INPUT */}
              <div className="bg-[#0B0F19] rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      THE CLIENT
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                        executedData
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                          : formData.signature
                          ? "bg-blue-950/80 text-blue-400 border-blue-500/40"
                          : "bg-amber-950/80 text-amber-400 border-amber-500/40"
                      }`}
                    >
                      {executedData ? "SIGNED" : formData.signature ? "SIGNATURE READY" : "AWAITING SIGNATURE"}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Type your full legal name to sign <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!executedData}
                      value={formData.signature}
                      onChange={(e) => handleInputChange("signature", e.target.value)}
                      placeholder="Type your full name, this is your signature"
                      className="w-full px-3.5 py-3 bg-[#090D15] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-60 font-medium"
                    />

                    {/* Live Signature Preview */}
                    {formData.signature && (
                      <div className="pt-2 px-1">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                          Signature Preview:
                        </span>
                        <div
                          className="text-2xl text-blue-400 italic font-serif select-none"
                          style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive, Georgia, serif" }}
                        >
                          {formData.signature}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 font-mono pt-3 border-t border-slate-800/60">
                  Date &amp; time are stamped automatically on execution.
                </p>
              </div>
            </div>

            {/* ERROR BANNER */}
            {errorMessage && (
              <div className="p-4 bg-red-950/70 border border-red-500/50 rounded-2xl text-red-200 text-xs flex items-center justify-between shadow-lg animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <AlertCircle size={18} className="text-red-400 shrink-0" />
                  <span className="font-semibold">{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-red-300 hover:text-white font-bold text-xs"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* CONSENT CHECKBOX */}
            {!executedData && (
              <div className="p-4 sm:p-5 bg-[#0B0F19] border border-slate-800 rounded-xl flex items-start gap-3.5 shadow-lg">
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  checked={formData.consent}
                  onChange={(e) => handleInputChange("consent", e.target.checked)}
                  className="mt-1 w-4 h-4 rounded bg-[#070A12] border-slate-700 text-red-600 focus:ring-red-500 focus:ring-offset-0 cursor-pointer accent-red-600"
                />
                <label htmlFor="consentCheckbox" className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
                  <strong className="text-white">I have read this entire HVAC Booking Engine Agreement and agree to all terms, pricing ($2,000 setup, $100/repair, $200/replacement estimate), and guarantee conditions.</strong> I agree that typing my name above and clicking &quot;Sign &amp; Execute&quot; constitutes my legal electronic signature under the U.S. E-SIGN Act and UETA, and I consent to receive the executed contract PDF and related records electronically at the email address provided.
                </label>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            {!executedData ? (
              <div className="flex flex-col items-center justify-center pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto min-w-[340px] px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm tracking-wide shadow-xl shadow-red-900/30 hover:shadow-red-800/50 transition-all transform active:scale-[0.99] cursor-pointer disabled:opacity-50 text-center flex flex-col items-center justify-center gap-1"
                >
                  <div className="flex items-center gap-2">
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>PROCESSING &amp; EXECUTING...</span>
                      </>
                    ) : (
                      <>
                        <span>SIGN &amp; EXECUTE THE AGREEMENT</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </div>
                  <span className="text-[11px] font-normal text-white/80">
                    Official contract PDF is emailed to you instantly
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50"
                >
                  <Download size={16} />
                  <span>Download Official PDF Contract</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer size={15} />
                  <span>Print Record</span>
                </button>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white font-semibold text-xs hover:bg-slate-850 transition-all flex items-center justify-center gap-2 text-center"
                >
                  <span>Return to Website</span>
                </Link>
              </div>
            )}
          </form>
        </section>

        {/* FOOTER METADATA */}
        <footer className="pt-8 border-t border-slate-800/80 text-center text-xs text-slate-400 space-y-2">
          <p>
            Spyke AI Technologies · Dallas, TX, USA &amp; Hyderabad, India · Official Electronic Records
          </p>
          <p className="text-[11px]">
            Protected under U.S. Electronic Signatures in Global and National Commerce Act (E-SIGN Act, 15 U.S.C. § 7001) &amp; UETA.
          </p>
        </footer>
      </div>
    </div>
  );
}
