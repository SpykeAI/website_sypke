import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "User ID/Email and password are required." },
        { status: 400 }
      );
    }

    const cleanInput = email.trim().toLowerCase();
    const inputPassword = password.trim();

    // 1. Fetch user list to find the matching user and verify external portal role
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error("Failed to list users in client login:", listError);
      return NextResponse.json({ error: "Authentication service unavailable." }, { status: 500 });
    }

    const matchedUser = usersData?.users?.find((u) => {
      const uEmail = u.email?.toLowerCase();
      const uName = u.user_metadata?.username?.toLowerCase();
      return uEmail === cleanInput || uName === cleanInput;
    });

    if (!matchedUser || !matchedUser.email) {
      return NextResponse.json(
        { error: "Invalid client credentials. Please check your User ID or password." },
        { status: 401 }
      );
    }

    // 2. Strict check: MUST be an External Portal user created in Superadmin
    const portalType = matchedUser.user_metadata?.portal_type;
    if (portalType !== "external") {
      return NextResponse.json(
        { error: "Access denied. This login is reserved exclusively for External Client accounts." },
        { status: 403 }
      );
    }

    // 3. Strict check: Account status must be active
    if (matchedUser.user_metadata?.status === "inactive") {
      return NextResponse.json(
        { error: "This client portal account is currently deactivated. Please contact your administrator." },
        { status: 403 }
      );
    }

    // 4. Verify password with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: matchedUser.email,
      password: inputPassword,
    });

    if (authError || !authData?.user) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    // 5. Establish secure session cookies
    const response = NextResponse.json({
      success: true,
      role: "external",
      redirectUrl: "/clientportal",
      user: {
        email: matchedUser.email,
        display_name: matchedUser.user_metadata?.display_name || matchedUser.email.split("@")[0],
        role: matchedUser.user_metadata?.role || "Client",
      },
    });

    response.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    response.cookies.set("portal_role", "external", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    response.cookies.set("portal_email", matchedUser.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    response.cookies.set("portal_user_id", matchedUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Client login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
