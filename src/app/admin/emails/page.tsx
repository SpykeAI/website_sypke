"use client";

import React, { useState, useEffect, useMemo } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  Mail,
  Send,
  History,
  BarChart3,
  CheckCircle2,
  Clock,
  Eye,
  MessageSquare,
  AlertTriangle,
  Search,
  Plus,
  Trash2,
  CheckCheck,
  TrendingUp,
  Inbox,
  X,
  Download,
  RotateCcw,
  Loader2,
  Bookmark,
  FileText,
  Save,
  Check
} from "lucide-react";

interface SavedDraft {
  id: string;
  name: string;
  recipientEmail: string;
  subject: string;
  body: string;
  savedAt: string;
}

interface EmailLog {
  id: string;
  campaignTitle: string;
  subject: string;
  recipientName: string;
  recipientEmail: string;
  segment: string;
  sentAt: string;
  status: "delivered" | "opened" | "replied" | "bounced";
  openCount: number;
  replyText?: string;
  bodySnippet: string;
  fullBody?: string;
  messageId?: string;
}

const INITIAL_SAVED_DRAFTS: SavedDraft[] = [
  {
    id: "draft-1",
    name: "Customer AC Service Follow-up",
    recipientEmail: "marcus.v@gmail.com",
    subject: "Fast AC Repair for your Dallas Home - Spyke HVAC",
    body: `Hi Marcus,

Thank you for reaching out regarding your HVAC service inquiry!

Our certified technicians are available to visit your home tomorrow. We can inspect your cooling unit and make sure everything is running smoothly.

Would you prefer a morning or afternoon visit?

Best regards,
Spyke HVAC Team
+1 (346) 477-0028`,
    savedAt: "Today, 04:15 PM"
  },
  {
    id: "draft-2",
    name: "Seasonal Tune-Up Reminder",
    recipientEmail: "sarah.jenkins@outlook.com",
    subject: "Special $49 HVAC Safety Tune-Up this week",
    body: `Hi Sarah,

Did you know that regular seasonal tune-ups reduce your power bill and prevent unexpected breakdowns during summer?

We are currently offering our full 21-point HVAC safety check for $49 this week.

Reply directly to this email to book your preferred time slot!

Warmly,
Spyke Support`,
    savedAt: "Yesterday, 02:30 PM"
  }
];

const INITIAL_LOGS: EmailLog[] = [
  {
    id: "log-1",
    campaignTitle: "Customer AC Service Follow-up",
    subject: "Fast AC Repair for your Dallas Home - Spyke HVAC",
    recipientName: "Marcus Vance",
    recipientEmail: "marcus.v@gmail.com",
    segment: "Direct Send",
    sentAt: "Today, 04:30 PM",
    status: "replied",
    openCount: 3,
    replyText: "Yes please, could you send someone tomorrow morning around 10 AM? Our AC is still blowing warm air.",
    bodySnippet: "Hi Marcus, thank you for reaching out regarding your HVAC unit. Our technicians are currently servicing the Dallas area and can be on-site quickly..."
  },
  {
    id: "log-2",
    campaignTitle: "Seasonal Tune-Up Reminder",
    subject: "Is your AC ready for the heatwave? Get $30 off inspection",
    recipientName: "Sarah Jenkins",
    recipientEmail: "sjenkins.design@outlook.com",
    segment: "Direct Send",
    sentAt: "Today, 02:15 PM",
    status: "opened",
    openCount: 2,
    bodySnippet: "Hi Sarah, regular seasonal tune-ups reduce your power bill by up to 20% and avoid costly unexpected breakdowns during peak summer..."
  },
  {
    id: "log-3",
    campaignTitle: "Technician Dispatch Notice",
    subject: "Confirmed: HVAC Technician Scheduled for Oct 21",
    recipientName: "David Miller",
    recipientEmail: "david.miller@texashomes.org",
    segment: "Direct Send",
    sentAt: "Today, 11:45 AM",
    status: "delivered",
    openCount: 1,
    bodySnippet: "Hi David, your HVAC inspection appointment is confirmed for Tuesday at 2:00 PM Central Time. Our technician Alex will arrive with all diagnostic tools..."
  },
  {
    id: "log-4",
    campaignTitle: "Emergency Follow-up",
    subject: "Fast AC Repair for your Dallas Home - Spyke HVAC",
    recipientName: "Elena Rostova",
    recipientEmail: "elena.r@austintech.io",
    segment: "Direct Send",
    sentAt: "Yesterday, 05:20 PM",
    status: "opened",
    openCount: 4,
    bodySnippet: "Hi Elena, thank you for contacting our emergency dispatch. Our tech team is on standby in Austin and can arrive within our 1-hour window..."
  },
  {
    id: "log-5",
    campaignTitle: "Direct Outreach",
    subject: "Fast AC Repair for your Dallas Home - Spyke HVAC",
    recipientName: "Carlos Mendez",
    recipientEmail: "carlos.m@houstonfreight.com",
    segment: "Direct Send",
    sentAt: "Yesterday, 03:10 PM",
    status: "replied",
    openCount: 2,
    replyText: "Booking for 2 PM works. Gate code is 8842.",
    bodySnippet: "Hi Carlos, our HVAC certified dispatchers received your service inquiry. We have units near your area ready for same-day inspection..."
  },
  {
    id: "log-6",
    campaignTitle: "Promo Announcement",
    subject: "Is your AC ready for the heatwave? Get $30 off inspection",
    recipientName: "Barbara Hayes",
    recipientEmail: "barbara.h@gmail.com",
    segment: "Direct Send",
    sentAt: "Oct 17, 10:00 AM",
    status: "bounced",
    openCount: 0,
    bodySnippet: "Hi Barbara, keep your AC cooling efficiently with our complete condenser coil clean, refrigerant check, and electrical safety inspection..."
  }
];

