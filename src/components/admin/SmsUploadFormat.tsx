"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Sparkles,
  Save,
  Plus,
  Trash2,
  ArrowRight,
  Edit3,
  Copy,
  Check,
  RotateCcw,
  MessageSquare,
  Bookmark,
  ChevronDown
} from "lucide-react";

export interface ContactRow {
  id: string;
  phone: string;
  name: string;
  company: string;
  customMessage: string;
}

export interface SmsContentDraft {
  id: string;
  name: string;
  template: string;
  updatedAt: string;
}

const INITIAL_SAVED_DRAFTS: SmsContentDraft[] = [
  {
    id: "draft-1",
    name: "Draft-Tampa-1",
    template: "Hi {name}, our certified technicians are in Tampa this week for HVAC safety checks. Reply YES to book your slot!",
    updatedAt: "Just now"
  },
  {
    id: "draft-2",
    name: "Lead-Priority-FollowUp",
    template: "Hi {name}, following up on your inquiry with {company}. Would 2 PM or 4 PM work better for a quick 5-min review? Reply STOP to cancel.",
    updatedAt: "Yesterday"
  },
  {
    id: "draft-3",
    name: "Emergency-Dispatch-Alert",
    template: "Urgent: A service technician from {company} has been assigned to your area. Please confirm availability at spykeai.com/confirm",
    updatedAt: "Nov 15"
  }
];

const INITIAL_SAMPLE_ROWS: ContactRow[] = [
  {
    id: "row-1",
    phone: "+1 (813) 555-0192",
    name: "Marcus Vance",
    company: "Tampa HVAC Solutions",
    customMessage: "Hi Marcus, noticed your seasonal HVAC maintenance is due this week. Priority morning slot available."
  },
  {
    id: "row-2",
    phone: "+1 (813) 555-0144",
    name: "Sarah Jenkins",
    company: "Bay Area Cooling",
    customMessage: "Hi Sarah, our commercial AC inspection crew is in Tampa tomorrow. Reply YES to confirm."
  },
  {
    id: "row-3",
    phone: "+1 (727) 555-0188",
    name: "Carlos Mendez",
    company: "Clearwater Refrigeration",
    customMessage: "Carlos, special $49 safety check on commercial heat pumps this Friday for Clearwater accounts."
  },
  {
    id: "row-4",
    phone: "+91 98765 43210",
    name: "Rajesh Kumar",
    company: "Kumar Logistics",
    customMessage: "Hi Rajesh, your voice dispatch AI agent demo is live and ready for testing."
  }
];

interface SmsUploadFormatProps {
  onSwitchToBulk?: () => void;
  onApplyDraftToBulk?: (draftTemplate: string) => void;
}

