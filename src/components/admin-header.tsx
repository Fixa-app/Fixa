import Image from "next/image";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";

type Env = "development" | "preview" | "production";

function detectEnv(): Env {
  const vercelEnv = process.env.VERCEL_ENV as Env | undefined;
  if (vercelEnv === "production" || vercelEnv === "preview") return vercelEnv;
  return "development";
}

const envLabels: Record<Env, string> = {
  development: "Dev",
  preview: "Preview",
  production: "Prod",
};

const envStyles: Record<Env, string> = {
  development: "bg-zinc-700 text-zinc-100",
  preview: "bg-amber-500 text-amber-950",
  production: "bg-red-600 text-red-50",
};

export function AdminHeader({ user }: { user: User }) {
  const env = detectEnv();

  return (
    <header className="border-b border-zinc-800 bg-zinc-900 text-zinc-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight"
            aria-label="Fixa Admin"
          >
            <Image
              src="/fixa-logo.svg"
              alt=""
              width={28}
              height={28}
              priority
              className="h-7 w-auto invert"
            />
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-400">Admin</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-semibold text-zinc-400 md:flex">
            <Link href="/admin" className="hover:text-zinc-100">
              Dashboard
            </Link>
            <Link href="/admin/blueprint" className="hover:text-zinc-100">
              Blueprint
            </Link>
            <Link href="/admin/users" className="hover:text-zinc-100">
              Users
            </Link>
            <Link href="/admin/design" className="hover:text-zinc-100">
              Design
            </Link>
            <Link href="/plan" className="hover:text-zinc-100">
              Plan
            </Link>
            <Link href="/plan/workflow" className="hover:text-zinc-100">
              Workflow
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium tracking-wide uppercase ${envStyles[env]}`}
            title={`Environment: ${envLabels[env]}`}
          >
            {envLabels[env]}
          </span>
          <Link
            href="/"
            className="hidden items-center gap-1 text-sm text-zinc-400 hover:text-zinc-100 sm:flex"
          >
            View site
            <ExternalLink className="size-3.5" />
          </Link>
          <span
            className="hidden max-w-[220px] truncate text-sm text-zinc-400 sm:inline"
            title={user.email ?? undefined}
          >
            {user.email}
          </span>
          <form action={signOut}>
            <Button
              variant="ghost"
              size="sm"
              type="submit"
              className="text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100"
            >
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
