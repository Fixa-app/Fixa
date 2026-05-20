import type { User } from "@supabase/supabase-js";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAdmin(user: User | null | undefined): boolean {
  if (!user?.email) return false;
  return adminEmails.includes(user.email.toLowerCase());
}

export function getAdminEmails(): string[] {
  return [...adminEmails];
}
