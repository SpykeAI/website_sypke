import { Bot, Lightbulb, Code2, Rocket, ArrowRight, ShieldCheck, Cog, CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-black font-sans">
      {/* Header */}
      <section className="bg-[#050505] text-white py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-heading">About Us – <span className="text-[#00DF81]">Spyke AI Technologies</span></h1>
          <h2 className="text-3xl font-bold mb-6 text-white font-heading">Turning AI Into Real Business Outcomes</h2>
          <p className="text-xl text-gray-400 leading-relaxed">
            AI is no longer just a technology advantage. It's becoming a new way of running a business.
          </p>
          <p className="text-xl text-gray-400 mt-4 leading-relaxed">
            At Spyke AI Technologies, we help businesses turn AI from an experiment into something they actually use.
          </p>
        </div>
      </section>

      {/* Intro & Story */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 font-heading">Our Story</h2>
            <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
              <p><strong className="text-white">Spyke AI Technologies was founded on a simple observation:</strong></p>
              <p>AI is moving incredibly fast. Yet most businesses struggle to turn that technology into something useful for their day-to-day operations.</p>
              <p>There are thousands of AI tools available today. New models are released every week. New automation platforms appear constantly. AI agents are becoming more capable every day.</p>
              <p>Yet for a business owner, the real question isn't: <em className="text-white font-bold">"Which AI tool should I use?"</em></p>
              <p>It's: <strong className="text-[#00DF81] text-2xl font-heading">"How can AI actually help my business?"</strong></p>
              <p>That gap between AI capability and practical business implementation is where SpykeAI comes in.</p>
            </div>
          </div>
          
          <div className="bg-[#111] p-10 rounded-3xl border border-gray-800 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 font-heading">Built by a Product Leader</h2>
            <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
              <p>SpykeAI was founded by <strong>Srikanishka Vadakattu</strong> (Sri), a product management leader with 13+ years of experience building and scaling digital products and businesses across startups and technology companies.</p>
              <p>Over the years, Sri has worked across companies and industries including <strong>Paytm, Ola, OYO</strong> and other technology startups, solving complex business problems through technology.</p>
              <div className="bg-[#0a0a0a] p-6 rounded-2xl border-l-4 border-[#00DF81] mt-6">
                <p className="italic text-gray-300">"We don't start with: 'Here's a cool AI tool. Let's find something to do with it.' We start with: <strong>'What problem are we trying to solve, and where can AI create the most leverage?'</strong> Then we work backwards to build the solution."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-[#050505] px-4 sm:px-6 lg:px-8 border-y border-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8 font-heading">Our Mission</h2>
          <h3 className="text-2xl font-bold text-[#00DF81] mb-6">Make AI Practical for Every Business</h3>
          <p className="text-xl text-gray-300 mb-8 font-bold p-8 bg-[#111] rounded-2xl border border-gray-800">
            To help businesses use AI to automate repetitive work, improve customer experiences, increase operational efficiency, and unlock new ways of growing their business.
          </p>
          <p className="text-lg text-gray-400">
            We believe AI shouldn't be limited to large technology companies with massive engineering teams. A growing business should be able to use AI Voice Agents, intelligent automations, AI assistants, and AI-powered workflows without having to become an AI research company itself.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 font-heading">What We Do</h2>
            <p className="text-xl text-gray-400">SpykeAI provides AI-powered services and implementation solutions for businesses.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard title="AI Voice Agents" description="Agents that handle conversations, qualify leads, answer questions, schedule appointments, and follow up with prospects." />
            <ServiceCard title="AI Chatbots" description="Intelligent conversational systems for websites, WhatsApp, customer support, lead qualification, and sales." />
            <ServiceCard title="Business Automations" description="We connect your existing tools and systems to automate repetitive processes across sales, marketing, and operations." />
            <ServiceCard title="AI Agents" description="AI-powered agents designed to perform multi-step tasks, retrieve information, and take actions on behalf of the business." />
            <ServiceCard title="CRM Integrations" description="We connect AI systems with CRMs, calendars, databases, and other tools so AI becomes part of the existing workflow." />
            <ServiceCard title="Custom AI Solutions" description="Where an off-the-shelf solution isn't enough, we design custom AI workflows around the specific requirements of the business." />
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-24 bg-[#050505] px-4 sm:px-6 lg:px-8 border-y border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 font-heading">Our Approach</h2>
            <p className="text-xl text-gray-400">We believe successful AI implementation is less about the technology and more about solving the right problem.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StepCard step="1" title="Understand" desc="We first understand the business, its existing processes, bottlenecks, systems, and goals." />
            <StepCard step="2" title="Identify" desc="We identify where AI and automation can create meaningful leverage. Not every process needs AI." />
            <StepCard step="3" title="Design" desc="We design the workflow, AI agent, automation, integration, or solution around the business requirement." />
            <StepCard step="4" title="Build" desc="We implement the solution and connect it with the tools and systems the business already uses." />
            <StepCard step="5" title="Launch" desc="We test the system, refine the workflows, and put it into production." />
            <StepCard step="6" title="Improve" desc="AI is evolving rapidly. We continuously look for opportunities to improve the system as better tools become available." />
          </div>
        </div>
      </section>

      {/* Why Spyke AI */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold text-white mb-8 font-heading">Why SpykeAI?</h2>
            <ul className="space-y-6">
              <li className="bg-[#111] p-6 rounded-2xl border border-gray-800">
                <h4 className="text-xl font-bold text-white mb-2 font-heading">We Start With the Business Problem</h4>
                <p className="text-gray-400">We don't believe in adding AI simply because AI is fashionable. We first identify the problem and then determine whether AI is the right solution.</p>
              </li>
              <li className="bg-[#111] p-6 rounded-2xl border border-gray-800">
                <h4 className="text-xl font-bold text-white mb-2 font-heading">Product Thinking, Not Just Tool Integration</h4>
                <p className="text-gray-400">Our product background means we think beyond connecting APIs. We look at the complete experience, business logic, edge cases, and measurable outcomes.</p>
              </li>
              <li className="bg-[#111] p-6 rounded-2xl border border-gray-800">
                <h4 className="text-xl font-bold text-white mb-2 font-heading">Built Around Your Existing Stack</h4>
                <p className="text-gray-400">Your business already has tools, systems, and CRMs. Where possible, we integrate AI into that ecosystem rather than forcing you to replace everything.</p>
              </li>
              <li className="bg-[#111] p-6 rounded-2xl border border-gray-800">
                <h4 className="text-xl font-bold text-white mb-2 font-heading">Human + AI</h4>
                <p className="text-gray-400">We don't believe every business process should become fully autonomous. The right balance between AI automation and human oversight depends on the use case.</p>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-white mb-8 font-heading">Who We Work With</h2>
            <p className="text-lg text-gray-400 mb-6">Our solutions can be applied across industries including:</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <IndustryItem text="Real Estate" />
              <IndustryItem text="Healthcare and Clinics" />
              <IndustryItem text="E-commerce and D2C" />
              <IndustryItem text="Recruitment" />
              <IndustryItem text="Professional Services" />
              <IndustryItem text="Financial Services" />
              <IndustryItem text="Travel & Education" />
              <IndustryItem text="Startups & SMBs" />
            </div>
            <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-[#00DF81]/30 mt-8">
              <h3 className="text-2xl font-bold text-white mb-4 font-heading">Our Vision</h3>
              <p className="text-gray-400 mb-4">We believe the next generation of businesses will not simply use AI tools. <strong>They will be AI-powered businesses.</strong></p>
              <ul className="space-y-2 text-gray-400">
                <li><CheckCircle2 className="inline w-5 h-5 text-[#00DF81] mr-2" /> Sales teams will have AI assistants.</li>
                <li><CheckCircle2 className="inline w-5 h-5 text-[#00DF81] mr-2" /> Customer support will be augmented by AI.</li>
                <li><CheckCircle2 className="inline w-5 h-5 text-[#00DF81] mr-2" /> Operations will become automated.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#00DF81] text-black py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">Let's Build Something With AI</h2>
          <p className="text-xl mb-10 font-medium">
            Tell us what you're trying to achieve, and we'll help you figure out where AI can actually make a difference.
          </p>
          <a href="http://wa.link/18sxk1" target="_blank" rel="noreferrer" className="inline-block bg-black text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-900 transition shadow-2xl">
            Talk to Us on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ title, description }: { title: string, description: string }) {
  return (
    <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 hover:border-[#00DF81]/50 transition group">
      <h3 className="text-2xl font-bold text-white mb-4 font-heading group-hover:text-[#00DF81] transition">{title}</h3>
      <p className="text-gray-400 text-lg leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, title, desc }: { step: string, title: string, desc: string }) {
  return (
    <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-gray-800 flex flex-col">
      <div className="text-4xl font-bold text-[#00DF81] mb-4 font-heading">0{step}</div>
      <h3 className="text-2xl font-bold text-white mb-3 font-heading">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function IndustryItem({ text }: { text: string }) {
  return (
    <div className="flex items-center space-x-2 text-gray-300">
      <div className="w-2 h-2 rounded-full bg-[#00DF81]"></div>
      <span>{text}</span>
    </div>
  );
}
