import { NextResponse } from "next/server";
import { processBackgroundBulkDispatch } from "@/lib/bulkDispatcher";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 60; // Allow full 60 seconds execution on Vercel

// GET: Triggered automatically by Vercel Cron every minute
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const targetBatchId = url.searchParams.get("batchId") || undefined;
    const limit = url.searchParams.get("limit") ? parseInt(url.searchParams.get("limit")!, 10) : 15;

    const result = await processBackgroundBulkDispatch({
      targetBatchId,
      maxMessagesToProcess: limit,
    });

    return NextResponse.json({
      ok: result.ok,
      dispatched: result.dispatchedCount,
      batches: result.batchesSummary,
      error: result.error,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("GET /api/cron/bulk-dispatch error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Cron dispatch failed" },
      { status: 500 }
    );
  }
}

// POST: Triggered on-demand when user launches or resumes a campaign
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetBatchId = body.batchId || body.targetBatchId || undefined;
    const limit = body.limit ? parseInt(body.limit, 10) : 20;

    const result = await processBackgroundBulkDispatch({
      targetBatchId,
      maxMessagesToProcess: limit,
    });

    return NextResponse.json({
      ok: result.ok,
      dispatched: result.dispatchedCount,
      batches: result.batchesSummary,
      error: result.error,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("POST /api/cron/bulk-dispatch error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Triggered dispatch failed" },
      { status: 500 }
    );
  }
}
