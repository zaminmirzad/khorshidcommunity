-- Fees table (synced from Stripe)
create table if not exists fees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  stripe_price_id text not null unique,
  stripe_product_id text,
  amount integer not null, -- in cents
  currency text not null default 'usd',
  active boolean not null default true,
  is_public boolean not null default false,
  created_at timestamptz default now()
);

-- Fee assignments: admin assigns a fee to one or more members
create table if not exists fee_assignments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  product_id uuid not null references fees(id) on delete cascade,
  assigned_by uuid references members(id),
  assigned_at timestamptz default now(),
  note text,
  label text,           -- e.g. "2024–2025" cycle label
  paid boolean not null default false,
  paid_at timestamptz
  -- no unique constraint: same fee can be assigned multiple times (rebilling)
);

-- Add fee reference to payments
alter table payments add column if not exists product_id uuid references fees(id);
alter table payments add column if not exists stripe_price_id text;

-- RLS: fees
alter table fees enable row level security;

create policy "Admins can manage fees"
  on fees for all
  using (is_admin());

-- RLS: fee_assignments
alter table fee_assignments enable row level security;

create policy "Members can view their own assignments"
  on fee_assignments for select
  using (member_id = (select id from members where user_id = auth.uid()));

create policy "Admins can manage assignments"
  on fee_assignments for all
  using (is_admin());
