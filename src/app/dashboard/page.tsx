import { createClient } from "@/lib/supabase/server";
import { HomeContent } from "./home-content";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email ?? "";
  const firstName = email
    ? email
        .split("@")[0]
        .split(/[._-]/)[0]
        .replace(/^./, (c) => c.toUpperCase())
    : "";

  return <HomeContent firstName={firstName} />;
}