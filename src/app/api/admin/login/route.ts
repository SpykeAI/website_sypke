import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ==========================================
    // A. OTP LOGIN / RECOVERY (FORGOT PASSWORD)
    // ==========================================
    if (body.otp && body.hashPayload) {
      const { email: otpEmail, otp, hashPayload } = body;
      const normalizedOtpEmail = (otpEmail || "").trim().toLowerCase();

      if (
        normalizedOtpEmail !== "spykeai2026@gmail.com" &&
        normalizedOtpEmail !== "spykeai2026@gmail" &&
        (process.env.ADMIN_EMAIL && normalizedOtpEmail !== process.env.ADMIN_EMAIL.trim().toLowerCase())
      ) {
        return NextResponse.json(
          { error: "OTP login is only permitted for authorized administrator email." },
          { status: 403 }
        );
      }

      const [hash, expiresAt] = (hashPayload || "").split(".");
      if (!hash || !expiresAt || Date.now() > Number(expiresAt)) {
        return NextResponse.json(
          { error: "Verification code has expired. Please request a new code." },
          { status: 400 }
        );
      }

      const secret = process.env.OTP_SECRET || "SpykeAI_Secure_OTP_2026_xyz";
      const dataToHash = `${normalizedOtpEmail}.${otp.trim()}.${expiresAt}.${secret}`;
      const calculatedHash = crypto.createHash("sha256").update(dataToHash).digest("hex");

      if (calculatedHash !== hash) {
        return NextResponse.json(
          { error: "Invalid verification code. Please check and try again." },
          { status: 400 }
        );
      }

      const response = NextResponse.json({
        success: true,
        role: "superadmin",
        portal_type: "superadmin",
        redirectUrl: "/inbox",
        user: {
          email: "spykeai2026@gmail.com",
          display_name: "Super Administrator (OTP Verified)",
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

      response.cookies.set("portal_email", "spykeai2026@gmail.com", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      return response;
    }

    // ==========================================
    // B. STANDARD PASSWORD LOGIN
    // ==========================================
    const { email, password } = body;

    const normalizedInput = (email || "").trim().toLowerCase();
    const inputPassword = (password || "").trim();

    if (!normalizedInput || !inputPassword) {
      return NextResponse.json(
        { error: "Email or User ID and password are required." },
        { status: 400 }
      );
    }

    // 1. CHECK SUPERADMIN MASTER CREDENTIALS
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
        redirectUrl: "/inbox",
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

      response.cookies.set("portal_email", "spykeai2026@gmail.com", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      return response;
    }

    // 2. CHECK INTERNAL / EXTERNAL PORTAL USERS IN SUPABASE
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

      if (matchedUser.user_metadata?.status === "inactive") {
        return NextResponse.json(
          { error: "This portal account is currently deactivated. Please contact your Superadmin." },
          { status: 403 }
        );
      }
    }

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
    const redirectUrl = userPortalType === "external" ? "/clientportal" : "/admin/internal";

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
