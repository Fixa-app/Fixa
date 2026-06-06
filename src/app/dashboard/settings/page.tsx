import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "./client";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const cookieId = (await cookies()).get("active_company_id")?.value;
  const { data: companies } = await supabase.rpc("get_user_companies", { p_user_id: user.id });
  const active = (cookieId && companies?.find((c: { company_id: string }) => c.company_id === cookieId)) || companies?.[0];
  const companyId = active?.company_id;

  if (!companyId) return null;

  const [{ data: company }, { data: settings }] = await Promise.all([
    supabase.from("companies").select("*").eq("id", companyId).single(),
    supabase.from("company_settings").select("*").eq("company_id", companyId).single(),
  ]);

  return (
    <SettingsClient
      companyId={companyId}
      company={company}
      settings={settings}
    />
  );
}