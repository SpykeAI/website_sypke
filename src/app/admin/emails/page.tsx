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
  Filter,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Users,
  Copy,
  Trash2,
  RefreshCw,
  Smartphone,
  Monitor,
  CheckCheck,
  TrendingUp,
  Inbox,
  UserCheck,
  Calendar,
  Layers,
  Tag,
  Paperclip,
  Check,
  HelpCircle,
  X,
  Download,
  RotateCcw,
  Loader2
} from "lucide-react";

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

interface Recipient {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  address?: string;
}

const INITIAL_LOGS: EmailLog[] = [
  {
    id: "log-1",
    campaignTitle: "HVAC Emergency AC Service Follow-up",
    subject: "Fast AC Repair for your Dallas Home - Spyke HVAC",
    recipientName: "Marcus Vance",
    recipientEmail: "marcus.v@gmail.com",
    segment: "Meta Ad Leads",
    sentAt: "Today, 04:30 PM",
    status: "replied",
    openCount: 3,
    replyText: "Yes please, could you send someone tomorrow morning around 10 AM? Our AC is still blowing warm air.",
    bodySnippet: "Hi Marcus, thank you for reaching out regarding your HVAC unit. Our technicians are currently servicing the Dallas area and can be on-site quickly..."
  },
  {
    id: "log-2",
    campaignTitle: "Seasonal AC Maintenance Tune-Up Promo",
    subject: "Is your AC ready for the heatwave? Get $30 off inspection",
    recipientName: "Sarah Jenkins",
    recipientEmail: "sjenkins.design@outlook.com",
    segment: "Past HVAC Customers",
    sentAt: "Today, 02:15 PM",
    status: "opened",
    openCount: 2,
    bodySnippet: "Hi Sarah, regular seasonal tune-ups reduce your power bill by up to 20% and avoid costly unexpected breakdowns during peak summer..."
  },
  {
    id: "log-3",
    campaignTitle: "Post-Call Booking Confirmation",
    subject: "Confirmed: HVAC Technician Scheduled for Oct 21",
    recipientName: "David Miller",
    recipientEmail: "david.miller@texashomes.org",
    segment: "High-Interest Prospects",
    sentAt: "Today, 11:45 AM",
    status: "delivered",
    openCount: 1,
    bodySnippet: "Hi David, your HVAC inspection appointment is confirmed for Tuesday at 2:00 PM Central Time. Our technician Alex will arrive with all diagnostic tools..."
  },
  {
    id: "log-4",
    campaignTitle: "HVAC Emergency AC Service Follow-up",
    subject: "Fast AC Repair for your Dallas Home - Spyke HVAC",
    recipientName: "Elena Rostova",
    recipientEmail: "elena.r@austintech.io",
    segment: "Meta Ad Leads",
    sentAt: "Yesterday, 05:20 PM",
    status: "opened",
    openCount: 4,
    bodySnippet: "Hi Elena, thank you for contacting our emergency dispatch. Our tech team is on standby in Austin and can arrive within our 1-hour window..."
  },
  {
    id: "log-5",
    campaignTitle: "HVAC Emergency AC Service Follow-up",
    subject: "Fast AC Repair for your Dallas Home - Spyke HVAC",
    recipientName: "Carlos Mendez",
    recipientEmail: "carlos.m@houstonfreight.com",
    segment: "Meta Ad Leads",
    sentAt: "Yesterday, 03:10 PM",
    status: "replied",
    openCount: 2,
    replyText: "Booking for 2 PM works. Gate code is 8842.",
    bodySnippet: "Hi Carlos, our HVAC certified dispatchers received your service inquiry. We have units near your area ready for same-day inspection..."
  },
  {
    id: "log-6",
    campaignTitle: "Seasonal AC Maintenance Tune-Up Promo",
    subject: "Is your AC ready for the heatwave? Get $30 off inspection",
    recipientName: "Barbara Hayes",
    recipientEmail: "barbara.h@gmail.com",
    segment: "Past HVAC Customers",
    sentAt: "Oct 17, 10:00 AM",
    status: "bounced",
    openCount: 0,
    bodySnippet: "Hi Barbara, keep your AC cooling efficiently with our complete condenser coil clean, refrigerant check, and electrical safety inspection..."
  }
];

