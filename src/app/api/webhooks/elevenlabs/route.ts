import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // ElevenLabs typical webhook structure (extract what we can)
    const callId = payload.conversation_id || payload.id || `call_${Date.now()}`;
    const rawTranscript = payload.transcript || [];
    
    // Format transcript into a readable string if it's an array of messages
    let formattedTranscript = "";
    if (Array.isArray(rawTranscript)) {
      formattedTranscript = rawTranscript
        .map((msg: any) => `${msg.role === 'agent' ? 'AI' : 'User'}: ${msg.message || msg.text}`)
        .join('\n\n');
    } else if (typeof rawTranscript === 'string') {
      formattedTranscript = rawTranscript;
    } else {
      formattedTranscript = JSON.stringify(rawTranscript, null, 2);
    }

    // Extract potential variables (handling both standard webhooks and ElevenLabs 'Tool' arguments)
    const args = payload.arguments || {};
    const metadata = payload.metadata || payload.extracted_data || {};
    
    const email = args.email || metadata.email || payload.email || "";
    const phone = args.phone || metadata.phone || payload.phone || "";
    const name = args.name || metadata.name || metadata.contact_name || payload.name || "Unknown Caller";
    const summary = args.summary || metadata.summary || payload.summary || "Call completed.";
    const interest = args.interest_level || metadata.interest_level || payload.interest_level || "Pending";

    // Insert into Supabase
    const { error } = await supabase.from("conversations").insert({
      call_id: callId,
      contact_name: name,
      email: email,
      phone: phone,
      transcript: formattedTranscript,
      summary: summary,
      interest_level: interest,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
