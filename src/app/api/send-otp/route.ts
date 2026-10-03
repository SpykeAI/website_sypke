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

    // Optional: Only configure and send if SMTP is provided, else mock for dev
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"SpykeAI Verification" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Your SpykeAI Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #333;">Email Verification</h2>
            <p>Your OTP for verification is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
            <p>This code will expire in 5 minutes.</p>
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
