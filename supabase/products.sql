-- Products table (synced from Stripe)
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  stripe_price_id text not null unique,
  stripe_product_id text,
  amount integer not null, -- in cents
  currency text not null default 'usd',
  active boolean not null default true,
  is_public boolean not null default false, -- visible to all members
  created_at timestamptz default now()
);

-- Member-product assignments (for private/pinned products)
create table if not exists member_products (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  assigned_by uuid references members(id),
  assigned_at timestamptz default now(),
  note text,
  unique(member_id, product_id)
);

-- Add product reference to payments
alter table payments add column if not exists product_id uuid references products(id);
alter table payments add column if not exists stripe_price_id text;

-- RLS: products
alter table products enable row level security;

create policy "Authenticated users can view active products"
  on products for select
  to authenticated
  using (active = true);

create policy "Admins can manage products"
  on products for all
  using (is_admin());

-- RLS: member_products
alter table member_products enable row level security;

create policy "Members can view their own assignments"
  on member_products for select
  using (member_id = (select id from members where user_id = auth.uid()));

create policy "Admins can manage assignments"
  on member_products for all
  using (is_admin());
