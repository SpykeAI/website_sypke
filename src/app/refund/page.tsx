import { Metadata } from "next";
import { RefreshCcw, CreditCard, Settings, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund Policy | Spyke AI Technologies",
  description: "Refund Policy for Spyke AI Technologies services.",
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Section */}
      <section className="bg-gray-50 pt-24 pb-32 px-4 sm:px-6 lg:px-8 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00DF81]/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full mb-6 shadow-sm border border-gray-100">
            <RefreshCcw className="w-10 h-10 text-[#00DF81]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading tracking-tight">
            Refund Policy
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Our straightforward policy regarding subscriptions and setup fees.
          </p>
          <div className="mt-8 inline-block bg-white text-gray-700 px-6 py-2 rounded-full text-sm font-bold border border-gray-200 shadow-sm">
            Last updated: August 2026
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          <div className="p-8 md:p-12 space-y-12">
            
            {/* 1. Subscription Refunds */}
            <section className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#00DF81] group-hover:text-white transition-colors duration-300">
                  <CreditCard className="w-6 h-6 text-[#00DF81] group-hover:text-white transition-colors duration-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">1. Subscription Refunds</h2>
              </div>
              <div className="pl-16 space-y-4">
                <p className="text-gray-600 leading-relaxed font-medium">
                  At Spyke AI Technologies, we strive to ensure our AI Voice Agents deliver exceptional value to your business. If you are not satisfied with your subscription, you may request a cancellation at any time.
                </p>
                <p className="text-gray-600 leading-relaxed font-medium">
                  Because our services involve immediate infrastructure allocation and telecom costs, we do not offer prorated refunds for mid-billing cycle cancellations. Your service will remain active until the end of your current billing period.
                </p>
              </div>
            </section>

            <hr className="border-gray-100 ml-16" />

            {/* 2. Setup Fees */}
            <section className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#00DF81] group-hover:text-white transition-colors duration-300">
                  <Settings className="w-6 h-6 text-[#00DF81] group-hover:text-white transition-colors duration-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">2. Setup Fees</h2>
              </div>
              <div className="pl-16">
                <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl">
                  <p className="text-gray-700 leading-relaxed font-medium m-0">
                    Any custom development, CRM integration, or one-time setup fees are non-refundable once the onboarding process has begun, as these cover the manual labor and engineering resources provided by our team.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-gray-100 ml-16" />

            {/* 3. Exceptions */}
            <section className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#00DF81] group-hover:text-white transition-colors duration-300">
                  <HelpCircle className="w-6 h-6 text-[#00DF81] group-hover:text-white transition-colors duration-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">3. Exceptions</h2>
              </div>
              <div className="pl-16">
                <p className="text-gray-600 leading-relaxed font-medium">
                  In the rare event of prolonged service outages or failure to deliver agreed-upon core functionality within the first 14 days, we will review refund requests on a case-by-case basis. Please contact our support team to initiate a review.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
