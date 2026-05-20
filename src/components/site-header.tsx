import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";
import { signOut } from "@/lib/auth/actions";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userIsAdmin = isAdmin(user);

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Fixa
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#workflow" className="hover:text-foreground">
            How it works
          </a>
          <a href="#industries" className="hover:text-foreground">
            Who it&apos;s for
          </a>
          <Link href="/plan" className="hover:text-foreground">
            Plan
          </Link>
          {userIsAdmin && (
            <Link href="/admin" className="hover:text-foreground">
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span
                className="hidden max-w-[220px] truncate text-sm text-muted-foreground sm:inline"
                title={user.email ?? undefined}
              >
                {user.email}
              </span>
              <form action={signOut}>
                <Button variant="ghost" size="sm" type="submit">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <AuthDialog>
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </AuthDialog>
              <AuthDialog>
                <Button size="sm">Start free trial</Button>
              </AuthDialog>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
