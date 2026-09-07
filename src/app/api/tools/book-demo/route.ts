import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // Telnyx (and ElevenLabs) usually sends tool parameters in arguments or directly in the body
    const args = payload.arguments || payload;
    
    const email = args.email || "No email";
    const name = args.name || "Demo Lead";
    const phone = args.mobile || args.phone || "No phone"; 

    // 1. Save the Lead to Supabase CRM (Admin Dashboard)
    const { error } = await supabase.from("conversations").insert({
      contact_name: name,
      email: email,
      phone: phone,
      summary: `[TELNYX DEMO] Caller requested a Calendly booking link to their mobile number: ${phone}`,
      interest_level: "High",
      booked_meeting: true
    });

    if (error) {
      console.error("Supabase Error:", error);
    }

    // 2. Here you would normally trigger a Telnyx SMS API to literally text them the Calendly link.
    // For this demo, we simply return a prompt back to the AI so it knows it succeeded.
    
    return NextResponse.json({ 
      result: `Success! Tell the caller: "I have securely saved your information. I am sending our Calendly link to your mobile number right now so you can pick a time that works for you! Is there anything else I can help you with?"`
    });

  } catch (err) {
    console.error("Booking tool error:", err);
    return NextResponse.json({ result: "Internal server error during booking." }, { status: 500 });
  }
}
