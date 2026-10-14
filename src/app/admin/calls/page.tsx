"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Mic,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOff,
  MicOff,
  Volume2,
  Delete,
  Clock,
  ArrowLeft,
  MessageSquare,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Hash,
  User,
  ShieldCheck,
  Send,
  Radio
} from "lucide-react";

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

export default function AdminCallsPage() {
  // Client & Auth State
  const [client, setClient] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "ready" | "error" | "disconnected">("connecting");
  const [callerNumber, setCallerNumber] = useState<string>("+13464770028");
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
  const [showKeypadInCall, setShowKeypadInCall] = useState(false);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Audio & Timer Refs
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Read URL params (e.g. /admin/calls?to=+919876543210)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const toParam = params.get("to");
      if (toParam) {
        setDialNumber(toParam);
        if (toParam.startsWith("+91")) setCountryCode("+91");
        else if (toParam.startsWith("+1")) setCountryCode("+1");
      }
    }
  }, []);

  // 1. Fetch Call Logs
  const fetchCallLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch("/api/calls/log");
      const data = await res.json();
      if (data.ok) {
        setCallLogs(data.logs || []);
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

    async function initWebRTC() {
      setConnectionStatus("connecting");
      setErrorMessage(null);

      try {
        const tokenRes = await fetch("/api/voice/token", { method: "POST" });
        const tokenData = await tokenRes.json();

        if (!tokenRes.ok || !tokenData.ok || !tokenData.token) {
          throw new Error(tokenData.message || "Failed to generate voice token");
        }

        if (tokenData.callerNumber) {
          setCallerNumber(tokenData.callerNumber);
        }

        const { TelnyxRTC } = await import("@telnyx/webrtc");

        rtcInstance = new TelnyxRTC({
          login_token: tokenData.token,
          debug: false,
        });

        rtcInstance.on("telnyx.ready", () => {
          console.log("Superadmin WebRTC Client Ready!");
          setConnectionStatus("ready");
          setErrorMessage(null);
        });

        rtcInstance.on("telnyx.error", (error: any) => {
          console.error("WebRTC Error:", error);
          setConnectionStatus("error");
          setErrorMessage(error?.message || "WebRTC connection error");
        });

        rtcInstance.on("telnyx.socket.close", () => {
          setConnectionStatus("disconnected");
        });

        rtcInstance.on("telnyx.notification", (notification: any) => {
          if (notification?.type === "callUpdate" && notification?.call) {
            const call = notification.call;

            if (call.direction === "inbound" && call.state === "ringing") {
              setIncomingCall(call);
            }

            if (call.state === "active") {
              setCallState("active");
              setIncomingCall(null);
              startCallTimer();

              if (remoteAudioRef.current && call.remoteStream) {
                remoteAudioRef.current.srcObject = call.remoteStream;
                remoteAudioRef.current.play().catch(console.error);
              }
            }

            if (call.state === "ringing" && call.direction === "outbound") {
              setCallState("ringing");
            }

            if (call.state === "hangup" || call.state === "destroy") {
              handleCallTermination();
            }
          }
        });

        rtcInstance.connect();
        setClient(rtcInstance);
      } catch (err: any) {
        console.error("Initialization error:", err);
        setConnectionStatus("error");
        setErrorMessage(err?.message || "Failed to initialize WebRTC phone");
      }
    }

    initWebRTC();
    fetchCallLogs();

    return () => {
      if (rtcInstance) {
        try {
          rtcInstance.disconnect();
        } catch (e) {
          // ignore cleanup
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

  // Format destination helper
  const formatDestinationNumber = (raw: string, country: "+91" | "+1") => {
    let cleaned = raw.trim().replace(/[\s\-\(\)]/g, "");
    if (!cleaned) return "";
    if (cleaned.startsWith("+")) return cleaned;
    if (cleaned.startsWith("00")) return "+" + cleaned.slice(2);
    if (cleaned.startsWith("91") && cleaned.length >= 12) return "+" + cleaned;
    if (cleaned.startsWith("1") && cleaned.length >= 11) return "+" + cleaned;
    if (cleaned.startsWith("0") && cleaned.length === 11) return "+91" + cleaned.slice(1);
    return country + cleaned;
  };

  // 3. Initiate Outbound Call
  const handleStartCall = async (targetPhone?: string) => {
    const rawDest = (targetPhone || dialNumber).trim();
    if (!rawDest || !client || connectionStatus !== "ready" || activeCall) return;

    const dest = formatDestinationNumber(rawDest, countryCode);
    if (!dest) return;

    try {
      setCallState("dialing");
      setErrorMessage(null);

      const logRes = await fetch("/api/calls/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_number: callerNumber,
          to_number: dest,
          direction: "outbound",
          status: "dialing",
        }),
      });
      const logData = await logRes.json();
      if (logData.logId) {
        setCurrentLogId(logData.logId);
      }

      const call = client.newCall({
        destinationNumber: dest,
        callerNumber: callerNumber,
        audio: true,
        video: false,
      });

      setActiveCall(call);
    } catch (err: any) {
      console.error("Failed to place call:", err);
      setCallState("idle");
      setActiveCall(null);
      setErrorMessage(err?.message || "Could not place outbound call");
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

  const handleCallTermination = () => {
    stopCallTimer();
    setCallState("ended");

    if (currentLogId) {
      fetch("/api/calls/log", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logId: currentLogId,
          status: "completed",
          duration_seconds: callDuration,
        }),
      }).then(() => fetchCallLogs());
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
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Hidden Audio element for remote party sound */}
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      {/* Incoming Call Overlay */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <PhoneIncoming size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Incoming Call</h3>
            <p className="text-sm font-semibold text-gray-500 mb-6">
              {incomingCall.callerNumber || "Unknown Caller"}
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleRejectIncoming}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow cursor-pointer"
              >
                <PhoneOff size={16} />
                <span>Decline</span>
              </button>
              <button
                onClick={handleAnswerIncoming}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow cursor-pointer"
              >
                <PhoneCall size={16} />
                <span>Answer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-heading flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-emerald-600" />
              </div>
              Super Admin Calls & Softphone
            </h1>
            <p className="text-gray-500 mt-2">
              Make and receive live voice calls directly inside your browser via Telnyx WebRTC.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Line: {callerNumber}</span>
            </div>
            <Link href="/" className="text-sm font-bold text-emerald-600 hover:underline">
              &larr; Back to Website
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4 overflow-x-auto">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 text-sm transition"
          >
            <Mic className="w-4 h-4 text-emerald-600" />
            AI Call Transcripts
          </Link>
          <Link
            href="/admin/calls"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-xs text-sm"
          >
            <Phone className="w-4 h-4" />
            Live Calls & Softphone
          </Link>
          <Link
            href="/inbox"
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 text-sm transition"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            Telnyx SMS Inbox
          </Link>
        </div>

        {/* Status Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-xs font-bold underline hover:text-rose-900 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: DIALER & ACTIVE CALL (5 COLS) */}
          <div className="lg:col-span-5 bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${connectionStatus === "ready" ? "text-emerald-500 animate-pulse" : "text-amber-500"}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {connectionStatus === "ready" ? "Softphone Online" : "Connecting WebRTC..."}
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                WebRTC SIP
              </span>
            </div>

            {callState !== "idle" ? (
              /* ACTIVE CALL VIEW */
              <div className="flex flex-col items-center text-center py-6 space-y-6 animate-in fade-in">
                <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center text-emerald-600 shadow-lg relative">
                  <User size={44} />
                  {callState === "active" && (
                    <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-wide">
                    {dialNumber || activeCall?.destinationNumber || "Active Call"}
                  </h3>
                  <p className="text-sm font-bold text-emerald-600 mt-1">
                    {callState === "active"
                      ? `Connected • ${formatTime(callDuration)}`
                      : callState === "ringing"
                      ? "Ringing destination..."
                      : callState === "dialing"
                      ? "Initiating call..."
                      : "Call ended"}
                  </p>
                </div>

                {/* Call Control Buttons */}
                <div className="grid grid-cols-3 gap-3 w-full pt-2">
                  <button
                    onClick={handleToggleMute}
                    disabled={callState !== "active"}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition cursor-pointer ${
                      isMuted
                        ? "bg-amber-100 border-amber-400 text-amber-800"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                    }`}
                  >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    <span className="text-xs font-bold mt-1">{isMuted ? "Unmute" : "Mute"}</span>
                  </button>

                  <button
                    onClick={() => setShowKeypadInCall((prev) => !prev)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition cursor-pointer ${
                      showKeypadInCall
                        ? "bg-emerald-100 border-emerald-400 text-emerald-800"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                    }`}
                  >
                    <Hash size={20} />
                    <span className="text-xs font-bold mt-1">Keypad</span>
                  </button>

                  <button
                    onClick={handleHangup}
                    className="flex flex-col items-center justify-center p-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl transition shadow cursor-pointer"
                  >
                    <PhoneOff size={20} />
                    <span className="text-xs font-bold mt-1">End</span>
                  </button>
                </div>

                {/* In-Call DTMF Keypad */}
                {showKeypadInCall && (
                  <div className="grid grid-cols-3 gap-2 w-full pt-2 animate-in fade-in">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((d) => (
                      <button
                        key={d}
                        onClick={() => handleDigitClick(d)}
                        className="py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl text-base font-bold text-gray-800 transition cursor-pointer"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* DIALER VIEW */
              <div className="flex flex-col items-center">
                
                {/* Country Toggle Pills */}
                <div className="flex items-center justify-center gap-2 mb-3.5 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setCountryCode("+91");
                      if (dialNumber.startsWith("+1")) {
                        setDialNumber("+91" + dialNumber.slice(2));
                      }
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      countryCode === "+91"
                        ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-500 shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200"
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
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      countryCode === "+1"
                        ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-500 shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200"
                    }`}
                  >
                    <span className="text-sm">🇺🇸</span>
                    <span>US / CA (+1)</span>
                  </button>
                </div>

                {/* Dialpad Input */}
                <div className="w-full relative mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (!dialNumber.startsWith("+")) {
                        setDialNumber((prev) => "+" + prev);
                      }
                    }}
                    className="absolute left-3 top-3.5 px-2 py-0.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-emerald-700 text-xs font-bold transition cursor-pointer"
                    title="Insert +"
                  >
                    +
                  </button>
                  <input
                    type="text"
                    placeholder={countryCode === "+91" ? "e.g. +91 98765 43210" : "e.g. +1 555 123 4567"}
                    value={dialNumber}
                    onChange={(e) => setDialNumber(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-12 text-center text-xl font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition tracking-wider"
                  />
                  {dialNumber && (
                    <button
                      onClick={handleBackspace}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                      title="Delete digit"
                    >
                      <Delete size={20} />
                    </button>
                  )}
                </div>

                {/* Dialpad Matrix */}
                <div className="grid grid-cols-3 gap-2.5 w-full mb-5">
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
                      className="h-14 bg-gray-50 hover:bg-emerald-50 active:bg-emerald-100 border border-gray-200 hover:border-emerald-300 rounded-2xl flex flex-col items-center justify-center transition shadow-xs cursor-pointer select-none"
                    >
                      <span className="text-xl font-bold text-gray-900 leading-tight">{digit}</span>
                      {sub && <span className="text-[9px] font-bold text-gray-400 tracking-widest">{sub}</span>}
                    </button>
                  ))}
                </div>

                {/* Call Button */}
                <button
                  onClick={() => handleStartCall()}
                  disabled={!dialNumber.trim() || connectionStatus !== "ready"}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/10 cursor-pointer"
                >
                  <Phone size={18} />
                  <span>
                    Call {dialNumber ? (dialNumber.startsWith("+91") ? "India (+91)" : dialNumber.startsWith("+1") ? "US (+1)" : countryCode === "+91" ? "India (+91)" : "US (+1)") : countryCode === "+91" ? "India (+91)" : "US (+1)"}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: CALL ACTIVITY & LOGS (7 COLS) */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl border border-gray-200 p-6 flex flex-col min-h-[580px]">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  Recent Call Activity
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Real-time log of inbound and outbound browser calls</p>
              </div>
              <button
                onClick={fetchCallLogs}
                disabled={loadingLogs}
                className="p-2 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-xl transition cursor-pointer"
                title="Refresh logs"
              >
                <RefreshCw size={16} className={loadingLogs ? "animate-spin" : ""} />
              </button>
            </div>

            {/* Logs List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loadingLogs ? (
                <div className="py-20 text-center text-gray-400 text-sm flex flex-col items-center gap-3">
                  <RefreshCw className="animate-spin text-emerald-600" size={24} />
                  <span>Loading recent calls...</span>
                </div>
              ) : callLogs.length === 0 ? (
                <div className="py-20 text-center text-gray-500 text-sm flex flex-col items-center">
                  <Phone className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="font-semibold text-gray-700">No calls placed yet</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs">
                    Use the softphone dialer on the left to make your first call to India (+91) or the US (+1).
                  </p>
                </div>
              ) : (
                callLogs.map((log) => {
                  const targetNumber = log.direction === "outbound" ? log.to_number : log.from_number;
                  return (
                    <div
                      key={log.id}
                      className="p-4 bg-gray-50 hover:bg-emerald-50/40 border border-gray-200 rounded-2xl flex items-center justify-between transition group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                            log.direction === "outbound"
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {log.direction === "outbound" ? <PhoneCall size={18} /> : <PhoneIncoming size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 tracking-wide">
                            {targetNumber}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                            <span className="capitalize font-semibold text-gray-600">{log.direction}</span>
                            <span>•</span>
                            <span>{new Date(log.started_at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                            <span>•</span>
                            <span className="font-semibold text-emerald-700">
                              {log.duration_seconds ? `${log.duration_seconds}s` : log.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Redial Button */}
                        <button
                          onClick={() => {
                            setDialNumber(targetNumber);
                            if (targetNumber.startsWith("+91")) setCountryCode("+91");
                            else if (targetNumber.startsWith("+1")) setCountryCode("+1");
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-emerald-600 hover:text-white text-gray-700 border border-gray-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          title="Load into dialer"
                        >
                          <Phone size={13} />
                          <span>Redial</span>
                        </button>

                        {/* Send SMS Button */}
                        <Link
                          href={`/inbox`}
                          className="p-2 bg-white hover:bg-emerald-50 text-gray-500 hover:text-emerald-700 border border-gray-200 rounded-xl transition shadow-xs cursor-pointer"
                          title="Open in SMS Inbox"
                        >
                          <MessageSquare size={14} />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick helper tip */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                WebRTC 256-bit SRTP audio encryption
              </span>
              <span className="font-medium text-emerald-700">
                Outbound Profile: India & US Whitelisted
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
