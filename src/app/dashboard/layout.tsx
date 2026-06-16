import { cookies } from "next/headers";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { DashboardSidebar } from "./sidebar";
import { DashboardHeader } from "./header";
import { ONBOARDING_TOTAL, onboardingCompletedCount } from "./onboarding-steps";
import { MobileNav } from "./mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let companies: { id: string; name: string }[] = [];
  let activeCompanyId = "";
  let companyName = "";
  let role = "";
  let hasLogo = false;
  let hasQuoteNumber = false;

  if (user) {
    const { data } = await supabase.rpc("get_user_companies", {
      p_user_id: user.id,
    });
    const rows = data ?? [];
    companies = rows.map((c: { company_id: string; company_name: string }) => ({
      id: c.company_id,
      name: c.company_name,
    }));
    const cookieId = (await cookies()).get("active_company_id")?.value;
    const active =
      rows.find((c: { company_id: string }) => c.company_id === cookieId) ??
      rows[0];
    if (active) {
      activeCompanyId = active.company_id;
      companyName = active.company_name ?? "";
      role = active.user_role ?? "";

      // Service role client om RLS te omzeilen
      const service = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );

      const [{ data: company }, { data: settings }] = await Promise.all([
        service.from("companies").select("logo_url").eq("id", activeCompanyId).single(),
        service.from("company_settings").select("next_quote_number, quote_number_format").eq("company_id", activeCompanyId).single(),
      ]);

      hasLogo = !!company?.logo_url;
      hasQuoteNumber = !!(settings?.next_quote_number && settings?.quote_number_format);
    }
  }

  const email = user?.email ?? "";
  const userName = email
    ? email
        .split("@")[0]
        .split(/[._-]/)
        .filter(Boolean)
        .map((part) => part.replace(/^./, (c) => c.toUpperCase()))
        .join(" ")
    : "";

  const completedCount = onboardingCompletedCount({
    hasCompany: !!activeCompanyId,
    hasLogo,
    hasQuoteNumber,
  });

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <DashboardSidebar
        companies={companies}
        activeCompanyId={activeCompanyId}
        companyName={companyName}
        userName={userName}
        role={role}
        onboardingCompleted={completedCount}
        onboardingTotal={ONBOARDING_TOTAL}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav
          companyName={companyName}
          userName={userName}
          role={role}
          onboardingCompleted={completedCount}
          onboardingTotal={ONBOARDING_TOTAL}
        />
        <DashboardHeader
          companies={companies}
          activeCompanyId={activeCompanyId}
          companyName={companyName}
          userName={userName}
        />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}