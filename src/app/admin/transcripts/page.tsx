import { supabase } from "@/lib/supabase";
import { Mic, Calendar, User, Phone, Mail, Clock, MessageSquare } from "lucide-react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function AdminTranscriptsPage() {
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error:", error.message);
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 text-slate-800 font-sans antialiased overflow-hidden">
      {/* VERTICAL NAVBAR */}
      <AdminSidebar active="transcripts" />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Mic className="w-5 h-5 text-emerald-600" />
                </div>
                AI Call Transcripts
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Review website voice calls, lead interest levels, and appointment bookings handled by Vapi AI.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5">
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total AI Calls</h3>
              <p className="text-3xl font-bold text-gray-900">{conversations?.length || 0}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5">
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Meetings Booked</h3>
              <p className="text-3xl font-bold text-[#00DF81]">{conversations?.filter(c => c.booked_meeting).length || 0}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5">
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">High Interest Leads</h3>
              <p className="text-3xl font-bold text-blue-600">{conversations?.filter(c => c.interest_level === "High").length || 0}</p>
            </div>
          </div>

          {/* Conversations List */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            {(!conversations || conversations.length === 0) ? (
              <div className="p-12 text-center text-gray-500">
                <Mic className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-900">No calls yet</p>
                <p className="text-sm text-gray-500 mt-1">When someone talks to your AI on the website, the transcript will appear here automatically.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {conversations.map((conv) => (
                  <div key={conv.id} className="p-6 hover:bg-gray-50/80 transition">
                    <div className="flex flex-col lg:flex-row gap-6">
                      
                      {/* Left: Caller Info */}
                      <div className="lg:w-1/3 space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            <Clock className="w-4 h-4" /> 
                            {new Date(conv.created_at).toLocaleString()}
                          </span>
                          {conv.booked_meeting && (
                            <span className="bg-[#00DF81]/10 text-[#00DF81] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Booked
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 text-gray-900 font-medium">
                          <User className="w-4 h-4 text-gray-400" />
                          {conv.contact_name || "Unknown Caller"}
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {conv.email || "No email collected"}
                        </div>
                        <div className="flex items-center justify-between text-gray-600 text-sm">
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{conv.phone || "No phone collected"}</span>
                          </div>
                          {conv.phone && (
                            <div className="flex items-center gap-1.5">
                              <Link
                                href={`/admin/calls?to=${encodeURIComponent(conv.phone)}`}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                                title="Call Lead with Browser Softphone"
                              >
                                <Phone className="w-3 h-3" />
                                <span>Call</span>
                              </Link>
                              <Link
                                href="/inbox"
                                className="p-1 bg-gray-50 hover:bg-emerald-50 text-gray-400 hover:text-emerald-700 border border-gray-200 rounded-lg text-xs transition"
                                title="Text Lead in SMS Inbox"
                              >
                                <MessageSquare className="w-3 h-3" />
                              </Link>
                            </div>
                          )}
                        </div>
                        
                        {conv.interest_level && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <span className="text-xs text-gray-500 font-medium uppercase">Interest Level</span>
                            <p className="font-bold text-gray-900">{conv.interest_level}</p>
                          </div>
                        )}
                      </div>

                      {/* Right: Transcript & Summary */}
                      <div className="lg:w-2/3 bg-gray-50 rounded-2xl p-5 border border-gray-200">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AI Summary</h4>
                        <p className="text-gray-700 mb-6 text-sm">{conv.summary || "No summary available."}</p>

                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Transcript</h4>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-600 h-48 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
                          {conv.transcript || "Transcript processing..."}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
