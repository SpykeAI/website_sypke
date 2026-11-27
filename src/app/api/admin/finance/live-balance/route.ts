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

    const telnyxApiKey = process.env.TELNYX_API_KEY;

    let telnyxData = {
      connected: false,
      balance: 0,
      currency: "USD",
      available_credit: 0,
      credit_limit: 0,
      error: null as string | null,
    };

    if (telnyxApiKey) {
      try {
        const telnyxRes = await fetch("https://api.telnyx.com/v2/balance", {
          headers: {
            Authorization: `Bearer ${telnyxApiKey.replace(/^["']|["']$/g, "")}`,
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (telnyxRes.ok) {
          const json = await telnyxRes.json();
          const d = json?.data;
          telnyxData = {
            connected: true,
            balance: parseFloat(d?.balance || "0"),
            currency: d?.currency || "USD",
            available_credit: parseFloat(d?.available_credit || "0"),
            credit_limit: parseFloat(d?.credit_limit || "0"),
            error: null,
          };
        } else {
          telnyxData.error = `Telnyx API error (${telnyxRes.status})`;
        }
      } catch (err: any) {
        telnyxData.error = err.message || "Failed to reach Telnyx API";
      }
    } else {
      telnyxData.error = "TELNYX_API_KEY missing in server environment";
    }

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      providers: {
        telnyx: telnyxData,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
