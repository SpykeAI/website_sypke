"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  User,
  Building2,
  Mail,
  MapPin,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Save,
  RefreshCw,
  AlertCircle,
  Phone,
  Briefcase,
  Lock,
  Globe2,
  Check
} from "lucide-react";

interface ClientProfile {
  id?: string;
  name: string;
  email: string;
  company_name: string;
  registered_address: string;
  ein: string;
  phone: string;
  role: string;
  portal_type: string;
  status: string;
}

export default function ClientPortalProfilePage() {
  const [profile, setProfile] = useState<ClientProfile>({
    name: "",
    email: "",
    company_name: "",
    registered_address: "",
    ein: "",
    phone: "",
    role: "Client",
    portal_type: "external",
    status: "active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch client profile on load
  const loadProfile = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/client/profile");
      if (res.status === 401 || res.status === 403) {
        window.location.href = "/clientportal/login";
        return;
      }
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile((prev) => ({
          ...prev,
          ...data.profile,
        }));
      } else {
        setErrorMessage(data.error || "Unable to fetch client profile.");
      }
    } catch {
      setErrorMessage("Network error while loading profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Client-side authentication lock
    const cookies = document.cookie.split(";").reduce((acc: any, cookie) => {
      const [key, val] = cookie.trim().split("=");
      if (key && val) acc[key] = decodeURIComponent(val);
      return acc;
    }, {});

    const isAuthenticated = cookies.admin_session === "authenticated";
    const role = cookies.portal_role;

    if (!isAuthenticated || (role !== "external" && role !== "superadmin")) {
      window.location.href = "/clientportal/login";
      return;
    }

    loadProfile();
  }, []);

  const handleChange = (field: keyof ClientProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (successMessage) setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/client/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          company_name: profile.company_name,
          registered_address: profile.registered_address,
          ein: profile.ein,
          phone: profile.phone,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage("Account details and business verification saved successfully.");
        setHasChanges(false);
        if (data.profile) {
          setProfile((prev) => ({ ...prev, ...data.profile }));
        }
      } else {
        setErrorMessage(data.error || "Failed to update profile details.");
      }
    } catch {
      setErrorMessage("An unexpected network error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* SIDEBAR NAVIGATION */}
      <AdminSidebar active="clientportal" />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* HEADER BAR */}
        <header className="bg-white border-b border-slate-200/90 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Globe2 size={18} />
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Account Management <span className="text-blue-600 font-semibold text-base">(Profile)</span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage personal details, registered business entity credentials, and tax identification (EIN).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck size={14} className="text-blue-600" />
              Verified Client Portal
            </span>

            <button
              onClick={handleSubmit}
              disabled={saving || loading}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer ${
                hasChanges
                  ? "bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-500/20"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              } disabled:opacity-50`}
            >
              {saving ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          {/* FEEDBACK BANNERS */}
          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center justify-between shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span className="font-semibold">{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-emerald-700 hover:text-emerald-900 font-bold text-xs cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center justify-between shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <AlertCircle size={18} className="text-rose-600 shrink-0" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-700 hover:text-rose-900 font-bold text-xs cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
              <RefreshCw size={24} className="text-blue-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-600">Loading Account Details...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SECTION 1: PERSONAL INFORMATION */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <User size={20} />
                  </span>
                  <div>
                    <h2 className="text-base font-black text-slate-900">Personal Information</h2>
                    <p className="text-xs text-slate-400">Primary authorized representative details for your client portal.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={profile.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Check size={10} /> Verified Login ID
                      </span>
                    </div>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={profile.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="name@company.com"
                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Contact Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="e.g. +1 (346) 477-0028"
                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: BUSINESS DETAILS */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Building2 size={20} />
                  </span>
                  <div>
                    <h2 className="text-base font-black text-slate-900">Business Details</h2>
                    <p className="text-xs text-slate-400">Official registered corporate entity, tax ID (EIN), and physical office address.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Company Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={profile.company_name}
                        onChange={(e) => handleChange("company_name", e.target.value)}
                        placeholder="e.g. Spyke AI Technologies LLC"
                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Legal registered business name as filed with government authorities.
                    </p>
                  </div>

                  {/* Business ID - EIN */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Business ID - EIN <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <Lock size={11} className="text-emerald-500" /> Encrypted Entity ID
                      </span>
                    </div>
                    <div className="relative">
                      <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={profile.ein}
                        onChange={(e) => handleChange("ein", e.target.value)}
                        placeholder="XX-XXXXXXX (e.g. 12-3456789)"
                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs text-slate-900 font-mono font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Federal 9-digit Employer Identification Number (EIN) for tax compliance and carrier approvals.
                    </p>
                  </div>

                  {/* Business Registered Address */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Business Registered Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <textarea
                        required
                        rows={3}
                        value={profile.registered_address}
                        onChange={(e) => handleChange("registered_address", e.target.value)}
                        placeholder="Suite / Street Address, City, State, ZIP / Postal Code, Country"
                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none leading-relaxed"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Official legal address registered for tax and communications.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECURITY & STATUS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Workspace Role</span>
                    <span className="text-xs font-black text-slate-800 capitalize">{profile.role || "Client"}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Account Status</span>
                    <span className="text-xs font-black text-emerald-600 capitalize">
                      {profile.status === "active" ? "Active & Verified" : "Pending Verification"}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Lock size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Data Protection</span>
                    <span className="text-xs font-black text-purple-700">Encrypted Workspace</span>
                  </div>
                </div>
              </div>

              {/* BOTTOM ACTIONS */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  {hasChanges ? "You have unsaved edits." : "All details up to date."}
                </span>

                <button
                  type="submit"
                  disabled={saving || !hasChanges}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-sm shadow-blue-700/20 transition-all cursor-pointer"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Save Account Details</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
