"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { BLOG_POSTS, BlogPost } from "@/data/blogPosts";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import { 
  ArrowRight, 
  Clock, 
  Calendar, 
  Search, 
  Sparkles, 
  PhoneCall, 
  CheckCircle2, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck,
  Flame
} from "lucide-react";

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts(data.posts);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch dynamic blogs:", err);
      });
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((p) => p.category)));
    return ["All", ...cats];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return posts.find((p) => p.isFeatured) || posts[0] || BLOG_POSTS[0];
  }, [posts]);

  const gridPosts = useMemo(() => {
    if (selectedCategory === "All" && !searchQuery) {
      return filteredPosts.filter((p) => p.slug !== featuredPost?.slug);
    }
    return filteredPosts;
  }, [filteredPosts, selectedCategory, searchQuery, featuredPost]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-24 md:pb-16">
      {/* 1. Header / Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00DF81_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Flame size={14} className="text-emerald-400 animate-pulse" />
            <span>The Protocol • HVAC AI Infrastructure</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            AI Voice & Operational Insights for Modern HVAC Contractors
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Tactical breakdowns, real-world pricing guides, and zero-latency dispatch workflows to capture every after-hours repair call 24/7/365.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search HVAC dispatch, pricing, ServiceTitan integration..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 focus:border-emerald-400 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 shadow-inner transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Filter Pill Bar */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 mr-1 hidden sm:inline-block">
              Filter:
            </span>
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs md:text-sm font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Featured Post (Only visible when viewing All & without search query) */}
        {selectedCategory === "All" && !searchQuery && (
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                Featured Industry Deep Dive
              </span>
            </div>

            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group block bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto overflow-hidden bg-slate-900">
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-400/30 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    {featuredPost.category}
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-slate-600" />
                        {featuredPost.publishDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-slate-600" />
                        {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug tracking-tight">
                      {featuredPost.title}
                    </h2>

                    <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{featuredPost.author.name}</div>
                        <div className="text-[11px] text-slate-600 truncate max-w-[160px] sm:max-w-none">
                          {featuredPost.author.role}
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                      Read Guide <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Article Grid */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {selectedCategory === "All" ? "Latest Operational Guides" : `${selectedCategory} Articles`}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {filteredPosts.length} practical {filteredPosts.length === 1 ? "breakdown" : "breakdowns"} for HVAC growth
            </p>
          </div>
        </div>

        {gridPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <BookOpen size={40} className="mx-auto text-slate-300 mb-3" />
            <h4 className="text-lg font-bold text-slate-700">No articles found</h4>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your category filter or search query.</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 text-xs font-bold px-4 py-2 bg-slate-900 text-white rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {gridPosts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <Link href={`/blog/${post.slug}`} className="block relative h-48 sm:h-52 overflow-hidden bg-slate-900">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md text-emerald-400 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </div>
                </Link>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold mb-2.5">
                      <span>{post.publishDate}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {post.readTime}
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="block group/link">
                      <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover/link:text-emerald-700 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h4>
                    </Link>

                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600 truncate max-w-[150px]">
                      By {post.author.name}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform"
                    >
                      Read Guide <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 4. Desktop Bottom Technical Audit Banner */}
        <section className="mt-16 sm:mt-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/30">
              <Sparkles size={13} />
              <span>Free HVAC Operational Audit</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Find Out How Many After-Hours Emergency Calls Your Business Is Leaking
            </h3>

            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              We review your current answering service, call volume, and ServiceTitan/Housecall Pro workflow to calculate your exact monthly revenue bleed—free of charge.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/contact#lead-form"
                className="bg-gradient-to-r from-emerald-500 to-[#00DF81] hover:brightness-105 active:scale-95 text-slate-950 font-black text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2"
              >
                <span>Book Technical Audit</span>
                <ArrowRight size={16} />
              </Link>

              <a
                href="tel:+13464770028"
                className="bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-sm px-5 py-3.5 rounded-xl transition border border-slate-700 inline-flex items-center gap-2"
              >
                <PhoneCall size={16} className="text-emerald-400" />
                <span>Call Dispatch Line: +1 (346) 477-0028</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* 5. Mobile Floating Action Bar */}
      <MobileStickyCTA customAuditLink="/contact#lead-form" />
    </div>
  );
}
