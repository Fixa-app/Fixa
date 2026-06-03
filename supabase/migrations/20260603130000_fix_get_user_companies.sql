-- The deployed company_members table has no `joined_at` column (the
-- 20260521000000 migration was applied out-of-band with a different shape:
-- id, company_id, user_id, role, created_at, updated_at). The existing
-- get_user_companies() selects cm.joined_at, so it errors at runtime and every
-- caller (header menu, account page) sees "no companies".
--
-- Recreate it against the real schema, aliasing created_at as joined_at so the
-- return signature is unchanged.

create or replace function public.get_user_companies(p_user_id uuid)
returns table (
  company_id uuid,
  company_name text,
  user_role company_role,
  joined_at timestamptz
)
security definer
set search_path = public
language sql
stable
as $$
  select
    c.id   as company_id,
    c.name as company_name,
    cm.role::company_role as user_role,
    cm.created_at as joined_at
  from public.companies c
  inner join public.company_members cm on c.id = cm.company_id
  where cm.user_id = p_user_id
  order by cm.created_at asc;
$$;
