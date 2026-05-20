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
    console.error(
      `[isAdmin] profile query failed for ${user.email} (id=${user.id}): message="${error.message}" code="${error.code}" details="${error.details}" hint="${error.hint}"`,
    );
    return false;
  }

  if (!data) {
    console.warn(
      `[isAdmin] no profile row for ${user.email} (id=${user.id})`,
    );
    return false;
  }

  return data.is_admin === true;
}
