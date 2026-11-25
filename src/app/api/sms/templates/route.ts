import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getGlobalTemplates,
  saveGlobalTemplates,
  upsertGlobalTemplate,
  deleteGlobalTemplate,
  SmsTemplate,
} from "@/lib/templateStorage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: Return all shared SMS templates across all users and portals
export async function GET() {
  try {
    const templates = await getGlobalTemplates();
    return NextResponse.json({ ok: true, templates });
  } catch (error: any) {
    console.error("GET /api/sms/templates error:", error);
    return NextResponse.json({ ok: false, error: error?.message || "Failed to load templates" }, { status: 500 });
  }
}

// POST: Save or upsert a shared SMS template (accessible to all portals)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Determine current user name for author attribution
    let currentAuthor = (body.createdBy || body.template?.createdBy || "").trim();
    if (!currentAuthor) {
      try {
        const cookieStore = await cookies();
        const cookieUser =
          cookieStore.get("portal_user_name")?.value ||
          cookieStore.get("admin_user")?.value ||
          cookieStore.get("portal_name")?.value;
        if (cookieUser) {
          currentAuthor = decodeURIComponent(cookieUser).trim();
        } else {
          const role = cookieStore.get("portal_role")?.value;
          currentAuthor = role === "superadmin" ? "Super Admin" : "Portal User";
        }
      } catch {}
    }

    // 1. Bulk replace templates if array provided
    if (body.templates && Array.isArray(body.templates)) {
      const ok = await saveGlobalTemplates(body.templates as SmsTemplate[]);
      return NextResponse.json({ ok, templates: body.templates });
    }

    // 2. Single template upsert
    if (body.template && body.template.id) {
      const templateToSave: SmsTemplate = {
        ...body.template,
        createdBy: body.template.createdBy || currentAuthor || "Super Admin",
        updatedAt: body.template.updatedAt || "Just now",
      };
      const { success, templates } = await upsertGlobalTemplate(templateToSave);
      return NextResponse.json({ ok: success, templates });
    }

    return NextResponse.json(
      { ok: false, error: "Invalid payload: 'template' or 'templates' required" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("POST /api/sms/templates error:", error);
    return NextResponse.json({ ok: false, error: error?.message || "Failed to save template" }, { status: 500 });
  }
}

// DELETE: Remove a shared SMS template
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, error: "Template ID is required" }, { status: 400 });
    }

    const { success, templates } = await deleteGlobalTemplate(id);
    return NextResponse.json({ ok: success, templates });
  } catch (error: any) {
    console.error("DELETE /api/sms/templates error:", error);
    return NextResponse.json({ ok: false, error: error?.message || "Failed to delete template" }, { status: 500 });
  }
}
