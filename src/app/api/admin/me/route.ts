import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;
    const portalRole = cookieStore.get("portal_role")?.value || "superadmin";
    const portalEmail = cookieStore.get("portal_email")?.value;

    if (!sessionCookie || sessionCookie !== "authenticated") {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    // 1. Superadmin master session
    if (
      portalRole === "superadmin" ||
      portalEmail === "spykeai2026@gmail.com" ||
      portalEmail === "spykeai-admin" ||
      portalEmail === "admin"
    ) {
      return NextResponse.json({
        ok: true,
        user: {
          id: "superadmin-master",
          email: "spykeai2026@gmail.com",
          display_name: "Spyke super admin",
          role: "Super Admin",
          portal_type: "superadmin",
        },
      });
    }

    // 2. Internal / External user session
    if (portalEmail) {
      const { data: allUsers } = await supabase.auth.admin.listUsers();
      const matched = allUsers?.users?.find(
        (u) => u.email?.toLowerCase() === portalEmail.toLowerCase()
      );

      if (matched) {
        const meta = matched.user_metadata || {};
        const displayName = meta.display_name || meta.username || matched.email?.split("@")[0] || "Team Member";
        const role = meta.role || (meta.portal_type === "internal" ? "Agent" : "Client");
        const portalType = meta.portal_type || portalRole;

        return NextResponse.json({
          ok: true,
          user: {
            id: matched.id,
            email: matched.email,
            display_name: displayName,
            role: role,
            portal_type: portalType,
          },
        });
      }
    }

    // Fallback if portal email not found
    return NextResponse.json({
      ok: true,
      user: {
        id: "team-member",
        email: portalEmail || "agent@spykeai.com",
        display_name: portalRole === "internal" ? "Internal Agent" : "Portal User",
        role: portalRole === "internal" ? "Agent" : "User",
        portal_type: portalRole,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
