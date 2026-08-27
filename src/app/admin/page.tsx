import { supabase } from "@/lib/supabase";
import { Mic, Calendar, User, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Disable caching to always show latest conversations

export default async function AdminDashboard() {
  // Fetch all conversations, ordered by newest first
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    // If table doesn't exist yet, we handle it gracefully
    console.error("Supabase Error:", error.message);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-heading flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00DF81]/20 rounded-full flex items-center justify-center">
                <Mic className="w-5 h-5 text-[#00DF81]" />
              </div>
              AI Call Transcripts
            </h1>
            <p className="text-gray-500 mt-2">Monitor all conversations your AI agent has had with customers.</p>
          </div>
          <Link href="/" className="text-sm font-bold text-[#00DF81] hover:underline">
            &larr; Back to Website
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total AI Calls</h3>
            <p className="text-3xl font-bold text-gray-900">{conversations?.length || 0}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Meetings Booked</h3>
            <p className="text-3xl font-bold text-[#00DF81]">{conversations?.filter(c => c.booked_meeting).length || 0}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-1">High Interest Leads</h3>
            <p className="text-3xl font-bold text-blue-600">{conversations?.filter(c => c.interest_level === "High").length || 0}</p>
          </div>
        </div>

        {/* Conversations List */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          {(!conversations || conversations.length === 0) ? (
            <div className="p-12 text-center text-gray-500">
              <Mic className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900">No calls yet</p>
              <p>When someone talks to your AI on the website, the transcript will appear here automatically.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {conversations.map((conv) => (
                <div key={conv.id} className="p-6 hover:bg-gray-50 transition">
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
                      <div className="flex items-center gap-3 text-gray-600 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {conv.phone || "No phone collected"}
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
  );
}
