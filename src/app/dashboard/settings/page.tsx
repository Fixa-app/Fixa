import { Suspense } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { SettingsClient } from "./client";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Use service role for data queries to bypass RLS
  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const cookieId = (await cookies()).get("active_company_id")?.value;
  const { data: companies } = await service.rpc("get_user_companies", { p_user_id: user.id });
  const active = (cookieId && companies?.find((c: { company_id: string }) => c.company_id === cookieId)) || companies?.[0];
  const companyId = active?.company_id;

  if (!companyId) return null;

  const [{ data: company }, { data: settings }] = await Promise.all([
    service.from("companies").select("*").eq("id", companyId).single(),
    service.from("company_settings").select("*").eq("company_id", companyId).single(),
  ]);

  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-sm text-muted-foreground">Laden...</p></div>}>
      <SettingsClient
        companyId={companyId}
        company={company}
        settings={settings}
      />
    </Suspense>
  );
}