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
      setErrorMessage("Please enter your Company / Business Name.");
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
      link.download = executedData.pdfFilename || `SpykeAI_Client_Agreement_${executedData.agreementId}.pdf`;
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
            Client Services Agreement
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-12">
        {/* HERO TITLE HEADER */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-950/60 text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            CLIENT SERVICES & IMPLEMENTATION AGREEMENT
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Spyke AI Client Agreement
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Legally binding electronic agreement for the deployment, configuration, and implementation of the Spyke AI Voice & Messaging System.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-xs text-slate-400 font-mono">
            <span>REF: SPYKE-MASTER-2026</span>
            <span>·</span>
            <span>GOVERNING LAW: TEXAS, USA</span>
            <span>·</span>
            <span>E-SIGN & UETA COMPLIANT</span>
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
                      EXECUTED & BINDING
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
              ✓ An authoritative copy of this signed agreement along with full timestamp, cryptographic record, and execution details has been sent to your email. You can download or print this page at any time for your corporate records.
            </p>
          </div>
        )}

        {/* SECTION 1: THE PARTIES */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-red-500 font-extrabold text-[11px] uppercase tracking-[0.2em]">
              THE PARTIES
            </span>
            <div className="flex-1 h-[1px] bg-red-900/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1A: THE PROVIDER */}
            <div className="bg-[#0B0F19] rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  THE PROVIDER (&quot;SPYKE AI&quot;, &quot;WE&quot;)
                </span>
                <h3 className="text-lg font-black text-white mt-1">Spyke AI Technologies</h3>
              </div>

              <div className="text-xs text-slate-400 space-y-3 leading-relaxed">
                <p>
                  <strong className="text-white">Spyke AI Technologies</strong> is the contracting entity under this Agreement and is responsible for delivering the services and honoring the guarantee and refund obligations.
                </p>
                <p>
                  <strong className="text-slate-300">Global Operations &amp; Delivery:</strong> Dallas, TX 75208, United States &amp; Hyderabad, Telangana, India. Your Agreement is directly with Spyke AI Technologies.
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

            {/* 1B: THE CLIENT */}
            <div className="bg-[#0B0F19] rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  THE CLIENT (&quot;YOU&quot;)
                </span>
                <h3 className="text-lg font-black text-white mt-1">Your Details</h3>
              </div>

              <div className="space-y-3.5">
                {/* Company Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Company / Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!executedData}
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="Your Company LLC"
                    className="w-full px-3.5 py-2.5 bg-[#090D15] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-60 font-medium"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Website
                  </label>
                  <input
                    type="text"
                    disabled={!!executedData}
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="yourcompany.com"
                    className="w-full px-3.5 py-2.5 bg-[#090D15] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-60 font-medium"
                  />
                </div>

                {/* Signatory Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Full Legal Name (signatory) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!executedData}
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 bg-[#090D15] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-60 font-medium"
                  />
                </div>

                {/* Business Address */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Business Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!executedData}
                    value={formData.businessAddress}
                    onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                    placeholder="Street, City, State/Region, Country"
                    className="w-full px-3.5 py-2.5 bg-[#090D15] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-60 font-medium"
                  />
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      disabled={!!executedData}
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="you@yourcompany.com"
                      className="w-full px-3.5 py-2.5 bg-[#090D15] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-60 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Phone <span className="text-red-500">*</span>
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

        {/* SECTION 2: THE AGREEMENT */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-red-500 font-extrabold text-[11px] uppercase tracking-[0.2em]">
              THE AGREEMENT
            </span>
            <div className="flex-1 h-[1px] bg-red-900/30" />
          </div>

          <div className="bg-[#0B0F19] rounded-2xl border border-slate-800 p-6 sm:p-9 space-y-8 shadow-xl text-xs sm:text-[13px] leading-relaxed text-slate-300">
            {/* Clause 1 */}
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">1.</span>
                <span>Services, The Spyke AI System</span>
              </h4>
              <p className="text-slate-400">
                Upon payment of the Fee (§2), we grant you access to the <strong className="text-white">Spyke AI System</strong>, which includes: the complete AI voice agent, softphone and messaging infrastructure and all its modules; niche customization and voice agent workflow building with our team; the inbound and outbound call handling systems and software tools we provision for members; funnel, CRM, webhook and automation frameworks; our templates, scripts and resources; the client community; and the support channels described in §4. <strong className="text-white">Your access does not expire</strong>, you keep the System for as long as the Spyke AI System operates, with no renewal fees and no re-purchase (§12). <strong className="text-white">If your written offer, checkout page, or invoice includes the Inbound Engine / Growth package</strong>, the Services also include: your custom AI Voice Agent (landing page, application and booking flow) built for you; ad creatives and scripts from our playbook; telephony, Twilio/Telnyx line and pixel tracking setup; campaign structure built in your account; a joint launch; and retargeting and follow-up flows connected to your CRM. Ad spend and carrier telecommunication fees are paid by you directly to the platforms and are never part of any Fee. We may improve, update or substitute components of the System over time, provided the overall substance of what you purchased is preserved or improved.
              </p>
            </div>

            {/* Clause 2 */}
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">2.</span>
                <span>Fees &amp; Payment</span>
              </h4>
              <p className="text-slate-400">
                Your Fee is the exact price you were quoted and agreed <strong className="text-white">in writing before signing</strong>, on your invoice, checkout page, or written payment agreement (the <strong className="text-white">&quot;Fee&quot;</strong>), including any installment or milestone schedule agreed there. <strong className="text-white">Nothing on this page adds to it</strong>: no hidden costs, no required upsells, no renewal or maintenance fees, ever. Access is granted on receipt of the first payment. If a scheduled payment is not made when due, we may pause access until it is, and if that happens, your §5 guarantee clock simply pauses too and resumes when access is restored; a pause never resets your progress. All amounts are in USD unless stated otherwise.
              </p>
            </div>

            {/* Clause 3 */}
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">3.</span>
                <span>Onboarding &amp; Implementation</span>
              </h4>
              <p className="text-slate-400">
                After purchase, we run onboarding with you, which includes <strong className="text-white">niche finalization</strong> and <strong className="text-white">voice agent / workflow building</strong> together with our team, followed by installation of the outreach and automated calling system (the <strong className="text-white">&quot;Setup Phase&quot;</strong>). We complete installation within <strong className="text-white">14 days</strong> of you finishing your onboarding steps, usually much faster. You agree to participate in onboarding, provide the information and account access reasonably needed, and complete the steps that only you can perform (e.g. account signups, verifications, audio recordings). <strong className="text-white">&quot;Full Implementation&quot;</strong> means: onboarding completed; niche and offer finalized with our team; the outreach system installed; the automations <strong className="text-white">switched ON and running continuously</strong> at the settings we give you <strong className="text-white">in writing at onboarding</strong> (so the target never moves on you); and your booking calendar connected. <strong className="text-white">Full Implementation is reached, at the latest, when at least four (4) outreach channels are live and running.</strong> Most clients are fully live within 7 to 10 days of starting onboarding; fast movers do it in 4. The moment Full Implementation is reached, <strong className="text-white">we confirm it to you in writing, and that confirmation is the official start of your 60-day guarantee window (§5)</strong>, so you always know exactly where you stand.
              </p>
            </div>

            {/* Clause 4 */}
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">4.</span>
                <span>Support, Unlimited, in Writing</span>
              </h4>
              <p className="text-slate-400">
                From the moment your offer building and niche finalization are complete, you may raise <strong className="text-white">unlimited support requests</strong>, questions, reviews, fixes, anything related to the System, via <strong className="text-white">email, our ticketing system, or SMS</strong>. There is no cap on the number of tickets or requests. We respond in the order received and within a commercially reasonable time. Support covers the System and its implementation; it does not include us operating your business for you.
              </p>
            </div>

            {/* Clause 5: THE REFUND GUARANTEE (HIGHLIGHTED GREEN CARD) */}
            <div className="bg-[#091512] border-2 border-emerald-500/40 rounded-2xl p-6 sm:p-7 space-y-4 shadow-lg shadow-emerald-950/20">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-emerald-400 font-black">5.</span>
                <span>The Refund Guarantee</span>
              </h4>

              <div className="flex items-center gap-2 text-emerald-400 font-black text-base sm:text-lg tracking-tight">
                <Check size={20} className="stroke-[3]" />
                <span>100% Money-Back Guarantee, refunded within 24 hours</span>
              </div>

              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed font-medium">
                Implement the system, keep it live for 60 days, and if it doesn&apos;t book you at least 2 sales calls every single day, we refund 100% of what you paid. Happily, and within 24 hours of verifying. No partial refunds, no credits-instead-of-cash, no hoops.
              </p>

              <div className="pt-3 border-t border-emerald-900/40 text-xs text-emerald-200/80 space-y-2 leading-relaxed">
                <p>
                  • <strong className="text-emerald-300">5.1, When it applies.</strong> (a) You reached <strong className="text-white">Full Implementation</strong> (§3), (b) the outreach system was <strong className="text-white">live, automations on and running, for 60 consecutive days</strong> at the prescribed settings, and (c) during that period it did not book you at least <strong className="text-white">two (2) Qualified Sales Calls every single day</strong> (defined in 5.2), as shown by the System&apos;s own logs and your connected calendar.
                </p>
                <p>
                  • <strong className="text-emerald-300">5.2, Qualified Calls.</strong> A Qualified Call is an attended conversation with an eligible prospect in your target niche who expressed clear interest in your service offering.
                </p>
              </div>
            </div>

            {/* Clause 6 */}
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">6.</span>
                <span>Your Responsibilities</span>
              </h4>
              <p className="text-slate-400">
                You agree to: (a) complete onboarding and the steps only you can do, within a reasonable time of our requests; (b) keep your accounts, tools and integrations connected and in good standing; (c) use the System only for lawful business purposes; (d) not share, resell, or provide access to the System or its materials to any third party; and (e) tell us promptly, through support, when something isn&apos;t working, so we can fix it.
              </p>
            </div>

            {/* Clause 7 */}
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">7.</span>
                <span>Compliance Is Yours</span>
              </h4>
              <p className="text-slate-400">
                You are the sender and operator of your own outreach. You are responsible for your compliance with the laws and platform rules that apply to your messages and your market, including (as applicable) CAN-SPAM, TCPA, A2P/carrier rules, GDPR/UK-GDPR, PECR, and each platform&apos;s terms of service. We provide tools, training and prescribed settings designed for sensible use; we are not your lawyer and do not warrant your outreach&apos;s legal compliance in your jurisdiction. Our side of it: we will never knowingly configure the System, or instruct you, to run outreach that violates applicable laws, carrier requirements, or platform policies. The prescribed settings are designed to operate within them.
              </p>
            </div>

            {/* Clause 8 */}
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">8.</span>
                <span>Intellectual Property</span>
              </h4>
              <p className="text-slate-400">
                The System, trainings, scripts, templates, software, prompts, frameworks, and materials, is and remains our intellectual property (or that of our licensors). You receive a non-exclusive, non-transferable license to use it for your own business while you have access. Assets we create for you during implementation (your funnel copy, your creatives, your configured systems) are yours to keep and use for your business, and if your access ever ends, those assets remain yours and we will provide a reasonable export of your CRM data on request.
              </p>
            </div>

            {/* Clause 9 */}
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">9.</span>
                <span>Confidentiality</span>
              </h4>
              <p className="text-slate-400">
                Each party will keep the other&apos;s non-public information confidential and use it only for purposes of this Agreement. This survives termination. We may state that you are a client; we will only publish your specific results with your consent.
              </p>
            </div>

            {/* Clause 10 */}
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">10.</span>
                <span>No Other Earnings Promises</span>
              </h4>
              <p className="text-slate-400">
                Business results vary with markets, effort and execution. Other than the express Refund Guarantee in §5, which is real, and honored exactly as written, we make no other guarantee of income, revenue, or results, and any figures shown in our marketing are examples, not promises.
              </p>
            </div>

            {/* Clause 11 */}
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">11.</span>
                <span>Limitation of Liability</span>
              </h4>
              <p className="text-slate-400">
                To the maximum extent permitted by law: neither party is liable for indirect, incidental, special or consequential damages; and our total aggregate liability under this Agreement is capped at the Fee you actually paid. Nothing in this Agreement limits liability that cannot lawfully be limited (including fraud).
              </p>
            </div>

            {/* Clause 12 */}
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">12.</span>
                <span>Term &amp; Termination</span>
              </h4>
              <p className="text-slate-400">
                This Agreement starts on the Effective Date (the date you sign below). Your access does not expire, it continues for as long as the Spyke AI System operates, with no renewal fees. We may terminate for your material breach (including non-payment or sharing access) that remains uncured 14 days after written notice. You are protected the same way: if we materially fail to deliver the services (for example, you request a call or support and hear nothing back within 3 business days), tell us in writing. If we have not fixed it within 14 days of that notice, you may terminate this Agreement and receive a full refund of the Fee you have actually paid. Otherwise, you may stop using the System at any time; fees already paid are only refundable under §5 or this clause.
              </p>
            </div>

            {/* Clause 13 */}
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">13.</span>
                <span>Governing Law &amp; Disputes</span>
              </h4>
              <p className="text-slate-400">
                This Agreement is governed by the laws of the <strong className="text-white">State of Texas, USA</strong>, without regard to conflict-of-law rules. The parties will first attempt in good faith to resolve any dispute through the support channels and direct discussion within 30 days before starting formal proceedings. Venue for formal proceedings is <strong className="text-white">Dallas County, Texas</strong>, except that either party may seek injunctive relief for IP or confidentiality breaches in any competent court.
              </p>
            </div>

            {/* Clause 14 */}
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">14.</span>
                <span>Electronic Signature &amp; Records</span>
              </h4>
              <p className="text-slate-400">
                Both parties agree to do business electronically. Your typed name below, submitted with the consent box checked, is your electronic signature and is legally binding under the U.S. E-SIGN Act and UETA, and the UK&apos;s Electronic Communications Act 2000 / eIDAS as applicable. Our counter-signature is applied in advance and delivered with this document. The executed record, including both signatures, your details, the date-time stamp and the signing IP address, is stored by us and emailed to you; that record is the authoritative copy.
              </p>
            </div>

            {/* Clause 15 */}
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">15.</span>
                <span>Notices</span>
              </h4>
              <p className="text-slate-400">
                Notices to us: <strong className="text-white">contact@spykeai.com</strong>, or post to either address in the Parties section. Notices to you: the email address you provide below. Email notice is effective on sending, absent a bounce.
              </p>
            </div>

            {/* Clause 16 */}
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2">
                <span className="text-red-500 font-black">16.</span>
                <span>General</span>
              </h4>
              <p className="text-slate-400">
                This document plus your invoice/payment agreement is the entire agreement and supersedes prior discussions. If any clause is unenforceable, the rest stands. Amendments must be in writing (email suffices) and agreed by both parties. You may not assign this Agreement without our written consent; we may assign to an affiliate. Nothing here creates a partnership, employment or agency relationship.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: EXECUTION */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-red-500 font-extrabold text-[11px] uppercase tracking-[0.2em]">
              EXECUTION
            </span>
            <div className="flex-1 h-[1px] bg-red-900/30" />
          </div>

          <form onSubmit={handleExecute} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 3A: PROVIDER PRE-EXECUTED SIGNATURE */}
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

              {/* 3B: CLIENT SIGNATURE INPUT */}
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
                  <strong className="text-white">I have read this entire Agreement and I agree to all of its terms.</strong> I agree that typing my name above and clicking &quot;Sign &amp; Execute&quot; constitutes my legal electronic signature, and I consent to receive the executed copy and related records electronically at the email address I provided.
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
                    Your executed copy is emailed to you instantly
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
