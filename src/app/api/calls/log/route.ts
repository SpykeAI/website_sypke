import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function extractDurationSeconds(summary: string | null): number | null {
  if (!summary) return null;
  const match = summary.match(/Duration:\s*(\d+)s/i);
  return match ? parseInt(match[1], 10) : null;
}

// GET recent call logs (Fetches real carrier WebRTC records from Telnyx, then merges with Supabase)
export async function GET() {
  try {
    const allLogs: any[] = [];
    const seenIds = new Set<string>();

    const telnyxApiKey = process.env.TELNYX_API_KEY;
    let telnyxDebug: any = {
      hasKey: !!telnyxApiKey,
      keyPrefix: telnyxApiKey ? telnyxApiKey.slice(0, 7) : null,
    };

    if (telnyxApiKey) {
      try {
        const cleanKey = telnyxApiKey.trim();
        const telnyxRes = await fetch(
          "https://api.telnyx.com/v2/detail_records?filter[record_type]=webrtc&page[size]=50",
          {
            headers: {
              Authorization: `Bearer ${cleanKey}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        telnyxDebug.status = telnyxRes.status;

        if (telnyxRes.ok) {
          const telnyxData = await telnyxRes.json();
          telnyxDebug.rawCount = telnyxData?.data?.length;
          if (Array.isArray(telnyxData.data)) {
            for (const r of telnyxData.data) {
              const id = r.id || r.call_id || r.telnyx_leg_id;
              if (id && !seenIds.has(id)) {
                seenIds.add(id);
                const duration = r.call_sec || (r.billed_sec && r.billed_sec > 0 ? r.billed_sec : 0);
                allLogs.push({
                  id,
                  from_number: r.caller_number || r.cli || "+13464770028",
                  to_number: r.dest_number || r.cld || "Unknown",
                  direction: r.direction || "outbound",
                  status:
                    r.completed === 1
                      ? "completed"
                      : r.connected === 1
                      ? "connected"
                      : "no_answer",
                  started_at: r.started_at,
                  ended_at: r.finished_at || null,
                  duration_seconds: duration,
                });
              }
            }
          }
        } else {
          telnyxDebug.errorText = await telnyxRes.text();
          console.error("Telnyx detail_records error:", telnyxRes.status, telnyxDebug.errorText);
        }
      } catch (telnyxErr: any) {
        telnyxDebug.exception = telnyxErr?.message || String(telnyxErr);
        console.error("Failed to query Telnyx detail_records:", telnyxErr);
      }
    }

    // 2. Fetch from Supabase call_logs table if available
    try {
      const { data: callLogsData, error: callLogsErr } = await supabase
        .from("call_logs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(50);

      if (!callLogsErr && Array.isArray(callLogsData)) {
        for (const cl of callLogsData) {
          if (!seenIds.has(cl.id)) {
            seenIds.add(cl.id);
            allLogs.push(cl);
          }
        }
      }
    } catch (e) {
      // ignore
    }

    // 3. Fallback: Query Supabase conversations table where call_id is stored
    try {
      const { data: convData } = await supabase
        .from("conversations")
        .select("*")
        .not("call_id", "is", null)
        .order("created_at", { ascending: false })
        .limit(50);

      if (Array.isArray(convData)) {
        for (const row of convData) {
          if (!seenIds.has(row.id)) {
            seenIds.add(row.id);
            allLogs.push({
              id: row.id,
              from_number: row.telnyx_number || "+13464770028",
              to_number: row.phone || "Unknown",
              direction: row.contact_name?.toLowerCase().includes("inbound") ? "inbound" : "outbound",
              status: row.interest_level || "completed",
              started_at: row.created_at,
              ended_at: row.updated_at || null,
              duration_seconds: extractDurationSeconds(row.summary),
            });
          }
        }
      }
    } catch (e) {
      // ignore
    }

    // Sort newest calls first
    allLogs.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());

    return NextResponse.json(
      { ok: true, logs: allLogs, debug: telnyxDebug },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
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
    const { data: convLog } = await supabase
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
