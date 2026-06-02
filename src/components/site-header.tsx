import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";
import { SiteHeaderBar } from "@/components/site-header-bar";
import { headers } from "next/headers";

export async function SiteHeader() {
  // Hide on app routes
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  const appRoutes = ['/dashboard', '/onboarding', '/quotes', '/invoices', '/settings'];
  if (appRoutes.some(route => pathname.startsWith(route))) {
    return null;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userIsAdmin = await isAdmin(user);

  let hasCompany = false;
  if (user) {
    const { data: companies } = await supabase.rpc("get_user_companies", {
      p_user_id: user.id,
    });
    hasCompany = (companies?.length ?? 0) > 0;
  }

  return (
    <SiteHeaderBar
      userEmail={user?.email ?? null}
      userIsAdmin={userIsAdmin}
      hasCompany={hasCompany}
    />
  );
}