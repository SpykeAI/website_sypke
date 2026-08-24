import { Metadata } from "next";
import { FileText, ShieldAlert, Cpu, Scale, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Spyke AI Technologies",
  description: "Terms and Conditions for using Spyke AI Technologies services.",
};

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Section */}
      <section className="bg-gray-50 pt-24 pb-32 px-4 sm:px-6 lg:px-8 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00DF81]/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full mb-6 shadow-sm border border-gray-100">
            <FileText className="w-10 h-10 text-[#00DF81]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our AI services.
          </p>
          <div className="mt-8 inline-block bg-white text-gray-700 px-6 py-2 rounded-full text-sm font-bold border border-gray-200 shadow-sm">
            Last updated: August 2026
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          <div className="p-8 md:p-12 space-y-12">
            
            {/* 1. Agreement to Terms */}
            <section className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#00DF81] group-hover:text-white transition-colors duration-300">
                  <ShieldAlert className="w-6 h-6 text-[#00DF81] group-hover:text-white transition-colors duration-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">1. Agreement to Terms</h2>
              </div>
              <div className="pl-16">
                <p className="text-gray-600 leading-relaxed font-medium">
                  By accessing our website and using our AI Voice Agent services, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part of the terms, you may not access our services.
                </p>
              </div>
            </section>

            <hr className="border-gray-100 ml-16" />

            {/* 2. Service Usage */}
            <section className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#00DF81] group-hover:text-white transition-colors duration-300">
                  <Cpu className="w-6 h-6 text-[#00DF81] group-hover:text-white transition-colors duration-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">2. Service Usage</h2>
              </div>
              <div className="pl-16">
                <p className="text-gray-600 leading-relaxed font-medium">
                  Spyke AI Technologies provides AI-powered voice automation solutions. You agree to use these services only for lawful purposes and in accordance with your local and federal telecommunications regulations.
                </p>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-5 rounded-r-xl mt-4">
                  <p className="text-orange-800 text-sm font-bold m-0">You are strictly prohibited from using our AI agents for spam, unsolicited marketing, or any illegal activities.</p>
                </div>
              </div>
            </section>

            <hr className="border-gray-100 ml-16" />

            {/* 3. Intellectual Property */}
            <section className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#00DF81] group-hover:text-white transition-colors duration-300">
                  <Scale className="w-6 h-6 text-[#00DF81] group-hover:text-white transition-colors duration-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">3. Intellectual Property</h2>
              </div>
              <div className="pl-16">
                <p className="text-gray-600 leading-relaxed font-medium">
                  The service and its original content, features, and functionality are and will remain the exclusive property of Spyke AI Technologies and its licensors. Our services are protected by copyright, trademark, and other laws.
                </p>
              </div>
            </section>

            <hr className="border-gray-100 ml-16" />

            {/* 4. Limitation of Liability */}
            <section className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                  <AlertTriangle className="w-6 h-6 text-red-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">4. Limitation of Liability</h2>
              </div>
              <div className="pl-16">
                <p className="text-gray-600 leading-relaxed font-medium">
                  In no event shall Spyke AI Technologies be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
