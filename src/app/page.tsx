import { Phone, Clock, DollarSign, CalendarCheck, CheckCircle2, ChevronRight, MessageSquare, Wrench, Thermometer, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00DF81]/10 via-white to-white -z-10"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#00DF81]/10 text-[#00c271] font-bold mb-6 text-sm uppercase tracking-wide">
              <span className="flex h-2 w-2 bg-[#00DF81] rounded-full mr-2 animate-pulse"></span>
              Built exclusively for HVAC & Home Services
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-heading leading-[1.1]">
              Never Miss an <br/><span className="text-[#00DF81]">Emergency AC Repair</span> Call Again.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed font-medium">
              Deploy an AI Voice Agent that answers instantly 24/7, qualifies the emergency, and books the appointment directly into your calendar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#lead-form" className="bg-[#00DF81] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#00c271] transition shadow-xl shadow-[#00DF81]/20 flex items-center justify-center">
                Book a Demo <ChevronRight className="ml-2 w-5 h-5" />
              </a>
              <a href="http://wa.link/18sxk1" target="_blank" className="bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition flex items-center justify-center">
                Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-[#00DF81] rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white border border-gray-200 p-8 rounded-3xl shadow-2xl z-10">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#00DF81]/10 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[#00DF81]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Incoming Call: Emergency AC</h4>
                    <p className="text-sm text-gray-500">2:30 AM • Sunday</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">AI Handled</span>
              </div>
              <div className="space-y-4">
                <ChatBubble ai text="Hi, you've reached Smith HVAC. How can I help you today?" />
                <ChatBubble text="My AC just broke and it's 90 degrees in the house. I have a newborn." />
                <ChatBubble ai text="I'm so sorry to hear that. I can get an emergency technician out to you first thing at 7:00 AM. May I have your address?" />
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mt-4 flex items-center space-x-4">
                  <CalendarCheck className="text-blue-500 w-8 h-8" />
                  <div>
                    <h5 className="font-bold text-blue-900 text-sm">Appointment Booked</h5>
                    <p className="text-blue-700 text-xs">Added to ServiceTitan automatically.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facts Section */}
      <section className="py-16 bg-[#00DF81] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/90 p-8 rounded-2xl shadow-sm">
            <h3 className="text-5xl font-bold text-gray-900 mb-2 font-heading">80%</h3>
            <p className="text-gray-700 font-bold">Of callers hang up instead of leaving a voicemail.</p>
          </div>
          <div className="bg-white/90 p-8 rounded-2xl shadow-sm">
            <h3 className="text-5xl font-bold text-gray-900 mb-2 font-heading">$500+</h3>
            <p className="text-gray-700 font-bold">Lost revenue for every single missed service call.</p>
          </div>
          <div className="bg-white/90 p-8 rounded-2xl shadow-sm">
            <h3 className="text-5xl font-bold text-gray-900 mb-2 font-heading">30%</h3>
            <p className="text-gray-700 font-bold">Of HVAC calls happen after normal business hours.</p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">The Problem with Traditional Dispatch</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">Summer heatwaves and winter freezes mean massive call spikes. If you don't answer, your competitor will.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProblemCard icon={<Clock />} title="Missed After-Hours Calls" desc="Customers with emergencies at 10 PM won't wait until 8 AM. They call the next company on Google." />
            <ProblemCard icon={<DollarSign />} title="Expensive Call Centers" desc="Traditional answering services cost thousands, put customers on hold, and often lack HVAC technical knowledge." />
            <ProblemCard icon={<Phone />} title="Summer Volume Spikes" desc="When a heatwave hits, your front desk is overwhelmed. Customers get busy signals and you lose thousands in revenue." />
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-12 font-heading">Who is this for?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center">
              <Thermometer className="w-16 h-16 text-[#00DF81] mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">HVAC Companies</h3>
              <p className="text-gray-600">Perfect for heating and cooling businesses managing emergency AC/Furnace repair calls.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center">
              <Wrench className="w-16 h-16 text-[#00DF81] mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">Plumbing SMEs</h3>
              <p className="text-gray-600">Handle urgent pipe bursts, water heater failures, and drain clogs immediately.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center">
              <Zap className="w-16 h-16 text-[#00DF81] mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">Electrical Contractors</h3>
              <p className="text-gray-600">Qualify electrical emergencies and schedule routine panel upgrades effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">Benefits for Your Business</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">Transform how you handle customer interactions and operations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BenefitCard title="Zero Missed Leads" desc="Every call is answered on the first ring, 24/7/365." />
            <BenefitCard title="Smart Triage" desc="Differentiates between routine maintenance and emergency calls instantly." />
            <BenefitCard title="Direct CRM Sync" desc="Books jobs directly into ServiceTitan, Housecall Pro, or Jobber." />
            <BenefitCard title="Lower Overhead" desc="Fraction of the cost of a full-time dispatcher or third-party call center." />
          </div>
        </div>
      </section>

      {/* Human vs AI Section - Table Design */}
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-heading">Human Dispatcher vs. AI Agent</h2>
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xl">
            {/* Table Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-200">
              <div className="p-6 hidden md:block bg-gray-50">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Criteria</span>
              </div>
              <div className="p-6 bg-gray-50 border-l border-gray-200 hidden md:block">
                <span className="text-gray-700 font-bold text-lg">Traditional Answering Service</span>
              </div>
              <div className="p-6 bg-green-50 border-l border-gray-200">
                <div className="text-[#00DF81] text-xs font-bold uppercase tracking-widest mb-1">Recommended</div>
                <span className="text-gray-900 font-bold text-xl">Spyke AI Voice Agent</span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
              <ComparisonRow criteria="Speed to Answer" human="Put on hold during heatwaves" ai="Answers instantly, 0 rings" />
              <ComparisonRow criteria="Availability" human="Costly after-hours fees" ai="24/7/365 at a flat rate" />
              <ComparisonRow criteria="HVAC Knowledge" human="Often reads from generic scripts" ai="Trained on HVAC-specific triage" />
              <ComparisonRow criteria="Job Booking" human="Sends you a message to call back" ai="Books directly into your calendar" />
              <ComparisonRow criteria="Call Capacity" human="One call at a time" ai="Handles unlimited simultaneous calls" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-heading">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            <FaqItem q="Does it sound like a real person?" a="Yes! Our models use ultra-realistic voice cloning with natural pauses and conversational intelligence. Most customers don't even realize they are speaking to AI." />
            <FaqItem q="Can it integrate with our scheduling software?" a="Absolutely. We integrate directly with platforms like ServiceTitan, Housecall Pro, Jobber, and custom CRMs to book appointments directly." />
            <FaqItem q="How does it handle complex technical questions?" a="The AI is trained on your specific business knowledge base. If a customer asks a highly technical question it doesn't know, it will gracefully escalate the call or take a message for a technician." />
            <FaqItem q="What if a customer has an emergency?" a="You can configure specific 'emergency' logic. For example, if someone says 'water is leaking everywhere', the AI can immediately route the call to your on-call technician's cell phone." />
          </div>
        </div>
      </section>

      {/* Lead Form */}
      <section id="lead-form" className="py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-gray-50 p-10 rounded-3xl border border-gray-200 shadow-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">Stop Missing Revenue. Book a Demo.</h2>
            <p className="text-gray-600">Fill out the form below to see how our AI can handle your calls.</p>
          </div>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none bg-white text-gray-900" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none bg-white text-gray-900" placeholder="Smith HVAC" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none bg-white text-gray-900" placeholder="john@smithhvac.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none bg-white text-gray-900" placeholder="(555) 123-4567" />
            </div>
            <button type="button" className="w-full bg-[#00DF81] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#00c271] transition shadow-lg">
              Get Started
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function ChatBubble({ text, ai = false }: { text: string, ai?: boolean }) {
  return (
    <div className={`flex ${ai ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] rounded-2xl p-4 ${ai ? 'bg-gray-100 text-gray-800 rounded-tl-sm' : 'bg-[#00DF81] text-white rounded-tr-sm'}`}>
        <p className="text-sm font-medium">{text}</p>
      </div>
    </div>
  );
}

function ProblemCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="w-14 h-14 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

function BenefitCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
      <div className="w-12 h-12 bg-[#00DF81]/10 text-[#00DF81] rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

function ComparisonRow({ criteria, human, ai }: { criteria: string, human: string, ai: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 hover:bg-gray-50 transition">
      <div className="p-4 md:p-6 bg-white md:bg-transparent">
        <span className="text-gray-900 font-bold">{criteria}</span>
      </div>
      <div className="p-4 md:p-6 bg-gray-50 border-l border-gray-200 text-gray-600 flex items-center">
        <span className="text-gray-400 mr-3 hidden md:inline">-</span> {human}
      </div>
      <div className="p-4 md:p-6 bg-green-50 border-l border-green-100 text-green-700 font-bold flex items-center">
        <CheckCircle2 className="w-5 h-5 mr-3 shrink-0 text-[#00DF81]" /> {ai}
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string, a: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <h4 className="text-lg font-bold text-gray-900 mb-2">{q}</h4>
      <p className="text-gray-600">{a}</p>
    </div>
  );
}
