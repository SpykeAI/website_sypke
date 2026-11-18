/**
 * Rank Math In-House SEO Analyzer Engine
 * Provides real-time SEO scoring (0-100), keyword density audit,
 * SERP preview metrics, and actionable content recommendations.
 */

export interface SeoCheck {
  id: string;
  category: "basic" | "additional" | "title" | "content";
  label: string;
  passed: boolean;
  scoreContribution: number;
  message: string;
  recommendation?: string;
}

export interface SeoAnalysisResult {
  score: number;
  rating: "poor" | "ok" | "good";
  wordCount: number;
  readingTimeMinutes: number;
  keywordDensity: number;
  keywordCount: number;
  headingsCount: number;
  imagesCount: number;
  internalLinksCount: number;
  externalLinksCount: number;
  checks: SeoCheck[];
  passedCount: number;
  totalChecks: number;
}

export interface SeoInputData {
  title: string;
  slug: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword: string;
  rawHtml?: string;
  sections?: {
    title: string;
    body: string | string[];
    callout?: any;
  }[];
  introduction?: string;
  conclusion?: string;
}

// Power words commonly recognized by Rank Math & SEO engines
const POWER_WORDS = [
  "best", "ultimate", "complete", "guide", "proven", "easy", "fast", "quick",
  "secret", "guaranteed", "breakdown", "review", "free", "cost", "pricing",
  "comparison", "effective", "smart", "top", "essential", "definitive",
  "exclusive", "master", "step-by-step", "simple", "expert", "revolutionary",
  "instant", "boost", "roi", "automated", "hvac", "contractor"
];

/**
 * Strips HTML tags and returns clean text
 */
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Escapes regex special characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Counts keyword occurrences in text
 */
function countKeywordOccurrences(text: string, keyword: string): number {
  if (!text || !keyword) return 0;
  const regex = new RegExp(`\\b${escapeRegExp(keyword.trim().toLowerCase())}\\b`, "gi");
  const matches = text.toLowerCase().match(regex);
  return matches ? matches.length : 0;
}

/**
 * Main Rank Math SEO Analysis Function
 */
