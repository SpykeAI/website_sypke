import { Metadata } from "next";
import { ArrowRight, Bot, Target, Zap, Phone, Share2, Wrench, PenTool, CheckCircle2, Lightbulb, Blocks, Settings, Users, ArrowUpRight, Globe, Layers, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Spyke AI Technologies",
  description: "Turning AI Into Real Business Outcomes",
};

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00DF81]/10 via-transparent to-transparent -z-10"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] -z-10"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 border border-green-100 text-[#00DF81] font-bold mb-6 text-sm uppercase tracking-wide">
              About Us – Spyke AI Technologies
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 font-heading leading-[1.1] tracking-tight">
              Turning AI Into Real <br />
              <span className="text-[#00DF81]">Business Outcomes.</span>
            </h1>
            <p className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-[#00DF81] pl-6 leading-relaxed">
              We don't just talk about what AI can do. We build it, integrate it, and put it to work.
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50">
            <div className="space-y-6 text-gray-700 text-lg md:text-xl leading-relaxed font-medium">
              <p>
                AI is no longer just a technology advantage. It's becoming a new way of running a business.
              </p>
              <p>
                At Spyke AI Technologies, we help businesses turn AI from an experiment into something they actually use.
              </p>
              <p>
                From AI Voice Agents and Chatbots to business automations, AI agents, CRM integrations, and AI-powered workflows, we design and implement practical AI solutions that help businesses save time, respond faster, operate more efficiently, and scale without simply adding more people.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Gap Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-heading">Our Story</h2>
            <div className="space-y-6 text-gray-600 text-lg">
              <p>
                Spyke AI Technologies was founded on a simple observation:<br/>
                AI is moving incredibly fast. Yet most businesses struggle to turn that technology into something useful for their day-to-day operations.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#00DF81] mr-3 shrink-0" /> There are thousands of AI tools available today.</li>
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#00DF81] mr-3 shrink-0" /> New models are released every week.</li>
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#00DF81] mr-3 shrink-0" /> New automation platforms appear constantly.</li>
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#00DF81] mr-3 shrink-0" /> AI agents are becoming more capable every day.</li>
              </ul>
              <div className="bg-green-50 border-l-4 border-[#00DF81] p-6 rounded-r-2xl my-8">
                <p className="italic text-gray-700 font-medium mb-2">Yet for a business owner, the real question isn't:</p>
                <p className="font-bold text-gray-900 line-through decoration-red-400 mb-4">"Which AI tool should I use?"</p>
                <p className="italic text-gray-700 font-medium mb-2">It's:</p>
                <p className="font-bold text-gray-900 text-xl text-[#00DF81]">"How can AI actually help my business?"</p>
              </div>
              <p>
                That gap between AI capability and practical business implementation is where SpykeAI comes in.
              </p>
              <p>
                Spyke AI Technologies was created to help businesses identify where AI can create real value, design the right solution, integrate it into their existing systems, and continuously improve it as the technology evolves.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-[#00DF81] rounded-3xl blur-3xl opacity-10"></div>
            <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop" alt="Team working" className="relative rounded-3xl shadow-2xl object-cover h-[600px] w-full" />
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-gray-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Built by a Product Leader</h2>
            <div className="space-y-6 text-gray-300 text-lg">
              <p>
                SpykeAI was founded by <strong>Srikanishka Vadakattu</strong> (Sri - <a href="https://www.linkedin.com/in/srikanishka/" target="_blank" className="text-[#00DF81] hover:underline">LinkedIn</a>), a product management leader with 13+ years of experience building and scaling digital products and businesses across startups and technology companies.
              </p>
              <p>
                Over the years, Sri has worked across companies and industries including Paytm, Ola, OYO and other technology startups, building products from the ground up, developing product strategies, scaling teams, and solving complex business problems through technology.
              </p>
              <p>
                That product background shapes how we approach AI.<br/>
                We don't start with:
              </p>
              <blockquote className="text-xl font-bold text-gray-400 border-l-4 border-gray-700 pl-6 py-2 my-6 font-heading leading-relaxed">
                "Here's a cool AI tool. Let's find something to do with it."
              </blockquote>
              <p>We start with:</p>
              <blockquote className="text-2xl font-bold text-white border-l-4 border-[#00DF81] pl-6 py-2 my-6 font-heading leading-relaxed">
                "What problem are we trying to solve, and where can AI create the most leverage?"
              </blockquote>
              <p>Then we work backwards to build the solution.</p>
            </div>
          </div>
          <div className="bg-gray-800 p-10 rounded-3xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4 font-heading">Our Mission</h3>
            <p className="text-[#00DF81] font-bold text-xl mb-6">Make AI Practical for Every Business</p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Our mission is simple:<br/>
              To help businesses use AI to automate repetitive work, improve customer experiences, increase operational efficiency, and unlock new ways of growing their business.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We believe AI shouldn't be limited to large technology companies with massive engineering teams.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              A growing business should be able to use AI Voice Agents, intelligent automations, AI assistants, and AI-powered workflows without having to become an AI research company itself.
            </p>
            <p className="text-white font-bold text-lg">
              That's what we're building toward.
            </p>
          </div>
        </div>
      </section>

      {/* Approach Steps (HORIZONTAL ROWS DESIGN) */}
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">Our Approach</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We believe successful AI implementation is less about the technology and more about solving the right problem.<br/>
              Our approach is simple:
            </p>
          </div>
          
          <div className="space-y-4">
            <ProcessRow num="01" title="Understand" desc="We first understand the business, its existing processes, bottlenecks, systems, and goals." />
            <ProcessRow num="02" title="Identify" desc="We identify where AI and automation can create meaningful leverage. Not every process needs AI. We focus on the ones where it can actually make a difference." />
            <ProcessRow num="03" title="Design" desc="We design the workflow, AI agent, automation, integration, or solution around the business requirement." />
            <ProcessRow num="04" title="Build" desc="We implement the solution and connect it with the tools and systems the business already uses." />
            <ProcessRow num="05" title="Launch" desc="We test the system, refine the workflows, and put it into production." />
            <ProcessRow num="06" title="Improve" desc="AI is evolving rapidly. We continuously look for opportunities to improve the system as better models, tools, and capabilities become available." />
          </div>
        </div>
      </section>

      {/* Why Spyke AI Section (TIMELINE DESIGN) */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8 border-y border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">Why SpykeAI?</h2>
            <p className="text-xl text-gray-600">Our philosophy is simple: we build around better business processes, not just the latest tools.</p>
          </div>
          <div className="lg:col-span-8 relative">
            {/* Vertical Line */}
            <div className="hidden md:block absolute left-[27px] top-[24px] bottom-[24px] w-0.5 bg-gray-200"></div>
            
            <div className="space-y-12">
              <div className="relative md:pl-20">
                <div className="hidden md:flex absolute left-0 top-0 w-14 h-14 bg-white border-2 border-gray-200 rounded-full items-center justify-center text-gray-400 font-bold text-xl shadow-sm z-10">
                  <Lightbulb className="w-6 h-6 text-[#00DF81]" />
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3"><Lightbulb className="w-6 h-6 text-[#00DF81] md:hidden" /> We Start With the Business Problem</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">We don't believe in adding AI simply because AI is fashionable. We first identify the problem and then determine whether AI is the right solution.</p>
                </div>
              </div>

              <div className="relative md:pl-20">
                <div className="hidden md:flex absolute left-0 top-0 w-14 h-14 bg-white border-2 border-gray-200 rounded-full items-center justify-center text-gray-400 font-bold text-xl shadow-sm z-10">
                  <Blocks className="w-6 h-6 text-[#00DF81]" />
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3"><Blocks className="w-6 h-6 text-[#00DF81] md:hidden" /> Product Thinking, Not Just Tool Integration</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">Our product background means we think beyond connecting APIs. We look at the complete experience, workflow, user journey, business logic, edge cases, and measurable outcomes.</p>
                </div>
              </div>

              <div className="relative md:pl-20">
                <div className="hidden md:flex absolute left-0 top-0 w-14 h-14 bg-white border-2 border-gray-200 rounded-full items-center justify-center text-gray-400 font-bold text-xl shadow-sm z-10">
                  <Wrench className="w-6 h-6 text-[#00DF81]" />
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3"><Wrench className="w-6 h-6 text-[#00DF81] md:hidden" /> Practical AI</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">We focus on solutions that can actually be deployed and used by businesses today.</p>
                </div>
              </div>

              <div className="relative md:pl-20">
                <div className="hidden md:flex absolute left-0 top-0 w-14 h-14 bg-white border-2 border-gray-200 rounded-full items-center justify-center text-gray-400 font-bold text-xl shadow-sm z-10">
                  <Settings className="w-6 h-6 text-[#00DF81]" />
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3"><Settings className="w-6 h-6 text-[#00DF81] md:hidden" /> Built Around Your Existing Stack</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">Your business already has tools, systems, CRMs, communication channels, and processes. Where possible, we integrate AI into that existing ecosystem rather than forcing you to replace everything.</p>
                </div>
              </div>

              <div className="relative md:pl-20">
                <div className="hidden md:flex absolute left-0 top-0 w-14 h-14 bg-white border-2 border-gray-200 rounded-full items-center justify-center text-gray-400 font-bold text-xl shadow-sm z-10">
                  <Users className="w-6 h-6 text-[#00DF81]" />
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3"><Users className="w-6 h-6 text-[#00DF81] md:hidden" /> Human + AI</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">We don't believe every business process should become fully autonomous. The right balance between AI automation and human oversight depends on the use case.</p>
                </div>
              </div>

              <div className="relative md:pl-20">
                <div className="hidden md:flex absolute left-0 top-0 w-14 h-14 bg-[#00DF81] border-4 border-green-100 rounded-full items-center justify-center text-white font-bold text-xl shadow-lg z-10 animate-pulse">
                  <ArrowUpRight className="w-6 h-6 text-gray-900" />
                </div>
                <div className="bg-white p-8 rounded-3xl border-2 border-[#00DF81]/20 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00DF81]/10 rounded-bl-full -z-10"></div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3"><ArrowUpRight className="w-6 h-6 text-[#00DF81] md:hidden" /> Technology That Keeps Evolving</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">AI will continue to change rapidly. Our approach is designed to evolve with it rather than lock businesses into a single model or technology.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">What We Do</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">SpykeAI provides AI-powered services and implementation solutions for businesses.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            <ServiceCard icon={<Phone />} title="AI Voice Agents" desc="AI-powered voice agents that can handle conversations, qualify leads, answer questions, schedule appointments, follow up with prospects, and perform other voice-based workflows." />
            <ServiceCard icon={<Bot />} title="AI Chatbots" desc="Intelligent conversational systems for websites, WhatsApp, customer support, lead qualification, sales, and other business use cases." />
            <ServiceCard icon={<Zap />} title="Business Automations" desc="We connect your existing tools and systems to automate repetitive processes across sales, marketing, operations, customer support, and other functions." />
            <ServiceCard icon={<Target />} title="AI Agents" desc="AI-powered agents designed to perform multi-step tasks, interact with business systems, retrieve information, make decisions within defined workflows, and take actions on behalf of the business." />
            <ServiceCard icon={<Share2 />} title="CRM & System Integrations" desc="We connect AI systems with CRMs, calendars, communication platforms, databases, websites, and other business tools so AI becomes part of the existing workflow rather than another disconnected tool." />
            <ServiceCard icon={<PenTool />} title="AI-Powered Content & Creative Services" desc="We use AI to help businesses create images, videos, audio, copy, and other content more efficiently." />
          </div>
        </div>
      </section>

      {/* Who We Work With (NEW) */}
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">Who We Work With</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We work with businesses that want to use AI to improve the way they operate and grow. Our solutions can be applied across industries including:
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {["Real Estate", "Healthcare and Clinics", "E-commerce and D2C", "Recruitment", "Professional Services", "Financial and Accounting", "Travel", "Education", "Digital Agencies", "Home Services", "Startups", "SMBs"].map((industry, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 px-6 py-3 rounded-full text-gray-800 font-bold hover:border-[#00DF81] hover:text-[#00DF81] transition cursor-default">
                {industry}
              </div>
            ))}
          </div>

          <div className="bg-[#E8FBF1] p-10 rounded-3xl text-center max-w-4xl mx-auto border border-[#00DF81]/20">
            <p className="text-xl text-gray-900 font-bold">
              If a business has repetitive processes, large volumes of customer interactions, manual workflows, or disconnected systems, there is often an opportunity for AI to help.
            </p>
          </div>
        </div>
      </section>

      {/* Our Vision & The Future (NEW) */}
      <section className="py-24 bg-gray-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Eye className="w-8 h-8 text-[#00DF81]" />
              <h2 className="text-3xl md:text-4xl font-bold font-heading">Our Vision</h2>
            </div>
            <div className="space-y-6 text-gray-300 text-lg">
              <p>We believe the next generation of businesses will not simply use AI tools. <strong>They will be AI-powered businesses.</strong></p>
              <ul className="space-y-3">
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#00DF81] mr-3 shrink-0" /> Sales teams will have AI assistants.</li>
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#00DF81] mr-3 shrink-0" /> Customer support will be augmented by AI.</li>
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#00DF81] mr-3 shrink-0" /> Marketing workflows will run with far less manual effort.</li>
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#00DF81] mr-3 shrink-0" /> Operations will become increasingly automated.</li>
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#00DF81] mr-3 shrink-0" /> Businesses will have AI agents working alongside their teams.</li>
              </ul>
              <p>Our vision is to help make that transition practical and accessible.</p>
              <p>We want to become the AI implementation partner businesses turn to when they know AI can transform their business, but don't know where to start.</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Globe className="w-8 h-8 text-[#00DF81]" />
              <h2 className="text-3xl md:text-4xl font-bold font-heading">The Future We're Building</h2>
            </div>
            <div className="space-y-6 text-gray-300 text-lg">
              <p>The AI landscape will continue to change. Today's best model may not be tomorrow's best model. Today's workflow may be automated differently six months from now.</p>
              <p className="text-white font-bold text-xl">That's okay.</p>
              <p>We don't believe businesses should build their future around one AI model, one tool, or one trend. We believe they should build around better business processes and use the best technology available to improve them.</p>
              <p>That's the philosophy behind SpykeAI.</p>
              <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 mt-6">
                <p className="text-[#00DF81] font-bold text-xl mb-2">Find the problem.</p>
                <p className="text-[#00DF81] font-bold text-xl mb-2">Find the opportunity.</p>
                <p className="text-[#00DF81] font-bold text-xl mb-2">Build the solution.</p>
                <p className="text-white font-black text-2xl mt-4 uppercase tracking-wider">Put AI to work.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (UPDATED) */}
      <section className="py-24 bg-[#00DF81] px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">Let's Build Something With AI</h2>
          <p className="text-xl text-gray-900 mb-10 font-medium leading-relaxed">
            If you're exploring how AI can improve your business, we'd love to understand what you're working on. You don't need to know which AI tool you need. Tell us what you're trying to achieve, and we'll help you figure out where AI can actually make a difference.
          </p>
          <a href="http://wa.link/18sxk1" target="_blank" className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-black transition shadow-2xl mb-12">
            Talk to Us on WhatsApp <ArrowRight className="ml-2 w-5 h-5" />
          </a>
          
          <div className="bg-white rounded-3xl p-8 text-left max-w-xl mx-auto border border-gray-200 shadow-xl">
            <h3 className="font-bold text-gray-900 text-2xl mb-2">Spyke AI Technologies</h3>
            <p className="text-gray-600 font-medium mb-6">AI Services & Automation Company</p>
            <div className="space-y-3 text-gray-700 font-medium">
              <p className="flex items-center gap-2">📍 Hyderabad, Telangana, India</p>
              <p className="flex items-center gap-2">🌐 <a href="https://spykeai.com" className="hover:text-[#00DF81] transition underline">spykeai.com</a></p>
              <p className="flex items-center gap-2">✉️ <a href="mailto:contact@spykeai.com" className="hover:text-[#00DF81] transition underline">contact@spykeai.com</a></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="w-14 h-14 bg-green-50 text-[#00DF81] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}



function ProcessRow({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="group flex flex-col md:flex-row md:items-center bg-gray-50 border border-gray-100 rounded-3xl p-6 md:p-8 hover:bg-white hover:shadow-xl hover:border-gray-200 transition-all duration-300">
      <div className="flex items-center md:w-1/3 mb-4 md:mb-0 shrink-0">
        <span className="text-4xl md:text-5xl font-black text-gray-200 group-hover:text-[#00DF81] transition-colors duration-300 font-heading mr-6">{num}</span>
        <h3 className="text-2xl font-bold text-gray-900 font-heading">{title}</h3>
      </div>
      <div className="md:w-2/3 md:pl-8 md:border-l md:border-gray-200">
        <p className="text-gray-600 leading-relaxed text-lg">{desc}</p>
      </div>
    </div>
  );
}
