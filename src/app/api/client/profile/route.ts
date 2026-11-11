import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

async function getCookieValue(req: NextRequest | Request, name: string): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const val = cookieStore.get(name)?.value;
    if (val) return val;
  } catch {
    // cookies() unavailable in certain test environments
  }

  if ("cookies" in req && typeof req.cookies?.get === "function") {
    const val = req.cookies.get(name)?.value;
    if (val) return val;
  }

  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getCookieValue(req, "admin_session");
    const portalEmail = await getCookieValue(req, "portal_email");
    const portalRole = await getCookieValue(req, "portal_role");

    // Strictly enforce session authentication
    if (!session || session !== "authenticated") {
      return NextResponse.json(
        { error: "Unauthorized. Please log in with your authorized external portal credentials." },
        { status: 401 }
      );
    }

    // Role check: Only external clients (or superadmin) can access client profile
    if (portalRole !== "external" && portalRole !== "superadmin") {
      return NextResponse.json(
        { error: "Access denied. Only external client accounts can access this profile." },
        { status: 403 }
      );
    }

    const targetEmail = (
      portalEmail ||
      (portalRole === "superadmin" ? "spykeai2026@gmail.com" : "external.client@spykeai.com")
    ).toLowerCase().trim();

    // Look up user in Supabase
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error("Failed to fetch user list for profile:", error);
      // Fallback gracefully rather than returning 500 error
      return NextResponse.json({
        success: true,
        profile: {
          name: targetEmail.split("@")[0],
          email: targetEmail,
          company_name: "",
          registered_address: "",
          ein: "",
          phone: "",
          role: portalRole === "superadmin" ? "Superadmin" : "Client",
          portal_type: "external",
          status: "active",
        },
      });
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
          role: portalRole === "superadmin" ? "Superadmin" : "Client",
          portal_type: "external",
          status: "active",
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

export async function POST(req: NextRequest) {
  return handleProfileUpdate(req);
}

export async function PATCH(req: NextRequest) {
  return handleProfileUpdate(req);
}

async function handleProfileUpdate(req: NextRequest) {
  try {
    const session = await getCookieValue(req, "admin_session");
    const portalEmail = await getCookieValue(req, "portal_email");
    const portalRole = await getCookieValue(req, "portal_role");

    if (!session || session !== "authenticated") {
      return NextResponse.json(
        { error: "Unauthorized. Please log in with your authorized external portal credentials." },
        { status: 401 }
      );
    }

    if (portalRole !== "external" && portalRole !== "superadmin") {
      return NextResponse.json(
        { error: "Access denied. Only external client accounts can modify this profile." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, company_name, registered_address, ein, phone } = body;

    const targetEmail = (portalEmail || (portalRole === "superadmin" ? "spykeai2026@gmail.com" : body.email || "")).toLowerCase().trim();

    if (!targetEmail) {
      return NextResponse.json(
        { error: "No authenticated client session found." },
        { status: 401 }
      );
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
