-- Contact form submissions
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'unread',
  submitted_at timestamptz default now(),
  resolved_at timestamptz
);

-- Announcements (admin creates, members read)
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_by uuid references members(id),
  created_at timestamptz default now(),
  active boolean not null default true
);

-- Track which members have read which announcements
create table if not exists announcement_reads (
  member_id uuid not null references members(id) on delete cascade,
  announcement_id uuid not null references announcements(id) on delete cascade,
  read_at timestamptz default now(),
  primary key (member_id, announcement_id)
);

-- RLS
alter table contact_submissions enable row level security;
alter table announcements enable row level security;
alter table announcement_reads enable row level security;

do $$ begin
  create policy "Admins can manage contact submissions" on contact_submissions for all using (is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Members can view active announcements" on announcements for select to authenticated using (active = true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Admins can manage announcements" on announcements for all using (is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Members can manage their own reads" on announcement_reads for all using (member_id = (select id from members where user_id = auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Admins can view all reads" on announcement_reads for select using (is_admin());
exception when duplicate_object then null; end $$;
