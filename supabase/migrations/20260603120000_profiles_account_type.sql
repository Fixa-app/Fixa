-- Distinguish pro users (who create/run a company) from client users
-- (homeowners who log into the marketing-side hub). Defaults to 'pro', so all
-- existing rows and self-signups stay pros. The client-invite flow sets
-- 'client' by passing account_type in the signup auth metadata.

alter table public.profiles
  add column account_type text not null default 'pro'
  check (account_type in ('pro', 'client'));

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
