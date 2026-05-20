import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function isAdmin(user: User | null | undefined): Promise<boolean> {
  if (!user) return false;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[isAdmin] profile query failed", {
      userId: user.id,
      email: user.email,
      error: { message: error.message, code: error.code, details: error.details },
    });
    return false;
  }

  if (!data) {
    console.warn("[isAdmin] no profile row found for user", { userId: user.id, email: user.email });
    return false;
  }

  return data.is_admin === true;
}
