-- ─────────────────────────────────────────────────────────────────────────────
-- MEMBERS
-- One row per registered user. Linked to Supabase Auth via user_id.
-- ─────────────────────────────────────────────────────────────────────────────
create table public.members (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null unique,
  email         text not null,
  full_name     text not null,
  phone         text,
  role          text not null default 'member' check (role in ('member', 'admin')),
  joined_at     timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- MEMBERSHIP REQUESTS
-- Submitted by the public before they are invited/registered.
-- ─────────────────────────────────────────────────────────────────────────────
create table public.membership_requests (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  email         text not null,
  phone         text,
  message       text,
  status        text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_at  timestamptz default now(),
  reviewed_at   timestamptz,
  reviewed_by   uuid references public.members(id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- PAYMENTS
-- Written by the Stripe webhook after a confirmed checkout session.
-- ─────────────────────────────────────────────────────────────────────────────
create table public.payments (
  id                  uuid primary key default gen_random_uuid(),
  member_id           uuid references public.members(id) on delete set null,
  stripe_session_id   text not null unique,
  amount              integer not null, -- in cents
  currency            text not null default 'usd',
  description         text,
  status              text not null default 'paid' check (status in ('paid', 'refunded')),
  paid_at             timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- AUTO-UPDATE updated_at ON MEMBERS
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger members_updated_at
  before update on public.members
  for each row execute procedure public.handle_updated_at();
