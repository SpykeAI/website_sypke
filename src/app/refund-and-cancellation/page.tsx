import { Metadata } from "next";
import { RefreshCcw, Mail, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Spyke AI Technologies",
  description: "Refund & Cancellation Policy for Spyke AI Technologies.",
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
            Refund & Cancellation Policy
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Our straightforward policy regarding custom AI solutions, implementation services, and subscriptions.
          </p>
          <div className="mt-8 inline-block bg-white text-gray-700 px-6 py-2 rounded-full text-sm font-bold border border-gray-200 shadow-sm">
            Effective Date: 22 August 2026
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Intro Box */}
          <div className="bg-gray-50/50 p-8 md:p-12 border-b border-gray-100">
            <p className="text-xl text-gray-700 leading-relaxed font-medium">
              This Refund & Cancellation Policy explains the circumstances under which refunds or cancellations may be available for Services purchased from Spyke AI Technologies ("SpykeAI," "we," "our," or "us") through <a href="https://spykeai.com" className="text-[#00DF81] hover:underline font-bold">spykeai.com</a> or through a separate proposal, quotation, order form, or service agreement.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed font-medium mt-4">
              By purchasing our Services, you acknowledge and agree to this Policy.
            </p>
          </div>

          <div className="p-8 md:p-12">
            <div className="space-y-4">
              {[
                {
                  title: "1. General Refund Policy",
                  content: (
                    <>
                      <p className="mb-4">Because SpykeAI provides custom AI solutions, implementation services, automations, AI Voice Agents, Chatbots, integrations, development, and other technology services, work may begin shortly after payment.</p>
                      <p className="mb-4">Accordingly, payments are generally non-refundable once work has commenced, unless otherwise stated in this Policy or agreed in writing.</p>
                      <p>Refund eligibility may depend on the type of Service, the stage of work, and the specific commercial agreement with the Client.</p>
                    </>
                  )
                },
                {
                  title: "2. When a Refund May Be Considered",
                  content: (
                    <>
                      <p className="mb-4">A refund may be considered in circumstances such as:</p>
                      <div className="bg-gray-50 p-6 rounded-2xl space-y-4 mb-4">
                        <div><strong className="text-gray-900">Non-delivery:</strong> SpykeAI fails to deliver the agreed Service without a reasonable explanation or remedy.</div>
                        <div><strong className="text-gray-900">Material deviation:</strong> The delivered Service is materially different from the agreed scope and cannot reasonably be corrected.</div>
                        <div><strong className="text-gray-900">Technical failure:</strong> A Service cannot reasonably be made functional due to an issue directly attributable to SpykeAI.</div>
                        <div><strong className="text-gray-900">Duplicate payment:</strong> The Client has been charged more than once for the same Service.</div>
                        <div><strong className="text-gray-900">Unauthorised transaction:</strong> A payment was made without the Client's authorisation, subject to verification.</div>
                      </div>
                      <p>Where an issue can reasonably be fixed, SpykeAI will generally attempt to correct or remedy the issue before considering a refund.</p>
                    </>
                  )
                },
                {
                  title: "3. Custom AI Solutions & Implementation Services",
                  content: (
                    <>
                      <p className="mb-4">Custom Services may include:</p>
                      <ul className="list-none pl-0 space-y-2 mb-6 [&_li]:relative [&_li]:pl-6 [&_li::before]:content-[''] [&_li::before]:absolute [&_li::before]:left-0 [&_li::before]:top-2.5 [&_li::before]:w-1.5 [&_li::before]:h-1.5 [&_li::before]:bg-[#00DF81] [&_li::before]:rounded-full">
                        <li>AI Voice Agents</li>
                        <li>AI Chatbots</li>
                        <li>AI Agents</li>
                        <li>Business Automations</li>
                        <li>CRM Integrations</li>
                        <li>API Integrations</li>
                        <li>Custom Software</li>
                        <li>AI-generated content</li>
                        <li>Workflow development</li>
                        <li>System configuration</li>
                        <li>Consulting and implementation</li>
                      </ul>
                      <p className="mb-4">Once development, configuration, research, integration, or other work has started, the applicable fees are generally non-refundable. This is because resources, development time, third-party services, and infrastructure may already have been committed to the project.</p>
                      <p>If a Client cancels a project after work has started, SpykeAI may charge for work completed up to the cancellation date and for any non-refundable third-party costs already incurred.</p>
                    </>
                  )
                },
                {
                  title: "4. Subscription & Recurring Services",
                  content: (
                    <>
                      <p className="mb-4">For recurring Services, the Client may cancel future billing in accordance with the cancellation terms applicable to the Service or commercial agreement. Cancellation will generally stop future billing but will not automatically result in a refund for the current billing period.</p>
                      <p className="mb-4">Fees already paid for a billing period are generally non-refundable unless:</p>
                      <ul className="list-none pl-0 space-y-2 [&_li]:relative [&_li]:pl-6 [&_li::before]:content-[''] [&_li::before]:absolute [&_li::before]:left-0 [&_li::before]:top-2.5 [&_li::before]:w-1.5 [&_li::before]:h-1.5 [&_li::before]:bg-[#00DF81] [&_li::before]:rounded-full">
                        <li>The applicable agreement specifically provides otherwise; or</li>
                        <li>SpykeAI agrees to a refund at its discretion; or</li>
                        <li>A refund is required under applicable law.</li>
                      </ul>
                    </>
                  )
                },
                {
                  title: "5. Third-Party Costs",
                  content: (
                    <>
                      <p className="mb-4">Certain SpykeAI Services may involve third-party costs, including:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        {["AI model usage", "Voice and telephony services", "SMS or WhatsApp messaging", "Cloud infrastructure", "Software subscriptions", "API usage", "CRM or automation platforms", "Other third-party technology"].map(item => (
                          <div key={item} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 font-medium border border-gray-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00DF81] shrink-0"></div>
                            {item}
                          </div>
                        ))}
                      </div>
                      <p className="mb-4">Where these costs have already been incurred on behalf of the Client, they may be non-refundable.</p>
                      <p>SpykeAI is not responsible for refunds relating to third-party services where the applicable third-party provider's own terms do not permit a refund.</p>
                    </>
                  )
                },
                {
                  title: "6. Refund Requests",
                  content: (
                    <>
                      <p className="mb-4">If you believe you are eligible for a refund, contact us at: <a href="mailto:contact@spykeai.com" className="text-[#00DF81] hover:underline font-bold">contact@spykeai.com</a></p>
                      <p className="mb-4">Refund requests should generally be submitted within 7 days of the relevant payment; or the delivery of the applicable Service, whichever is applicable.</p>
                      <p className="mb-4">Please include:</p>
                      <ul className="list-none pl-0 space-y-2 mb-6 [&_li]:relative [&_li]:pl-6 [&_li::before]:content-[''] [&_li::before]:absolute [&_li::before]:left-0 [&_li::before]:top-2.5 [&_li::before]:w-1.5 [&_li::before]:h-1.5 [&_li::before]:bg-[#00DF81] [&_li::before]:rounded-full">
                        <li>Your name and company name</li>
                        <li>Order or invoice number</li>
                        <li>Date of payment</li>
                        <li>Service purchased</li>
                        <li>Reason for the refund request</li>
                        <li>Relevant evidence, such as screenshots, recordings, error messages, or other supporting information</li>
                      </ul>
                      <p>SpykeAI may investigate the request before making a decision.</p>
                    </>
                  )
                },
                {
                  title: "7. Investigation & Resolution",
                  content: (
                    <>
                      <p className="mb-4">SpykeAI may review:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                        {["Agreed scope of work", "Proposal or order form", "Project communications", "Delivery records", "Technical logs", "Screenshots or recordings", "Evidence provided", "Work completed", "Third-party dependencies"].map(item => (
                          <div key={item} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 font-medium border border-gray-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00DF81] shrink-0"></div>
                            {item}
                          </div>
                        ))}
                      </div>
                      <p className="mb-4">Where an issue is identified and can reasonably be fixed, SpykeAI may first offer a correction, replacement, or other reasonable remedy instead of a refund.</p>
                      <p>Refund decisions will be made based on the specific circumstances of each case and the applicable agreement.</p>
                    </>
                  )
                },
                {
                  title: "8. No Refunds For",
                  content: (
                    <>
                      <p className="mb-4">Refunds will generally not be provided for:</p>
                      <ul className="list-none pl-0 space-y-2 [&_li]:relative [&_li]:pl-6 [&_li::before]:content-[''] [&_li::before]:absolute [&_li::before]:left-0 [&_li::before]:top-2.5 [&_li::before]:w-1.5 [&_li::before]:h-1.5 [&_li::before]:bg-red-400 [&_li::before]:rounded-full">
                        <li>Change of mind after purchasing a Service</li>
                        <li>Failure to use or implement a delivered Service</li>
                        <li>Failure to provide required information, access, approvals, or credentials</li>
                        <li>Delays caused by the Client</li>
                        <li>Incompatibility with systems that were not disclosed or agreed during implementation</li>
                        <li>Third-party platform outages or changes</li>
                        <li>Changes to third-party AI models, APIs, pricing, or policies</li>
                        <li>Results not meeting expectations where the agreed scope has been delivered</li>
                        <li>Business outcomes such as sales, leads, appointments, revenue, or ROI that were not expressly guaranteed</li>
                        <li>Work already completed and delivered</li>
                        <li>Third-party costs already incurred on behalf of the Client</li>
                      </ul>
                    </>
                  )
                },
                {
                  title: "9. Refund Processing",
                  content: (
                    <>
                      <p className="mb-4">If a refund is approved, it will generally be issued to the original payment method used for the transaction.</p>
                      <p>Approved refunds will normally be processed within 8–10 business days, although the actual time for the funds to appear may depend on the payment provider or financial institution.</p>
                    </>
                  )
                },
                {
                  title: "10. Changes to This Policy",
                  content: (
                    <>
                      <p className="mb-4">SpykeAI may update this Refund & Cancellation Policy from time to time. Any changes will be published on this page with an updated Effective Date.</p>
                      <p>The version applicable at the time of purchase will generally govern the relevant transaction, unless otherwise required by applicable law.</p>
                    </>
                  )
                }
              ].map((section, idx) => (
                <details key={idx} className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden open:ring-1 open:ring-[#00DF81]/20 open:shadow-md transition-all duration-300">
                  <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
                    <h3 className="text-xl font-bold text-gray-900 font-heading group-open:text-[#00DF81] transition-colors">{section.title}</h3>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-open:bg-green-50 transition-colors shrink-0">
                      <svg className="w-5 h-5 text-gray-400 group-open:text-[#00DF81] group-open:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 pt-2 text-gray-600 text-lg leading-relaxed">
                    {section.content}
                  </div>
                </details>
              ))}
            </div>

            {/* Contact Us */}
            <section className="mt-16 bg-[#00DF81] rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-[#00DF81]/20">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">Contact Us</h2>
              <p className="text-gray-900/80 mb-8 max-w-xl mx-auto font-medium">
                For questions regarding refunds, cancellations, or this Policy:
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
