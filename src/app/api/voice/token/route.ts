import { NextResponse } from "next/server";

export async function POST() {
  try {
    const rawApiKey = process.env.TELNYX_API_KEY || "";
    const apiKey = rawApiKey.replace(/^['"]|['"]$/g, "").trim();

    if (!apiKey) {
      return NextResponse.json(
        { ok: false, message: "TELNYX_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const rawConnId = process.env.TELNYX_SIP_CONNECTION_ID || "3042039049075295777";
    const connectionId = rawConnId.replace(/^['"]|['"]$/g, "").trim();
    const callerNumber = (process.env.TELNYX_FROM_NUMBER || "+13464770028").replace(/^['"]|['"]$/g, "").trim();

    // 1. Create a short-lived telephony credential for this connection
    const credRes = await fetch("https://api.telnyx.com/v2/telephony_credentials", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ connection_id: connectionId }),
    });

    const credData = await credRes.json();
    if (!credRes.ok || !credData.data?.id) {
      console.error("Failed to create telephony credential:", credData);
      return NextResponse.json(
        {
          ok: false,
          message: credData.errors?.[0]?.detail || "Failed to create telephony credential on Telnyx",
        },
        { status: 500 }
      );
    }

    const credentialId = credData.data.id;

    // 2. Generate the temporary WebRTC JWT token
    const tokenRes = await fetch(
      `https://api.telnyx.com/v2/telephony_credentials/${credentialId}/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const token = await tokenRes.text();
    if (!tokenRes.ok || !token || token.length < 20) {
      return NextResponse.json(
        { ok: false, message: "Failed to generate WebRTC token from Telnyx" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      token: token.trim(),
      callerNumber,
      sipUsername: credData.data.sip_username,
    });
  } catch (err: any) {
    console.error("Voice token generation error:", err);
    return NextResponse.json(
      { ok: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
