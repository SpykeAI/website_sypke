"use client";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { PhoneCall, Loader2, ArrowLeft } from "lucide-react";

export default function OutboundCallForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // OTP States
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [hashPayload, setHashPayload] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
       setErrorMessage("Please enter a valid phone number");
       return;
    }
    setStatus("loading");
    setErrorMessage("");

    if (!otpStep) {
      if (!email) {
        setErrorMessage("Please enter a valid email");
        setStatus("idle");
        return;
      }
      try {
        const otpRes = await fetch("/api/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const otpData = await otpRes.json();
        
        if (otpRes.ok && otpData.success) {
          setHashPayload(otpData.hash);
          setOtpStep(true);
          setStatus("idle");
        } else {
          setErrorMessage(otpData.error || "Failed to send OTP");
          setStatus("error");
        }
      } catch (err) {
        setErrorMessage("Network error. Could not send OTP.");
        setStatus("error");
      }
    } else {
      try {
        const verifyRes = await fetch("/api/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, hashPayload }),
        });

        const verifyData = await verifyRes.json();

        if (verifyRes.ok && verifyData.success) {
          // Trigger actual call
          const res = await fetch("/api/call", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, email }),
          });
          
          const data = await res.json();
          
          if (!res.ok) {
            throw new Error(data.error || "Failed to trigger call");
          }
          
          setStatus("success");
          setOtpStep(false);
        } else {
          setErrorMessage(verifyData.error || "Invalid OTP");
          setStatus("error");
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message || "An error occurred");
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-2xl relative z-10">
      <div className="mb-8 text-center">
         <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold mb-4 text-xs uppercase tracking-wide">
           Live Outbound Demo
         </div>
         <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Experience Our AI Voice Agent</h3>
         <p className="text-gray-500 text-sm font-medium">Enter your details and our AI will call you right now.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-4">
            {errorMessage}
          </div>
        )}

        {!otpStep ? (
          <>
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-blue-800 text-xs font-medium text-center mb-4">
              Note: We will send you an OTP to verify your phone and email address.
            </div>
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none"
                required
              />
            </div>
            <div className="flex flex-col">
              <PhoneInput
                international
                defaultCountry="US"
                value={phone}
                onChange={(v) => setPhone(v || "")}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-[#00DF81] focus-within:border-transparent flex items-center gap-3"
              />
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
             <button 
                type="button" 
                onClick={() => { setOtpStep(false); setStatus("idle"); setErrorMessage(""); }}
                className="text-gray-500 hover:text-gray-900 mb-4 flex items-center text-sm font-medium mx-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </button>
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-blue-800 text-sm font-medium text-center mb-4">
                We've sent a code to <strong>{email}</strong>
              </div>
              <input 
                type="text" 
                required 
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none text-center tracking-[0.5em] text-xl font-bold mb-4" 
                placeholder="------" 
              />
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full bg-[#00DF81] text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-[#00c271] transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : status === "success" ? (
            "Call Initiated! 📞"
          ) : otpStep ? (
            "Verify & Call Me Now"
          ) : (
            <>
              <PhoneCall className="w-5 h-5" />
              Get OTP
            </>
          )}
        </button>
      </form>
    </div>
  );
}
