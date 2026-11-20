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
  Trash2,
  RefreshCw,
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Play,
  Pause,
  X,
  Phone,
  ArrowRight,
  Download,
  Bookmark,
  Info
} from "lucide-react";
import { PhoneLine, getAvailableLines } from "@/lib/phoneLines";
import { DEFAULT_TEMPLATES, SmsTemplate, TEMPLATES_STORAGE_KEY } from "./SmsTemplatesManager";

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
    fileName: "Tampa_HVAC_Leads_Nov.xlsx",
    delaySeconds: 1,
    delayDisplay: "1s delay",
    status: "completed",
    createdAt: "Today, 10:45 AM",
    senderNumber: "+13464770028",
    messageTemplate: "Hi {name}, our certified technicians are in Tampa this week for HVAC safety checks. Reply YES to book your slot!",
    totalRecipients: 45,
    sentCount: 45,
    deliveredCount: 44,
    failedCount: 1,
    recipients: [
      { phone: "+18135550192", name: "Marcus Vance", company: "Tampa HVAC Solutions", status: "delivered", sentAt: "10:45 AM" },
      { phone: "+18135550144", name: "Sarah Jenkins", company: "Bay Area Cooling", status: "delivered", sentAt: "10:46 AM" },
      { phone: "+17275550188", name: "Carlos Mendez", company: "Clearwater Refrigeration", status: "delivered", sentAt: "10:47 AM" }
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
  onOpenTemplates?: () => void;
  initialTemplate?: string | null;
}

