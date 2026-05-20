import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminEmails } from "@/lib/auth/admin";

export default function AdminUsersPage() {
  const admins = getAdminEmails();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Who can sign into Fixa and who can access this admin panel.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Admins</CardTitle>
          <CardDescription>
            Configured via the ADMIN_EMAILS environment variable. Edit
            .env.local locally and the Vercel project env vars for production.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No admin emails configured.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {admins.map((email) => (
                <li
                  key={email}
                  className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <span>{email}</span>
                  <Badge variant="secondary">admin</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
          <CardDescription>
            Listing Supabase auth users requires the service_role key. Not wired
            yet — coming next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            Empty for now. Once SUPABASE_SERVICE_ROLE_KEY is set, this lists
            everyone who has used the magic-link login.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
