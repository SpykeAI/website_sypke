"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Phone,
  Mic,
  Mail,
  ArrowLeft,
  ShieldCheck,
  Radio
} from "lucide-react";

interface AdminSidebarProps {
  active?: "inbox" | "calls" | "transcripts" | "emails";
}

export default function AdminSidebar({ active }: AdminSidebarProps) {
  const pathname = usePathname();

  const currentTab = active || (
    pathname?.startsWith("/inbox") ? "inbox" :
    pathname?.startsWith("/admin/calls") ? "calls" :
    pathname?.startsWith("/admin/emails") ? "emails" :
    pathname?.startsWith("/admin/transcripts") ? "transcripts" :
    "inbox"
  );

  const navItems = [
    {
      id: "inbox",
      label: "SMS Inbox",
      subtitle: "Two-way text messages",
      href: "/inbox",
      icon: MessageSquare,
      badge: "Default",
    },
    {
      id: "calls",
      label: "Live Calls & Softphone",
      subtitle: "WebRTC browser calling",
      href: "/admin/calls",
      icon: Phone,
    },
    {
      id: "emails",
      label: "Email Campaigns",
      subtitle: "Create, history & analytics",
      href: "/admin/emails",
      icon: Mail,
      badge: "New",
    },
    {
      id: "transcripts",
      label: "AI Call Transcripts",
      subtitle: "Vapi AI website logs",
      href: "/admin/transcripts",
      icon: Mic,
    },
  ];

  return (
    <>
      {/* DESKTOP VERTICAL SIDEBAR */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-white border-r border-slate-200/90 flex-col shrink-0 h-full select-none z-30">
        {/* Brand / Portal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SpykeAI" className="h-8 w-auto object-contain" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-slate-900 tracking-tight">Admin Portal</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">PRO</span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Spyke AI Operations</p>
            </div>
          </div>
        </div>

        {/* Vertical Nav List */}
        <div className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Communications & AI
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-700/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-emerald-600"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs truncate">{item.label}</span>
                    {item.badge && !isActive && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[10px] truncate ${
                      isActive ? "text-emerald-100 font-normal" : "text-slate-400"
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer info & Status */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 space-y-3">
          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Radio size={11} className="text-emerald-500 animate-pulse" />
                Telnyx Line
              </span>
              <span className="text-[10px] font-bold text-emerald-600">Active</span>
            </div>
            <p className="text-xs font-bold text-slate-800 mt-1">+1 (346) 477-0028</p>
            <p className="text-[10px] text-slate-400">US & India Whitelisted</p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-emerald-600 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Website</span>
            </Link>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-500" />
              Superadmin
            </span>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVBAR */}
      <div className="md:hidden flex items-center justify-around bg-white border-t border-slate-200 p-2 fixed bottom-0 left-0 right-0 z-40 select-none shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                isActive
                  ? "text-emerald-600 font-bold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              <Icon size={18} />
              <span className="text-[10px] mt-0.5">
                {item.id === "inbox" ? "SMS" : item.id === "calls" ? "Calls" : item.id === "emails" ? "Emails" : "Transcripts"}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
