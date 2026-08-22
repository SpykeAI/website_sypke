import Link from "next/link";
import { PhoneCall, TrendingUp, Users, Clock, CheckCircle2, Bot, User } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black font-sans">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-gray-900">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 font-heading">
            Scale Your Business with <span className="text-[#00DF81]">AI Voice Agents</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-400">
            Never miss a call, follow up instantly, and reactivate dormant leads with our human-like AI voice technology designed for the USA market.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="bg-[#00DF81] text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-[#00C271] transition shadow-lg shadow-[#00DF81]/20">
              Book a Free Demo
            </Link>
            <Link href="#features" className="bg-transparent border-2 border-[#00DF81] text-[#00DF81] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#00DF81]/10 transition">
              See How It Works
            </Link>
          </div>
        </div>
        
        {/* Abstract Background Element matching Spyke AI Star */}
        <div className="absolute top-10 right-10 md:top-20 md:right-32 opacity-20 hidden md:block">
           <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 0 C50 30 70 50 100 50 C70 50 50 70 50 100 C50 70 30 50 0 50 C30 50 50 30 50 0 Z" fill="#FBBF24"/>
           </svg>
        </div>
      </section>

      {/* Trust Elements - Logos */}
      <section className="py-12 bg-[#050505] border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-8 font-heading">Trusted by forward-thinking companies</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40">
            {/* Placeholders for logos */}
            <div className="text-2xl font-bold font-serif text-white">TechCorp</div>
            <div className="text-2xl font-bold font-sans text-white">GlobalSolutions</div>
            <div className="text-2xl font-bold font-mono text-white">FutureAgency</div>
            <div className="text-2xl font-bold text-white">InnovateUSA</div>
          </div>
        </div>
      </section>

      {/* Problems We Solve */}
      <section id="features" className="py-24 bg-black px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">Problems We Solve</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Stop leaving money on the table. Our AI voice agents plug the leaks in your sales funnel.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<PhoneCall className="text-[#00DF81] w-10 h-10" />}
              title="Missed Calls"
              description="75% of callers won't leave a voicemail. Our AI answers instantly, 24/7."
            />
            <FeatureCard 
              icon={<TrendingUp className="text-[#00DF81] w-10 h-10" />}
              title="Better Conversion"
              description="Immediate responses lead to a 391% increase in conversions."
            />
            <FeatureCard 
              icon={<Users className="text-[#00DF81] w-10 h-10" />}
              title="Reactivating Leads"
              description="Automatically call and engage old or dormant leads to bring them back."
            />
            <FeatureCard 
              icon={<Clock className="text-[#00DF81] w-10 h-10" />}
              title="Instant Follow-ups"
              description="Follow up with inbound leads within seconds of them submitting a form."
            />
          </div>
          <div className="mt-16 text-center">
             <Link href="/contact" className="inline-flex items-center text-[#00DF81] font-bold hover:text-white transition">
               Learn how we can solve your specific problems <TrendingUp className="ml-2 w-5 h-5" />
             </Link>
          </div>
        </div>
      </section>

      {/* Human vs AI Section - Table Design */}
      <section className="py-24 bg-[#050505] px-4 sm:px-6 lg:px-8 border-y border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">Human vs. AI Voice Agent</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Why our AI agents outperform traditional call centers.</p>
          </div>
          
          <div className="bg-[#111] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
            {/* Table Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-800">
              <div className="p-6 hidden md:block">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Criteria</span>
              </div>
              <div className="p-6 bg-[#0a0a0a] border-l border-gray-800 hidden md:block">
                <span className="text-gray-400 font-bold text-lg">Human-Only Front Desk</span>
              </div>
              <div className="p-6 bg-black border-l border-gray-800">
                <div className="text-[#00DF81] text-xs font-bold uppercase tracking-widest mb-1">Recommended</div>
                <span className="text-white font-bold text-xl">Spyke AI Voice Agent</span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-800">
              <ComparisonRow criteria="Response time" human="Minutes to hours" ai="Under 15 seconds" />
              <ComparisonRow criteria="Availability" human="Business hours only" ai="24/7, incl. weekends" />
              <ComparisonRow criteria="Calls at once" human="One at a time" ai="Unlimited, no queue" />
              <ComparisonRow criteria="Follow-up consistency" human="Skipped when busy" ai="Every lead, on schedule" />
              <ComparisonRow criteria="CRM logging" human="Manual, delayed" ai="Automatic, real-time" />
              <ComparisonRow criteria="Cost as volume grows" human="Rises with headcount" ai="Flat, scales with ads" />
              <ComparisonRow criteria="Energy & tone" human="Varies by time of day" ai="Same energy, every call" isLast />
            </div>
          </div>
        </div>
      </section>

      {/* Advantages of AI Voice Agents */}
      <section className="py-24 bg-black px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">Advantages of AI Voice Agents</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Why SpykeAI is the ultimate unfair advantage for your business.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-800 rounded-2xl bg-[#0a0a0a] hover:border-[#00DF81] transition">
              <div className="text-4xl font-bold text-[#00DF81] mb-4">01</div>
              <h4 className="text-2xl font-bold text-white mb-3 font-heading">Cost Effective</h4>
              <p className="text-gray-400">Dramatically reduce your customer acquisition and support costs compared to hiring and training human agents.</p>
            </div>
            <div className="p-8 border border-gray-800 rounded-2xl bg-[#0a0a0a] hover:border-[#00DF81] transition">
              <div className="text-4xl font-bold text-[#00DF81] mb-4">02</div>
              <h4 className="text-2xl font-bold text-white mb-3 font-heading">Seamless Integration</h4>
              <p className="text-gray-400">Instantly syncs with your CRM, calendar, and lead forms. Works effortlessly within your existing tech stack.</p>
            </div>
            <div className="p-8 border border-gray-800 rounded-2xl bg-[#0a0a0a] hover:border-[#00DF81] transition">
              <div className="text-4xl font-bold text-[#00DF81] mb-4">03</div>
              <h4 className="text-2xl font-bold text-white mb-3 font-heading">Multi-Language</h4>
              <p className="text-gray-400">Communicate flawlessly with your audience in English, Spanish, and over 30 other languages instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-black text-white py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-heading">Ready to Automate Your Calls?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join the AI revolution and give your business the unfair advantage it deserves.
          </p>
          <Link href="/contact" className="bg-[#00DF81] text-black px-10 py-5 rounded-full font-bold text-xl hover:bg-[#00C271] transition shadow-xl shadow-[#00DF81]/20">
            Start Your Free Trial
          </Link>
        </div>
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00DF81]/10 rounded-full blur-[120px] pointer-events-none"></div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 hover:border-[#00DF81]/50 hover:shadow-lg hover:shadow-[#00DF81]/10 transition group">
      <div className="mb-6 p-4 bg-black rounded-xl inline-block group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-3 font-heading">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-lg">{description}</p>
    </div>
  );
}

function ComparisonRow({ criteria, human, ai, isLast = false }: { criteria: string, human: string, ai: string, isLast?: boolean }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 hover:bg-[#1a1a1a] transition ${isLast ? '' : 'border-b border-gray-800'}`}>
      <div className="p-6 md:p-6 p-4">
        <span className="text-white font-bold">{criteria}</span>
      </div>
      <div className="p-6 md:p-6 p-4 bg-[#0a0a0a] border-l border-gray-800 text-gray-400 flex items-center">
        <span className="text-gray-600 mr-3 hidden md:inline">-</span> {human}
      </div>
      <div className="p-6 md:p-6 p-4 bg-[#00DF81]/5 border-l border-gray-800 text-[#00DF81] font-bold flex items-center">
        <CheckCircle2 className="w-5 h-5 mr-3 shrink-0" /> {ai}
      </div>
    </div>
  );
}
