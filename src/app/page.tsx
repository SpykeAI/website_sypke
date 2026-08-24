import { Phone, Clock, DollarSign, CalendarCheck, CheckCircle2, ChevronRight, MessageSquare, Wrench, Thermometer, Zap, Headset, LineChart, Building } from "lucide-react";

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

      {/* Impact Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#00DF81] font-bold text-sm tracking-wider uppercase">Built to move these numbers</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 font-heading">What a faster response is worth</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#E8FBF1] rounded-2xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-black text-[#0A8F5C] mb-2 font-heading">&lt;15 sec</div>
              <div className="text-sm font-bold text-gray-600">Avg. time to first response</div>
            </div>
            <div className="bg-[#E8FBF1] rounded-2xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-black text-[#0A8F5C] mb-2 font-heading">24/7</div>
              <div className="text-sm font-bold text-gray-600">Leads captured, day or night</div>
            </div>
            <div className="bg-[#E8FBF1] rounded-2xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-black text-[#0A8F5C] mb-2 font-heading">100%</div>
              <div className="text-sm font-bold text-gray-600">Calls answered & logged</div>
            </div>
            <div className="bg-[#E8FBF1] rounded-2xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-black text-[#0A8F5C] mb-2 font-heading">0</div>
              <div className="text-sm font-bold text-gray-600">Leads left on hold</div>
            </div>
          </div>
        </div>
      </section>

      {/* Spend Strip */}
      <section className="py-12 bg-[#121212] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold max-w-2xl leading-snug">
              You already paid for that lead. <span className="text-[#FFC050]">Someone has to actually answer it — fast.</span>
            </h3>
            <p className="text-[#9BA3AC] text-sm mt-2 font-bold">Speed to lead, not ad spend, is usually the biggest leak in the funnel.</p>
          </div>
          <a href="#lead-form" className="bg-[#00DF81] text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-[#00c271] transition shrink-0">
            Fix my response time
          </a>
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

      {/* Pros Section */}
      <section className="py-24 bg-[#E8FBF1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <span className="text-[#00DF81] font-bold text-sm tracking-wider uppercase mb-2 block">Why teams switch</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 font-heading">What you get that a front desk can't</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { t: "Budget-friendly", d: "Fixed cost, no extra headcount" },
              { t: "Higher conversion", d: "Every lead answered while hot" },
              { t: "Always professional", d: "On-script, on-brand, every call" },
              { t: "Same energy, all day", d: "No bad moods, no burnout" },
              { t: "24/7 coverage", d: "Nights, weekends & holidays" },
              { t: "Parallel calling", d: "Inbound & outbound at once" }
            ].map((p, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 flex items-start gap-4 shadow-sm border border-gray-100">
                <div className="w-6 h-6 rounded-full bg-[#00DF81] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gray-900" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-[15px] mb-1">{p.t}</div>
                  <div className="text-sm text-gray-600">{p.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <span className="text-[#00DF81] font-bold text-sm tracking-wider uppercase mb-2 block">Who it's for</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 font-heading mb-4">Built for every stakeholder in the deal</h2>
            <p className="text-xl text-gray-600">Different roles, same missed-call problem underneath.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="w-10 h-10 bg-[#FFF6E6] rounded-xl flex items-center justify-center mb-4">
                <Wrench className="w-5 h-5 text-[#B9791A]" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">Field Techs</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="text-[#00DF81] font-bold">→</span> Never drop a tool to answer a call</li>
                <li className="flex items-start gap-2"><span className="text-[#00DF81] font-bold">→</span> Stop paying for leads you can't answer</li>
                <li className="flex items-start gap-2"><span className="text-[#00DF81] font-bold">→</span> Focus safely on the job at hand</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="w-10 h-10 bg-[#FFF6E6] rounded-xl flex items-center justify-center mb-4">
                <Headset className="w-5 h-5 text-[#B9791A]" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">Dispatchers</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="text-[#00DF81] font-bold">→</span> One number, zero missed calls</li>
                <li className="flex items-start gap-2"><span className="text-[#00DF81] font-bold">→</span> Agents handle overflow seamlessly</li>
                <li className="flex items-start gap-2"><span className="text-[#00DF81] font-bold">→</span> AI notes logged instantly in CRM</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="w-10 h-10 bg-[#FFF6E6] rounded-xl flex items-center justify-center mb-4">
                <LineChart className="w-5 h-5 text-[#B9791A]" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">HVAC Owners</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="text-[#00DF81] font-bold">→</span> Consistent brand voice across calls</li>
                <li className="flex items-start gap-2"><span className="text-[#00DF81] font-bold">→</span> Full visibility into response times</li>
                <li className="flex items-start gap-2"><span className="text-[#00DF81] font-bold">→</span> Scale lead volume without headcount</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="w-10 h-10 bg-[#FFF6E6] rounded-xl flex items-center justify-center mb-4">
                <Building className="w-5 h-5 text-[#B9791A]" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">Commercial Teams</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="text-[#00DF81] font-bold">→</span> Handle seasonal call spikes with zero drops</li>
                <li className="flex items-start gap-2"><span className="text-[#00DF81] font-bold">→</span> Pre-qualify commercial accounts instantly</li>
                <li className="flex items-start gap-2"><span className="text-[#00DF81] font-bold">→</span> 24/7 emergency dispatch handling</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <span className="text-[#00DF81] font-bold text-sm tracking-wider uppercase mb-2 block">Setup, start to finish</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 font-heading">Live on your business number in under 3 weeks</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[28px] left-[10%] right-[40%] border-t-2 border-dashed border-gray-300"></div>
            <div className="relative bg-white p-8 rounded-2xl border border-gray-200 z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#00DF81] text-gray-900 font-black flex items-center justify-center">01</div>
                <div className="font-bold text-gray-500 uppercase tracking-wider text-sm">Week 1</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">Connect your number & CRM</h3>
              <p className="text-gray-600 text-[15px]">Zero downtime for current callers.</p>
            </div>
            <div className="relative bg-white p-8 rounded-2xl border border-gray-200 z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#00DF81] text-gray-900 font-black flex items-center justify-center">02</div>
                <div className="font-bold text-gray-500 uppercase tracking-wider text-sm">Week 2</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">Train it on your services</h3>
              <p className="text-gray-600 text-[15px]">Pricing, dispatch rules & FAQs go in.</p>
            </div>
            <div className="relative bg-white p-8 rounded-2xl border border-gray-200 z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#00DF81] text-gray-900 font-black flex items-center justify-center">03</div>
                <div className="font-bold text-gray-500 uppercase tracking-wider text-sm">Week 3</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">Go live & monitor</h3>
              <p className="text-gray-600 text-[15px]">Live dashboard, plus monthly tuning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Facts Section (Dark Theme with Yellow) */}
      <section className="py-24 bg-[#121212] text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(700px 320px at 15% 0%, rgba(0,217,138,0.14), transparent 60%), radial-gradient(600px 300px at 100% 100%, rgba(255,192,80,0.10), transparent 60%)' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center text-[#FFC050] font-bold text-sm tracking-wider uppercase mb-4">
              ◆ The Facts, Verified
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-heading text-white">What the research actually says</h2>
            <p className="text-[#AEB6C0] text-lg max-w-2xl mx-auto">
              Not our numbers — landmark, widely-cited studies on lead response.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#FFC050]/50 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl font-black text-[#FFC050] mb-4 font-heading">21×</div>
              <p className="font-bold text-[#E4E7EC] mb-6 line-clamp-3">More likely to qualify a lead reached in 5 min vs. 30</p>
              <div className="pt-4 border-t border-white/10 text-xs text-[#8fe3c4] font-bold">MIT / InsideSales.com study</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#FFC050]/50 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl font-black text-[#FFC050] mb-4 font-heading">100×</div>
              <p className="font-bold text-[#E4E7EC] mb-6 line-clamp-3">More likely to make contact within 5 min vs. 30</p>
              <div className="pt-4 border-t border-white/10 text-xs text-[#8fe3c4] font-bold">MIT / InsideSales.com study</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#FFC050]/50 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl font-black text-[#FFC050] mb-4 font-heading">78%</div>
              <p className="font-bold text-[#E4E7EC] mb-6 line-clamp-3">Of buyers go with whichever company responds first</p>
              <div className="pt-4 border-t border-white/10 text-xs text-[#8fe3c4] font-bold">Harvard Business Review</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#FFC050]/50 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl font-black text-[#FFC050] mb-4 font-heading">42 hrs</div>
              <p className="font-bold text-[#E4E7EC] mb-6 line-clamp-3">Average time it takes a business to first respond</p>
              <div className="pt-4 border-t border-white/10 text-xs text-[#8fe3c4] font-bold">Harvard Business Review</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-16">
            <div className="inline-flex items-center text-[#00DF81] font-bold text-sm tracking-wider uppercase mb-4">
              Before you call
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 font-heading">Common questions</h2>
          </div>
          
          <div className="border-t border-gray-200">
            {[
              { q: "Will it sound like a robot?", a: "No — natural, low-latency voice tuned to your brand. Most callers can't tell." },
              { q: "Does it replace my dispatchers?", a: "No. It removes the wait, so dispatchers only talk to customers who are ready." },
              { q: "Which CRMs does it work with?", a: "Housecall Pro, ServiceTitan, and other common HVAC tools — tell us yours on the demo." },
              { q: "What happens on a call it can't handle?", a: "It warm-transfers to a human, with full context — nothing repeats." },
              { q: "How is this priced?", a: "Based on lead volume and scope. We'll quote it clearly on your demo." },
              { q: "How long does setup actually take?", a: "Most teams are live in under 3 weeks." }
            ].map((faq, i) => (
              <details key={i} className="group border-b border-gray-200 py-5 open:pb-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-lg text-gray-900">
                  {faq.q}
                  <span className="transition group-open:rotate-45 text-[#00DF81] text-2xl font-normal ml-4 shrink-0">+</span>
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed max-w-2xl text-[15px]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form */}
      <section id="lead-form" className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl border border-gray-200 shadow-xl">
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
