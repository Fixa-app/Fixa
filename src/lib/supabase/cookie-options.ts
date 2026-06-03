/**
 * Parent-domain scope for the Supabase auth cookie.
 *
 * When set (production only, e.g. ".hifixa.com"), the session cookie is shared
 * across hifixa.com and every subdomain (app.hifixa.com, a future client hub,
 * ...). This is what lets the marketing site show a logged-in state and the pro
 * app share the same session — "Model B".
 *
 * Left undefined on localhost and Vercel previews: localhost has no hifixa.com,
 * and *.vercel.app is a public suffix where a Domain cookie is rejected. In
 * those environments cookies stay host-only and everything works as before.
 */
export const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined;
