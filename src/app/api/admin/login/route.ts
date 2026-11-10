import { NextResponse } from "next/server";

const DEFAULT_ADMIN_EMAIL = "spykeai2026@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "SpykeAI#SuperAdmin!2026";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const configuredEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
    const configuredPassword = (process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD).trim();

    const normalizedInputEmail = (email || "").trim().toLowerCase();
    const inputPassword = (password || "").trim();

    if (!normalizedInputEmail || !inputPassword) {
      return NextResponse.json(
        { error: "Email address and master password are required." },
        { status: 400 }
      );
    }

    // Support both spykeai2026@gmail.com and spykeai2026@gmail
    const isEmailValid =
      normalizedInputEmail === configuredEmail ||
      normalizedInputEmail === configuredEmail.replace("@gmail.com", "@gmail") ||
      (configuredEmail.endsWith("@gmail.com") && normalizedInputEmail === configuredEmail.split("@")[0]);

    const isPasswordValid = inputPassword === configuredPassword;

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email address or master password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Authenticated successfully.",
      user: {
        email: configuredEmail,
        role: "superadmin",
      },
    });

    // Set a secure HTTP-only cookie to keep the admin logged in for 24 hours
    response.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
