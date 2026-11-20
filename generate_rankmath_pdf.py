import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(40, 805, "SPYKE AI — RANK MATH 100/100 MASTER BLUEPRINT & SEO ARCHITECTURE")
            self.drawRightString(555, 805, "CONFIDENTIAL / INTERNAL")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(40, 798, 555, 798)
            
        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(40, 38, 555, 38)
        self.drawString(40, 26, "Spyke AI © 2026 • AI Voice & Organic Search Infrastructure")
        self.drawRightString(555, 26, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def create_rankmath_pdf(filename="Rank_Math_100_Score_Master_Guide_Spyke_AI.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    C_PRIMARY = colors.HexColor("#0B132B")       # Dark Deep Slate
    C_ACCENT = colors.HexColor("#00DF81")        # Spyke Emerald
    C_ACCENT_DARK = colors.HexColor("#059669")   # Dark Emerald
    C_TEXT = colors.HexColor("#1E293B")          # Slate 800
    C_MUTED = colors.HexColor("#64748B")         # Slate 500
    C_BG_CARD = colors.HexColor("#F8FAFC")       # Slate 50
    C_BORDER = colors.HexColor("#E2E8F0")        # Slate 200
    C_CODE_BG = colors.HexColor("#0F172A")       # Dark Code Box
    C_CODE_TEXT = colors.HexColor("#38BDF8")     # Sky Blue
    
    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=C_PRIMARY,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=C_MUTED,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=C_PRIMARY,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=C_ACCENT_DARK,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=C_TEXT,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=C_TEXT,
        leftIndent=10,
        spaceAfter=3
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=C_PRIMARY
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.5,
        textColor=C_TEXT
    )

    prompt_code_style = ParagraphStyle(
        'PromptCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=6.8,
        leading=9.5,
        textColor=colors.HexColor("#E2E8F0")
    )

    story = []

    # ------------------------------------------------------------------
    # HEADER BANNER
    # ------------------------------------------------------------------
    badge_p = Paragraph(
        "<font color='#059669'><b>EXECUTIVE TECHNICAL PLAYBOOK • RANK MATH SEO & 2026 ALGORITHMS</b></font>",
        ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=8, leading=10)
    )
    story.append(badge_p)
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("Rank Math 100/100 Scoring Algorithm, Claude Master Prompt & Modern Google Ranking Signals", title_style))
    story.append(Paragraph("An end-to-end open-source reverse-engineering of Rank Math scoring tests, exact prompt logic for AI content generation, and modern Search generative ranking factors.", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=C_ACCENT, spaceBefore=0, spaceAfter=10))

    # ------------------------------------------------------------------
    # PART 1: RANK MATH SCORING ALGORITHM BREAKDOWN
    # ------------------------------------------------------------------
    story.append(Paragraph("Part 1: Rank Math Scoring Algorithm (0–100 Exact Points)", h1_style))
    story.append(Paragraph("Rank Math computes an objective on-page quality score from <b>0 to 100</b> across 4 distinct algorithmic modules. Passing every micro-test yields the coveted 100 green score badge:", body_style))

    table_data = [
        [
            Paragraph("Category", table_header_style),
            Paragraph("Weight", table_header_style),
            Paragraph("Exact Algorithmic Tests & Verification Rules", table_header_style)
        ],
        [
            Paragraph("<b>1. Basic SEO</b>", table_cell_bold),
            Paragraph("<b>~34 pts</b>", table_cell_bold),
            Paragraph("• <b>Focus Keyword in SEO Title:</b> Must appear in the <code>&lt;title&gt;</code> tag.<br/>"
                      "• <b>Focus Keyword in Meta Description:</b> Must be present in meta tag description.<br/>"
                      "• <b>Focus Keyword in URL Slug:</b> Exact keyword in path (e.g. <code>/blog/keyword-name</code>).<br/>"
                      "• <b>Focus Keyword in first 10%:</b> Must appear within the first 80–100 words of body text.<br/>"
                      "• <b>Focus Keyword in Content:</b> Body text must contain repeated contextual occurrences.<br/>"
                      "• <b>Content Length:</b> Minimum 600 words; optimal scoring achieved at <b>1,200 to 2,500+ words</b>.", table_cell_style)
        ],
        [
            Paragraph("<b>2. Additional SEO</b>", table_cell_bold),
            Paragraph("<b>~30 pts</b>", table_cell_bold),
            Paragraph("• <b>Focus Keyword in Subheadings:</b> Must appear in at least one <code>H2</code> or <code>H3</code> tag.<br/>"
                      "• <b>Focus Keyword in Image Alt Attributes:</b> At least 1 image with keyword in <code>alt</code> tag.<br/>"
                      "• <b>Keyword Density:</b> Balanced between <b>1.0% and 1.5%</b> (avoids over-stuffing penalty).<br/>"
                      "• <b>URL Length:</b> Clean permalink strictly under 75 characters.<br/>"
                      "• <b>External Authority Links:</b> At least 1 DoFollow link to high-authority source (Wikipedia, Gartner, Statista).<br/>"
                      "• <b>Internal Backlinks:</b> Minimum 2 contextual internal links to your own domain pages.<br/>"
                      "• <b>Keyword Uniqueness:</b> Target keyword has not been used in any previously published post.", table_cell_style)
        ],
        [
            Paragraph("<b>3. Title Readability</b>", table_cell_bold),
            Paragraph("<b>~18 pts</b>", table_cell_bold),
            Paragraph("• <b>Keyword Positioning:</b> Focus keyword located near the beginning (first 3-5 words) of title.<br/>"
                      "• <b>Numeric Inclusion:</b> Title contains a number (e.g., <i>'7 Proven Ways...'</i>, <i>'2026 Guide'</i>).<br/>"
                      "• <b>Power Word Detection:</b> Contains a recognized high-CTR power word (e.g., <i>Ultimate, Proven, Essential, Breakthrough, Step-by-Step, Guaranteed</i>).<br/>"
                      "• <b>Sentiment Analysis:</b> Title evokes emotional curiosity or positive/negative sentiment.", table_cell_style)
        ],
        [
            Paragraph("<b>4. Content Readability</b>", table_cell_bold),
            Paragraph("<b>~18 pts</b>", table_cell_bold),
            Paragraph("• <b>Table of Contents (TOC):</b> Linked jump-table included directly after introduction.<br/>"
                      "• <b>Short Paragraph Structure:</b> Max 2 to 3 sentences (40–60 words) per paragraph block.<br/>"
                      "• <b>Media Asset Frequency:</b> Images, diagrams, or charts embedded every 300–400 words.<br/>"
                      "• <b>Flesch-Kincaid Readability:</b> Simple, conversational phrasing with high scannability.", table_cell_style)
        ]
    ]

    scoring_table = Table(table_data, colWidths=[90, 48, 377])
    scoring_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), C_PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, C_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, C_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(scoring_table)
    story.append(Spacer(1, 10))

    # ------------------------------------------------------------------
    # PART 2: MASTER PROMPT FOR CLAUDE
    # ------------------------------------------------------------------
    story.append(Paragraph("Part 2: Master Prompt to Copy-Paste into Claude (100/100 Generator)", h1_style))
    story.append(Paragraph("By providing this comprehensive instruction set to Claude (Sonnet 3.5 / Opus), the AI systematically formats the article to satisfy all 14 Rank Math unit tests in one execution:", body_style))

    prompt_text = (
        "You are an elite SEO strategist and Content Director specialized in generating articles that achieve a perfect 100/100 on the Rank Math SEO scoring engine and rank on Page 1 of Google.\n\n"
        "Write a complete, highly engaging blog post following these strict Rank Math 100/100 parameters:\n\n"
        "TOPIC: [Insert Topic Here, e.g., AI Voice Agents for HVAC Dispatching]\n"
        "PRIMARY FOCUS KEYWORD: [Insert Primary Keyword Here, e.g., HVAC AI Voice Agent]\n"
        "SECONDARY KEYWORDS: [Insert 2-3 Related Keywords Here, e.g., 24/7 call dispatch, automated lead booking]\n"
        "TARGET AUDIENCE: [e.g., HVAC business owners, operations managers, service contractors]\n"
        "BRAND & INTERNAL LINKS:\n"
        "- Brand Name: Spyke AI (https://spykeai.com)\n"
        "- Internal Link 1: https://spykeai.com (Anchor: AI voice agents for service businesses)\n"
        "- Internal Link 2: https://spykeai.com/contact (Anchor: book a live AI demo)\n\n"
        "STRICT RANK MATH SCORING CHECKLIST YOU MUST FULFILL:\n\n"
        "1. SEO TITLE:\n"
        "   - Must contain the PRIMARY FOCUS KEYWORD in the first 3-5 words.\n"
        "   - Must contain a NUMBER (e.g., 7, 10, 2026).\n"
        "   - Must contain at least one recognized POWER WORD (e.g., Ultimate, Proven, Essential, Breakthrough).\n"
        "   - Character count: 50–60 characters.\n\n"
        "2. META DESCRIPTION:\n"
        "   - Must include the PRIMARY FOCUS KEYWORD naturally in the first half.\n"
        "   - Must end with a clear action hook / CTA.\n"
        "   - Length: Exactly 145–155 characters.\n\n"
        "3. URL SLUG:\n"
        "   - Short, lowercase hyphenated slug containing exact PRIMARY FOCUS KEYWORD (under 60 chars).\n\n"
        "4. CONTENT STRUCTURE & LENGTH:\n"
        "   - Word count: 1,800 to 2,500 words of deeply informative, original content.\n"
        "   - First 10%: The PRIMARY FOCUS KEYWORD must appear in the very first 80 words.\n"
        "   - Headings: Use H2 and H3 tags. The PRIMARY FOCUS KEYWORD must appear in at least two H2 tags.\n"
        "   - Keyword Density: Maintain between 1.0% and 1.4% overall density.\n"
        "   - Paragraphs: Keep paragraphs strictly under 3 sentences (40-60 words). No walls of text.\n\n"
        "5. LINKS & MEDIA:\n"
        "   - Table of Contents: Include a clean HTML/Markdown Table of Contents right after the introduction.\n"
        "   - Internal Links: Include the 2 provided internal links to spykeai.com naturally in context.\n"
        "   - External Links: Include 2 high-authority citations (Gartner, Statista, HBR) with descriptive anchor text.\n"
        "   - Image Alt Placeholders: Suggest 3 image placements with exact filenames and alt tags containing keyword.\n\n"
        "6. INFORMATION GAIN & ENGAGEMENT:\n"
        "   - Include a comparison table (Markdown format).\n"
        "   - Include a bulleted 'Key Takeaways' box.\n"
        "   - Add a 4-question FAQ section at the end (Schema-friendly).\n\n"
        "OUTPUT FORMAT: Provide: 1. SEO Title  2. Meta Description  3. URL Slug  4. Primary & Secondary Keywords  5. Complete Full Article Body"
    )

    prompt_p = Paragraph(prompt_text.replace("\n", "<br/>"), prompt_code_style)
    prompt_table = Table([[prompt_p]], colWidths=[515])
    prompt_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), C_CODE_BG),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#334155")),
    ]))
    story.append(prompt_table)
    story.append(Spacer(1, 10))

    # ------------------------------------------------------------------
    # PART 3: SOURCE CODE ARCHITECTURE
    # ------------------------------------------------------------------
    story.append(PageBreak())
    story.append(Paragraph("Part 3: Rank Math Open-Source Codebase Architecture", h1_style))
    story.append(Paragraph("Rank Math is licensed under the <b>GNU General Public License (GPL v3)</b>. The scoring algorithms are client-side JavaScript regex analyzers coupled with server-side PHP schema generators:", body_style))

    source_data = [
        [Paragraph("Component", table_header_style), Paragraph("Repository File Path", table_header_style), Paragraph("Operational Functionality", table_header_style)],
        [
            Paragraph("<b>Scoring Analyzer</b>", table_cell_bold),
            Paragraph("<code>assets/admin/js/analyzer.js</code>", table_cell_style),
            Paragraph("Executes real-time RegEx evaluation for keyword presence in title, description, permalink, headings, and image alt attributes. Evaluates power words list and sentiment dictionary.", table_cell_style)
        ],
        [
            Paragraph("<b>Density Engine</b>", table_cell_bold),
            Paragraph("<code>includes/modules/analytics/class-summary.php</code><br/><code>assets/admin/js/content-ai.js</code>", table_cell_style),
            Paragraph("Computes keyword frequency formula: <code>(keyword_occurrences * word_length) / total_words</code>. Penalizes scores if density drops under 0.8% or exceeds 2.0%.", table_cell_style)
        ],
        [
            Paragraph("<b>Schema Generator</b>", table_cell_bold),
            Paragraph("<code>includes/modules/schema/</code>", table_cell_style),
            Paragraph("Builds structured JSON-LD payloads for Article, FAQPage, HowTo, Organization, and Breadcrumbs to secure rich snippet real estate on Google SERPs.", table_cell_style)
        ]
    ]

    source_table = Table(source_data, colWidths=[100, 155, 260])
    source_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), C_PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, C_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, C_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(source_table)
    
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Official Repositories:</b>", body_style))
    story.append(Paragraph("• <b>WordPress SVN Repository:</b> <code>https://plugins.svn.wordpress.org/seo-by-rank-math/trunk/</code>", bullet_style))
    story.append(Paragraph("• <b>GitHub Mirror:</b> <code>https://github.com/rankmath/seo-by-rank-math</code>", bullet_style))
    story.append(Spacer(1, 10))

    # ------------------------------------------------------------------
    # PART 4: CRITICAL 2026 GOOGLE RANKING SIGNALS (BEYOND RANK MATH)
    # ------------------------------------------------------------------
    story.append(Paragraph("Part 4: Critical 2026 Google Ranking Factors (Beyond On-Page Checklists)", h1_style))
    story.append(Paragraph("While Rank Math guarantees clean HTML syntax, Google’s modern multi-modal search algorithm ranks content based on <b>user experience, behavioral signals, and authoritative depth</b>:", body_style))

    ranking_factors = [
        ("1. Information Gain (Google Patent Compliance)", 
         "Google actively down-ranks generic AI content that merely re-synthesizes the top 10 search results. To capture top rankings, articles must provide <b>unique data, proprietary frameworks</b> (e.g. <i>'The Spyke AI 3-Tier Call Triaging Method'</i>), original workflow diagrams, and exclusive industry benchmarks."),
        
        ("2. E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)", 
         "Google prioritizes demonstrated firsthand experience. Posts must include authentic author bios with LinkedIn profiles, schema author markup, and experiential phrasing (e.g., <i>'Across our deployment of 15,000 contractor calls...'</i> rather than theoretical explanations)."),

        ("3. AI Overview / SGE (Search Generative Experience) Snippet Optimization", 
         "To get cited by Google's AI Overviews at the top of SERPs, place a <b>direct 40–55 word definitive answer block</b> immediately beneath each core H2 question. The Google AI crawler extracts these concise definitions directly into the answer box."),

        ("4. JSON-LD Schema Markup (Knowledge Graph Integration)", 
         "The frontend application (<code>spykeai.com/blog</code>) must output automated structured data in the HTML <code>&lt;head&gt;</code>: <b>BlogPosting</b>, <b>FAQPage</b> (renders collapsible question accordions in Google), and <b>Organization</b> schema."),

        ("5. Topical Authority Clusters (Hub & Spoke Architecture)", 
         "Never publish isolated posts. Google evaluates topical authority via clusters. Use a centralized <b>Pillar Page</b> (e.g. <code>/ai-voice-agents</code>) linked bidirectionally to focused <b>Spoke Articles</b> (HVAC dispatching, real estate workflows, Telnyx telephony). Interlinking passes PageRank and builds site-wide topical dominance.")
    ]

    for title, desc in ranking_factors:
        card_content = [
            Paragraph(f"<b>{title}</b>", h2_style),
            Paragraph(desc, body_style)
        ]
        card_table = Table([[card_content]], colWidths=[515])
        card_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ('LINELEFT', (0, 0), (-1, -1), 3.5, C_ACCENT),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(card_table)
        story.append(Spacer(1, 4))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[OK] Generated {filename} successfully ({os.path.getsize(filename)} bytes)")

if __name__ == "__main__":
    create_rankmath_pdf()
