import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";
import { SiteHeaderBar } from "@/components/site-header-bar";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userIsAdmin = await isAdmin(user);

  return (
    <SiteHeaderBar
      userEmail={user?.email ?? null}
      userIsAdmin={userIsAdmin}
    />
  );
}
