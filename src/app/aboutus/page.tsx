import { Metadata } from "next";
import { ArrowRight, Bot, Target, Zap, Phone, Share2, Wrench, PenTool, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Spyke AI Technologies",
  description: "Turning AI Into Real Business Outcomes",
};

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-50 border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00DF81]/10 via-transparent to-transparent -z-10"></div>
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 text-[#00c271] font-bold mb-6 text-sm uppercase tracking-wide shadow-sm">
            About Spyke AI Technologies
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-heading leading-tight">
            Turning AI Into Real <br />
            <span className="text-[#00DF81]">Business Outcomes.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            AI is no longer just a technology advantage. It's becoming a new way of running a business. At Spyke AI Technologies, we help businesses turn AI from an experiment into something they actually use.
          </p>
          <p className="text-lg font-bold text-gray-900">
            We don't just talk about what AI can do. We build it, integrate it, and put it to work.
          </p>
        </div>
      </section>

      {/* The Gap Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-heading">The Gap Between Capability and Reality</h2>
            <div className="space-y-6 text-gray-600 text-lg">
              <p>
                Spyke AI Technologies was founded on a simple observation: AI is moving incredibly fast. Yet most businesses struggle to turn that technology into something useful for their day-to-day operations.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#00DF81] mr-3 shrink-0" /> Thousands of AI tools available today.</li>
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#00DF81] mr-3 shrink-0" /> New models released every week.</li>
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#00DF81] mr-3 shrink-0" /> New automation platforms appear constantly.</li>
              </ul>
              <div className="bg-green-50 border-l-4 border-[#00DF81] p-6 rounded-r-2xl my-8">
                <p className="italic text-gray-700 font-medium mb-2">For a business owner, the real question isn't:</p>
                <p className="font-bold text-gray-900 line-through decoration-red-400 mb-4">"Which AI tool should I use?"</p>
                <p className="italic text-gray-700 font-medium mb-2">It's:</p>
                <p className="font-bold text-gray-900 text-xl text-[#00DF81]">"How can AI actually help my business?"</p>
              </div>
              <p>
                That gap is where SpykeAI comes in. We identify where AI creates real value, design the solution, integrate it, and improve it.
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
                SpykeAI was founded by <strong>Srikanishka Vadakattu (Sri)</strong>, a product management leader with 13+ years of experience building and scaling digital products across startups and tech companies (Paytm, Ola, OYO).
              </p>
              <p>
                That product background shapes how we approach AI. We don't start with <em>"Here's a cool AI tool."</em> We start with:
              </p>
              <blockquote className="text-2xl font-bold text-white border-l-4 border-[#00DF81] pl-6 py-2 my-8 font-heading leading-relaxed">
                "What problem are we trying to solve, and where can AI create the most leverage?"
              </blockquote>
              <p>Then we work backwards to build the solution.</p>
              <a href="https://www.linkedin.com/in/srikanishka/" target="_blank" className="inline-flex items-center text-[#00DF81] font-bold hover:text-white transition">
                Connect with Sri on LinkedIn <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="bg-gray-800 p-10 rounded-3xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4 font-heading">Our Mission</h3>
            <p className="text-[#00DF81] font-bold text-xl mb-6">Make AI Practical for Every Business</p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              To help businesses use AI to automate repetitive work, improve customer experiences, increase operational efficiency, and unlock new ways of growing their business.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We believe AI shouldn't be limited to large technology companies with massive engineering teams. A growing business should be able to use AI Voice Agents, intelligent automations, and workflows effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">What We Do</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">SpykeAI provides practical AI-powered services and implementation solutions tailored to your workflows.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard icon={<Phone />} title="AI Voice Agents" desc="Voice agents that handle conversations, qualify leads, answer questions, and schedule appointments." />
            <ServiceCard icon={<Bot />} title="AI Chatbots" desc="Intelligent conversational systems for websites, WhatsApp, customer support, and sales." />
            <ServiceCard icon={<Zap />} title="Business Automations" desc="Connect existing tools to automate repetitive processes across sales, operations, and support." />
            <ServiceCard icon={<Target />} title="AI Agents" desc="Autonomous agents designed to perform multi-step tasks and make decisions within defined workflows." />
            <ServiceCard icon={<Share2 />} title="System Integrations" desc="Connect AI with CRMs, calendars, and databases so it becomes part of your existing ecosystem." />
            <ServiceCard icon={<PenTool />} title="Custom AI Solutions" desc="Where off-the-shelf isn't enough, we design custom AI workflows around specific business needs." />
          </div>
        </div>
      </section>

      {/* Approach Steps */}
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">Our Approach</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">We believe successful AI implementation is less about the technology and more about solving the right problem.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Step num="1" title="Understand" desc="We first understand the business, its existing processes, bottlenecks, systems, and goals." />
            <Step num="2" title="Identify" desc="We identify where AI creates leverage. We only focus on areas where it makes a difference." />
            <Step num="3" title="Design" desc="We design the workflow, agent, automation, or integration around the business requirement." />
            <Step num="4" title="Build" desc="We implement the solution and connect it with the tools and systems you already use." />
            <Step num="5" title="Launch" desc="We test the system, refine the workflows, and confidently put it into production." />
            <Step num="6" title="Improve" desc="We continuously improve the system as better models and capabilities become available." />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#00DF81] px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">Let's Build Something With AI</h2>
          <p className="text-xl text-gray-800 mb-10 font-medium">
            You don't need to know which AI tool you need. Tell us what you're trying to achieve, and we'll help you figure out where AI can actually make a difference.
          </p>
          <a href="http://wa.link/18sxk1" target="_blank" className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-black transition shadow-2xl">
            Talk to Us on WhatsApp <ArrowRight className="ml-2 w-5 h-5" />
          </a>
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

function Step({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="relative p-8 border border-gray-200 rounded-3xl hover:border-[#00DF81] transition-colors">
      <div className="text-6xl font-bold text-gray-100 absolute top-4 right-6 font-heading -z-10">{num}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
