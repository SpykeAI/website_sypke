"use client";

import { useState, useEffect } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState<string | undefined>();
  const [country, setCountry] = useState<any>("IN");
  
  // OTP States
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [hashPayload, setHashPayload] = useState("");
  const [email, setEmail] = useState("");
  const [formDataCache, setFormDataCache] = useState<FormData | null>(null);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.country_code) {
          setCountry(data.country_code);
        }
      })
      .catch((err) => console.error("Could not fetch location"));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!otpStep) {
      // Step 1: Validate and send OTP
      if (!phone || !isValidPhoneNumber(phone)) {
          setError("Please enter a valid phone number for the selected country.");
          setLoading(false);
          return;
      }

      const formData = new FormData(e.currentTarget);
      formData.set("Phone Number", phone);
      const emailValue = formData.get("Email") as string;
      setEmail(emailValue);

      try {
        const otpRes = await fetch("/api/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailValue }),
        });

        const otpData = await otpRes.json();
        
        if (otpRes.ok && otpData.success) {
          setHashPayload(otpData.hash);
          setFormDataCache(formData);
          setOtpStep(true);
        } else {
          setError(otpData.error || "Failed to send OTP. Please try again.");
        }
      } catch (err) {
        setError("Failed to send OTP. Please check your connection.");
      } finally {
        setLoading(false);
      }
    } else {
      // Step 2: Verify OTP and submit form
      try {
        const verifyRes = await fetch("/api/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, hashPayload }),
        });

        const verifyData = await verifyRes.json();

        if (verifyRes.ok && verifyData.success && formDataCache) {
          // OTP verified, submit actual form
          const res = await fetch("https://formsubmit.co/ajax/Contact@spykeai.com", {
            method: "POST",
            body: formDataCache,
            headers: {
                Accept: "application/json"
            }
          });

          if (res.ok) {
            setSuccess(true);
            setOtpStep(false);
            setOtp("");
            setPhone(undefined);
            setEmail("");
            setFormDataCache(null);
          } else {
            const data = await res.json();
            setError(data.message || "Something went wrong. Please try again.");
          }
        } else {
          setError(verifyData.error || "Invalid OTP. Please try again.");
        }
      } catch (err) {
        setError("Failed to verify OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (success) {
    return (
      <div className="bg-[#E8FBF1] p-10 rounded-2xl border border-green-100 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-[#00DF81]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-[#0A8F5C]" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading">Message Sent!</h3>
        <p className="text-gray-600 font-medium">
          Thank you for reaching out. <br className="hidden md:block" />
          A member of our team will get back to you shortly.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-8 px-6 py-2 bg-white rounded-full font-bold text-gray-900 hover:bg-gray-50 border border-gray-200 transition shadow-sm"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hidden inputs only needed in step 1, but formsubmit uses FormData anyway */}
      {!otpStep && (
        <>
          <input type="hidden" name="_subject" value="New message from SpykeAI Contact Page!" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="Source Page" value="SpykeAI Contact Page (https://spykeai.com/contact)" />
        </>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {!otpStep ? (
        <>
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm font-medium text-center">
            Note: We will send you an OTP to verify your email address.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input type="text" name="First Name" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none bg-white text-gray-900" placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input type="text" name="Last Name" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none bg-white text-gray-900" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input type="email" name="Email" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none bg-white text-gray-900" placeholder="john@example.com" />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <PhoneInput
              international
              defaultCountry={country}
              value={phone}
              onChange={setPhone}
              limitMaxLength={true}
              numberInputProps={{
                className: "w-full outline-none bg-transparent",
                required: true,
                maxLength: 16
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-[#00DF81] focus-within:border-transparent bg-white text-gray-900 flex items-center gap-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea name="Message" required rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none bg-white text-gray-900 resize-none" placeholder="How can we help you?"></textarea>
          </div>
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            type="button" 
            onClick={() => setOtpStep(false)}
            className="text-gray-500 hover:text-gray-900 mb-4 flex items-center text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm font-medium text-center mb-6">
            We've sent a 6-digit code to <strong>{email}</strong>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP Code</label>
            <input 
              type="text" 
              required 
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none bg-white text-gray-900 text-center tracking-[0.5em] text-xl font-bold" 
              placeholder="------" 
            />
          </div>
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#00DF81] text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-[#00c271] transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
            <span className="animate-spin h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full"></span>
        ) : (
            otpStep ? "Verify & Submit" : "Get OTP"
        )}
      </button>
    </form>
  );
}
