import { supabase } from "@/lib/supabase";
import { SmsBatch } from "@/components/admin/BulkSmsManager";

const BUCKET_NAME = "site-data";
const BATCHES_FILE_NAME = "bulk_batches.json";

export const INITIAL_SERVER_BATCHES: SmsBatch[] = [
  {
    id: "batch-houston-1",
    batchName: "Batch-Houston-Evening-Outreach",
    fileName: "Houston_Numbers_Nov.xlsx",
    delaySeconds: 60,
    delayDisplay: "1m delay",
    status: "completed",
    scheduledFor: "2026-11-20T17:00",
    scheduledTimezone: "America/Chicago",
    scheduledDisplay: "Nov 20, 2026 at 5:00 PM (CT)",
    createdAt: "Nov 20, 01:20 PM",
    senderNumber: "+13464770028",
    messageTemplate: "Hi {name}, our Houston service fleet is in your area this evening. Reply YES for priority dispatch.",
    totalRecipients: 2,
    sentCount: 2,
    deliveredCount: 2,
    failedCount: 0,
    recipients: [
      { phone: "+17135550111", name: "David Miller", company: "Houston Energy Works", status: "delivered" },
      { phone: "+17135550222", name: "Elena Gomez", company: "Lone Star Logistics", status: "delivered" }
    ]
  },
  {
    id: "batch-1",
    batchName: "Batch-Tampa-1",
    fileName: "Tampa_HVAC_Leads_Nov.xlsx",
    delaySeconds: 1,
    delayDisplay: "1s delay",
    status: "completed",
    createdAt: "Nov 21, 10:45 AM",
    senderNumber: "+13464770028",
    messageTemplate: "Hi {name}, our certified technicians are in Tampa this week for HVAC safety checks. Reply YES to book your slot!",
    totalRecipients: 45,
    sentCount: 45,
    deliveredCount: 44,
    failedCount: 1,
    recipients: [
      { phone: "+18135550192", name: "Marcus Vance", company: "Tampa HVAC Solutions", status: "delivered", sentAt: "10:45 AM" },
      { phone: "+18135550144", name: "Sarah Jenkins", company: "Bay Area Cooling", status: "delivered", sentAt: "10:46 AM" },
      { phone: "+17275550188", name: "Carlos Mendez", company: "Clearwater Refrigeration", status: "delivered", sentAt: "10:47 AM" }
    ]
  },
  {
    id: "batch-2",
    batchName: "Batch-Dallas-HVAC-TuneUp",
    fileName: "Dallas_Commercial_Leads.csv",
    delaySeconds: 5,
    delayDisplay: "5s delay",
    status: "completed",
    createdAt: "Nov 21, 03:30 PM",
    senderNumber: "+13464770028",
    messageTemplate: "Hello {name}, did you schedule your seasonal commercial HVAC tune-up? Get 20% off before the heatwave hits.",
    totalRecipients: 120,
    sentCount: 120,
    deliveredCount: 116,
    failedCount: 4,
    recipients: []
  },
  {
    id: "batch-3",
    batchName: "Austin-Emergency-Leads",
    fileName: "Austin_Emergency_Accounts.xlsx",
    delaySeconds: 60,
    delayDisplay: "1m delay",
    status: "completed",
    createdAt: "Nov 16, 11:00 AM",
    senderNumber: "+13464770028",
    messageTemplate: "Hi {name}, Spyke AI 24/7 emergency dispatch line is now live in Austin. Test our AI voice agent at spykeai.com",
    totalRecipients: 25,
    sentCount: 25,
    deliveredCount: 24,
    failedCount: 1,
    recipients: []
  }
];

export async function getBulkBatches(): Promise<SmsBatch[]> {
  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(BATCHES_FILE_NAME);
    if (error || !data) {
      // Seed default batches to cloud storage
      await saveBulkBatches(INITIAL_SERVER_BATCHES);
      return INITIAL_SERVER_BATCHES;
    }
    const text = await data.text();
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed as SmsBatch[];
    }
    return INITIAL_SERVER_BATCHES;
  } catch (err) {
    console.error("Error reading bulk batches from Supabase storage:", err);
    return INITIAL_SERVER_BATCHES;
  }
}

export async function saveBulkBatches(batches: SmsBatch[]): Promise<boolean> {
  try {
    const content = JSON.stringify(batches, null, 2);
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(BATCHES_FILE_NAME, content, {
        upsert: true,
        contentType: "application/json",
      });
    if (error) {
      console.error("Error saving bulk batches to Supabase storage:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to save bulk batches:", err);
    return false;
  }
}

export async function upsertBulkBatch(batch: SmsBatch): Promise<{ success: boolean; batches: SmsBatch[] }> {
  const currentBatches = await getBulkBatches();
  const index = currentBatches.findIndex((b) => b.id === batch.id);
  let updated: SmsBatch[];
  if (index >= 0) {
    updated = [...currentBatches];
    updated[index] = { ...updated[index], ...batch };
  } else {
    updated = [batch, ...currentBatches];
  }
  const ok = await saveBulkBatches(updated);
  return { success: ok, batches: updated };
}

export async function deleteBulkBatch(id: string): Promise<{ success: boolean; batches: SmsBatch[] }> {
  const currentBatches = await getBulkBatches();
  const updated = currentBatches.filter((b) => b.id !== id);
  const ok = await saveBulkBatches(updated);
  return { success: ok, batches: updated };
}