export function analyzeSeo(input: SeoInputData): SeoAnalysisResult {
  const keyword = (input.focusKeyword || "").trim().toLowerCase();
  const effectiveTitle = (input.seoTitle || input.title || "").trim();
  const effectiveDesc = (input.seoDescription || input.excerpt || "").trim();
  const slug = (input.slug || "").trim().toLowerCase();

  // Aggregate full content text
  let fullHtml = input.rawHtml || "";
  if (!fullHtml && input.sections && input.sections.length > 0) {
    if (input.introduction) fullHtml += `<p>${input.introduction}</p>\n`;
    input.sections.forEach((s) => {
      fullHtml += `<h2>${s.title}</h2>\n`;
      const bodyStr = Array.isArray(s.body) ? s.body.join("\n") : s.body;
      fullHtml += `<p>${bodyStr}</p>\n`;
    });
    if (input.conclusion) fullHtml += `<h2>The Bottom Line</h2>\n<p>${input.conclusion}</p>\n`;
  }

  const plainText = stripHtml(fullHtml);
  const words = plainText.length > 0 ? plainText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Heading metrics
  const h2h3Matches = fullHtml.match(/<h[23][^>]*>(.*?)<\/h[23]>/gi) || [];
  const headingsCount = h2h3Matches.length;

  // Image metrics
  const imgMatches = fullHtml.match(/<img[^>]+>/gi) || [];
  const imagesCount = imgMatches.length;
  let imgAltHasKeyword = false;
  if (keyword && imagesCount > 0) {
    imgMatches.forEach((imgTag) => {
      const altMatch = imgTag.match(/alt=["'](.*?)["']/i);
      if (altMatch && altMatch[1].toLowerCase().includes(keyword)) {
        imgAltHasKeyword = true;
      }
    });
  }

  // Link metrics
  const linkMatches = fullHtml.match(/<a\s+(?:[^>]*?\s+)?href=["'](.*?)["']/gi) || [];
  let internalLinksCount = 0;
  let externalLinksCount = 0;
  linkMatches.forEach((linkTag) => {
    const hrefMatch = linkTag.match(/href=["'](.*?)["']/i);
    if (hrefMatch) {
      const href = hrefMatch[1].toLowerCase();
      if (href.startsWith("/") || href.includes("spykeai.com")) {
        internalLinksCount++;
      } else if (href.startsWith("http://") || href.startsWith("https://")) {
        externalLinksCount++;
      }
    }
  });

  // Keyword counts & density
  const keywordCount = keyword ? countKeywordOccurrences(plainText, keyword) : 0;
  const keywordDensity = wordCount > 0 && keyword ? Number(((keywordCount * keyword.split(/\s+/).length / wordCount) * 100).toFixed(2)) : 0;

  // First 10% of content check
  const first10PercentWordCount = Math.max(20, Math.floor(wordCount * 0.1));
  const first10PercentText = words.slice(0, first10PercentWordCount).join(" ").toLowerCase();
  const keywordInFirst10 = keyword ? first10PercentText.includes(keyword) : false;

  // Subheadings containing keyword
  const headingsWithKeyword = keyword
    ? h2h3Matches.filter((h) => h.toLowerCase().includes(keyword)).length
    : 0;

  // Checks array
  const checks: SeoCheck[] = [];
  let currentScore = 0;

  // ==========================================
  // 1. BASIC SEO (40 Points Max)
  // ==========================================

  // Check 1: Keyword in SEO Title (10 pts)
  const titleHasKeyword = keyword ? effectiveTitle.toLowerCase().includes(keyword) : false;
  checks.push({
    id: "basic_title_keyword",
    category: "basic",
    label: "Focus Keyword in SEO Title",
    passed: titleHasKeyword,
    scoreContribution: titleHasKeyword ? 10 : 0,
    message: titleHasKeyword
      ? `Great! Your focus keyword "${keyword}" is present in the SEO Title.`
      : `Add your focus keyword "${keyword || "..."}" into the SEO Title for maximum visibility.`,
    recommendation: "Place the exact keyword near the beginning of your title.",
  });
  if (titleHasKeyword) currentScore += 10;

  // Check 2: Keyword in Meta Description (8 pts)
  const descHasKeyword = keyword ? effectiveDesc.toLowerCase().includes(keyword) : false;
  checks.push({
    id: "basic_desc_keyword",
    category: "basic",
    label: "Focus Keyword in Meta Description",
    passed: descHasKeyword,
    scoreContribution: descHasKeyword ? 8 : 0,
    message: descHasKeyword
      ? "Awesome! The focus keyword appears in your meta description snippet."
      : "The meta description does not contain the focus keyword. Add it to improve search click-through rate.",
    recommendation: "Keep description between 130-160 characters with the keyword naturally embedded.",
  });
  if (descHasKeyword) currentScore += 8;

  // Check 3: Keyword in URL Slug (8 pts)
  const slugClean = slug.replace(/-/g, " ");
  const slugHasKeyword = keyword ? slugClean.includes(keyword) || slug.includes(keyword.replace(/\s+/g, "-")) : false;
  checks.push({
    id: "basic_url_keyword",
    category: "basic",
    label: "Focus Keyword in URL Slug",
    passed: slugHasKeyword,
    scoreContribution: slugHasKeyword ? 8 : 0,
    message: slugHasKeyword
      ? `URL slug contains the focus keyword (/blog/${slug}).`
      : `URL slug does not include the focus keyword. Include it in the permalink slug.`,
    recommendation: "Use clean hyphens (e.g., /blog/hvac-ai-receptionist-cost).",
  });
  if (slugHasKeyword) currentScore += 8;

  // Check 4: Keyword in First 10% of Content (6 pts)
  checks.push({
    id: "basic_first_10_percent",
    category: "basic",
    label: "Focus Keyword in the First 10% of Content",
    passed: keywordInFirst10,
    scoreContribution: keywordInFirst10 ? 6 : 0,
    message: keywordInFirst10
      ? "Focus keyword appears early in the introductory paragraphs."
      : "Focus keyword was not found in the first 10% of the content. Introduce the topic immediately.",
    recommendation: "Mention the core keyword in the first 1-2 opening sentences.",
  });
  if (keywordInFirst10) currentScore += 6;

  // Check 5: Content Word Count (8 pts)
  const wordCountPassed = wordCount >= 600;
  const wordCountBonus = wordCount >= 1000 ? 8 : wordCount >= 600 ? 5 : wordCount >= 300 ? 2 : 0;
  checks.push({
    id: "basic_word_count",
    category: "basic",
    label: "Content Length & In-Depth Coverage",
    passed: wordCountPassed,
    scoreContribution: wordCountBonus,
    message: wordCount >= 1000
      ? `Outstanding! Article is ${wordCount} words (1,000+ words in-depth guide).`
      : wordCount >= 600
      ? `Good length: ${wordCount} words. Consider adding 300+ words to rank even higher.`
      : `Content is only ${wordCount} words. Google prefers in-depth guides with at least 600-1,000 words.`,
    recommendation: "Comprehensive guides between 1,200 and 2,500 words rank #1 on Google.",
  });
  currentScore += wordCountBonus;

  // ==========================================
  // 2. ADDITIONAL SEO (30 Points Max)
  // ==========================================

  // Check 6: Keyword in Subheadings (7 pts)
  const headingsPassed = headingsWithKeyword > 0;
  checks.push({
    id: "add_subheadings_keyword",
    category: "additional",
    label: "Focus Keyword in Subheadings (H2, H3)",
    passed: headingsPassed,
    scoreContribution: headingsPassed ? 7 : 0,
    message: headingsPassed
      ? `Found focus keyword in ${headingsWithKeyword} subheading(s).`
      : "No subheadings (<h2> or <h3>) contain your focus keyword.",
    recommendation: "Include the focus keyword or a variation in at least one H2 heading.",
  });
  if (headingsPassed) currentScore += 7;

  // Check 7: Image Alt Tag (5 pts)
  const altPassed = imgAltHasKeyword || imagesCount > 0;
  checks.push({
    id: "add_image_alt",
    category: "additional",
    label: "Image Optimization & Alt Attributes",
    passed: altPassed,
    scoreContribution: altPassed ? 5 : 0,
    message: imgAltHasKeyword
      ? "Found focus keyword in image alt attributes."
      : imagesCount > 0
      ? `Found ${imagesCount} image(s), but none contain the focus keyword in the alt tag.`
      : "No images found in content. Visual assets improve SEO and time-on-page.",
    recommendation: "Add descriptive images with alt text containing your keyword.",
  });
  if (altPassed) currentScore += 5;

  // Check 8: Keyword Density (6 pts)
  const densityPassed = keywordDensity >= 0.8 && keywordDensity <= 3.0;
  checks.push({
    id: "add_keyword_density",
    category: "additional",
    label: "Keyword Density (Optimal: 1% – 2.5%)",
    passed: densityPassed,
    scoreContribution: densityPassed ? 6 : keywordDensity > 3.0 ? 1 : 0,
    message: densityPassed
      ? `Optimal keyword density: ${keywordDensity}% (${keywordCount} times).`
      : keywordDensity > 3.0
      ? `Keyword density is too high: ${keywordDensity}%. Reduce repetitions to prevent keyword stuffing.`
      : `Keyword density is low: ${keywordDensity}% (${keywordCount} times). Try aiming for ~1.0% to 2.0%.`,
    recommendation: "Sprinkle the keyword naturally across sections without over-repeating.",
  });
  if (densityPassed) currentScore += 6;

  // Check 9: Internal Links (6 pts)
  const internalPassed = internalLinksCount > 0;
  checks.push({
    id: "add_internal_links",
    category: "additional",
    label: "Internal Links to Spyke AI Pages",
    passed: internalPassed,
    scoreContribution: internalPassed ? 6 : 0,
    message: internalPassed
      ? `Great! Found ${internalLinksCount} internal link(s) to Spyke AI pages or demo booking.`
      : "No internal links found. Link to other relevant Spyke AI guides, service pages, or /demo.",
    recommendation: "Internal links pass link juice and keep visitors engaged.",
  });
  if (internalPassed) currentScore += 6;

  // Check 10: External Links (6 pts)
  const externalPassed = externalLinksCount > 0;
  checks.push({
    id: "add_external_links",
    category: "additional",
    label: "Outbound External References",
    passed: externalPassed,
    scoreContribution: externalPassed ? 6 : 0,
    message: externalPassed
      ? `Found ${externalLinksCount} outbound link(s) to authoritative industry sources.`
      : "Consider adding 1-2 links to trusted industry reports, statistics, or software docs.",
    recommendation: "Linking out to reputable sources signals trustworthiness to Google.",
  });
  if (externalPassed) currentScore += 6;

  // ==========================================
  // 3. TITLE & CONTENT READABILITY (30 Points Max)
  // ==========================================

  // Check 11: Keyword at Beginning of Title (6 pts)
  const titleWords = effectiveTitle.toLowerCase().split(/\s+/);
  const keywordFirstWord = keyword.split(/\s+/)[0];
  const keywordNearStart = titleWords.slice(0, 4).join(" ").includes(keywordFirstWord);
  checks.push({
    id: "read_keyword_near_start",
    category: "title",
    label: "Keyword Near Beginning of Title",
    passed: keywordNearStart,
    scoreContribution: keywordNearStart ? 6 : 0,
    message: keywordNearStart
      ? "Focus keyword is prominently placed near the start of the title."
      : "Move the focus keyword closer to the front of your headline.",
    recommendation: "Front-loading the keyword improves click-through rates.",
  });
  if (keywordNearStart) currentScore += 6;

  // Check 12: Title Contains a Number (6 pts)
  const titleHasNumber = /\d+/.test(effectiveTitle);
  checks.push({
    id: "read_title_has_number",
    category: "title",
    label: "Title Contains a Number (e.g. 2026, Top 5)",
    passed: titleHasNumber,
    scoreContribution: titleHasNumber ? 6 : 0,
    message: titleHasNumber
      ? "Headline contains numbers/year, which boosts CTR by up to 36%."
      : "Add a year (e.g., 2026) or a list number (e.g., '7 Steps') to boost CTR.",
    recommendation: "Example: '...for HVAC Contractors in 2026' or '5 Ways to...'",
  });
  if (titleHasNumber) currentScore += 6;

  // Check 13: Power / Emotion Word in Title (6 pts)
  const titleHasPowerWord = POWER_WORDS.some((pw) =>
    new RegExp(`\\b${pw}\\b`, "i").test(effectiveTitle)
  );
  checks.push({
    id: "read_title_power_word",
    category: "title",
    label: "Title Contains a Power / Sentiment Word",
    passed: titleHasPowerWord,
    scoreContribution: titleHasPowerWord ? 6 : 0,
    message: titleHasPowerWord
      ? "Title uses compelling power words (e.g., Guide, Cost, Proven, Breakdown)."
      : "Add a compelling power word to trigger curiosity and search clicks.",
    recommendation: "Power words: Ultimate, Complete, Cost Breakdown, Proven, Smart.",
  });
  if (titleHasPowerWord) currentScore += 6;

  // Check 14: Table of Contents & Structure (6 pts)
  const hasTocOrHeadings = headingsCount >= 3;
  checks.push({
    id: "read_toc_and_structure",
    category: "content",
    label: "Structured Headings & Scannability",
    passed: hasTocOrHeadings,
    scoreContribution: hasTocOrHeadings ? 6 : 0,
    message: hasTocOrHeadings
      ? `Well-structured with ${headingsCount} distinct headings for easy reading.`
      : `Content has only ${headingsCount} headings. Break text into logical sections with <h2> tags.`,
    recommendation: "Organize content with at least 3-5 subheadings.",
  });
  if (hasTocOrHeadings) currentScore += 6;

  // Check 15: Short, Digestible Paragraphs (6 pts)
  const paragraphs = plainText.split(/\n+/).filter(Boolean);
  const avgParagraphWords = paragraphs.length > 0 ? wordCount / paragraphs.length : 0;
  const paragraphLengthPassed = avgParagraphWords <= 90;
  checks.push({
    id: "read_paragraph_length",
    category: "content",
    label: "Short, Mobile-Friendly Paragraphs",
    passed: paragraphLengthPassed,
    scoreContribution: paragraphLengthPassed ? 6 : 0,
    message: paragraphLengthPassed
      ? `Paragraphs are bite-sized (avg ${Math.round(avgParagraphWords)} words) and easy to read on mobile.`
      : `Some paragraphs are too long (avg ${Math.round(avgParagraphWords)} words). Break them up into 2-3 sentences.`,
    recommendation: "Keep paragraphs under 80 words for superior mobile engagement.",
  });
  if (paragraphLengthPassed) currentScore += 6;

  // Bound total score between 0 and 100
  const finalScore = Math.min(100, Math.max(0, currentScore));
  const rating: "poor" | "ok" | "good" =
    finalScore >= 80 ? "good" : finalScore >= 50 ? "ok" : "poor";

  const passedCount = checks.filter((c) => c.passed).length;

  return {
    score: finalScore,
    rating,
    wordCount,
    readingTimeMinutes,
    keywordDensity,
    keywordCount,
    headingsCount,
    imagesCount,
    internalLinksCount,
    externalLinksCount,
    checks,
    passedCount,
    totalChecks: checks.length,
  };
}
