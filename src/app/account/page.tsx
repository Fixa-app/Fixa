import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const email = user.email ?? "";
  const fullName = email
    ? email
        .split("@")[0]
        .split(/[._-]/)
        .filter(Boolean)
        .map((part) => part.replace(/^./, (c) => c.toUpperCase()))
        .join(" ")
    : "";
  const initial = (fullName[0] || email[0] || "?").toUpperCase();

  const { data: companies } = await supabase.rpc("get_user_companies", {
    p_user_id: user.id,
  });
  const hasCompany = (companies?.length ?? 0) > 0;

  return (
    <main className="flex-1 px-4 py-12">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            {initial}
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold">{fullName}</h1>
            <p className="text-muted-foreground">{email}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
            Account details
          </h2>
          <dl className="mt-4 divide-y divide-border">
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{fullName}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{email}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Company</dt>
              <dd className="font-medium">
                {hasCompany ? (
                  <Link href="/dashboard" className="text-primary hover:underline">
                    Company Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/onboarding/company"
                    className="text-primary hover:underline"
                  >
                    Create company
                  </Link>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="rounded-xl border border-border px-5 py-3 text-base font-bold transition-colors hover:bg-muted"
          >
            Uitloggen
          </button>
        </form>
      </div>
    </main>
  );
}
