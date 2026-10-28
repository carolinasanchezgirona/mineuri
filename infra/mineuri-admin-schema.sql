-- Mineuri Admin · esquema inicial para un proyecto Supabase EXCLUSIVO
-- No ejecutar en los proyectos clínicos existentes.
create table public.admin_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check(role in ('owner','editor')),
  created_at timestamptz not null default now()
);
create table public.resources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  audience text not null check(audience in ('personas','psicologos','neuropsicologos','centros')),
  topic text,
  format text not null default 'pdf',
  status text not null default 'draft' check(status in ('draft','review','published','archived')),
  is_free boolean not null default false,
  price_cents integer check(price_cents >= 0),
  cover_path text,
  file_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create table public.site_sections (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null,
  section_key text not null,
  headline text not null default '',
  body text not null default '',
  image_path text,
  status text not null default 'draft' check(status in ('draft','published')),
  updated_at timestamptz not null default now(),
  unique(page_slug, section_key)
);
create table public.admin_audit (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  occurred_at timestamptz not null default now()
);
alter table public.admin_members enable row level security;
alter table public.resources enable row level security;
alter table public.site_sections enable row level security;
alter table public.admin_audit enable row level security;
-- La pertenencia debe provisionarse manualmente desde un operador de confianza.
-- Nunca otorgar autoalta a admin_members desde el navegador.
create policy "read own membership" on public.admin_members
for select to authenticated using (user_id = (select auth.uid()));
create policy "public read published resources" on public.resources
for select to anon, authenticated using (status = 'published');
create policy "editors read all resources" on public.resources
for select to authenticated using (
 exists(select 1 from public.admin_members m where m.user_id = (select auth.uid()))
);
create policy "editors insert resources" on public.resources
for insert to authenticated with check (
 exists(select 1 from public.admin_members m where m.user_id = (select auth.uid()))
);
create policy "editors update resources" on public.resources
for update to authenticated using (
 exists(select 1 from public.admin_members m where m.user_id = (select auth.uid()))
) with check (
 exists(select 1 from public.admin_members m where m.user_id = (select auth.uid()))
);
create policy "public read published sections" on public.site_sections
for select to anon, authenticated using (status = 'published');
create policy "editors read sections" on public.site_sections
for select to authenticated using (
 exists(select 1 from public.admin_members m where m.user_id = (select auth.uid()))
);
create policy "editors insert sections" on public.site_sections
for insert to authenticated with check (
 exists(select 1 from public.admin_members m where m.user_id = (select auth.uid()))
);
create policy "editors update sections" on public.site_sections
for update to authenticated using (
 exists(select 1 from public.admin_members m where m.user_id = (select auth.uid()))
) with check (
 exists(select 1 from public.admin_members m where m.user_id = (select auth.uid()))
);
-- No policies for audit, membership modification, or delete: server-side only.
-- All audits should be generated via a trusted server endpoint, not the browser.
-- Add private storage buckets with authenticated policies after connecting project.
