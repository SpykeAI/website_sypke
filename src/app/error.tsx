"use client";

import React, { useEffect } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

export default function GlobalAppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application runtime error:", error);
    // If it's a ChunkLoadError from a new deployment, auto-reload once to fetch fresh assets
    if (
      error?.name === "ChunkLoadError" ||
      error?.message?.includes("Loading chunk") ||
      error?.message?.includes("Failed to fetch dynamically imported module")
    ) {
      const lastReload = sessionStorage.getItem("app_last_chunk_reload");
      const now = Date.now();
      if (!lastReload || now - Number(lastReload) > 10000) {
        sessionStorage.setItem("app_last_chunk_reload", String(now));
        window.location.reload();
      }
    }
  }, [error]);

  const handleHardRefresh = () => {
    if (typeof window !== "undefined") {
      window.location.href = window.location.pathname + "?t=" + Date.now();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white text-slate-800 p-6">
      <div className="max-w-md w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-xl text-center">
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          The page could not load due to a temporary network hiccup or an updated version being deployed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </button>
          <button
            onClick={handleHardRefresh}
            className="flex-1 py-3 px-4 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl transition border border-slate-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Reload Fresh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
