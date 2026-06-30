create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date timestamptz not null,
  location text,
  capacity integer,
  is_free boolean not null default true,
  product_id uuid references products(id),
  active boolean not null default true,
  created_by uuid references members(id),
  created_at timestamptz default now()
);

create table if not exists event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  registered_at timestamptz default now(),
  status text not null default 'registered',
  unique(event_id, member_id)
);

alter table events enable row level security;
alter table event_registrations enable row level security;

do $$ begin
  create policy "Authenticated users can view active events" on events for select to authenticated using (active = true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Admins can manage events" on events for all using (is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Members can view their registrations" on event_registrations for select using (member_id = (select id from members where user_id = auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Members can register" on event_registrations for insert with check (member_id = (select id from members where user_id = auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Members can update their registration" on event_registrations for update using (member_id = (select id from members where user_id = auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Admins can manage registrations" on event_registrations for all using (is_admin());
exception when duplicate_object then null; end $$;
