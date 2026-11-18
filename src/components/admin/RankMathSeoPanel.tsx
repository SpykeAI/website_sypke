"use client";

import React, { useState } from "react";
import {
  SeoAnalysisResult,
  SeoCheck,
} from "@/lib/seoAnalyzer";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Smartphone,
  Monitor,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Target,
  FileText,
  BarChart2,
  Flame,
  Check
} from "lucide-react";

interface RankMathSeoPanelProps {
  analysis: SeoAnalysisResult;
  focusKeyword: string;
  onFocusKeywordChange: (keyword: string) => void;
  seoTitle: string;
  onSeoTitleChange: (title: string) => void;
  seoDescription: string;
  onSeoDescriptionChange: (desc: string) => void;
  defaultTitle: string;
  defaultDescription: string;
  slug: string;
}

export default function RankMathSeoPanel({
  analysis,
  focusKeyword,
  onFocusKeywordChange,
  seoTitle,
  onSeoTitleChange,
  seoDescription,
  onSeoDescriptionChange,
  defaultTitle,
  defaultDescription,
  slug,
}: RankMathSeoPanelProps) {
  const [devicePreview, setDevicePreview] = useState<"desktop" | "mobile">("desktop");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showSerpEdit, setShowSerpEdit] = useState<boolean>(false);

  // Score colors
  const score = analysis.score;
  const scoreColor =
    score >= 80 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-rose-500";
  const scoreBg =
    score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500";
  const scoreBorder =
    score >= 80 ? "border-emerald-200" : score >= 50 ? "border-amber-200" : "border-rose-200";
  const scoreBadgeBg =
    score >= 80 ? "bg-emerald-50" : score >= 50 ? "bg-amber-50" : "bg-rose-50";

  // Effective SERP text
  const displayTitle = seoTitle || defaultTitle || "Untitled Article";
  const displayDesc =
    seoDescription ||
    defaultDescription ||
    "Add a compelling meta description snippet to appear under your Google search result.";

  // Filter checks by category
  const filteredChecks =
    activeCategory === "all"
      ? analysis.checks
      : analysis.checks.filter((c) => c.category === activeCategory);

  const basicCount = analysis.checks.filter((c) => c.category === "basic" && c.passed).length;
  const additionalCount = analysis.checks.filter((c) => c.category === "additional" && c.passed).length;
  const titleCount = analysis.checks.filter((c) => c.category === "title" && c.passed).length;
  const contentCount = analysis.checks.filter((c) => c.category === "content" && c.passed).length;

  return (
    <div className="space-y-6 text-slate-800">
      {/* 1. Rank Math Header & Live Score Meter */}
      <div className={`p-5 rounded-3xl border ${scoreBorder} ${scoreBadgeBg} relative overflow-hidden transition-all duration-300 shadow-xs`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Circular / Box Score Gauge */}
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col items-center justify-center shrink-0">
              <span className={`text-xl font-black ${scoreColor} leading-none`}>
                {score}
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mt-0.5">
                / 100
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Rank Math SEO
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    score >= 80
                      ? "bg-emerald-100 text-emerald-800"
                      : score >= 50
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {score >= 80 ? "Good" : score >= 50 ? "Fair" : "Poor"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {analysis.passedCount} of {analysis.totalChecks} optimization checks passed
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="hidden sm:flex flex-col text-right text-[11px] text-slate-500 font-medium space-y-0.5">
            <span>
              Words: <strong className="text-slate-800">{analysis.wordCount}</strong>
            </span>
            <span>
              Density: <strong className="text-slate-800">{analysis.keywordDensity}%</strong>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/80 rounded-full h-2 mt-4 overflow-hidden border border-slate-200/50">
          <div
            className={`h-full ${scoreBg} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* 2. Focus Keyword Field */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Target size={14} className="text-[#00DF81]" />
            <span>Focus Keyword</span>
          </label>
          <span className="text-[10px] text-slate-400 font-medium">
            Primary search query
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={focusKeyword}
            onChange={(e) => onFocusKeywordChange(e.target.value)}
            placeholder="e.g. AI Receptionist HVAC Cost"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DF81] bg-slate-50/50 placeholder:text-slate-400"
          />
          {focusKeyword && (
            <span className="absolute right-3 top-2.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              {analysis.keywordCount} in text
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 leading-normal">
          Rank Math will analyze your title, slug, intro, headings and body against this keyword.
        </p>
      </div>

      {/* 3. Google SERP Snippet Simulator */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Search size={14} className="text-blue-500" />
            <span>Google SERP Preview</span>
          </span>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setDevicePreview("desktop")}
              className={`p-1.5 rounded-lg transition ${
                devicePreview === "desktop"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Desktop preview"
            >
              <Monitor size={13} />
            </button>
            <button
              type="button"
              onClick={() => setDevicePreview("mobile")}
              className={`p-1.5 rounded-lg transition ${
                devicePreview === "mobile"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Mobile preview"
            >
              <Smartphone size={13} />
            </button>
          </div>
        </div>

        {/* Google Card Simulator */}
        <div
          className={`p-4 rounded-2xl border border-slate-200/90 bg-[#F8FAFC] font-sans transition-all ${
            devicePreview === "mobile" ? "max-w-xs mx-auto" : "w-full"
          }`}
        >
          {/* Breadcrumb row */}
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-full bg-slate-900 text-[#00DF81] flex items-center justify-center text-[9px] font-black shrink-0">
              S
            </div>
            <div className="text-[11px] text-slate-600 truncate flex items-center gap-1">
              <span>spykeai.com</span>
              <span className="text-slate-400">›</span>
              <span>blog</span>
              <span className="text-slate-400">›</span>
              <span className="truncate">{slug || "article-slug"}</span>
            </div>
          </div>

          {/* SERP Title */}
          <h4 className="text-sm sm:text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-2">
            {displayTitle} | Spyke AI
          </h4>

          {/* SERP Snippet */}
          <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed mt-1">
            {displayDesc}
          </p>
        </div>

        {/* Edit Snippet Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowSerpEdit(!showSerpEdit)}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{showSerpEdit ? "Close Snippet Editor" : "Edit Snippet (Custom SEO Title & Meta Description)"}</span>
            {showSerpEdit ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {showSerpEdit && (
            <div className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-600">Custom SEO Title</label>
                  <span className={`text-[10px] font-mono ${displayTitle.length > 60 ? "text-amber-600 font-bold" : "text-slate-400"}`}>
                    {displayTitle.length} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => onSeoTitleChange(e.target.value)}
                  placeholder={defaultTitle || "Leave blank to use main headline"}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#00DF81]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-600">Custom Meta Description</label>
                  <span className={`text-[10px] font-mono ${displayDesc.length > 160 ? "text-amber-600 font-bold" : "text-slate-400"}`}>
                    {displayDesc.length} / 160 chars
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => onSeoDescriptionChange(e.target.value)}
                  placeholder={defaultDescription || "Leave blank to use article excerpt"}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#00DF81] leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Categorized Checklist Accordion */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>Optimization Checklist</span>
          </span>

          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {analysis.passedCount} / {analysis.totalChecks}
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-xl transition shrink-0 cursor-pointer ${
              activeCategory === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({analysis.totalChecks})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("basic")}
            className={`px-3 py-1.5 rounded-xl transition shrink-0 cursor-pointer ${
              activeCategory === "basic"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            Basic SEO ({basicCount}/5)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("additional")}
            className={`px-3 py-1.5 rounded-xl transition shrink-0 cursor-pointer ${
              activeCategory === "additional"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            Additional ({additionalCount}/5)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("title")}
            className={`px-3 py-1.5 rounded-xl transition shrink-0 cursor-pointer ${
              activeCategory === "title"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            Title ({titleCount}/3)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("content")}
            className={`px-3 py-1.5 rounded-xl transition shrink-0 cursor-pointer ${
              activeCategory === "content"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            Readability ({contentCount}/2)
          </button>
        </div>

        {/* Checklist List */}
        <div className="space-y-2.5 pt-1">
          {filteredChecks.map((check) => (
            <div
              key={check.id}
              className={`p-3 rounded-2xl border transition-all ${
                check.passed
                  ? "bg-emerald-50/40 border-emerald-100/80"
                  : "bg-slate-50 border-slate-200/80"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0">
                  {check.passed ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : (
                    <XCircle size={16} className="text-rose-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-bold ${
                        check.passed ? "text-emerald-950" : "text-slate-900"
                      }`}
                    >
                      {check.label}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider shrink-0 px-1.5 py-0.5 rounded-md ${
                        check.passed
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {check.passed ? `+${check.scoreContribution} pts` : "Fix"}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {check.message}
                  </p>

                  {!check.passed && check.recommendation && (
                    <div className="mt-1.5 text-[10px] font-medium text-amber-700 bg-amber-50/80 px-2 py-1 rounded-lg border border-amber-200/60 flex items-start gap-1">
                      <Sparkles size={11} className="shrink-0 mt-0.5 text-amber-600" />
                      <span>{check.recommendation}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
