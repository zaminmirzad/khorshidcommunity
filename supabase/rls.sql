-- Enable RLS on all tables
alter table public.members enable row level security;
alter table public.membership_requests enable row level security;
alter table public.payments enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- Helper: check if the current user is an admin
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.members
    where user_id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ─────────────────────────────────────────────────────────────────────────────
-- MEMBERS policies
-- ─────────────────────────────────────────────────────────────────────────────

-- A member can read their own row; admins can read all rows
create policy "members: read own or admin reads all"
  on public.members for select
  using (user_id = auth.uid() or public.is_admin());

-- A member can update their own row; admins can update any row
create policy "members: update own or admin updates all"
  on public.members for update
  using (user_id = auth.uid() or public.is_admin());

-- Only the service role (admin client) can insert — handled server-side after invite
create policy "members: service role inserts"
  on public.members for insert
  with check (false); -- blocked for normal users; service role bypasses RLS

-- Only admins can delete members
create policy "members: admin deletes"
  on public.members for delete
  using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- MEMBERSHIP REQUESTS policies
-- ─────────────────────────────────────────────────────────────────────────────

-- Anyone (including unauthenticated) can submit a request
create policy "requests: public can insert"
  on public.membership_requests for insert
  with check (true);

-- Only admins can read requests
create policy "requests: admin reads all"
  on public.membership_requests for select
  using (public.is_admin());

-- Only admins can update (approve / reject)
create policy "requests: admin updates"
  on public.membership_requests for update
  using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- PAYMENTS policies
-- ─────────────────────────────────────────────────────────────────────────────

-- A member can see their own payments; admins can see all
create policy "payments: read own or admin reads all"
  on public.payments for select
  using (
    member_id in (select id from public.members where user_id = auth.uid())
    or public.is_admin()
  );

-- Only service role inserts (Stripe webhook uses admin client)
create policy "payments: service role inserts"
  on public.payments for insert
  with check (false);
