import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function isAdmin(user: User | null | undefined): Promise<boolean> {
  if (!user) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  return data?.is_admin === true;
}
