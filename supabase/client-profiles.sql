-- GetMeFound client profile tables
-- Run this in Supabase SQL Editor when adding Supabase-backed client hubs.

create extension if not exists pgcrypto;

create table if not exists public.client_profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null unique,
  business_name text not null,
  owner_name text not null default '',
  plan text not null default 'Get Found',
  status text not null default 'setup',
  status_label text not null default 'Setup in progress',
  website text not null default '',
  phone text not null default '',
  email text not null default '',
  google_review_url text not null default '',
  location text not null default '',
  category text not null default '',
  source text not null default 'gmf',
  profile jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists client_profiles_slug_idx
on public.client_profiles (slug);

create index if not exists client_profiles_status_idx
on public.client_profiles (status);

create table if not exists public.client_integrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_slug text not null,
  system_name text not null,
  system_type text not null default 'pos_crm',
  connection_level text not null default 'manual_upload',
  status text not null default 'planned',
  review_ready_event text not null default '',
  export_available boolean not null default false,
  zapier_available boolean not null default false,
  make_available boolean not null default false,
  webhook_available boolean not null default false,
  api_available boolean not null default false,
  admin_contact text not null default '',
  consent_notes text not null default '',
  send_delay_days integer not null default 1,
  notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  unique (client_slug, system_name)
);

create index if not exists client_integrations_client_idx
on public.client_integrations (client_slug);

alter table public.client_profiles enable row level security;
alter table public.client_integrations enable row level security;

grant usage on schema public to service_role;
grant all privileges on public.client_profiles to service_role;
grant all privileges on public.client_integrations to service_role;

drop policy if exists "service role manages client profiles" on public.client_profiles;
create policy "service role manages client profiles"
on public.client_profiles
for all
to service_role
using (true)
with check (true);

drop policy if exists "service role manages client integrations" on public.client_integrations;
create policy "service role manages client integrations"
on public.client_integrations
for all
to service_role
using (true)
with check (true);
