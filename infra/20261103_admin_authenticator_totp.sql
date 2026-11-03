-- Native Supabase Auth TOTP for Mineuri administrator accounts only.
-- Students and public visitors are unaffected by this admin policy.
create or replace function public.admin_mobile_gate()
returns boolean
language plpgsql stable security definer set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
begin
  if uid is null then return true; end if;
  if not exists (
    select 1 from public.admin_members m
    where m.user_id = uid
  ) then return true; end if;
  if not exists (
    select 1 from auth.mfa_factors factor
    where factor.user_id = uid and factor.factor_type = 'totp' and factor.status = 'verified'
  ) then return true; end if;
  return coalesce(auth.jwt()->>'aal','aal1') = 'aal2';
end $$;
revoke all on function public.admin_mobile_gate() from public, anon;
grant execute on function public.admin_mobile_gate() to authenticated, service_role;

drop function if exists public.admin_mobile_backend(text,jsonb);
drop schema if exists admin_mfa_private cascade;
