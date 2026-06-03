import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { COOKIE_DOMAIN } from "@/lib/supabase/cookie-options";

// Paths that belong to the authenticated pro app (served on app.hifixa.com in
// production). Everything else is marketing (hifixa.com).
const APP_PATHS = ["/dashboard", "/onboarding"];
const ONBOARDING_START = "/onboarding/upload";

function isAppPath(pathname: string) {
  return APP_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // Host split is only active once the app domain is configured (production /
  // lvh.me). In plain local dev these are unset and we fall back to single-host
  // behaviour at the bottom.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL; // e.g. https://app.hifixa.com
  const marketingUrl = process.env.NEXT_PUBLIC_MARKETING_URL; // e.g. https://hifixa.com
  const isAppHost = !!appUrl && host === new URL(appUrl).host;

  // App routes only live on the app subdomain.
  if (appUrl && !isAppHost && isAppPath(pathname)) {
    return NextResponse.redirect(new URL(pathname + search, appUrl));
  }

  // --- session refresh + cookie handling (every request) ---
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  let response = NextResponse.next({ request: { headers: requestHeaders } });

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
          response = NextResponse.next({ request: { headers: requestHeaders } });
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Resolve account type (own-profile read, allowed by RLS) and company
  // membership. Only called when a routing decision actually needs it.
  async function resolveState() {
    const { data: profile } = await supabase
      .from("profiles")
      .select("account_type")
      .eq("user_id", user!.id)
      .maybeSingle();
    const accountType = profile?.account_type === "client" ? "client" : "pro";

    // Service role bypasses RLS for the membership check.
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    const { data: membership } = await serviceSupabase
      .from("company_members")
      .select("company_id")
      .eq("user_id", user!.id)
      .maybeSingle();

    return { accountType, hasCompany: !!membership };
  }

  // --- App subdomain rules ---
  if (isAppHost) {
    // Let auth/api requests through regardless of auth state.
    if (pathname.startsWith("/auth") || pathname.startsWith("/api")) {
      return response;
    }
    // Not logged in on the app host -> marketing.
    if (!user) {
      return NextResponse.redirect(new URL("/", marketingUrl ?? request.url));
    }

    const { accountType, hasCompany } = await resolveState();

    // Clients have no pro app -> marketing (logged-in header / future hub).
    if (accountType === "client") {
      return NextResponse.redirect(new URL("/", marketingUrl ?? request.url));
    }
    // Pro landing on the app root -> dashboard or onboarding.
    if (pathname === "/") {
      return NextResponse.redirect(
        new URL(hasCompany ? "/dashboard" : ONBOARDING_START, request.url),
      );
    }
    // Marketing paths don't live on the app host.
    if (!isAppPath(pathname)) {
      return NextResponse.redirect(
        new URL(pathname + search, marketingUrl ?? request.url),
      );
    }
    // Keep onboarding / dashboard consistent with company state.
    if (pathname.startsWith("/onboarding") && hasCompany) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (pathname.startsWith("/dashboard") && !hasCompany) {
      return NextResponse.redirect(new URL(ONBOARDING_START, request.url));
    }
    return response;
  }

  // --- Marketing host (apex), split active ---
  // Logged-in users just see marketing with the logged-in header; app routes
  // were already redirected to the app host above.
  if (appUrl) {
    return response;
  }

  // --- Single-host fallback (local dev / preview, no subdomain split) ---
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding")) {
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    const { accountType, hasCompany } = await resolveState();
    if (accountType === "client") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/onboarding") && hasCompany) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (pathname.startsWith("/dashboard") && !hasCompany) {
      return NextResponse.redirect(new URL(ONBOARDING_START, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
