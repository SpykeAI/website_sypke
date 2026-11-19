"use client";

import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import {
  UploadCloud,
  FileSpreadsheet,
  Clock,
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  Eye,
  Check,
  ChevronDown,
  Sparkles,
  Play,
  Pause,
  X,
  Phone,
  Coins,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { PhoneLine, getAvailableLines } from "@/lib/phoneLines";

export interface SmsBatchRecipient {
  phone: string;
  name?: string;
  company?: string;
  customMessage?: string;
  status: "pending" | "sending" | "sent" | "delivered" | "failed";
  error?: string;
  sentAt?: string;
}

export interface SmsBatch {
  id: string;
  batchName: string;
  fileName: string;
  delaySeconds: number;
  delayDisplay: string;
  status: "completed" | "in_progress" | "draft" | "failed";
  createdAt: string;
  senderNumber: string;
  messageTemplate: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  recipients: SmsBatchRecipient[];
}

const INITIAL_BATCHES: SmsBatch[] = [
  {
    id: "batch-1",
    batchName: "Batch-Tampa-1",
    fileName: "Tampa_HVAC_Contractors_Nov.xlsx",
    delaySeconds: 1,
    delayDisplay: "1s delay",
    status: "completed",
    createdAt: "Today, 10:15 AM",
    senderNumber: "+13464770028",
    messageTemplate: "Hi {name}, our certified technicians are in Tampa this week for HVAC safety checks. Reply YES to book your slot!",
    totalRecipients: 45,
    sentCount: 45,
    deliveredCount: 43,
    failedCount: 2,
    recipients: [
      { phone: "+18135550192", name: "Marcus Vance", company: "Tampa Air Solutions", status: "delivered", sentAt: "10:15 AM" },
      { phone: "+18135550144", name: "Sarah Jenkins", company: "Bay Area Cooling", status: "delivered", sentAt: "10:15 AM" },
      { phone: "+17275550188", name: "Carlos Mendez", company: "Clearwater Refrigeration", status: "delivered", sentAt: "10:15 AM" },
      { phone: "+18135550101", name: "Elena Rostova", company: "Rostova Mechanical", status: "delivered", sentAt: "10:16 AM" },
      { phone: "+18135550199", name: "David Miller", company: "Miller HVAC", status: "failed", error: "Carrier Rejected (Landline)", sentAt: "10:16 AM" },
    ]
  },
  {
    id: "batch-2",
    batchName: "Batch-Dallas-HVAC-TuneUp",
    fileName: "Dallas_Commercial_Leads.csv",
    delaySeconds: 5,
    delayDisplay: "5s delay",
    status: "completed",
    createdAt: "Yesterday, 03:30 PM",
    senderNumber: "+13464770028",
    messageTemplate: "Hello {name}, did you schedule your seasonal commercial HVAC tune-up? Get 20% off before the heatwave hits.",
    totalRecipients: 120,
    sentCount: 120,
    deliveredCount: 116,
    failedCount: 4,
    recipients: []
  },
  {
    id: "batch-3",
    batchName: "Austin-Emergency-Leads",
    fileName: "Austin_Emergency_Accounts.xlsx",
    delaySeconds: 60,
    delayDisplay: "1m delay",
    status: "completed",
    createdAt: "Nov 16, 11:00 AM",
    senderNumber: "+13464770028",
    messageTemplate: "Hi {name}, Spyke AI 24/7 emergency dispatch line is now live in Austin. Test our AI voice agent at spykeai.com",
    totalRecipients: 25,
    sentCount: 25,
    deliveredCount: 24,
    failedCount: 1,
    recipients: []
  },
  {
    id: "batch-4",
    batchName: "Batch-Orlando-AC-Followup",
    fileName: "Orlando_New_Quotes.xlsx",
    delaySeconds: 2,
    delayDisplay: "2s delay",
    status: "draft",
    createdAt: "Nov 15, 04:45 PM",
    senderNumber: "+13464770028",
    messageTemplate: "Hi {name}, following up on your quote for {company}. Are you available for a 5-min call tomorrow?",
    totalRecipients: 60,
    sentCount: 0,
    deliveredCount: 0,
    failedCount: 0,
    recipients: []
  }
];

// Clean phone to E.164 helper
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  if (digits.length === 12 && digits.startsWith("91")) return "+" + digits;
  if (raw.startsWith("+")) return "+" + digits;
  return "+" + digits;
}

interface BulkSmsManagerProps {
  onOpenFormatGuide?: () => void;
  initialTemplate?: string | null;
}

