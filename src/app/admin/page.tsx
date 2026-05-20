import Link from "next/link";
import { Users, Workflow, BarChart3 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const greeting = user?.email?.split("@")[0] ?? "there";

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome, {greeting}.
        </h1>
        <p className="text-muted-foreground">
          Fixa admin — manage the platform from here.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total users" value="—" hint="Wire after service role" />
        <StatCard label="Active requests" value="—" hint="No tables yet" />
        <StatCard label="Open invoices" value="—" hint="No tables yet" />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <ShortcutCard
          href="/admin/users"
          icon={Users}
          title="Users"
          description="Manage who can access Fixa, see signups, view auth events."
        />
        <ShortcutCard
          href="/plan/workflow"
          icon={Workflow}
          title="Workflow spec"
          description="The five-stage workflow rebuilt from Miro. Edit content in src/data/workflow.ts."
        />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <BarChart3 className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function ShortcutCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-colors group-hover:bg-accent/50">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <Icon className="size-5 text-foreground/80" />
          <div className="flex flex-col gap-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
