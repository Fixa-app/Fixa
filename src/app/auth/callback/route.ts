import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // After login, land on the pro app (app.hifixa.com) when configured; the
  // session cookie is parent-domain scoped, so it's valid across both hosts.
  // Clients land back on the marketing site instead.
  const appBase = process.env.NEXT_PUBLIC_APP_URL ?? origin;
  const marketingBase = process.env.NEXT_PUBLIC_MARKETING_URL ?? origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Clients live on the marketing-side hub, not the pro app. (own-profile
      // read is allowed by RLS, so the authed client is enough here.)
      const { data: profile } = await supabase
        .from("profiles")
        .select("account_type")
        .eq("user_id", user?.id ?? "")
        .maybeSingle();

      if (profile?.account_type === "client") {
        return NextResponse.redirect(`${marketingBase}/`);
      }

      // Pro: dashboard if they already have a company, else onboarding.
      const serviceSupabase = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );
      const { data: membership } = await serviceSupabase
        .from("company_members")
        .select("company_id")
        .eq("user_id", user?.id ?? "")
        .maybeSingle();

      return NextResponse.redirect(
        membership ? `${appBase}/dashboard` : `${appBase}/onboarding/upload`,
      );
    }
  }

  return NextResponse.redirect(`${appBase}/onboarding/upload`);
}