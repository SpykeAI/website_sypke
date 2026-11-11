import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function getCookieValue(req: Request, name: string): string | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function GET(req: Request) {
  try {
    const portalEmail = getCookieValue(req, "portal_email");
    const portalRole = getCookieValue(req, "portal_role");

    const targetEmail = portalEmail?.toLowerCase().trim() || "";

    if (!targetEmail) {
      return NextResponse.json({
        success: true,
        profile: {
          name: "",
          email: "",
          company_name: "",
          registered_address: "",
          ein: "",
          phone: "",
          role: portalRole || "Client",
          portal_type: "external",
        },
      });
    }

    // Look up user in Supabase
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error("Failed to fetch user list for profile:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const matchedUser = data?.users?.find(
      (u) => u.email?.toLowerCase() === targetEmail || u.user_metadata?.username?.toLowerCase() === targetEmail
    );

    if (!matchedUser) {
      return NextResponse.json({
        success: true,
        profile: {
          name: targetEmail.split("@")[0],
          email: targetEmail,
          company_name: "",
          registered_address: "",
          ein: "",
          phone: "",
          role: portalRole || "Client",
          portal_type: "external",
        },
      });
    }

    const meta = matchedUser.user_metadata || {};

    return NextResponse.json({
      success: true,
      profile: {
        id: matchedUser.id,
        name: meta.display_name || meta.name || matchedUser.email?.split("@")[0] || "",
        email: matchedUser.email || "",
        company_name: meta.company_name || "",
        registered_address: meta.registered_address || "",
        ein: meta.ein || "",
        phone: meta.phone || "",
        role: meta.role || "Client",
        portal_type: meta.portal_type || "external",
        status: meta.status || "active",
        created_at: matchedUser.created_at,
      },
    });
  } catch (error: any) {
    console.error("GET /api/client/profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return handleProfileUpdate(req);
}

export async function PATCH(req: Request) {
  return handleProfileUpdate(req);
}

async function handleProfileUpdate(req: Request) {
  try {
    const portalEmail = getCookieValue(req, "portal_email");
    const body = await req.json();
    const { name, company_name, registered_address, ein, phone } = body;

    const targetEmail = portalEmail?.toLowerCase().trim() || body.email?.toLowerCase().trim() || "";

    if (!targetEmail) {
      return NextResponse.json({ error: "No authenticated client session found." }, { status: 401 });
    }

    // Locate user in Supabase
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    const matchedUser = usersData?.users?.find(
      (u) => u.email?.toLowerCase() === targetEmail || u.user_metadata?.username?.toLowerCase() === targetEmail
    );

    if (!matchedUser) {
      return NextResponse.json({ error: "Client account not found." }, { status: 404 });
    }

    const existingMeta = matchedUser.user_metadata || {};
    const updatedMeta: any = {
      ...existingMeta,
      display_name: name !== undefined ? name.trim() : existingMeta.display_name,
      company_name: company_name !== undefined ? company_name.trim() : existingMeta.company_name,
      registered_address: registered_address !== undefined ? registered_address.trim() : existingMeta.registered_address,
      ein: ein !== undefined ? ein.trim() : existingMeta.ein,
      phone: phone !== undefined ? phone.trim() : existingMeta.phone,
    };

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      matchedUser.id,
      { user_metadata: updatedMeta }
    );

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Client profile and business details updated successfully.",
      profile: {
        id: matchedUser.id,
        name: updatedMeta.display_name,
        email: matchedUser.email,
        company_name: updatedMeta.company_name,
        registered_address: updatedMeta.registered_address,
        ein: updatedMeta.ein,
        phone: updatedMeta.phone,
        role: updatedMeta.role,
        portal_type: updatedMeta.portal_type,
        status: updatedMeta.status,
      },
    });
  } catch (error: any) {
    console.error("POST/PATCH /api/client/profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
