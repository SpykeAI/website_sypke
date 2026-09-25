"use client";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { PhoneCall, Loader2 } from "lucide-react";

export default function OutboundCallForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
       setErrorMessage("Please enter a valid phone number");
       return;
    }
    setStatus("loading");
    setErrorMessage("");

    try {
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
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "An error occurred");
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-2xl relative z-10">
      <div className="mb-8 text-center">
         <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold mb-4 text-xs uppercase tracking-wide">
           Live Outbound Demo
         </div>
         <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Experience it instantly</h3>
         <p className="text-gray-500 text-sm font-medium">Enter your number and our AI will call you right now.</p>
      </div>

      {status === "success" ? (
         <div className="bg-[#E8FBF1] text-green-900 p-8 rounded-2xl text-center border border-[#00DF81]/20">
            <PhoneCall className="w-16 h-16 mx-auto mb-4 text-[#00DF81] animate-pulse" />
            <h4 className="font-bold text-xl mb-2 font-heading">Calling you now!</h4>
            <p className="text-sm font-medium text-green-700">Please answer your phone to talk to our AI agent.</p>
            <button onClick={() => setStatus("idle")} className="mt-6 text-sm font-bold text-[#0A8F5C] hover:underline">Test another number</button>
         </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Your Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00DF81] bg-gray-50/50 transition-all font-medium"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number</label>
            <div className="phone-input-wrapper">
              <PhoneInput
                international
                defaultCountry="US"
                value={phone}
                onChange={setPhone as any}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#00DF81] bg-gray-50/50 transition-all font-medium [&>input]:bg-transparent [&>input]:outline-none [&>input]:w-full [&>input]:ml-3"
                placeholder="(555) 000-0000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00DF81] bg-gray-50/50 transition-all font-medium"
              placeholder="john@example.com"
            />
          </div>
          
          {status === "error" && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold border border-red-100 text-center">
              {errorMessage}
            </div>
          )}

          <button 
            type="submit" 
            disabled={status === "loading"}
            className="w-full bg-[#00DF81] text-gray-900 px-6 py-4 rounded-xl font-bold hover:bg-[#00c271] transition flex items-center justify-center gap-2 disabled:opacity-70 mt-4 shadow-xl shadow-[#00DF81]/20"
          >
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <PhoneCall className="w-5 h-5" />
            )}
            Test Live Demo Now
          </button>
        </form>
      )}
    </div>
  );
}
