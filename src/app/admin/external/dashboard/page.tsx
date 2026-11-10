"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  Globe2,
  PhoneCall,
  CalendarCheck,
  TrendingUp,
  Clock,
  Search,
  Download,
  FileText,
  User,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function ExternalDashboardPage() {
  const [search, setSearch] = useState("");

  const kpis = [
    {
      title: "Total AI Calls Handled",
      value: "148",
      subtext: "+18% from last week",
      icon: PhoneCall,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Demos & Callbacks Booked",
      value: "42",
      subtext: "28.3% conversion rate",
      icon: CalendarCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Avg Handling Time",
      value: "2m 18s",
      subtext: "Optimized response cadence",
      icon: Clock,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      title: "Qualification Rate",
      value: "92.4%",
      subtext: "Positive lead intent",
      icon: TrendingUp,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
  ];

  const recentLeads = [
    {
      id: "1",
      customer: "Satish Patil",
      phone: "+91 88667 77770",
      intent: "Commercial Unit Inquiry",
      duration: "3m 12s",
      outcome: "Demo Scheduled",
      outcomeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      date: "Today, 11:30 AM",
    },
    {
      id: "2",
      customer: "Prakash Sharma",
      phone: "+1 (419) 819-0285",
      intent: "Villa Plot Pricing",
      duration: "2m 05s",
      outcome: "Callback Requested",
      outcomeColor: "bg-blue-50 text-blue-700 border-blue-200",
      date: "Yesterday, 08:34 PM",
    },
    {
      id: "3",
      customer: "Navya K.",
      phone: "+1 (617) 842-2956",
      intent: "Payment Plan Details",
      duration: "1m 45s",
      outcome: "Brochure Sent",
      outcomeColor: "bg-purple-50 text-purple-700 border-purple-200",
      date: "Nov 7, 10:33 PM",
    },
    {
      id: "4",
      customer: "Samrat Verma",
      phone: "+1 (224) 659-2790",
      intent: "Site Visit Request",
      duration: "2m 50s",
      outcome: "Demo Scheduled",
      outcomeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      date: "Nov 6, 06:15 PM",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <AdminSidebar active="ext_dashboard" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200/90 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Globe2 size={18} />
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">External Client Portal</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Client View
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live performance dashboard, campaign conversion metrics, and booked client interactions.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/external/transcripts"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <FileText size={15} />
              <span>View Call Transcripts</span>
            </Link>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-3 border border-white/20">
                <Sparkles size={13} className="text-amber-300" />
                <span>AI Voice Assistant Active 24/7</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight">Your Campaign Overview</h2>
              <p className="text-blue-100 text-xs mt-1 leading-relaxed">
                Track inbound calls, user sentiment, and demo bookings in real time. All leads are automatically synced and qualified by SpykeAI agents.
              </p>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{kpi.title}</span>
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center border ${kpi.color}`}>
                      <Icon size={18} />
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-2">{kpi.value}</p>
                  <span className="text-[11px] text-slate-400 font-medium">{kpi.subtext}</span>
                </div>
              );
            })}
          </div>

          {/* Recent Leads Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Inbound Client Interactions</h3>
                <p className="text-[11px] text-slate-400">Calls handled and qualified by the AI voice assistant.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by customer or phone..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-5">Customer</th>
                    <th className="py-3.5 px-5">Inquiry Topic</th>
                    <th className="py-3.5 px-5">Duration</th>
                    <th className="py-3.5 px-5">Outcome</th>
                    <th className="py-3.5 px-5">Timestamp</th>
                    <th className="py-3.5 px-5 text-right">Transcript</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {recentLeads
                    .filter(
                      (lead) =>
                        lead.customer.toLowerCase().includes(search.toLowerCase()) ||
                        lead.phone.includes(search)
                    )
                    .map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-5">
                          <p className="font-bold text-slate-900">{lead.customer}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{lead.phone}</span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-700">{lead.intent}</td>
                        <td className="py-3.5 px-5 text-slate-600">{lead.duration}</td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${lead.outcomeColor}`}>
                            {lead.outcome}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-400 text-[11px]">{lead.date}</td>
                        <td className="py-3.5 px-5 text-right">
                          <Link
                            href="/admin/external/transcripts"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                          >
                            <span>Read</span>
                            <ArrowUpRight size={13} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
