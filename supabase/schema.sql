-- ============================================================
-- Roles_for_you_  |  Supabase schema
-- Run this once in the Supabase SQL editor (or via CLI migration)
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- ENUM TYPES ----------
do $$ begin
  create type job_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type job_type as enum ('Full Time', 'Internship', 'Apprenticeship', 'Part Time');
exception when duplicate_object then null; end $$;

-- ---------- JOBS TABLE ----------
create table if not exists public.jobs (
  id uuid primary key default uuid_generate_v4(),
  company_name text not null,
  company_logo text,                     -- storage URL
  company_description text,
  job_title text not null,
  slug text not null unique,
  category text not null default 'Other',
  job_type job_type not null default 'Full Time',
  location text not null default 'India',
  experience text not null default 'Fresher',
  qualification text not null default 'Any Graduate',
  batch text,
  salary text,
  job_id text,
  requisition_id text,
  description text not null default '',   -- sanitized HTML from rich text editor
  skills text[] not null default '{}',
  application_url text not null,
  apply_button_text text not null default 'Apply Now',
  deadline date,
  posted_date date not null default current_date,
  status job_status not null default 'draft',
  featured boolean not null default false,
  urgent boolean not null default false,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- INDEXES ----------
create index if not exists idx_jobs_title on public.jobs using gin (to_tsvector('english', job_title));
create index if not exists idx_jobs_company on public.jobs (company_name);
create index if not exists idx_jobs_category on public.jobs (category);
create index if not exists idx_jobs_location on public.jobs (location);
create index if not exists idx_jobs_status on public.jobs (status);
create index if not exists idx_jobs_deadline on public.jobs (deadline);
create index if not exists idx_jobs_posted_date on public.jobs (posted_date desc);
create index if not exists idx_jobs_slug on public.jobs (slug);

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_jobs_updated_at on public.jobs;
create trigger trg_jobs_updated_at
before update on public.jobs
for each row execute function public.set_updated_at();

-- ---------- CONTACT MESSAGES (optional, for the Contact page) ----------
create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.jobs enable row level security;
alter table public.contact_messages enable row level security;

-- Public (anon + authenticated) can read only published jobs
drop policy if exists "Public can read published jobs" on public.jobs;
create policy "Public can read published jobs"
  on public.jobs
  for select
  using (status = 'published');

-- Authenticated admin (any logged-in Supabase user in this project) can do everything.
-- Because only YOU will ever have an account in this project, "authenticated"
-- is equivalent to "admin". Do not enable public sign-ups in Supabase Auth.
drop policy if exists "Admin full access" on public.jobs;
create policy "Admin full access"
  on public.jobs
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Anyone can submit a contact message; only the admin can read them
drop policy if exists "Anyone can insert contact message" on public.contact_messages;
create policy "Anyone can insert contact message"
  on public.contact_messages
  for insert
  with check (true);

drop policy if exists "Admin can read contact messages" on public.contact_messages;
create policy "Admin can read contact messages"
  on public.contact_messages
  for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET for company logos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('company-logos', 'company-logos', true)
on conflict (id) do nothing;

drop policy if exists "Public can view logos" on storage.objects;
create policy "Public can view logos"
  on storage.objects for select
  using (bucket_id = 'company-logos');

drop policy if exists "Admin can upload logos" on storage.objects;
create policy "Admin can upload logos"
  on storage.objects for insert
  with check (bucket_id = 'company-logos' and auth.role() = 'authenticated');

drop policy if exists "Admin can update logos" on storage.objects;
create policy "Admin can update logos"
  on storage.objects for update
  using (bucket_id = 'company-logos' and auth.role() = 'authenticated');

drop policy if exists "Admin can delete logos" on storage.objects;
create policy "Admin can delete logos"
  on storage.objects for delete
  using (bucket_id = 'company-logos' and auth.role() = 'authenticated');

-- ============================================================
-- SAMPLE DATA
-- ============================================================
insert into public.jobs (
  company_name, job_title, slug, category, job_type, location, experience,
  qualification, batch, salary, job_id, requisition_id, description, skills,
  application_url, deadline, posted_date, status, featured, urgent, is_sample
) values
(
  'EY',
  'Analyst – Assurance – National – ASU – Audit – Standards & Methodologies',
  'ey-analyst-assurance-2026',
  'Finance',
  'Full Time',
  'Bangalore',
  '0-1 Years',
  'BCA',
  '2025 / 2026',
  '₹6 LPA',
  'EY-ASU-2026',
  'REQ-10234',
  '<p>EY is looking for an Analyst to join the Assurance – Standards & Methodologies team. This is a great opportunity for freshers to start a career in audit and assurance at a global professional services firm.</p><h3>Responsibilities</h3><ul><li>Support audit engagement teams with documentation and standards compliance</li><li>Research and apply auditing standards and methodologies</li><li>Assist with quality review processes</li></ul>',
  array['Communication', 'MS Excel', 'Attention to Detail', 'Audit Basics'],
  'https://careers.ey.com/',
  '2026-08-28',
  '2026-08-15',
  'published',
  true,
  false,
  true
),
(
  'Concentrix',
  'Representative, Operations',
  'concentrix-representative-operations-2026',
  'Customer Support',
  'Full Time',
  'Hyderabad',
  'Check as per JD',
  'Any Graduate',
  'Check below link',
  '₹6 LPA',
  'CNX-OPS-2026',
  'REQ-88213',
  '<p>Concentrix is hiring Operations Representatives for its Hyderabad center. Full training provided.</p><h3>What you will do</h3><ul><li>Handle customer queries across voice/non-voice channels</li><li>Maintain quality and productivity targets</li><li>Escalate complex issues appropriately</li></ul>',
  array['Communication', 'Customer Service', 'Basic Computer Skills'],
  'https://careers.concentrix.com/',
  null,
  '2026-08-14',
  'published',
  false,
  false,
  true
),
(
  'HSBC',
  'Operations Support – Apprenticeship (12 Months)',
  'hsbc-operations-support-apprenticeship-2026',
  'Banking',
  'Apprenticeship',
  'India',
  '0-2 Years',
  'Any Graduate',
  null,
  '₹6 LPA',
  '55926',
  'REQ-55926',
  '<p>HSBC is offering a 12-month Operations Support Apprenticeship, a great launchpad into global banking operations.</p><h3>Program highlights</h3><ul><li>Structured 12-month rotational learning program</li><li>Hands-on exposure to banking operations</li><li>Mentorship from senior HSBC leaders</li></ul>',
  array['Banking Basics', 'MS Office', 'Communication'],
  'https://www.hsbc.com/careers',
  '2026-08-28',
  '2026-08-13',
  'published',
  true,
  true,
  true
)
on conflict (slug) do nothing;
