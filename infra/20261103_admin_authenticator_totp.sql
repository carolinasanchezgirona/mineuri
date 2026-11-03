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

-- Restrict direct PostgREST and Storage requests as well as the login UI.
-- Preserve the existing permissive policies, which still enforce ownership.
do $$
declare target record;
begin
  for target in
    select n.nspname as schema_name, c.relname as table_name
    from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where c.relkind='r' and c.relrowsecurity
      and (n.nspname='public' or (n.nspname='storage' and c.relname='objects'))
  loop
    execute format('drop policy if exists admin_mobile_mfa_gate on %I.%I',target.schema_name,target.table_name);
    execute format(
      'create policy admin_mobile_mfa_gate on %I.%I as restrictive for all to authenticated using ((select public.admin_mobile_gate())) with check ((select public.admin_mobile_gate()))',
      target.schema_name,target.table_name);
  end loop;
end $$;

drop function if exists public.admin_mobile_backend(text,jsonb);
drop schema if exists admin_mfa_private cascade;
