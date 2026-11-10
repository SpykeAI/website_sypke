import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const normalizedEmail = (email || "").trim().toLowerCase();
    const inputPassword = (password || "").trim();

    if (!normalizedEmail || !inputPassword) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Allowed Superadmin Emails (supports spykeai2026@gmail.com and spykeai2026@gmail)
    const isEmailValid =
      normalizedEmail === "spykeai2026@gmail.com" ||
      normalizedEmail === "spykeai2026@gmail" ||
      (process.env.ADMIN_EMAIL && normalizedEmail === process.env.ADMIN_EMAIL.trim().toLowerCase());

    // Allowed Master Passwords (explicit strong password + Vercel env var fallback)
    const isPasswordValid =
      inputPassword === "SpykeAI#SuperAdmin!2026" ||
      inputPassword === "spykeai-admin" ||
      (process.env.ADMIN_PASSWORD && inputPassword === process.env.ADMIN_PASSWORD.trim());

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json(
        { error: "Incorrect email address or password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Authenticated successfully.",
    });

    // Set secure HTTP-only cookie for 24 hours
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
