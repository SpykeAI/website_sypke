"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MessageSquare,
  Phone,
  Mic,
  Mail,
  ArrowLeft,
  ShieldCheck,
  Radio,
  LogOut,
  LayoutDashboard,
  Users,
  Building2,
  Globe2,
  KeyRound,
  FileText
} from "lucide-react";

interface AdminSidebarProps {
  active?: string;
}

export default function AdminSidebar({ active }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<"superadmin" | "internal" | "external">("superadmin");

  useEffect(() => {
    // Read role from cookie in browser
    const cookies = document.cookie.split(";").reduce((acc: any, cookie) => {
      const [key, val] = cookie.trim().split("=");
      if (key && val) acc[key] = decodeURIComponent(val);
      return acc;
    }, {});

    if (cookies.portal_role === "external") {
      setRole("external");
    } else if (cookies.portal_role === "internal") {
      setRole("internal");
    } else {
      setRole("superadmin");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  const currentTab = active || (
    pathname?.startsWith("/inbox") ? "inbox" :
    pathname?.startsWith("/admin/calls") ? "calls" :
    pathname?.startsWith("/admin/emails") ? "emails" :
    pathname?.startsWith("/admin/transcripts") ? "transcripts" :
    pathname?.startsWith("/admin/external/dashboard") ? "ext_dashboard" :
    pathname?.startsWith("/admin/external/transcripts") ? "ext_transcripts" :
    pathname?.startsWith("/admin/users") ? "users" :
    "inbox"
  );

  // Section 1: Internal Portal Nav Items
  const internalItems = [
    {
      id: "inbox",
      label: "SMS Inbox",
      subtitle: "Two-way text messages",
      href: "/inbox",
      icon: MessageSquare,
      badge: "Live",
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

  // Section 2: External Portal Nav Items
  const externalItems = [
    {
      id: "ext_dashboard",
      label: "Client Dashboard",
      subtitle: "Campaign metrics & demos",
      href: "/admin/external/dashboard",
      icon: LayoutDashboard,
      badge: "Client",
    },
    {
      id: "ext_transcripts",
      label: "Shared Transcripts",
      subtitle: "Client call logs & analysis",
      href: "/admin/external/transcripts",
      icon: FileText,
    },
  ];

  // Superadmin Management Items
  const adminItems = [
    {
      id: "users",
      label: "Portal Access & Users",
      subtitle: "Manage User IDs & Passwords",
      href: "/admin/users",
      icon: KeyRound,
      badge: "Superadmin",
    },
  ];

  const showInternal = role === "superadmin" || role === "internal";
  const showExternal = role === "superadmin" || role === "external";
  const showUserMgmt = role === "superadmin";

  return (
    <>
      {/* DESKTOP VERTICAL SIDEBAR */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-white border-r border-slate-200/90 flex-col shrink-0 h-full select-none z-30">
        {/* Brand / Portal Header */}
        <div className="p-4 lg:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SpykeAI" className="h-8 w-auto object-contain" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-slate-900 tracking-tight">Admin Portal</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                  {role === "superadmin" ? "SUPERADMIN" : role === "internal" ? "INTERNAL" : "EXTERNAL"}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Spyke AI Operations</p>
            </div>
          </div>
        </div>

        {/* Vertical Nav List with Distinct Sections */}
        <div className="flex-1 p-3.5 space-y-4 overflow-y-auto">
          {/* SECTION 1: INTERNAL PORTAL */}
          {showInternal && (
            <div>
              <div className="flex items-center justify-between px-3 py-1.5 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Building2 size={12} className="text-emerald-600" />
                  Internal Portal
                </span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  Team
                </span>
              </div>

              <div className="space-y-1">
                {internalItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all ${
                        isActive
                          ? "bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-700/20"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-emerald-600"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs truncate">{item.label}</span>
                          {item.badge && !isActive && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
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
            </div>
          )}

          {/* SECTION 2: EXTERNAL PORTAL */}
          {showExternal && (
            <div className={showInternal ? "pt-2 border-t border-slate-100" : ""}>
              <div className="flex items-center justify-between px-3 py-1.5 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                  <Globe2 size={12} className="text-blue-600" />
                  External Portal
                </span>
                <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                  Clients
                </span>
              </div>

              <div className="space-y-1">
                {externalItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all ${
                        isActive
                          ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-700/20"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-blue-600"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs truncate">{item.label}</span>
                          {item.badge && !isActive && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-[10px] truncate ${
                            isActive ? "text-blue-100 font-normal" : "text-slate-400"
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUPERADMIN CREDENTIALS & ACCESS SECTION */}
          {showUserMgmt && (
            <div className="pt-2 border-t border-slate-100">
              <div className="px-3 py-1.5 mb-1 text-[10px] font-extrabold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-purple-600" />
                Access & Security
              </div>

              <div className="space-y-1">
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all ${
                        isActive
                          ? "bg-purple-600 text-white font-bold shadow-sm shadow-purple-700/20"
                          : "text-slate-600 hover:bg-purple-50 hover:text-purple-900 font-medium"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-purple-50 text-purple-600 group-hover:bg-white"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs truncate">{item.label}</span>
                          {item.badge && !isActive && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                              PRO
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-[10px] truncate ${
                            isActive ? "text-purple-100 font-normal" : "text-slate-400"
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
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
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span className="capitalize">{role}</span>
              </span>
              <span className="text-slate-300 text-xs">·</span>
              <button
                onClick={handleLogout}
                className="text-[10px] font-semibold text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={11} />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVBAR */}
      <div className="md:hidden flex items-center justify-around bg-white border-t border-slate-200 p-2 fixed bottom-0 left-0 right-0 z-40 select-none shadow-lg">
        {showInternal && (
          <Link
            href="/inbox"
            className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              currentTab === "inbox" ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <MessageSquare size={18} />
            <span className="text-[10px] mt-0.5">Inbox</span>
          </Link>
        )}
        {showInternal && (
          <Link
            href="/admin/calls"
            className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              currentTab === "calls" ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <Phone size={18} />
            <span className="text-[10px] mt-0.5">Calls</span>
          </Link>
        )}
        {showExternal && (
          <Link
            href="/admin/external/dashboard"
            className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              currentTab === "ext_dashboard" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <LayoutDashboard size={18} />
            <span className="text-[10px] mt-0.5">Client</span>
          </Link>
        )}
        {showUserMgmt && (
          <Link
            href="/admin/users"
            className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              currentTab === "users" ? "text-purple-600 font-bold" : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <KeyRound size={18} />
            <span className="text-[10px] mt-0.5">Users</span>
          </Link>
        )}
      </div>
    </>
  );
}
