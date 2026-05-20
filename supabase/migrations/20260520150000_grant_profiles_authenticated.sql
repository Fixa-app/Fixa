-- The Fixa Supabase project has "Automatically expose new tables" turned
-- off, so every new public-schema table needs explicit GRANTs before the
-- authenticated role can query it. Without this, RLS policies never get a
-- chance to run -- Postgres returns 42501 "permission denied" first.
--
-- SELECT: every user reads their own profile (RLS narrows it to that row).
-- UPDATE: admins toggle is_admin on others (RLS narrows it to admins).
grant select, update on public.profiles to authenticated;
