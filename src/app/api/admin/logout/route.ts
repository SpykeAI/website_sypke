import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });

  const cookieOptions = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };

  response.cookies.set("admin_session", "", { ...cookieOptions, httpOnly: true });
  response.cookies.set("portal_role", "", { ...cookieOptions, httpOnly: true });
  response.cookies.set("portal_email", "", { ...cookieOptions, httpOnly: true });
  response.cookies.set("portal_user_name", "", { ...cookieOptions, httpOnly: false });
  response.cookies.set("portal_user_role", "", { ...cookieOptions, httpOnly: false });

  return response;
}