const AUDIENCE_SEGMENTS: Record<string, { label: string; count: number; defaultRecipients: Recipient[] }> = {
  "Meta Ad Leads": {
    label: "Meta Ad Leads (Texas HVAC Campaigns)",
    count: 142,
    defaultRecipients: [
      { name: "Marcus Vance", email: "marcus.v@gmail.com", city: "Dallas", phone: "+1 (214) 555-0192", address: "1420 Elm St, Dallas, TX" },
      { name: "Elena Rostova", email: "elena.r@austintech.io", city: "Austin", phone: "+1 (512) 555-0143", address: "804 Congress Ave, Austin, TX" },
      { name: "Carlos Mendez", email: "carlos.m@houstonfreight.com", city: "Houston", phone: "+1 (713) 555-0188", address: "3200 Main St, Houston, TX" },
      { name: "Tyler Brooks", email: "tyler.brooks@texasoil.com", city: "Fort Worth", phone: "+1 (817) 555-0112", address: "910 Commerce St, Fort Worth, TX" }
    ]
  },
  "High-Interest Prospects": {
    label: "High-Interest Prospects (Spoke to Voice Agent)",
    count: 88,
    defaultRecipients: [
      { name: "David Miller", email: "david.miller@texashomes.org", city: "San Antonio", phone: "+1 (210) 555-0167", address: "400 Broadway, San Antonio, TX" },
      { name: "Jessica Alvarez", email: "jalvarez@lonestar.net", city: "Dallas", phone: "+1 (214) 555-0134", address: "1200 Ross Ave, Dallas, TX" }
    ]
  },
  "Past HVAC Customers": {
    label: "Past HVAC Customers (Seasonal Maintenance)",
    count: 310,
    defaultRecipients: [
      { name: "Sarah Jenkins", email: "sjenkins.design@outlook.com", city: "Plano", phone: "+1 (972) 555-0176", address: "2400 Legacy Dr, Plano, TX" },
      { name: "Robert Chen", email: "rchen@gmail.com", city: "Arlington", phone: "+1 (817) 555-0199", address: "500 Ballpark Way, Arlington, TX" }
    ]
  },
  "Custom": {
    label: "Custom Recipient List (Enter your own emails)",
    count: 0,
    defaultRecipients: []
  }
};

const PRESET_TEMPLATES = [
  {
    id: "meta-followup",
    name: "🚀 Meta Lead Immediate Follow-up",
    tag: "High Conversion",
    subject: "Fast AC Repair for your {{city}} Home - Spyke HVAC",
    previewText: "Our certified technicians can be at your address today.",
    body: `Hi {{first_name}},

Thank you for reaching out regarding your HVAC service inquiry on Facebook!

Our certified local technicians are currently servicing your area in {{city}}. Whether you are experiencing warm air blowing, weird noises, or need a full seasonal inspection, we can get you scheduled promptly.

Would you prefer a technician to visit tomorrow morning or afternoon?

Simply reply directly to this email or call our 24/7 AI dispatch line at +1 (346) 477-0028.

Best regards,
Spyke AI HVAC Team
https://spykeai.com`
  },
  {
    id: "tuneup-reminder",
    name: "❄️ Seasonal Tune-Up Promo",
    tag: "Retention",
    subject: "Special $49 HVAC Safety Tune-Up (Save $40 this week)",
    previewText: "Ensure peak efficiency before temperature spikes.",
    body: `Hi {{first_name}},

Did you know that an unserviced air conditioner or furnace can increase your energy bills by up to 25%?

This week only, we are offering our comprehensive 21-point HVAC Safety & Efficiency Tune-Up for just $49 (regularly $89) for our valued homeowners in {{city}}.

What's included:
• Complete refrigerant level & pressure check
• Electrical components & safety switch test
• Clean condenser coils & filter inspection
• Airflow and thermostat calibration

Book your slot here or reply to pick a time that works best for you!

Warmly,
Spyke AI Customer Support`
  },
  {
    id: "booking-confirm",
    name: "📅 Booking Confirmation",
    tag: "Operational",
    subject: "Confirmed: HVAC Service Appointment for {{first_name}}",
    previewText: "Your technician has been assigned and scheduled.",
    body: `Hi {{first_name}},

Great news! Your HVAC service appointment is officially confirmed on our calendar.

• Service Type: AC & Heating Diagnostic Check
• Scheduled Location: {{address}}
• Arrival Window: 1-hour dispatch notification sent via SMS

Our technician will call or text you 30 minutes before arrival. If you need to reschedule or have gate codes to share, simply reply to this email.

Thank you for trusting Spyke AI HVAC!

Best regards,
Dispatch Team`
  }
];

