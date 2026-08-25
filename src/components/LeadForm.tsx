"use client";

import { useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function LeadForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!phone || !isValidPhoneNumber(phone)) {
        setError("Please enter a valid phone number for the selected country.");
        setLoading(false);
        return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("Phone Number", phone);

    try {
      const res = await fetch("https://formsubmit.co/ajax/Contact@spykeai.com", {
        method: "POST",
        body: formData,
        headers: {
            Accept: "application/json"
        }
      });

      if (res.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        setPhone(undefined);
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to submit form. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#E8FBF1] p-10 rounded-2xl border border-green-100 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-[#00DF81]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-[#0A8F5C]" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading">Request Received!</h3>
        <p className="text-gray-600 font-medium">
          Thank you for reaching out. <br className="hidden md:block" />
          A member of our team will contact you shortly to schedule your demo.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-8 px-6 py-2 bg-white rounded-full font-bold text-gray-900 hover:bg-gray-50 border border-gray-200 transition shadow-sm"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <input type="hidden" name="_subject" value="New Demo Request from SpykeAI Homepage!" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="Source Page" value="SpykeAI Homepage (https://spykeai.com/)" />

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input type="text" name="First Name" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none bg-white text-gray-900" placeholder="John" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
          <input type="text" name="Company Name" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none bg-white text-gray-900" placeholder="Smith HVAC" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
        <input type="email" name="Email" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none bg-white text-gray-900" placeholder="john@smithhvac.com" />
      </div>
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
        <PhoneInput
          international
          defaultCountry="IN"
          value={phone}
          onChange={setPhone}
          numberInputProps={{
            className: "w-full outline-none bg-transparent",
            required: true
          }}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-[#00DF81] focus-within:border-transparent bg-white text-gray-900 flex items-center gap-3"
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#00DF81] text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-[#00c271] transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
            <span className="animate-spin h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full"></span>
        ) : (
            "Get Started"
        )}
      </button>

      <style jsx global>{`
        /* Quick overrides for react-phone-number-input default styles so they look clean */
        .PhoneInputCountry {
          margin-right: 12px;
          padding-right: 12px;
          border-right: 1px solid #e5e7eb;
        }
        .PhoneInputCountryIcon {
          width: 24px;
          height: 16px;
          box-shadow: none;
        }
        .PhoneInputCountrySelectArrow {
          margin-left: 6px;
          color: #9ca3af;
        }
      `}</style>
    </form>
  );
}
