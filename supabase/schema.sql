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

alter table public.contact_submissions enable row level security;
alter table public.agent_tasks enable row level security;
alter table public.email_events enable row level security;
alter table public.tooling_status enable row level security;

grant usage on schema public to anon, authenticated;

grant insert on public.contact_submissions to anon, authenticated;
grant insert on public.agent_tasks to anon, authenticated;
grant insert on public.email_events to anon, authenticated;

grant select on public.tooling_status to anon, authenticated;

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
