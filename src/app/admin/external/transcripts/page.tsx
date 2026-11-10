import { supabase } from "@/lib/supabase";
import { Mic, Calendar, User, Phone, Mail, Clock, MessageSquare, Globe2 } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function ExternalTranscriptsPage() {
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error:", error.message);
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans antialiased overflow-hidden">
      <AdminSidebar active="ext_transcripts" />

      <div className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
                <Globe2 size={12} />
                <span>External Portal · Client View</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Shared Call Transcripts & Summaries
              </h1>
              <p className="text-slate-500 mt-1 text-xs sm:text-sm">
                Review call recordings, transcripts, and lead details handled by your AI agent.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Calls Logged</h3>
              <p className="text-3xl font-black text-slate-900">{conversations?.length || 0}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Demos & Meetings</h3>
              <p className="text-3xl font-black text-emerald-600">{conversations?.filter(c => c.booked_meeting).length || 0}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">High Intent Inquiries</h3>
              <p className="text-3xl font-black text-blue-600">{conversations?.filter(c => c.interest_level === "High").length || 0}</p>
            </div>
          </div>

          {/* Transcripts List */}
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200/90 overflow-hidden">
            {(!conversations || conversations.length === 0) ? (
              <div className="p-12 text-center text-slate-400">
                <Mic className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-base font-bold text-slate-900">No transcripts recorded yet</p>
                <p className="text-xs text-slate-400 mt-1">When someone interacts with your voice assistant, verified transcripts will populate here in real-time.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {conversations.map((conv) => (
                  <div key={conv.id} className="p-6 hover:bg-slate-50/80 transition">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="lg:w-1/3 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                            <User size={14} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{conv.user_name || "Website Lead"}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(conv.created_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                            </p>
                          </div>
                        </div>

                        {conv.user_phone && (
                          <p className="text-xs text-slate-600 flex items-center gap-2 font-mono">
                            <Phone size={13} className="text-slate-400" />
                            {conv.user_phone}
                          </p>
                        )}

                        {conv.interest_level && (
                          <div className="pt-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Interest Level</span>
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              conv.interest_level === 'High' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              conv.interest_level === 'Medium' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {conv.interest_level}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="lg:w-2/3 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6 space-y-3">
                        {conv.summary && (
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <MessageSquare size={13} className="text-blue-500" />
                              AI Conversation Summary
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                              {conv.summary}
                            </p>
                          </div>
                        )}

                        {conv.transcript ? (
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                              Full Transcript
                            </h4>
                            <div className="max-h-48 overflow-y-auto p-3 bg-slate-50/70 border border-slate-200/60 rounded-xl text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">
                              {conv.transcript}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No raw transcript attached.</p>
                        )}
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
