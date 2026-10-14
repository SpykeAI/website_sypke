import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { normalizeToE164 } from "@/lib/telnyx";

// GET all conversations sorted by most recent message
export async function GET() {
  try {
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(`
        id,
        telnyx_number,
        last_message_at,
        unread_count,
        interest_level,
        created_at,
        contacts (
          id,
          phone_e164,
          display_name,
          do_not_text
        )
      `)
      .order("last_message_at", { ascending: false });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, conversations });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// POST create new conversation with a phone number
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, displayName, interest_level } = body;

    if (!phone) {
      return NextResponse.json({ ok: false, message: "Phone number is required" }, { status: 400 });
    }

    const normalizedPhone = normalizeToE164(phone);
    const telnyxFrom = process.env.TELNYX_FROM_NUMBER || "unknown";

    // 1. Find or create contact
    let contactId: string | undefined;
    const { data: existingContact } = await supabase
      .from("contacts")
      .select("id")
      .eq("phone_e164", normalizedPhone)
      .maybeSingle();

    if (existingContact) {
      contactId = existingContact.id;
    } else {
      const { data: newContact, error: cErr } = await supabase
        .from("contacts")
        .insert({
          phone_e164: normalizedPhone,
          display_name: displayName || normalizedPhone,
          do_not_text: false,
        })
        .select("id")
        .single();

      if (cErr) throw cErr;
      contactId = newContact?.id;
    }

    // 2. Find or create conversation
    let convId: string | undefined;
    const { data: existingConv } = await supabase
      .from("conversations")
      .select("id")
      .eq("contact_id", contactId)
      .maybeSingle();

    if (existingConv) {
      convId = existingConv.id;
    } else {
      const { data: newConv, error: convErr } = await supabase
        .from("conversations")
        .insert({
          contact_id: contactId,
          telnyx_number: telnyxFrom,
          interest_level: interest_level || "cold outreach",
          last_message_at: new Date().toISOString(),
          unread_count: 0,
        })
        .select("id")
        .single();

      if (convErr) throw convErr;
      convId = newConv?.id;
    }

    return NextResponse.json({ ok: true, conversationId: convId, contactId });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// PATCH update conversation stage / status (prospect, cold outreach, lead)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { conversationId, interest_level } = body;

    if (!conversationId) {
      return NextResponse.json({ ok: false, message: "conversationId is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("conversations")
      .update({ 
        interest_level: interest_level || null, 
        updated_at: new Date().toISOString() 
      })
      .eq("id", conversationId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, conversation: data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

