export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "Cost & Economics" | "Dispatch & Operations" | "CRM & Infrastructure" | "Implementation";
  readTime: string;
  publishDate: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  featuredImage: string;
  isFeatured?: boolean;
  content: {
    tableOfContents: { id: string; title: string }[];
    introduction: string;
    sections: {
      id: string;
      title: string;
      body: string[];
      callout?: {
        type: "tip" | "warning" | "stat";
        title: string;
        text: string;
      };
      table?: {
        headers: string[];
        rows: string[][];
      };
    }[];
    conclusion: string;
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-much-does-an-ai-receptionist-cost-for-hvac-contractors",
    title: "How Much Does an AI Receptionist Cost for HVAC Contractors in 2026?",
    excerpt:
      "A complete transparent pricing breakdown comparing traditional 24/7 answering services ($1,800/mo) vs. in-house dispatchers ($45k/yr) vs. human-sounding AI Voice Agents.",
    category: "Cost & Economics",
    readTime: "6 min read",
    publishDate: "November 14, 2026",
    isFeatured: true,
    featuredImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Srikanishka Vadakattu",
      role: "Founder & AI Systems Architect, Spyke AI",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    content: {
      tableOfContents: [
        { id: "the-hidden-cost-of-missed-calls", title: "The Hidden Cost of Missed HVAC Calls" },
        { id: "traditional-options-comparison", title: "Comparing Traditional Answering Services vs In-House vs AI" },
        { id: "how-ai-voice-pricing-works", title: "How AI Voice Agent Pricing is Structured" },
        { id: "roi-breakdown", title: "Real-World ROI: A 5-Truck HVAC Company Case Study" },
        { id: "decision-framework", title: "Decision Framework: When Does AI Make Financial Sense?" },
      ],
      introduction:
        "Every HVAC contractor knows the sting of a missed call during July heatwaves or January sub-zero cold snaps. An emergency AC or furnace breakdown represents an immediate $800 to $9,500 ticket. But if that phone rings four times and hits voicemail, 84% of desperate homeowners hang up and dial the next contractor on Google Local Services.\n\nHistorically, contractors were forced to choose between paying $3,500–$4,500/month for full-time night dispatchers or suffering through rigid third-party call centers with generic operators reading scripts poorly. In 2026, low-latency conversational AI voice agents have rewritten this financial equation.",
      sections: [
        {
          id: "the-hidden-cost-of-missed-calls",
          title: "The Hidden Cost of Missed HVAC Calls",
          body: [
            "Before evaluating software costs, contractors must understand the baseline bleed of after-hours and overflow call volume. In a typical 4-to-10 truck HVAC operation in North America, between 25% and 38% of inbound customer calls occur after 5:00 PM, before 8:00 AM, or during weekend peaks.",
            "According to home service industry benchmarks, the average ticket for an emergency diagnostic visit followed by component repair is $620, while emergency full-system replacements average $7,800. Losing just three after-hours calls per week translates to over $11,000 in lost monthly top-line revenue.",
          ],
          callout: {
            type: "stat",
            title: "Industry Reality",
            text: "84% of emergency HVAC callers never leave a voicemail. If you don't pick up within 3 rings, they immediately call your local competitor.",
          },
        },
        {
          id: "traditional-options-comparison",
          title: "Comparing Traditional Answering Services vs In-House vs AI",
          body: [
            "Let's compare the three primary models available to HVAC companies today: In-house staff, third-party human answering services, and dedicated AI voice infrastructure.",
          ],
          table: {
            headers: ["Metric", "In-House Night Dispatcher", "Traditional Call Center", "Spyke AI Voice Agent"],
            rows: [
              ["Average Cost", "$3,500 - $4,500/mo + Benefits", "$800 - $2,200/mo ($1.85/min)", "$299 - $699/mo (Flat usage)"],
              ["Pickup Speed", "2 - 5 rings", "3 - 8 rings (Wait queue)", "Zero rings (< 600ms)"],
              ["ServiceTitan / CRM Sync", "Manual entry next morning", "Clunky email summaries", "Live, real-time two-way sync"],
              ["Concurrent Calls Handled", "1 call at a time", "Limited by center queue", "Unlimited simultaneous calls"],
              ["Script Accuracy & Tone", "High (but prone to fatigue)", "Low (unskilled generic agents)", "100% consistent & branded"],
            ],
          },
        },
        {
          id: "how-ai-voice-pricing-works",
          title: "How AI Voice Agent Pricing is Structured",
          body: [
            "Unlike traditional call centers that penalize you with overage fees when call volume spikes during severe storms, modern AI voice solutions typically follow one of two models:",
            "1. Flat Base + Per-Minute Usage: A foundational infrastructure fee ($299 to $599/month) covering software licenses, CRM webhook connectors, and softphone trunks, plus an ultra-low telephony rate (~$0.12 to $0.18 per talk minute).",
            "2. Value-Tiered Retainers: High-growth contractors handling 1,500+ calls per month often choose all-inclusive tiers ($699 to $1,400/month) that include custom voice fine-tuning, outbound dispatch escalation workflows, and dedicated engineer support.",
          ],
          callout: {
            type: "tip",
            title: "Pro Tip For Contractors",
            text: "Always ask if your AI provider charges extra for simultaneous lines. Spyke AI handles infinite concurrent calls so a heatwave storm never sends a customer to busy tone.",
          },
        },
        {
          id: "roi-breakdown",
          title: "Real-World ROI: A 5-Truck HVAC Company Case Study",
          body: [
            "Consider a residential HVAC contractor running 5 service vans in Columbus, Ohio. Prior to deploying an AI voice agent, the owner was forwarding after-hours calls to his personal mobile phone, leading to severe burnout and missed weekend emergency calls.",
            "Upon implementing a 24/7 AI Voice Agent configured to triage calls:",
            "- Month 1 Inbound Calls Captured: 142 total after-hours and overflow calls.",
            "- Emergency Dispatches Booked: 19 urgent repair visits booked directly into ServiceTitan.",
            "- Replacement Opportunities Captured: 2 full condenser replacements quoted ($15,400 combined revenue).",
            "- Total Software Investment: $540 for the month.",
            "- Net Return on Investment: Over 2,700% in newly realized gross margin.",
          ],
        },
        {
          id: "decision-framework",
          title: "Decision Framework: When Does AI Make Financial Sense?",
          body: [
            "If your HVAC business handles more than 25 inbound calls per week outside of standard 8-to-5 operating hours, an AI receptionist pays for itself on the very first emergency repair job booked each month.",
            "Additionally, if your office manager or front desk dispatcher spends more than 2 hours daily answering routine questions ('What's your trip fee?', 'Do you service Carrier units?', 'Can someone come Saturday morning?'), automating those triage conversations frees your staff to focus on parts ordering, technician coordination, and high-margin sales proposals.",
          ],
        },
      ],
      conclusion:
        "The question in 2026 is no longer whether AI can handle HVAC phone calls—it is how much revenue your business continues to bleed every evening your phone rolls over to an empty answering machine. With sub-600ms latency and native CRM dispatch, an AI receptionist costs a fraction of a human hire while delivering 24/7 consistency.",
    },
  },
  {
    slug: "never-miss-after-hours-emergency-calls-hvac-playbook",
    title: "The After-Hours Emergency Call Playbook: Stop Leaking $12,000/Month to Competitors",
    excerpt:
      "83% of emergency no-heat or no-AC callers hang up on voicemail. Here is how top HVAC contractors use AI voice dispatch to answer on ring one and lock in high-ticket replacements.",
    category: "Dispatch & Operations",
    readTime: "5 min read",
    publishDate: "November 10, 2026",
    featuredImage: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Srikanishka Vadakattu",
      role: "Founder & AI Systems Architect, Spyke AI",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    content: {
      tableOfContents: [
        { id: "why-homeowners-hang-up", title: "Why Desperate Homeowners Refuse to Leave Voicemails" },
        { id: "anatomy-of-emergency-ai-agent", title: "Anatomy of an Emergency Triage AI Call Flow" },
        { id: "technician-escalation-protocols", title: "On-Call Technician Escalation & Live Warm Transfers" },
        { id: "revenue-impact", title: "Measuring After-Hours Revenue Impact" },
      ],
      introduction:
        "When an HVAC unit fails at 10:30 PM on a Friday with indoor temperatures climbing past 85°F, the customer is not casually shopping around. They have high intent, urgency, and their credit card in hand. If your phone rings to voicemail, they simply open Google Maps and dial the next contractor offering 24/7 service.",
      sections: [
        {
          id: "why-homeowners-hang-up",
          title: "Why Desperate Homeowners Refuse to Leave Voicemails",
          body: [
            "Psychological studies on consumer distress behavior show that when a home emergency occurs (water leaking from an evaporator coil, carbon monoxide warnings, freezing temperatures), uncertainty is the primary driver of customer anxiety.",
            "A voicemail prompt provides zero certainty: Will someone call back in 5 minutes? Tomorrow morning? Monday? Because of this uncertainty, homeowners abandon voicemail within 6 seconds and continue calling down the list until a voice answers.",
          ],
        },
        {
          id: "anatomy-of-emergency-ai-agent",
          title: "Anatomy of an Emergency Triage AI Call Flow",
          body: [
            "A high-converting AI voice agent follows a strict triage architecture designed specifically for trades:",
            "Step 1: Empathy & Immediate Validation ('I'm so sorry you're dealing with no heat tonight. Let's get a technician out to you right away.')",
            "Step 2: Emergency vs. Routine Classification (Verifying safety hazards, refrigerant leaks, or non-urgent tune-up inquiries)",
            "Step 3: Clear Fee Disclosure (Explaining after-hours emergency diagnostic rates upfront to avoid technician friction on site)",
            "Step 4: Immediate Slot Lock (Selecting the next available slot or alerting the on-call on-duty technician).",
          ],
          callout: {
            type: "warning",
            title: "Avoid Fee Surprises",
            text: "Always instruct your AI agent to communicate after-hours diagnostic fees before booking. Transparency builds immediate trust and eliminates billing disputes on-site.",
          },
        },
        {
          id: "technician-escalation-protocols",
          title: "On-Call Technician Escalation & Live Warm Transfers",
          body: [
            "What happens when a commercial chiller fails or a VIP maintenance agreement holder calls? The AI agent shouldn't just take a message—it initiates a live warm transfer.",
            "Spyke AI checks your technician on-call schedule in real-time, dials the technician's mobile, whispers the emergency details into their ear, and seamlessly connects the homeowner upon acceptance. If the technician does not answer within 20 seconds, the agent rolls over to the backup lead technician automatically.",
          ],
        },
        {
          id: "revenue-impact",
          title: "Measuring After-Hours Revenue Impact",
          body: [
            "Contractors tracking after-hours conversion routinely see a 4x to 7x jump in closed emergency jobs within 30 days of replacing voicemail with interactive voice agents. That directly protects your company from losing market share to national private-equity-backed HVAC consolidators.",
          ],
        },
      ],
      conclusion:
        "Winning after-hours calls isn't about working 24 hours a day—it's about deploying intelligent systems that respond with instant clarity, compassion, and definitive booking options.",
    },
  },
  {
    slug: "hvac-lead-capture-servicetitan-housecallpro-integration",
    title: "Connecting AI Voice Agents to ServiceTitan & Housecall Pro: Zero-Latency Dispatch",
    excerpt:
      "How automated two-way calendar syncing books diagnostic visits directly into technician schedules while qualifying warranty vs. cash customer jobs in real time.",
    category: "CRM & Infrastructure",
    readTime: "7 min read",
    publishDate: "November 06, 2026",
    featuredImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Srikanishka Vadakattu",
      role: "Founder & AI Systems Architect, Spyke AI",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    content: {
      tableOfContents: [
        { id: "the-dispatch-bottleneck", title: "The Morning Dispatch Bottleneck" },
        { id: "api-integration-mechanics", title: "How Real-Time Two-Way CRM Sync Actually Works" },
        { id: "data-enrichment", title: "Automated Call Summaries, Audio Links & Tagging" },
        { id: "reducing-double-bookings", title: "Preventing Technician Scheduling Conflicts" },
      ],
      introduction:
        "Collecting after-hours leads is only half the battle. If an answering service sends an email or text summary that sits in an inbox until 8:00 AM, your dispatchers spend their first two critical hours of the morning transcribing notes, calling customers back, and manually building jobs in your field service software.",
      sections: [
        {
          id: "the-dispatch-bottleneck",
          title: "The Morning Dispatch Bottleneck",
          body: [
            "In busy seasons, dispatchers arrive at 7:30 AM to a wall of chaotic voice memos, emails, and scribbled messages. By the time they call Mrs. Johnson back at 8:45 AM to confirm her furnace diagnostic slot, she has often already contacted another company.",
            "By enabling direct API injection, the job is already created, tagged, and assigned in your dispatch board before your morning coffee is brewed.",
          ],
        },
        {
          id: "api-integration-mechanics",
          title: "How Real-Time Two-Way CRM Sync Actually Works",
          body: [
            "Modern AI Voice infrastructure interacts directly with ServiceTitan, Housecall Pro, Jobber, and GoHighLevel through verified REST APIs and webhooks:",
            "1. Real-time Capacity Check: The AI checks available schedule blocks based on ZIP code routing and technician skill tags.",
            "2. Customer Record Lookup: If the phone number matches an existing customer in your database, the AI references their unit history ('I see we serviced your Lennox heat pump last autumn').",
            "3. Immediate Job Creation: Creates a confirmed unassigned or on-call job with customer name, E.164 phone number, equipment problem code, and full audio transcript attached.",
          ],
        },
        {
          id: "data-enrichment",
          title: "Automated Call Summaries, Audio Links & Tagging",
          body: [
            "Technicians hate deciphering vague notes like 'AC broken'. Our AI agent writes structured technical summaries:",
            "- Equipment: Carrier 4-Ton Split System",
            "- Symptom: Fan spinning but blowing warm air, outdoor unit buzzing",
            "- Access Notes: Dog locked in garage, side gate unlocked",
            "- Payment Agreement: Customer authorized $129 diagnostic fee",
          ],
          callout: {
            type: "tip",
            title: "Technician Empowerment",
            text: "Giving technicians exact symptom codes and audio recordings before they arrive on-site increases first-visit fix rates by 34%.",
          },
        },
        {
          id: "reducing-double-bookings",
          title: "Preventing Technician Scheduling Conflicts",
          body: [
            "With atomic calendar locking, the AI temporarily holds the requested 2-hour window during the conversation. Once the customer confirms, the slot is locked into your schedule, eliminating any risk of double-booking across front-desk staff.",
          ],
        },
      ],
      conclusion:
        "Integrating your voice channel directly into your operational dispatch engine transforms customer support from a costly overhead center into an automated revenue-generation machine.",
    },
  },
  {
    slug: "5-critical-questions-hvac-ai-voice-agent-must-answer",
    title: "5 Critical Questions an HVAC AI Voice Agent Must Handle on First Ring",
    excerpt:
      "From diagnosing emergency refrigerant leaks to quoting trip fees and handling angry homeowners, here is the exact conversational logic needed for 92% call resolution.",
    category: "Implementation",
    readTime: "4 min read",
    publishDate: "November 02, 2026",
    featuredImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Srikanishka Vadakattu",
      role: "Founder & AI Systems Architect, Spyke AI",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    content: {
      tableOfContents: [
        { id: "question-1-availability", title: "1. 'How quickly can someone get out here?'" },
        { id: "question-2-pricing", title: "2. 'How much is this going to cost me?'" },
        { id: "question-3-brands", title: "3. 'Do you work on my specific unit?'" },
        { id: "question-4-warranty", title: "4. 'Is this repair covered under my warranty?'" },
        { id: "question-5-frustrated-callers", title: "5. Handling Frustrated & Angry Customers" },
      ],
      introduction:
        "Building an AI voice agent for general business reception is simple. Building one that understands HVAC terminology, manages anxious homeowners, and quotes technical diagnostic policies requires rigorous industry-specific tuning. Here are the 5 core conversational challenges your voice agent must conquer.",
      sections: [
        {
          id: "question-1-availability",
          title: "1. 'How quickly can someone get out here?'",
          body: [
            "Homeowners in extreme weather want immediate timeframes. A weak agent says 'Someone will call you back.' A high-performance agent checks capacity: 'We have emergency technician availability in your neighborhood between 7:00 PM and 9:00 PM tonight, or first thing tomorrow at 8:00 AM. Which works best for you?'",
          ],
        },
        {
          id: "question-2-pricing",
          title: "2. 'How much is this going to cost me?'",
          body: [
            "Contractors cannot quote complex repair jobs over the phone without inspection. The AI must confidently anchor on the diagnostic trip fee while reassuring the caller: 'Our standard diagnostic fee is $99, which covers our licensed technician inspecting the entire system, running electrical diagnostics, and providing an upfront flat-rate repair quote before any work begins.'",
          ],
        },
        {
          id: "question-3-brands",
          title: "3. 'Do you work on my specific unit?'",
          body: [
            "Whether the customer has a Trane, Lennox, Rheem, Goodman, Mitsubishi ductless mini-split, or geothermal heat pump, the AI must instantly recognize brand acronyms and confirm technician certification.",
          ],
        },
        {
          id: "question-4-warranty",
          title: "4. 'Is this repair covered under my warranty?'",
          body: [
            "Callers frequently ask about manufacturer 10-year parts warranties or company labor warranties. The AI collects the unit age and serial details without making premature guarantees, setting realistic expectations while retaining the service booking.",
          ],
        },
        {
          id: "question-5-frustrated-callers",
          title: "5. Handling Frustrated & Angry Customers",
          body: [
            "When dealing with repeat service visits or high summer heat, caller tempers flare. The AI voice agent utilizes calm vocal acoustics, active listening confirmations ('I completely understand how frustrating that is, let's prioritize getting this resolved'), and automatic escalation routing if customer sentiment score drops below threshold.",
          ],
        },
      ],
      conclusion:
        "When an AI voice agent is programmed with genuine trades expertise, homeowners don't feel like they are talking to a robot—they feel like they are speaking to the most attentive dispatcher in town.",
    },
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllCategories(): string[] {
  return ["All", "Cost & Economics", "Dispatch & Operations", "CRM & Infrastructure", "Implementation"];
}
