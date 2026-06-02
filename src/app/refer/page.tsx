import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CopyLink } from "./copy-link";

export default async function ReferPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="flex-1 px-4 py-12">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold">Refer a friend</h1>
          <p className="text-muted-foreground">
            Share Fixa with other tradespeople. Send them your personal link and
            help them get started.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
            Your referral link
          </h2>
          <div className="mt-4">
            <CopyLink refCode={user.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
