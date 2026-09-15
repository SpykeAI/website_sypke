import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const callId = payload.conversation_id || payload.id || `call_${Date.now()}`;
    const rawTranscript = payload.transcript || [];
    let formattedTranscript = "";
    if (Array.isArray(rawTranscript)) {
      formattedTranscript = rawTranscript.map((msg: any) => `${msg.role === "agent" ? "AI" : "User"}: ${msg.message || msg.text}`).join("\n\n");
    } else if (typeof rawTranscript === "string") {
      formattedTranscript = rawTranscript;
    } else {
      formattedTranscript = JSON.stringify(rawTranscript, null, 2);
    }
    const args = payload.arguments || {};
    const metadata = payload.metadata || payload.extracted_data || {};
    const email = args.email || metadata.email || payload.email || "";
    const phone = args.phone || metadata.phone || payload.phone || "";
    const name = args.name || metadata.name || metadata.contact_name || payload.name || "Unknown Caller";
    const summary = args.summary || metadata.summary || payload.summary || "Call completed.";
    const interest = args.interest_level || metadata.interest_level || payload.interest_level || "Pending";

    const { error } = await supabase.from("conversations").insert({ call_id: callId, contact_name: name, email: email, phone: phone, transcript: formattedTranscript, summary: summary, interest_level: interest });
    if (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
    return NextResponse.json({ success: true });
  } catch (err) { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const callId = searchParams.get("conversation_id") || searchParams.get("id") || `call_${Date.now()}`;
    const rawTranscript = searchParams.get("transcript") || "No transcript provided via GET";
    const email = searchParams.get("email") || "";
    const phone = searchParams.get("phone") || "";
    const name = searchParams.get("name") || searchParams.get("contact_name") || "Unknown Caller";
    const summary = searchParams.get("summary") || "Call completed.";
    const interest = searchParams.get("interest_level") || "Pending";

    const { error } = await supabase.from("conversations").insert({ call_id: callId, contact_name: name, email: email, phone: phone, transcript: rawTranscript, summary: summary, interest_level: interest });
    if (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
    return NextResponse.json({ success: true });
  } catch (err) { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