export default function BulkSmsManager({
  onOpenFormatGuide,
  onOpenTemplates,
  initialTemplate
}: BulkSmsManagerProps) {
  // Batch List / History state
  const [batches, setBatches] = useState<SmsBatch[]>(INITIAL_BATCHES);
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>("all");

  // Saved Templates for Dropdown
  const [savedTemplates, setSavedTemplates] = useState<SmsTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedTemplates(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load templates from localStorage", e);
    }
  }, []);

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

  // Sample CSV & Excel download helpers
  const handleDownloadSampleCsv = () => {
    const csvContent =
      'Phone Number,Name,Company,Custom Message\n' +
      '+18135550192,"Marcus Vance","Tampa HVAC Solutions","Hi Marcus, your seasonal tune-up slot is confirmed."\n' +
      '+18135550144,"Sarah Jenkins","Bay Area Cooling","Hi Sarah, our commercial AC team is in Tampa tomorrow."\n' +
      '+17275550188,"Carlos Mendez","Clearwater Refrigeration","Carlos, special safety inspection on heat pumps available."\n' +
      '+919876543210,"Rajesh Kumar","Kumar Logistics","Hi Rajesh, your voice dispatch AI agent demo is live."';

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Spyke_Bulk_SMS_Sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("success", 'Downloaded "Spyke_Bulk_SMS_Sample.csv"!');
  };

  const handleDownloadSampleExcel = () => {
    const sampleRows = [
      {
        "Phone Number": "+18135550192",
        "Name": "Marcus Vance",
        "Company": "Tampa HVAC Solutions",
        "Custom Message": "Hi Marcus, your seasonal tune-up slot is confirmed."
      },
      {
        "Phone Number": "+18135550144",
        "Name": "Sarah Jenkins",
        "Company": "Bay Area Cooling",
        "Custom Message": "Hi Sarah, our commercial AC team is in Tampa tomorrow."
      },
      {
        "Phone Number": "+17275550188",
        "Name": "Carlos Mendez",
        "Company": "Clearwater Refrigeration",
        "Custom Message": "Carlos, special safety inspection on heat pumps available."
      },
      {
        "Phone Number": "+919876543210",
        "Name": "Rajesh Kumar",
        "Company": "Kumar Logistics",
        "Custom Message": "Hi Rajesh, your voice dispatch AI agent demo is live."
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Recipients");
    XLSX.writeFile(wb, "Spyke_Bulk_SMS_Sample.xlsx");
    showToast("success", 'Downloaded "Spyke_Bulk_SMS_Sample.xlsx"!');
  };

  const [selectedSender, setSelectedSender] = useState<string>("+13464770028");

  // Delay settings: customizable from 1 second to 1 minute or more
  const [delayAmount, setDelayAmount] = useState<number>(3);
  const [delayUnit, setDelayUnit] = useState<"seconds" | "minutes">("seconds");

  // Available Sender Lines
  const [availableLines] = useState<PhoneLine[]>(() => getAvailableLines("+13464770028"));

  // Modals & Queue View Toggle
  const [showQueueDetails, setShowQueueDetails] = useState(false);
  const [analyticsBatch, setAnalyticsBatch] = useState<SmsBatch | null>(null);
  const [viewingFileBatch, setViewingFileBatch] = useState<SmsBatch | null>(null);
  const [fileViewerSearch, setFileViewerSearch] = useState("");
  const [fileViewerLimit, setFileViewerLimit] = useState(50);

  // Live Sending Execution State
  const [isSending, setIsSending] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sendingProgress, setSendingProgress] = useState({ current: 0, total: 0, currentPhone: "", currentName: "" });
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Queue Search & Filtering
  const [queueSearchQuery, setQueueSearchQuery] = useState("");
  const [queueStatusFilter, setQueueStatusFilter] = useState<string>("all");
  const [queueDisplayLimit, setQueueDisplayLimit] = useState<number>(30);

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

            // Phone Column Check
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

          if (pIdx !== -1) {
            headerRowIdx = r;
            phoneColIdx = pIdx;
            if (nIdx !== -1) nameColIdx = nIdx;
            if (cIdx !== -1) companyColIdx = cIdx;
            if (mIdx !== -1) messageColIdx = mIdx;
            break;
          }
        }

        // 2. Fallback: scan column values for phone numbers
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
          if (digits.length < 10) continue;

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
    setSendingProgress({ current: 0, total: activeRecipients.length, currentPhone: "", currentName: "" });

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
      setSendingProgress({
        current: i + 1,
        total: activeRecipients.length,
        currentPhone: recipient.phone,
        currentName: recipient.name || ""
      });

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

  // Template character and segment calculations
  const charCount = messageTemplate.length;
  const isUnicode = /[^\u0000-\u007F]/.test(messageTemplate);
  const segmentLimit = isUnicode ? 70 : 160;
  const segmentCount = charCount === 0 ? 0 : Math.ceil(charCount / segmentLimit);
  const costPerSegment = 0.0085;
  const estimatedCost = (Math.max(1, segmentCount) * costPerSegment * (recipients.length || 1)).toFixed(2);

  // Filter batches for history table
  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.batchName.toLowerCase().includes(historySearch.toLowerCase()) ||
      b.fileName.toLowerCase().includes(historySearch.toLowerCase()) ||
      b.delayDisplay.toLowerCase().includes(historySearch.toLowerCase());
    const matchesStatus = historyStatusFilter === "all" || b.status === historyStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Live Queue Calculations
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
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200 ${
            toastMessage.type === "success"
              ? "bg-slate-900 text-white border-slate-700"
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

      {/* Live Campaign Sending Banner */}
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

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#00DF81] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${sendingProgress.total > 0 ? (sendingProgress.current / sendingProgress.total) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 1. BULK UPLOAD STUDIO CARD (Clean, Simple, Intuitive) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <UploadCloud size={18} className="text-[#00DF81]" />
              <span>Bulk SMS Campaign Studio</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload your spreadsheet, set your message & delay, and launch your campaign.
            </p>
          </div>

          {onOpenTemplates ? (
            <button
              type="button"
              onClick={onOpenTemplates}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition flex items-center gap-1.5 border border-emerald-200 cursor-pointer self-start sm:self-auto shadow-2xs"
            >
              <Bookmark size={13} className="text-emerald-600" />
              <span>Manage Templates</span>
              <ArrowRight size={12} className="text-emerald-600" />
            </button>
          ) : onOpenFormatGuide ? (
            <button
              type="button"
              onClick={onOpenFormatGuide}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 cursor-pointer self-start sm:self-auto"
            >
              <FileSpreadsheet size={13} className="text-emerald-600" />
              <span>View Format Guide</span>
            </button>
          ) : null}
        </div>

        {/* 2-Column Clean Studio Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols): File Upload, Batch Name, Delay Pacing */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. File Upload Dropzone */}
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
                className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-5 text-center bg-slate-50/50 hover:bg-emerald-50/20 transition-all cursor-pointer group space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center mx-auto text-emerald-600 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block truncate px-2">
                    {selectedFileName || "Click to browse or drop CSV / Excel"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Auto-detects Telephone, Name & Business columns
                  </span>
                </div>

                {recipients.length > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mt-1">
                    <CheckCircle2 size={13} />
                    <span>{recipients.length} contacts loaded</span>
                  </div>
                )}
              </div>

              {/* Sample Format Download Buttons */}
              <div className="flex items-center justify-between pt-2 px-0.5">
                <span className="text-[11px] font-semibold text-slate-500">Need template?</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleDownloadSampleCsv}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold border border-slate-200 transition cursor-pointer"
                    title="Download sample CSV format"
                  >
                    <Download size={11} className="text-slate-500" />
                    <span>Sample CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadSampleExcel}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition cursor-pointer"
                    title="Download sample Excel (.xlsx) format"
                  >
                    <Download size={11} className="text-emerald-600" />
                    <span>Sample Excel</span>
                  </button>
                </div>
              </div>

              {recipients.length > 0 && (
                <div className="flex items-center justify-between pt-1.5 px-1 text-xs">
                  <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1.5">
                    <span>File: <strong className="text-slate-800">{selectedFileName}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setViewingFileBatch({
                          id: "current-upload",
                          batchName: batchName || "Current Upload",
                          fileName: selectedFileName || "Uploaded_File.xlsx",
                          delaySeconds: totalDelaySeconds,
                          delayDisplay,
                          status: "draft",
                          createdAt: "Just now",
                          senderNumber: selectedSender,
                          messageTemplate,
                          totalRecipients: recipients.length,
                          sentCount: 0,
                          deliveredCount: 0,
                          failedCount: 0,
                          recipients,
                        });
                        setFileViewerSearch("");
                        setFileViewerLimit(50);
                      }}
                      className="w-5 h-5 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 flex items-center justify-center transition cursor-pointer shadow-2xs group"
                      title="Click to view uploaded spreadsheet contacts"
                    >
                      <Info size={11} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFileName(null);
                      setRecipients([]);
                    }}
                    className="text-[11px] font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* 2. Batch Name */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                <span>2. Batch Name *</span>
                <span className="text-[11px] font-normal text-slate-400">e.g. Batch-Tampa-1</span>
              </label>
              <input
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="e.g. Batch-Tampa-1"
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DF81] bg-slate-50/50"
              />
            </div>

            {/* 3. Delay Pacing */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock size={13} className="text-emerald-600" />
                  <span>3. Delay Between Each Message</span>
                </label>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {delayDisplay}
                </span>
              </div>

              {/* Clean Pill Presets */}
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: "1 sec", sec: 1, unit: "seconds" },
                  { label: "3 sec", sec: 3, unit: "seconds" },
                  { label: "5 sec", sec: 5, unit: "seconds" },
                  { label: "10 sec", sec: 10, unit: "seconds" },
                  { label: "30 sec", sec: 30, unit: "seconds" },
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
                    className={`py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      delayAmount === preset.sec && delayUnit === preset.unit
                        ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sender Line */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Sender Number Line
              </label>
              <div className="relative">
                <select
                  value={selectedSender}
                  onChange={(e) => setSelectedSender(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white appearance-none pr-8 cursor-pointer"
                >
                  {availableLines.map((line) => (
                    <option key={line.number} value={line.number}>
                      {line.flag} {line.formatted} ({line.label})
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Message Composer & Actions */}
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

              {/* Choose a Template Dropdown */}
              <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-emerald-950 flex items-center gap-1.5">
                    <Bookmark size={12} className="text-emerald-600" />
                    <span>Choose a Template</span>
                  </label>
                  {onOpenTemplates && (
                    <button
                      type="button"
                      onClick={onOpenTemplates}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Create / Edit in Templates</span>
                      <ArrowRight size={10} />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => {
                      const tplId = e.target.value;
                      setSelectedTemplateId(tplId);
                      if (tplId) {
                        const found = savedTemplates.find((t) => t.id === tplId);
                        if (found) {
                          setMessageTemplate(found.body);
                          showToast("info", `Applied template: "${found.name}"`);
                        }
                      }
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-emerald-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00DF81] appearance-none pr-8 cursor-pointer shadow-2xs"
                  >
                    <option value="">— Select a saved template (or write your own) —</option>
                    {savedTemplates.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    className="text-emerald-700 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                </div>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Insert:</span>
                <button
                  type="button"
                  onClick={() => setMessageTemplate((prev) => prev + " {name}")}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition cursor-pointer"
                >
                  + &#123;name&#125;
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

              {/* Textarea */}
              <textarea
                rows={6}
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                placeholder="Write your SMS message template here... Use {name} and {company} to personalize each text automatically."
                className="w-full p-3.5 text-xs sm:text-sm font-sans rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DF81] bg-white leading-relaxed resize-y"
              />

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Cost: ~$0.0085 per US segment</span>
                <span className="font-bold text-slate-800">
                  Total est: ~${estimatedCost}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveDraftBatch}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Save size={14} />
                <span>Save as Draft</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendBulkCampaign()}
                disabled={isSending}
                className="px-6 py-2.5 rounded-xl bg-[#00DF81] hover:bg-[#00c271] text-slate-950 text-xs font-extrabold transition flex items-center gap-2 shadow-md shadow-[#00DF81]/20 cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Sending ({sendingProgress.current}/{sendingProgress.total})...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send Bulk SMS Campaign ({recipients.length || 0})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ⚡ CLEAN LIVE STATUS & NEXT TO BE SENT BAR (Appears when file is attached) */}
        {/* ========================================================================= */}
        {recipients.length > 0 && (
          <div className="mt-4 pt-5 border-t border-slate-100 space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    <span>Next to be Sent</span>
                  </span>
                  {nextRecipient && (
                    <span className="text-xs font-bold text-slate-900">
                      #{nextRecipientIndex + 1} {nextRecipient.name || nextRecipient.company || "Lead"}{" "}
                      <span className="font-mono text-emerald-700 font-semibold">({nextRecipient.phone})</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Queue Status: <strong>{recipients.length} Total</strong> · <span className="text-slate-600">{queuePendingCount} Pending</span> · <span className="text-emerald-700 font-bold">{queueDeliveredCount} Delivered</span> · <span className="text-rose-600">{queueFailedCount} Failed</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowQueueDetails((prev) => !prev)}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 cursor-pointer shadow-2xs self-start md:self-auto"
              >
                <span>{showQueueDetails ? "Hide Queue Details" : `View Queue List (${recipients.length})`}</span>
                {showQueueDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* Expandable Live Queue Table */}
            {showQueueDetails && (
              <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={13} />
                    <input
                      type="text"
                      placeholder="Search queue..."
                      value={queueSearchQuery}
                      onChange={(e) => setQueueSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#00DF81]"
                    />
                  </div>

                  <select
                    value={queueStatusFilter}
                    onChange={(e) => setQueueStatusFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="all">All ({recipients.length})</option>
                    <option value="pending">Pending ({queuePendingCount})</option>
                    <option value="delivered">Delivered ({queueDeliveredCount})</option>
                    <option value="failed">Failed ({queueFailedCount})</option>
                  </select>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-slate-900 text-white font-bold">
                        <th className="p-2.5 whitespace-nowrap w-12 text-center">#</th>
                        <th className="p-2.5 whitespace-nowrap">Recipient / Business</th>
                        <th className="p-2.5 whitespace-nowrap">Phone Number</th>
                        <th className="p-2.5 whitespace-nowrap">Message Preview</th>
                        <th className="p-2.5 whitespace-nowrap">Status</th>
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
                                ? "bg-blue-50/70"
                                : isCurrentNext
                                ? "bg-emerald-50/60 font-semibold"
                                : idx % 2 === 0
                                ? "bg-white"
                                : "bg-slate-50/50"
                            }
                          >
                            <td className="p-2.5 text-center font-mono text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="p-2.5 whitespace-nowrap font-bold text-slate-900 truncate max-w-[160px]">
                              {r.name || r.company || "Lead"}
                            </td>
                            <td className="p-2.5 font-mono text-slate-800 whitespace-nowrap">
                              {r.phone}
                            </td>
                            <td className="p-2.5 text-slate-600 truncate max-w-xs" title={previewText}>
                              {previewText}
                            </td>
                            <td className="p-2.5 whitespace-nowrap">
                              {isCurrentlySending ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
                                  <RefreshCw size={10} className="animate-spin text-blue-600" />
                                  <span>Sending...</span>
                                </span>
                              ) : isCurrentNext ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                                  <span>⚡ Next Up</span>
                                </span>
                              ) : r.status === "delivered" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700">
                                  <CheckCircle2 size={10} />
                                  <span>Delivered</span>
                                </span>
                              ) : r.status === "failed" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700" title={r.error}>
                                  <AlertCircle size={10} />
                                  <span>Failed</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-semibold">
                                  Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredQueue.length > queueDisplayLimit && (
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Showing first {queueDisplayLimit} of {filteredQueue.length}</span>
                    <button
                      type="button"
                      onClick={() => setQueueDisplayLimit((prev) => prev + 50)}
                      className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 📊 2. HISTORY UPLOAD TABLE (Batch Name, Delays, Status, Sent, Delivered, Analytics) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 size={17} className="text-emerald-600" />
              <span>Bulk Upload History</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review all uploaded batches, pacing delays, delivery counts, and analytics.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={13} />
              <input
                type="text"
                placeholder="Search history..."
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
                <th className="p-3 whitespace-nowrap">Batch Name</th>
                <th className="p-3 whitespace-nowrap">File & Recipients</th>
                <th className="p-3 whitespace-nowrap">Delays</th>
                <th className="p-3 whitespace-nowrap">Status</th>
                <th className="p-3 whitespace-nowrap">Sent</th>
                <th className="p-3 whitespace-nowrap">Delivered</th>
                <th className="p-3 whitespace-nowrap">Analytics</th>
                <th className="p-3 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 text-xs font-medium">
                    No upload batches found matching search.
                  </td>
                </tr>
              ) : (
                filteredBatches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                      {b.batchName}
                      <span className="block text-[10px] text-slate-400 font-normal">{b.createdAt}</span>
                    </td>
                    <td className="p-3 text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-800 block truncate max-w-[220px]" title={b.fileName}>
                            {b.fileName}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{b.totalRecipients} recipients</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setViewingFileBatch(b);
                            setFileViewerSearch("");
                            setFileViewerLimit(50);
                          }}
                          className="w-6 h-6 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 flex items-center justify-center transition shrink-0 cursor-pointer shadow-2xs group"
                          title={`Click to view uploaded spreadsheet: ${b.fileName}`}
                        >
                          <Info size={13} className="text-slate-500 group-hover:text-emerald-700" />
                        </button>
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        <Clock size={11} className="text-slate-500" />
                        <span>{b.delayDisplay}</span>
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          b.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : b.status === "in_progress"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : b.status === "draft"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {b.status === "completed" && <CheckCircle2 size={11} />}
                        {b.status === "in_progress" && <RefreshCw size={11} className="animate-spin" />}
                        <span>{b.status.replace("_", " ")}</span>
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">
                      {b.sentCount}
                    </td>
                    <td className="p-3 font-bold text-emerald-600 whitespace-nowrap">
                      {b.deliveredCount}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setAnalyticsBatch(b)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 transition cursor-pointer flex items-center gap-1"
                      >
                        <BarChart3 size={12} />
                        <span>View Analytics</span>
                      </button>
                    </td>
                    <td className="p-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === "draft" && (
                          <button
                            type="button"
                            onClick={() => handleSendBulkCampaign(b)}
                            className="px-2.5 py-1 bg-[#00DF81] hover:bg-[#00c271] text-slate-950 text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
                          >
                            Send
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteBatch(b.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete Batch"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Modal */}
      {analyticsBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">{analyticsBatch.batchName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{analyticsBatch.fileName} · {analyticsBatch.delayDisplay}</p>
              </div>
              <button
                type="button"
                onClick={() => setAnalyticsBatch(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-xl transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Total</span>
                <span className="text-lg font-black text-slate-900">{analyticsBatch.totalRecipients}</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                <span className="text-xs text-emerald-700 font-bold uppercase block mb-1">Delivered</span>
                <span className="text-lg font-black text-emerald-700">{analyticsBatch.deliveredCount}</span>
              </div>
              <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200">
                <span className="text-xs text-rose-700 font-bold uppercase block mb-1">Failed</span>
                <span className="text-lg font-black text-rose-700">{analyticsBatch.failedCount}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Message Template</span>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">{analyticsBatch.messageTemplate}</p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setAnalyticsBatch(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📄 Viewing Uploaded Excel / CSV File Modal */}
      {viewingFileBatch && (() => {
        const batch = viewingFileBatch;
        // Determine recipient rows
        const rawList = (batch.recipients && batch.recipients.length > 0)
          ? batch.recipients
          : [
              { phone: "+18135550192", name: "Marcus Vance", company: "Tampa HVAC Solutions", status: "delivered" as const },
              { phone: "+18135550144", name: "Sarah Jenkins", company: "Bay Area Cooling", status: "delivered" as const },
              { phone: "+17275550188", name: "Carlos Mendez", company: "Clearwater Refrigeration", status: "delivered" as const },
              { phone: "+18135550155", name: "David Ross", company: "Florida Climate Tech", status: "delivered" as const },
              { phone: "+18135550166", name: "Emily Clark", company: "Gulf Coast Mechanical", status: "pending" as const },
            ];

        const q = fileViewerSearch.toLowerCase().trim();
        const filtered = rawList.filter((r) => {
          if (!q) return true;
          return (
            r.phone.toLowerCase().includes(q) ||
            (r.name && r.name.toLowerCase().includes(q)) ||
            (r.company && r.company.toLowerCase().includes(q)) ||
            (r.customMessage && r.customMessage.toLowerCase().includes(q))
          );
        });

        const displayed = filtered.slice(0, fileViewerLimit);

        const handleExportBatchExcel = () => {
          const exportData = rawList.map((r, i) => ({
            "#": i + 1,
            "Phone Number": r.phone,
            "Contact Name": r.name || "",
            "Business / Company": r.company || "",
            "Custom Message": r.customMessage || batch.messageTemplate,
            "Delivery Status": r.status || "pending"
          }));
          const ws = XLSX.utils.json_to_sheet(exportData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Contacts");
          const safeName = (batch.fileName || batch.batchName || "Contacts").replace(/\.[^/.]+$/, "");
          XLSX.writeFile(wb, `${safeName}_Export.xlsx`);
          showToast("success", `Exported ${exportData.length} contacts to Excel!`);
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 overflow-hidden">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 truncate max-w-md">
                        {batch.fileName}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {batch.totalRecipients || rawList.length} Contacts
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Batch: <strong className="text-slate-700">{batch.batchName}</strong> · Added: {batch.createdAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportBatchExcel}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Download this batch as Excel"
                  >
                    <Download size={13} className="text-emerald-600" />
                    <span>Download Excel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewingFileBatch(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Toolbar: Search & Info */}
              <div className="px-4 sm:px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={13} />
                  <input
                    type="text"
                    placeholder="Search name, phone, or company in file..."
                    value={fileViewerSearch}
                    onChange={(e) => setFileViewerSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="hidden sm:inline-block text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold">
                    ↔ Side scroll to view all columns
                  </span>
                  <span>Showing {displayed.length} of {filtered.length} rows</span>
                </div>
              </div>

              {/* Table Data Preview with Side Scrollbar */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                <div className="rounded-2xl border border-slate-200 overflow-x-auto shadow-2xs bg-white">
                  <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold">
                        <th className="p-2.5 text-center w-12 shrink-0">#</th>
                        <th className="p-2.5 whitespace-nowrap min-w-[180px]">Contact Name</th>
                        <th className="p-2.5 whitespace-nowrap min-w-[180px]">Company / Business</th>
                        <th className="p-2.5 whitespace-nowrap min-w-[140px]">Phone Number</th>
                        <th className="p-2.5 whitespace-nowrap min-w-[260px]">Custom Message</th>
                        <th className="p-2.5 whitespace-nowrap min-w-[90px] text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {displayed.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                            No matching contacts found in this file.
                          </td>
                        </tr>
                      ) : (
                        displayed.map((r, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition">
                            <td className="p-2.5 text-center font-mono text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="p-2.5 font-bold text-slate-900 whitespace-nowrap">
                              {r.name || "—"}
                            </td>
                            <td className="p-2.5 text-slate-600 whitespace-nowrap">
                              {r.company || "—"}
                            </td>
                            <td className="p-2.5 font-mono text-emerald-700 font-semibold whitespace-nowrap">
                              {r.phone}
                            </td>
                            <td className="p-2.5 text-slate-600 truncate max-w-xs" title={r.customMessage || batch.messageTemplate}>
                              {r.customMessage || batch.messageTemplate || "—"}
                            </td>
                            <td className="p-2.5 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  r.status === "delivered"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : r.status === "failed"
                                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                                    : "bg-slate-100 text-slate-600 border border-slate-200"
                                }`}
                              >
                                {r.status || "pending"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {filtered.length > fileViewerLimit && (
                  <div className="flex items-center justify-center pt-4">
                    <button
                      type="button"
                      onClick={() => setFileViewerLimit((prev) => prev + 50)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                    >
                      Load More Rows (+50)
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Total File Records: <strong>{batch.totalRecipients || rawList.length}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setViewingFileBatch(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
