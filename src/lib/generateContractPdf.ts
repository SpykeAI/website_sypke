import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from "pdf-lib";

export interface ContractPdfParams {
  agreementId: string;
  formattedDate: string;
  companyName: string;
  website?: string;
  fullName: string;
  businessAddress: string;
  email: string;
  phone: string;
  signature: string;
}

export function cleanPdfText(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/[✓✔]/g, "[VERIFIED]")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2026]/g, "...")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateContractPdf(rawParams: ContractPdfParams): Promise<Buffer> {
  const params: ContractPdfParams = {
    agreementId: cleanPdfText(rawParams.agreementId),
    formattedDate: cleanPdfText(rawParams.formattedDate),
    companyName: cleanPdfText(rawParams.companyName),
    website: cleanPdfText(rawParams.website || "N/A"),
    fullName: cleanPdfText(rawParams.fullName),
    businessAddress: cleanPdfText(rawParams.businessAddress),
    email: cleanPdfText(rawParams.email),
    phone: cleanPdfText(rawParams.phone),
    signature: cleanPdfText(rawParams.signature),
  };

  const pdfDoc = await PDFDocument.create();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontSignature = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;

  let currentPage!: PDFPage;
  let y = pageHeight - margin;
  let pageNumber = 0;
  const pages: PDFPage[] = [];

  const addNewPage = (): PDFPage => {
    pageNumber++;
    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    pages.push(currentPage);
    y = pageHeight - margin;

    // Header line on subsequent pages
    if (pageNumber > 1) {
      currentPage.drawText("SPYKE AI TECHNOLOGIES · HVAC BOOKING ENGINE AGREEMENT", {
        x: margin,
        y: pageHeight - 30,
        size: 8,
        font: fontBold,
        color: rgb(100 / 255, 116 / 255, 139 / 255),
      });

      currentPage.drawText(`REF: ${params.agreementId}`, {
        x: pageWidth - margin - 120,
        y: pageHeight - 30,
        size: 8,
        font: fontRegular,
        color: rgb(100 / 255, 116 / 255, 139 / 255),
      });

      currentPage.drawLine({
        start: { x: margin, y: pageHeight - 36 },
        end: { x: pageWidth - margin, y: pageHeight - 36 },
        thickness: 0.5,
        color: rgb(226 / 255, 232 / 255, 240 / 255),
      });

      y = pageHeight - 55;
    }

    return currentPage;
  };

  const ensureSpace = (neededHeight: number) => {
    if (y - neededHeight < margin + 30) {
      addNewPage();
    }
  };

  const wrapText = (text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] => {
    const clean = cleanPdfText(text);
    const words = clean.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // Start with First Page
  addNewPage();

  // ==========================================
  // PAGE 1 HEADER / BRANDING
  // ==========================================
  // Top Banner / Badge
  currentPage.drawRectangle({
    x: margin,
    y: y - 22,
    width: 200,
    height: 18,
    color: rgb(254 / 255, 242 / 255, 242 / 255),
    borderColor: rgb(252 / 255, 165 / 255, 165 / 255),
    borderWidth: 0.8,
  });

  currentPage.drawText("OFFICIAL LEGAL CONTRACT RECORD", {
    x: margin + 8,
    y: y - 16,
    size: 7.5,
    font: fontBold,
    color: rgb(220 / 255, 38 / 255, 38 / 255),
  });

  // Reference & Date on top right
  currentPage.drawText(`Agreement ID: ${params.agreementId}`, {
    x: pageWidth - margin - 150,
    y: y - 10,
    size: 8.5,
    font: fontBold,
    color: rgb(30 / 255, 41 / 255, 59 / 255),
  });

  currentPage.drawText(`Executed: ${params.formattedDate}`, {
    x: pageWidth - margin - 150,
    y: y - 22,
    size: 7.5,
    font: fontRegular,
    color: rgb(100 / 255, 116 / 255, 139 / 255),
  });

  y -= 38;

  // Title
  currentPage.drawText("HVAC Booking Engine: Client Agreement", {
    x: margin,
    y: y - 18,
    size: 20,
    font: fontBold,
    color: rgb(15 / 255, 23 / 255, 42 / 255),
  });
  y -= 26;

  currentPage.drawText("The HVAC Booking Engine: Final Offer, Commercial Terms & Master Service Agreement", {
    x: margin,
    y: y - 10,
    size: 9.5,
    font: fontRegular,
    color: rgb(71 / 255, 85 / 255, 105 / 255),
  });
  y -= 22;

  // Header separator
  currentPage.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 1.5,
    color: rgb(220 / 255, 38 / 255, 38 / 255),
  });
  y -= 18;

  // ==========================================
  // SECTION 1: THE PARTIES
  // ==========================================
  ensureSpace(140);
  currentPage.drawText("THE PARTIES", {
    x: margin,
    y: y - 4,
    size: 9,
    font: fontBold,
    color: rgb(220 / 255, 38 / 255, 38 / 255),
  });
  y -= 14;

  const boxWidth = (contentWidth - 14) / 2;
  const boxHeight = 115;
  const boxTop = y;

  // Provider Box (Left)
  currentPage.drawRectangle({
    x: margin,
    y: boxTop - boxHeight,
    width: boxWidth,
    height: boxHeight,
    color: rgb(248 / 255, 250 / 255, 252 / 255),
    borderColor: rgb(203 / 255, 213 / 255, 225 / 255),
    borderWidth: 0.8,
  });

  currentPage.drawText('THE PROVIDER ("SPYKE AI", "WE")', {
    x: margin + 10,
    y: boxTop - 16,
    size: 7.5,
    font: fontBold,
    color: rgb(100 / 255, 116 / 255, 139 / 255),
  });
  currentPage.drawText("Spyke AI Technologies", {
    x: margin + 10,
    y: boxTop - 30,
    size: 11,
    font: fontBold,
    color: rgb(15 / 255, 23 / 255, 42 / 255),
  });

  const providerDesc = "Contracting entity under this Agreement, responsible for delivering services and honoring the guarantee. Global Operations: Dallas, TX 75208, USA & Hyderabad, Telangana, India.";
  const pLines = wrapText(providerDesc, fontRegular, 7.5, boxWidth - 20);
  let pY = boxTop - 44;
  for (const line of pLines) {
    currentPage.drawText(line, { x: margin + 10, y: pY, size: 7.5, font: fontRegular, color: rgb(71 / 255, 85 / 255, 105 / 255) });
    pY -= 10;
  }
  currentPage.drawText("Email: contact@spykeai.com   |   Web: spykeai.com", {
    x: margin + 10,
    y: boxTop - boxHeight + 10,
    size: 7,
    font: fontBold,
    color: rgb(30 / 255, 41 / 255, 59 / 255),
  });

  // Client Box (Right)
  const clientX = margin + boxWidth + 14;
  currentPage.drawRectangle({
    x: clientX,
    y: boxTop - boxHeight,
    width: boxWidth,
    height: boxHeight,
    color: rgb(248 / 255, 250 / 255, 252 / 255),
    borderColor: rgb(203 / 255, 213 / 255, 225 / 255),
    borderWidth: 0.8,
  });

  currentPage.drawText('THE CLIENT ("YOU")', {
    x: clientX + 10,
    y: boxTop - 16,
    size: 7.5,
    font: fontBold,
    color: rgb(100 / 255, 116 / 255, 139 / 255),
  });
  currentPage.drawText(params.companyName || "Client Entity", {
    x: clientX + 10,
    y: boxTop - 30,
    size: 11,
    font: fontBold,
    color: rgb(15 / 255, 23 / 255, 42 / 255),
  });

  const clientInfo = [
    `Authorized Signatory: ${params.fullName}`,
    `Address: ${params.businessAddress}`,
    `Email: ${params.email}`,
    `Phone: ${params.phone}`,
    params.website ? `Website: ${params.website}` : "",
  ].filter(Boolean);

  let cY = boxTop - 44;
  for (const info of clientInfo) {
    const wrapped = wrapText(info, fontRegular, 7.5, boxWidth - 20);
    for (const line of wrapped) {
      currentPage.drawText(line, { x: clientX + 10, y: cY, size: 7.5, font: fontRegular, color: rgb(71 / 255, 85 / 255, 105 / 255) });
      cY -= 10;
    }
  }

  y = boxTop - boxHeight - 20;

  // ==========================================
  // SECTION 2: THE AGREEMENT CLAUSES
  // ==========================================
  ensureSpace(30);
  currentPage.drawText("THE AGREEMENT", {
    x: margin,
    y: y - 4,
    size: 9,
    font: fontBold,
    color: rgb(220 / 255, 38 / 255, 38 / 255),
  });
  y -= 16;

  const clauses = [
    {
      num: "1",
      title: "Parties, Scope & Definitions",
      text: "This agreement is between Spyke AI Technologies (Spyke) and the Client, an HVAC business. Scope: Spyke operates the HVAC Booking Engine: it answers inbound calls, calls back missed calls, website forms and ad leads, books jobs into the calendar, follows up open estimates, and sends confirmations. Definitions: Booking Line: dedicated local number provided by Spyke, plus Client forwarded numbers. Go-Live Day: day the Booking Line answers with AI and existing numbers are forwarded, confirmed by email. Booked Job: a homeowner in agreed service area with a real HVAC need placed on the calendar, whose first contact came through the Booking Line or Spyke outbound call within 30 days. Repair Job: Booked Job for repair, service, diagnosis or maintenance. Replacement Estimate: Booked Job for in-home estimate on a new or replacement heating/cooling system. AI Minutes: minutes of calls handled by AI, rounded up to nearest minute. Spam: robocalls, wrong numbers, and calls under 15 seconds. Statement: weekly itemized email showing each Booked Job with recording link and amount due.",
    },
    {
      num: "2",
      title: "What the Client Provides",
      text: "Go-Live and the 30-day guarantee period depend on the Client providing: business details (legal name, EIN, address, service ZIPs) at signing for carrier 10DLC registration; services offered, exclusions, and pricing rules (diagnostic fee) at signing; calendar or FSM access (ServiceTitan, Jobber, Housecall Pro, or Google Calendar) before Go-Live; call forwarding from existing business number before Go-Live; on-call technician mobile number and emergency escalation rules before Go-Live; listings manager access in Week 1; card or US bank account on file with payment authorization at signing; and a named contact who replies within 1 business day.",
    },
    {
      num: "3",
      title: "Setup, Go-Live & Rollout",
      text: "Voice goes live within 5 to 7 days after signing. Day 0 (Signing): setup fee paid, payment authorization signed, details received, 10DLC carrier texting registration submitted. Days 1 to 7 (Voice Build): Spyke provisions the dedicated Booking Line, trains the AI on Client services, connects calendar, and executes test calls. Go-Live Day: the Booking Line answers with AI, existing number is forwarded, confirmation emailed, and the 30-day guarantee starts. Weeks 1 to 2: Booking Line added to Google Business Profile, website, and local directories. Carrier approval: missed-call text-back, booking confirmations, reminders, and review requests activate.",
    },
    {
      num: "4",
      title: "Fees & Payment Schedule",
      text: "Setup fee: $2,000 one-time at signing. Per Booked Repair Job: $100. Per Booked Replacement Estimate: $200. Monthly retainer: $0. Software, calls, texts, and carrier fees: $0, Spyke pays. AI minutes beyond fair-use allowance: $0.15 per minute. All amounts are in USD and charged weekly after a 48-hour review window.",
    },
    {
      num: "5",
      title: "Fair Use: 60 AI Minutes per Booked Job",
      text: "Each Booked Job includes 60 AI Minutes, pooled across the calendar month. Allowance = Booked Jobs in month x 60 minutes. Overage = [AI Minutes used - Allowance (if positive)] x $0.15. Time after a call is transferred to the Client staff does not count toward AI Minutes. Fair use protects against heavy call volume with minimal bookings without charging a monthly retainer.",
    },
    {
      num: "6",
      title: "What Is Billable: The 30-Day First-Contact Test",
      text: "One objective test decides every case: did this customer first contact come through the Booking Line, or a Spyke outbound call, in the 30 days before the job was booked? If yes, it is billable. Includes: inbound AI booked, forwarded calls, AI qualified transferred to staff who books, web forms and ad leads called by Spyke and booked within 30 days, missed-call callbacks, and old estimate reactivations. Customer cancellations at any time are charged a flat $10 fee. No-shows are billable. Walk-ins, direct calls to technician personal phones, out-of-area calls, and spam are not billable ($0).",
    },
    {
      num: "7",
      title: "The Guarantee (10 Booked Jobs in 30 Days)",
      isGuarantee: true,
      text: "10 Booked Jobs in the first 30 days after Go-Live, or booking fees for that period are free ($0). The setup fee is not part of the guarantee.\nExample: Spyke books 7 jobs in the first 30 days. The Client would have owed $700. The Client pays $0 for those bookings and keeps the jobs.\nPeriod: The 30 days starting on Go-Live Day, as confirmed by email. Applies once, to the first 30 days only. Standard per-booking fees resume on day 31.\nConditions: Business receives at least 150 inbound calls and form leads during the 30 days; call forwarding stays active; calendar access remains connected with open slots; client attends booked appointments; and service area matches signing details.",
    },
    {
      num: "8",
      title: "Refunds and Credits",
      text: "The setup fee is not refundable as it covers build work and carrier registration. Billing mistakes and valid disputes are resolved as statement credits on the next weekly cycle, not cash refunds. Unused credits upon account termination are refunded via cash within 14 days.",
    },
    {
      num: "9",
      title: "How the Client Is Charged",
      text: "Client card or US bank account is charged automatically every week. Every Monday, Spyke emails the Statement for the prior Monday-Sunday cycle with links to each call recording. A 48-hour review window applies until Wednesday. On Wednesday, the total minus any lines under active dispute is charged automatically. If payment fails, Spyke retries over 3 days; after 3 days, AI pauses and calls forward directly to Client phone.",
    },
    {
      num: "10",
      title: "Disputes",
      text: "Disputes must be raised by replying to the Statement email within 48 hours, stating the line and valid reason (spam, out-of-area, duplicate, customer cancelled). Disputed lines are held from billing while Spyke reviews call recordings and issues a determination within 2 business days.",
    },
    {
      num: "11",
      title: "Phone Numbers, Forwarding & Listings",
      text: "Spyke provisions a dedicated local Booking Line with Client caller ID. The Client existing number always remains Client property and is forwarded to Spyke. Emergency calls (gas odor, no heat in freezing temperatures) route immediately to the on-call technician.",
    },
    {
      num: "12",
      title: "Term, Cancellation and Exit",
      text: "Minimum initial term of 6 months from Go-Live Day, continuing month-to-month thereafter with 30 days written notice. After 6 months, the Booking Line transfers to the Client for free ($1,000 transfer fee if terminated prior). Customer data and recordings are exported within 7 days. AI agents, workflows, and prompts remain Spyke intellectual property.",
    },
    {
      num: "13",
      title: "Compliance",
      text: "Calls are announced as recorded at the start of every call. The AI discloses its automated nature when asked. Spyke only contacts individuals who called, submitted forms, or requested quotes; no cold calling is performed. Carrier 10DLC registration is maintained.",
    },
    {
      num: "14",
      title: "Data and Ownership",
      text: "The Client owns all customer data, names, phone numbers, job addresses, and call recordings. Spyke owns the AI voice agent technology, software, and workflows. Recordings are retained for 12 months.",
    },
    {
      num: "15",
      title: "Service Levels, Liability & General Terms",
      text: "The Booking Line operates 24/7 with automated human fallback. Support replies within 48 hours. Total aggregate liability is capped at the setup fee paid ($2,000). Governed by Texas law (Dallas County venue). Electronic signatures are valid under the U.S. E-SIGN Act and UETA.",
    },
  ];

  for (const clause of clauses) {
    if (clause.isGuarantee) {
      // Draw highlighted Guarantee card
      ensureSpace(120);
      const gBoxTop = y;
      const gTextLines = clause.text.split("\n").flatMap((p) => wrapText(p, fontRegular, 8, contentWidth - 24));
      const gBoxHeight = 36 + gTextLines.length * 11;

      currentPage.drawRectangle({
        x: margin,
        y: gBoxTop - gBoxHeight,
        width: contentWidth,
        height: gBoxHeight,
        color: rgb(240 / 255, 253 / 255, 244 / 255),
        borderColor: rgb(16 / 255, 185 / 255, 129 / 255),
        borderWidth: 1.2,
      });

      currentPage.drawText("5. The Refund Guarantee", {
        x: margin + 12,
        y: gBoxTop - 16,
        size: 9.5,
        font: fontBold,
        color: rgb(16 / 255, 185 / 255, 129 / 255),
      });

      currentPage.drawText("[100% MONEY-BACK GUARANTEE, REFUNDED WITHIN 24 HOURS", {
        x: margin + 12,
        y: gBoxTop - 30,
        size: 9,
        font: fontBold,
        color: rgb(6 / 255, 95 / 255, 70 / 255),
      });

      let gY = gBoxTop - 44;
      for (const line of gTextLines) {
        currentPage.drawText(line, {
          x: margin + 12,
          y: gY,
          size: 8,
          font: fontRegular,
          color: rgb(21 / 255, 128 / 255, 61 / 255),
        });
        gY -= 11;
      }
      y = gBoxTop - gBoxHeight - 16;
    } else {
      // Normal Clause
      ensureSpace(45);
      currentPage.drawText(`${clause.num}. ${clause.title}`, {
        x: margin,
        y: y - 10,
        size: 9.5,
        font: fontBold,
        color: rgb(15 / 255, 23 / 255, 42 / 255),
      });
      y -= 18;

      const lines = wrapText(clause.text, fontRegular, 8, contentWidth);
      for (const line of lines) {
        ensureSpace(12);
        currentPage.drawText(line, {
          x: margin,
          y: y - 8,
          size: 8,
          font: fontRegular,
          color: rgb(51 / 255, 65 / 255, 85 / 255),
        });
        y -= 11;
      }
      y -= 8;
    }
  }

  // ==========================================
  // SECTION 3: EXECUTION & SIGNATURES
  // ==========================================
  ensureSpace(160);
  currentPage.drawText("EXECUTION & ELECTRONIC SIGNATURES", {
    x: margin,
    y: y - 4,
    size: 9,
    font: fontBold,
    color: rgb(220 / 255, 38 / 255, 38 / 255),
  });
  y -= 16;

  const sigBoxHeight = 110;
  const sigBoxTop = y;

  // Provider Signature Box (Left)
  currentPage.drawRectangle({
    x: margin,
    y: sigBoxTop - sigBoxHeight,
    width: boxWidth,
    height: sigBoxHeight,
    color: rgb(248 / 255, 250 / 255, 252 / 255),
    borderColor: rgb(16 / 255, 185 / 255, 129 / 255),
    borderWidth: 1,
  });

  currentPage.drawText("THE PROVIDER, PRE-EXECUTED", {
    x: margin + 10,
    y: sigBoxTop - 15,
    size: 7.5,
    font: fontBold,
    color: rgb(100 / 255, 116 / 255, 139 / 255),
  });

  currentPage.drawRectangle({
    x: margin + boxWidth - 55,
    y: sigBoxTop - 18,
    width: 45,
    height: 12,
    color: rgb(220 / 255, 252 / 255, 231 / 255),
    borderColor: rgb(134 / 255, 239 / 255, 172 / 255),
    borderWidth: 0.5,
  });
  currentPage.drawText("SIGNED", {
    x: margin + boxWidth - 46,
    y: sigBoxTop - 15,
    size: 6.5,
    font: fontBold,
    color: rgb(22 / 255, 101 / 255, 52 / 255),
  });

  // Provider Digital Seal Signature
  currentPage.drawText("Spyke AI Technologies", {
    x: margin + 10,
    y: sigBoxTop - 42,
    size: 15,
    font: fontBold,
    color: rgb(16 / 255, 185 / 255, 129 / 255),
  });
  currentPage.drawText("Verified Digital Corporate Seal", {
    x: margin + 10,
    y: sigBoxTop - 54,
    size: 7.5,
    font: fontItalic,
    color: rgb(22 / 255, 101 / 255, 52 / 255),
  });

  currentPage.drawText("Authorized Corporate Signatory", {
    x: margin + 10,
    y: sigBoxTop - 74,
    size: 8,
    font: fontBold,
    color: rgb(30 / 255, 41 / 255, 59 / 255),
  });
  currentPage.drawText("for Spyke AI Technologies (Operations & Legal)", {
    x: margin + 10,
    y: sigBoxTop - 85,
    size: 7.5,
    font: fontRegular,
    color: rgb(100 / 255, 116 / 255, 139 / 255),
  });
  currentPage.drawText("Signed in advance · effective on date of signature", {
    x: margin + 10,
    y: sigBoxTop - 98,
    size: 6.5,
    font: fontRegular,
    color: rgb(148 / 255, 163 / 255, 184 / 255),
  });

  // Client Signature Box (Right)
  currentPage.drawRectangle({
    x: clientX,
    y: sigBoxTop - sigBoxHeight,
    width: boxWidth,
    height: sigBoxHeight,
    color: rgb(248 / 255, 250 / 255, 252 / 255),
    borderColor: rgb(16 / 255, 185 / 255, 129 / 255),
    borderWidth: 1,
  });

  currentPage.drawText("THE CLIENT, EXECUTED", {
    x: clientX + 10,
    y: sigBoxTop - 15,
    size: 7.5,
    font: fontBold,
    color: rgb(100 / 255, 116 / 255, 139 / 255),
  });

  currentPage.drawRectangle({
    x: clientX + boxWidth - 55,
    y: sigBoxTop - 18,
    width: 45,
    height: 12,
    color: rgb(220 / 255, 252 / 255, 231 / 255),
    borderColor: rgb(134 / 255, 239 / 255, 172 / 255),
    borderWidth: 0.5,
  });
  currentPage.drawText("SIGNED", {
    x: clientX + boxWidth - 46,
    y: sigBoxTop - 15,
    size: 6.5,
    font: fontBold,
    color: rgb(22 / 255, 101 / 255, 52 / 255),
  });

  // Client Cursive Signature Text
  currentPage.drawText(params.signature, {
    x: clientX + 10,
    y: sigBoxTop - 44,
    size: 16,
    font: fontSignature,
    color: rgb(30 / 255, 58 / 255, 138 / 255),
  });

  currentPage.drawText(params.fullName, {
    x: clientX + 10,
    y: sigBoxTop - 74,
    size: 8,
    font: fontBold,
    color: rgb(30 / 255, 41 / 255, 59 / 255),
  });
  currentPage.drawText(`for ${params.companyName}`, {
    x: clientX + 10,
    y: sigBoxTop - 85,
    size: 7.5,
    font: fontRegular,
    color: rgb(100 / 255, 116 / 255, 139 / 255),
  });
  currentPage.drawText(`Timestamp: ${params.formattedDate}`, {
    x: clientX + 10,
    y: sigBoxTop - 98,
    size: 6.5,
    font: fontRegular,
    color: rgb(148 / 255, 163 / 255, 184 / 255),
  });

  y = sigBoxTop - sigBoxHeight - 16;

  // Legal Consent Note
  ensureSpace(40);
  const legalNote = "This executed electronic record is legally binding under the U.S. Electronic Signatures in Global and National Commerce Act (E-SIGN Act, 15 U.S.C. § 7001 et seq.) and the Uniform Electronic Transactions Act (UETA). Both parties hold an authoritative duplicate copy of this document.";
  const noteLines = wrapText(legalNote, fontRegular, 7, contentWidth);
  for (const line of noteLines) {
    currentPage.drawText(line, {
      x: margin,
      y: y - 6,
      size: 7,
      font: fontRegular,
      color: rgb(148 / 255, 163 / 255, 184 / 255),
    });
    y -= 9;
  }

  // ==========================================
  // FOOTERS ON ALL PAGES
  // ==========================================
  const totalPages = pages.length;
  for (let i = 0; i < totalPages; i++) {
    const p = pages[i];
    p.drawLine({
      start: { x: margin, y: 35 },
      end: { x: pageWidth - margin, y: 35 },
      thickness: 0.5,
      color: rgb(226 / 255, 232 / 255, 240 / 255),
    });

    p.drawText(`Spyke AI Technologies · contact@spykeai.com · Ref: ${params.agreementId}`, {
      x: margin,
      y: 24,
      size: 7.5,
      font: fontRegular,
      color: rgb(148 / 255, 163 / 255, 184 / 255),
    });

    p.drawText(`Page ${i + 1} of ${totalPages}`, {
      x: pageWidth - margin - 50,
      y: 24,
      size: 7.5,
      font: fontRegular,
      color: rgb(148 / 255, 163 / 255, 184 / 255),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
