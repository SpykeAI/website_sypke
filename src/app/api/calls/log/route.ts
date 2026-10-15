import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function extractDurationSeconds(summary: string | null): number | null {
  if (!summary) return null;
  const match = summary.match(/Duration:\s*(\d+)s/i);
  return match ? parseInt(match[1], 10) : null;
}

// GET recent call logs (Tries call_logs table, falls back to conversations table)
export async function GET() {
  try {
    // 1. Try call_logs table first
    const { data: callLogsData, error: callLogsErr } = await supabase
      .from("call_logs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(50);

    if (!callLogsErr && callLogsData) {
      return NextResponse.json({ ok: true, logs: callLogsData });
    }

    // 2. Fallback: Query conversations table where calls are logged
    const { data: convData, error: convErr } = await supabase
      .from("conversations")
      .select("*")
      .not("call_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(50);

    if (convErr || !convData) {
      return NextResponse.json({ ok: true, logs: [] });
    }

    const mappedLogs = convData.map((row: any) => ({
      id: row.id,
      from_number: row.telnyx_number || "+13464770028",
      to_number: row.phone || "Unknown",
      direction: row.contact_name?.toLowerCase().includes("inbound") ? "inbound" : "outbound",
      status: row.interest_level || "completed",
      started_at: row.created_at,
      ended_at: row.updated_at || null,
      duration_seconds: extractDurationSeconds(row.summary),
    }));

    return NextResponse.json({ ok: true, logs: mappedLogs });
  } catch (err: any) {
    console.error("GET /api/calls/log error:", err);
    return NextResponse.json({ ok: true, logs: [] });
  }
}

// POST create call log entry
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { from_number, to_number, direction, status, telnyx_call_control_id } = body;

    const fromNum = from_number || "+13464770028";
    const toNum = to_number || "unknown";
    const callDir = direction || "outbound";
    const callStatus = status || "dialing";

    // 1. Try call_logs table first
    const { data: callLog, error: callLogErr } = await supabase
      .from("call_logs")
      .insert({
        from_number: fromNum,
        to_number: toNum,
        direction: callDir,
        status: callStatus,
        telnyx_call_control_id: telnyx_call_control_id || null,
        started_at: new Date().toISOString(),
      })
      .select("id")
      .maybeSingle();

    if (!callLogErr && callLog?.id) {
      return NextResponse.json({ ok: true, logId: callLog.id });
    }

    // 2. Fallback: Persist in conversations table
    const { data: convLog, error: convErr } = await supabase
      .from("conversations")
      .insert({
        call_id: telnyx_call_control_id || `call_browser_${Date.now()}`,
        phone: toNum,
        telnyx_number: fromNum,
        contact_name: callDir === "outbound" ? `Outbound to ${toNum}` : `Inbound from ${fromNum}`,
        summary: `Status: ${callStatus} • Direction: ${callDir}`,
        interest_level: callStatus,
        last_message_at: new Date().toISOString(),
      })
      .select("id")
      .maybeSingle();

    const finalId = convLog?.id || `local-${Date.now()}`;
    return NextResponse.json({ ok: true, logId: finalId });
  } catch (err: any) {
    console.error("POST /api/calls/log error:", err);
    return NextResponse.json({ ok: true, logId: `local-${Date.now()}` });
  }
}

// PATCH update call log (ended_at, duration_seconds, status)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { logId, status, duration_seconds, error_summary } = body;

    if (!logId) {
      return NextResponse.json({ ok: true });
    }

    const duration = duration_seconds || 0;
    const finalStatus = status || "completed";

    // 1. Try updating call_logs table
    if (!logId.startsWith("local-") && !logId.startsWith("call_")) {
      const { data: clData, error: clErr } = await supabase
        .from("call_logs")
        .update({
          status: finalStatus,
          ended_at: new Date().toISOString(),
          duration_seconds: duration,
          error_summary: error_summary || null,
        })
        .eq("id", logId)
        .select()
        .maybeSingle();

      if (!clErr && clData) {
        return NextResponse.json({ ok: true, log: clData });
      }

      // 2. Fallback: Update conversations table
      const { data: convData } = await supabase
        .from("conversations")
        .update({
          summary: `Duration: ${duration}s • ${finalStatus}`,
          interest_level: finalStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", logId)
        .select()
        .maybeSingle();

      return NextResponse.json({ ok: true, log: convData });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("PATCH /api/calls/log error:", err);
    return NextResponse.json({ ok: true });
  }
}
