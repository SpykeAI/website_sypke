import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ ok: false, error: "Valid Google Sheet URL is required." }, { status: 400 });
    }

    // Extract spreadsheet ID
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match || !match[1]) {
      return NextResponse.json({
        ok: false,
        error: "Invalid Google Sheets URL. Please make sure the URL contains '/d/{SpreadsheetID}'."
      }, { status: 400 });
    }

    const sheetId = match[1];
    
    // Check if a specific gid (sheet tab) is present
    const gidMatch = url.match(/[#&?]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : "0";

    const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

    const res = await fetch(exportUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SpykeAI/1.0",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({
        ok: false,
        error: "Could not fetch Google Sheet. Please ensure the Google Sheet link sharing is set to 'Anyone with the link can view'."
      }, { status: 400 });
    }

    const csvText = await res.text();

    return NextResponse.json({
      ok: true,
      csv: csvText,
      sheetId,
    });
  } catch (err: any) {
    console.error("Error fetching Google Sheet:", err);
    return NextResponse.json({ ok: false, error: err.message || "Failed to fetch Google Sheet" }, { status: 500 });
  }
}