export default function BulkSmsManager({ onOpenFormatGuide, initialTemplate }: BulkSmsManagerProps) {
  // Batch List / History state
  const [batches, setBatches] = useState<SmsBatch[]>(INITIAL_BATCHES);
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>("all");

  // Campaign Composer State
  const [batchName, setBatchName] = useState("Batch-Tampa-1");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [recipients, setRecipients] = useState<SmsBatchRecipient[]>([]);
  const [messageTemplate, setMessageTemplate] = useState(
    initialTemplate || "Hi {name}, our certified technicians are in Tampa this week for HVAC safety checks. Reply YES to book your slot!"
  );

  useEffect(() => {
    if (initialTemplate) {
      setMessageTemplate(initialTemplate);
    }
  }, [initialTemplate]);
  const [selectedSender, setSelectedSender] = useState<string>("+13464770028");

  // Delay settings: customizable from 1 second to 1 minute or more
  const [delayAmount, setDelayAmount] = useState<number>(1);
  const [delayUnit, setDelayUnit] = useState<"seconds" | "minutes">("seconds");

  // Available Sender Lines
  const [availableLines] = useState<PhoneLine[]>(() => getAvailableLines("+13464770028"));

  // Modals & Active Views
  const [viewRecipientsModalOpen, setViewRecipientsModalOpen] = useState(false);
  const [analyticsBatch, setAnalyticsBatch] = useState<SmsBatch | null>(null);
  const [recipientSearchQuery, setRecipientSearchQuery] = useState("");

  // Live Sending Execution State
  const [isSending, setIsSending] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sendingProgress, setSendingProgress] = useState({ current: 0, total: 0, currentPhone: "" });
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelSendingRef = useRef(false);
  const pauseSendingRef = useRef(false);

  // Load saved batches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("spyke_sms_bulk_batches_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBatches(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load local batches", e);
    }
  }, []);

  // Save batches helper
  const saveBatches = (newBatches: SmsBatch[]) => {
    setBatches(newBatches);
    try {
      localStorage.setItem("spyke_sms_bulk_batches_v1", JSON.stringify(newBatches));
    } catch (e) {
      console.error("Failed to save batches to localStorage", e);
    }
  };

  const showToast = (type: "success" | "error" | "info", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Compute delay in seconds and display string
  const totalDelaySeconds = delayUnit === "minutes" ? delayAmount * 60 : delayAmount;
  const delayDisplay =
    delayUnit === "minutes"
      ? `${delayAmount}m delay`
      : `${delayAmount}s delay`;

  // Live Queue Preview State
  const [queueSearchQuery, setQueueSearchQuery] = useState("");
  const [queueStatusFilter, setQueueStatusFilter] = useState<string>("all");
  const [queueDisplayLimit, setQueueDisplayLimit] = useState<number>(30);

  // File Upload & Intelligent Multi-Row Parser (CSV, XLSX, XLS)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);

    // Auto-suggest clean batch name
    const cleanBaseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[\(\)\[\]]+/g, "")
      .replace(/[\s_]+/g, "-")
      .slice(0, 45);
    setBatchName(`Batch-${cleanBaseName}`);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result as ArrayBuffer;
        const wb = XLSX.read(buffer, { type: "array" });

        // Search sheets for one with actual data rows
        let sheetData: any[][] = [];
        for (const sname of wb.SheetNames) {
          const sheet = wb.Sheets[sname];
          const data = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false, defval: "" }) as any[][];
          if (data && data.length > 0) {
            sheetData = data;
            break;
          }
        }

        if (!sheetData || sheetData.length === 0) {
          showToast("error", "The uploaded file has no data rows.");
          return;
        }

        let headerRowIdx = -1;
        let phoneColIdx = -1;
        let nameColIdx = -1;
        let companyColIdx = -1;
        let messageColIdx = -1;

        // 1. Scan the first 10 rows for column headers
        // (Handles reports where Row 1 is a title/banner and Row 2 has the actual headers)
        for (let r = 0; r < Math.min(sheetData.length, 10); r++) {
          const row = sheetData[r];
          if (!Array.isArray(row)) continue;

          let pIdx = -1;
          let nIdx = -1;
          let cIdx = -1;
          let mIdx = -1;

          row.forEach((cell, idx) => {
            if (cell === null || cell === undefined) return;
            const text = String(cell).toLowerCase().trim();

            // Phone Column Check (phone, telephone, tel, mobile, cell, ph)
            if (
              pIdx === -1 &&
              (text.includes("phone") ||
                text.includes("tele") ||
                text.includes("mobile") ||
                text.includes("cell") ||
                text.includes("contact num") ||
                text === "tel" ||
                text === "ph")
            ) {
              pIdx = idx;
            }

            // Company / Business Name Check
            if (
              cIdx === -1 &&
              (text === "businessname" ||
                text === "company" ||
                text === "company name" ||
                text === "business name" ||
                text === "business" ||
                text === "org" ||
                text === "firm")
            ) {
              cIdx = idx;
            }

            // Person Name Check
            if (
              nIdx === -1 &&
              (text === "name" ||
                text === "contact name" ||
                text === "first name" ||
                text === "full name" ||
                text === "customer" ||
                text === "client" ||
                text === "owner" ||
                text === "person")
            ) {
              nIdx = idx;
            }

            // Custom Message Column
            if (
              mIdx === -1 &&
              (text.includes("message") ||
                text.includes("notes") ||
                text.includes("custom") ||
                text.includes("body") ||
                text.includes("sms") ||
                text.includes("text"))
            ) {
              mIdx = idx;
            }
          });

          // If a row has a phone indicator, that row is our header row!
          if (pIdx !== -1) {
            headerRowIdx = r;
            phoneColIdx = pIdx;
            if (nIdx !== -1) nameColIdx = nIdx;
            if (cIdx !== -1) companyColIdx = cIdx;
            if (mIdx !== -1) messageColIdx = mIdx;
            break;
          }
        }

        // 2. Fallback: if no phone header found by text, scan column values for phone numbers
        if (phoneColIdx === -1) {
          const sampleRows = sheetData.slice(0, 20);
          const maxCols = Math.max(...sampleRows.map((r) => (Array.isArray(r) ? r.length : 0)));
          for (let c = 0; c < maxCols; c++) {
            let phoneMatchCount = 0;
            sampleRows.forEach((r) => {
              if (!Array.isArray(r)) return;
              const val = String(r[c] || "").trim();
              const digits = val.replace(/\D/g, "");
              if (digits.length >= 10 && digits.length <= 15) {
                phoneMatchCount++;
              }
            });
            if (phoneMatchCount >= Math.max(1, sampleRows.length * 0.3)) {
              phoneColIdx = c;
              headerRowIdx = 0;
              break;
            }
          }
        }

        if (phoneColIdx === -1) {
          showToast(
            "error",
            "No phone number column could be detected. Please ensure your file has a Telephone or Phone column."
          );
          return;
        }

        // If company was found (e.g. BusinessName) and name wasn't, mirror it
        if (companyColIdx !== -1 && nameColIdx === -1) {
          nameColIdx = companyColIdx;
        } else if (nameColIdx !== -1 && companyColIdx === -1) {
          companyColIdx = nameColIdx;
        }

        const parsed: SmsBatchRecipient[] = [];
        const startRow = headerRowIdx >= 0 ? headerRowIdx + 1 : 0;
        const seenPhones = new Set<string>();

        for (let r = startRow; r < sheetData.length; r++) {
          const row = sheetData[r];
          if (!row || !Array.isArray(row)) continue;

          const rawPhone = String(row[phoneColIdx] || "").trim();
          const digits = rawPhone.replace(/\D/g, "");
          if (digits.length < 10) continue; // Skip empty rows or header echoes

          const normalized = normalizePhone(rawPhone);
          if (seenPhones.has(normalized)) continue;
          seenPhones.add(normalized);

          const rawName = nameColIdx !== -1 ? String(row[nameColIdx] || "").trim() : "";
          const rawCompany = companyColIdx !== -1 ? String(row[companyColIdx] || "").trim() : "";
          const rawMsg = messageColIdx !== -1 ? String(row[messageColIdx] || "").trim() : "";

          parsed.push({
            phone: normalized,
            name: rawName || rawCompany || undefined,
            company: rawCompany || rawName || undefined,
            customMessage: rawMsg || undefined,
            status: "pending",
          });
        }

        if (parsed.length === 0) {
          showToast("error", "No valid phone numbers found in file. Please check format guidelines.");
          return;
        }

        setRecipients(parsed);
        showToast("success", `Successfully loaded ${parsed.length} recipients from ${file.name}!`);
      } catch (err: any) {
        showToast("error", "Failed to parse file: " + (err?.message || "Invalid file"));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Save Batch as Draft
  const handleSaveDraftBatch = () => {
    if (!batchName.trim()) {
      showToast("error", "Please provide a Batch Name (e.g. Batch-Tampa-1)");
      return;
    }

    const newBatch: SmsBatch = {
      id: "batch-" + Date.now(),
      batchName: batchName.trim(),
      fileName: selectedFileName || "Manual_Recipients.xlsx",
      delaySeconds: totalDelaySeconds,
      delayDisplay,
      status: "draft",
      createdAt: "Just now",
      senderNumber: selectedSender,
      messageTemplate,
      totalRecipients: recipients.length > 0 ? recipients.length : 1,
      sentCount: 0,
      deliveredCount: 0,
      failedCount: 0,
      recipients: recipients.length > 0 ? recipients : [
        { phone: "+18135550192", name: "Sample Contact", status: "pending" }
      ],
    };

    saveBatches([newBatch, ...batches]);
    showToast("success", `Batch "${newBatch.batchName}" saved to history as Draft!`);
  };

  // Send Bulk Campaign with real delays
  const handleSendBulkCampaign = async (targetBatch?: SmsBatch) => {
    const activeBatchName = targetBatch ? targetBatch.batchName : batchName.trim();
    const activeRecipients = targetBatch ? targetBatch.recipients : recipients;
    const activeTemplate = targetBatch ? targetBatch.messageTemplate : messageTemplate;
    const activeSender = targetBatch ? targetBatch.senderNumber : selectedSender;
    const delayMs = (targetBatch ? targetBatch.delaySeconds : totalDelaySeconds) * 1000;

    if (!activeBatchName) {
      showToast("error", "Please provide a Batch Name (e.g. Batch-Tampa-1)");
      return;
    }

    if (!activeRecipients || activeRecipients.length === 0) {
      showToast("error", "Please attach a CSV or Excel file with recipients first.");
      return;
    }

    setIsSending(true);
    setIsPaused(false);
    cancelSendingRef.current = false;
    pauseSendingRef.current = false;
    setSendingProgress({ current: 0, total: activeRecipients.length, currentPhone: "" });

    // Create or update batch entry in history
    const batchId = targetBatch ? targetBatch.id : "batch-" + Date.now();
    let currentBatch: SmsBatch = {
      id: batchId,
      batchName: activeBatchName,
      fileName: targetBatch?.fileName || selectedFileName || "Recipients.xlsx",
      delaySeconds: targetBatch ? targetBatch.delaySeconds : totalDelaySeconds,
      delayDisplay: targetBatch ? targetBatch.delayDisplay : delayDisplay,
      status: "in_progress",
      createdAt: "Today, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      senderNumber: activeSender,
      messageTemplate: activeTemplate,
      totalRecipients: activeRecipients.length,
      sentCount: 0,
      deliveredCount: 0,
      failedCount: 0,
      recipients: [...activeRecipients],
    };

    const updatedInitial = batches.some((b) => b.id === batchId)
      ? batches.map((b) => (b.id === batchId ? currentBatch : b))
      : [currentBatch, ...batches];
    saveBatches(updatedInitial);

    let sent = 0;
    let delivered = 0;
    let failed = 0;

    for (let i = 0; i < activeRecipients.length; i++) {
      if (cancelSendingRef.current) {
        showToast("info", "Campaign sending stopped.");
        break;
      }

      while (pauseSendingRef.current) {
        await new Promise((r) => setTimeout(r, 500));
        if (cancelSendingRef.current) break;
      }

      const recipient = activeRecipients[i];
      recipient.status = "sending";
      setRecipients([...activeRecipients]);
      setSendingProgress({ current: i + 1, total: activeRecipients.length, currentPhone: recipient.phone });

      // Build personalized message
      let personalizedText = recipient.customMessage || activeTemplate;
      personalizedText = personalizedText.replace(/\{name\}/gi, recipient.name || "there");
      personalizedText = personalizedText.replace(/\{phone\}/gi, recipient.phone);
      personalizedText = personalizedText.replace(/\{company\}/gi, recipient.company || "your business");

      try {
        const res = await fetch("/api/sms/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: recipient.phone,
            text: personalizedText,
            from: activeSender,
          }),
        });

        const data = await res.json();
        if (res.ok && data.ok) {
          sent++;
          delivered++;
          recipient.status = "delivered";
          recipient.sentAt = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } else {
          sent++;
          failed++;
          recipient.status = "failed";
          recipient.error = data.message || "Telnyx send error";
        }
      } catch (err: any) {
        sent++;
        failed++;
        recipient.status = "failed";
        recipient.error = err?.message || "Network error";
      }

      // Update studio queue live
      setRecipients([...activeRecipients]);

      // Update in-progress batch state
      currentBatch.sentCount = sent;
      currentBatch.deliveredCount = delivered;
      currentBatch.failedCount = failed;
      setBatches((prev) => prev.map((b) => (b.id === batchId ? { ...currentBatch } : b)));

      // Enforce the user-specified delay between messages (if not last recipient)
      if (i < activeRecipients.length - 1 && delayMs > 0) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }

    currentBatch.status = cancelSendingRef.current ? "failed" : "completed";
    currentBatch.sentCount = sent;
    currentBatch.deliveredCount = delivered;
    currentBatch.failedCount = failed;

    saveBatches(batches.map((b) => (b.id === batchId ? currentBatch : b)));
    setIsSending(false);
    showToast("success", `Campaign "${activeBatchName}" finished: ${delivered} delivered, ${failed} failed.`);
  };

  // Delete Batch
  const handleDeleteBatch = (id: string) => {
    const updated = batches.filter((b) => b.id !== id);
    saveBatches(updated);
    showToast("info", "Batch removed from history.");
    if (analyticsBatch?.id === id) setAnalyticsBatch(null);
  };

  // Character & Segment count for template
  const charCount = messageTemplate.length;
  const isUnicode = /[^\u0000-\u007F]/.test(messageTemplate);
  const segmentLimit = isUnicode ? 70 : 160;
  const segmentCount = charCount === 0 ? 0 : Math.ceil(charCount / segmentLimit);

  // Filter batches for history table
  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.batchName.toLowerCase().includes(historySearch.toLowerCase()) ||
      b.fileName.toLowerCase().includes(historySearch.toLowerCase()) ||
      b.delayDisplay.toLowerCase().includes(historySearch.toLowerCase());
    const matchesStatus = historyStatusFilter === "all" || b.status === historyStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter recipients in preview modal
  const filteredPreviewRecipients = recipients.filter((r) => {
    const q = recipientSearchQuery.toLowerCase();
    return (
      r.phone.toLowerCase().includes(q) ||
      (r.name || "").toLowerCase().includes(q) ||
      (r.company || "").toLowerCase().includes(q)
    );
  });

  // Live Queue Calculations (Total count, Next to be sent, Status breakdown)
  const totalQueueCount = recipients.length;
  const pendingRecipients = recipients.filter((r) => r.status === "pending");
  const sendingRecipient = recipients.find((r) => r.status === "sending");
  const nextRecipient = sendingRecipient || pendingRecipients[0] || null;
  const nextRecipientIndex = recipients.findIndex((r) => r.status === "pending" || r.status === "sending");

  const queueSentCount = recipients.filter((r) => r.status === "sent" || r.status === "delivered").length;
  const queueDeliveredCount = recipients.filter((r) => r.status === "delivered").length;
  const queueFailedCount = recipients.filter((r) => r.status === "failed").length;
  const queuePendingCount = recipients.filter((r) => r.status === "pending").length;

  // Filtered queue for table
  const filteredQueue = recipients.filter((r) => {
    const q = queueSearchQuery.toLowerCase();
    const matchSearch =
      r.phone.toLowerCase().includes(q) ||
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.company && r.company.toLowerCase().includes(q)) ||
      (r.customMessage && r.customMessage.toLowerCase().includes(q));

    const matchStatus =
      queueStatusFilter === "all" ||
      (queueStatusFilter === "pending" && r.status === "pending") ||
      (queueStatusFilter === "delivered" && r.status === "delivered") ||
      (queueStatusFilter === "failed" && r.status === "failed");

    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200 ${
            toastMessage.type === "success"
              ? "bg-emerald-900 text-emerald-100 border-emerald-700"
              : toastMessage.type === "error"
              ? "bg-rose-900 text-rose-100 border-rose-700"
              : "bg-slate-900 text-slate-100 border-slate-700"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 size={16} className="text-[#00DF81]" />
          ) : (
            <AlertCircle size={16} className="text-amber-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header & Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Batches
          </span>
          <span className="text-2xl font-black text-slate-900">{batches.length}</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Messages Sent
          </span>
          <span className="text-2xl font-black text-slate-900">
            {batches.reduce((acc, b) => acc + (b.sentCount || 0), 0)}
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Delivered Rate
          </span>
          <span className="text-2xl font-black text-emerald-600">
            {batches.length > 0
              ? (
                  (batches.reduce((acc, b) => acc + (b.deliveredCount || 0), 0) /
                    Math.max(1, batches.reduce((acc, b) => acc + (b.sentCount || 0), 0))) *
                  100
                ).toFixed(1) + "%"
              : "0%"}
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Active / Drafts
          </span>
          <span className="text-2xl font-black text-blue-600">
            {batches.filter((b) => b.status === "draft" || b.status === "in_progress").length}
          </span>
        </div>
      </div>

      {/* Live Campaign Sending Progress Banner */}
      {isSending && (
        <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <RefreshCw size={16} className="animate-spin text-[#00DF81]" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#00DF81]">
                  Campaign Sending in Progress...
                </h4>
                <p className="text-xs text-slate-300">
                  Sending to {sendingProgress.currentPhone} ({sendingProgress.current} of {sendingProgress.total}) · Delay: {delayDisplay}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  pauseSendingRef.current = !pauseSendingRef.current;
                  setIsPaused(pauseSendingRef.current);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                {isPaused ? <Play size={12} /> : <Pause size={12} />}
                <span>{isPaused ? "Resume" : "Pause"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  cancelSendingRef.current = true;
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-700 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                <X size={12} />
                <span>Cancel</span>
              </button>
            </div>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#00DF81] h-full transition-all duration-300"
              style={{
                width: `${Math.round((sendingProgress.current / Math.max(1, sendingProgress.total)) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 1. BULK UPLOAD STUDIO CARD (Attach CSV/Excel, Batch Name, Delays, Send) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <UploadCloud size={18} className="text-emerald-600" />
              <span>Bulk SMS Campaign Studio</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload recipient spreadsheet, name your batch, configure delays, and launch automated campaigns.
            </p>
          </div>

          {onOpenFormatGuide && (
            <button
              type="button"
              onClick={onOpenFormatGuide}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <FileSpreadsheet size={13} className="text-purple-600" />
              <span>View Upload Format Guide</span>
            </button>
          )}
        </div>

        {/* Studio Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: File Attachment & Settings (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* File Attachment Drag & Drop Area */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                1. Attach CSV or Excel File *
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-6 text-center bg-slate-50/60 hover:bg-emerald-50/30 transition-all cursor-pointer group space-y-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto text-emerald-600 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet size={24} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {selectedFileName || "Click to browse or drop CSV / Excel"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Supports .xlsx, .xls, and .csv
                  </span>
                </div>

                {recipients.length > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold mt-1">
                    <CheckCircle2 size={13} />
                    <span>{recipients.length} valid contacts parsed</span>
                  </div>
                )}
              </div>

              {recipients.length > 0 && (
                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setViewRecipientsModalOpen(true)}
                    className="text-xs font-bold text-purple-600 hover:text-purple-800 underline cursor-pointer flex items-center gap-1"
                  >
                    <Eye size={12} />
                    <span>Preview {recipients.length} Recipients</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFileName(null);
                      setRecipients([]);
                    }}
                    className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 cursor-pointer"
                  >
                    Clear file
                  </button>
                </div>
              )}
            </div>

            {/* Batch Name Setting */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>2. Batch Name *</span>
                <span className="text-[11px] font-normal text-slate-400">e.g. Batch-Tampa-1</span>
              </label>
              <input
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="e.g. Batch-Tampa-1"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DF81] bg-slate-50/50"
              />
            </div>

            {/* Configurable Delays (1 second, 1 minute, customizable) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock size={14} className="text-emerald-600" />
                  <span>3. Delay Between Each Message</span>
                </label>
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {delayDisplay}
                </span>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: "1s", sec: 1, unit: "seconds" },
                  { label: "3s", sec: 3, unit: "seconds" },
                  { label: "5s", sec: 5, unit: "seconds" },
                  { label: "10s", sec: 10, unit: "seconds" },
                  { label: "30s", sec: 30, unit: "seconds" },
                  { label: "1 min", sec: 1, unit: "minutes" },
                  { label: "2 min", sec: 2, unit: "minutes" },
                  { label: "5 min", sec: 5, unit: "minutes" },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDelayAmount(preset.sec);
                      setDelayUnit(preset.unit as any);
                    }}
                    className={`py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      delayAmount === preset.sec && delayUnit === preset.unit
                        ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom Delay Inputs */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                  Custom:
                </span>
                <input
                  type="number"
                  min="1"
                  max="3600"
                  value={delayAmount}
                  onChange={(e) => setDelayAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-200 bg-white"
                />
                <select
                  value={delayUnit}
                  onChange={(e) => setDelayUnit(e.target.value as any)}
                  className="px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-200 bg-white"
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                </select>
              </div>

              <p className="text-[11px] text-slate-400 leading-normal">
                Staggering each send prevents carrier spam flagging and ensures high delivery rates.
              </p>
            </div>

            {/* Sender Number Line */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Sender Number Line
              </label>
              <select
                value={selectedSender}
                onChange={(e) => setSelectedSender(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-2xl border border-slate-200 bg-white"
              >
                {availableLines.map((line) => (
                  <option key={line.number} value={line.number}>
                    {line.flag} {line.formatted} ({line.label})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column: Message Composer & Dynamic Tags (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#00DF81]" />
                  <span>4. SMS Message Template</span>
                </label>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span>{charCount} chars</span>
                  <span>·</span>
                  <span className="font-bold text-emerald-700">
                    {segmentCount} segment{segmentCount > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Dynamic Insert Tags */}
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Insert Tag:</span>
                <button
                  type="button"
                  onClick={() => setMessageTemplate((prev) => prev + " {name}")}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition cursor-pointer"
                >
                  + &#123;name&#125;
                </button>
                <button
                  type="button"
                  onClick={() => setMessageTemplate((prev) => prev + " {phone}")}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition cursor-pointer"
                >
                  + &#123;phone&#125;
                </button>
                <button
                  type="button"
                  onClick={() => setMessageTemplate((prev) => prev + " {company}")}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition cursor-pointer"
                >
                  + &#123;company&#125;
                </button>
                <button
                  type="button"
                  onClick={() => setMessageTemplate((prev) => prev + " Reply STOP to opt-out.")}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 transition cursor-pointer ml-auto"
                >
                  + Opt-Out Notice
                </button>
              </div>

              {/* Message Textarea */}
              <textarea
                rows={7}
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                placeholder="Write your SMS message template here... Use {name} and {company} to personalize each text automatically."
                className="w-full p-4 text-xs sm:text-sm font-sans rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DF81] bg-white leading-relaxed"
              />

              {/* Cost & Deliverability Estimate */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Coins size={14} className="text-amber-500" />
                  <span>Cost estimate: ~$0.0085 per US message (~₹0.71 INR)</span>
                </span>
                <span className="font-bold text-slate-900">
                  Total batch est: ~${((recipients.length || 1) * segmentCount * 0.0085).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons: Save as Draft vs Send Bulk Campaign */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveDraftBatch}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Save size={15} />
                <span>Save as Draft Batch</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendBulkCampaign()}
                disabled={isSending}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#00DF81] hover:bg-[#00c271] text-slate-950 text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shadow-[#00DF81]/25 cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Sending Campaign ({sendingProgress.current}/{sendingProgress.total})...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Send Bulk SMS Campaign ({recipients.length || 0})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ⚡ LIVE QUEUE & REAL-TIME STATUS PREVIEW */}
      {/* ========================================================================= */}
      {recipients.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live Queue & Real-Time Delivery Preview</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800">
                  {recipients.length} Contacts
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time queue tracking showing total recipients, the immediate next message scheduled for dispatch, and live delivery status.
              </p>
            </div>

            {/* Quick Filter & Search */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={13} />
                <input
                  type="text"
                  placeholder="Search in queue..."
                  value={queueSearchQuery}
                  onChange={(e) => setQueueSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00DF81]"
                />
              </div>

              <select
                value={queueStatusFilter}
                onChange={(e) => setQueueStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-white"
              >
                <option value="all">All Status ({recipients.length})</option>
                <option value="pending">Pending ({queuePendingCount})</option>
                <option value="delivered">Delivered ({queueDeliveredCount})</option>
                <option value="failed">Failed ({queueFailedCount})</option>
              </select>
            </div>
          </div>

          {/* 3 Prominent Live Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Total Queue Volume */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Total in Queue
                </span>
                <span className="text-2xl font-black text-slate-900">
                  {recipients.length}
                </span>
                <span className="text-xs text-slate-500 block mt-0.5 truncate max-w-[200px]" title={selectedFileName || ""}>
                  From: {selectedFileName || "Uploaded File"}
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-700">
                <FileSpreadsheet size={20} />
              </div>
            </div>

            {/* Card 2: ⚡ NEXT TO BE SENT (Highlighted with green pulsing ring) */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-4 rounded-2xl border-2 border-emerald-300 shadow-sm relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider mb-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    <span>Next to be Sent</span>
                  </div>
                  {nextRecipient ? (
                    <div>
                      <h4 className="text-sm font-black text-slate-900 truncate" title={nextRecipient.name || "Recipient"}>
                        #{nextRecipientIndex + 1} {nextRecipient.name || nextRecipient.company || "Recipient"}
                      </h4>
                      <p className="text-xs font-mono font-bold text-emerald-800 mt-0.5">
                        {nextRecipient.phone}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                        <Clock size={11} className="text-emerald-700" />
                        <span>Scheduled with {delayDisplay} delay</span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-900 font-bold mt-2">
                      All messages in this queue have been dispatched!
                    </p>
                  )}
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0 ml-2">
                  <Send size={18} />
                </div>
              </div>
            </div>

            {/* Card 3: Real-Time Dispatch Status */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Queue Status Breakdown
              </span>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-base font-black text-slate-700 block">{queuePendingCount}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Pending</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-emerald-200 shadow-2xs">
                  <span className="text-base font-black text-emerald-600 block">{queueDeliveredCount}</span>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Delivered</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-rose-200 shadow-2xs">
                  <span className="text-base font-black text-rose-600 block">{queueFailedCount}</span>
                  <span className="text-[10px] font-bold text-rose-700 uppercase">Failed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Live Queue Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold">
                  <th className="p-3 whitespace-nowrap w-12 text-center">#</th>
                  <th className="p-3 whitespace-nowrap w-48">Recipient / Business</th>
                  <th className="p-3 whitespace-nowrap w-36">Phone Number</th>
                  <th className="p-3 whitespace-nowrap">Personalized Message Preview</th>
                  <th className="p-3 whitespace-nowrap w-40">Status</th>
                  <th className="p-3 whitespace-nowrap w-24 text-center">Delivered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredQueue.slice(0, queueDisplayLimit).map((r, idx) => {
                  const isCurrentNext = r === nextRecipient && !isSending;
                  const isCurrentlySending = r.status === "sending";

                  let previewText = r.customMessage || messageTemplate;
                  previewText = previewText
                    .replace(/\{name\}/gi, r.name || "there")
                    .replace(/\{company\}/gi, r.company || "your business")
                    .replace(/\{phone\}/gi, r.phone);

                  return (
                    <tr
                      key={idx}
                      className={
                        isCurrentlySending
                          ? "bg-blue-50/70 border-l-4 border-l-blue-600"
                          : isCurrentNext
                          ? "bg-emerald-50/60 border-l-4 border-l-emerald-500 font-medium"
                          : idx % 2 === 0
                          ? "bg-white"
                          : "bg-slate-50/50"
                      }
                    >
                      <td className="p-3 text-center font-mono text-slate-400 font-semibold">
                        {idx + 1}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <div className="font-bold text-slate-900 truncate max-w-[180px]">
                          {r.name || r.company || "Unnamed Lead"}
                        </div>
                        {r.company && r.name && r.company !== r.name && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                            {r.company}
                          </div>
                        )}
                      </td>

                      <td className="p-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                        {r.phone}
                      </td>

                      <td className="p-3 text-slate-600 max-w-md truncate" title={previewText}>
                        {previewText}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        {isCurrentlySending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
                            <RefreshCw size={11} className="animate-spin text-blue-600" />
                            <span>Sending...</span>
                          </span>
                        ) : isCurrentNext ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                            <span>⚡ Next to be Sent</span>
                          </span>
                        ) : r.status === "delivered" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            <span>Delivered</span>
                          </span>
                        ) : r.status === "failed" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-50 text-rose-700 border border-rose-200" title={r.error}>
                            <AlertCircle size={12} className="text-rose-600" />
                            <span>Failed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            <Clock size={11} className="text-slate-400" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-center whitespace-nowrap text-[11px] text-slate-500 font-mono">
                        {r.sentAt || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Show More / Pagination Footer */}
          {filteredQueue.length > queueDisplayLimit && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>
                Showing first <strong>{queueDisplayLimit}</strong> of <strong>{filteredQueue.length}</strong> contacts in queue
              </span>
              <button
                type="button"
                onClick={() => setQueueDisplayLimit((prev) => prev + 50)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition cursor-pointer"
              >
                Load Next 50 Contacts
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📊 2. HISTORY UPLOAD TABLE (Batch Name, Delays, Status, Sent, Delivered, Analytics) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 size={18} className="text-purple-600" />
              <span>Bulk Upload History & Deliverability Table</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review all uploaded CSV/Excel batches, pacing delays, delivery metrics, and analytics.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={13} />
              <input
                type="text"
                placeholder="Search batches..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00DF81]"
              />
            </div>

            <select
              value={historyStatusFilter}
              onChange={(e) => setHistoryStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="draft">Draft</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* The Exact Table with Required Columns */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="p-3.5 whitespace-nowrap">Batch Name</th>
                <th className="p-3.5 whitespace-nowrap">File & Recipients</th>
                <th className="p-3.5 whitespace-nowrap">Delays</th>
                <th className="p-3.5 whitespace-nowrap">Status</th>
                <th className="p-3.5 whitespace-nowrap">Sent</th>
                <th className="p-3.5 whitespace-nowrap">Delivered</th>
                <th className="p-3.5 whitespace-nowrap text-center">Analytics</th>
                <th className="p-3.5 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-slate-400 text-xs">
                    No batches match the search criteria.
                  </td>
                </tr>
              ) : (
                filteredBatches.map((batch) => {
                  const deliveryPct =
                    batch.sentCount > 0
                      ? Math.round((batch.deliveredCount / batch.sentCount) * 100)
                      : 0;

                  return (
                    <tr key={batch.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* 1. Batch Name */}
                      <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                          <span className="font-extrabold">{batch.batchName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block ml-4">
                          {batch.createdAt}
                        </span>
                      </td>

                      {/* 2. File & Recipients */}
                      <td className="p-3.5 text-slate-600 whitespace-nowrap">
                        <span className="font-medium text-slate-800 block truncate max-w-[180px]">
                          {batch.fileName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {batch.totalRecipients} contacts
                        </span>
                      </td>

                      {/* 3. Delays */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          <Clock size={12} className="text-emerald-600" />
                          <span>{batch.delayDisplay}</span>
                        </span>
                      </td>

                      {/* 4. Status */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            batch.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : batch.status === "in_progress"
                              ? "bg-blue-100 text-blue-800 animate-pulse"
                              : batch.status === "draft"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              batch.status === "completed"
                                ? "bg-emerald-600"
                                : batch.status === "in_progress"
                                ? "bg-blue-600"
                                : batch.status === "draft"
                                ? "bg-slate-500"
                                : "bg-rose-600"
                            }`}
                          />
                          <span>{batch.status.replace("_", " ")}</span>
                        </span>
                      </td>

                      {/* 5. Sent */}
                      <td className="p-3.5 font-mono font-bold text-slate-800 whitespace-nowrap">
                        {batch.sentCount} / {batch.totalRecipients}
                      </td>

                      {/* 6. Delivered */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {batch.deliveredCount}
                          </span>
                          <span
                            className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                              deliveryPct >= 90
                                ? "bg-emerald-50 text-emerald-700"
                                : deliveryPct >= 70
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {deliveryPct}%
                          </span>
                        </div>
                      </td>

                      {/* 7. Analytics */}
                      <td className="p-3.5 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={() => setAnalyticsBatch(batch)}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer border border-purple-200"
                        >
                          <BarChart3 size={13} />
                          <span>View Analytics</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {batch.status === "draft" && (
                            <button
                              type="button"
                              onClick={() => handleSendBulkCampaign(batch)}
                              disabled={isSending}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                              title="Send this batch now"
                            >
                              <Send size={11} />
                              <span>Send</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteBatch(batch.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Batch from History"
                          >
                            <Trash2 size={14} />
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

      {/* ========================================================================= */}
      {/* 📊 3. ANALYTICS MODAL (Detailed Breakdown, Recipient Delivery Logs) */}
      {/* ========================================================================= */}
      {analyticsBatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {analyticsBatch.batchName} Analytics
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    {analyticsBatch.delayDisplay}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  File: {analyticsBatch.fileName} · Launched: {analyticsBatch.createdAt}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAnalyticsBatch(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {/* Analytics Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Total Recipients
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    {analyticsBatch.totalRecipients}
                  </span>
                </div>

                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Delivered
                  </span>
                  <span className="text-xl font-black text-emerald-700">
                    {analyticsBatch.deliveredCount} (
                    {analyticsBatch.sentCount > 0
                      ? Math.round((analyticsBatch.deliveredCount / analyticsBatch.sentCount) * 100)
                      : 0}
                    %)
                  </span>
                </div>

                <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                    Failed / Bounced
                  </span>
                  <span className="text-xl font-black text-rose-700">
                    {analyticsBatch.failedCount}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Campaign Cost
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    ~${(analyticsBatch.sentCount * 0.0085).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Message Template Used */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">
                  Message Template Sent:
                </span>
                <p className="text-xs text-slate-600 font-mono leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                  {analyticsBatch.messageTemplate}
                </p>
              </div>

              {/* Recipient Breakdown Table */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-slate-900 block">
                  Recipient Delivery Breakdown
                </span>

                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold">
                        <th className="p-3">Phone</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Company</th>
                        <th className="p-3">Delivery Status</th>
                        <th className="p-3">Timestamp / Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {analyticsBatch.recipients.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-slate-400">
                            No individual recipient logs recorded for this batch.
                          </td>
                        </tr>
                      ) : (
                        analyticsBatch.recipients.map((r, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70">
                            <td className="p-3 font-mono font-bold text-slate-900">{r.phone}</td>
                            <td className="p-3 text-slate-800 font-medium">{r.name || "—"}</td>
                            <td className="p-3 text-slate-600">{r.company || "—"}</td>
                            <td className="p-3">
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  r.status === "delivered"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : r.status === "failed"
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {r.status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 text-[11px]">
                              {r.error ? (
                                <span className="text-rose-600 font-medium">{r.error}</span>
                              ) : (
                                r.sentAt || "Delivered successfully"
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setAnalyticsBatch(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close Analytics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recipient Preview Modal */}
      {viewRecipientsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Parsed Recipients ({recipients.length})
                </h3>
                <p className="text-xs text-slate-400">File: {selectedFileName}</p>
              </div>

              <button
                type="button"
                onClick={() => setViewRecipientsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <input
                type="text"
                placeholder="Search recipients by phone, name, or company..."
                value={recipientSearchQuery}
                onChange={(e) => setRecipientSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#00DF81]"
              />
            </div>

            <div className="p-4 overflow-y-auto max-h-96">
              <div className="space-y-2">
                {filteredPreviewRecipients.map((r, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs bg-slate-50/50"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-900 block">{r.phone}</span>
                      <span className="text-[11px] text-slate-500">
                        {r.name || "No Name"} {r.company ? `· ${r.company}` : ""}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Valid
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setViewRecipientsModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
