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

  let companyName = "";
  let role = "";
  if (user) {
    const { data } = await supabase.rpc("get_user_companies", {
      p_user_id: user.id,
    });
    if (data && data[0]) {
      companyName = data[0].company_name ?? "";
      role = data[0].user_role ?? "";
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
        companyName={companyName}
        userName={userName}
        role={role}
      />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
