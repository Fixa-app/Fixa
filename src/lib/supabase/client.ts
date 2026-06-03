import { createBrowserClient } from "@supabase/ssr";
import { COOKIE_DOMAIN } from "./cookie-options";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    COOKIE_DOMAIN ? { cookieOptions: { domain: COOKIE_DOMAIN } } : undefined,
  );
}
