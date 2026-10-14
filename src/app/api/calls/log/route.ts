import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET recent call logs
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("call_logs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(50);

    if (error) {
      // Table pending creation in Supabase
      return NextResponse.json({ ok: true, logs: [] });
    }
    return NextResponse.json({ ok: true, logs: data || [] });
  } catch (err: any) {
    return NextResponse.json({ ok: true, logs: [] });
  }
}

// POST create call log entry
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { from_number, to_number, direction, status, telnyx_call_control_id } = body;

    const { data, error } = await supabase
      .from("call_logs")
      .insert({
        from_number: from_number || "unknown",
        to_number: to_number || "unknown",
        direction: direction || "outbound",
        status: status || "initiated",
        telnyx_call_control_id: telnyx_call_control_id || null,
        started_at: new Date().toISOString(),
      })
      .select("id")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ ok: true, logId: "local-" + Date.now() });
    }
    return NextResponse.json({ ok: true, logId: data?.id || "local-" + Date.now() });
  } catch (err: any) {
    return NextResponse.json({ ok: true, logId: "local-" + Date.now() });
  }
}

// PATCH update call log (ended_at, duration_seconds, status)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { logId, status, duration_seconds, error_summary } = body;

    if (!logId || logId.startsWith("local-")) {
      return NextResponse.json({ ok: true });
    }

    const { data, error } = await supabase
      .from("call_logs")
      .update({
        status: status || "completed",
        ended_at: new Date().toISOString(),
        duration_seconds: duration_seconds || 0,
        error_summary: error_summary || null,
      })
      .eq("id", logId)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: true, log: data });
  } catch (err: any) {
    return NextResponse.json({ ok: true });
  }
}
