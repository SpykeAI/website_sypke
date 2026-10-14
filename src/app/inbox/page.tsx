"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Send, 
  Search, 
  Plus, 
  MessageSquare, 
  Phone, 
  Check, 
  CheckCheck, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  User, 
  ShieldAlert,
  Coins,
  ArrowLeft,
  ChevronDown,
  ChevronLeft
} from "lucide-react";

interface Contact {
  id: string;
  phone_e164: string;
  display_name: string | null;
  do_not_text: boolean;
}

interface Conversation {
  id: string;
  telnyx_number: string;
  last_message_at: string;
  unread_count: number;
  interest_level?: string | null;
  contacts: Contact;
}

interface Message {
  id: string;
  conversation_id: string;
  direction: "inbound" | "outbound";
  from_number: string;
  to_number: string;
  body: string;
  status: "pending" | "accepted" | "sent" | "delivered" | "failed";
  error_code: string | null;
  created_at: string;
}

export default function SmsInboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // New Conversation Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [newName, setNewName] = useState("");
  const [newStage, setNewStage] = useState("prospect");
  const [creatingConv, setCreatingConv] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMsgCountRef = useRef(0);
  const shouldScrollBottomRef = useRef(true);

  // 1. Fetch conversations
  const fetchConversations = async (silent = false) => {
    if (!silent) setLoadingConv(true);
    try {
      const res = await fetch("/api/sms/conversations");
      const data = await res.json();
      if (data.ok) {
        setConversations(data.conversations || []);
        if (!activeConvId && data.conversations?.length > 0 && !silent) {
          if (typeof window !== "undefined" && window.innerWidth >= 768) {
            setActiveConvId(data.conversations[0].id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    } finally {
      if (!silent) setLoadingConv(false);
    }
  };

  // 2. Fetch messages for selected conversation
  const fetchMessages = async (convId: string, silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const res = await fetch(`/api/sms/messages?conversationId=${convId}`);
      const data = await res.json();
      if (data.ok) {
        const newMsgs: Message[] = data.messages || [];
        setMessages((prev) => {
          // Check if data actually changed to avoid useless re-renders
          if (
            prev.length === newMsgs.length &&
            prev[prev.length - 1]?.id === newMsgs[newMsgs.length - 1]?.id &&
            prev[prev.length - 1]?.status === newMsgs[newMsgs.length - 1]?.status
          ) {
            return prev;
          }
          if (newMsgs.length > prev.length) {
            shouldScrollBottomRef.current = true;
          }
          return newMsgs;
        });
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, []);

  // Poll for messages and updates every 4 seconds without jumping scroll
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations(true);
      if (activeConvId) {
        fetchMessages(activeConvId, true);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeConvId]);

  // When active conversation changes
  useEffect(() => {
    if (activeConvId) {
      shouldScrollBottomRef.current = true;
      prevMsgCountRef.current = 0;
      fetchMessages(activeConvId);
      setErrorBanner(null);
    }
  }, [activeConvId]);

  // Fixed scroll logic: Only scroll when new message is added or conversation changed
  useEffect(() => {
    if (shouldScrollBottomRef.current || messages.length > prevMsgCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: prevMsgCountRef.current === 0 ? "auto" : "smooth" });
      shouldScrollBottomRef.current = false;
    }
    prevMsgCountRef.current = messages.length;
  }, [messages]);

  // Active conversation object
  const activeConv = conversations.find((c) => c.id === activeConvId);

  // Send message handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv || sending) return;

    if (activeConv.contacts?.do_not_text) {
      setErrorBanner("Cannot send message: Recipient has opted out (do-not-text).");
      return;
    }

    setSending(true);
    setErrorBanner(null);

    const tempText = inputText.trim();
    setInputText("");

    // Optimistic UI update
    const optimisticMsg: Message = {
      id: "temp-" + Date.now(),
      conversation_id: activeConv.id,
      direction: "outbound",
      from_number: activeConv.telnyx_number,
      to_number: activeConv.contacts.phone_e164,
      body: tempText,
      status: "pending",
      error_code: null,
      created_at: new Date().toISOString(),
    };

    shouldScrollBottomRef.current = true;
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: activeConv.contacts.phone_e164,
          text: tempText,
          conversationId: activeConv.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorBanner(data.message || "Failed to send SMS message.");
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMsg.id ? { ...m, status: "failed" } : m))
        );
      } else {
        fetchMessages(activeConv.id, true);
      }
    } catch (err: any) {
      setErrorBanner(err?.message || "Network error sending SMS.");
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMsg.id ? { ...m, status: "failed" } : m))
      );
    } finally {
      setSending(false);
    }
  };

  // Start new conversation
  const handleCreateNewConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone.trim() || creatingConv) return;

    setCreatingConv(true);
    try {
      const res = await fetch("/api/sms/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: newPhone.trim(),
          displayName: newName.trim() || null,
          interest_level: newStage,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setShowNewModal(false);
        setNewPhone("");
        setNewName("");
        setNewStage("prospect");
        await fetchConversations();
        if (data.conversationId) {
          setActiveConvId(data.conversationId);
        }
      } else {
        alert(data.message || "Failed to create conversation");
      }
    } catch (err) {
      alert("Error creating conversation");
    } finally {
      setCreatingConv(false);
    }
  };

  // Update conversation status / stage (prospect, cold outreach, lead)
  const handleUpdateStatus = async (convId: string, newStatus: string) => {
    // Optimistic UI update
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, interest_level: newStatus } : c))
    );

    try {
      await fetch("/api/sms/conversations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: convId,
          interest_level: newStatus,
        }),
      });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Character, segment and cost calculations
  const charCount = inputText.length;
  const isUnicode = /[^\u0000-\u007F]/.test(inputText);
  const segmentLimit = isUnicode ? 70 : 160;
  const segmentCount = charCount === 0 ? 1 : Math.ceil(charCount / segmentLimit);
  // Telnyx standard rate ~$0.0079 per segment for US local SMS
  const estCost = (segmentCount * 0.0079).toFixed(4);

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    const phone = c.contacts?.phone_e164?.toLowerCase() || "";
    const name = c.contacts?.display_name?.toLowerCase() || "";
    const tag = (c.interest_level || "").toLowerCase();
    return phone.includes(q) || name.includes(q) || tag.includes(q);
  });

  return (
    <div className="flex h-full w-full bg-white text-slate-800 font-sans antialiased overflow-hidden">
      
      {/* LEFT SIDEBAR: CONVERSATIONS LIST */}
      <div className={`${
        activeConvId ? "hidden md:flex" : "flex"
      } w-full md:w-80 lg:w-96 border-r border-slate-200 flex-col bg-slate-50 shrink-0 h-full`}>
        {/* Top Header */}
        <div className="p-3.5 px-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin"
              className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              title="Back to Admin Dashboard"
            >
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Messages</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              </h1>
              <p className="text-[11px] font-medium text-slate-500">
                Line: <span className="font-semibold text-emerald-700">{conversations[0]?.telnyx_number || "+13464770028"}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="w-8 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors flex items-center justify-center shadow-xs cursor-pointer"
            title="Start New Conversation"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-2.5 px-3 bg-white border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search messages or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/80 border border-slate-200/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Conversation List Scroll Area */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {loadingConv ? (
            <div className="p-10 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <RefreshCw className="animate-spin text-emerald-600" size={20} />
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              No conversations yet. Click <span className="text-emerald-600 font-bold">+</span> to start.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              const contact = conv.contacts;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${
                    isActive
                      ? "bg-emerald-50/80 border-l-4 border-emerald-600"
                      : "hover:bg-slate-100/70"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 font-semibold text-xs shadow-xs">
                    {contact?.display_name && contact.display_name !== contact.phone_e164
                      ? contact.display_name.charAt(0).toUpperCase()
                      : <User size={16} className="text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {contact?.display_name && contact.display_name !== contact.phone_e164
                          ? contact.display_name
                          : contact?.phone_e164}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(conv.last_message_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 truncate">
                        {contact?.phone_e164}
                      </span>
                      {conv.unread_count > 0 && (
                        <span className="px-1.5 py-0.2 text-[10px] bg-emerald-600 text-white font-bold rounded-full shrink-0">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {conv.interest_level && (
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                          conv.interest_level === "lead"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : conv.interest_level === "cold outreach"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                          {conv.interest_level}
                        </span>
                      )}
                      {contact?.do_not_text && (
                        <span className="text-[9px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-semibold">
                          OPTED OUT
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT MAIN CHAT AREA */}
      <div className={`${
        !activeConvId ? "hidden md:flex" : "flex"
      } flex-1 min-w-0 flex-col bg-white h-full relative overflow-hidden`}>
        {activeConv ? (
          <>
            {/* Header */}
            <div className="p-2.5 md:p-3.5 md:px-6 border-b border-slate-200 bg-white flex items-center justify-between shadow-xs z-10 shrink-0 gap-2">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                {/* Mobile Back Button like iMessage / WhatsApp */}
                <button
                  onClick={() => setActiveConvId(null)}
                  className="md:hidden flex items-center gap-0.5 text-emerald-600 hover:text-emerald-700 font-semibold text-xs py-1 px-1.5 -ml-1.5 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
                  title="Back to Messages"
                >
                  <ChevronLeft size={20} />
                  <span>Messages</span>
                </button>

                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs md:text-sm shrink-0">
                  {activeConv.contacts?.display_name && activeConv.contacts.display_name !== activeConv.contacts.phone_e164
                    ? activeConv.contacts.display_name.charAt(0).toUpperCase()
                    : <Phone size={14} />}
                </div>
                <div className="min-w-0">
                  <h2 className="text-xs md:text-sm font-bold text-slate-900 truncate">
                    {activeConv.contacts?.display_name || activeConv.contacts?.phone_e164}
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    {activeConv.contacts?.phone_e164}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Stage Pill Dropdown */}
                <div className="relative inline-flex items-center">
                  <select
                    value={activeConv.interest_level || "cold outreach"}
                    onChange={(e) => handleUpdateStatus(activeConv.id, e.target.value)}
                    className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider pl-2.5 pr-5 md:pl-3 md:pr-6 py-1 rounded-full border cursor-pointer outline-none transition-all appearance-none shadow-2xs ${
                      activeConv.interest_level === "lead"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                        : activeConv.interest_level === "prospect"
                        ? "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
                        : "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                    }`}
                    title="Change stage"
                  >
                    <option value="prospect">Prospect</option>
                    <option value="cold outreach">Cold Outreach</option>
                    <option value="lead">Lead</option>
                  </select>
                  <ChevronDown size={10} className="pointer-events-none absolute right-1.5 text-slate-500" />
                </div>

                {activeConv.contacts?.do_not_text && (
                  <div className="flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 bg-rose-50 border border-rose-200 rounded-full text-rose-700 text-[10px] md:text-xs font-semibold shrink-0">
                    <ShieldAlert size={13} />
                    <span className="hidden sm:inline">Opted Out</span>
                  </div>
                )}
              </div>
            </div>

            {/* Error Banner */}
            {errorBanner && (
              <div className="bg-rose-50 border-b border-rose-200 px-4 md:px-6 py-2.5 text-rose-700 text-xs flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <AlertCircle size={15} className="text-rose-600 shrink-0" />
                  <span className="font-medium">{errorBanner}</span>
                </div>
                <button
                  onClick={() => setErrorBanner(null)}
                  className="text-rose-600 hover:text-rose-800 font-bold text-xs underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Messages Scroll Area - FIXED INTERNAL SCROLLING */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-3.5 md:p-6 space-y-3.5 bg-slate-50/50"
            >
              {loadingMessages ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  <RefreshCw className="animate-spin text-emerald-600 mr-2" size={16} />
                  Loading message history...
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                  <MessageSquare size={36} className="mb-2 text-slate-300" />
                  No messages yet. Send your first SMS below!
                </div>
              ) : (
                messages.map((msg) => {
                  const isOutbound = msg.direction === "outbound";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isOutbound ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] md:max-w-[55%] rounded-2xl px-3.5 py-2 md:px-4 md:py-2.5 text-xs md:text-sm leading-relaxed ${
                          isOutbound
                            ? "bg-emerald-600 text-white rounded-br-xs shadow-xs"
                            : "bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-xs"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-all [overflow-wrap:anywhere] select-text">{msg.body}</p>
                      </div>

                      {/* Timestamp & Status */}
                      <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-400 font-medium">
                        <span>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>

                        {isOutbound && (
                          <span className="flex items-center gap-0.5 ml-1">
                            {msg.status === "pending" && <Clock size={11} className="text-amber-500" />}
                            {msg.status === "accepted" && <Check size={11} className="text-slate-400" />}
                            {msg.status === "sent" && <Check size={11} className="text-blue-500" />}
                            {msg.status === "delivered" && <CheckCheck size={12} className="text-emerald-600" />}
                            {msg.status === "failed" && <AlertCircle size={11} className="text-rose-500" />}
                            <span className="capitalize">{msg.status}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Native Phone Messages Style Composer */}
            <div className="p-2.5 sm:p-3 md:p-4 bg-white border-t border-slate-200 shrink-0">
              <form onSubmit={handleSendMessage} className="space-y-1.5">
                {/* The Input Capsule */}
                <div className="flex items-end gap-2 bg-slate-100 hover:bg-slate-100/90 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 border border-slate-200 focus-within:border-emerald-500 rounded-3xl p-1.5 pl-4 transition-all">
                  <textarea
                    rows={1}
                    placeholder={
                      activeConv.contacts?.do_not_text
                        ? "Contact has opted out of SMS messages."
                        : "Text message..."
                    }
                    disabled={activeConv.contacts?.do_not_text || sending}
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    className="flex-1 bg-transparent border-0 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none py-1.5 max-h-24 leading-snug"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() || sending || activeConv.contacts?.do_not_text}
                    className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white flex items-center justify-center shrink-0 transition-all shadow-xs cursor-pointer mb-0.5"
                    title="Send SMS"
                  >
                    <Send size={14} className={inputText.trim() ? "translate-x-0.5" : ""} />
                  </button>
                </div>

                {/* Sub-bar with Live Cost & Segments Counter */}
                <div className="flex items-center justify-between px-3 text-[10px] text-slate-400 font-medium">
                  <span>{charCount} chars • {segmentCount} {segmentCount === 1 ? "seg" : "segs"}</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Coins size={10} className="text-emerald-600" />
                    Est: ~${estCost}
                  </span>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm bg-slate-50/40 p-6 text-center">
            <MessageSquare size={44} className="text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">Select a conversation or start a new one</p>
            <p className="text-xs text-slate-400 mt-0.5">Two-way manual SMS via Telnyx</p>
          </div>
        )}
      </div>

      {/* NEW CONVERSATION MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">Start New SMS Conversation</h3>
            <p className="text-xs text-slate-500 mb-4">Enter a recipient number in international/US format (e.g. +12025550143)</p>

            <form onSubmit={handleCreateNewConversation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+12025550143"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe / HVAC Client"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Stage / Category</label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                >
                  <option value="prospect">Prospect</option>
                  <option value="cold outreach">Cold Outreach</option>
                  <option value="lead">Lead</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPhone.trim() || creatingConv}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {creatingConv ? "Creating..." : "Start Chat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