export default function EmailCampaignsPage() {
  // Tab state: "create" (default) | "history" | "analytics"
  const [activeTab, setActiveTab] = useState<"create" | "history" | "analytics">("create");

  // Create Campaign Form State
  const [campaignTitle, setCampaignTitle] = useState("HVAC Inbound Lead Auto-Followup");
  const [senderName, setSenderName] = useState("Spyke AI HVAC Dispatch");
  const [fromEmail, setFromEmail] = useState("spykeai2026@gmail.com");
  const [replyTo, setReplyTo] = useState("spykeai2026@gmail.com");
  const [targetSegmentKey, setTargetSegmentKey] = useState<string>("Meta Ad Leads");
  const [customEmailsInput, setCustomEmailsInput] = useState<string>("");
  const [subject, setSubject] = useState("Fast AC Repair for your {{city}} Home - Spyke HVAC");
  const [previewText, setPreviewText] = useState("Our certified technicians can be at your address today.");
  const [emailBody, setEmailBody] = useState(PRESET_TEMPLATES[0].body);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // History State
  const [logs, setLogs] = useState<EmailLog[]>(INITIAL_LOGS);
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>("all");
  const [selectedPreviewLog, setSelectedPreviewLog] = useState<EmailLog | null>(null);

  // Send action state
  const [sendingCampaign, setSendingCampaign] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", description: "" });
  
  // Test Email Modal
  const [testEmailModalOpen, setTestEmailModalOpen] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState("spykeai2026@gmail.com");
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Load logs from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("spyke_email_campaign_logs_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLogs(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load email logs from localStorage", e);
    }
  }, []);

  const saveLogs = (newLogs: EmailLog[]) => {
    setLogs(newLogs);
    try {
      localStorage.setItem("spyke_email_campaign_logs_v2", JSON.stringify(newLogs));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    const tpl = PRESET_TEMPLATES.find((t) => t.id === templateId);
    if (tpl) {
      setSubject(tpl.subject);
      setPreviewText(tpl.previewText);
      setEmailBody(tpl.body);
    }
  };

  const insertTag = (tag: string) => {
    setEmailBody((prev) => prev + ` {{${tag}}}`);
  };

  // Launch Campaign Dispatches Real Emails
  const handleSendCampaign = async () => {
    if (!campaignTitle.trim() || !subject.trim() || !emailBody.trim()) {
      alert("Please provide Campaign Title, Subject, and Email Body.");
      return;
    }

    // Determine recipients
    let recipientsList: Recipient[] = [];
    if (targetSegmentKey === "Custom") {
      const rawLines = customEmailsInput
        .split(/[,\n;]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.includes("@"));

      if (rawLines.length === 0) {
        alert("Please enter at least one valid email in the custom recipient field.");
        return;
      }

      recipientsList = rawLines.map((email) => ({
        name: email.split("@")[0].replace(/[._-]/g, " "),
        email,
        city: "Texas",
        phone: "+1 (346) 477-0028",
        address: "Texas Residence"
      }));
    } else {
      recipientsList = AUDIENCE_SEGMENTS[targetSegmentKey]?.defaultRecipients || [];
    }

    if (recipientsList.length === 0) {
      alert("No recipients found in selected audience.");
      return;
    }

    setSendingCampaign(true);

    try {
      const res = await fetch("/api/admin/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "campaign",
          campaignTitle,
          segment: AUDIENCE_SEGMENTS[targetSegmentKey]?.label || targetSegmentKey,
          fromName: senderName,
          fromEmail,
          replyTo,
          subject,
          preheader: previewText,
          body: emailBody,
          recipients: recipientsList,
        }),
      });

      const data = await res.json();

      if (data.ok && Array.isArray(data.logs)) {
        const updated = [...data.logs, ...logs];
        saveLogs(updated);

        setToastMessage({
          title: `Campaign Dispatched: ${data.successCount} Delivered!`,
          description: `Sent via SMTP to ${recipientsList.length} recipient(s). Logs saved in History.`,
        });
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
      } else {
        alert(`Failed to dispatch: ${data.error || "Unknown server response"}`);
      }
    } catch (err: any) {
      console.error("Campaign dispatch error:", err);
      alert(`Network / Dispatch error: ${err.message}`);
    } finally {
      setSendingCampaign(false);
    }
  };

  // Send Single Real Test Email via SMTP
  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress || !testEmailAddress.includes("@")) {
      alert("Please provide a valid test email address.");
      return;
    }

    setTestSending(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/admin/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "test",
          testEmail: testEmailAddress,
          fromName: senderName,
          fromEmail,
          replyTo,
          subject,
          preheader: previewText,
          body: emailBody,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        setTestResult({
          ok: true,
          message: `Live test email delivered to ${data.sentTo} at ${data.sentAt}!`,
        });

        // Also add to audit logs
        const testLog: EmailLog = {
          id: `log-test-${Date.now()}`,
          campaignTitle: `[Test] ${campaignTitle}`,
          subject: `[TEST] ${subject}`,
          recipientName: "Test Recipient",
          recipientEmail: data.sentTo,
          segment: "Internal Verification",
          sentAt: "Just now",
          status: "delivered",
          openCount: 0,
          bodySnippet: emailBody.slice(0, 140) + "...",
          fullBody: emailBody,
          messageId: data.messageId,
        };
        saveLogs([testLog, ...logs]);

        setTimeout(() => {
          setTestEmailModalOpen(false);
          setTestResult(null);
        }, 2500);
      } else {
        setTestResult({
          ok: false,
          message: data.error || "Failed to send test email.",
        });
      }
    } catch (err: any) {
      setTestResult({
        ok: false,
        message: err.message || "Network error sending test email.",
      });
    } finally {
      setTestSending(false);
    }
  };

  // Export logs to CSV
  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ["ID", "Campaign", "Subject", "Recipient Name", "Recipient Email", "Segment", "Sent At", "Status", "Opens"];
    const rows = logs.map((l) => [
      l.id,
      `"${l.campaignTitle.replace(/"/g, '""')}"`,
      `"${l.subject.replace(/"/g, '""')}"`,
      `"${l.recipientName.replace(/"/g, '""')}"`,
      l.recipientEmail,
      `"${l.segment.replace(/"/g, '""')}"`,
      l.sentAt,
      l.status,
      l.openCount
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `spyke_email_campaign_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete single log
  const handleDeleteLog = (id: string) => {
    const updated = logs.filter((l) => l.id !== id);
    saveLogs(updated);
  };

  // Reset to initial sample logs
  const handleResetLogs = () => {
    if (confirm("Reset audit history to default sample logs?")) {
      saveLogs(INITIAL_LOGS);
    }
  };

  // Filtered History
  const filteredLogs = logs.filter((l) => {
    const matchSearch =
      l.subject.toLowerCase().includes(historySearch.toLowerCase()) ||
      l.recipientName.toLowerCase().includes(historySearch.toLowerCase()) ||
      l.recipientEmail.toLowerCase().includes(historySearch.toLowerCase()) ||
      l.campaignTitle.toLowerCase().includes(historySearch.toLowerCase());
    const matchStatus = historyStatusFilter === "all" || l.status === historyStatusFilter;
    return matchSearch && matchStatus;
  });

  // Calculate Real-time Dynamic Analytics
  const totalSent = logs.length;
  const deliveredCount = logs.filter((l) => l.status === "delivered" || l.status === "opened" || l.status === "replied").length;
  const openedCount = logs.filter((l) => l.status === "opened" || l.status === "replied").length;
  const repliedCount = logs.filter((l) => l.status === "replied").length;
  const bouncedCount = logs.filter((l) => l.status === "bounced").length;

  const deliveredRate = totalSent > 0 ? ((deliveredCount / totalSent) * 100).toFixed(1) : "0.0";
  const openRate = deliveredCount > 0 ? ((openedCount / deliveredCount) * 100).toFixed(1) : "0.0";
  const replyRate = openedCount > 0 ? ((repliedCount / openedCount) * 100).toFixed(1) : "0.0";

  // Group by campaign for analytics comparison
  const campaignStats = useMemo(() => {
    const map = new Map<string, { title: string; sent: number; opened: number; replied: number }>();
    for (const log of logs) {
      const existing = map.get(log.campaignTitle) || { title: log.campaignTitle, sent: 0, opened: 0, replied: 0 };
      existing.sent += 1;
      if (log.status === "opened" || log.status === "replied") existing.opened += 1;
      if (log.status === "replied") existing.replied += 1;
      map.set(log.campaignTitle, existing);
    }
    return Array.from(map.values());
  }, [logs]);

  // Live interpolated preview text
  const livePreviewBody = useMemo(() => {
    return emailBody
      .replace(/\{\{\s*first_name\s*\}\}/gi, "Marcus")
      .replace(/\{\{\s*name\s*\}\}/gi, "Marcus Vance")
      .replace(/\{\{\s*city\s*\}\}/gi, "Dallas")
      .replace(/\{\{\s*phone\s*\}\}/gi, "+1 (214) 555-0192")
      .replace(/\{\{\s*address\s*\}\}/gi, "1420 Elm St, Dallas, TX")
      .replace(/\{\{\s*email\s*\}\}/gi, "marcus.v@gmail.com");
  }, [emailBody]);

  const livePreviewSubject = useMemo(() => {
    return subject
      .replace(/\{\{\s*first_name\s*\}\}/gi, "Marcus")
      .replace(/\{\{\s*city\s*\}\}/gi, "Dallas");
  }, [subject]);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans antialiased overflow-hidden">
      {/* VERTICAL NAVBAR */}
      <AdminSidebar active="emails" />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col bg-slate-50/60 pb-20 md:pb-6">
        
        {/* TOP HEADER & TABS BAR */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-4 shadow-2xs">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Title & Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                <Mail size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Email Campaigns
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                    Live SMTP Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Create outbound marketing broadcasts, track individual deliveries, and monitor open/reply metrics.
                </p>
              </div>
            </div>

            {/* Actions & Tab Switcher */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setTestEmailModalOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Send a live test email via SMTP to verify formatting"
              >
                <Send size={12} className="text-emerald-600" />
                <span>Send Test Email</span>
              </button>

              {/* TABS CONTAINER */}
              <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-2xl shadow-2xs">
                <button
                  onClick={() => setActiveTab("create")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "create"
                      ? "bg-white text-emerald-700 shadow-xs border border-slate-200/80"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Plus size={14} className={activeTab === "create" ? "text-emerald-600" : ""} />
                  <span>Create Emails</span>
                </button>

                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "history"
                      ? "bg-white text-emerald-700 shadow-xs border border-slate-200/80"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <History size={14} className={activeTab === "history" ? "text-emerald-600" : ""} />
                  <span>History</span>
                  <span className="text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                    {logs.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "analytics"
                      ? "bg-white text-emerald-700 shadow-xs border border-slate-200/80"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <BarChart3 size={14} className={activeTab === "analytics" ? "text-emerald-600" : ""} />
                  <span>Analytics</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                </button>
              </div>
            </div>

          </div>
        </header>

        {/* NOTIFICATION TOAST */}
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

        {/* TAB 1: CREATE EMAILS (DEFAULT) */}
        {activeTab === "create" && (
          <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: COMPOSER (7 COLS) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Preset Templates Selector Card */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-500" />
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        High-Converting HVAC Templates
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">Click to load</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {PRESET_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => handleSelectTemplate(tpl.id)}
                        className="text-left p-3 rounded-2xl border border-slate-200/90 hover:border-emerald-500 hover:bg-emerald-50/30 transition group cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                            {tpl.name}
                          </span>
                        </div>
                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {tpl.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Campaign Configuration Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
                  <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Layers size={16} className="text-emerald-600" />
                    Campaign & Target Audience
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Campaign Title
                      </label>
                      <input
                        type="text"
                        value={campaignTitle}
                        onChange={(e) => setCampaignTitle(e.target.value)}
                        placeholder="e.g. Dallas HVAC Summer Emergency Followup"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none transition shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Target Audience Segment
                      </label>
                      <select
                        value={targetSegmentKey}
                        onChange={(e) => setTargetSegmentKey(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none transition shadow-2xs"
                      >
                        {Object.entries(AUDIENCE_SEGMENTS).map(([key, info]) => (
                          <option key={key} value={key}>
                            {info.label} {info.count > 0 ? `(${info.count} leads)` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* If Custom segment selected, show email textarea */}
                  {targetSegmentKey === "Custom" && (
                    <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-2 animate-in fade-in duration-150">
                      <label className="block text-xs font-bold text-emerald-950">
                        Paste Recipient Email Addresses
                      </label>
                      <textarea
                        rows={3}
                        value={customEmailsInput}
                        onChange={(e) => setCustomEmailsInput(e.target.value)}
                        placeholder="john@example.com, sarah@gmail.com, tyler@texashvac.com (one per line or comma separated)"
                        className="w-full bg-white border border-emerald-200 focus:border-emerald-500 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none shadow-2xs"
                      />
                      <p className="text-[11px] text-emerald-700">
                        Enter any email addresses. Emails will be dispatched live via your verified Gmail SMTP.
                      </p>
                    </div>
                  )}

                  {/* Sender Profile */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        From Name
                      </label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        From Email (SMTP)
                      </label>
                      <input
                        type="text"
                        value={fromEmail}
                        onChange={(e) => setFromEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Reply-To
                      </label>
                      <input
                        type="text"
                        value={replyTo}
                        onChange={(e) => setReplyTo(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Content Composer Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <Mail size={16} className="text-emerald-600" />
                      Email Content & Copywriting
                    </h2>
                    <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      HTML + PlainText Auto-Render
                    </span>
                  </div>

                  {/* Subject Line */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">Subject Line</label>
                      <span className="text-[10px] text-slate-400">{subject.length} characters</span>
                    </div>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Catchy subject line with urgency..."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none shadow-2xs"
                    />
                  </div>

                  {/* Preview Text */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preheader / Preview Text (Inbox Snippet)
                    </label>
                    <input
                      type="text"
                      value={previewText}
                      onChange={(e) => setPreviewText(e.target.value)}
                      placeholder="Brief teaser text shown in mobile notification preview..."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none shadow-2xs"
                    />
                  </div>

                  {/* Personalization Tags Chips */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
                      Click to insert Dynamic Personalization Tag:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "{{first_name}}", desc: "First Name" },
                        { label: "{{city}}", desc: "City" },
                        { label: "{{phone}}", desc: "Phone" },
                        { label: "{{address}}", desc: "Street Address" },
                        { label: "{{email}}", desc: "Email" }
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => insertTag(item.label.replace(/[{}]/g, ""))}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100/60 border border-slate-200/80 text-[11px] font-mono font-bold text-slate-700 hover:text-emerald-800 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <Plus size={10} className="text-emerald-600" />
                          <span>{item.label}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({item.desc})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email Body Textarea */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Message Body
                    </label>
                    <textarea
                      rows={12}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-2xl p-4 text-xs font-normal text-slate-800 focus:outline-none transition leading-relaxed shadow-2xs font-sans"
                    />
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setTestEmailModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Send size={13} className="text-emerald-600" />
                      <span>Send Test to My Email</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSendCampaign}
                        disabled={sendingCampaign}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {sendingCampaign ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-white" />
                            <span>Dispatching SMTP Broadcast...</span>
                          </>
                        ) : (
                          <>
                            <Send size={14} />
                            <span>
                              Launch Campaign Now
                              {targetSegmentKey !== "Custom" && AUDIENCE_SEGMENTS[targetSegmentKey]?.count
                                ? ` (${AUDIENCE_SEGMENTS[targetSegmentKey].count} leads)`
                                : ""}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* RIGHT COLUMN: INTERACTIVE LIVE EMAIL CLIENT SIMULATOR (5 COLS) */}
              <div className="lg:col-span-5 sticky top-24 space-y-4">
                
                {/* Simulator Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
                  
                  {/* Simulator Device & Client Switcher */}
                  <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-xs font-bold tracking-tight">Recipient Preview Simulator</span>
                    </div>

                    <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setPreviewDevice("desktop")}
                        className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                          previewDevice === "desktop" ? "bg-slate-700 text-emerald-400" : "text-slate-400 hover:text-white"
                        }`}
                        title="Desktop Outlook/Gmail View"
                      >
                        <Monitor size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice("mobile")}
                        className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                          previewDevice === "mobile" ? "bg-slate-700 text-emerald-400" : "text-slate-400 hover:text-white"
                        }`}
                        title="iPhone / Android Mobile View"
                      >
                        <Smartphone size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Mail Client Header */}
                  <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-semibold text-slate-400">To:</span>
                      <span className="text-slate-800 font-medium">Marcus Vance (marcus.v@gmail.com)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-semibold text-slate-400">From:</span>
                      <span className="text-slate-800 font-medium">{senderName} &lt;{fromEmail}&gt;</span>
                    </div>
                    <div className="flex items-start justify-between text-slate-500">
                      <span className="font-semibold text-slate-400">Subject:</span>
                      <span className="text-slate-900 font-bold text-right flex-1 ml-4 truncate">
                        {livePreviewSubject || "No subject set"}
                      </span>
                    </div>
                    {previewText && (
                      <div className="flex items-start justify-between text-slate-400 text-[11px] italic">
                        <span className="font-semibold text-slate-400 not-italic">Snippet:</span>
                        <span className="text-right flex-1 ml-4 truncate">{previewText}</span>
                      </div>
                    )}
                  </div>

                  {/* Mail Render Container */}
                  <div
                    className={`bg-slate-100/50 p-4 transition-all duration-300 ${
                      previewDevice === "mobile" ? "max-w-[340px] mx-auto py-6" : "w-full"
                    }`}
                  >
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                      {/* Brand Banner */}
                      <div className="bg-slate-950 px-5 py-3.5 border-b-2 border-emerald-500 flex items-center justify-between">
                        <span className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                          <span className="text-emerald-400">⚡</span> Spyke <span className="text-emerald-400">HVAC</span>
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                          Texas Dispatch
                        </span>
                      </div>

                      {/* Rendered Email Body with Personalized Values */}
                      <div className="p-5 text-xs text-slate-800 leading-relaxed font-sans space-y-3 whitespace-pre-wrap">
                        {livePreviewBody}
                      </div>

                      {/* CTA Button Mock */}
                      <div className="px-5 pb-5">
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="inline-block px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700"
                        >
                          Confirm Service / Schedule Visit &rarr;
                        </a>
                      </div>

                      {/* Footer */}
                      <div className="bg-slate-50 px-5 py-4 border-t border-slate-100 text-[10px] text-slate-400 space-y-1">
                        <p className="font-bold text-slate-600">{senderName}</p>
                        <p>24/7 HVAC Emergency Hotline &bull; Texas, USA</p>
                        <p className="text-[9px] text-slate-400 pt-1">
                          To stop receiving messages, reply "STOP" or click unsubscribe.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Simulator Device Info */}
                  <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Rendering Engine: Standard RFC 5322</span>
                    <span className="text-emerald-600 font-semibold">100% Mobile Responsive</span>
                  </div>

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
                  placeholder="Search by recipient name, email, subject, or campaign..."
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
                      <th className="py-3.5 px-5">Campaign & Subject</th>
                      <th className="py-3.5 px-4">Recipient</th>
                      <th className="py-3.5 px-4">Segment</th>
                      <th className="py-3.5 px-4">Sent At</th>
                      <th className="py-3.5 px-4">Delivery Status</th>
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
                            <td className="py-3.5 px-5 max-w-[280px]">
                              <p className="font-bold text-slate-900 truncate">{log.subject}</p>
                              <p className="text-[11px] text-slate-400 truncate">{log.campaignTitle}</p>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700 shrink-0">
                                  {log.recipientName.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="truncate max-w-[170px]">
                                  <p className="font-bold text-slate-800 truncate">{log.recipientName}</p>
                                  <p className="text-[10px] text-slate-400 truncate">{log.recipientEmail}</p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                {log.segment}
                              </span>
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
                                  <span>Replied (Hot Lead)</span>
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
                <p className="text-[11px] text-slate-400 mt-1">Across all campaigns & tests</p>
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

            {/* Campaign Comparison Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Campaign Breakdown & Performance
                </h4>
                <span className="text-xs text-slate-400 font-semibold">{campaignStats.length} active campaigns</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-6">Campaign Name</th>
                      <th className="py-3 px-4">Total Sent</th>
                      <th className="py-3 px-4">Opened</th>
                      <th className="py-3 px-4">Replied</th>
                      <th className="py-3 px-4 text-right">Open Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {campaignStats.map((item, idx) => {
                      const cOpenRate = item.sent > 0 ? ((item.opened / item.sent) * 100).toFixed(1) : "0.0";
                      return (
                        <tr key={idx} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-6 font-bold text-slate-900">{item.title}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">{item.sent}</td>
                          <td className="py-3.5 px-4 font-semibold text-blue-700">{item.opened}</td>
                          <td className="py-3.5 px-4 font-semibold text-purple-700">{item.replied}</td>
                          <td className="py-3.5 px-4 text-right font-black text-slate-900">{cOpenRate}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                  <span className="text-slate-400">Subject:</span>
                  <span className="font-bold text-slate-900">{selectedPreviewLog.subject}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Recipient:</span>
                  <span className="font-bold text-slate-900">{selectedPreviewLog.recipientName} ({selectedPreviewLog.recipientEmail})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Campaign:</span>
                  <span className="font-semibold text-slate-700">{selectedPreviewLog.campaignTitle}</span>
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

      {/* MODAL: TEST EMAIL */}
      {testEmailModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send size={16} className="text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Send Live Test Email</h3>
              </div>
              <button
                onClick={() => setTestEmailModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Send a real test email via your verified SMTP server (<b>{process.env.NEXT_PUBLIC_SMTP_USER || "spykeai2026@gmail.com"}</b>) to test rendering, layout, and deliverability.
            </p>

            <form onSubmit={handleSendTestEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Send test to inbox:</label>
                <input
                  type="email"
                  required
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold ${
                    testResult.ok ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {testResult.message}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTestEmailModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={testSending}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {testSending ? (
                    <>
                      <Loader2 size={13} className="animate-spin text-white" />
                      <span>Sending via SMTP...</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Send Live Test</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
