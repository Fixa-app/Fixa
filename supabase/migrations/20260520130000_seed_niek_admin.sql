-- Seed Niek as admin. The initial create_profiles migration tried to do
-- this, but ran before Niek had signed in on prod for the first time, so
-- the update affected zero rows. Now that the profile exists via the
-- on_auth_user_created trigger, run the update again. Idempotent.
update public.profiles
set is_admin = true, updated_at = now()
where email = 'niek.vanleeuwen@gmail.com';
