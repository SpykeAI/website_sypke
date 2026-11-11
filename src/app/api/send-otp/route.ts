import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate a 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Securely hash the OTP so we don't need a database
    const secret = process.env.OTP_SECRET || 'fallback-secret-key-spykeai';
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins
    const dataToHash = `${email}.${otp}.${expiresAt}.${secret}`;
    const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    const hashPayload = `${hash}.${expiresAt}`;

    const smtpUser = (process.env.SMTP_USER || 'spykeai2026@gmail.com').trim();
    const smtpPass = (process.env.SMTP_PASS || 'bhcltdujumkilxbx').replace(/\s+/g, '');

    if (smtpUser && smtpPass) {
      const transporter = smtpUser.endsWith('@gmail.com')
        ? nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          })
        : nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 465,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

      const mailOptions = {
        from: `"SpykeAI Security" <${smtpUser}>`,
        to: email,
        subject: 'Your SpykeAI Superadmin OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; max-width: 500px; background-color: #ffffff;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
              <h2 style="color: #0f172a; margin: 0; font-size: 20px;">SpykeAI Super Admin</h2>
            </div>
            <p style="color: #475569; font-size: 14px; margin: 0 0 16px 0;">Use the one-time verification code below to access your portal session:</p>
            <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 16px; text-align: center; margin-bottom: 16px;">
              <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #059669; font-family: monospace;">${otp}</span>
            </div>
            <p style="color: #64748b; font-size: 12px; margin: 0;">This code is valid for 5 minutes. If you did not request this, please secure your account immediately.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } else {
      console.error('SERVER ERROR: SMTP credentials are not set in Vercel Environment Variables.');
      return NextResponse.json({ error: 'System Error: SMTP environment variables are missing on Vercel.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, hash: hashPayload });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
