import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";
import { AdminHeader } from "@/components/admin-header";

export const metadata = {
  title: "Fixa Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdmin(user)) {
    redirect("/");
  }

  return (
    <>
      <AdminHeader user={user!} />
      <main className="flex-1 bg-muted/20">{children}</main>
    </>
  );
}
