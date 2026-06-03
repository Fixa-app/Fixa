import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "./sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let companies: { id: string; name: string }[] = [];
  let activeCompanyId = "";
  let companyName = "";
  let role = "";
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
    const active = rows.find((c: { company_id: string }) => c.company_id === cookieId) ?? rows[0];
    if (active) {
      activeCompanyId = active.company_id;
      companyName = active.company_name ?? "";
      role = active.user_role ?? "";
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

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        companies={companies}
        activeCompanyId={activeCompanyId}
        companyName={companyName}
        userName={userName}
        role={role}
      />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