export default function SmsUploadFormat({ onSwitchToBulk, onApplyDraftToBulk }: SmsUploadFormatProps) {
  // Drafting Mode: "upload" (master template for upload) vs "each_message" (custom message per row)
  const [draftMode, setDraftMode] = useState<"upload" | "each_message">("upload");

  // Upload Level Draft State
  const [draftTitle, setDraftTitle] = useState("Draft-Tampa-1");
  const [uploadDraftContent, setUploadDraftContent] = useState(
    "Hi {name}, our certified technicians are in Tampa this week for HVAC safety checks. Reply YES to book your slot!"
  );

  // Saved Drafts Library
  const [savedDrafts, setSavedDrafts] = useState<SmsContentDraft[]>(INITIAL_SAVED_DRAFTS);
  const [selectedDraftId, setSelectedDraftId] = useState<string>("draft-1");

  // Row by row contacts list (with custom drafted content for each recipient)
  const [sampleRows, setSampleRows] = useState<ContactRow[]>(INITIAL_SAMPLE_ROWS);

  // UI notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Load saved drafts from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("spyke_sms_upload_drafts_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedDrafts(parsed);
          setSelectedDraftId(parsed[0].id);
          setDraftTitle(parsed[0].name);
          setUploadDraftContent(parsed[0].template);
        }
      }
    } catch (e) {
      console.error("Failed to load drafts from localStorage", e);
    }
  }, []);

  // Save drafts to localStorage helper
  const persistDrafts = (updated: SmsContentDraft[]) => {
    setSavedDrafts(updated);
    try {
      localStorage.setItem("spyke_sms_upload_drafts_v1", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save drafts to localStorage", e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Switch active draft from dropdown
  const handleSelectDraft = (draftId: string) => {
    setSelectedDraftId(draftId);
    if (draftId === "new") {
      setDraftTitle(`Draft-${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}-1`);
      setUploadDraftContent("");
      return;
    }
    const found = savedDrafts.find((d) => d.id === draftId);
    if (found) {
      setDraftTitle(found.name);
      setUploadDraftContent(found.template);
    }
  };

  // Save or update draft
  const handleSaveDraft = () => {
    const trimmedTitle = draftTitle.trim() || "Untitled-Draft";
    const existingIndex = savedDrafts.findIndex((d) => d.id === selectedDraftId);

    let updated: SmsContentDraft[];
    if (existingIndex !== -1 && selectedDraftId !== "new") {
      updated = savedDrafts.map((d) =>
        d.id === selectedDraftId
          ? { ...d, name: trimmedTitle, template: uploadDraftContent, updatedAt: "Just now" }
          : d
      );
    } else {
      const newDraft: SmsContentDraft = {
        id: `draft-${Date.now()}`,
        name: trimmedTitle,
        template: uploadDraftContent,
        updatedAt: "Just now"
      };
      updated = [newDraft, ...savedDrafts];
      setSelectedDraftId(newDraft.id);
    }

    persistDrafts(updated);
    showToast(`Draft "${trimmedTitle}" saved successfully!`);
  };

  // Delete draft
  const handleDeleteDraft = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedDrafts.length <= 1) {
      alert("At least one draft must remain.");
      return;
    }
    const filtered = savedDrafts.filter((d) => d.id !== id);
    persistDrafts(filtered);
    if (selectedDraftId === id) {
      setSelectedDraftId(filtered[0].id);
      setDraftTitle(filtered[0].name);
      setUploadDraftContent(filtered[0].template);
    }
    showToast("Draft deleted.");
  };

  // Copy draft text to clipboard
  const handleCopyDraft = () => {
    navigator.clipboard.writeText(uploadDraftContent);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
    showToast("Draft text copied to clipboard!");
  };

  // Apply master draft to all sample rows
  const handleApplyDraftToAllRows = () => {
    const updated = sampleRows.map((r) => ({
      ...r,
      customMessage: uploadDraftContent
        .replace(/\{name\}/gi, r.name || "Customer")
        .replace(/\{company\}/gi, r.company || "Company")
        .replace(/\{phone\}/gi, r.phone)
    }));
    setSampleRows(updated);
    showToast("Master draft applied to all message rows below!");
  };

  // Update a single recipient row's field
  const handleUpdateRow = (id: string, field: keyof ContactRow, value: string) => {
    setSampleRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // Add a new row
  const handleAddRow = () => {
    const newRow: ContactRow = {
      id: `row-${Date.now()}`,
      phone: "+1 (813) 555-0100",
      name: "New Client",
      company: "Acme Corp",
      customMessage: uploadDraftContent
        ? uploadDraftContent.replace(/\{name\}/gi, "New Client").replace(/\{company\}/gi, "Acme Corp")
        : "Hello, this is a drafted custom message for this contact."
    };
    setSampleRows((prev) => [...prev, newRow]);
    showToast("New recipient row added.");
  };

  // Delete row
  const handleDeleteRow = (id: string) => {
    if (sampleRows.length <= 1) {
      alert("At least one recipient row is required.");
      return;
    }
    setSampleRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Send drafted content to Bulk tab
  const handleSendDraftToBulk = () => {
    if (onApplyDraftToBulk) {
      onApplyDraftToBulk(uploadDraftContent);
    } else if (onSwitchToBulk) {
      onSwitchToBulk();
    }
    showToast("Switched to Bulk Campaign with drafted content loaded!");
  };

  // Download Sample CSV containing actual drafted content
  const handleDownloadCsv = () => {
    const headers = ["Phone Number", "Name", "Company", "Custom Message"];
    const rows = sampleRows.map((row) => [
      `"${row.phone.replace(/"/g, '""')}"`,
      `"${row.name.replace(/"/g, '""')}"`,
      `"${row.company.replace(/"/g, '""')}"`,
      `"${(row.customMessage || uploadDraftContent).replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filename = `${draftTitle.trim() || "Sample_SMS_Format"}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded "${filename}" with your drafted content!`);
  };

  // Download Sample Excel (.xlsx) containing actual drafted content
  const handleDownloadExcel = () => {
    const exportData = sampleRows.map((row) => ({
      "Phone Number": row.phone,
      "Name": row.name,
      "Company": row.company,
      "Custom Message": row.customMessage || uploadDraftContent
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SMS_Recipients");
    const filename = `${draftTitle.trim() || "Sample_SMS_Format"}.xlsx`;
    XLSX.writeFile(wb, filename);
    showToast(`Downloaded "${filename}" with your drafted content!`);
  };

  // Message length calculations
  const charCount = uploadDraftContent.length;
  const isUnicode = /[^\u0000-\u007F]/.test(uploadDraftContent);
  const segmentLimit = isUnicode ? 70 : 160;
  const segmentCount = charCount === 0 ? 0 : Math.ceil(charCount / segmentLimit);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-[#00DF81]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR: Title, Actions & File Downloads */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-[#00DF81]" />
              <span>SMS Upload Format & Content Drafter</span>
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              CSV & Excel
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Draft content for your campaign upload or customize individual messages, then download ready-to-use sample spreadsheets.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-200 cursor-pointer shadow-2xs"
            title="Download CSV populated with drafted content"
          >
            <Download size={14} className="text-slate-600" />
            <span>Download CSV</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadExcel}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#00DF81] hover:bg-[#00c271] text-slate-950 text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-md shadow-[#00DF81]/20 cursor-pointer"
            title="Download Excel spreadsheet populated with drafted content"
          >
            <FileSpreadsheet size={15} />
            <span>Download Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* DRAFTING MODE SELECTOR TABS */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setDraftMode("upload")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              draftMode === "upload"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles size={14} className={draftMode === "upload" ? "text-[#00DF81]" : "text-slate-400"} />
            <span>Draft Content for Upload (Campaign Template)</span>
          </button>

          <button
            type="button"
            onClick={() => setDraftMode("each_message")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              draftMode === "each_message"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Edit3 size={14} className={draftMode === "each_message" ? "text-[#00DF81]" : "text-slate-400"} />
            <span>Draft Content for Each Message (Row-by-Row)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {sampleRows.length}
            </span>
          </button>
        </div>

        {draftMode === "each_message" && (
          <button
            type="button"
            onClick={handleAddRow}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Plus size={13} />
            <span>Add Recipient Row</span>
          </button>
        )}
      </div>

      {/* MODE 1: DRAFT CONTENT FOR UPLOAD */}
      {draftMode === "upload" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Draft Editor (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            {/* Top row: Draft Name & Saved Drafts selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Draft Title / Batch Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="e.g. Batch-Tampa-1 or HVAC-TuneUp-Draft"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
                  />
                </div>
              </div>

              <div className="sm:w-60">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Saved Drafts
                </label>
                <div className="relative">
                  <select
                    value={selectedDraftId}
                    onChange={(e) => handleSelectDraft(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none appearance-none pr-8 cursor-pointer"
                  >
                    {savedDrafts.map((d) => (
                      <option key={d.id} value={d.id}>
                        📑 {d.name} ({d.updatedAt})
                      </option>
                    ))}
                    <option value="new">✏️ + Start New Draft...</option>
                  </select>
                  <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Dynamic Tag Chips */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Sparkles size={12} className="text-emerald-500" />
                <span>Insert Tag:</span>
              </span>
              <button
                type="button"
                onClick={() => setUploadDraftContent((prev) => prev + " {name}")}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition cursor-pointer"
              >
                + &#123;name&#125;
              </button>
              <button
                type="button"
                onClick={() => setUploadDraftContent((prev) => prev + " {phone}")}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition cursor-pointer"
              >
                + &#123;phone&#125;
              </button>
              <button
                type="button"
                onClick={() => setUploadDraftContent((prev) => prev + " {company}")}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition cursor-pointer"
              >
                + &#123;company&#125;
              </button>
              <button
                type="button"
                onClick={() => setUploadDraftContent((prev) => prev + " Reply STOP to opt-out.")}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 transition cursor-pointer ml-auto"
              >
                + Opt-Out Notice
              </button>
            </div>

            {/* Draft Content Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Message Content Draft
                </label>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span>{charCount} chars</span>
                  <span>·</span>
                  <span className="font-bold text-emerald-700">
                    {segmentCount} segment{segmentCount > 1 ? "s" : ""}
                  </span>
                  <span>({segmentLimit} chars/seg)</span>
                </div>
              </div>
              <textarea
                rows={6}
                value={uploadDraftContent}
                onChange={(e) => setUploadDraftContent(e.target.value)}
                placeholder="Write or draft your SMS message content here for your upload... Use {name} and {company} to personalize each recipient."
                className="w-full p-4 text-xs sm:text-sm font-sans rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DF81] bg-white leading-relaxed resize-y"
              />
            </div>

            {/* Draft Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Save size={13} />
                  <span>Save Draft</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedDraft ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{copiedDraft ? "Copied!" : "Copy"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplyDraftToAllRows}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition flex items-center gap-1.5 cursor-pointer"
                  title="Copy this draft into all sample table rows"
                >
                  <RotateCcw size={13} />
                  <span>Apply to Rows Below</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleSendDraftToBulk}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs ml-auto"
              >
                <span>Use in Bulk Upload</span>
                <ArrowRight size={13} className="text-[#00DF81]" />
              </button>
            </div>
          </div>

          {/* Right Column: Handset Preview & Saved Versions (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Phone Simulator Preview */}
            <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-lg border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 text-[11px]">
                  <span className="font-mono">Live Mobile Preview</span>
                  <span className="text-[#00DF81] font-bold">Telnyx SMS</span>
                </div>
                <div className="mt-4 p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700 text-xs text-slate-100 leading-relaxed font-sans shadow-inner">
                  {uploadDraftContent ? (
                    uploadDraftContent
                      .replace(/\{name\}/gi, "Marcus")
                      .replace(/\{company\}/gi, "Tampa HVAC Solutions")
                      .replace(/\{phone\}/gi, "+1 (813) 555-0192")
                  ) : (
                    <span className="text-slate-500 italic">
                      Type drafted content to see preview here...
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Personalized: <strong>Marcus</strong></span>
                <span className="text-emerald-400 font-bold">Delivered</span>
              </div>
            </div>

            {/* Saved Drafts List */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Bookmark size={13} className="text-emerald-600" />
                  <span>Drafted Templates ({savedDrafts.length})</span>
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {savedDrafts.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelectDraft(d.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                      selectedDraftId === d.id
                        ? "bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-medium"
                    }`}
                  >
                    <div className="truncate mr-2">
                      <p className="truncate">{d.name}</p>
                      <p className="text-[10px] text-slate-400 font-normal truncate">{d.template.slice(0, 45)}...</p>
                    </div>
                    {savedDrafts.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteDraft(d.id, e)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                        title="Delete draft"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: DRAFT CONTENT FOR EACH MESSAGE (ROW-BY-ROW TABLE) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Edit3 size={16} className="text-emerald-600" />
              <span>Draft Content for Each Message (Spreadsheet Rows)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit the custom message content directly for each contact. When you click Download, these drafted messages are saved directly into your CSV or Excel file.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddRow}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Row</span>
            </button>

            {onSwitchToBulk && (
              <button
                type="button"
                onClick={onSwitchToBulk}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Go to Bulk</span>
                <ArrowRight size={13} className="text-[#00DF81]" />
              </button>
            )}
          </div>
        </div>

        {/* Editable Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="p-3 whitespace-nowrap w-12 text-center">#</th>
                <th className="p-3 whitespace-nowrap w-44">Phone Number *</th>
                <th className="p-3 whitespace-nowrap w-36">Name</th>
                <th className="p-3 whitespace-nowrap w-44">Company</th>
                <th className="p-3 whitespace-nowrap">Drafted Custom Message (for this recipient)</th>
                <th className="p-3 whitespace-nowrap w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {sampleRows.map((row, idx) => (
                <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  <td className="p-3 text-center font-mono text-slate-400 font-semibold">{idx + 1}</td>

                  {/* Phone */}
                  <td className="p-2.5">
                    <input
                      type="text"
                      value={row.phone}
                      onChange={(e) => handleUpdateRow(row.id, "phone", e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </td>

                  {/* Name */}
                  <td className="p-2.5">
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => handleUpdateRow(row.id, "name", e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </td>

                  {/* Company */}
                  <td className="p-2.5">
                    <input
                      type="text"
                      value={row.company}
                      onChange={(e) => handleUpdateRow(row.id, "company", e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </td>

                  {/* Drafted Custom Message */}
                  <td className="p-2.5">
                    <div className="relative">
                      <textarea
                        rows={2}
                        value={row.customMessage}
                        onChange={(e) => handleUpdateRow(row.id, "customMessage", e.target.value)}
                        placeholder="Draft specific text for this person..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none font-sans leading-relaxed"
                      />
                      <span className="absolute bottom-1 right-2 text-[10px] text-slate-400 font-mono">
                        {row.customMessage.length}c
                      </span>
                    </div>
                  </td>

                  {/* Delete Row */}
                  <td className="p-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(row.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Remove row"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
