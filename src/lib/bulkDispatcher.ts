import { supabase } from "@/lib/supabase";
import { normalizeToE164, sendTelnyxSms } from "@/lib/telnyx";
import { getBulkBatches, saveBulkBatches, isScheduledTimeDue } from "@/lib/bulkStorage";
import { SmsBatch } from "@/components/admin/BulkSmsManager";

export interface DispatchResult {
  ok: boolean;
  dispatchedCount: number;
  batchesSummary: Array<{
    id: string;
    name: string;
    status: string;
    delivered: number;
    failed: number;
    total: number;
  }>;
  error?: string;
}

/**
 * Server-Side Autonomous Bulk Dispatcher
 * Can be run via Vercel Cron or called directly from server route.
 * Dispatches batches in the cloud without requiring any browser tab to stay open.
 */
export async function processBackgroundBulkDispatch(options?: {
  targetBatchId?: string;
  maxMessagesToProcess?: number;
}): Promise<DispatchResult> {
  try {
    const batches: SmsBatch[] = await getBulkBatches();
    const maxLimit = options?.maxMessagesToProcess || 15;
    let totalDispatched = 0;
    let modified = false;

    for (const batch of batches) {
      // If a specific batch is targeted, ignore other batches
      if (options?.targetBatchId && batch.id !== options.targetBatchId) {
        continue;
      }

      // 1. Activate scheduled batches when their time has arrived
      if (batch.status === "scheduled") {
        if (batch.scheduledFor && isScheduledTimeDue(batch.scheduledFor, batch.scheduledTimezone)) {
          batch.status = "in_progress";
          modified = true;
        } else {
          continue;
        }
      }

      // 2. Process active in-progress batches
      if (batch.status === "in_progress") {
        const pendingRecipients = batch.recipients.filter(
          (r) => r.status === "pending" || r.status === "sending"
        );

        if (pendingRecipients.length === 0) {
          batch.status = "completed";
          modified = true;
          continue;
        }

        const remainingLimit = maxLimit - totalDispatched;
        if (remainingLimit <= 0) break;

        const chunk = pendingRecipients.slice(0, remainingLimit);

        for (const recipient of chunk) {
          recipient.status = "sending";

          // Personalize message template
          let text = recipient.customMessage || batch.messageTemplate;
          text = text.replace(/\{name\}/gi, recipient.name || "there");
          text = text.replace(/\{phone\}/gi, recipient.phone);
          text = text.replace(/\{company\}/gi, recipient.company || "your business");

          const normalizedTo = normalizeToE164(recipient.phone);
          const senderFrom = (batch.senderNumber || process.env.TELNYX_FROM_NUMBER || "+13464770028").replace(/^["']|["']$/g, "").trim();
          const senderAttribution = batch.uploadedBy || "Spyke AI Cloud Dispatcher";
          const storedBody = `${text.trim()}\n<!--sent_by:${senderAttribution}-->`;

          try {
            // Check opt-out status
            const { data: contactData } = await supabase
              .from("contacts")
              .select("id, do_not_text")
              .eq("phone_e164", normalizedTo)
              .maybeSingle();

            if (contactData && contactData.do_not_text) {
              recipient.status = "failed";
              recipient.error = "Recipient opted out (do-not-text)";
              batch.sentCount = (batch.sentCount || 0) + 1;
              batch.failedCount = (batch.failedCount || 0) + 1;
              totalDispatched++;
              modified = true;
              continue;
            }

            // Sync contact & conversation in Supabase for 2-way inbox tracking
            let contactId = contactData?.id;
            if (!contactId) {
              const { data: newC } = await supabase
                .from("contacts")
                .insert({
                  phone_e164: normalizedTo,
                  display_name: recipient.name || normalizedTo,
                  do_not_text: false,
                })
                .select("id")
                .maybeSingle();
              contactId = newC?.id;
            }

            let convId: string | undefined;
            if (contactId) {
              const { data: existingConv } = await supabase
                .from("conversations")
                .select("id")
                .eq("contact_id", contactId)
                .maybeSingle();
              if (existingConv) {
                convId = existingConv.id;
              } else {
                const { data: newConv } = await supabase
                  .from("conversations")
                  .insert({
                    contact_id: contactId,
                    telnyx_number: senderFrom,
                    last_message_at: new Date().toISOString(),
                    unread_count: 0,
                  })
                  .select("id")
                  .maybeSingle();
                convId = newConv?.id;
              }
            }

            let msgId: string | undefined;
            if (convId) {
              const { data: pendingMsg } = await supabase
                .from("messages")
                .insert({
                  conversation_id: convId,
                  direction: "outbound",
                  from_number: senderFrom,
                  to_number: normalizedTo,
                  body: storedBody,
                  status: "pending",
                })
                .select("id")
                .maybeSingle();
              msgId = pendingMsg?.id;
            }

            // Dispatch message via Telnyx
            const res = await sendTelnyxSms({
              to: normalizedTo,
              text: text.trim(),
              from: senderFrom,
            });

            if (res.ok) {
              recipient.status = "delivered";
              recipient.sentAt = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              batch.sentCount = (batch.sentCount || 0) + 1;
              batch.deliveredCount = (batch.deliveredCount || 0) + 1;

              if (msgId) {
                await supabase
                  .from("messages")
                  .update({
                    status: "accepted",
                    sent_at: new Date().toISOString(),
                    provider_message_id: res.messageId,
                  })
                  .eq("id", msgId);
              }
              if (convId) {
                await supabase
                  .from("conversations")
                  .update({ last_message_at: new Date().toISOString() })
                  .eq("id", convId);
              }
            } else {
              recipient.status = "failed";
              recipient.error = res.error || "Carrier send error";
              batch.sentCount = (batch.sentCount || 0) + 1;
              batch.failedCount = (batch.failedCount || 0) + 1;

              if (msgId) {
                await supabase
                  .from("messages")
                  .update({
                    status: "failed",
                    error_code: res.error || "TELNYX_ERROR",
                  })
                  .eq("id", msgId);
              }
            }
          } catch (err: any) {
            recipient.status = "failed";
            recipient.error = err?.message || "Server dispatch error";
            batch.sentCount = (batch.sentCount || 0) + 1;
            batch.failedCount = (batch.failedCount || 0) + 1;
          }

          totalDispatched++;
          modified = true;

          // Safe spacing delay between messages (1-3 seconds)
          const delayWait = Math.min(Math.max(1, batch.delaySeconds || 3), 4);
          if (delayWait > 0) {
            await new Promise((r) => setTimeout(r, delayWait * 1000));
          }

          if (totalDispatched >= maxLimit) break;
        }

        // Check if all recipients for this batch have finished
        const stillPending = batch.recipients.some(
          (r) => r.status === "pending" || r.status === "sending"
        );
        if (!stillPending) {
          batch.status = "completed";
          modified = true;
        }

        if (totalDispatched >= maxLimit) break;
      }
    }

    if (modified) {
      await saveBulkBatches(batches);
    }

    return {
      ok: true,
      dispatchedCount: totalDispatched,
      batchesSummary: batches.map((b) => ({
        id: b.id,
        name: b.batchName,
        status: b.status,
        delivered: b.deliveredCount || 0,
        failed: b.failedCount || 0,
        total: b.totalRecipients || 0,
      })),
    };
  } catch (err: any) {
    console.error("Error in processBackgroundBulkDispatch:", err);
    return {
      ok: false,
      dispatchedCount: 0,
      batchesSummary: [],
      error: err?.message || "Unknown background dispatch error",
    };
  }
}
