-- Diagnostic + retry: previous seed didn't take. Join to auth.users so the
-- match is against the source-of-truth email, not profiles.email (in case
-- those drift). Case-insensitive + trim to be safe.
do $$
declare
  v_user_count int;
  v_profile_count int;
  v_admin_before int;
  v_updated int;
  v_admin_after int;
  v_user_emails text;
  v_profile_emails text;
begin
  select count(*) into v_user_count from auth.users;
  select count(*) into v_profile_count from public.profiles;
  select count(*) into v_admin_before from public.profiles where is_admin = true;
  select string_agg(email, ', ') into v_user_emails from auth.users;
  select string_agg(email || ':' || coalesce(is_admin::text, 'null'), ', ')
    into v_profile_emails from public.profiles;

  raise notice 'BEFORE: auth.users=% profiles=% admins=%', v_user_count, v_profile_count, v_admin_before;
  raise notice 'auth.users emails: [%]', v_user_emails;
  raise notice 'profiles rows: [%]', v_profile_emails;

  update public.profiles p
  set is_admin = true, updated_at = now()
  from auth.users u
  where p.user_id = u.id
    and lower(trim(u.email)) = 'niek.vanleeuwen@gmail.com';

  get diagnostics v_updated = row_count;
  select count(*) into v_admin_after from public.profiles where is_admin = true;

  raise notice 'AFTER: updated=% admins=%', v_updated, v_admin_after;
end;
$$;
