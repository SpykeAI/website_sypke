import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

interface Recipient {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  address?: string;
}

function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP credentials are not configured in environment variables.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function replaceTags(template: string, data: { name: string; email: string; city: string; phone: string; address: string }) {
  const firstName = data.name.split(" ")[0] || "Valued Customer";
  return template
    .replace(/\{\{\s*first_name\s*\}\}/gi, firstName)
    .replace(/\{\{\s*name\s*\}\}/gi, data.name)
    .replace(/\{\{\s*email\s*\}\}/gi, data.email)
    .replace(/\{\{\s*city\s*\}\}/gi, data.city)
    .replace(/\{\{\s*phone\s*\}\}/gi, data.phone)
    .replace(/\{\{\s*address\s*\}\}/gi, data.address);
}

function buildHtmlEmail(params: {
  bodyText: string;
  preheader: string;
  fromName: string;
  recipientName: string;
  campaignId?: string;
}) {
  const paragraphs = params.bodyText
    .split("\n\n")
    .filter((p) => p.trim().length > 0)
    .map((p) => `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #1e293b;">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Spyke AI Notification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Hidden Preheader -->
  <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; color: #f8fafc;">
    ${params.preheader || "Spyke HVAC VIP Priority Notification"}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <!-- Header Bar -->
          <tr>
            <td style="padding: 24px 32px; background: linear-gradient(135deg, #09090b 0%, #18181b 100%); border-bottom: 2px solid #3b82f6;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 19px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                      ⚡ Spyke <span style="color: #60a5fa;">HVAC Dispatch</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 9999px;">
                      Verified Priority
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              ${paragraphs}
              
              <!-- Call to action button -->
              <div style="margin: 28px 0 20px 0; text-align: left;">
                <a href="https://spyke.ai" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
                  Confirm Service / Schedule Visit &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Signature & Footer -->
          <tr>
            <td style="padding: 20px 32px 28px 32px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #334155;">
                ${params.fromName || "Spyke HVAC Dispatch Team"}
              </p>
              <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                24/7 HVAC Emergency Response &bull; Direct Technician Hotline &bull; Texas, USA
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.4;">
                You received this priority message because of your recent inquiry or service history with Spyke HVAC. 
                If you wish to update your preferences or unsubscribe, simply reply to this email with "STOP".
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      mode = "campaign", // "test" | "campaign"
      testEmail,
      campaignTitle = "General Announcement",
      segment = "Selected Audience",
      fromName = "Spyke HVAC Team",
      fromEmail = "team@spyke.ai",
      replyTo = "support@spyke.ai",
      subject = "Update regarding your HVAC service",
      preheader = "",
      body: emailBody = "",
      recipients = [],
    } = body;

    const transporter = createTransporter();
    const senderAddress = process.env.SMTP_USER;

    // 1. Single Test Email Dispatch
    if (mode === "test") {
      if (!testEmail || typeof testEmail !== "string" || !testEmail.includes("@")) {
        return NextResponse.json({ ok: false, error: "Valid test email address is required" }, { status: 400 });
      }

      const sampleData = {
        name: "Valued Client",
        email: testEmail.trim(),
        city: "Dallas",
        phone: "+1 (346) 477-0028",
        address: "742 Evergreen Terrace",
      };

      const finalSubject = `[TEST] ${replaceTags(subject, sampleData)}`;
      const finalBodyText = replaceTags(emailBody, sampleData);
      const html = buildHtmlEmail({
        bodyText: finalBodyText,
        preheader: replaceTags(preheader, sampleData),
        fromName,
        recipientName: sampleData.name,
      });

      const info = await transporter.sendMail({
        from: `"${fromName}" <${senderAddress}>`,
        replyTo: replyTo || senderAddress,
        to: testEmail.trim(),
        subject: finalSubject,
        text: finalBodyText,
        html,
      });

      return NextResponse.json({
        ok: true,
        mode: "test",
        messageId: info.messageId,
        sentTo: testEmail.trim(),
        sentAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }

    // 2. Full Campaign Broadcast Dispatch
    const targetRecipients: Recipient[] = Array.isArray(recipients) && recipients.length > 0 ? recipients : [];

    if (targetRecipients.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No recipients provided for campaign broadcast." },
        { status: 400 }
      );
    }

    const logsCreated = [];

    // Send emails sequentially or in small chunks
    for (const recipient of targetRecipients) {
      const recipientData = {
        name: recipient.name || "Customer",
        email: recipient.email.trim(),
        city: recipient.city || "Texas",
        phone: recipient.phone || "+1 (346) 477-0028",
        address: recipient.address || "Texas Residence",
      };

      const finalSubject = replaceTags(subject, recipientData);
      const finalBodyText = replaceTags(emailBody, recipientData);
      const html = buildHtmlEmail({
        bodyText: finalBodyText,
        preheader: replaceTags(preheader, recipientData),
        fromName,
        recipientName: recipientData.name,
      });

      try {
        const info = await transporter.sendMail({
          from: `"${fromName}" <${senderAddress}>`,
          replyTo: replyTo || senderAddress,
          to: recipientData.email,
          subject: finalSubject,
          text: finalBodyText,
          html,
        });

        logsCreated.push({
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          campaignTitle,
          subject: finalSubject,
          recipientName: recipientData.name,
          recipientEmail: recipientData.email,
          segment,
          sentAt: "Just now",
          status: "delivered",
          openCount: 0,
          bodySnippet: finalBodyText.slice(0, 140) + "...",
          fullBody: finalBodyText,
          messageId: info.messageId,
        });
      } catch (sendErr: any) {
        console.error(`Error sending email to ${recipientData.email}:`, sendErr);
        logsCreated.push({
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          campaignTitle,
          subject: finalSubject,
          recipientName: recipientData.name,
          recipientEmail: recipientData.email,
          segment,
          sentAt: "Just now",
          status: "bounced",
          openCount: 0,
          bodySnippet: finalBodyText.slice(0, 140) + "...",
          fullBody: finalBodyText,
          error: sendErr?.message || "Delivery failed",
        });
      }
    }

    return NextResponse.json({
      ok: true,
      mode: "campaign",
      totalDispatched: targetRecipients.length,
      successCount: logsCreated.filter((l) => l.status === "delivered").length,
      logs: logsCreated,
    });
  } catch (error: any) {
    console.error("Fatal error in email dispatch API:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error dispatching email" },
      { status: 500 }
    );
  }
}
