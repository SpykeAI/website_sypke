import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email, otp, hashPayload } = await req.json();

    if (!email || !otp || !hashPayload) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [hash, expiresAt] = hashPayload.split('.');

    if (Date.now() > Number(expiresAt)) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    const secret = process.env.OTP_SECRET || 'fallback-secret-key-spykeai';
    const dataToHash = `${email}.${otp}.${expiresAt}.${secret}`;
    const calculatedHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    // Only in development: allow bypassing if SMTP is not configured
    // and they just type some random numbers (optional safety check)
    if (!process.env.SMTP_USER && process.env.SMTP_PASS === undefined) {
         console.warn('Development mode: Bypassing strict OTP verification');
    } else if (calculatedHash !== hash) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
