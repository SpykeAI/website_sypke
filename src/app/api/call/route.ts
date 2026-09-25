import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, phone, email } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    if (!process.env.VAPI_PRIVATE_KEY || !process.env.VAPI_ASSISTANT_ID || !process.env.VAPI_PHONE_NUMBER_ID) {
      return NextResponse.json({ error: "Server missing Vapi configuration" }, { status: 500 });
    }

    // Trigger Outbound call via Vapi API
    const response = await fetch("https://api.vapi.ai/call/phone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
      },
      body: JSON.stringify({
        assistantId: process.env.VAPI_ASSISTANT_ID,
        customer: {
          number: phone, // phone number from form
          name: name || "Website Visitor",
        },
        phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID, // Your imported Telnyx Number ID
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Vapi Outbound Error:", data);
      return NextResponse.json({ error: data.message || "Failed to initiate call via Vapi" }, { status: response.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error triggering call:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
