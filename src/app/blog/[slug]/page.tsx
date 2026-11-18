import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BLOG_POSTS, getBlogPost } from "@/data/blogPosts";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/blogStorage";

export const dynamic = "force-dynamic";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Sparkles, 
  PhoneCall, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight,
  BookOpen
} from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getBlogPostBySlug(slug)) || getBlogPost(slug);

  if (!post) {
    return {
      title: "Article Not Found | Spyke AI",
      description: "The requested HVAC AI article does not exist.",
    };
  }

  return {
    title: `${post.title} | Spyke AI Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://spykeai.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://spykeai.com/blog/${post.slug}`,
      siteName: "Spyke AI Technologies",
      type: "article",
      publishedTime: post.publishDate,
      authors: [post.author.name],
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = (await getBlogPostBySlug(slug)) || getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getBlogPosts();
  const relatedPosts = (allPosts.length > 0 ? allPosts : BLOG_POSTS).filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-28 md:pb-20">
      {/* 1. Breadcrumbs & Top Header */}
      <section className="bg-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Bar */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 flex-wrap">
            <Link href="/" className="hover:text-emerald-400 transition">
              Home
            </Link>
            <ChevronRight size={12} className="text-slate-600" />
            <Link href="/blog" className="hover:text-emerald-400 transition">
              Blog
            </Link>
            <ChevronRight size={12} className="text-slate-600" />
            <span className="text-slate-300 truncate max-w-[200px] sm:max-w-xs">{post.category}</span>
          </nav>

          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider mb-4">
            {post.category}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-normal">
            {post.excerpt}
          </p>

          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-11 h-11 rounded-full object-cover border border-emerald-500/30"
              />
              <div>
                <div className="text-sm font-bold text-white">{post.author.name}</div>
                <div className="text-xs text-slate-400">{post.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-500" />
                {post.publishDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-500" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Article Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Body Column */}
          <article className="lg:col-span-8">
            {/* Featured Image */}
            <div className="rounded-3xl overflow-hidden border border-slate-200/90 shadow-md mb-10 bg-slate-900">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-64 sm:h-96 object-cover"
              />
            </div>

            {/* Mobile Table of Contents */}
            <div className="lg:hidden mb-10 bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800 mb-3">
                <BookOpen size={14} className="text-emerald-600" />
                <span>On This Page</span>
              </div>
              <ul className="space-y-2 text-xs font-medium">
                {post.content.tableOfContents.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-slate-600 hover:text-emerald-700 transition flex items-center gap-1.5"
                    >
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{item.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Content Body: HTML CMS or Structured Sections */}
            {post.content.rawHtml && post.content.rawHtml.trim() ? (
              <div
                className="prose prose-slate max-w-none text-base sm:text-lg leading-relaxed text-slate-800 font-normal
                  prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
                  prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:mb-5 prose-p:leading-relaxed text-slate-700
                  prose-a:text-emerald-600 prose-a:underline hover:prose-a:text-emerald-700 font-medium
                  prose-strong:text-slate-900 prose-strong:font-bold
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-5
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-5
                  prose-li:mb-2
                  prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-slate-800
                  prose-img:rounded-2xl prose-img:border prose-img:border-slate-200 prose-img:shadow-sm prose-img:my-6
                  prose-table:w-full prose-table:border-collapse prose-table:my-6
                  prose-th:bg-slate-900 prose-th:text-white prose-th:p-3 prose-th:text-left
                  prose-td:p-3 prose-td:border-b prose-td:border-slate-200"
                dangerouslySetInnerHTML={{ __html: post.content.rawHtml }}
              />
            ) : (
              <>
                {/* Article Intro */}
                {post.content.introduction && (
                  <div className="prose prose-slate max-w-none text-base sm:text-lg leading-relaxed text-slate-700 font-normal mb-8 whitespace-pre-line">
                    {post.content.introduction}
                  </div>
                )}

                {/* Subsections */}
                <div className="space-y-12">
                  {post.content.sections?.map((section) => (
                    <section key={section.id} id={section.id} className="scroll-mt-28">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-4">
                        {section.title}
                      </h2>

                      <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                        {section.body.map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}
                      </div>

                      {/* Callout Box */}
                      {section.callout && (
                        <div
                          className={`my-6 rounded-2xl p-4 sm:p-5 border flex items-start gap-3.5 ${
                            section.callout.type === "stat"
                              ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                              : section.callout.type === "warning"
                              ? "bg-amber-50/80 border-amber-200 text-amber-950"
                              : "bg-blue-50/70 border-blue-200 text-blue-950"
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {section.callout.type === "stat" && <TrendingUp size={20} className="text-emerald-600" />}
                            {section.callout.type === "warning" && <AlertTriangle size={20} className="text-amber-600" />}
                            {section.callout.type === "tip" && <Sparkles size={20} className="text-blue-600" />}
                          </div>
                          <div>
                            <div className="text-xs font-black uppercase tracking-wider mb-1">
                              {section.callout.title}
                            </div>
                            <div className="text-xs sm:text-sm font-medium leading-relaxed">
                              {section.callout.text}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Comparison Table */}
                      {section.table && (
                        <div className="my-6 overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                          <table className="w-full text-left text-xs sm:text-sm border-collapse">
                            <thead>
                              <tr className="bg-slate-900 text-white">
                                {section.table.headers.map((h, i) => (
                                  <th key={i} className="p-3 sm:p-3.5 font-bold whitespace-nowrap">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                              {section.table.rows.map((row, rIdx) => (
                                <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                                  {row.map((cell, cIdx) => (
                                    <td
                                      key={cIdx}
                                      className={`p-3 sm:p-3.5 text-slate-700 ${
                                        cIdx === 0
                                          ? "font-bold text-slate-900"
                                          : cIdx === 3
                                          ? "font-semibold text-emerald-700 bg-emerald-50/40"
                                          : ""
                                      }`}
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </section>
                  ))}
                </div>

                {/* Conclusion */}
                {post.content.conclusion && (
                  <div className="mt-12 pt-8 border-t border-slate-200">
                    <h3 className="text-xl font-black text-slate-900 mb-3">The Bottom Line</h3>
                    <p className="text-base text-slate-700 leading-relaxed font-normal">
                      {post.content.conclusion}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* In-Article CTA Banner */}
            <div className="mt-12 bg-gradient-to-br from-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                <Sparkles size={14} />
                <span>Next Steps for HVAC Operators</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white">
                Want to test how an AI Voice Agent handles your HVAC emergency dispatch?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Schedule a 15-minute technical audit. We test your current phone tree, simulate a live emergency call, and demonstrate two-way ServiceTitan/GHL integration.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact#lead-form"
                  className="bg-gradient-to-r from-emerald-500 to-[#00DF81] text-slate-950 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition hover:brightness-105 inline-flex items-center gap-1.5"
                >
                  <span>Book Technical Audit</span>
                  <ArrowRight size={14} />
                </Link>
                <a
                  href="tel:+13464770028"
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl transition inline-flex items-center gap-1.5"
                >
                  <PhoneCall size={14} className="text-emerald-400" />
                  <span>Call +1 (346) 477-0028</span>
                </a>
              </div>
            </div>

            {/* Author Bio Card */}
            <div className="mt-12 p-6 rounded-3xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-14 h-14 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div>
                <h5 className="text-sm font-bold text-slate-900">{post.author.name}</h5>
                <p className="text-xs text-emerald-700 font-semibold mb-1.5">{post.author.role}</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Product management veteran (ex-Paytm, Ola, OYO) building ultra-low-latency voice agents and AI dispatch systems for trades businesses across North America.
                </p>
              </div>
            </div>
          </article>

          {/* Sidebar Column (Desktop Table of Contents + Sticky Audit Widget) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Table of Contents */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
                  <BookOpen size={14} className="text-emerald-600" />
                  <span>On This Page</span>
                </h4>
                <nav className="space-y-2.5">
                  {post.content.tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-xs font-medium text-slate-600 hover:text-emerald-700 transition leading-snug"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Sidebar CTA Box */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-3 border border-emerald-500/30">
                  <Sparkles size={11} />
                  <span>HVAC Architecture Audit</span>
                </div>
                <h5 className="text-lg font-black text-white leading-snug">
                  Stop missing high-ticket AC repair calls
                </h5>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Talk directly with our engineering team to calculate your missed call ROI.
                </p>
                <Link
                  href="/contact#lead-form"
                  className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-[#00DF81] text-slate-950 font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition hover:brightness-105 shadow-md"
                >
                  <span>Book Technical Audit</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* 3. Related Articles Grid */}
        <section className="mt-20 pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              More Operational Guides
            </h3>
            <Link
              href="/blog"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              <span>View All Articles</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-lg transition-all"
              >
                <div className="sm:w-36 h-32 rounded-2xl overflow-hidden shrink-0 bg-slate-900">
                  <img
                    src={related.featuredImage}
                    alt={related.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-1">
                      {related.category}
                    </div>
                    <h5 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {related.title}
                    </h5>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium mt-2 flex items-center gap-2">
                    <span>{related.publishDate}</span>
                    <span>•</span>
                    <span>{related.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* 4. Mobile Sticky Action Bar */}
      <MobileStickyCTA customAuditLink="/contact#lead-form" />
    </div>
  );
}
