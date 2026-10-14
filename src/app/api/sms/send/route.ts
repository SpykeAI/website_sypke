import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { normalizeToE164, sendTelnyxSms } from "@/lib/telnyx";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, text, conversationId } = body;

    if (!to || !text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { ok: false, code: "INVALID_INPUT", message: "Recipient number ('to') and non-empty 'text' are required." },
        { status: 400 }
      );
    }

    const normalizedTo = normalizeToE164(to);
    const telnyxFrom = process.env.TELNYX_FROM_NUMBER || "unknown";

    // 1. Check if contact exists and is opted-out (do_not_text)
    const { data: contactData } = await supabase
      .from("contacts")
      .select("id, do_not_text")
      .eq("phone_e164", normalizedTo)
      .maybeSingle();

    if (contactData && contactData.do_not_text) {
      return NextResponse.json(
        { ok: false, code: "OPTED_OUT", message: "Recipient has opted out of SMS messages (do-not-text)." },
        { status: 400 }
      );
    }

    // 2. Find or create Contact
    let contactId = contactData?.id;
    if (!contactId) {
      const { data: newContact, error: contactErr } = await supabase
        .from("contacts")
        .insert({
          phone_e164: normalizedTo,
          display_name: normalizedTo,
          do_not_text: false,
        })
        .select("id")
        .single();

      if (contactErr || !newContact) {
        console.error("Failed to create contact:", contactErr);
      } else {
        contactId = newContact.id;
      }
    }

    // 3. Find or create Conversation
    let activeConversationId = conversationId;
    if (!activeConversationId && contactId) {
      const { data: existingConv } = await supabase
        .from("conversations")
        .select("id")
        .eq("contact_id", contactId)
        .maybeSingle();

      if (existingConv) {
        activeConversationId = existingConv.id;
      } else {
        const { data: newConv } = await supabase
          .from("conversations")
          .insert({
            contact_id: contactId,
            telnyx_number: telnyxFrom,
            last_message_at: new Date().toISOString(),
            unread_count: 0,
          })
          .select("id")
          .single();

        if (newConv) {
          activeConversationId = newConv.id;
        }
      }
    }

    // 4. Create pending Message record
    let internalMessageId: string | undefined;
    if (activeConversationId) {
      const { data: pendingMsg } = await supabase
        .from("messages")
        .insert({
          conversation_id: activeConversationId,
          direction: "outbound",
          from_number: telnyxFrom,
          to_number: normalizedTo,
          body: text.trim(),
          status: "pending",
        })
        .select("id")
        .single();

      if (pendingMsg) {
        internalMessageId = pendingMsg.id;
      }
    }

    // 5. Call Telnyx Messages API
    const telnyxRes = await sendTelnyxSms({
      to: normalizedTo,
      text: text.trim(),
    });

    if (!telnyxRes.ok) {
      // Update status to failed
      if (internalMessageId) {
        await supabase
          .from("messages")
          .update({
            status: "failed",
            error_code: telnyxRes.error || "PROVIDER_REJECTED",
          })
          .eq("id", internalMessageId);
      }

      return NextResponse.json(
        {
          ok: false,
          code: "PROVIDER_REJECTED",
          message: telnyxRes.error || "Telnyx rejected the message request.",
        },
        { status: 502 }
      );
    }

    // 6. Update message status to accepted / queued
    if (internalMessageId) {
      await supabase
        .from("messages")
        .update({
          provider_message_id: telnyxRes.messageId,
          status: "accepted",
          sent_at: new Date().toISOString(),
        })
        .eq("id", internalMessageId);

      // Update conversation last_message_at
      if (activeConversationId) {
        await supabase
          .from("conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", activeConversationId);
      }
    }

    return NextResponse.json({
      ok: true,
      messageId: internalMessageId,
      providerMessageId: telnyxRes.messageId,
      status: "accepted",
      conversationId: activeConversationId,
    });
  } catch (error: any) {
    console.error("Error in /api/sms/send:", error);
    return NextResponse.json(
      { ok: false, code: "INTERNAL_ERROR", message: error?.message || "Failed to process SMS request." },
      { status: 500 }
    );
  }
}
