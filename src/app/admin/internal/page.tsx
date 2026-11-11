"use client";

import React from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Building2, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function InternalPortalPlaceholderPage() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <AdminSidebar active="internal_root" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200/90 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <Building2 size={18} />
            </span>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Internal Portal</h1>
              <p className="text-xs text-slate-500">Restricted workspace for internal team and operations.</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Protected Workspace
          </span>
        </header>

        <div className="p-8 max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center mb-4 shadow-xs">
            <Building2 size={32} />
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Internal Portal Ready</h2>
          <p className="text-slate-500 text-sm max-w-md mt-2 leading-relaxed">
            All previous data has been cleared from this section. Superadmin will configure and assign your dedicated operational tools here shortly.
          </p>

          <div className="mt-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-sm w-full text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Access Control Active</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Only authenticated users with <strong>Internal Portal</strong> credentials can access this workspace.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
