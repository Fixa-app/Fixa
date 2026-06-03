"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // Land on the marketing site after sign-out (the app subdomain is gated).
  redirect(process.env.NEXT_PUBLIC_MARKETING_URL ?? "/");
}
