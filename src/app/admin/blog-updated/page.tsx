"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { BlogPost, BLOG_POSTS } from "@/data/blogPosts";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Upload,
  Check,
  X,
  AlertCircle,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  Eye,
  FileText,
  User,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Maximize2,
  Minimize2,
  ChevronUp,
  ChevronDown,
  Globe,
  Sliders,
  CheckSquare,
  FileEdit
} from "lucide-react";

const DEFAULT_AUTHOR = {
  name: "Srikanishka Vadakattu",
  role: "Founder & AI Systems Architect, Spyke AI",
  avatar: "/images/authors/srikanishka.png",
};

const DEFAULT_CATEGORIES = [
  "Cost & Economics",
  "Dispatch & Operations",
  "CRM & Infrastructure",
  "Implementation",
];

export default function AdminBlogManagerUpdatedPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Dynamic Categories State
  const [customCategories, setCustomCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [newCategoryInput, setNewCategoryInput] = useState<string>("");
  const [isAddingCategoryInEditor, setIsAddingCategoryInEditor] = useState<boolean>(false);
  const [editorNewCategory, setEditorNewCategory] = useState<string>("");

  const allCategories = useMemo(() => {
    const fromPosts = posts.map((p) => p.category).filter(Boolean);
    return Array.from(new Set([...customCategories, ...fromPosts]));
  }, [customCategories, posts]);

  const handleAddCategory = (catName: string) => {
    const clean = catName.trim();
    if (!clean) return;
    if (!customCategories.includes(clean)) {
      setCustomCategories((prev) => [...prev, clean]);
    }
    showToast("success", `Category "${clean}" added!`);
  };

  const handleCreateCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryInput.trim()) return;
    handleAddCategory(newCategoryInput);
    setSelectedCategory(newCategoryInput.trim());
    setNewCategoryInput("");
    setShowAddCategoryModal(false);
  };

  // FULL MODE SCREEN State
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isEditingExisting, setIsEditingExisting] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [editSlug, setEditSlug] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [excerpt, setExcerpt] = useState<string>("");
  const [category, setCategory] = useState<string>("Cost & Economics");
  const [readTime, setReadTime] = useState<string>("5 min read");
  const [publishDate, setPublishDate] = useState<string>("");
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [featuredImage, setFeaturedImage] = useState<string>("");

  // Author State
  const [authorName, setAuthorName] = useState<string>(DEFAULT_AUTHOR.name);
  const [authorRole, setAuthorRole] = useState<string>(DEFAULT_AUTHOR.role);
  const [authorAvatar, setAuthorAvatar] = useState<string>(DEFAULT_AUTHOR.avatar);

  // Content State
  const [introduction, setIntroduction] = useState<string>("");
  const [sections, setSections] = useState<
    {
      id: string;
      title: string;
      body: string;
      calloutType: "none" | "tip" | "warning" | "stat";
      calloutTitle: string;
      calloutText: string;
    }[]
  >([]);
  const [conclusion, setConclusion] = useState<string>("");

  // Active section scroll state
  const [activeInspectorTab, setActiveInspectorTab] = useState<"media" | "seo" | "author">("media");

  // Delete Confirmation State
  const [deleteTargetSlug, setDeleteTargetSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
        setPosts(data.posts);
      } else {
        setPosts(BLOG_POSTS);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setPosts(BLOG_POSTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const showToast = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4500);
  };

  // Open Full-Screen Create
  const handleOpenCreate = () => {
    setIsEditingExisting(false);
    setEditSlug("");
    setTitle("");
    setSlug("");
    setExcerpt("");
    setCategory("Cost & Economics");
    setReadTime("5 min read");
    setPublishDate(
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
    setIsFeatured(false);
    setFeaturedImage("https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80");
    setAuthorName(DEFAULT_AUTHOR.name);
    setAuthorRole(DEFAULT_AUTHOR.role);
    setAuthorAvatar(DEFAULT_AUTHOR.avatar);
    setIntroduction("");
    setSections([
      {
        id: "section-1",
        title: "1. Key Industry Overview",
        body: "Detail the critical operational challenges, emergency response metrics, and why automation solves this issue.",
        calloutType: "none",
        calloutTitle: "",
        calloutText: "",
      },
    ]);
    setConclusion("");
    setIsEditorOpen(true);
  };

  // Open Full-Screen Edit
  const handleOpenEdit = (post: BlogPost) => {
    setIsEditingExisting(true);
    setEditSlug(post.slug);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setCategory(post.category);
    setReadTime(post.readTime);
    setPublishDate(post.publishDate);
    setIsFeatured(!!post.isFeatured);
    setFeaturedImage(post.featuredImage);

    setAuthorName(post.author?.name || DEFAULT_AUTHOR.name);
    setAuthorRole(post.author?.role || DEFAULT_AUTHOR.role);
    setAuthorAvatar(post.author?.avatar || DEFAULT_AUTHOR.avatar);

    setIntroduction(post.content?.introduction || "");
    setConclusion(post.content?.conclusion || "");

    if (post.content?.sections && post.content.sections.length > 0) {
      setSections(
        post.content.sections.map((sec, idx) => ({
          id: sec.id || `section-${idx + 1}`,
          title: sec.title,
          body: Array.isArray(sec.body) ? sec.body.join("\n\n") : (sec.body as string) || "",
          calloutType: sec.callout ? sec.callout.type : "none",
          calloutTitle: sec.callout ? sec.callout.title : "",
          calloutText: sec.callout ? sec.callout.text : "",
        }))
      );
    } else {
      setSections([
        {
          id: "section-1",
          title: "1. Key Industry Overview",
          body: "",
          calloutType: "none",
          calloutTitle: "",
          calloutText: "",
        },
      ]);
    }

    setIsEditorOpen(true);
  };

  // Auto-slugify on title edit
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditingExisting) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  // Image Upload to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/blog/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setFeaturedImage(data.url);
        showToast("success", "Featured image uploaded to Supabase Storage!");
      } else {
        showToast("error", data.error || "Failed to upload image");
      }
    } catch {
      showToast("error", "Network error during upload");
    } finally {
      setUploadingImage(false);
    }
  };

  // Add Section
  const handleAddSection = () => {
    const nextNum = sections.length + 1;
    setSections([
      ...sections,
      {
        id: `section-${Date.now()}`,
        title: `${nextNum}. New Section Title`,
        body: "",
        calloutType: "none",
        calloutTitle: "",
        calloutText: "",
      },
    ]);
  };

  // Move Section Up/Down
  const handleMoveSection = (idx: number, direction: "up" | "down") => {
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === sections.length - 1)) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const updated = [...sections];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSections(updated);
  };

  // Remove Section
  const handleRemoveSection = (idx: number) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((_, i) => i !== idx));
  };

  // Update Section
  const handleSectionChange = (idx: number, field: string, val: any) => {
    const updated = [...sections];
    updated[idx] = { ...updated[idx], [field]: val };
    setSections(updated);
  };

  // Save Post to API
  const handleSavePost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      showToast("error", "Article Title and URL Slug are required.");
      return;
    }

    setSaving(true);
    try {
      const formattedSections = sections.map((sec) => {
        const bodyParagraphs = sec.body
          .split("\n\n")
          .map((p) => p.trim())
          .filter(Boolean);

        const sectionObj: any = {
          id: sec.id || sec.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title: sec.title,
          body: bodyParagraphs.length > 0 ? bodyParagraphs : [sec.body],
        };

        if (sec.calloutType !== "none" && sec.calloutText) {
          sectionObj.callout = {
            type: sec.calloutType,
            title: sec.calloutTitle || "Key Insight",
            text: sec.calloutText,
          };
        }

        return sectionObj;
      });

      const tableOfContents = formattedSections.map((sec) => ({
        id: sec.id,
        title: sec.title,
      }));

      const postPayload: BlogPost = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        category: category as any,
        readTime: readTime.trim() || "5 min read",
        publishDate: publishDate.trim() || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        isFeatured,
        featuredImage: featuredImage.trim(),
        author: {
          name: authorName.trim(),
          role: authorRole.trim(),
          avatar: authorAvatar.trim() || DEFAULT_AUTHOR.avatar,
        },
        content: {
          tableOfContents,
          introduction: introduction.trim(),
          sections: formattedSections,
          conclusion: conclusion.trim(),
        },
      };

      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post: postPayload }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast("success", `Article "${postPayload.title}" saved & published live!`);
        setIsEditorOpen(false);
        fetchBlogs();
      } else {
        showToast("error", data.error || "Failed to save article");
      }
    } catch {
      showToast("error", "Network error saving article");
    } finally {
      setSaving(false);
    }
  };

  // Delete Post
  const confirmDeletePost = async () => {
    if (!deleteTargetSlug) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog?slug=${encodeURIComponent(deleteTargetSlug)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("success", "Article deleted successfully.");
        setDeleteTargetSlug(null);
        fetchBlogs();
      } else {
        showToast("error", data.error || "Failed to delete article");
      }
    } catch {
      showToast("error", "Network error deleting article");
    } finally {
      setDeleting(false);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredCount = posts.filter((p) => p.isFeatured).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Super Admin Navigation Sidebar */}
      <AdminSidebar active="blog_updated" />

      {/* Main Content Area (Dashboard List View) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/90 px-6 py-5 sticky top-0 z-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 shadow-2xs">
                  <FileEdit size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Blog Manager Updated
                    </h1>
                    <span className="bg-purple-50 text-purple-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                      <Maximize2 size={11} className="text-purple-600" />
                      Full-Screen Studio
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Clicking <span className="font-bold text-slate-700">"Edit Post"</span> opens in expansive full-screen mode with two-column studio editor
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={fetchBlogs}
                className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                title="Refresh from database"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>

              <Link
                href="/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
              >
                <Eye size={14} className="text-slate-500" />
                <span>View Live Blog</span>
                <ExternalLink size={12} className="text-slate-400" />
              </Link>

              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-[#00DF81] hover:bg-[#00c271] active:scale-95 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-[#00DF81]/25 cursor-pointer"
              >
                <Plus size={16} />
                <span>Create New Post (Full Screen)</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {feedbackMsg && (
            <div
              className={`mt-3 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                feedbackMsg.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border border-rose-200 text-rose-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {feedbackMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                <span>{feedbackMsg.text}</span>
              </div>
              <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            </div>
          )}
        </header>

        {/* Content Container */}
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Articles</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{posts.length}</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 inline-block">100% Published</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Featured Guides</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">{featuredCount}</p>
              <span className="text-[11px] text-slate-500 font-medium mt-0.5 inline-block">Primary Hero Slot</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Categories</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{allCategories.length}</p>
              <span className="text-[11px] text-slate-500 font-medium mt-0.5 inline-block">Active Categories</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Editor Mode</span>
              <p className="text-base font-extrabold text-purple-700 mt-1 flex items-center gap-1.5">
                <Maximize2 size={16} />
                Full-Screen Studio
              </p>
              <span className="text-[11px] text-slate-400 font-medium mt-0.5 inline-block">No popup dialog</span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles by title, excerpt, or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DF81] focus:border-transparent transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Filter Pills & Add Category */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === "All"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All ({posts.length})
              </button>
              {allCategories.map((cat) => {
                const count = posts.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-emerald-600 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}

              {/* + Add Category Button */}
              <button
                type="button"
                onClick={() => setShowAddCategoryModal(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer"
                title="Add a new category"
              >
                <Plus size={13} />
                <span>Add Category</span>
              </button>
            </div>
          </div>

          {/* Articles Listing */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
              <RefreshCw size={24} className="text-emerald-500 animate-spin mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">Loading articles from database...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
              <FileText size={36} className="text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No articles found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No blog posts match your current search criteria.
              </p>
              <button
                onClick={handleOpenCreate}
                className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
              >
                Create Article in Full Screen
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredPosts.map((post) => (
                <div
                  key={post.slug}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* Featured Image Thumbnail */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative group">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {post.isFeatured && (
                        <span className="absolute top-1 left-1 bg-[#00DF81] text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                          ★ HERO
                        </span>
                      )}
                    </div>

                    {/* Metadata & Title */}
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {post.category}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                          <Clock size={11} />
                          {post.readTime}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                          <Calendar size={11} />
                          {post.publishDate}
                        </span>
                      </div>

                      <h3
                        onClick={() => handleOpenEdit(post)}
                        className="text-sm sm:text-base font-extrabold text-slate-900 hover:text-purple-600 transition cursor-pointer line-clamp-1 flex items-center gap-1.5 group"
                      >
                        <span>{post.title}</span>
                        <Maximize2 size={13} className="text-slate-400 group-hover:text-purple-600 shrink-0 opacity-0 group-hover:opacity-100 transition" />
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 max-w-2xl leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={post.author?.avatar || DEFAULT_AUTHOR.avatar}
                            alt={post.author?.name}
                            className="w-4 h-4 rounded-full object-cover border border-slate-200"
                          />
                          <span className="text-[11px] font-semibold text-slate-700">
                            {post.author?.name}
                          </span>
                        </div>
                        <span className="text-slate-300 text-xs">·</span>
                        <span className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                          /blog/{post.slug}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
                      title="View live post on website"
                    >
                      <Eye size={16} />
                    </Link>

                    <button
                      onClick={() => handleOpenEdit(post)}
                      className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs shadow-purple-600/20 cursor-pointer"
                    >
                      <Maximize2 size={13} />
                      <span>Edit in Full Screen</span>
                    </button>

                    <button
                      onClick={() => setDeleteTargetSlug(post.slug)}
                      className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
                      title="Delete post"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 🌟 TRUE FULL MODE SCREEN STUDIO EDITOR (NOT A POPUP!) 🌟 */}
      {/* Takes over 100% of viewport width & height with dual-column studio layout */}
      {/* ========================================================================= */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col w-screen h-screen overflow-hidden animate-in fade-in duration-150">
          {/* Top Full-Screen Studio Bar */}
          <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
            {/* Left: Back button & Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ArrowLeft size={14} />
                <span>Exit Full Screen</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-extrabold text-slate-900 tracking-tight">
                  {isEditingExisting ? "Full-Screen Editor" : "New Article Studio"}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium truncate max-w-xs md:max-w-md">
                  {title || "Untitled Article"}
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5">
              {isEditingExisting && slug && (
                <Link
                  href={`/blog/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition items-center gap-1.5"
                >
                  <Eye size={13} />
                  <span>Preview Live</span>
                  <ExternalLink size={11} className="text-slate-400" />
                </Link>
              )}

              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSavePost}
                disabled={saving}
                className="px-5 py-2 text-xs font-extrabold text-slate-950 bg-[#00DF81] hover:bg-[#00c271] active:scale-95 rounded-xl transition shadow-lg shadow-[#00DF81]/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>{isEditingExisting ? "Save & Publish" : "Publish Article"}</span>
                  </>
                )}
              </button>
            </div>
          </header>

          {/* Studio Body: Split View (Main Document Canvas + Settings Inspector) */}
          <div className="flex-1 flex overflow-hidden">
            {/* 1. Main Document Canvas (Spacious Left Column) */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8">
              <div className="max-w-4xl mx-auto space-y-8 pb-20">
                {/* Hero Title & Headline */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                      <FileText size={13} />
                      Article Title & Headline
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {slug ? `/blog/${slug}` : "slug will auto-generate"}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. How Much Does an AI Receptionist Cost for HVAC Contractors in 2026?"
                    className="w-full text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 placeholder:text-slate-300 border-none outline-none focus:ring-0 p-0 bg-transparent leading-tight"
                  />

                  {/* Excerpt / Summary */}
                  <div className="pt-4 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Article Excerpt / Teaser Hook *
                    </label>
                    <textarea
                      rows={2}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="A comprehensive breakdown comparing traditional answering services ($1,800/mo) vs in-house dispatchers vs AI voice agents..."
                      className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DF81] bg-slate-50/60 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Introduction Section */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-emerald-500" />
                    Opening Introduction
                  </span>
                  <p className="text-xs text-slate-400">
                    Set the context for homeowners and HVAC business owners. What immediate problem does this article solve?
                  </p>
                  <textarea
                    rows={4}
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                    placeholder="Write your compelling opening paragraph here..."
                    className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DF81] bg-slate-50/60 leading-relaxed font-sans"
                  />
                </div>

                {/* Dynamic Content Sections Builder */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        <span>Content Sections</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          {sections.length}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Each section automatically builds a Table of Contents entry on the public guide
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="px-4 py-2 text-xs font-bold text-slate-900 bg-[#00DF81] hover:bg-[#00c271] rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Section</span>
                    </button>
                  </div>

                  {sections.map((sec, idx) => (
                    <div
                      key={sec.id || idx}
                      className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 relative group"
                    >
                      {/* Section Card Top Header */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            Section {idx + 1}
                          </span>
                        </div>

                        {/* Order & Delete Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveSection(idx, "up")}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                            title="Move section up"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveSection(idx, "down")}
                            disabled={idx === sections.length - 1}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                            title="Move section down"
                          >
                            <ChevronDown size={16} />
                          </button>
                          {sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSection(idx)}
                              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 ml-1"
                              title="Delete section"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Section Title */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Section Heading *
                        </label>
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => handleSectionChange(idx, "title", e.target.value)}
                          placeholder="e.g. Comparing Traditional Answering Services vs In-House vs AI"
                          className="w-full px-3.5 py-2 text-sm font-bold text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DF81] bg-slate-50/50"
                        />
                      </div>

                      {/* Section Body */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Body Content (Double line break creates a new paragraph)
                        </label>
                        <textarea
                          rows={6}
                          value={sec.body}
                          onChange={(e) => handleSectionChange(idx, "body", e.target.value)}
                          placeholder="Write the in-depth technical analysis, data points, or step-by-step guidance..."
                          className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DF81] bg-slate-50/50 leading-relaxed font-sans"
                        />
                      </div>

                      {/* Callout Box Integration */}
                      <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <Layers size={13} className="text-purple-600" />
                            Callout Highlight Box
                          </label>

                          <select
                            value={sec.calloutType}
                            onChange={(e) => handleSectionChange(idx, "calloutType", e.target.value)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                          >
                            <option value="none">None (No Callout)</option>
                            <option value="tip">Pro Tip (Green)</option>
                            <option value="stat">Key Statistic (Emerald)</option>
                            <option value="warning">Industry Warning (Amber)</option>
                          </select>
                        </div>

                        {sec.calloutType !== "none" && (
                          <div className="space-y-2 pt-1">
                            <input
                              type="text"
                              value={sec.calloutTitle}
                              onChange={(e) => handleSectionChange(idx, "calloutTitle", e.target.value)}
                              placeholder="Callout Headline (e.g. Industry Benchmark)"
                              className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                            />
                            <textarea
                              rows={2}
                              value={sec.calloutText}
                              onChange={(e) => handleSectionChange(idx, "calloutText", e.target.value)}
                              placeholder="Callout body text explaining the specific metric or warning..."
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add Another Section Button */}
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 text-xs font-bold transition flex items-center justify-center gap-2 bg-white/60 hover:bg-white cursor-pointer"
                  >
                    <Plus size={16} />
                    <span>Insert New Content Section</span>
                  </button>
                </div>

                {/* Conclusion Section */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <CheckSquare size={13} className="text-emerald-500" />
                    Final Summary & Conclusion
                  </span>
                  <p className="text-xs text-slate-400">
                    Summarize key takeaways and invite reader to book a technical voice audit.
                  </p>
                  <textarea
                    rows={3}
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    placeholder="Concluding thoughts..."
                    className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DF81] bg-slate-50/60 leading-relaxed font-sans"
                  />
                </div>
              </div>
            </div>

            {/* 2. Studio Inspector Sidebar (Right Column) */}
            <aside className="w-80 lg:w-96 bg-white border-l border-slate-200 overflow-y-auto p-5 shrink-0 space-y-6">
              {/* Header / Meta Overview */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                  <Sliders size={13} />
                  Article Settings
                </h4>

                {/* Hero Feature Checkbox */}
                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#00DF81] rounded focus:ring-[#00DF81] accent-[#00DF81]"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Feature as Hero Post</span>
                    <span className="text-[10px] text-slate-500">Highlighted on top of /blog</span>
                  </div>
                </label>
              </div>

              {/* Featured Image Studio */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-purple-600" />
                  Featured Image
                </span>

                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-100 aspect-video relative group">
                  {featuredImage ? (
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).src = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No Image Set
                    </div>
                  )}

                  {uploadingImage && (
                    <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center text-white text-xs font-bold gap-2">
                      <RefreshCw size={16} className="animate-spin text-emerald-400" />
                      <span>Uploading to Supabase...</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Upload size={13} />
                    <span>Upload Image File</span>
                  </button>

                  <input
                    type="text"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="Or paste image URL..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00DF81]"
                  />
                </div>
              </div>

              {/* Taxonomy & Metadata */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Globe size={14} className="text-emerald-600" />
                  URL Slug & Category
                </span>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Slug (/blog/[slug])
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="article-url-slug"
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-500">
                      Category
                    </label>
                    {!isAddingCategoryInEditor && (
                      <button
                        type="button"
                        onClick={() => setIsAddingCategoryInEditor(true)}
                        className="text-[10px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus size={11} />
                        <span>Add Category</span>
                      </button>
                    )}
                  </div>

                  {!isAddingCategoryInEditor ? (
                    <select
                      value={category}
                      onChange={(e) => {
                        if (e.target.value === "__create_new__") {
                          setIsAddingCategoryInEditor(true);
                        } else {
                          setCategory(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white"
                    >
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__create_new__">+ Add New Category...</option>
                    </select>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
                      <label className="block text-[10px] font-bold text-purple-900">
                        New Category Name:
                      </label>
                      <input
                        type="text"
                        autoFocus
                        value={editorNewCategory}
                        onChange={(e) => setEditorNewCategory(e.target.value)}
                        placeholder="e.g. Commercial HVAC"
                        className="w-full px-2.5 py-1 text-xs rounded-lg border border-purple-300 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (editorNewCategory.trim()) {
                              handleAddCategory(editorNewCategory.trim());
                              setCategory(editorNewCategory.trim());
                              setEditorNewCategory("");
                              setIsAddingCategoryInEditor(false);
                            }
                          }
                        }}
                      />
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingCategoryInEditor(false);
                            setEditorNewCategory("");
                          }}
                          className="px-2 py-0.5 text-[10px] font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (editorNewCategory.trim()) {
                              handleAddCategory(editorNewCategory.trim());
                              setCategory(editorNewCategory.trim());
                              setEditorNewCategory("");
                              setIsAddingCategoryInEditor(false);
                            }
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-md transition cursor-pointer"
                        >
                          Add & Select
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Publish Date
                    </label>
                    <input
                      type="text"
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Author Card */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User size={14} className="text-purple-600" />
                  Author Profile
                </span>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <img
                    src={authorAvatar || DEFAULT_AUTHOR.avatar}
                    alt={authorName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{authorName}</p>
                    <p className="text-[10px] text-slate-500 truncate">{authorRole}</p>
                  </div>
                </div>
              </div>

              {/* Live Outline (Table of Contents Preview) */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-emerald-600" />
                  Live Table of Contents
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {sections.map((sec, i) => (
                    <div key={i} className="text-[11px] text-slate-600 truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span className="truncate">{sec.title || `Section ${i + 1}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTargetSlug && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Delete this Article?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove <span className="font-mono text-slate-800">/blog/{deleteTargetSlug}</span>? This will permanently delete the post from www.spykeai.com/blog.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteTargetSlug(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePost}
                disabled={deleting}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-md shadow-rose-600/30 cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CATEGORY MODAL (Dashboard) */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto border border-purple-100">
              <Plus size={24} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Add New Category</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter a category name for your blog articles and filter tabs.
              </p>
            </div>
            <form onSubmit={handleCreateCategorySubmit} className="space-y-3 pt-1">
              <input
                type="text"
                autoFocus
                required
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                placeholder="e.g. AI Customer Care, Case Studies"
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
              />
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCategoryModal(false);
                    setNewCategoryInput("");
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
