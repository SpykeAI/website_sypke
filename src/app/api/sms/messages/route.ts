import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json({ ok: false, message: "conversationId is required" }, { status: 400 });
    }

    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    // Reset unread_count for this conversation
    await supabase
      .from("conversations")
      .update({ unread_count: 0 })
      .eq("id", conversationId);

    // Sanitize message body (strip hidden metadata comments) and provide first-class fields
    const sanitizedMessages = (messages || []).map((m) => {
      const matchCampaign = m.body?.match(/<!--bulk_campaign:(.*?)-->/);
      const matchSender = m.body?.match(/<!--sent_by:(.*?)-->/);
      const campaignName = matchCampaign ? matchCampaign[1].trim() : null;
      const senderName = matchSender ? matchSender[1].trim() : null;
      const cleanBody = m.body
        ? m.body
            .replace(/\n?<!--sent_by:(.*?)-->/g, "")
            .replace(/\n?<!--bulk_campaign:(.*?)-->/g, "")
            .trim()
        : "";

      return {
        ...m,
        body: cleanBody,
        campaign_name: campaignName,
        sender_name: senderName,
        raw_body: m.body,
      };
    });

    return NextResponse.json({ ok: true, messages: sanitizedMessages });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// DELETE an individual message
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let messageId = searchParams.get("messageId");

    if (!messageId) {
      try {
        const body = await req.json();
        messageId = body.messageId;
      } catch (e) {
        // no body
      }
    }

    if (!messageId) {
      return NextResponse.json({ ok: false, message: "messageId is required" }, { status: 400 });
    }

    const { error } = await supabase.from("messages").delete().eq("id", messageId);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Message deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
