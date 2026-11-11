"use client";

import React from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Globe2, ShieldCheck } from "lucide-react";

export default function ExternalPortalPlaceholderPage() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <AdminSidebar active="external_root" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200/90 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Globe2 size={18} />
            </span>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">External Portal</h1>
              <p className="text-xs text-slate-500">Dedicated workspace for external clients and partners.</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Client Workspace
          </span>
        </header>

        <div className="p-8 max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
            <Globe2 size={32} />
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">External Portal Ready</h2>
          <p className="text-slate-500 text-sm max-w-md mt-2 leading-relaxed">
            All previous data has been cleared from this section. Superadmin will configure your client dashboard and reports here shortly.
          </p>

          <div className="mt-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-sm w-full text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <ShieldCheck size={14} className="text-blue-600" />
              <span>Client Isolation Active</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Only authenticated users with <strong>External Portal</strong> credentials can access this workspace.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
