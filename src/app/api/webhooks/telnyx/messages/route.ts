import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { normalizeToE164 } from "@/lib/telnyx";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const event = body?.data;
    if (!event) {
      return NextResponse.json({ received: true, note: "Empty event data" });
    }

    const eventId = event?.id || event?.record_type + "_" + Date.now();
    const eventType = event?.event_type;
    const payload = event?.payload;

    // 1. Idempotency Check: prevent duplicate event processing
    const { data: existingEvent } = await supabase
      .from("webhook_events")
      .select("id")
      .eq("provider_event_id", eventId)
      .maybeSingle();

    if (existingEvent) {
      return NextResponse.json({ received: true, note: "Duplicate event already processed" });
    }

    // Record webhook event for auditing
    await supabase.from("webhook_events").insert({
      provider_event_id: eventId,
      event_type: eventType || "unknown",
      status: "processing",
    });

    // Handle Inbound Message event
    if (eventType === "message.received" && payload) {
      const fromNumber = normalizeToE164(payload?.from?.phone_number || "");
      const toNumber = normalizeToE164(payload?.to?.[0]?.phone_number || process.env.TELNYX_FROM_NUMBER || "");
      const messageText = payload?.text || "";
      const providerMsgId = payload?.id;
      const receivedAt = payload?.received_at || new Date().toISOString();

      if (!fromNumber) {
        return NextResponse.json({ received: true, note: "No sender number found" });
      }

      // Check opt-out keywords
      const upperText = messageText.trim().toUpperCase();
      const isOptOut = ["STOP", "UNSUBSCRIBE", "CANCEL", "QUIT", "END"].includes(upperText);
      const isOptIn = ["START", "UNSTOP"].includes(upperText);

      // 2. Upsert Contact
      let contactId: string | undefined;
      const { data: existingContact } = await supabase
        .from("contacts")
        .select("id, do_not_text")
        .eq("phone_e164", fromNumber)
        .maybeSingle();

      if (existingContact) {
        contactId = existingContact.id;
        if (isOptOut || isOptIn) {
          await supabase
            .from("contacts")
            .update({ do_not_text: isOptOut, updated_at: new Date().toISOString() })
            .eq("id", contactId);
        }
      } else {
        const { data: newContact } = await supabase
          .from("contacts")
          .insert({
            phone_e164: fromNumber,
            display_name: fromNumber,
            do_not_text: isOptOut,
          })
          .select("id")
          .single();

        contactId = newContact?.id;
      }

      if (!contactId) {
        throw new Error("Failed to resolve contact ID for inbound SMS");
      }

      // 3. Find or Create Conversation
      let conversationId: string | undefined;
      const { data: existingConv } = await supabase
        .from("conversations")
        .select("id, unread_count")
        .eq("contact_id", contactId)
        .maybeSingle();

      if (existingConv) {
        conversationId = existingConv.id;
        await supabase
          .from("conversations")
          .update({
            last_message_at: receivedAt,
            unread_count: (existingConv.unread_count || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", conversationId);
      } else {
        const { data: newConv } = await supabase
          .from("conversations")
          .insert({
            contact_id: contactId,
            telnyx_number: toNumber,
            last_message_at: receivedAt,
            unread_count: 1,
          })
          .select("id")
          .single();

        conversationId = newConv?.id;
      }

      // 4. Insert Inbound Message
      if (conversationId) {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          provider_message_id: providerMsgId,
          direction: "inbound",
          from_number: fromNumber,
          to_number: toNumber,
          body: messageText,
          status: "delivered",
          received_at: receivedAt,
        });
      }

      // Mark webhook event processed
      await supabase
        .from("webhook_events")
        .update({ status: "processed", processed_at: new Date().toISOString() })
        .eq("provider_event_id", eventId);
    } else if (payload) {
      // Handle Outbound Delivery Status events (message.sent, message.delivered, message.finalized, message.failed)
      const providerMsgId = payload?.id;
      if (providerMsgId) {
        let newStatus = "sent";
        const recipientStatus = payload?.to?.[0]?.status;

        if (eventType === "message.delivered" || recipientStatus === "delivered") {
          newStatus = "delivered";
        } else if (
          eventType === "message.failed" ||
          eventType === "message.undelivered" ||
          recipientStatus === "delivery_failed" ||
          recipientStatus === "sending_failed"
        ) {
          newStatus = "failed";
        } else if (eventType === "message.sent" || recipientStatus === "sent") {
          newStatus = "sent";
        }

        const errorCode = payload?.errors?.[0]?.detail || payload?.errors?.[0]?.title || payload?.errors?.[0]?.code || null;

        const { data: currentMsg } = await supabase
          .from("messages")
          .select("id, status")
          .eq("provider_message_id", providerMsgId)
          .maybeSingle();

        if (currentMsg) {
          await supabase
            .from("messages")
            .update({
              status: newStatus,
              error_code: errorCode,
            })
            .eq("id", currentMsg.id);
        }
      }

      await supabase
        .from("webhook_events")
        .update({ status: "processed", processed_at: new Date().toISOString() })
        .eq("provider_event_id", eventId);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error in /api/webhooks/telnyx/messages:", error);
    return NextResponse.json({ received: true, error: error?.message }, { status: 200 });
  }
}
