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
              <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                <p>Spyke AI Technologies is an AI services and technology company based in Hyderabad, Telangana, India. We provide AI-powered solutions and automation services to businesses, including services that may involve processing information on behalf of our business clients.</p>
                <p>Depending on the Service being provided, SpykeAI may act as:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2">A Data Controller/Data Fiduciary</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">For information we collect directly for our own business purposes, such as website visitors, leads, customers, billing, and account management.</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2">A Service Provider/Data Processor</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">When processing information on behalf of a business client in connection with an AI agent, automation, CRM integration, chatbot, voice agent, or other service.</p>
                  </div>
                </div>
                <p className="mt-4">The exact role we have in relation to particular information may depend on the nature of the Service and the agreement between SpykeAI and the Client.</p>
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
                  <p className="text-gray-600 mb-4">You may provide information such as:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Name", "Email address", "Phone number", "Company name", "Job title", "Business address", "Billing info", "Form submissions", "Support requests", "Consultation details", "Communications"].map(item => (
                      <div key={item} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00DF81] shrink-0"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-600 mt-4 text-sm">We collect only information reasonably necessary for the relevant purpose.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="text-[#00DF81]">b)</span> Collected Through Our Services</h3>
                  <p className="text-gray-600 mb-4">When you use or interact with an AI system or automation provided by SpykeAI, the system may process information depending on how the Service has been configured. This may include:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Chat messages", "Voice conversations", "Call recordings", "Call transcripts", "Lead & Contact info", "Customer info", "CRM records", "Appointments", "Documents/Files", "Images & Media", "AI system inputs/outputs"].map(item => (
                      <div key={item} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00DF81] shrink-0"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-600 mt-4 text-sm">The specific information processed will depend on the Service purchased and how it is configured.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="text-[#00DF81]">c)</span> Collected Automatically</h3>
                  <p className="text-gray-600 mb-4">When you visit our website or interact with our online Services, we may automatically collect certain technical and usage information, including:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["IP address", "Browser type", "Device type", "Operating system", "Approx location", "Referring website", "Pages viewed", "Time on page", "Website interactions", "Date & time", "Diagnostic info"].map(item => (
                      <div key={item} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00DF81] shrink-0"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-600 mt-4 text-sm">We may collect this information through cookies, pixels, analytics tools, logs, and similar technologies.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="text-[#00DF81]">d)</span> Information from Third Parties</h3>
                  <p className="text-gray-600 mb-4">We may receive information from third parties, including:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Payment processors", "CRM platforms", "Advertising platforms", "Analytics providers", "Communication platforms", "Integration providers", "AI service providers", "Business partners", "Public sources"].map(item => (
                      <div key={item} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00DF81] shrink-0"></div>
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
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">3. Information Processed on Behalf of Our Clients</h2>
              </div>
              <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                <p>SpykeAI provides AI services and automations that may process personal information on behalf of our business clients. For example, a Client may use our Services to operate an AI Voice Agent, Chatbot, lead qualification system, CRM automation, appointment system, or customer-support automation.</p>
                <p>In these situations, the Client may determine what information is collected and how it is used. The Client may therefore be responsible for:</p>
                <ul className="list-none pl-0 space-y-2 mb-4">
                  <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-[#00DF81] before:rounded-full">Determining the lawful basis for collecting and processing personal information</li>
                  <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-[#00DF81] before:rounded-full">Providing appropriate privacy notices to its customers or users</li>
                  <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-[#00DF81] before:rounded-full">Obtaining required consents or permissions</li>
                  <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-[#00DF81] before:rounded-full">Determining appropriate retention periods</li>
                  <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-[#00DF81] before:rounded-full">Responding to data-subject requests where applicable</li>
                  <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-[#00DF81] before:rounded-full">Ensuring that its use of the Services complies with applicable laws</li>
                </ul>
                <p>SpykeAI will process such information primarily to provide the contracted Services and according to the Client's instructions, applicable agreements, and applicable law.</p>

                <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">4. AI Voice Agents, Calls and Recordings</h3>
                <p>Certain SpykeAI Services may involve automated voice calls, voice conversations, call recording, transcription, voice analysis, or other forms of voice processing. Depending on the configuration, we may process telephone numbers, voice recordings, call transcripts, conversation metadata, call duration, and information generated by the AI system.</p>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-xl mt-6">
                  <p className="text-orange-800 font-medium m-0">Where SpykeAI provides an AI Voice Agent to a business Client, the Client is generally responsible for determining whether call recording, automated calling, transcription, disclosure, consent, or other telecommunications requirements apply to its particular use case. SpykeAI does not provide legal advice regarding these requirements.</p>
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
              <p className="text-gray-600 text-lg mb-6">We may use personal information for purposes including:</p>
              <div className="bg-gray-50 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {[
                  "Providing and delivering our Services",
                  "Setting up & configuring AI systems",
                  "Operating Voice Agents and Chatbots",
                  "Operating business automations",
                  "Integrating third-party systems",
                  "Processing payments",
                  "Responding to enquiries & support",
                  "Scheduling demonstrations or meetings",
                  "Communicating with customers and prospects",
                  "Sending service & marketing communications",
                  "Improving our website and Services",
                  "Monitoring system performance",
                  "Detecting and preventing fraud and abuse",
                  "Troubleshooting technical issues",
                  "Maintaining records & complying with laws"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00DF81] shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 mt-6 text-lg">We may also use aggregated or de-identified information for analytics, research, service improvement, and business purposes where such information can no longer reasonably be used to identify an individual.</p>
            </section>

            <hr className="border-gray-100" />

            {/* All remaining sections combined into a readable list */}
            <section className="scroll-mt-24">
              <div className="text-gray-600 text-lg leading-relaxed space-y-12
                [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:font-heading [&_h3]:mb-4
                [&_p]:mb-4
                [&_ul]:list-none [&_ul]:pl-0 [&_ul]:space-y-2 [&_ul]:mb-6
                [&_li]:relative [&_li]:pl-6
                [&_li::before]:content-[''] [&_li::before]:absolute [&_li::before]:left-0 [&_li::before]:top-2.5 [&_li::before]:w-1.5 [&_li::before]:h-1.5 [&_li::before]:bg-[#00DF81] [&_li::before]:rounded-full
              ">
                <div>
                  <h3>6. AI and Automated Processing</h3>
                  <p>Our Services may use artificial intelligence and machine-learning technologies to process information and generate outputs. Depending on the Service, AI systems may analyse text, process conversations, transcribe voice, generate responses, classify information, qualify leads, schedule appointments, generate content, trigger workflows, or perform other automated tasks.</p>
                  <p>AI-generated outputs may not always be accurate, complete, or appropriate. Where our Services are configured to perform automated actions on behalf of a Client, the Client is responsible for determining the appropriate level of human oversight and review. SpykeAI does not use personal information for unrelated purposes merely because it is processed through an AI system.</p>
                </div>

                <div>
                  <h3>7. How We Share Personal Information</h3>
                  <p>We do not sell personal information for money. We may share or provide access to personal information where reasonably necessary to provide our Services, operate our business, or comply with applicable law. These parties may include:</p>
                  <ul>
                    <li><strong>Service Providers:</strong> For cloud hosting, AI models and APIs, telephony, voice processing, messaging, CRM systems, automation platforms, analytics, payment processing, email delivery, and security.</li>
                    <li><strong>Clients:</strong> Where SpykeAI is providing Services on behalf of a business Client, information may be made available to that Client.</li>
                    <li><strong>Legal and Regulatory Authorities:</strong> To comply with applicable law, respond to lawful requests, protect our rights, prevent fraud, or investigate security incidents.</li>
                    <li><strong>Business Transactions:</strong> In the event of a merger, acquisition, restructuring, or sale of assets.</li>
                  </ul>
                </div>

                <div>
                  <h3>8. Third-Party AI and Technology Providers</h3>
                  <p>SpykeAI may use third-party AI models, APIs, cloud infrastructure, communication platforms, and other technology providers to deliver the Services. Depending on the Service, information may therefore be processed by third-party providers located in India or other countries.</p>
                  <p>We seek to use providers that we reasonably consider appropriate for the relevant Service. However, third-party providers operate independently and their services, policies, security practices, pricing, models, APIs, and data-processing practices may change from time to time.</p>
                </div>

                <div>
                  <h3>9. Cookies and Tracking Technologies</h3>
                  <p>Our website may use cookies and similar technologies to enable essential website functionality, remember preferences, understand website usage, analyse traffic, measure advertising performance, and detect fraudulent activity.</p>
                  <p>You can manage or disable cookies through your browser settings. Some website functionality may not work correctly if certain cookies are disabled.</p>
                </div>

                <div>
                  <h3>10. Marketing Communications</h3>
                  <p>We may use your contact information to send information about SpykeAI Services, product updates, educational content, offers, events, and newsletters. Where required by applicable law, we will obtain appropriate consent before sending marketing communications.</p>
                  <p>You may unsubscribe from marketing communications at any time by using the unsubscribe mechanism provided or by contacting us at contact@spykeai.com. You may continue to receive essential service-related communications.</p>
                </div>

                <div>
                  <h3>11. Data Retention</h3>
                  <p>We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, to provide the Services, to fulfil contractual obligations, to maintain business records, or to comply with applicable legal requirements. Where SpykeAI processes information on behalf of a Client, retention may be determined by the Client's instructions.</p>
                </div>

                <div>
                  <h3>12. Data Security</h3>
                  <p>We take reasonable technical and organisational measures designed to protect personal information against unauthorised access, disclosure, alteration, loss, or destruction. Safeguards may include access controls, encryption, secure data transmission, and system monitoring. However, no internet transmission or electronic storage system can be guaranteed to be completely secure.</p>
                </div>

                <div>
                  <h3>13. Your Privacy Rights</h3>
                  <p>Depending on your location and applicable laws, you may have rights to request access to, correction of, or deletion of your personal information, withdraw consent, opt out of marketing, or raise concerns regarding processing. Some rights may be subject to legal exceptions.</p>
                  <p>If you wish to exercise a privacy right, please contact us at contact@spykeai.com. If you are interacting with an AI system operated by one of our business Clients, your request may need to be directed to that Client.</p>
                </div>

                <div>
                  <h3>14. Children's Privacy</h3>
                  <p>Our website and Services are primarily intended for businesses and adults. We do not knowingly collect personal information from children in circumstances where doing so would violate applicable law.</p>
                </div>

                <div>
                  <h3>15. International Data Transfers</h3>
                  <p>SpykeAI is based in India and may provide Services to Clients and users located in other countries. Depending on the Service and third-party providers used, personal information may be processed or stored outside the country where it was originally collected. We will take reasonable steps to ensure international transfers are handled in accordance with applicable data-protection requirements.</p>
                </div>

                <div>
                  <h3>16. Third-Party Websites and Services</h3>
                  <p>Our website and Services may contain links to or integrations with third-party websites or platforms. We are not responsible for the privacy practices, content, or security of third-party services that we do not control.</p>
                </div>

                <div>
                  <h3>17. Business Client Data</h3>
                  <p>If you are a SpykeAI Client and provide us with information relating to your customers, leads, employees, or users, you remain responsible for ensuring that you have the necessary rights and permissions to provide that information to us.</p>
                </div>

                <div>
                  <h3>18. Data Breaches and Security Incidents</h3>
                  <p>If SpykeAI becomes aware of a security incident involving personal information under our control, we will take reasonable steps to investigate, contain, and address the incident. Where notification is legally required, we will make the appropriate notifications.</p>
                </div>

                <div>
                  <h3>19. Changes to This Privacy Policy</h3>
                  <p>We may update this Privacy Policy from time to time to reflect changes to our Services, technology, or legal requirements. When we update this Privacy Policy, we will update the Effective Date at the top of the page.</p>
                </div>
              </div>
            </section>

            {/* Contact Box */}
            <section className="mt-16 bg-[#00DF81] rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-[#00DF81]/20">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">20. Contact Us</h2>
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
