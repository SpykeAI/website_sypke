import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
      return NextResponse.json({ received: true });
    }

    const eventId = event?.id || `status_${Date.now()}`;
    const eventType = event?.event_type;
    const payload = event?.payload;
    const providerMsgId = payload?.id;

    if (!providerMsgId) {
      return NextResponse.json({ received: true });
    }

    // Deduplication
    const { data: existingEvent } = await supabase
      .from("webhook_events")
      .select("id")
      .eq("provider_event_id", eventId)
      .maybeSingle();

    if (existingEvent) {
      return NextResponse.json({ received: true, note: "Already processed" });
    }

    await supabase.from("webhook_events").insert({
      provider_event_id: eventId,
      event_type: eventType || "message.status",
      status: "processing",
    });

    // Map Telnyx status
    // Telnyx statuses: queued, sending, sent, delivered, sending_failed, delivery_failed
    let newStatus = "sent";
    if (eventType === "message.delivered") {
      newStatus = "delivered";
    } else if (eventType === "message.failed" || eventType === "message.undelivered") {
      newStatus = "failed";
    } else if (eventType === "message.sent") {
      newStatus = "sent";
    }

    // Fetch existing message status to avoid status regression
    const { data: currentMsg } = await supabase
      .from("messages")
      .select("id, status")
      .eq("provider_message_id", providerMsgId)
      .maybeSingle();

    if (currentMsg) {
      // Don't regress from delivered to sent
      if (currentMsg.status !== "delivered") {
        await supabase
          .from("messages")
          .update({
            status: newStatus,
            error_code: payload?.errors?.[0]?.code || null,
          })
          .eq("id", currentMsg.id);
      }
    }

    await supabase
      .from("webhook_events")
      .update({ status: "processed", processed_at: new Date().toISOString() })
      .eq("provider_event_id", eventId);

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error in /api/webhooks/telnyx/status:", error);
    return NextResponse.json({ received: true, error: error?.message }, { status: 200 });
  }
}
