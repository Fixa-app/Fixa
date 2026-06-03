-- Distinguish pro users (who create/run a company) from client users
-- (homeowners who log into the marketing-side hub). Defaults to 'pro', so all
-- existing rows and self-signups stay pros. The client-invite flow sets
-- 'client' by passing account_type in the signup auth metadata.
--
-- Written idempotently: the column was already added out-of-band on the remote,
-- so re-running must converge rather than error.

alter table public.profiles
  add column if not exists account_type text not null default 'pro';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_account_type_check'
  ) then
    alter table public.profiles
      add constraint profiles_account_type_check
      check (account_type in ('pro', 'client'));
  end if;
end $$;

-- Carry the intended type through auth metadata at signup. Only an explicit
-- 'client' is honoured; anything else falls back to 'pro'.
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (user_id, email, account_type)
  values (
    new.id,
    new.email,
    case
      when new.raw_user_meta_data->>'account_type' = 'client' then 'client'
      else 'pro'
    end
  );
  return new;
end;
$$;
