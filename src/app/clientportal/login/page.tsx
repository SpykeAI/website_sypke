"use client";

import { useState } from "react";
import { Lock, ArrowRight, Eye, EyeOff, Globe2, ArrowLeft, ShieldCheck, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ClientPortalLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(data.redirectUrl || "/clientportal");
        router.refresh();
      } else {
        setError(data.error || "Invalid client credentials. Please check your User ID and password.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* TOP HEADER */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="SpykeAI" className="h-8 w-auto object-contain" />
          <span className="text-xs font-bold text-slate-400 border-l border-slate-200 pl-2.5 hidden sm:inline">
            Client Portal
          </span>
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Website</span>
        </Link>
      </div>

      {/* LOGIN CARD */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 sm:p-9 space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-200/80 rounded-2xl flex items-center justify-center shadow-xs">
              <Globe2 size={32} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
                <ShieldCheck size={12} className="text-blue-600" />
                External Client Access
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Client Portal Login
              </h1>
              <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                Enter your authorized client credentials to access your account workspace and business profile.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium leading-relaxed">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Client User ID or Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your client email or user ID"
                  required
                  autoFocus
                  autoComplete="username"
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Client Portal</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 leading-normal">
              Client accounts are issued and managed exclusively by your SpykeAI Administrator.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="max-w-md mx-auto text-center py-2 text-[11px] text-slate-400">
        © {new Date().getFullYear()} SpykeAI Technologies. All rights reserved.
      </div>
    </div>
  );
}
