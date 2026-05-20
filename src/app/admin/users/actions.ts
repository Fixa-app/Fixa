"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";

export async function setAdminFlag(userId: string, makeAdmin: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!(await isAdmin(user))) {
    throw new Error("Not authorized");
  }

  if (!makeAdmin && user!.id === userId) {
    throw new Error("You cannot revoke your own admin access.");
  }

  if (!makeAdmin) {
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_admin", true);
    if (count !== null && count <= 1) {
      throw new Error("Cannot revoke the last remaining admin.");
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ is_admin: makeAdmin, updated_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Could not update profile: ${error.message}`);
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin");
}
