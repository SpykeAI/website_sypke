"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Delete,
  Clock,
  ArrowLeft,
  MessageSquare,
  ShieldAlert,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Hash,
  User,
  ChevronDown
} from "lucide-react";
import { getAvailableLines, PhoneLine } from "@/lib/phoneLines";

interface CallLog {
  id: string;
  from_number: string;
  to_number: string;
  direction: string;
  status: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
}

export default function BrowserPhonePage() {
  // Client & Auth State
  const [client, setClient] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "ready" | "error" | "disconnected">("connecting");
  const [callerNumber, setCallerNumber] = useState<string>("+13464770028");
  const [availableLines, setAvailableLines] = useState<PhoneLine[]>(() => getAvailableLines("+13464770028"));
  const [selectedCallerNumber, setSelectedCallerNumber] = useState<string>("+13464770028");
  const [isCustomCaller, setIsCustomCaller] = useState(false);
  const [customCallerInput, setCustomCallerInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Call State
  const [activeCall, setActiveCall] = useState<any>(null);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [callState, setCallState] = useState<"idle" | "dialing" | "ringing" | "active" | "ended">("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);

  // Dialer State
  const [dialNumber, setDialNumber] = useState("");
  const [countryCode, setCountryCode] = useState<"+91" | "+1">("+91");
  const [activeTab, setActiveTab] = useState<"dialer" | "history">("dialer");
  const [showKeypadInCall, setShowKeypadInCall] = useState(false);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Audio & Timer Refs
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const STORAGE_KEY = "spyke_softphone_call_logs";

  const saveLogsToStorage = (logs: CallLog[]) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, 50)));
      }
    } catch (e) {
      console.error("Failed to save call logs to localStorage", e);
    }
  };

  const loadLogsFromStorage = (): CallLog[] => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      }
      return [];
    } catch (e) {
      return [];
    }
  };

  // 1. Fetch Call Logs (Loads local cache instantly, then syncs with server)
  const fetchCallLogs = async () => {
    setLoadingLogs(true);
    try {
      const localCached = loadLogsFromStorage();
      if (localCached.length > 0) {
        setCallLogs(localCached);
      }

      const res = await fetch("/api/calls/log");
      const data = await res.json();
      if (data.ok && Array.isArray(data.logs)) {
        const combined = [...data.logs];
        const ids = new Set(data.logs.map((l: any) => l.id));
        for (const item of localCached) {
          if (!ids.has(item.id)) {
            combined.push(item);
          }
        }
        combined.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
        setCallLogs(combined);
        saveLogsToStorage(combined);
      }
    } catch (err) {
      console.error("Failed to fetch call logs", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  // 2. Initialize Telnyx WebRTC SDK
  useEffect(() => {
    let rtcInstance: any = null;
    let fallbackTimer: NodeJS.Timeout | null = null;

    async function initWebRTC() {
      setConnectionStatus("connecting");
      setErrorMessage(null);

      try {
        // Request temporary JWT token from our secure server route
        const tokenRes = await fetch("/api/voice/token", { method: "POST" });
        const tokenData = await tokenRes.json();

        if (!tokenRes.ok || !tokenData.ok || !tokenData.token) {
          throw new Error(tokenData.message || "Failed to get voice token");
        }

        if (tokenData.callerNumber) {
          const num = tokenData.callerNumber;
          setCallerNumber(num);
          setAvailableLines(getAvailableLines(num));
          setSelectedCallerNumber((prev) => (prev === "+13464770028" ? num : prev));
        }

        // Dynamically import @telnyx/webrtc client-side only
        const { TelnyxRTC } = await import("@telnyx/webrtc");

        rtcInstance = new TelnyxRTC({
          login_token: tokenData.token,
          debug: false,
        });

        // Event: Connected & Ready to dial
        rtcInstance.on("telnyx.ready", () => {
          if (fallbackTimer) clearTimeout(fallbackTimer);
          setConnectionStatus("ready");
          setErrorMessage(null);
        });

        // Event: Error
        rtcInstance.on("telnyx.error", (error: any) => {
          console.error("Telnyx WebRTC Error:", error);
          if (error?.message) {
            setErrorMessage(error.message);
          }
        });

        // Event: Socket close / disconnect
        rtcInstance.on("telnyx.socket.close", () => {
          setConnectionStatus("disconnected");
        });

        // Event: Call Notifications (Incoming & State updates)
        rtcInstance.on("telnyx.notification", (notification: any) => {
          console.log("Telnyx Notification:", notification?.type, notification);

          // Incoming Call
          if (notification?.type === "callUpdate" && notification?.call) {
            const call = notification.call;

            // Inbound ringing
            if (call.direction === "inbound" && call.state === "ringing") {
              setIncomingCall(call);
            }

            // Remote audio stream attachment
            if (call.state === "active") {
              setCallState("active");
              setIncomingCall(null);
              startCallTimer();

              if (remoteAudioRef.current && call.remoteStream) {
                remoteAudioRef.current.srcObject = call.remoteStream;
                remoteAudioRef.current.play().catch(console.error);
              }
            }

            // Ringing state for outbound
            if (call.state === "ringing" && call.direction === "outbound") {
              setCallState("ringing");
            }

            // Hangup / Terminated
            if (call.state === "hangup" || call.state === "destroy") {
              handleCallTermination();
            }
          }
        });

        // Connect signaling socket
        rtcInstance.connect();
        setClient(rtcInstance);

        // Auto-mark ready if connect takes more than 3.5s so user can dial
        fallbackTimer = setTimeout(() => {
          setConnectionStatus("ready");
        }, 3500);
      } catch (err: any) {
        console.error("Initialization error:", err);
        setConnectionStatus("error");
        setErrorMessage(err?.message || "Failed to initialize WebRTC phone");
      }
    }

    initWebRTC();
    fetchCallLogs();

    // Auto-sync call history from Telnyx carrier logs every 10 seconds
    const pollInterval = setInterval(() => {
      fetchCallLogs();
    }, 10000);

    return () => {
      clearInterval(pollInterval);
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (rtcInstance) {
        try {
          rtcInstance.disconnect();
        } catch (e) {
          // ignore cleanup errors
        }
      }
      stopCallTimer();
    };
  }, []);

  // Timer helpers
  const startCallTimer = () => {
    stopCallTimer();
    setCallDuration(0);
    timerIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopCallTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Format destination number based on country prefix
  const formatDestinationNumber = (raw: string, country: "+91" | "+1") => {
    let cleaned = raw.trim().replace(/[\s\-\(\)]/g, "");
    if (!cleaned) return "";
    if (cleaned.startsWith("+")) return cleaned;
    if (cleaned.startsWith("00")) return "+" + cleaned.slice(2);
    if (cleaned.startsWith("91") && cleaned.length >= 12) return "+" + cleaned;
    if (cleaned.startsWith("1") && cleaned.length >= 11) return "+" + cleaned;
    if (cleaned.startsWith("0") && cleaned.length === 11) return "+91" + cleaned.slice(1);
    // If 10 digits without prefix, prepend active country code
    return country + cleaned;
  };

  // 3. Initiate Outbound Call (Optimistic UI + Server sync)
  const handleStartCall = async (targetPhone?: string) => {
    const rawDest = (targetPhone || dialNumber).trim();
    if (!rawDest || activeCall) return;

    const dest = formatDestinationNumber(rawDest, countryCode);
    if (!dest) return;

    const effectiveCaller = (selectedCallerNumber || callerNumber).trim() || "+13464770028";

    // Immediately create and show the call log in the UI!
    const localLogId = `call_${Date.now()}`;
    const newLog: CallLog = {
      id: localLogId,
      from_number: effectiveCaller,
      to_number: dest,
      direction: "outbound",
      status: "calling",
      started_at: new Date().toISOString(),
      ended_at: null,
      duration_seconds: null,
    };
    setCurrentLogId(localLogId);
    setCallLogs((prev) => {
      const updated = [newLog, ...prev.filter((l) => l.id !== localLogId)];
      saveLogsToStorage(updated);
      return updated;
    });

    try {
      setCallState("dialing");
      setErrorMessage(null);

      // Async log to server
      fetch("/api/calls/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_number: effectiveCaller,
          to_number: dest,
          direction: "outbound",
          status: "dialing",
        }),
      })
        .then((r) => r.json())
        .then((logData) => {
          if (logData.logId && logData.logId !== localLogId) {
            setCurrentLogId(logData.logId);
            setCallLogs((prev) => {
              const updated = prev.map((l) => (l.id === localLogId ? { ...l, id: logData.logId } : l));
              saveLogsToStorage(updated);
              return updated;
            });
          }
        })
        .catch(console.error);

      if (client) {
        const call = client.newCall({
          destinationNumber: dest,
          callerNumber: effectiveCaller,
          audio: true,
          video: false,
        });
        setActiveCall(call);
      } else {
        throw new Error("WebRTC phone is initializing. Please wait a few seconds.");
      }
    } catch (err: any) {
      console.error("Failed to place call:", err);
      setCallState("idle");
      setActiveCall(null);
      setErrorMessage(err?.message || "Could not place outbound call");
      setCallLogs((prev) => {
        const updated = prev.map((l) => (l.id === localLogId ? { ...l, status: "failed" } : l));
        saveLogsToStorage(updated);
        return updated;
      });
    }
  };

  // 4. Answer Incoming Call
  const handleAnswerIncoming = () => {
    if (!incomingCall) return;
    try {
      incomingCall.answer({ audio: true, video: false });
      setActiveCall(incomingCall);
      setIncomingCall(null);
      setCallState("active");
      startCallTimer();
    } catch (err: any) {
      console.error("Failed to answer call:", err);
      setErrorMessage("Could not answer incoming call");
    }
  };

  // 5. Reject Incoming Call
  const handleRejectIncoming = () => {
    if (!incomingCall) return;
    try {
      incomingCall.reject();
      setIncomingCall(null);
    } catch (err) {
      console.error("Failed to reject call:", err);
    }
  };

  // 6. Hang Up Active Call
  const handleHangup = () => {
    if (activeCall) {
      try {
        activeCall.hangup();
      } catch (err) {
        console.error("Error hanging up call:", err);
      }
    }
    handleCallTermination();
  };

  // Handle call end / reset
  const handleCallTermination = () => {
    stopCallTimer();
    setCallState("ended");

    const logToUpdate = currentLogId;
    const finalDuration = callDuration;

    setCallLogs((prev) => {
      const updated = prev.map((l) =>
        l.id === logToUpdate
          ? {
              ...l,
              status: "completed",
              duration_seconds: finalDuration,
              ended_at: new Date().toISOString(),
            }
          : l
      );
      saveLogsToStorage(updated);
      return updated;
    });

    if (logToUpdate) {
      fetch("/api/calls/log", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logId: logToUpdate,
          status: "completed",
          duration_seconds: finalDuration,
        }),
      }).catch(console.error);
    }

    setTimeout(() => {
      setActiveCall(null);
      setIncomingCall(null);
      setCallState("idle");
      setCallDuration(0);
      setCurrentLogId(null);
      setIsMuted(false);
      setShowKeypadInCall(false);
    }, 1200);
  };

  // 7. Toggle Microphone Mute
  const handleToggleMute = () => {
    if (!activeCall) return;
    try {
      if (isMuted) {
        activeCall.unmuteAudio();
        setIsMuted(false);
      } else {
        activeCall.muteAudio();
        setIsMuted(true);
      }
    } catch (err) {
      console.error("Error toggling mute:", err);
    }
  };

  // 8. Dialpad digit click
  const handleDigitClick = (digit: string) => {
    if (callState === "active" && activeCall) {
      // Send DTMF tone during live call
      try {
        activeCall.dtmf(digit);
      } catch (e) {
        console.error("Error sending DTMF:", e);
      }
    } else {
      setDialNumber((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setDialNumber((prev) => prev.slice(0, -1));
  };

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 font-sans antialiased overflow-hidden select-none">
      {/* Hidden Audio element for remote party sound */}
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      {/* MAIN CONTAINER */}
      <div className="w-full h-full max-w-4xl mx-auto flex flex-col bg-slate-900 shadow-2xl">
        
        {/* TOP BAR */}
        <div className="p-3.5 px-4 md:px-6 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Admin</span>
            </Link>
            <div className="h-4 w-px bg-slate-700"></div>
            <Link
              href="/inbox"
              className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <MessageSquare size={15} className="text-emerald-400" />
              <span>SMS Inbox</span>
            </Link>
          </div>

          {/* Connection Status Indicator */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                connectionStatus === "ready"
                  ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                  : connectionStatus === "connecting"
                  ? "bg-amber-500 animate-pulse"
                  : "bg-rose-500"
              }`}
            ></span>
            <span className="text-xs font-medium text-slate-300">
              {connectionStatus === "ready"
                ? `Line: ${availableLines.find(l => l.number === selectedCallerNumber)?.formatted || selectedCallerNumber}`
                : connectionStatus === "connecting"
                ? "Connecting WebRTC..."
                : "Disconnected"}
            </span>
            {connectionStatus !== "ready" && (
              <button
                type="button"
                onClick={() => setConnectionStatus("ready")}
                className="text-[10px] text-emerald-400 font-bold hover:underline cursor-pointer"
                title="Click if connecting takes too long"
              >
                (Ready)
              </button>
            )}
          </div>
        </div>

        {/* ERROR BANNER */}
        {errorMessage && (
          <div className="bg-rose-950/80 border-b border-rose-800/60 px-4 py-2.5 text-rose-200 text-xs flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShieldAlert size={15} className="text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-300 hover:text-white text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* INCOMING CALL MODAL POPUP */}
        {incomingCall && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <PhoneIncoming size={32} />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Incoming Call</h3>
              <p className="text-sm font-semibold text-slate-300 mb-6">
                {incomingCall.callerNumber || "Unknown Caller"}
              </p>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleRejectIncoming}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer"
                >
                  <PhoneOff size={16} />
                  <span>Decline</span>
                </button>
                <button
                  onClick={handleAnswerIncoming}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer"
                >
                  <PhoneCall size={16} />
                  <span>Answer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CENTER CONTENT: DIALER OR ACTIVE CALL */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4">
          
          {callState !== "idle" ? (
            /* ACTIVE CALL SCREEN */
            <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-emerald-400 shadow-xl relative">
                <User size={44} />
                {callState === "active" && (
                  <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">
                  {dialNumber || activeCall?.destinationNumber || "In Call"}
                </h2>
                <p className="text-sm font-semibold text-emerald-400 mt-1 capitalize">
                  {callState === "active"
                    ? formatTime(callDuration)
                    : callState === "ringing"
                    ? "Ringing..."
                    : callState === "dialing"
                    ? "Calling..."
                    : "Call Ended"}
                </p>
              </div>

              {/* Call Control Buttons */}
              <div className="grid grid-cols-3 gap-4 w-full pt-4">
                {/* Mute Button */}
                <button
                  onClick={handleToggleMute}
                  disabled={callState !== "active"}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                    isMuted
                      ? "bg-amber-600/20 border-amber-500 text-amber-300"
                      : "bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300"
                  }`}
                >
                  {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                  <span className="text-[11px] font-semibold mt-1.5">{isMuted ? "Unmute" : "Mute"}</span>
                </button>

                {/* Keypad in-call toggle */}
                <button
                  onClick={() => setShowKeypadInCall((prev) => !prev)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                    showKeypadInCall
                      ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                      : "bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300"
                  }`}
                >
                  <Hash size={22} />
                  <span className="text-[11px] font-semibold mt-1.5">Keypad</span>
                </button>

                {/* Hang up Button */}
                <button
                  onClick={handleHangup}
                  className="flex flex-col items-center justify-center p-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl transition-all shadow-lg cursor-pointer"
                >
                  <PhoneOff size={22} />
                  <span className="text-[11px] font-semibold mt-1.5">End Call</span>
                </button>
              </div>

              {/* In-Call Keypad for IVR DTMF */}
              {showKeypadInCall && (
                <div className="grid grid-cols-3 gap-2 w-full pt-2 animate-in fade-in duration-150">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((d) => (
                    <button
                      key={d}
                      onClick={() => handleDigitClick(d)}
                      className="py-2.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-xl text-base font-bold text-white transition-all cursor-pointer"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* DIALER OR CALL HISTORY TABS */
            <div className="w-full max-w-sm flex flex-col items-center">
              
              {/* Tab Selector */}
              <div className="flex items-center p-1 bg-slate-800 border border-slate-700/80 rounded-xl mb-5 w-full">
                <button
                  onClick={() => setActiveTab("dialer")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === "dialer"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Dialer
                </button>
                <button
                  onClick={() => {
                    setActiveTab("history");
                    fetchCallLogs();
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === "history"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Call History
                </button>
              </div>

              {activeTab === "dialer" ? (
                <>
                  {/* Outbound Caller ID / From Number Selector */}
                  <div className="w-full mb-3.5 bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700/80">
                    <div className="flex items-center justify-between mb-1.5 px-0.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>Call From (Caller ID)</span>
                      </label>
                      <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                        {availableLines.find((l) => l.number === selectedCallerNumber)?.badge || "Active Line"}
                      </span>
                    </div>
                    <div className="relative">
                      <select
                        value={isCustomCaller ? "custom" : selectedCallerNumber}
                        onChange={(e) => {
                          if (e.target.value === "custom") {
                            setIsCustomCaller(true);
                          } else {
                            setIsCustomCaller(false);
                            setSelectedCallerNumber(e.target.value);
                          }
                        }}
                        className="w-full appearance-none bg-slate-900 border border-slate-700 hover:border-emerald-500/60 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 pr-8 transition cursor-pointer"
                      >
                        {availableLines.map((line) => (
                          <option key={line.number} value={line.number} className="bg-slate-900 text-white">
                            {line.flag} {line.label} — {line.formatted}
                          </option>
                        ))}
                        <option value="custom" className="bg-slate-900 text-white">✏️ Custom Caller Number...</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {isCustomCaller && (
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="e.g. +1234567890"
                          value={customCallerInput}
                          onChange={(e) => {
                            setCustomCallerInput(e.target.value);
                            setSelectedCallerNumber(e.target.value);
                          }}
                          className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Country Selector Pills */}
                  <div className="flex items-center justify-center gap-2 mb-3.5 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        setCountryCode("+91");
                        if (dialNumber.startsWith("+1")) {
                          setDialNumber("+91" + dialNumber.slice(2));
                        }
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        countryCode === "+91"
                          ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/60 shadow-xs"
                          : "bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60"
                      }`}
                    >
                      <span className="text-sm">🇮🇳</span>
                      <span>India (+91)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCountryCode("+1");
                        if (dialNumber.startsWith("+91")) {
                          setDialNumber("+1" + dialNumber.slice(3));
                        }
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        countryCode === "+1"
                          ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/60 shadow-xs"
                          : "bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60"
                      }`}
                    >
                      <span className="text-sm">🇺🇸</span>
                      <span>US / CA (+1)</span>
                    </button>
                  </div>

                  {/* Phone Number Display Input */}
                  <div className="w-full relative mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (!dialNumber.startsWith("+")) {
                          setDialNumber((prev) => "+" + prev);
                        }
                      }}
                      className="absolute left-3 top-3.5 px-2 py-0.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-emerald-400 text-xs font-bold transition-colors cursor-pointer"
                      title="Insert +"
                    >
                      +
                    </button>
                    <input
                      type="text"
                      placeholder={countryCode === "+91" ? "e.g. +91 98765 43210" : "e.g. +1 555 123 4567"}
                      value={dialNumber}
                      onChange={(e) => setDialNumber(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl py-3 pl-12 pr-12 text-center text-lg font-bold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all tracking-wider"
                    />
                    {dialNumber && (
                      <button
                        onClick={handleBackspace}
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Delete digit"
                      >
                        <Delete size={20} />
                      </button>
                    )}
                  </div>

                  {/* Dialpad Matrix */}
                  <div className="grid grid-cols-3 gap-3 w-full mb-6">
                    {[
                      { digit: "1", sub: "" },
                      { digit: "2", sub: "ABC" },
                      { digit: "3", sub: "DEF" },
                      { digit: "4", sub: "GHI" },
                      { digit: "5", sub: "JKL" },
                      { digit: "6", sub: "MNO" },
                      { digit: "7", sub: "PQRS" },
                      { digit: "8", sub: "TUV" },
                      { digit: "9", sub: "WXYZ" },
                      { digit: "*", sub: "" },
                      { digit: "0", sub: "+" },
                      { digit: "#", sub: "" },
                    ].map(({ digit, sub }) => (
                      <button
                        key={digit}
                        onClick={() => handleDigitClick(digit)}
                        className="h-16 bg-slate-800/80 hover:bg-slate-700/80 active:bg-slate-600/80 border border-slate-700/60 rounded-2xl flex flex-col items-center justify-center transition-all shadow-xs cursor-pointer select-none"
                      >
                        <span className="text-xl font-bold text-white leading-tight">{digit}</span>
                        {sub && <span className="text-[9px] font-semibold text-slate-400 tracking-widest">{sub}</span>}
                      </button>
                    ))}
                  </div>

                  {/* Call & Chat Buttons */}
                  <div className="flex items-center gap-2.5 w-full">
                    <button
                      onClick={() => handleStartCall()}
                      disabled={!dialNumber.trim() || callState !== "idle"}
                      className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950 cursor-pointer"
                    >
                      <Phone size={18} />
                      <span>
                        Call {dialNumber ? (dialNumber.startsWith("+91") ? "India (+91)" : dialNumber.startsWith("+1") ? "US (+1)" : countryCode === "+91" ? "India (+91)" : "US (+1)") : countryCode === "+91" ? "India (+91)" : "US (+1)"}
                      </span>
                    </button>

                    {dialNumber.trim() && (
                      <Link
                        href={`/inbox?phone=${encodeURIComponent(formatDestinationNumber(dialNumber, countryCode))}`}
                        className="h-13 px-4 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white border border-slate-700 rounded-2xl flex items-center justify-center gap-1.5 transition text-xs font-bold cursor-pointer shrink-0 shadow-xs"
                        title="Open SMS Chat with this number"
                      >
                        <MessageSquare size={17} />
                        <span className="hidden sm:inline">SMS</span>
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                /* CALL HISTORY VIEW */
                <div className="w-full space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {loadingLogs && callLogs.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                      <RefreshCw className="animate-spin text-emerald-500" size={20} />
                      Loading call logs...
                    </div>
                  ) : callLogs.length === 0 ? (
                    <div className="p-10 text-center text-slate-500 text-xs">
                      No calls placed yet. Use the dialer to make a call!
                    </div>
                  ) : (
                    callLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            log.direction === "outbound"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          }`}>
                            {log.direction === "outbound" ? <PhoneCall size={16} /> : <PhoneIncoming size={16} />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              {log.direction === "outbound" ? log.to_number : log.from_number}
                            </p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span>{new Date(log.started_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                              <span>•</span>
                              <span className={`capitalize font-semibold ${
                                log.status === "failed" || log.status === "no_answer"
                                  ? "text-amber-400"
                                  : log.status === "calling" || log.status === "dialing"
                                  ? "text-blue-400 animate-pulse"
                                  : "text-emerald-400"
                              }`}>
                                {log.duration_seconds && log.duration_seconds > 0
                                  ? `${log.duration_seconds}s`
                                  : log.status === "no_answer"
                                  ? "No Answer"
                                  : log.status === "calling" || log.status === "dialing"
                                  ? "Dialing..."
                                  : log.status}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              const num = log.direction === "outbound" ? log.to_number : log.from_number;
                              setDialNumber(num);
                              setActiveTab("dialer");
                            }}
                            className="p-2 bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Redial"
                          >
                            <Phone size={14} />
                          </button>
                          <Link
                            href={`/inbox?phone=${encodeURIComponent(log.direction === "outbound" ? log.to_number : log.from_number)}`}
                            className="p-2 bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Chat in SMS Inbox"
                          >
                            <MessageSquare size={14} />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
