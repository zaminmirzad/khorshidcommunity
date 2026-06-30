-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title_en text NOT NULL,
  title_fa text,
  bio_en text,
  bio_fa text,
  photo_url text,
  storage_path text,
  is_president boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Public can view active team members" ON team_members FOR SELECT USING (active = true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admins can manage team members" ON team_members FOR ALL USING (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'admin')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Site stats
CREATE TABLE IF NOT EXISTS site_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL,
  label_en text NOT NULL,
  label_fa text,
  icon text NOT NULL DEFAULT '📊',
  sort_order int NOT NULL DEFAULT 0
);

ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Public can view site stats" ON site_stats FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admins can manage site stats" ON site_stats FOR ALL USING (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'admin')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Seed default stats (run only once)
INSERT INTO site_stats (number, label_en, label_fa, icon, sort_order) VALUES
  ('1,200+', 'Active Members', 'اعضای فعال', '👥', 0),
  ('40+', 'Monthly Programs', 'برنامه ماهانه', '📅', 1),
  ('15', 'Partner Orgs', 'سازمان شریک', '🤝', 2),
  ('$250K+', 'Community Support', 'حمایت اجتماعی', '💝', 3)
ON CONFLICT DO NOTHING;

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role_label text,
  quote text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Public can view active testimonials" ON testimonials FOR SELECT USING (active = true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL USING (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'admin')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Programs
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT '🎯',
  title_en text NOT NULL,
  title_fa text,
  desc_en text,
  desc_fa text,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Public can view active programs" ON programs FOR SELECT USING (active = true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admins can manage programs" ON programs FOR ALL USING (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'admin')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
