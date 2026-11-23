import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getBulkBatches, saveBulkBatches, upsertBulkBatch, deleteBulkBatch } from "@/lib/bulkStorage";
import { SmsBatch } from "@/components/admin/BulkSmsManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: Return all shared bulk batches across all users
export async function GET() {
  try {
    const batches = await getBulkBatches();
    return NextResponse.json({ ok: true, batches });
  } catch (error: any) {
    console.error("GET /api/sms/bulk/batches error:", error);
    return NextResponse.json({ ok: false, error: error?.message || "Failed to load batches" }, { status: 500 });
  }
}

// POST: Save or upsert shared bulk batches (drafts, scheduled, in-progress, completed)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Batch replacement or bulk sync
    if (body.batches && Array.isArray(body.batches)) {
      const ok = await saveBulkBatches(body.batches as SmsBatch[]);
      return NextResponse.json({ ok, batches: body.batches });
    }

    // Single batch upsert
    if (body.batch && body.batch.id) {
      const { success, batches } = await upsertBulkBatch(body.batch as SmsBatch);
      return NextResponse.json({ ok: success, batches });
    }

    return NextResponse.json({ ok: false, error: "Invalid payload: 'batch' or 'batches' required" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/sms/bulk/batches error:", error);
    return NextResponse.json({ ok: false, error: error?.message || "Failed to save batches" }, { status: 500 });
  }
}

// DELETE: Delete a batch from history (RESTRICTED TO SUPER ADMIN ONLY)
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const portalRole = cookieStore.get("portal_role")?.value;
    const adminSession = cookieStore.get("admin_session")?.value;

    // Only allow superadmin to delete batches
    if (portalRole !== "superadmin" && !adminSession) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized: Only Superadmin can delete bulk campaign batches." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, error: "Batch ID is required" }, { status: 400 });
    }

    const { success, batches } = await deleteBulkBatch(id);
    return NextResponse.json({ ok: success, batches });
  } catch (error: any) {
    console.error("DELETE /api/sms/bulk/batches error:", error);
    return NextResponse.json({ ok: false, error: error?.message || "Failed to delete batch" }, { status: 500 });
  }
}
