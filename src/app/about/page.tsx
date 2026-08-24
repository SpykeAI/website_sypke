import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Spyke AI Technologies",
  description: "Turning AI Into Real Business Outcomes",
};

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto prose prose-lg prose-green">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
          About Us – Spyke AI Technologies
        </h1>
        <h2 className="text-2xl font-bold text-[#00DF81] mt-0 mb-8">Turning AI Into Real Business Outcomes</h2>
        
        <div className="space-y-6 text-gray-700 leading-relaxed font-medium">
          <p>
            AI is no longer just a technology advantage. It's becoming a new way of running a business.
          </p>
          <p>
            At Spyke AI Technologies, we help businesses turn AI from an experiment into something they actually use.
          </p>
          <p>
            From AI Voice Agents and Chatbots to business automations, AI agents, CRM integrations, and AI-powered workflows, we design and implement practical AI solutions that help businesses save time, respond faster, operate more efficiently, and scale without simply adding more people.
          </p>
          <p className="font-bold text-gray-900">
            We don't just talk about what AI can do. We build it, integrate it, and put it to work.
          </p>

          <h3 className="text-3xl font-bold text-gray-900 mt-12 mb-6 font-heading">Our Story</h3>
          <p>Spyke AI Technologies was founded on a simple observation:</p>
          <p>
            AI is moving incredibly fast. Yet most businesses struggle to turn that technology into something useful for their day-to-day operations.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>There are thousands of AI tools available today.</li>
            <li>New models are released every week.</li>
            <li>New automation platforms appear constantly.</li>
            <li>AI agents are becoming more capable every day.</li>
          </ul>
          <p>Yet for a business owner, the real question isn't:</p>
          <blockquote className="border-l-4 border-[#00DF81] pl-4 italic bg-green-50 py-3 px-4 rounded-r-lg my-4 text-gray-800">
            "Which AI tool should I use?"
          </blockquote>
          <p>It's:</p>
          <blockquote className="border-l-4 border-[#00DF81] pl-4 italic bg-green-50 py-3 px-4 rounded-r-lg my-4 text-gray-800">
            "How can AI actually help my business?"
          </blockquote>
          <p>
            That gap between AI capability and practical business implementation is where SpykeAI comes in.
          </p>
          <p>
            Spyke AI Technologies was created to help businesses identify where AI can create real value, design the right solution, integrate it into their existing systems, and continuously improve it as the technology evolves.
          </p>

          <h3 className="text-3xl font-bold text-gray-900 mt-12 mb-6 font-heading">Built by a Product Leader</h3>
          <p>
            SpykeAI was founded by Srikanishka Vadakattu (Sri - <a href="https://www.linkedin.com/in/srikanishka/" target="_blank" className="text-[#00DF81] hover:underline">LinkedIn</a>), a product management leader with 13+ years of experience building and scaling digital products and businesses across startups and technology companies.
          </p>
          <p>
            Over the years, Sri has worked across companies and industries including Paytm, Ola, OYO and other technology startups, building products from the ground up, developing product strategies, scaling teams, and solving complex business problems through technology.
          </p>
          <p>That product background shapes how we approach AI.</p>
          <p>We don't start with:</p>
          <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-4">
            "Here's a cool AI tool. Let's find something to do with it."
          </blockquote>
          <p>We start with:</p>
          <blockquote className="border-l-4 border-[#00DF81] pl-4 italic bg-green-50 py-3 px-4 rounded-r-lg my-4 text-gray-800 font-bold">
            "What problem are we trying to solve, and where can AI create the most leverage?"
          </blockquote>
          <p>Then we work backwards to build the solution.</p>

          <h3 className="text-3xl font-bold text-gray-900 mt-12 mb-6 font-heading">Our Mission</h3>
          <h4 className="text-xl font-bold text-[#00DF81] mb-4">Make AI Practical for Every Business</h4>
          <p>Our mission is simple:</p>
          <p>
            To help businesses use AI to automate repetitive work, improve customer experiences, increase operational efficiency, and unlock new ways of growing their business.
          </p>
          <p>
            We believe AI shouldn't be limited to large technology companies with massive engineering teams.
          </p>
          <p>
            A growing business should be able to use AI Voice Agents, intelligent automations, AI assistants, and AI-powered workflows without having to become an AI research company itself.
          </p>
          <p>That's what we're building toward.</p>

          <h3 className="text-3xl font-bold text-gray-900 mt-12 mb-6 font-heading">What We Do</h3>
          <p>SpykeAI provides AI-powered services and implementation solutions for businesses.</p>
          
          <div className="space-y-6 mt-6">
            <div>
              <h4 className="text-xl font-bold text-gray-900">AI Voice Agents</h4>
              <p>AI-powered voice agents that can handle conversations, qualify leads, answer questions, schedule appointments, follow up with prospects, and perform other voice-based workflows.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">AI Chatbots</h4>
              <p>Intelligent conversational systems for websites, WhatsApp, customer support, lead qualification, sales, and other business use cases.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">Business Automations</h4>
              <p>We connect your existing tools and systems to automate repetitive processes across sales, marketing, operations, customer support, and other functions.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">AI Agents</h4>
              <p>AI-powered agents designed to perform multi-step tasks, interact with business systems, retrieve information, make decisions within defined workflows, and take actions on behalf of the business.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">CRM & System Integrations</h4>
              <p>We connect AI systems with CRMs, calendars, communication platforms, databases, websites, and other business tools so AI becomes part of the existing workflow rather than another disconnected tool.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">AI-Powered Content & Creative Services</h4>
              <p>We use AI to help businesses create images, videos, audio, copy, and other content more efficiently.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">Custom AI Solutions</h4>
              <p>Every business is different. Where an off-the-shelf solution isn't enough, we design and implement custom AI workflows and systems around the specific requirements of the business.</p>
            </div>
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mt-12 mb-6 font-heading">Our Approach</h3>
          <p>We believe successful AI implementation is less about the technology and more about solving the right problem.</p>
          <p>Our approach is simple:</p>
          
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>1. Understand</strong>
              <p className="mt-1">We first understand the business, its existing processes, bottlenecks, systems, and goals.</p>
            </li>
            <li>
              <strong>2. Identify</strong>
              <p className="mt-1">We identify where AI and automation can create meaningful leverage. Not every process needs AI. We focus on the ones where it can actually make a difference.</p>
            </li>
            <li>
              <strong>3. Design</strong>
              <p className="mt-1">We design the workflow, AI agent, automation, integration, or solution around the business requirement.</p>
            </li>
            <li>
              <strong>4. Build</strong>
              <p className="mt-1">We implement the solution and connect it with the tools and systems the business already uses.</p>
            </li>
            <li>
              <strong>5. Launch</strong>
              <p className="mt-1">We test the system, refine the workflows, and put it into production.</p>
            </li>
            <li>
              <strong>6. Improve</strong>
              <p className="mt-1">AI is evolving rapidly. We continuously look for opportunities to improve the system as better models, tools, and capabilities become available.</p>
            </li>
          </ol>

          <h3 className="text-3xl font-bold text-gray-900 mt-12 mb-6 font-heading">Why SpykeAI?</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-bold text-gray-900">We Start With the Business Problem</h4>
              <p>We don't believe in adding AI simply because AI is fashionable. We first identify the problem and then determine whether AI is the right solution.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">Product Thinking, Not Just Tool Integration</h4>
              <p>Our product background means we think beyond connecting APIs. We look at the complete experience, workflow, user journey, business logic, edge cases, and measurable outcomes.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">Practical AI</h4>
              <p>We focus on solutions that can actually be deployed and used by businesses today.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">Built Around Your Existing Stack</h4>
              <p>Your business already has tools, systems, CRMs, communication channels, and processes. Where possible, we integrate AI into that existing ecosystem rather than forcing you to replace everything.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">Human + AI</h4>
              <p>We don't believe every business process should become fully autonomous. The right balance between AI automation and human oversight depends on the use case.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">Technology That Keeps Evolving</h4>
              <p>AI will continue to change rapidly. Our approach is designed to evolve with it rather than lock businesses into a single model or technology.</p>
            </div>
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mt-12 mb-6 font-heading">Who We Work With</h3>
          <p>We work with businesses that want to use AI to improve the way they operate and grow.</p>
          <p>Our solutions can be applied across industries including:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
            <ul className="list-disc pl-6 space-y-2">
              <li>Real Estate</li>
              <li>Healthcare and Clinics</li>
              <li>E-commerce and D2C</li>
              <li>Recruitment</li>
            </ul>
            <ul className="list-disc pl-6 space-y-2">
              <li>Professional Services</li>
              <li>Financial Services</li>
              <li>Travel</li>
              <li>Education</li>
            </ul>
            <ul className="list-disc pl-6 space-y-2">
              <li>Digital Agencies</li>
              <li>Home Services</li>
              <li>Startups</li>
              <li>SMBs</li>
            </ul>
          </div>
          <p>If a business has repetitive processes, large volumes of customer interactions, manual workflows, or disconnected systems, there is often an opportunity for AI to help.</p>

          <h3 className="text-3xl font-bold text-gray-900 mt-12 mb-6 font-heading">Our Vision</h3>
          <p>We believe the next generation of businesses will not simply use AI tools.</p>
          <p className="font-bold text-gray-900 text-xl">They will be AI-powered businesses.</p>
          <ul className="list-disc pl-6 space-y-2 my-4">
            <li>Sales teams will have AI assistants.</li>
            <li>Customer support will be augmented by AI.</li>
            <li>Marketing workflows will run with far less manual effort.</li>
            <li>Operations will become increasingly automated.</li>
            <li>And businesses will have AI agents working alongside their teams.</li>
          </ul>
          <p>Our vision is to help make that transition practical and accessible.</p>
          <p>We want to become the AI implementation partner businesses turn to when they know AI can transform their business, but don't know where to start.</p>

          <h3 className="text-3xl font-bold text-gray-900 mt-12 mb-6 font-heading">The Future We're Building</h3>
          <p>The AI landscape will continue to change.</p>
          <p>Today's best model may not be tomorrow's best model.<br/>Today's workflow may be automated differently six months from now.<br/>That's okay.</p>
          <p>We don't believe businesses should build their future around one AI model, one tool, or one trend.</p>
          <p>We believe they should build around better business processes and use the best technology available to improve them.</p>
          <p>That's the philosophy behind SpykeAI.</p>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center my-8">
            <p className="text-2xl font-bold text-[#00DF81] mb-2 font-heading">
              Find the problem. Find the opportunity.
            </p>
            <p className="text-2xl font-bold text-gray-900 font-heading">
              Build the solution. Put AI to work.
            </p>
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mt-12 mb-6 font-heading">Let's Build Something With AI</h3>
          <p>If you're exploring how AI can improve your business, we'd love to understand what you're working on.</p>
          <p>You don't need to know which AI tool you need. Tell us what you're trying to achieve, and we'll help you figure out where AI can actually make a difference.</p>
          
          <div className="mt-8 mb-12 p-8 bg-green-50 rounded-2xl border border-green-100 flex flex-col items-start space-y-4">
            <a href="http://wa.link/18sxk1" target="_blank" className="bg-[#00DF81] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#00c271] transition">
              Talk to Us on WhatsApp
            </a>
            <div className="text-gray-600 mt-4 text-sm space-y-1">
              <p><strong>Spyke AI Technologies</strong></p>
              <p>AI Services & Automation Company</p>
              <p>Hyderabad, Telangana, India</p>
              <p>Website: <a href="https://spykeai.com" className="text-[#00DF81] hover:underline">https://spykeai.com</a></p>
              <p>Email: contact@spykeai.com</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
