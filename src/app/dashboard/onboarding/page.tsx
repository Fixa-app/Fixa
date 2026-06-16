import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { cookies } from "next/headers";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { onboardingSteps, ONBOARDING_TOTAL } from "../onboarding-steps";

export default async function DashboardOnboardingPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let hasLogo = false;
  let hasQuoteNumber = false;

  if (user) {
    const cookieId = (await cookies()).get("active_company_id")?.value;
    const { data: companies } = await supabase.rpc("get_user_companies", { p_user_id: user.id });
    const active = (cookieId && companies?.find((c: { company_id: string }) => c.company_id === cookieId)) || companies?.[0];
    const companyId = active?.company_id;

    if (companyId) {
      const service = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );

      const [{ data: company }, { data: settings }] = await Promise.all([
        service.from("companies").select("logo_url").eq("id", companyId).single(),
        service.from("company_settings").select("next_quote_number, quote_number_format").eq("company_id", companyId).single(),
      ]);

      hasLogo = !!company?.logo_url;
      hasQuoteNumber = !!(settings?.next_quote_number && settings?.quote_number_format);
    }
  }

  const steps = onboardingSteps({ hasCompany: true, hasLogo, hasQuoteNumber });
  const completed = steps.filter((s) => s.completed).length;

  return (
    <div className="px-6 py-8 md:px-10 lg:pt-6">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold">Aan de slag</h1>
          <p className="text-muted-foreground">
            {completed} van {ONBOARDING_TOTAL} stappen voltooid
          </p>
        </div>

        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {steps.map((step, i) => (
            <li key={step.title}>
              <Link
                href={step.href}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/40"
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    step.completed
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground"
                  }`}
                >
                  {step.completed ? <Check className="size-4" /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{step.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}