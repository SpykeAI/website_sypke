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
  User
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

export default function BrowserPhonePage() {
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
  const [activeTab, setActiveTab] = useState<"dialer" | "history">("dialer");
  const [showKeypadInCall, setShowKeypadInCall] = useState(false);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Audio & Timer Refs
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
        // Request temporary JWT token from our secure server route
        const tokenRes = await fetch("/api/voice/token", { method: "POST" });
        const tokenData = await tokenRes.json();

        if (!tokenRes.ok || !tokenData.ok || !tokenData.token) {
          throw new Error(tokenData.message || "Failed to get voice token");
        }

        if (tokenData.callerNumber) {
          setCallerNumber(tokenData.callerNumber);
        }

        // Dynamically import @telnyx/webrtc client-side only
        const { TelnyxRTC } = await import("@telnyx/webrtc");

        rtcInstance = new TelnyxRTC({
          login_token: tokenData.token,
          debug: false,
        });

        // Event: Connected & Ready to dial
        rtcInstance.on("telnyx.ready", () => {
          console.log("Telnyx WebRTC Client is Ready!");
          setConnectionStatus("ready");
          setErrorMessage(null);
        });

        // Event: Error
        rtcInstance.on("telnyx.error", (error: any) => {
          console.error("Telnyx WebRTC Error:", error);
          setConnectionStatus("error");
          setErrorMessage(error?.message || "WebRTC connection error");
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

  // 3. Initiate Outbound Call
  const handleStartCall = async (targetPhone?: string) => {
    const rawDest = (targetPhone || dialNumber).trim();
    if (!rawDest || !client || connectionStatus !== "ready" || activeCall) return;

    const dest = formatDestinationNumber(rawDest, countryCode);
    if (!dest) return;

    try {
      setCallState("dialing");
      setErrorMessage(null);

      // Log call start to database
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

      // Create new WebRTC call
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

  // Handle call end / reset
  const handleCallTermination = () => {
    stopCallTimer();
    setCallState("ended");

    // Update log in database
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
            <span className="text-xs font-medium text-slate-300 capitalize">
              {connectionStatus === "ready"
                ? `Line: ${callerNumber}`
                : connectionStatus === "connecting"
                ? "Connecting WebRTC..."
                : "Disconnected"}
            </span>
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

                  {/* Call Button */}
                  <button
                    onClick={() => handleStartCall()}
                    disabled={!dialNumber.trim() || connectionStatus !== "ready"}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950 cursor-pointer"
                  >
                    <Phone size={18} />
                    <span>
                      Call {dialNumber ? (dialNumber.startsWith("+91") ? "India (+91)" : dialNumber.startsWith("+1") ? "US (+1)" : countryCode === "+91" ? "India (+91)" : "US (+1)") : countryCode === "+91" ? "India (+91)" : "US (+1)"}
                    </span>
                  </button>
                </>
              ) : (
                /* CALL HISTORY VIEW */
                <div className="w-full space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {loadingLogs ? (
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
                              <span>{log.duration_seconds ? `${log.duration_seconds}s` : log.status}</span>
                            </p>
                          </div>
                        </div>

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
