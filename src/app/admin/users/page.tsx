import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getBootstrapAdminEmails } from "@/lib/auth/admin";
import { setAdminFlag } from "./actions";

type Profile = {
  user_id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
};

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("user_id, email, is_admin, created_at")
    .order("created_at", { ascending: false })
    .returns<Profile[]>();

  const bootstrapAdmins = new Set(
    getBootstrapAdminEmails().map((e) => e.toLowerCase()),
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Everyone who has signed into Fixa. Toggle admin to grant access to
          this panel.
        </p>
      </header>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">
              Could not load users
            </CardTitle>
            <CardDescription>
              {error.message}. If this is the first time visiting this page,
              the profiles table migration probably has not been applied yet
              (supabase/migrations/20260520120000_create_profiles.sql).
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
          <CardDescription>
            Bootstrap admins are configured via the ADMIN_EMAILS env var and
            cannot be demoted from the UI — toggle them by removing the env
            var.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!profiles || profiles.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No users yet. Sign in via the magic-link flow on the home page to
              create the first one.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {profiles.map((profile) => {
                const isBootstrap = bootstrapAdmins.has(
                  profile.email.toLowerCase(),
                );
                return (
                  <li
                    key={profile.user_id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium">
                        {profile.email}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Joined{" "}
                        {new Date(profile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {profile.is_admin && (
                        <Badge variant="default">admin</Badge>
                      )}
                      {isBootstrap && (
                        <Badge variant="secondary">bootstrap</Badge>
                      )}
                      <form
                        action={setAdminFlag.bind(
                          null,
                          profile.user_id,
                          !profile.is_admin,
                        )}
                      >
                        <Button
                          type="submit"
                          size="sm"
                          variant="outline"
                          disabled={isBootstrap}
                          title={
                            isBootstrap
                              ? "Bootstrap admins cannot be demoted from the UI"
                              : undefined
                          }
                        >
                          {profile.is_admin ? "Revoke admin" : "Make admin"}
                        </Button>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
