"use client";

import React from "react";
import * as XLSX from "xlsx";
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info,
  ShieldCheck,
  Clock,
  ArrowRight
} from "lucide-react";

const SAMPLE_DATA = [
  {
    "Phone Number": "+1 (813) 555-0192",
    "Name": "Marcus Vance",
    "Company": "Tampa HVAC Solutions",
    "Custom Message": "Hi Marcus, we noticed your HVAC maintenance is due this week. Would you like a priority slot?"
  },
  {
    "Phone Number": "+1 (813) 555-0144",
    "Name": "Sarah Jenkins",
    "Company": "Bay Area Cooling",
    "Custom Message": "Hi Sarah, our commercial AC inspection technicians are in Tampa tomorrow. Book here: spykeai.com/demo"
  },
  {
    "Phone Number": "+1 (727) 555-0188",
    "Name": "Carlos Mendez",
    "Company": "Clearwater Refrigeration",
    "Custom Message": "Carlos, special $49 safety check on commercial heat pumps this Friday. Reply YES to confirm."
  },
  {
    "Phone Number": "+91 98765 43210",
    "Name": "Rajesh Kumar",
    "Company": "Kumar Logistics",
    "Custom Message": "Hi Rajesh, your voice dispatch demo is ready for review."
  }
];

export default function SmsUploadFormat({ onSwitchToBulk }: { onSwitchToBulk?: () => void }) {
  // Download Sample CSV
  const handleDownloadCsv = () => {
    const headers = ["Phone Number", "Name", "Company", "Custom Message"];
    const rows = SAMPLE_DATA.map((row) => [
      `"${row["Phone Number"]}"`,
      `"${row.Name}"`,
      `"${row.Company}"`,
      `"${row["Custom Message"]}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Sample_SMS_Format.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download Sample Excel (.xlsx)
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(SAMPLE_DATA);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SMS_Recipients");
    XLSX.writeFile(wb, "Sample_SMS_Format.xlsx");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white border border-slate-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>Upload Format Guidelines</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            CSV & Excel File Format for Bulk SMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Upload your contact list in either <strong>.xlsx</strong>, <strong>.xls</strong>, or <strong>.csv</strong> format.
            Our intelligent parser auto-detects phone columns, customer names, and custom notes automatically.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-600 cursor-pointer shadow-sm"
          >
            <Download size={14} className="text-[#00DF81]" />
            <span>Download Sample CSV</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadExcel}
            className="px-4 py-2.5 rounded-xl bg-[#00DF81] hover:bg-[#00c271] text-slate-950 text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-lg shadow-[#00DF81]/20 cursor-pointer"
          >
            <FileSpreadsheet size={15} />
            <span>Download Sample Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Column Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Required Column: Phone */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>1. Phone Number (Required)</span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
              Mandatory
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Must contain a valid mobile phone number. Header name can be <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-[11px]">Phone</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-[11px]">Phone Number</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-[11px]">Mobile</code>, or <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-[11px]">Cell</code>.
          </p>
          <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-500 font-mono">
            Accepted: +1 (813) 555-0192, 8135550192, +18135550192, +91 9876543210
          </div>
        </div>

        {/* Optional Column: Name */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>2. Name (Optional)</span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
              Personalization
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The recipient customer's name. Use tag <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-[11px] font-bold">&#123;name&#125;</code> in your message template to dynamically greet each person.
          </p>
          <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-500 font-mono">
            Accepted Headers: Name, First Name, Contact Name, Customer
          </div>
        </div>

        {/* Optional Column: Company */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>3. Company (Optional)</span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
              B2B Tags
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Company or organization name. Can be inserted into the SMS body using tag <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-[11px] font-bold">&#123;company&#125;</code>.
          </p>
          <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-500 font-mono">
            Accepted Headers: Company, Business, Org, Account
          </div>
        </div>

        {/* Optional Column: Custom Message */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>4. Custom Message / Notes (Optional)</span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">
              Custom Overrides
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            If provided, this row's unique text overrides the generic template message, allowing personalized text per lead.
          </p>
          <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-500 font-mono">
            Accepted Headers: Custom Message, Message, Notes, Body
          </div>
        </div>
      </div>

      {/* Interactive Sample Table Preview */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-emerald-600" />
              <span>Sample Spreadsheet Preview</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              This is how your Excel (.xlsx) or CSV file should look when opened in Microsoft Excel or Google Sheets.
            </p>
          </div>

          {onSwitchToBulk && (
            <button
              type="button"
              onClick={onSwitchToBulk}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>Go to Bulk Upload</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="p-3 whitespace-nowrap">#</th>
                <th className="p-3 whitespace-nowrap">Phone Number *</th>
                <th className="p-3 whitespace-nowrap">Name</th>
                <th className="p-3 whitespace-nowrap">Company</th>
                <th className="p-3 whitespace-nowrap">Custom Message</th>
                <th className="p-3 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {SAMPLE_DATA.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                  <td className="p-3 font-mono text-slate-400 font-semibold">{idx + 1}</td>
                  <td className="p-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {row["Phone Number"]}
                  </td>
                  <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">
                    {row.Name}
                  </td>
                  <td className="p-3 text-slate-600 whitespace-nowrap">
                    {row.Company}
                  </td>
                  <td className="p-3 text-slate-600 max-w-xs truncate" title={row["Custom Message"]}>
                    {row["Custom Message"]}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 size={11} />
                      <span>Valid</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance & High Deliverability Tips */}
      <div className="bg-emerald-50/60 rounded-3xl p-5 sm:p-6 border border-emerald-200/80 space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-900">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>Carrier Deliverability & Compliance Best Practices</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-emerald-950 font-medium leading-relaxed">
          <li className="flex items-start gap-2 bg-white/70 p-3 rounded-2xl border border-emerald-100">
            <Clock size={15} className="text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Use 1s - 5s Delays:</strong> Telnyx and US carriers (AT&T, Verizon) reward staggered pacing. Setting a 1 to 5 second delay between sends prevents carrier throttling.</span>
          </li>
          <li className="flex items-start gap-2 bg-white/70 p-3 rounded-2xl border border-emerald-100">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Opt-Out Compliance:</strong> Include <code className="bg-emerald-100 px-1 py-0.5 rounded">Reply STOP to unsubscribe</code> at the end of promotional messages to comply with 10DLC regulations.</span>
          </li>
          <li className="flex items-start gap-2 bg-white/70 p-3 rounded-2xl border border-emerald-100">
            <AlertCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Personalization:</strong> Messages that use <code className="bg-emerald-100 px-1 py-0.5 rounded">&#123;name&#125;</code> and specific context have a 4x higher reply rate and lower spam flags.</span>
          </li>
          <li className="flex items-start gap-2 bg-white/70 p-3 rounded-2xl border border-emerald-100">
            <HelpCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Clean E.164 Numbers:</strong> Our parser automatically cleans spaces, hyphens, and brackets. US numbers (10 digits) are formatted to +1 automatically.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
