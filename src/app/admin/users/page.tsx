"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  Users,
  Plus,
  KeyRound,
  Building2,
  Globe2,
  Trash2,
  Copy,
  Check,
  Search,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Lock,
  Mail,
  X
} from "lucide-react";

interface PortalUser {
  id: string;
  email: string;
  username: string;
  display_name: string;
  portal_type: "internal" | "external";
  role: string;
  status: "active" | "inactive";
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPortal, setFilterPortal] = useState<"all" | "internal" | "external">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New User Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserId, setNewUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newPortalType, setNewPortalType] = useState<"internal" | "external">("internal");
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createdSuccess, setCreatedSuccess] = useState<{
    userId: string;
    pass: string;
    portal: string;
  } | null>(null);

  // Delete User Modal State
  const [deleteTarget, setDeleteTarget] = useState<PortalUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIdOrEmail: newUserId,
          password: newPassword,
          portal_type: newPortalType,
          display_name: newDisplayName,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCreatedSuccess({
          userId: newUserId,
          pass: newPassword,
          portal: newPortalType,
        });
        setNewUserId("");
        setNewPassword("");
        setNewDisplayName("");
        fetchUsers();
      } else {
        setCreateError(data.error || "Failed to create portal user.");
      }
    } catch {
      setCreateError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleting(false);
    }
  };

  const generateStrongPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
  };

  const copyCredentials = (user: PortalUser, rawPass?: string) => {
    const text = `SpykeAI Portal Login\nPortal: ${user.portal_type.toUpperCase()} PORTAL\nUser ID: ${user.email}\nPassword: ${rawPass || "********"}\nLogin URL: https://spykeai.com/admin/login`;
    navigator.clipboard.writeText(text);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredUsers = users.filter((u) => {
    const matchesPortal = filterPortal === "all" || u.portal_type === filterPortal;
    const matchesQuery =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPortal && matchesQuery;
  });

  const internalCount = users.filter((u) => u.portal_type === "internal").length;
  const externalCount = users.filter((u) => u.portal_type === "external").length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <AdminSidebar active="users" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/90 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                <KeyRound size={18} />
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Portal Access and Users</h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Create, configure, and isolate access credentials for Internal Operations and External Clients.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchUsers}
              className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
              title="Refresh users"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => {
                setShowCreateModal(true);
                setCreatedSuccess(null);
                setCreateError(null);
              }}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <Plus size={16} />
              <span>Create Portal User</span>
            </button>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* KPI Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Portal Users</span>
                <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users size={16} />
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{users.length}</p>
              <span className="text-[11px] text-slate-400 font-medium">Internal & External Combined</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Internal Portal Users</span>
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Building2 size={16} />
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{internalCount}</p>
              <span className="text-[11px] text-emerald-600 font-medium">Access to Inbox, Calls & Emails</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">External Portal Users</span>
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Globe2 size={16} />
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{externalCount}</p>
              <span className="text-[11px] text-blue-600 font-medium">Access to Client Dashboard & Logs</span>
            </div>
          </div>

          {/* Table Controls (Filter & Search) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setFilterPortal("all")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  filterPortal === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All Users ({users.length})
              </button>
              <button
                onClick={() => setFilterPortal("internal")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  filterPortal === "internal"
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-500 hover:text-emerald-700"
                }`}
              >
                <Building2 size={13} />
                Internal ({internalCount})
              </button>
              <button
                onClick={() => setFilterPortal("external")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  filterPortal === "external" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-blue-700"
                }`}
              >
                <Globe2 size={13} />
                External ({externalCount})
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user ID, email or name..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Users List Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-5">User ID / Email</th>
                    <th className="py-3.5 px-5">Display Name</th>
                    <th className="py-3.5 px-5">Portal Assigned</th>
                    <th className="py-3.5 px-5">Role</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-emerald-600" />
                        Loading authorized portal users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <UserCheck size={28} className="mx-auto mb-2 opacity-40 text-slate-400" />
                        No portal users found. Click &quot;Create Portal User&quot; above to add one!
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const isInternal = user.portal_type === "internal";
                      return (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{user.email}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {user.username}</span>
                          </td>
                          <td className="py-3.5 px-5 text-slate-700 font-semibold">{user.display_name}</td>
                          <td className="py-3.5 px-5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                isInternal
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}
                            >
                              {isInternal ? <Building2 size={11} /> : <Globe2 size={11} />}
                              {isInternal ? "INTERNAL PORTAL" : "EXTERNAL PORTAL"}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-slate-600 capitalize">{user.role}</td>
                          <td className="py-3.5 px-5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              <button
                                onClick={() => copyCredentials(user)}
                                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                                title="Copy User ID & Login URL"
                              >
                                {copiedId === user.id ? (
                                  <Check size={14} className="text-emerald-600" />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>
                              <button
                                onClick={() => setDeleteTarget(user)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Delete User"
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
        </div>
      </main>

      {/* CREATE PORTAL USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <KeyRound size={18} />
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Create Portal Credentials</h3>
                  <p className="text-[11px] text-slate-400">Generate credentials for Internal or External Portal.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {createdSuccess ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <Check size={16} />
                    <span>Credentials Created Successfully!</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1 font-mono text-slate-800">
                    <p><span className="text-slate-400 font-sans">Portal:</span> {createdSuccess.portal.toUpperCase()}</p>
                    <p><span className="text-slate-400 font-sans">User ID / Email:</span> {createdSuccess.userId}</p>
                    <p><span className="text-slate-400 font-sans">Password:</span> {createdSuccess.pass}</p>
                    <p className="text-[10px] text-slate-400 pt-1 font-sans">Login URL: https://spykeai.com/admin/login</p>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Share these credentials with the user. They can log in directly at the unified login page.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const text = `SpykeAI Portal Access\nPortal: ${createdSuccess.portal.toUpperCase()} PORTAL\nUser ID: ${createdSuccess.userId}\nPassword: ${createdSuccess.pass}\nLogin URL: https://spykeai.com/admin/login`;
                      navigator.clipboard.writeText(text);
                      alert("Credentials copied to clipboard!");
                    }}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Copy size={14} />
                    <span>Copy Credentials</span>
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateUser} className="space-y-4">
                {createError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle size={15} />
                    <span>{createError}</span>
                  </div>
                )}

                {/* Portal Type Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Select Portal Access
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setNewPortalType("internal")}
                      className={`p-3 rounded-xl border text-left flex flex-col transition-all ${
                        newPortalType === "internal"
                          ? "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 font-bold text-xs">
                        <Building2 size={14} className={newPortalType === "internal" ? "text-emerald-600" : ""} />
                        Internal Portal
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Inbox, Softphone, Transcripts</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewPortalType("external")}
                      className={`p-3 rounded-xl border text-left flex flex-col transition-all ${
                        newPortalType === "external"
                          ? "bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 font-bold text-xs">
                        <Globe2 size={14} className={newPortalType === "external" ? "text-blue-600" : ""} />
                        External Portal
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Client Dashboard & Reports</span>
                    </button>
                  </div>
                </div>

                {/* User ID / Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    User ID or Email
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={newUserId}
                      onChange={(e) => setNewUserId(e.target.value)}
                      placeholder={newPortalType === "internal" ? "agent.john@spykeai.com" : "client.acme@investor.com"}
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Full Name / Company
                  </label>
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    placeholder="e.g. John Operations or Acme Corp"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Password with Auto-Generate */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Portal Password
                    </label>
                    <button
                      type="button"
                      onClick={generateStrongPassword}
                      className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      Auto-Generate Strong
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50"
                  >
                    {creating ? "Creating..." : "Save Credentials"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Delete Portal User?</h4>
            <p className="text-xs text-slate-500">
              Are you sure you want to remove <strong className="text-slate-800">{deleteTarget.email}</strong>? They will no longer be able to log into the {deleteTarget.portal_type} portal.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteTarget.id)}
                disabled={deleting}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
