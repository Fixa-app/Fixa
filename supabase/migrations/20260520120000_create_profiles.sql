-- Profiles table: one row per authenticated user, with admin flag.
-- The ADMIN_EMAILS env var stays as a bootstrap fallback in the app code,
-- so the bootstrap admin can never be locked out via the UI.

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_email_idx on public.profiles(email);

-- Auto-create a profile row whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (user_id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper used by RLS policies to check admin status without recursion.
-- security definer + locked search_path so it can read profiles even when the
-- calling role is restricted by RLS.
create or replace function public.is_admin(uid uuid)
returns boolean
security definer
set search_path = public
language sql
stable
as $$
  select coalesce((select is_admin from public.profiles where user_id = uid), false);
$$;

-- RLS: users see themselves, admins see and edit everyone.
alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using (user_id = auth.uid());

create policy "Admins can read all profiles"
  on public.profiles for select
  to authenticated
  using (public.is_admin(auth.uid()));

create policy "Admins can update profiles"
  on public.profiles for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Backfill profiles for any users who signed up before this migration ran.
insert into public.profiles (user_id, email)
select id, email from auth.users
on conflict (user_id) do nothing;

-- Seed bootstrap admin (matches ADMIN_EMAILS env var).
update public.profiles
set is_admin = true
where email = 'niek.vanleeuwen@gmail.com';
