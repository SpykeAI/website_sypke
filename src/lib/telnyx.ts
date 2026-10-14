/**
 * Telnyx Messaging and Webhook Helper Functions
 * Compliant with SpykeAI Telnyx SMS Requirements
 */

export interface SendSmsParams {
  to: string;
  text: string;
  from?: string;
  messagingProfileId?: string;
}

export interface TelnyxSendResponse {
  id: string;
  to: Array<{ phone_number: string; status: string }>;
  from: { phone_number: string };
  text: string;
  type: string;
  cost?: { amount: string; currency: string };
}

/**
 * Normalizes phone numbers to standard E.164 format
 */
export function normalizeToE164(phone: string): string {
  let cleaned = phone.trim().replace(/[^\d+]/g, '');
  if (!cleaned.startsWith('+')) {
    // If 10 digits and starts with 2-9 (US), prefix +1
    if (cleaned.length === 10) {
      cleaned = '+1' + cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      cleaned = '+' + cleaned;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      cleaned = '+' + cleaned;
    } else {
      cleaned = '+' + cleaned;
    }
  }
  return cleaned;
}

/**
 * Sends an SMS message via the Telnyx V2 Messaging API
 */
export async function sendTelnyxSms(params: SendSmsParams): Promise<{
  ok: boolean;
  messageId?: string;
  data?: any;
  error?: string;
}> {
  const rawKey = process.env.TELNYX_API_KEY || '';
  const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');
  const rawFrom = params.from || process.env.TELNYX_FROM_NUMBER || '';
  const fromNumber = rawFrom.trim().replace(/^["']|["']$/g, '');
  const rawProfile = params.messagingProfileId || process.env.TELNYX_MESSAGING_PROFILE_ID || '';
  const messagingProfileId = rawProfile.trim().replace(/^["']|["']$/g, '');

  if (!apiKey) {
    return { ok: false, error: 'TELNYX_API_KEY is not configured in server environment' };
  }

  if (!fromNumber && !messagingProfileId) {
    return { ok: false, error: 'Neither TELNYX_FROM_NUMBER nor TELNYX_MESSAGING_PROFILE_ID is configured' };
  }

  const payload: Record<string, any> = {
    to: normalizeToE164(params.to),
    text: params.text,
  };

  if (fromNumber) {
    payload.from = fromNumber;
  }
  if (messagingProfileId) {
    payload.messaging_profile_id = messagingProfileId;
  }

  try {
    const res = await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data?.errors?.[0]?.detail || data?.errors?.[0]?.title || res.statusText;
      return { ok: false, error: errorMsg, data };
    }

    const messageId = data?.data?.id;
    return { ok: true, messageId, data: data?.data };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Network error calling Telnyx API' };
  }
}
