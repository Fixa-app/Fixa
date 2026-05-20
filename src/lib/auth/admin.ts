import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const bootstrapAdminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isBootstrapAdmin(user: User | null | undefined): boolean {
  if (!user?.email) return false;
  return bootstrapAdminEmails.includes(user.email.toLowerCase());
}

export function getBootstrapAdminEmails(): string[] {
  return [...bootstrapAdminEmails];
}

export async function isAdmin(user: User | null | undefined): Promise<boolean> {
  if (!user) return false;
  if (isBootstrapAdmin(user)) return true;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  return data?.is_admin === true;
}
