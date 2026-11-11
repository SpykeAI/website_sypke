import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const normalizedInput = (email || "").trim().toLowerCase();
    const inputPassword = (password || "").trim();

    if (!normalizedInput || !inputPassword) {
      return NextResponse.json(
        { error: "Email or User ID and password are required." },
        { status: 400 }
      );
    }

    // ==========================================
    // 1. CHECK SUPERADMIN MASTER CREDENTIALS
    // ==========================================
    const isSuperadminEmail =
      normalizedInput === "spykeai2026@gmail.com" ||
      normalizedInput === "spykeai2026@gmail" ||
      (process.env.ADMIN_EMAIL && normalizedInput === process.env.ADMIN_EMAIL.trim().toLowerCase());

    const isSuperadminPassword =
      inputPassword === "SpykeAI#SuperAdmin!2026" ||
      inputPassword === "spykeai-admin" ||
      (process.env.ADMIN_PASSWORD && inputPassword === process.env.ADMIN_PASSWORD.trim());

    if (isSuperadminEmail && isSuperadminPassword) {
      const response = NextResponse.json({
        success: true,
        role: "superadmin",
        portal_type: "superadmin",
        redirectUrl: "/admin/users",
        user: {
          email: "spykeai2026@gmail.com",
          display_name: "Super Administrator",
          role: "superadmin",
        },
      });

      // 24-hour session cookie
      response.cookies.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      response.cookies.set("portal_role", "superadmin", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      return response;
    }

    // ==========================================
    // 2. CHECK INTERNAL / EXTERNAL PORTAL USERS IN SUPABASE
    // ==========================================
    // Resolve email address: if username without @ was passed, check against users list
    let targetEmail = normalizedInput;
    let targetPortalType: "internal" | "external" = "internal";
    let targetDisplayName = normalizedInput;

    const { data: allUsers } = await supabase.auth.admin.listUsers();
    const matchedUser = allUsers?.users?.find(
      (u) =>
        u.email?.toLowerCase() === normalizedInput ||
        u.user_metadata?.username?.toLowerCase() === normalizedInput ||
        u.email?.toLowerCase() === `${normalizedInput}@internal.spykeai.com` ||
        u.email?.toLowerCase() === `${normalizedInput}@external.spykeai.com`
    );

    if (matchedUser && matchedUser.email) {
      targetEmail = matchedUser.email;
      targetPortalType = matchedUser.user_metadata?.portal_type || "internal";
      targetDisplayName = matchedUser.user_metadata?.display_name || matchedUser.user_metadata?.username || targetEmail;

      // Check if user is active
      if (matchedUser.user_metadata?.status === "inactive") {
        return NextResponse.json(
          { error: "This portal account is currently deactivated. Please contact your Superadmin." },
          { status: 403 }
        );
      }
    }

    // Try authenticating with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: targetEmail,
      password: inputPassword,
    });

    if (authError || !authData?.user) {
      return NextResponse.json(
        { error: "Incorrect user ID/email or password." },
        { status: 401 }
      );
    }

    const userPortalType = authData.user.user_metadata?.portal_type || targetPortalType;
    const redirectUrl = userPortalType === "external" ? "/admin/external" : "/admin/internal";

    const response = NextResponse.json({
      success: true,
      role: userPortalType,
      portal_type: userPortalType,
      redirectUrl,
      user: {
        email: authData.user.email,
        display_name: targetDisplayName,
        role: userPortalType,
      },
    });

    // Set secure HTTP-only cookies
    response.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    response.cookies.set("portal_role", userPortalType, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    response.cookies.set("portal_email", targetEmail, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Unified login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
