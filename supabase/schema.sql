-- GetMeFound operating schema
-- Run this in Supabase SQL Editor after creating the project.

create extension if not exists pgcrypto;

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null,
  source text not null default 'website',
  user_agent text,
  ip_hint text,
  status text not null default 'new',
  notes text
);

create table if not exists public.agent_tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  kind text not null,
  priority text not null default 'normal',
  status text not null default 'new',
  source text not null default 'website',
  payload jsonb not null default '{}'::jsonb,
  result jsonb,
  error text
);

create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  provider text not null,
  event_type text not null,
  to_email text not null,
  subject text,
  status text not null,
  provider_id text,
  error text,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists public.tooling_status (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  service text not null unique,
  status text not null,
  detail text,
  metadata jsonb not null default '{}'::jsonb
);

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

create table if not exists public.review_automation_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null,
  client_slug text not null,
  client_name text not null,
  summary jsonb not null default '{}'::jsonb,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists review_automation_events_client_created_idx
on public.review_automation_events (client_slug, created_at desc);

create index if not exists review_automation_events_created_idx
on public.review_automation_events (created_at desc);

create table if not exists public.review_automation_suppressions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_slug text not null,
  customer_email text not null,
  reason text,
  source text,
  unique (client_slug, customer_email)
);

create index if not exists review_automation_suppressions_client_idx
on public.review_automation_suppressions (client_slug);

alter table public.contact_submissions enable row level security;
alter table public.agent_tasks enable row level security;
alter table public.email_events enable row level security;
alter table public.tooling_status enable row level security;
alter table public.client_profiles enable row level security;
alter table public.client_integrations enable row level security;
alter table public.review_automation_events enable row level security;
alter table public.review_automation_suppressions enable row level security;

grant usage on schema public to anon, authenticated, service_role;

grant insert on public.contact_submissions to anon, authenticated;
grant insert on public.agent_tasks to anon, authenticated;
grant insert on public.email_events to anon, authenticated;

grant select on public.tooling_status to anon, authenticated;

grant all privileges on public.contact_submissions to service_role;
grant all privileges on public.agent_tasks to service_role;
grant all privileges on public.email_events to service_role;
grant all privileges on public.tooling_status to service_role;
grant all privileges on public.client_profiles to service_role;
grant all privileges on public.client_integrations to service_role;
grant all privileges on public.review_automation_events to service_role;
grant all privileges on public.review_automation_suppressions to service_role;

drop policy if exists "allow contact submissions insert" on public.contact_submissions;
create policy "allow contact submissions insert"
on public.contact_submissions
for insert
to anon, authenticated
with check (true);

drop policy if exists "allow agent tasks insert" on public.agent_tasks;
create policy "allow agent tasks insert"
on public.agent_tasks
for insert
to anon, authenticated
with check (true);

drop policy if exists "allow email events insert" on public.email_events;
create policy "allow email events insert"
on public.email_events
for insert
to anon, authenticated
with check (true);

drop policy if exists "allow tooling status read" on public.tooling_status;
create policy "allow tooling status read"
on public.tooling_status
for select
to anon, authenticated
using (true);

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

drop policy if exists "service role manages review automation events" on public.review_automation_events;
create policy "service role manages review automation events"
on public.review_automation_events
for all
to service_role
using (true)
with check (true);

drop policy if exists "service role manages review automation suppressions" on public.review_automation_suppressions;
create policy "service role manages review automation suppressions"
on public.review_automation_suppressions
for all
to service_role
using (true)
with check (true);

insert into public.tooling_status (service, status, detail)
values
  ('google_workspace', 'ready', 'Google Workspace and Gmail are live for getmefound.ai.'),
  ('github', 'ready', 'Code is pushed to mje-gmf/website.'),
  ('vercel', 'ready', 'Manual production deploys are working for getmefound.ai.'),
  ('openai', 'ready', 'OpenAI API key is available in local and Vercel env.'),
  ('supabase', 'ready', 'Core operating database is provisioned.'),
  ('resend', 'pending', 'DNS is configured; waiting for domain verification.')
on conflict (service) do update
set status = excluded.status,
    detail = excluded.detail,
    updated_at = now();
