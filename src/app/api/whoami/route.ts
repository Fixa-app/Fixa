import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const result: Record<string, unknown> = {
    user: user ? { id: user.id, email: user.email } : null,
    userError: userError?.message ?? null,
  };

  if (user) {
    const { data, error, status, statusText } = await supabase
      .from("profiles")
      .select("user_id, email, is_admin, created_at")
      .eq("user_id", user.id)
      .maybeSingle();

    result.profile = data;
    result.profileError = error
      ? { message: error.message, code: error.code, details: error.details }
      : null;
    result.profileQueryStatus = { status, statusText };
  }

  return NextResponse.json(result);
}
