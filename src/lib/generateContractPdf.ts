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

export async function generateContractPdf(params: ContractPdfParams): Promise<Buffer> {
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
      currentPage.drawText("SPYKE AI TECHNOLOGIES · CLIENT SERVICES AGREEMENT", {
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
    const words = text.split(" ");
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
  currentPage.drawText("Spyke AI Client Services Agreement", {
    x: margin,
    y: y - 18,
    size: 20,
    font: fontBold,
    color: rgb(15 / 255, 23 / 255, 42 / 255),
  });
  y -= 26;

  currentPage.drawText("Legally Binding Electronic Client Agreement, System Implementation & Service Terms", {
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
      title: "Services, The Spyke AI System",
      text: "Upon payment of the Fee (§2), we grant you access to the Spyke AI System, which includes: the complete AI Voice & Messaging infrastructure and all its modules; niche customization and voice agent workflow building with our team; the inbound & outbound call handling systems and software tools we provision for members; funnel, CRM, webhook and automation frameworks; our templates, scripts and resources; the client community; and the support channels described in §4. Your access does not expire, you keep the System for as long as the Spyke AI System operates, with no renewal fees and no re-purchase (§12). If your written offer, checkout page, or invoice includes the Inbound Engine / Growth package, the Services also include: your AI voice agent configuration, booking flow built for you; scripts and system setup from our playbook; telephony, Twilio/Telnyx line and tracking setup; campaign structure built in your account; a joint launch; and follow-up flows connected to your CRM. Ad spend/carrier usage is paid by you directly to the platforms and is never part of any Fee. We may improve, update or substitute components of the System over time, provided the overall substance of what you purchased is preserved or improved.",
    },
    {
      num: "2",
      title: "Fees & Payment",
      text: "Your Fee is the exact price you were quoted and agreed in writing before signing, on your invoice, checkout page, or written payment agreement (the 'Fee'), including any installment or milestone schedule agreed there. Nothing on this page adds to it: no hidden costs, no required upsells, no renewal or maintenance fees, ever. Access is granted on receipt of the first payment. If a scheduled payment is not made when due, we may pause access until it is, and if that happens, your §5 guarantee clock simply pauses too and resumes when access is restored; a pause never resets your progress. All amounts are in USD unless stated otherwise.",
    },
    {
      num: "3",
      title: "Onboarding & Implementation",
      text: "After purchase, we run onboarding with you, which includes niche finalization and voice agent / workflow building together with our team, followed by installation of the automated system (the 'Setup Phase'). We complete installation within 14 days of you finishing your onboarding steps, usually much faster. You agree to participate in onboarding, provide the information and account access reasonably needed, and complete the steps that only you can perform (e.g. account signups, verifications, recordings). 'Full Implementation' means: onboarding completed; niche and offer finalized with our team; the outreach/voice agent system installed; the automations switched ON and running continuously at the settings we give you in writing at onboarding (so the target never moves on you); and your booking calendar connected. Full Implementation is reached, at the latest, when at least four (4) outreach/system channels are live and running. Most clients are fully live within 7 to 10 days of starting onboarding; fast movers do it in 4. The moment Full Implementation is reached, we confirm it to you in writing, and that confirmation is the official start of your 60-day guarantee window (§5), so you always know exactly where you stand.",
    },
    {
      num: "4",
      title: "Support, Unlimited, in Writing",
      text: "From the moment your offer building and niche finalization are complete, you may raise unlimited support requests, questions, reviews, fixes, anything related to the System, via email, our ticketing system, or SMS. There is no cap on the number of tickets or requests. We respond in the order received and within a commercially reasonable time. Support covers the System and its implementation; it does not include us operating your business for you.",
    },
    {
      num: "5",
      title: "The Refund Guarantee (100% Money-Back)",
      isGuarantee: true,
      text: "Implement the system, keep it live for 60 days, and if it doesn't book you at least 2 sales calls every single day, we refund 100% of what you paid. Happily, and within 24 hours of verifying. No partial refunds, no credits-instead-of-cash, no hoops.\n• 5.1, When it applies. (a) You reached Full Implementation (§3), (b) the outreach system was live, automations on and running, for 60 consecutive days at the prescribed settings, and (c) during that period it did not book you at least two (2) Qualified Sales Calls every single day (defined in 5.2), as shown by the System's own logs and your connected calendar.\n• 5.2, Qualified Calls. A Qualified Call is an attended conversation with an eligible prospect in your target niche who expressed clear interest in your service offering.",
    },
    {
      num: "6",
      title: "Your Responsibilities",
      text: "You agree to: (a) complete onboarding and the steps only you can do, within a reasonable time of our requests; (b) keep your accounts, tools and integrations connected and in good standing; (c) use the System only for lawful business purposes; (d) not share, resell, or provide access to the System or its materials to any third party; and (e) tell us promptly, through support, when something isn't working, so we can fix it.",
    },
    {
      num: "7",
      title: "Compliance Is Yours",
      text: "You are the sender and operator of your own outreach. You are responsible for your compliance with the laws and platform rules that apply to your messages and your market, including (as applicable) CAN-SPAM, TCPA, A2P/carrier rules, GDPR/UK-GDPR, PECR, and each platform's terms of service. We provide tools, training and prescribed settings designed for sensible use; we are not your lawyer and do not warrant your outreach's legal compliance in your jurisdiction. Our side of it: we will never knowingly configure the System, or instruct you, to run outreach that violates applicable laws, carrier requirements, or platform policies. The prescribed settings are designed to operate within them.",
    },
    {
      num: "8",
      title: "Intellectual Property",
      text: "The System, trainings, scripts, templates, software, prompts, frameworks, and materials, is and remains our intellectual property (or that of our licensors). You receive a non-exclusive, non-transferable license to use it for your own business while you have access. Assets we create for you during implementation (your funnel copy, your creatives, your configured systems) are yours to keep and use for your business, and if your access ever ends, those assets remain yours and we will provide a reasonable export of your CRM data on request.",
    },
    {
      num: "9",
      title: "Confidentiality",
      text: "Each party will keep the other's non-public information confidential and use it only for purposes of this Agreement. This survives termination. We may state that you are a client; we will only publish your specific results with your consent.",
    },
    {
      num: "10",
      title: "No Other Earnings Promises",
      text: "Business results vary with markets, effort and execution. Other than the express Refund Guarantee in §5, which is real, and honored exactly as written, we make no other guarantee of income, revenue, or results, and any figures shown in our marketing are examples, not promises.",
    },
    {
      num: "11",
      title: "Limitation of Liability",
      text: "To the maximum extent permitted by law: neither party is liable for indirect, incidental, special or consequential damages; and our total aggregate liability under this Agreement is capped at the Fee you actually paid. Nothing in this Agreement limits liability that cannot lawfully be limited (including fraud).",
    },
    {
      num: "12",
      title: "Term & Termination",
      text: "This Agreement starts on the Effective Date (the date you sign below). Your access does not expire, it continues for as long as the Spyke AI System operates, with no renewal fees. We may terminate for your material breach (including non-payment or sharing access) that remains uncured 14 days after written notice. You are protected the same way: if we materially fail to deliver the services (for example, you request a call or support and hear nothing back within 3 business days), tell us in writing. If we have not fixed it within 14 days of that notice, you may terminate this Agreement and receive a full refund of the Fee you have actually paid. Otherwise, you may stop using the System at any time; fees already paid are only refundable under §5 or this clause.",
    },
    {
      num: "13",
      title: "Governing Law & Disputes",
      text: "This Agreement is governed by the laws of the State of Texas, USA, without regard to conflict-of-law rules. The parties will first attempt in good faith to resolve any dispute through the support channels and direct discussion within 30 days before starting formal proceedings. Venue for formal proceedings is Dallas County, Texas, except that either party may seek injunctive relief for IP or confidentiality breaches in any competent court.",
    },
    {
      num: "14",
      title: "Electronic Signature & Records",
      text: "Both parties agree to do business electronically. Your typed name below, submitted with the consent box checked, is your electronic signature and is legally binding under the U.S. E-SIGN Act and UETA, and the UK's Electronic Communications Act 2000 / eIDAS as applicable. Our counter-signature is applied in advance and delivered with this document. The executed record, including both signatures, your details, the date-time stamp and the signing IP address, is stored by us and emailed to you; that record is the authoritative copy.",
    },
    {
      num: "15",
      title: "Notices",
      text: "Notices to us: contact@spykeai.com, or post to either address in the Parties section. Notices to you: the email address you provide below. Email notice is effective on sending, absent a bounce.",
    },
    {
      num: "16",
      title: "General",
      text: "This document plus your invoice/payment agreement is the entire agreement and supersedes prior discussions. If any clause is unenforceable, the rest stands. Amendments must be in writing (email suffices) and agreed by both parties. You may not assign this Agreement without our written consent; we may assign to an affiliate. Nothing here creates a partnership, employment or agency relationship.",
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

      currentPage.drawText("✓ 100% MONEY-BACK GUARANTEE, REFUNDED WITHIN 24 HOURS", {
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
