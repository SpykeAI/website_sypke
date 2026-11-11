import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error("Failed to list users:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const users = (data.users || []).map((u) => ({
      id: u.id,
      email: u.email,
      username: u.user_metadata?.username || u.email?.split("@")[0],
      display_name: u.user_metadata?.display_name || u.email?.split("@")[0],
      portal_type: u.user_metadata?.portal_type || "internal",
      role: u.user_metadata?.role || "internal",
      status: u.user_metadata?.status || "active",
      created_at: u.created_at,
    }));

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userIdOrEmail, password, portal_type, display_name, role } = body;

    if (!userIdOrEmail || !password || !portal_type) {
      return NextResponse.json(
        { error: "User ID/Email, Password, and Portal Type are required." },
        { status: 400 }
      );
    }

    const cleanInput = userIdOrEmail.trim().toLowerCase();
    // Allow either full email or simple username (auto-append @spykeai.internal / @spykeai.external)
    const email = cleanInput.includes("@")
      ? cleanInput
      : `${cleanInput}@${portal_type === "internal" ? "internal.spykeai.com" : "external.spykeai.com"}`;

    const username = cleanInput.includes("@") ? cleanInput.split("@")[0] : cleanInput;

    // Check if user with this email already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const duplicate = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === email || u.user_metadata?.username?.toLowerCase() === username
    );

    if (duplicate) {
      return NextResponse.json(
        { error: "A user with this User ID or Email already exists." },
        { status: 400 }
      );
    }

    const assignedRole = role?.trim() || (portal_type === "external" ? "Client" : "Agent");

    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: password.trim(),
      email_confirm: true,
      user_metadata: {
        username,
        portal_type: portal_type === "external" ? "external" : "internal",
        role: assignedRole,
        display_name: display_name?.trim() || username,
        status: "active",
      },
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `User created successfully for ${portal_type} portal.`,
      user: {
        id: newUser.user?.id,
        email: newUser.user?.email,
        username,
        portal_type,
        role: assignedRole,
        display_name: display_name?.trim() || username,
      },
    });
  } catch (error: any) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "User deleted successfully." });
  } catch (error: any) {
    console.error("DELETE /api/admin/users error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, newPassword, status } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const updatePayload: any = {};
    if (newPassword) {
      updatePayload.password = newPassword.trim();
    }
    if (status) {
      updatePayload.user_metadata = { status };
    }

    const { error } = await supabase.auth.admin.updateUserById(id, updatePayload);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "User updated successfully." });
  } catch (error: any) {
    console.error("PATCH /api/admin/users error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
