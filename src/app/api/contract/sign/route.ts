import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function createTransporter() {
  const user = (process.env.SMTP_USER || "spykeai2026@gmail.com").trim();
  const pass = (process.env.SMTP_PASS || "bhcltdujumkilxbx").replace(/\s+/g, "");
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;

  if (user.endsWith("@gmail.com")) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      companyName,
      website,
      fullName,
      businessAddress,
      email,
      phone,
      signature,
      consent,
    } = body;

    // Validation
    if (!companyName || !fullName || !businessAddress || !email || !phone || !signature || !consent) {
      return NextResponse.json(
        { error: "Please complete all required fields and sign the agreement to proceed." },
        { status: 400 }
      );
    }

    const agreementId = `SPYKE-AGR-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const signedAt = new Date().toISOString();
    const formattedDate = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "America/Chicago",
    });

    // 1. Log signed contract record into Supabase (CRM / Conversations)
    try {
      await supabase.from("conversations").insert({
        contact_name: fullName,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        summary: `[ELECTRONIC CONTRACT SIGNED] Agreement ID: ${agreementId} | Company: ${companyName} | Signatory: ${fullName} | Date: ${formattedDate} (CST)`,
        interest_level: "High",
        transcript: JSON.stringify({
          type: "CLIENT_CONTRACT_EXECUTION",
          agreementId,
          companyName,
          website: website || "N/A",
          fullName,
          businessAddress,
          email,
          phone,
          signature,
          consent: true,
          signedAt,
          formattedDate,
          providerSignatory: "Ayushi Sainani, Founder (Spyke AI Technologies)",
        }),
      });
    } catch (dbErr) {
      console.warn("Could not insert to Supabase conversations table:", dbErr);
    }

    // 2. Dispatch Email Confirmation to Client & Provider
    try {
      const transporter = createTransporter();
      const mailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #0b0f17; color: #f1f5f9; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 28px; border-bottom: 1px solid #334155; text-align: center;">
            <div style="font-size: 13px; font-weight: 700; color: #ef4444; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">Spyke AI Technologies</div>
            <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0 0 8px 0; letter-spacing: -0.5px;">Client Services Agreement Executed</h1>
            <p style="font-size: 13px; color: #94a3b8; margin: 0;">Authoritative Electronic Record · Ref: <strong>${agreementId}</strong></p>
          </div>
          
          <div style="padding: 28px;">
            <div style="background-color: #121826; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <h3 style="font-size: 14px; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 14px 0;">Execution Certificate</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #cbd5e1;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b; width: 140px;">Agreement ID:</td>
                  <td style="padding: 6px 0; font-weight: 700; color: #ffffff;">${agreementId}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Client Legal Name:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #ffffff;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Company / Entity:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #ffffff;">${companyName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Business Address:</td>
                  <td style="padding: 6px 0; color: #cbd5e1;">${businessAddress}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Client Email:</td>
                  <td style="padding: 6px 0; color: #cbd5e1;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Client Phone:</td>
                  <td style="padding: 6px 0; color: #cbd5e1;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Execution Date:</td>
                  <td style="padding: 6px 0; color: #10b981; font-weight: 600;">${formattedDate} (CST)</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Governing Law:</td>
                  <td style="padding: 6px 0; color: #cbd5e1;">State of Texas, USA (Dallas County)</td>
                </tr>
              </table>
            </div>

            <div style="display: flex; gap: 16px; margin-bottom: 24px;">
              <div style="background-color: #121826; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; width: 50%;">
                <div style="font-size: 11px; font-weight: 700; color: #10b981; text-transform: uppercase; margin-bottom: 6px;">Provider Signatory [Signed]</div>
                <div style="font-family: 'Brush Script MT', cursive, Georgia, serif; font-size: 24px; color: #34d399; margin: 8px 0;">Ayushi Sainani</div>
                <div style="font-size: 12px; font-weight: 600; color: #e2e8f0;">Ayushi Sainani, Founder</div>
                <div style="font-size: 11px; color: #64748b;">Spyke AI Technologies</div>
              </div>
              <div style="background-color: #121826; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; width: 50%;">
                <div style="font-size: 11px; font-weight: 700; color: #10b981; text-transform: uppercase; margin-bottom: 6px;">Client Signatory [Signed]</div>
                <div style="font-family: 'Brush Script MT', cursive, Georgia, serif; font-size: 24px; color: #38bdf8; margin: 8px 0;">${signature}</div>
                <div style="font-size: 12px; font-weight: 600; color: #e2e8f0;">${fullName}</div>
                <div style="font-size: 11px; color: #64748b;">${companyName}</div>
              </div>
            </div>

            <div style="background-color: #0d1e19; border: 1px solid #065f46; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
              <div style="font-size: 12px; font-weight: 700; color: #34d399; margin-bottom: 4px;">✓ 100% Money-Back Guarantee Activated</div>
              <p style="font-size: 12px; color: #a7f3d0; margin: 0; line-height: 1.5;">
                Your agreement is backed by our full 60-day guarantee upon Full Implementation as specified in §5 of the contract.
              </p>
            </div>

            <p style="font-size: 12px; color: #64748b; line-height: 1.6; margin: 0 0 16px 0;">
              This agreement is legally binding under the U.S. Electronic Signatures in Global and National Commerce Act (E-SIGN Act, 15 U.S.C. § 7001 et seq.) and the Uniform Electronic Transactions Act (UETA). A copy of this executed record has been archived for both parties.
            </p>
          </div>

          <div style="background-color: #080c14; padding: 20px 28px; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; color: #64748b;">
            Spyke AI Technologies · contact@spykeai.com · <a href="https://spykeai.com" style="color: #38bdf8; text-decoration: none;">spykeai.com</a>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"Spyke AI Contracts" <${process.env.SMTP_USER || "spykeai2026@gmail.com"}>`,
        to: email,
        cc: "contact@spykeai.com, spykeai2026@gmail.com",
        subject: `[EXECUTED] Spyke AI Client Services Agreement - ${companyName} (${agreementId})`,
        html: mailHtml,
      });
    } catch (mailErr) {
      console.warn("Failed to send agreement copy email:", mailErr);
    }

    return NextResponse.json({
      success: true,
      agreementId,
      signedAt,
      formattedDate,
      signatory: fullName,
      company: companyName,
      providerSignatory: "Ayushi Sainani, Founder",
      status: "EXECUTED",
    });
  } catch (error: any) {
    console.error("POST /api/contract/sign error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute agreement. Please try again." },
      { status: 500 }
    );
  }
}
