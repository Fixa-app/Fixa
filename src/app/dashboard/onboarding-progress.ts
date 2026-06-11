import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ONBOARDING_TOTAL, onboardingCompletedCount } from "./onboarding-steps";

export async function getOnboardingProgress(): Promise<{
  completed: number;
  total: number;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let activeCompanyId = "";
  let hasLogo = false;
  let hasQuoteNumber = false;

  if (user) {
    const { data } = await supabase.rpc("get_user_companies", {
      p_user_id: user.id,
    });
    const rows = data ?? [];
    const cookieId = (await cookies()).get("active_company_id")?.value;
    const active =
      rows.find((c: { company_id: string }) => c.company_id === cookieId) ??
      rows[0];

    if (active) {
      activeCompanyId = active.company_id;

      const { data: company } = await supabase
        .from("companies")
        .select("logo_url")
        .eq("id", activeCompanyId)
        .single();

      const { data: settings } = await supabase
        .from("company_settings")
        .select("next_quote_number, quote_number_format")
        .eq("company_id", activeCompanyId)
        .single();

      hasLogo = !!company?.logo_url;
      hasQuoteNumber = !!(
        settings?.next_quote_number && settings?.quote_number_format
      );
    }
  }

  return {
    completed: onboardingCompletedCount({
      hasCompany: !!activeCompanyId,
      hasLogo,
      hasQuoteNumber,
    }),
    total: ONBOARDING_TOTAL,
  };
}