export default function EmailCampaignsPage() {
  // Tab state: "create" (default) | "history" | "analytics"
  const [activeTab, setActiveTab] = useState<"create" | "history" | "analytics">("create");

  // BASIC EDITOR STATE
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [draftName, setDraftName] = useState("");
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);

  // SAVED VERSIONS (SIDEBAR)
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>(INITIAL_SAVED_DRAFTS);

  // SEND & NOTIFICATION STATE
  const [sending, setSending] = useState(false);
  const [draftSavedToast, setDraftSavedToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", description: "" });

  // HISTORY & ANALYTICS STATE
  const [logs, setLogs] = useState<EmailLog[]>(INITIAL_LOGS);
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>("all");
  const [selectedPreviewLog, setSelectedPreviewLog] = useState<EmailLog | null>(null);

  // Load saved drafts and logs from localStorage on mount
  useEffect(() => {
    try {
      const savedDraftsRaw = localStorage.getItem("spyke_saved_email_drafts_v1");
      if (savedDraftsRaw) {
        const parsedDrafts = JSON.parse(savedDraftsRaw);
        if (Array.isArray(parsedDrafts) && parsedDrafts.length > 0) {
          setSavedDrafts(parsedDrafts);
        }
      }

      const savedLogsRaw = localStorage.getItem("spyke_email_campaign_logs_v3");
      if (savedLogsRaw) {
        const parsedLogs = JSON.parse(savedLogsRaw);
        if (Array.isArray(parsedLogs) && parsedLogs.length > 0) {
          setLogs(parsedLogs);
        }
      }
    } catch (e) {
      console.error("Failed to load local storage data", e);
    }
  }, []);

  // Save logs helper
  const saveLogs = (newLogs: EmailLog[]) => {
    setLogs(newLogs);
    try {
      localStorage.setItem("spyke_email_campaign_logs_v3", JSON.stringify(newLogs));
    } catch (e) {
      console.error(e);
    }
  };

  // Save drafts helper
  const persistDrafts = (drafts: SavedDraft[]) => {
    setSavedDrafts(drafts);
    try {
      localStorage.setItem("spyke_saved_email_drafts_v1", JSON.stringify(drafts));
    } catch (e) {
      console.error(e);
    }
  };

  // 1. SAVE DRAFT
  const handleSaveDraft = () => {
    const finalName = draftName.trim() || `Draft - ${subject.trim() || "Untitled"}`;
    if (!finalName && !emailBody.trim()) {
      alert("Please write something or enter a draft name to save.");
      return;
    }

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const existingIndex = savedDrafts.findIndex((d) => d.id === selectedDraftId);

    let updatedDrafts: SavedDraft[];
    if (existingIndex >= 0) {
      // Update existing draft
      updatedDrafts = [...savedDrafts];
      updatedDrafts[existingIndex] = {
        ...updatedDrafts[existingIndex],
        name: finalName,
        recipientEmail,
        subject,
        body: emailBody,
        savedAt: `Today, ${now}`
      };
    } else {
      // Create new draft version
      const newDraft: SavedDraft = {
        id: `draft-${Date.now()}`,
        name: finalName,
        recipientEmail,
        subject,
        body: emailBody,
        savedAt: `Today, ${now}`
      };
      updatedDrafts = [newDraft, ...savedDrafts];
      setSelectedDraftId(newDraft.id);
    }

    persistDrafts(updatedDrafts);
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 3000);
  };

  // 2. LOAD SAVED DRAFT
  const handleLoadDraft = (draft: SavedDraft) => {
    setSelectedDraftId(draft.id);
    setDraftName(draft.name);
    setRecipientEmail(draft.recipientEmail || "");
    setSubject(draft.subject);
    setEmailBody(draft.body);
  };

  // 3. START NEW BLANK DRAFT
  const handleNewBlankDraft = () => {
    setSelectedDraftId(null);
    setDraftName("");
    setRecipientEmail("");
    setSubject("");
    setEmailBody("");
  };

  // 4. DELETE SAVED DRAFT
  const handleDeleteDraft = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this saved draft?")) {
      const filtered = savedDrafts.filter((d) => d.id !== id);
      persistDrafts(filtered);
      if (selectedDraftId === id) {
        handleNewBlankDraft();
      }
    }
  };

  // 5. SEND EMAIL TO RECIPIENT
  const handleSendEmail = async () => {
    const targetEmail = recipientEmail.trim();
    if (!targetEmail || !targetEmail.includes("@")) {
      alert("Please enter a valid recipient Email ID to send to.");
      return;
    }
    if (!subject.trim()) {
      alert("Please enter an email subject line.");
      return;
    }
    if (!emailBody.trim()) {
      alert("Please write the email body message.");
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/admin/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "test", // sends directly to targetEmail via verified SMTP
          testEmail: targetEmail,
          fromName: "Spyke AI Dispatch",
          fromEmail: "spykeai2026@gmail.com",
          subject: subject.trim(),
          body: emailBody.trim(),
          preheader: subject.trim(),
        }),
      });

      const data = await res.json();

      if (data.ok) {
        // Create an audit log record in History
        const newLog: EmailLog = {
          id: `log-${Date.now()}`,
          campaignTitle: draftName.trim() || "Direct Outreach",
          subject: subject.trim(),
          recipientName: targetEmail.split("@")[0].replace(/[._-]/g, " "),
          recipientEmail: targetEmail,
          segment: "Direct Send",
          sentAt: "Just now",
          status: "delivered",
          openCount: 0,
          bodySnippet: emailBody.trim().slice(0, 140) + "...",
          fullBody: emailBody.trim(),
          messageId: data.messageId,
        };

        saveLogs([newLog, ...logs]);

        setToastMessage({
          title: "Email Delivered Successfully!",
          description: `Sent directly to ${targetEmail} via SMTP. Logged in History.`,
        });
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 4500);
      } else {
        alert(`Failed to send email: ${data.error || "Unknown server response"}`);
      }
    } catch (err: any) {
      console.error("Email send error:", err);
      alert(`Network error sending email: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  // HISTORY FILTERS
  const filteredLogs = logs.filter((l) => {
    const matchSearch =
      l.subject.toLowerCase().includes(historySearch.toLowerCase()) ||
      l.recipientName.toLowerCase().includes(historySearch.toLowerCase()) ||
      l.recipientEmail.toLowerCase().includes(historySearch.toLowerCase()) ||
      l.campaignTitle.toLowerCase().includes(historySearch.toLowerCase());
    const matchStatus = historyStatusFilter === "all" || l.status === historyStatusFilter;
    return matchSearch && matchStatus;
  });

  // Export history to CSV
  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ["ID", "Campaign", "Subject", "Recipient Name", "Recipient Email", "Sent At", "Status", "Opens"];
    const rows = logs.map((l) => [
      l.id,
      `"${l.campaignTitle.replace(/"/g, '""')}"`,
      `"${l.subject.replace(/"/g, '""')}"`,
      `"${l.recipientName.replace(/"/g, '""')}"`,
      l.recipientEmail,
      l.sentAt,
      l.status,
      l.openCount
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `spyke_email_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete single log
  const handleDeleteLog = (id: string) => {
    const updated = logs.filter((l) => l.id !== id);
    saveLogs(updated);
  };

  // Reset history logs
  const handleResetLogs = () => {
    if (confirm("Reset audit history to sample logs?")) {
      saveLogs(INITIAL_LOGS);
    }
  };

  // DYNAMIC ANALYTICS
  const totalSent = logs.length;
  const deliveredCount = logs.filter((l) => l.status === "delivered" || l.status === "opened" || l.status === "replied").length;
  const openedCount = logs.filter((l) => l.status === "opened" || l.status === "replied").length;
  const repliedCount = logs.filter((l) => l.status === "replied").length;

  const deliveredRate = totalSent > 0 ? ((deliveredCount / totalSent) * 100).toFixed(1) : "0.0";
  const openRate = deliveredCount > 0 ? ((openedCount / deliveredCount) * 100).toFixed(1) : "0.0";
  const replyRate = openedCount > 0 ? ((repliedCount / openedCount) * 100).toFixed(1) : "0.0";

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans antialiased overflow-hidden">
      {/* VERTICAL NAVBAR */}
      <AdminSidebar active="emails" />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col bg-slate-50/60 pb-20 md:pb-6">
        
        {/* TOP HEADER & TABS BAR */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
          <div className="max-w-7xl mx-auto space-y-3">
            
            {/* Top Row: Heading */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Email Campaigns
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Live Engine
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium hidden sm:block">
                    Simple text editor with saved draft versions, direct sending, and delivery history.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row: In Between (Centered), Big & Highlighted Tabs */}
            <div className="flex justify-center pt-1 pb-0.5">
              <div className="inline-flex items-center p-1.5 bg-slate-100/95 border-2 border-slate-200/90 rounded-2xl shadow-sm gap-2 w-full sm:w-auto justify-center">
                
                {/* Create Emails Tab */}
                <button
                  onClick={() => setActiveTab("create")}
                  className={`px-7 py-3 rounded-xl text-sm font-black transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer ${
                    activeTab === "create"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500 scale-[1.02]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                  }`}
                >
                  <Plus size={18} className={activeTab === "create" ? "text-white" : "text-emerald-600"} />
                  <span className="tracking-tight">Create Emails</span>
                </button>

                {/* History Tab */}
                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-7 py-3 rounded-xl text-sm font-black transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer ${
                    activeTab === "history"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500 scale-[1.02]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                  }`}
                >
                  <History size={18} className={activeTab === "history" ? "text-white" : "text-emerald-600"} />
                  <span className="tracking-tight">History</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-black ml-1 transition-colors ${
                      activeTab === "history"
                        ? "bg-white text-emerald-800 shadow-2xs"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {logs.length}
                  </span>
                </button>

                {/* Analytics Tab */}
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`px-7 py-3 rounded-xl text-sm font-black transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer ${
                    activeTab === "analytics"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500 scale-[1.02]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                  }`}
                >
                  <BarChart3 size={18} className={activeTab === "analytics" ? "text-white" : "text-emerald-600"} />
                  <span className="tracking-tight">Analytics</span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full inline-block ${
                      activeTab === "analytics" ? "bg-white animate-pulse" : "bg-emerald-500"
                    }`}
                  ></span>
                </button>

              </div>
            </div>

          </div>
        </header>

        {/* NOTIFICATION TOAST: SENT SUCCESS */}
        {showSuccessToast && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top duration-200 max-w-md">
            <CheckCheck size={20} className="text-white shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-extrabold">{toastMessage.title}</p>
              <p className="text-[11px] text-emerald-100">{toastMessage.description}</p>
            </div>
            <button onClick={() => setShowSuccessToast(false)} className="hover:opacity-80 cursor-pointer">
              <X size={16} />
            </button>
          </div>
        )}

        {/* NOTIFICATION TOAST: DRAFT SAVED */}
        {draftSavedToast && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
            <Check size={16} className="text-emerald-400" />
            <p className="text-xs font-bold">Draft saved in side history!</p>
          </div>
        )}

        {/* TAB 1: CREATE EMAILS (VERY BASIC EDITOR + SIDE SAVED VERSIONS) */}
        {activeTab === "create" && (
          <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT: CLEAN TEXT EDITOR & SEND CONTROLS (8 COLS) */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                
                {/* To: Recipient Email */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    To (Recipient Email ID)
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter email to send to (e.g. client@gmail.com)"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none transition shadow-2xs placeholder:text-slate-400"
                  />
                </div>

                {/* Subject Line */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Update regarding your HVAC service appointment"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none transition shadow-2xs placeholder:text-slate-400"
                  />
                </div>

                {/* Text Editor Body */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      Email Message Body
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {emailBody.length} characters
                    </span>
                  </div>
                  <textarea
                    rows={14}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-2xl p-4 text-xs font-normal text-slate-900 focus:outline-none transition leading-relaxed shadow-2xs font-sans placeholder:text-slate-400"
                  />
                </div>

                {/* Draft Name & Action Buttons Row */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Draft Name Input */}
                  <div className="flex-1 max-w-sm">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Give a name to save this draft:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        placeholder="e.g. Follow-up Draft v1"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                        title="Save this draft to sidebar"
                      >
                        <Save size={13} className="text-slate-600" />
                        <span>Save Draft</span>
                      </button>
                    </div>
                  </div>

                  {/* Send Email Now Button */}
                  <div className="self-end sm:self-center">
                    <button
                      type="button"
                      onClick={handleSendEmail}
                      disabled={sending}
                      className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {sending ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-white" />
                          <span>Sending via SMTP...</span>
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          <span>Send Email</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>

              {/* RIGHT: SAVED VERSIONS HISTORY SIDEBAR (4 COLS) */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bookmark size={16} className="text-emerald-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Saved Drafts & Versions
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleNewBlankDraft}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                    title="Clear editor to start fresh"
                  >
                    <Plus size={11} />
                    <span>+ New Draft</span>
                  </button>
                </div>

                {/* Drafts List */}
                <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
                  {savedDrafts.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <FileText size={28} className="mx-auto mb-2 text-slate-300" />
                      <p className="text-xs font-bold text-slate-500">No saved drafts yet.</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Type an email, enter a name, and click "Save Draft".
                      </p>
                    </div>
                  ) : (
                    savedDrafts.map((draft) => {
                      const isSelected = selectedDraftId === draft.id;
                      return (
                        <div
                          key={draft.id}
                          onClick={() => handleLoadDraft(draft)}
                          className={`p-3.5 rounded-2xl border transition text-left cursor-pointer group ${
                            isSelected
                              ? "bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500/30"
                              : "bg-slate-50/70 hover:bg-slate-100/80 border-slate-200/90"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-black text-slate-900 group-hover:text-emerald-700 truncate max-w-[190px]">
                              {draft.name}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteDraft(draft.id, e)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition"
                              title="Delete draft"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {draft.subject && (
                            <p className="text-[11px] font-semibold text-slate-600 truncate mb-1">
                              {draft.subject}
                            </p>
                          )}

                          <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                            {draft.body || "Empty body"}
                          </p>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50 text-[10px] text-slate-400">
                            <span>{draft.savedAt}</span>
                            <span className="text-emerald-600 font-bold group-hover:underline">
                              {isSelected ? "Active in Editor" : "Click to load →"}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 2: HISTORY */}
        {activeTab === "history" && (
          <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* History Filter Bar */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search by recipient, subject, or draft name..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none transition shadow-2xs"
                />
              </div>

              {/* Status Filter Tabs & Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl shadow-2xs text-xs font-bold">
                  {["all", "replied", "opened", "delivered", "bounced"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setHistoryStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg capitalize transition cursor-pointer ${
                        historyStatusFilter === st
                          ? "bg-white text-emerald-700 shadow-2xs font-extrabold"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Export audit log to CSV"
                >
                  <Download size={13} className="text-slate-600" />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetLogs}
                  className="p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition cursor-pointer shadow-2xs"
                  title="Reset history to sample logs"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

            </div>

            {/* History Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-5">Campaign / Draft Name</th>
                      <th className="py-3.5 px-4">Subject</th>
                      <th className="py-3.5 px-4">Recipient</th>
                      <th className="py-3.5 px-4">Sent At</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <Inbox size={32} className="mx-auto mb-2 text-slate-300" />
                          <p className="font-bold">No email logs found matching criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => {
                        return (
                          <tr key={log.id} className="hover:bg-slate-50/80 transition group">
                            <td className="py-3.5 px-5 font-bold text-slate-900">
                              {log.campaignTitle}
                            </td>

                            <td className="py-3.5 px-4 max-w-[260px] truncate text-slate-800 font-medium">
                              {log.subject}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="truncate max-w-[200px]">
                                <p className="font-bold text-slate-800">{log.recipientName}</p>
                                <p className="text-[10px] text-slate-400">{log.recipientEmail}</p>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-medium">
                              <div className="flex items-center gap-1.5">
                                <Clock size={12} className="text-slate-400" />
                                <span>{log.sentAt}</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {log.status === "replied" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
                                  <MessageSquare size={11} className="text-purple-600" />
                                  <span>Replied</span>
                                </span>
                              )}
                              {log.status === "opened" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                  <Eye size={11} className="text-blue-600" />
                                  <span>Opened ({log.openCount}x)</span>
                                </span>
                              )}
                              {log.status === "delivered" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 size={11} className="text-emerald-600" />
                                  <span>Delivered</span>
                                </span>
                              )}
                              {log.status === "bounced" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                  <AlertTriangle size={11} className="text-rose-600" />
                                  <span>Bounced</span>
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedPreviewLog(log)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye size={12} />
                                  <span>View</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLog(log.id)}
                                  className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                  title="Delete log entry"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Top 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Sent */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Sent
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <Send size={15} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">{totalSent}</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp size={12} />
                    <span>Live Audit</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Across all sends</p>
              </div>

              {/* Delivered */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Delivered
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCheck size={15} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">{deliveredCount}</span>
                  <span className="text-xs font-bold text-emerald-600">{deliveredRate}% rate</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Successful SMTP inbox receipts</p>
              </div>

              {/* Opened */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Opened
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Eye size={15} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">{openedCount}</span>
                  <span className="text-xs font-bold text-blue-600">{openRate}% of delivered</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Unique opens registered</p>
              </div>

              {/* Replied */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Replied (Leads)
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <MessageSquare size={15} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">{repliedCount}</span>
                  <span className="text-xs font-bold text-purple-600">{replyRate}% hot response</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Ready for appointment dispatch</p>
              </div>

            </div>

            {/* Funnel & Conversion Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 size={16} className="text-emerald-600" />
                Live Campaign Conversion Funnel
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">1. Dispatched</span>
                  <p className="text-lg font-black text-slate-900 mt-1">{totalSent}</p>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-slate-800 rounded-full w-full"></div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase">2. Delivered</span>
                  <p className="text-lg font-black text-emerald-950 mt-1">{deliveredCount}</p>
                  <div className="w-full h-1.5 bg-emerald-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${deliveredRate}%` }}></div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <span className="text-[11px] font-bold text-blue-600 uppercase">3. Opened</span>
                  <p className="text-lg font-black text-blue-950 mt-1">{openedCount}</p>
                  <div className="w-full h-1.5 bg-blue-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${openRate}%` }}></div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                  <span className="text-[11px] font-bold text-purple-600 uppercase">4. Replied</span>
                  <p className="text-lg font-black text-purple-950 mt-1">{repliedCount}</p>
                  <div className="w-full h-1.5 bg-purple-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${replyRate}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL: VIEW DETAILED EMAIL PREVIEW FROM HISTORY */}
      {selectedPreviewLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Email Delivery Details</h3>
              </div>
              <button
                onClick={() => setSelectedPreviewLog(null)}
                className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Meta Grid */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Campaign / Draft:</span>
                  <span className="font-semibold text-slate-700">{selectedPreviewLog.campaignTitle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Subject:</span>
                  <span className="font-bold text-slate-900">{selectedPreviewLog.subject}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Recipient:</span>
                  <span className="font-bold text-slate-900">{selectedPreviewLog.recipientName} ({selectedPreviewLog.recipientEmail})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="font-medium text-slate-600">{selectedPreviewLog.sentAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Delivery Status:</span>
                  <span className="font-bold capitalize text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {selectedPreviewLog.status} ({selectedPreviewLog.openCount} opens)
                  </span>
                </div>
                {selectedPreviewLog.messageId && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">SMTP Message ID:</span>
                    <span className="font-mono text-[10px] text-slate-600 truncate max-w-[320px]">{selectedPreviewLog.messageId}</span>
                  </div>
                )}
              </div>

              {/* If Replied, show customer response */}
              {selectedPreviewLog.replyText && (
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 mb-1">
                    <MessageSquare size={13} className="text-purple-600" />
                    <span>Customer Reply Received:</span>
                  </div>
                  <p className="text-xs text-purple-950 font-medium leading-relaxed italic">
                    "{selectedPreviewLog.replyText}"
                  </p>
                </div>
              )}

              {/* Message Body */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-white">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  Rendered Email Body
                </h4>
                <div className="text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                  {selectedPreviewLog.fullBody || selectedPreviewLog.bodySnippet}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedPreviewLog(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
