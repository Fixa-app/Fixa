import Image from "next/image";
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
  const userIsAdmin = await isAdmin(user);

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="Fixa" className="flex items-center">
            <Image
              src="/fixa-logo.svg"
              alt="Fixa"
              width={48}
              height={48}
              priority
              className="h-12 w-auto"
            />
          </Link>
          <nav className="hidden items-center gap-7 text-base font-bold md:flex">
            <a href="#industries" className="text-foreground hover:text-foreground/70">
              Voor wie
            </a>
            <a href="#features" className="text-foreground hover:text-foreground/70">
              Product
            </a>
            <Link href="/pricing" className="text-foreground hover:text-foreground/70">
              Prijzen
            </Link>
            {userIsAdmin && (
              <Link href="/admin" className="text-foreground hover:text-foreground/70">
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
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
                  Uitloggen
                </Button>
              </form>
            </>
          ) : (
            <>
              <AuthDialog>
                <Button
                  variant="ghost"
                  className="text-base font-bold hover:bg-transparent hover:text-foreground/70"
                >
                  Inloggen
                </Button>
              </AuthDialog>
              <AuthDialog>
                <Button className="rounded-full px-5 text-base font-bold">
                  Begin nu
                </Button>
              </AuthDialog>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
