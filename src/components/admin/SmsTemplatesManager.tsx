"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Save,
  Trash2,
  Edit3,
  Copy,
  Check,
  Sparkles,
  CheckCircle2,
  Phone,
  Bookmark
} from "lucide-react";

import {
  SmsTemplate,
  DEFAULT_TEMPLATES,
  TEMPLATES_STORAGE_KEY,
} from "@/lib/smsTemplates";

export type { SmsTemplate };
export { DEFAULT_TEMPLATES, TEMPLATES_STORAGE_KEY };

interface SmsTemplatesManagerProps {
  onUseInBulk?: (templateBody: string) => void;
}

export default function SmsTemplatesManager({ onUseInBulk }: SmsTemplatesManagerProps) {
  const isSuperadminUser =
    typeof document !== "undefined" &&
    document.cookie.split(";").some((c) => {
      const trimmed = c.trim();
      return trimmed.startsWith("portal_role=superadmin") || trimmed.startsWith("admin_session=");
    });

  const [templates, setTemplates] = useState<SmsTemplate[]>(DEFAULT_TEMPLATES);
  const [activeTemplateId, setActiveTemplateId] = useState<string>("tpl-1");
  const [templateName, setTemplateName] = useState("Medical Spa / Client Outreach");
  const [templateBody, setTemplateBody] = useState(
    "Hi {name}, our aesthetic specialists in Dallas have priority consultation slots available this week. Reply YES to reserve your appointment!"
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [syncingCloud, setSyncingCloud] = useState(false);

  // Helper to determine currently logged in user name across all portals
  const getCurrentUserName = (): string => {
    if (typeof document === "undefined") return "Super Admin";
    try {
      const cookies = document.cookie.split(";").reduce((acc: Record<string, string>, c) => {
        const [k, v] = c.trim().split("=");
        if (k && v) {
          try {
            acc[k] = decodeURIComponent(v);
          } catch {
            acc[k] = v;
          }
        }
        return acc;
      }, {});

      const name = cookies["portal_user_name"] || cookies["admin_user"] || cookies["portal_name"];
      if (name && name.trim()) return name.trim();
      const role = cookies["portal_role"] || cookies["admin_role"];
      if (role === "superadmin" || isSuperadminUser) return "Super Admin";
      return "Tushar rawat";
    } catch {
      return "User";
    }
  };

  // Load from localStorage immediately for instant display, then sync with Cloud Storage
  useEffect(() => {
    // 1. Instant local cache load
    try {
      const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTemplates(parsed);
          setActiveTemplateId(parsed[0].id);
          setTemplateName(parsed[0].name);
          setTemplateBody(parsed[0].body);
        }
      }
    } catch (e) {
      console.error("Failed to load templates from localStorage", e);
    }

    // 2. Fetch shared cloud templates so all portals see the exact same list
    setSyncingCloud(true);
    fetch("/api/sms/templates")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.templates) && data.templates.length > 0) {
          setTemplates(data.templates);
          try {
            localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(data.templates));
          } catch {}

          // Ensure active template remains valid
          setActiveTemplateId((prevId) => {
            const exists = data.templates.find((t: SmsTemplate) => t.id === prevId);
            if (exists) {
              setTemplateName(exists.name);
              setTemplateBody(exists.body);
              return prevId;
            } else {
              setTemplateName(data.templates[0].name);
              setTemplateBody(data.templates[0].body);
              return data.templates[0].id;
            }
          });
        }
      })
      .catch((err) => console.error("Failed to sync shared cloud templates:", err))
      .finally(() => setSyncingCloud(false));
  }, []);

  const persistTemplates = (updated: SmsTemplate[]) => {
    setTemplates(updated);
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save templates", e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Select a template from the list
  const handleSelectTemplate = (tpl: SmsTemplate) => {
    setActiveTemplateId(tpl.id);
    setTemplateName(tpl.name);
    setTemplateBody(tpl.body);
  };

  // Start a new template
  const handleNewTemplate = () => {
    setActiveTemplateId("new");
    setTemplateName("New Template");
    setTemplateBody("");
  };

  // Save or update template (persists locally and syncs to cloud storage for all portals)
  const handleSaveTemplate = async () => {
    const trimmedName = templateName.trim() || "Untitled Template";
    if (!templateBody.trim()) {
      showToast("Please enter message content for this template.");
      return;
    }

    const currentAuthor = getCurrentUserName();
    let templateToSave: SmsTemplate;

    if (activeTemplateId === "new") {
      templateToSave = {
        id: "tpl-" + Date.now(),
        name: trimmedName,
        body: templateBody,
        updatedAt: "Just now",
        createdBy: currentAuthor,
      };
    } else {
      const existing = templates.find((t) => t.id === activeTemplateId);
      templateToSave = {
        id: activeTemplateId,
        name: trimmedName,
        body: templateBody,
        updatedAt: "Just now",
        createdBy: existing?.createdBy || currentAuthor,
      };
    }

    // Optimistic local update
    const updated =
      activeTemplateId === "new"
        ? [templateToSave, ...templates]
        : templates.map((t) => (t.id === activeTemplateId ? templateToSave : t));

    persistTemplates(updated);
    setActiveTemplateId(templateToSave.id);
    showToast(`Template "${trimmedName}" saved and shared with all portals!`);

    // Sync to Cloud Storage so Tushar and all other users see it immediately
    try {
      const res = await fetch("/api/sms/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: templateToSave }),
      });
      const data = await res.json();
      if (data.ok && Array.isArray(data.templates)) {
        setTemplates(data.templates);
        try {
          localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(data.templates));
        } catch {}
      }
    } catch (err) {
      console.error("Failed to sync template to cloud:", err);
    }
  };

  // Delete template
  const handleDeleteTemplate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (templates.length <= 1) {
      alert("At least one template must remain.");
      return;
    }
    const filtered = templates.filter((t) => t.id !== id);
    persistTemplates(filtered);
    if (activeTemplateId === id) {
      handleSelectTemplate(filtered[0]);
    }
    showToast("Template removed.");

    // Sync delete to Cloud Storage
    try {
      const res = await fetch(`/api/sms/templates?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok && Array.isArray(data.templates)) {
        setTemplates(data.templates);
        try {
          localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(data.templates));
        } catch {}
      }
    } catch (err) {
      console.error("Failed to delete template from cloud:", err);
    }
  };

  // Copy text to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(templateBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("Template copied to clipboard!");
  };

  // Character and segment calculations
  const charCount = templateBody.length;
  const isUnicode = /[^\u0000-\u007F]/.test(templateBody);
  const segmentLimit = isUnicode ? 70 : 160;
  const segmentCount = charCount === 0 ? 0 : Math.ceil(charCount / segmentLimit);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-[#00DF81]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Bookmark size={20} className="text-[#00DF81]" />
              <span>SMS Templates</span>
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Shared Across All Portals
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, and organize reusable SMS templates. Any template created by Super Admin, Tushar, or another team member is globally synchronized across all portals and in the Bulk Campaign dropdown.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewTemplate}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus size={14} className="text-[#00DF81]" />
          <span>Create New Template</span>
        </button>
      </div>

      {/* Main 2-Column Studio: Editor on Left, Live Mobile Preview & Templates List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template Definition & Editor (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Template Name *</span>
              <span className="text-[11px] font-normal text-slate-400">e.g. HVAC Safety Tune-Up</span>
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g. Customer Appointment Follow-Up"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
            />
          </div>

          {/* Quick Insert Tag Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 block">Personalized Dynamic Tags:</span>
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setTemplateBody((prev) => prev + " {name}")}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition cursor-pointer"
              >
                + &#123;name&#125;
              </button>
              <button
                type="button"
                onClick={() => setTemplateBody((prev) => prev + " {company}")}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition cursor-pointer"
              >
                + &#123;company&#125;
              </button>
              <button
                type="button"
                onClick={() => setTemplateBody((prev) => prev + " {phone}")}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition cursor-pointer"
              >
                + &#123;phone&#125;
              </button>
              <button
                type="button"
                onClick={() => setTemplateBody((prev) => prev + " Reply STOP to opt-out.")}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 transition cursor-pointer ml-auto"
              >
                + Opt-Out Notice
              </button>
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Message Content
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
              rows={8}
              value={templateBody}
              onChange={(e) => setTemplateBody(e.target.value)}
              placeholder="Write your SMS template message here... Use {name} and {company} to personalize each recipient dynamically."
              className="w-full p-4 text-xs sm:text-sm font-sans rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DF81] bg-white leading-relaxed resize-y"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveTemplate}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Save size={13} />
                <span>Save Template</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mobile Preview & Saved Templates List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Live Mobile Screen Preview */}
          <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-lg border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 text-[11px]">
                <span className="font-mono flex items-center gap-1.5">
                  <Phone size={12} className="text-[#00DF81]" />
                  <span>Live Mobile Preview</span>
                </span>
                <span className="text-[#00DF81] font-bold text-[10px]">Telnyx SMS</span>
              </div>

              <div className="mt-4 p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700 text-xs text-slate-100 leading-relaxed font-sans shadow-inner min-h-[90px]">
                {templateBody ? (
                  templateBody
                    .replace(/\{name\}/gi, "Marcus")
                    .replace(/\{company\}/gi, "Tampa HVAC Solutions")
                    .replace(/\{phone\}/gi, "+1 (813) 555-0192")
                ) : (
                  <span className="text-slate-500 italic">
                    Type template content on the left to see live handset preview...
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Personalized with: <strong>Marcus</strong></span>
              <span className="text-emerald-400 font-bold">10DLC Verified</span>
            </div>
          </div>

          {/* Saved Templates List */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Bookmark size={13} className="text-emerald-600" />
                <span>Saved Templates ({templates.length})</span>
              </span>
              <span className="text-[9.5px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Cloud Synced</span>
              </span>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition flex items-start justify-between gap-2 ${
                    activeTemplateId === tpl.id
                      ? "bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-medium"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-xs font-bold text-slate-900">{tpl.name}</p>
                      <span className="text-[10px] text-slate-400 font-normal shrink-0">{tpl.updatedAt}</span>
                    </div>

                    {/* Creator attribution pill & global sharing notice */}
                    <div className="flex items-center gap-1.5 mt-0.5 mb-1">
                      {tpl.createdBy && (
                        <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 shadow-2xs">
                          <span className="text-slate-500">👤</span>
                          <span>{tpl.createdBy}</span>
                        </span>
                      )}
                      <span className="text-[9px] text-slate-400 font-medium">All portals</span>
                    </div>

                    <p className="text-[11px] text-slate-500 font-normal line-clamp-2 mt-1 leading-relaxed">
                      {tpl.body}
                    </p>
                  </div>

                  {isSuperadminUser && templates.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteTemplate(tpl.id, e)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer shrink-0 mt-0.5"
                      title="Delete template (Super Admin only)"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
