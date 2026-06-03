import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { COOKIE_DOMAIN } from "@/lib/supabase/cookie-options";

// Paths that belong to the authenticated pro app (served on app.hifixa.com in
// production). Everything else is marketing (hifixa.com).
const APP_PATHS = ["/dashboard", "/onboarding"];

function isAppPath(pathname: string) {
  return APP_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // Host split is only active once the app domain is configured (production).
  // In dev / previews these are unset, so everything stays on one host and
  // behaves as before.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL; // e.g. https://app.hifixa.com
  const marketingUrl = process.env.NEXT_PUBLIC_MARKETING_URL; // e.g. https://hifixa.com
  const isAppHost = !!appUrl && host === new URL(appUrl).host;

  if (appUrl) {
    // App routes only live on the app subdomain.
    if (!isAppHost && isAppPath(pathname)) {
      return NextResponse.redirect(new URL(pathname + search, appUrl));
    }
    // Marketing routes don't live on the app subdomain (let /auth complete on
    // whichever host the login was started from).
    if (isAppHost && !isAppPath(pathname) && !pathname.startsWith("/auth")) {
      if (pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", appUrl));
      }
      return NextResponse.redirect(
        new URL(pathname + search, marketingUrl ?? request.url),
      );
    }
  }

  // Pass pathname to layout via header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request: { headers: requestHeaders },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
            });
          });
        },
      },
    },
  );

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes - must be logged in. Send anonymous visitors to marketing.
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding")) {
    if (!user) {
      return NextResponse.redirect(new URL("/", marketingUrl ?? request.url));
    }
  }

  // Use service role for company checks (bypasses RLS)
  const serviceSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // If logged in and on onboarding - check if already has company
  if (user && pathname.startsWith("/onboarding")) {
    const { data: membership } = await serviceSupabase
      .from("company_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (membership) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // If logged in and on dashboard - check if has company
  if (user && pathname.startsWith("/dashboard")) {
    const { data: membership } = await serviceSupabase
      .from("company_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!membership) {
      return NextResponse.redirect(new URL("/onboarding/upload", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
