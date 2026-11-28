import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;
    const portalRole = cookieStore.get("portal_role")?.value || "superadmin";

    // Superadmin guard
    if (!sessionCookie || sessionCookie !== "authenticated" || portalRole !== "superadmin") {
      return NextResponse.json({ ok: false, error: "Unauthorized. Superadmin only." }, { status: 401 });
    }

    const telnyxApiKey = process.env.TELNYX_API_KEY?.replace(/^["']|["']$/g, "");

    if (!telnyxApiKey) {
      return NextResponse.json({ ok: false, error: "TELNYX_API_KEY missing in environment" }, { status: 500 });
    }

    const headers = {
      Authorization: `Bearer ${telnyxApiKey}`,
      Accept: "application/json",
    };

    // Parallel fetch for voice (SIP trunking) and SMS (Message detail records)
    const [voiceRes, smsRes] = await Promise.all([
      fetch("https://api.telnyx.com/v2/detail_records?filter[record_type]=sip-trunking&page[size]=100", {
        headers,
        cache: "no-store",
      }),
      fetch("https://api.telnyx.com/v2/detail_records?filter[record_type]=message_detail_record&page[size]=100", {
        headers,
        cache: "no-store",
      }),
    ]);

    const voiceJson = voiceRes.ok ? await voiceRes.json() : { data: [] };
    const smsJson = smsRes.ok ? await smsRes.json() : { data: [] };

    const voiceRecords: any[] = voiceJson?.data || [];
    const smsRecords: any[] = smsJson?.data || [];

    // Aggregate by day (YYYY-MM-DD)
    const dailyMap: Record<
      string,
      {
        date: string;
        calls: number;
        callSeconds: number;
        callMinutes: number;
        callCost: number;
        sms: number;
        smsCost: number;
        totalCost: number;
      }
    > = {};

    let totalVoiceSec = 0;
    let totalVoiceCost = 0;
    let totalVoiceCalls = 0;

    for (const v of voiceRecords) {
      const rawDate = v.started_at || v.created_at;
      if (!rawDate) continue;
      const dayKey = rawDate.substring(0, 10);

      const sec = parseInt(v.call_sec || v.billed_sec || "0", 10) || 0;
      const cost = parseFloat(v.cost || "0") || 0;

      totalVoiceCalls += 1;
      totalVoiceSec += sec;
      totalVoiceCost += cost;

      if (!dailyMap[dayKey]) {
        dailyMap[dayKey] = {
          date: dayKey,
          calls: 0,
          callSeconds: 0,
          callMinutes: 0,
          callCost: 0,
          sms: 0,
          smsCost: 0,
          totalCost: 0,
        };
      }

      dailyMap[dayKey].calls += 1;
      dailyMap[dayKey].callSeconds += sec;
      dailyMap[dayKey].callCost += cost;
    }

    let totalSmsCount = 0;
    let totalSmsCost = 0;

    for (const s of smsRecords) {
      const rawDate = s.created_at || s.sent_at;
      if (!rawDate) continue;
      const dayKey = rawDate.substring(0, 10);

      const cost = parseFloat(s.cost || "0") || 0;

      totalSmsCount += 1;
      totalSmsCost += cost;

      if (!dailyMap[dayKey]) {
        dailyMap[dayKey] = {
          date: dayKey,
          calls: 0,
          callSeconds: 0,
          callMinutes: 0,
          callCost: 0,
          sms: 0,
          smsCost: 0,
          totalCost: 0,
        };
      }

      dailyMap[dayKey].sms += 1;
      dailyMap[dayKey].smsCost += cost;
    }

    // Compute call minutes & total cost for each day
    const dailyBreakdown = Object.values(dailyMap)
      .map((item) => ({
        ...item,
        callMinutes: parseFloat((item.callSeconds / 60).toFixed(1)),
        callCost: parseFloat(item.callCost.toFixed(4)),
        smsCost: parseFloat(item.smsCost.toFixed(4)),
        totalCost: parseFloat((item.callCost + item.smsCost).toFixed(4)),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    // Recent individual activity (most recent 10 events combined)
    const recentActivity = [
      ...voiceRecords.slice(0, 8).map((v) => ({
        id: v.id,
        kind: "voice" as const,
        time: v.started_at || v.created_at,
        direction: v.direction || "outbound",
        destination: v.dest_number || v.cld || v.cli || "Unknown",
        durationSec: parseInt(v.call_sec || v.billed_sec || "0", 10) || 0,
        cost: parseFloat(v.cost || "0") || 0,
        status: v.hangup_cause || "completed",
        carrier: v.connection_name || "Telnyx SIP",
      })),
      ...smsRecords.slice(0, 8).map((s) => ({
        id: s.id,
        kind: "sms" as const,
        time: s.created_at || s.sent_at,
        direction: s.direction || "outbound",
        destination: s.cld || s.cli || "Unknown",
        durationSec: 0,
        cost: parseFloat(s.cost || "0") || 0,
        status: s.status || "delivered",
        carrier: s.carrier || "SMS",
      })),
    ]
      .sort((a, b) => (b.time || "").localeCompare(a.time || ""))
      .slice(0, 10);

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalCalls: totalVoiceCalls,
        totalMinutes: parseFloat((totalVoiceSec / 60).toFixed(1)),
        totalVoiceCost: parseFloat(totalVoiceCost.toFixed(4)),
        totalSms: totalSmsCount,
        totalSmsCost: parseFloat(totalSmsCost.toFixed(4)),
        grandTotalCost: parseFloat((totalVoiceCost + totalSmsCost).toFixed(4)),
      },
      dailyBreakdown,
      recentActivity,
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
