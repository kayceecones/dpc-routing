-- DPC Routing MVP Migration
-- Run this in the Supabase SQL editor

-- Providers table
create table if not exists providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  location text,
  city text,
  state text,
  zip text,
  phone text,
  email text,
  website text,
  monthly_cost numeric,
  enrollment_fee numeric,
  accepting_patients boolean default true,
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) on delete cascade
);

-- Specialists table
create table if not exists specialists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text,
  location text,
  city text,
  state text,
  phone text,
  email text
);

-- Referrals table
create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  from_provider_id uuid references providers(id) on delete cascade,
  to_provider_id uuid references providers(id) on delete set null,
  to_specialist_id uuid references specialists(id) on delete set null,
  patient_name text not null,
  note text,
  referral_type text check (referral_type in ('dpc', 'specialist')),
  created_at timestamptz default now(),
  constraint referral_target_check check (
    (to_provider_id is not null and to_specialist_id is null) or
    (to_provider_id is null and to_specialist_id is not null)
  )
);

-- Row Level Security
alter table providers enable row level security;
alter table specialists enable row level security;
alter table referrals enable row level security;

-- Providers: public read, owner write
create policy "providers_public_read" on providers
  for select using (true);

create policy "providers_owner_insert" on providers
  for insert with check (auth.uid() = user_id);

create policy "providers_owner_update" on providers
  for update using (auth.uid() = user_id);

create policy "providers_owner_delete" on providers
  for delete using (auth.uid() = user_id);

-- Specialists: public read
create policy "specialists_public_read" on specialists
  for select using (true);

-- Referrals: providers can read referrals they sent or received
create policy "referrals_read" on referrals
  for select using (
    from_provider_id in (select id from providers where user_id = auth.uid())
    or to_provider_id in (select id from providers where user_id = auth.uid())
  );

create policy "referrals_insert" on referrals
  for insert with check (
    from_provider_id in (select id from providers where user_id = auth.uid())
  );

-- Seed data: 5 fake providers (no user_id, so they won't be editable)
insert into providers (name, bio, location, city, state, zip, phone, email, website, monthly_cost, enrollment_fee, accepting_patients)
values
  ('Dr. Sarah Chen', 'Board-certified family physician with 12 years of DPC experience. Focused on preventive care and chronic disease management.', '412 Elm St, Austin, TX 78701', 'Austin', 'TX', '78701', '512-555-0101', 'schen@austindpc.com', 'https://austindpc.com', 75, 150, true),
  ('Dr. Marcus Webb', 'Internal medicine physician passionate about affordable, relationship-based primary care for adults and families.', '88 Oak Ave, Denver, CO 80203', 'Denver', 'CO', '80203', '720-555-0202', 'mwebb@denverdpc.com', 'https://denverdpc.com', 85, 100, true),
  ('Dr. Priya Nair', 'Family medicine physician serving the Nashville community. Special interest in womens health and pediatric care.', '220 Maple Rd, Nashville, TN 37201', 'Nashville', 'TN', '37201', '615-555-0303', 'pnair@nashvilledpc.com', null, 65, 0, true),
  ('Dr. James Okafor', 'DPC physician focused on underserved communities in the Phoenix metro area. Fluent in English and Igbo.', '550 Desert Blvd, Phoenix, AZ 85001', 'Phoenix', 'AZ', '85001', '602-555-0404', 'jokafor@phoenixdpc.com', 'https://phoenixdpc.org', 70, 75, false),
  ('Dr. Leila Farsi', 'Concierge-style DPC practice in Seattle. Emphasis on mental health integration and whole-person care.', '900 Pine St, Seattle, WA 98101', 'Seattle', 'WA', '98101', '206-555-0505', 'lfarsi@seattledpc.com', 'https://seattledpc.com', 95, 200, true);

-- Claimed column on providers
alter table providers add column if not exists claimed boolean default false;

-- Allow authenticated users to claim unclaimed profiles
create policy "providers_claim" on providers
  for update
  using (user_id is null)
  with check (auth.uid() = user_id);

-- Patient inquiries table
create table if not exists patient_inquiries (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references providers(id) on delete cascade,
  patient_name text not null,
  patient_email text not null,
  message text,
  created_at timestamptz default now(),
  read boolean default false
);

alter table patient_inquiries enable row level security;

-- Anyone can submit an inquiry
create policy "inquiries_insert"
  on patient_inquiries for insert
  with check (true);

-- Only the provider can read their own inquiries
create policy "inquiries_read"
  on patient_inquiries for select
  using (
    provider_id in (
      select id from providers where user_id = auth.uid()
    )
  );

-- Only the provider can update (mark as read) their own inquiries
create policy "inquiries_update"
  on patient_inquiries for update
  using (
    provider_id in (
      select id from providers where user_id = auth.uid()
    )
  );

-- Seed data: 5 fake specialists
insert into specialists (name, specialty, location, city, state, phone, email)
values
  ('Dr. Kevin Park', 'Cardiology', '1001 Heart Way, Austin, TX 78702', 'Austin', 'TX', '512-555-1001', 'kpark@austincardio.com'),
  ('Dr. Anita Rosen', 'Dermatology', '333 Skin Ln, Denver, CO 80204', 'Denver', 'CO', '720-555-1002', 'arosen@denverderm.com'),
  ('Dr. Tom Bradley', 'Orthopedics', '77 Joint Blvd, Nashville, TN 37202', 'Nashville', 'TN', '615-555-1003', 'tbradley@nashvilleortho.com'),
  ('Dr. Maya Singh', 'Endocrinology', '400 Glucose Ave, Phoenix, AZ 85002', 'Phoenix', 'AZ', '602-555-1004', 'msingh@phoenixendo.com'),
  ('Dr. Carlos Rivera', 'Psychiatry', '600 Mind St, Seattle, WA 98102', 'Seattle', 'WA', '206-555-1005', 'crivera@seattlepsych.com');
