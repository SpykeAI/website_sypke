"use client";

import { useState } from "react";
import { Lock, ArrowRight, Eye, EyeOff, Mail, KeyRound, CheckCircle2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // OTP Login Mode (Forgot Password)
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [hashPayload, setHashPayload] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Standard Password Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(data.redirectUrl || "/inbox");
        router.refresh();
      } else {
        setError(data.error || "Incorrect email address or password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP via Gmail SMTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingOtp(true);
    setError("");

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.hash) {
        setHashPayload(data.hash);
        setOtpSent(true);
      } else {
        setError(data.error || "Failed to send verification code. Please check SMTP.");
      }
    } catch {
      setError("Network error sending OTP. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 2: Verify OTP and Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: otpEmail,
          otp,
          hashPayload,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(data.redirectUrl || "/inbox");
        router.refresh();
      } else {
        setError(data.error || "Invalid or expired verification code.");
      }
    } catch {
      setError("Something went wrong during verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#00DF81]/10 rounded-full flex items-center justify-center mb-4">
            {isOtpMode ? <KeyRound className="w-8 h-8 text-[#00DF81]" /> : <Lock className="w-8 h-8 text-[#00DF81]" />}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            {isOtpMode ? "OTP Login & Recovery" : "Super Admin Portal"}
          </h1>
          <p className="text-gray-500 mt-2 text-center text-sm">
            {isOtpMode
              ? "Receive a secure one-time verification code on your administrator email."
              : "Enter your credentials to view AI transcripts and portal controls."}
          </p>
        </div>

        {/* Standard Password Mode */}
        {!isOtpMode ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email or User ID</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent transition text-gray-900 text-sm"
                placeholder="Enter your email or user ID"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Master Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsOtpMode(true);
                    if (email) setOtpEmail(email);
                    setError("");
                  }}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent transition text-gray-900 text-sm"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00DF81] hover:bg-[#00c271] text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Login to Dashboard"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        ) : (
          /* OTP Login Mode */
          <div className="space-y-5">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Administrator Email</label>
                  <input
                    type="email"
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent transition text-gray-900 text-sm"
                    placeholder="Enter your email address"
                    required
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5">
                    We will send a 6-digit verification code to this address.
                  </p>
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={sendingOtp}
                  className="w-full bg-[#00DF81] hover:bg-[#00c271] text-gray-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 text-sm"
                >
                  {sendingOtp ? "Sending Code via Gmail..." : "Send Verification Code"}
                  {!sendingOtp && <Mail className="w-4 h-4" />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                  <span>Code sent to <strong>{otpEmail}</strong>! Please check your inbox.</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent transition text-gray-900 text-center font-mono text-xl tracking-widest"
                    placeholder="••••••"
                    maxLength={6}
                    required
                    autoFocus
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[11px] text-gray-400">Valid for 5 minutes</span>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={sendingOtp}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      {sendingOtp ? "Resending..." : "Resend Code"}
                    </button>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full bg-[#00DF81] hover:bg-[#00c271] text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify Code & Login"}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            )}

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsOtpMode(false);
                  setError("");
                  setOtpSent(false);
                }}
                className="text-xs font-semibold text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 transition"
              >
                <ArrowLeft size={13} />
                <span>Back to Master Password Login</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
