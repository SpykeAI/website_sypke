import { Metadata } from "next";
import { Shield, Info, Database, Lock, Eye, Users, Server, FileText, Briefcase, Bell, Mail, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Spyke AI Technologies",
  description: "Privacy Policy for Spyke AI Technologies",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Section */}
      <section className="bg-gray-50 pt-24 pb-32 px-4 sm:px-6 lg:px-8 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00DF81]/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full mb-6 shadow-sm border border-gray-100">
            <Shield className="w-10 h-10 text-[#00DF81]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            We are committed to protecting your personal information and being transparent about how we use it.
          </p>
          <div className="mt-8 inline-block bg-white text-gray-700 px-6 py-2 rounded-full text-sm font-bold border border-gray-200 shadow-sm">
            Effective Date: 22 August 2026
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Intro Box */}
          <div className="bg-gray-50/50 p-8 md:p-12 border-b border-gray-100">
            <p className="text-xl text-gray-700 leading-relaxed font-medium">
              Spyke AI Technologies ("SpykeAI," "we," "our," or "us") respects your privacy and is committed to protecting personal information entrusted to us. This Privacy Policy explains how we collect, use, disclose, store, and protect personal information when you visit or use <a href="https://spykeai.com/" className="text-[#00DF81] hover:underline font-bold">spykeai.com</a>, contact us, purchase or use our services, or otherwise interact with us.
            </p>
          </div>

          <div className="p-8 md:p-12 space-y-16">
            
            {/* 1. About */}
            <section className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Info className="w-6 h-6 text-[#00DF81]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">1. About Spyke AI Technologies</h2>
              </div>
              <div className="prose prose-lg text-gray-600 max-w-none">
                <p>Spyke AI Technologies is an AI services and technology company based in Hyderabad, Telangana, India. We provide AI-powered solutions and automation services to businesses.</p>
                <p>Depending on the Service being provided, SpykeAI may act as:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 not-prose">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2">A Data Controller</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">For information we collect directly for our own business purposes, such as website visitors, leads, customers, billing, and account management.</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2">A Data Processor</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">When processing information on behalf of a business client in connection with an AI agent, automation, CRM integration, chatbot, voice agent, or other service.</p>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* 2. Information We Collect */}
            <section className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Database className="w-6 h-6 text-[#00DF81]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">2. Information We Collect</h2>
              </div>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="text-[#00DF81]">a)</span> Information You Provide Directly</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Name", "Email address", "Phone number", "Company name", "Job title", "Business address", "Billing info", "Form submissions", "Support requests"].map(item => (
                      <div key={item} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00DF81]"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="text-[#00DF81]">b)</span> Collected Through Our Services</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Chat messages", "Voice conversations", "Call recordings", "Transcripts", "Lead information", "CRM records", "Appointments", "Documents/Files"].map(item => (
                      <div key={item} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00DF81]"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="text-[#00DF81]">c)</span> Collected Automatically</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["IP address", "Browser type", "Device type", "Operating system", "Approx location", "Pages viewed", "Time on page"].map(item => (
                      <div key={item} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00DF81]"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* 3 & 4. Processing */}
            <section className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Server className="w-6 h-6 text-[#00DF81]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">3. Processing & AI Voice Agents</h2>
              </div>
              <div className="prose prose-lg text-gray-600 max-w-none">
                <p>SpykeAI provides AI services that may process personal information on behalf of our business clients. The Client is generally responsible for determining whether call recording, automated calling, transcription, disclosure, consent, or other telecommunications requirements apply to its particular use case.</p>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-xl mt-6">
                  <p className="text-orange-800 font-medium m-0">SpykeAI does not provide legal advice regarding these requirements. Clients are responsible for configuring their AI Voice Agents in accordance with applicable laws.</p>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* 5. How We Use */}
            <section className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6 text-[#00DF81]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">5. How We Use Personal Information</h2>
              </div>
              <div className="bg-gray-50 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {[
                  "Providing and delivering our Services",
                  "Setting up AI systems & automations",
                  "Operating Voice Agents and Chatbots",
                  "Processing payments & billing",
                  "Providing customer support",
                  "Scheduling meetings and demos",
                  "Sending marketing communications",
                  "Detecting fraud and abuse"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00DF81] shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Security & Rights */}
            <section className="scroll-mt-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                      <Lock className="w-6 h-6 text-[#00DF81]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 font-heading">Data Security</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    We take reasonable technical and organisational measures designed to protect personal information against unauthorised access, disclosure, alteration, loss, or destruction. Safeguards include access controls, encryption, secure data transmission, and system monitoring.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                      <Eye className="w-6 h-6 text-[#00DF81]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 font-heading">Your Privacy Rights</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Depending on your location, you may have rights to request access, correction, or deletion of your information, withdraw consent, or opt out of marketing. To exercise these rights, contact us below.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Box */}
            <section className="mt-16 bg-[#00DF81] rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-[#00DF81]/20">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">Contact Us</h2>
              <p className="text-gray-900/80 mb-8 max-w-xl mx-auto font-medium">
                If you have questions, concerns, or requests regarding this Privacy Policy or the way SpykeAI handles personal information, please reach out to us.
              </p>
              <div className="inline-flex flex-col md:flex-row gap-4 items-center justify-center bg-white p-2 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-[#00DF81]" />
                  <a href="mailto:contact@spykeai.com" className="text-gray-900 font-bold hover:text-[#00DF81] transition">contact@spykeai.com</a>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-xl">
                  <Server className="w-5 h-5 text-[#00DF81]" />
                  <span className="text-gray-900 font-bold">Hyderabad, Telangana, India</span>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
