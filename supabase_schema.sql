-- ==============================================================================
-- ASSOCIATION OF CHANDPUR SUST - SUPABASE DATABASE SCHEMA & SEED SCRIPT
-- ==============================================================================
-- Run this entire script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- It creates the 3 categories:
--   1) people (executive, general, teacher, staff)
--   2) events (events, photo galleries, captions)
--   3) front_page_content, culture_cards, purpose_cards (front page texts)
--   4) admin_settings (site-wide configuration like logo URL)
-- ==============================================================================

-- ==============================
-- SUPABASE STORAGE SETUP (Manual)
-- ==============================
-- 1. Go to Supabase Dashboard -> Storage
-- 2. Create a new bucket named "assets" with PUBLIC access
-- 3. Folder structure will be created automatically:
--    assets/logo/       - Site logo
--    assets/members/    - Member profile photos
--    assets/events/     - Event gallery photos
-- 4. Set the bucket policy to allow authenticated uploads:
--    - INSERT for authenticated users
--    - SELECT for everyone (public read)

-- ==============================
-- SUPABASE AUTH SETUP (Manual)
-- ==============================
-- 1. Go to Supabase Dashboard -> Authentication -> Users
-- 2. Click "Add User" -> "Create New User"
-- 3. Email: acsust@chandpur.com
-- 4. Password: ch@ndpurva@ya
-- 5. Check "Auto Confirm User"

-- ==============================================================================
-- TABLE DEFINITIONS
-- ==============================================================================

-- 1. FRONT PAGE INFORMATION
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.front_page_content (
    key TEXT PRIMARY KEY,
    section TEXT NOT NULL,
    content TEXT NOT NULL,
    label TEXT
);

-- 2. CULTURE CARDS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.culture_cards (
    id SERIAL PRIMARY KEY,
    icon TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INT DEFAULT 0
);

-- 3. PURPOSE CARDS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.purpose_cards (
    id SERIAL PRIMARY KEY,
    step_num TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INT DEFAULT 0
);

-- 4. PEOPLE INFORMATION (with social & contact links)
-- If your table already exists, run this one-line migration in Supabase SQL Editor:
-- ALTER TABLE public.people ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '';
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.people (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('executive', 'general', 'teacher', 'staff')),
    name TEXT NOT NULL,
    dept TEXT NOT NULL,
    area TEXT DEFAULT '',
    position TEXT DEFAULT '',
    session TEXT DEFAULT '',
    photo_url TEXT DEFAULT '',
    display_order INT DEFAULT 0,
    -- Contact & Social Links
    phone TEXT DEFAULT '',
    facebook_url TEXT DEFAULT '',
    instagram_url TEXT DEFAULT '',
    email TEXT DEFAULT '',
    bio TEXT DEFAULT ''
);

-- 5. EVENT INFORMATION
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date_text TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    thumb TEXT DEFAULT '',
    emoji TEXT DEFAULT '🎭',
    photos JSONB DEFAULT '[]'::jsonb,
    captions JSONB DEFAULT '[]'::jsonb,
    display_order INT DEFAULT 0
);

-- 6. ADMIN SETTINGS (site-wide configuration)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    label TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.front_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.culture_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purpose_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Public READ policies (everyone can read)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Front Page') THEN
    CREATE POLICY "Public Read Front Page" ON public.front_page_content FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Culture Cards') THEN
    CREATE POLICY "Public Read Culture Cards" ON public.culture_cards FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Purpose Cards') THEN
    CREATE POLICY "Public Read Purpose Cards" ON public.purpose_cards FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read People') THEN
    CREATE POLICY "Public Read People" ON public.people FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Events') THEN
    CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Admin Settings') THEN
    CREATE POLICY "Public Read Admin Settings" ON public.admin_settings FOR SELECT USING (true);
  END IF;
END $$;

-- Authenticated WRITE policies (only logged-in admin can modify)
DO $$
BEGIN
  -- front_page_content
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Write Front Page') THEN
    CREATE POLICY "Admin Write Front Page" ON public.front_page_content FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
  -- culture_cards
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Write Culture Cards') THEN
    CREATE POLICY "Admin Write Culture Cards" ON public.culture_cards FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
  -- purpose_cards
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Write Purpose Cards') THEN
    CREATE POLICY "Admin Write Purpose Cards" ON public.purpose_cards FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
  -- people
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Write People') THEN
    CREATE POLICY "Admin Write People" ON public.people FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
  -- events
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Write Events') THEN
    CREATE POLICY "Admin Write Events" ON public.events FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
  -- admin_settings
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Write Settings') THEN
    CREATE POLICY "Admin Write Settings" ON public.admin_settings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;


-- ==============================================================================
-- SEED DATA: FRONT PAGE INFORMATION
-- ==============================================================================
INSERT INTO public.front_page_content (key, section, content, label) VALUES
('hero_badge', 'hero', 'Shahjalal University of Science & Technology', 'Hero Badge'),
('hero_title', 'hero', '<em>Association of</em><br>Chandpur', 'Hero Main Title'),
('hero_subtitle', 'hero', 'Unity · Culture · Heritage · SUST', 'Hero Subtitle'),
('hero_desc', 'hero', 'Bringing together the students of Chandpur — the land of great rivers, silver Hilsha, and timeless culture — under one roof at SUST, Sylhet.', 'Hero Description'),
('about_label', 'about', 'About the Association', 'About Section Label'),
('about_title', 'about', 'Rooted in <em>Chandpur</em>,<br>Thriving at SUST', 'About Section Title'),
('about_p1', 'about', 'The Association of Chandpur at Shahjalal University of Science and Technology (SUST), Sylhet, is a vibrant community of students hailing from the culturally rich district of Chandpur, Bangladesh. Founded to foster solidarity and belonging, we welcome every Chandpur student who walks through SUST''s gates.', 'About Paragraph 1'),
('about_p2', 'about', 'Far from home, we become each other''s family — sharing stories of the Padma , Meghna and Dakatia rivers, the taste of fresh Hilsha, and the warmth of Chandpur''s festivals. We bridge homesickness with brotherhood, turning a university corridor into a piece of Chandpur.', 'About Paragraph 2'),
('about_p3', 'about', 'Beyond bonding, we represent Chandpur''s voice across SUST''s diverse association landscape — collaborating, contributing, and celebrating our heritage with pride.', 'About Paragraph 3'),
('stat_members_num', 'about', '100<span>+</span>', 'Stat: Active Members Count'),
('stat_members_label', 'about', 'Active Members', 'Stat: Active Members Label'),
('stat_depts_num', 'about', '28', 'Stat: Departments Count'),
('stat_depts_label', 'about', 'Departments', 'Stat: Departments Label'),
('stat_events_num', 'about', '8<span>+</span>', 'Stat: Annual Events Count'),
('stat_events_label', 'about', 'Annual Events', 'Stat: Annual Events Label'),
('culture_label', 'culture', 'The Land We Come From', 'Culture Section Label'),
('culture_title', 'culture', 'The <em>Rich Legacy</em> of Chandpur', 'Culture Section Title'),
('culture_desc', 'culture', 'Chandpur is no ordinary district. Nestled at the confluence of the mighty Meghna, Dakatia and Padma rivers, it is a land of extraordinary natural beauty, deep cultural heritage, and the crown jewel of Bangladesh''s fisheries — the Ilish (Hilsha).', 'Culture Description'),
('purpose_label', 'purpose', 'Our Mission', 'Purpose Section Label'),
('purpose_title', 'purpose', 'Why We <em>Exist</em>', 'Purpose Section Title'),
('purpose_desc', 'purpose', 'Every Chandpur student at SUST deserves a home away from home. We exist to build that home — strong, warm, and unbreakable.', 'Purpose Description'),
('footer_desc', 'footer', 'Association of Chandpur at SUST — uniting the voices of a river district within the halls of Shahjalal University of Science and Technology, Sylhet.', 'Footer Description'),
('footer_copyright', 'footer', '© 2025 Association of Chandpur · <span class="sust-tag">SUST, Sylhet</span>', 'Footer Copyright'),
('footer_credit', 'footer', 'made by · <span class="sust-tag">Fahim Ahammad Tanvir</span>', 'Footer Credit'),
('footer_motto', 'footer', 'Land of Rivers · Land of Hilsha · Our Home', 'Footer Motto')
ON CONFLICT (key) DO UPDATE SET content = EXCLUDED.content, label = EXCLUDED.label;

-- Culture Cards Seed
DELETE FROM public.culture_cards;
INSERT INTO public.culture_cards (icon, title, description, display_order) VALUES
('🐟', 'Land of Ilish', 'Chandpur is the Ilish (Hilsha) capital of Bangladesh. The Meghna river yields the finest Hilsha in the world — a fish so celebrated it''s woven into Bengali identity and culture.', 1),
('🌊', 'Great Rivers', 'Bounded by Meghna, Dakatia, and Padma rivers, Chandpur''s landscape is shaped by water — a flowing, breathing geography that gives life, trade, and poetry to the district.', 2),
('🎭', 'Vibrant Culture', 'From Baul music to riverine folklore, Chandpur''s culture is a tapestry of traditions — jari gaan, shari gaan, and local festivals that echo centuries of Bengali heritage.', 3),
('🏛️', 'Historical Richness', 'Home to ancient mosques, temples, and colonial-era landmarks, Chandpur carries deep historical weight — from the liberation war to pre-Mughal architecture.', 4);

-- Purpose Cards Seed
DELETE FROM public.purpose_cards;
INSERT INTO public.purpose_cards (step_num, title, description, display_order) VALUES
('01', 'Connect & Build Community', 'We connect Chandpur students across all departments and batches, creating a tight-knit network that transcends academic boundaries.', 1),
('02', 'Assert Our Cultural Identity', 'We celebrate Chandpur''s unique culture — from Hilsha festivals to river heritage events — ensuring our identity shines within SUST''s multicultural campus.', 2),
('03', 'Support & Mentor', 'Senior members guide freshmen through academic and social challenges. Every newcomer from Chandpur gets a mentor, a friend, and a direction.', 3),
('04', 'Represent at SUST', 'We engage with other district associations and student unions — making Chandpur''s presence felt, respected, and valued across the university.', 4);


-- ==============================================================================
-- SEED DATA: PEOPLE INFORMATION
-- ==============================================================================
DELETE FROM public.people;

-- Executive Committee
INSERT INTO public.people (category, name, dept, area, position, session, display_order) VALUES
('executive', 'Zakaria Talukdar Omio', 'Public Administration', 'Haziganj', 'President', '21-22', 1),
('executive', 'Ali Ashraf Tanvir', 'Computer Science & Engineering', 'Matlab Uttar', 'General Secretary', '21-22', 2),
('executive', 'Abdul Mannan Nirjon', 'Public Administration', 'Haimchar', 'Senior Vice President', '21-22', 3),
('executive', 'Mahin Ibrahim', 'Chemistry', 'Kachua', 'Vice President', '21-22', 4),
('executive', 'Fakhrul Islam', 'Industrial & Production Engineering', 'Haimchar', 'Vice President', '21-22', 5),
('executive', 'Shahid Hasan Joy', 'Industrial & Production Engineering', 'Haimchar', 'Vice President', '21-22', 6),
('executive', 'Tahsin Ornob', 'Physics', 'Haziganj', 'Organizing Secretary', '22-23', 7),
('executive', 'Sadman Zaman Litun', 'Statistics', 'Matlab Uttar', 'Joint Secretary', '22-23', 8),
('executive', 'Nayeem Ahmed', 'Mechanical Engineering', 'Matlab Uttar', 'IT Secretary', '22-23', 9),
('executive', 'Farhan Ahmed Kafil', 'Chemical Engineering & Polymer Science', 'Chandpur Sadar', 'Treasurer', '22-23', 10),
('executive', 'Rumman Ahmed', 'Chemistry', 'Chandpur Sadar', 'Deputy Treasurer', '22-23', 11),
('executive', 'Meher Afroz', 'Mechanical Engineering', 'Shahrasti', 'Office Secretary', '22-23', 12),
('executive', 'Tanvir Ahmad Emon', 'Statistics', 'Haziganj', 'Sports Secretary', '22-23', 13),
('executive', 'Shafin Ahmed', 'Public Administration', 'Matlab Uttar', 'Deputy Sports Secretary', '22-23', 14),
('executive', 'Jannatul Nayeema', 'English', 'Chandpur Sadar', 'Cultural Secretary', '22-23', 15),
('executive', 'Jayma Afrin', 'Business Administration', 'Shahrasti', 'Human Rights Secretary', '22-23', 16),
('executive', 'Mahbub Mahi', 'Chemical Engineering & Polymer Science', 'Chandpur Sadar', 'Media Secretary', '22-23', 17),
('executive', 'Antik Chakraborty', 'Economics', 'Chandpur Sadar', 'Publication Secretary', '22-23', 18),
('executive', 'Shafayat Rahman Navin', 'Anthropology', 'Matlab Dakshin', 'Assistant General Secretary', '22-23', 19),
('executive', 'Bayezid Hossain', 'English', 'Haziganj', 'Assistant General Secretary', '22-23', 20),
('executive', 'Tarek Hossain', 'Biochemistry & Molecular Biology', 'Faridganj', 'Assistant IT Secretary', '23-24', 21),
('executive', 'Arzu Sultana Anon', 'Computer Science & Engineering', 'Kachua', 'Assistant IT Secretary', '23-24', 22),
('executive', 'Wasimul Islam Rabbi', 'Statistics', 'Haimchar', 'Assistant Organizing Secretary', '23-24', 23),
('executive', 'Junaeid Hossain', 'Computer Science & Engineering', 'Faridganj', 'Assistant Organizing Secretary', '23-24', 24),
('executive', 'Mezbah Mahi', 'Statistics', 'Haziganj', 'Assistant Organizing Secretary', '23-24', 25),
('executive', 'Emon Hossain', 'Statistics', 'Matlab Uttar', 'Assistant Treasurer', '23-24', 26),
('executive', 'Rakib Mamun', 'Mechanical Engineering', 'Faridganj', 'Assistant Treasurer', '23-24', 27),
('executive', 'Fajlay Raiyan', 'Mechanical Engineering', 'Matlab Uttar', 'Assistant Office Secretary', '23-24', 28),
('executive', 'Ismail Hossain Tonmoy', 'Geography & Environment', 'Faridganj', 'Assistant Office Secretary', '23-24', 29),
('executive', 'Fabiha Bushra Dilshad', 'Genetic Engineering & Biotechnology', 'Matlab Uttar', 'Assistant Publication Secretary', '23-24', 30),
('executive', 'Md Fahim Ahammad Tanvir', 'Software Engineering', 'Haimchar', 'Assistant Publication Secretary', '23-24', 31),
('executive', 'Maryam Chowdhury', 'Economics', 'Kachua', 'Assistant Human Rights Secretary', '23-24', 32),
('executive', 'Shahinur Akter Mitu', 'Economics', 'Kachua', 'Assistant Cultural Secretary', '23-24', 33),
('executive', 'Takaful Islam Karima', 'Civil & Environmental Engineering', 'Chandpur Sadar', 'Assistant Cultural Secretary', '23-24', 34),
('executive', 'Samira Shaiba Athoi', 'Geography & Environment', 'Shahrasti', 'Assistant Cultural Secretary', '23-24', 35),
('executive', 'Mohammad Noman', 'Mechanical Engineering', 'Faridganj', 'Assistant Media Secretary', '23-24', 36),
('executive', 'Fardin Islam Rijvy', 'Software Engineering', 'Haziganj', 'Assistant Sports Secretary', '23-24', 37),
('executive', 'Nahid Hossain', 'Genetic Engineering & Biotechnology', 'Faridganj', 'Assistant Sports Secretary', '23-24', 38),
('executive', 'Asm Raihanul Hasan', 'Genetic Engineering & Biotechnology', 'Shahrasti', 'Assistant Sports Secretary', '23-24', 39);

-- General Members
INSERT INTO public.people (category, name, dept, area, session) VALUES
('general', 'Mehedi Hasan Tareq', 'Software Engineering', 'Haimchar', '21-22'),
('general', 'Priya Rani', 'Computer Science & Engineering', 'Haimchar', '22-23'),
('general', 'Sami', 'Software Engineering', 'Chandpur Sadar', '22-23'),
('general', 'Tasnova Tamacchin Nihat', 'Software Engineering', 'Chandpur Sadar', '22-23'),
('general', 'Al-Amin Mollik', 'Mechanical Engineering', 'Faridganj', '22-23'),
('general', 'Mahbubur Rahman Mahi', 'Chemical Engineering & Polymer Science', 'Chandpur Sadar', '22-23'),
('general', 'Sayad Ahmed', 'Food Engineering & Tea Technology', 'Chandpur Sadar', '22-23'),
('general', 'Mohammad Atikur Rahman Ratul', 'Electrical & Electronic Engineering', 'Chandpur Sadar', '23-24'),
('general', 'Saliha Rahman', 'Sociology', 'Faridganj', '23-24'),
('general', 'Muslim Talukder Rifat', 'Statistics', 'Chandpur Sadar', '24-25'),
('general', 'Ariyan Rahman Shanil', 'Statistics', 'Haimchar', '24-25'),
('general', 'Mohammad Mostafizur Rahman', 'Statistics', 'Matlab Uttar', '24-25'),
('general', 'Md Sajid Hossean', 'Statistics', 'Faridganj', '24-25'),
('general', 'Musfiq Ahmad', 'Statistics', 'Faridganj', '24-25'),
('general', 'Manjur Hasan Fahim', 'Software Engineering', 'Chandpur Sadar', '24-25'),
('general', 'Imtiyaz Ahmed Emon', 'Software Engineering', 'Kachua', '24-25'),
('general', 'Zakaria Morshed', 'Software Engineering', 'Chandpur Sadar', '24-25'),
('general', 'Muhammad Iftekharul Islam', 'Physics', 'Chandpur Sadar', '24-25'),
('general', 'Sabit Ahnaf', 'Physics', 'Kachua', '24-25'),
('general', 'Nowshin Mahmud Chamak', 'Physics', 'Matlab Uttar', '24-25'),
('general', 'Tanzim Ahmed Mahim', 'Chemistry', 'Matlab Uttar', '24-25'),
('general', 'Iqbal Sami', 'Chemistry', 'Haziganj', '24-25'),
('general', 'Farhan Sadeque', 'Forestry & Environmental Science', 'Kachua', '24-25'),
('general', 'Rakibul Hasan Moin', 'Forestry & Environmental Science', 'Kachua', '24-25'),
('general', 'Tanvir Hassan', 'Business Administration', 'Kachua', '24-25'),
('general', 'Md Nabil Khan', 'Business Administration', 'Chandpur Sadar', '24-25'),
('general', 'Md Farhan Muntasir Nehal', 'Electrical & Electronic Engineering', 'Kachua', '24-25'),
('general', 'Md Hasebul Hasan Rippy', 'Civil & Environmental Engineering', 'Haimchar', '24-25'),
('general', 'Swastika Naha Arpa', 'Chemical Engineering & Polymer Science', 'Chandpur Sadar', '24-25'),
('general', 'Arifa Binta Alam', 'Food Engineering & Tea Technology', 'Haziganj', '24-25'),
('general', 'Noor Hossain Alif', 'Geography & Environment', 'Faridganj', '24-25'),
('general', 'Md Moshiur Rahman Sami', 'Oceanography', 'Chandpur Sadar', '24-25'),
('general', 'Mishkat Jahan Mithila', 'Public Administration', 'Chandpur Sadar', '24-25'),
('general', 'Md Sabbir Ahmed Osmani', 'Political Studies', 'Kachua', '24-25'),
('general', 'Sabrina Sarmin Tanisha', 'Social Work', 'Chandpur Sadar', '24-25'),
('general', 'Saiem Qibria', 'Industrial & Production Engineering', 'Matlab Uttar', '24-25'),
('general', 'Bushra Ahmed', 'Sociology', 'Chandpur Sadar', '25-26'),
('general', 'Ishrat Jahan Esha', 'Civil & Environmental Engineering', 'Hajiganj', '25-26'),
('general', 'Tahiyat Nuren Ohi', 'Statistics', 'Chandpur Sadar', '25-26'),
('general', 'Fouzia Farook', 'Mechanical Engineering', 'Chandpur Sadar', '25-26'),
('general', 'Rouzatun rumman', 'Petroleum & Mining Engineering', 'Chandpur Sadar', '25-26'),
('general', 'Nusaiba Binte Zaman', 'Industrial & Production Engineering', 'Shahrasti', '25-26'),
('general', 'Sushanto das', 'Bangla', 'Shahrasti', '25-26'),
('general', 'Apurbo Raihan', 'Physics', 'Shahrasti', '25-26'),
('general', 'Md Sajjadul Karim Sinha', 'Physics', 'Matlab Uttar', '25-26'),
('general', 'Sadman Sakib Sami', 'English', 'Matlab Uttar', '25-26'),
('general', 'MD Wasif Patwary', 'Software Engineering', 'Chandpur Sadar', '25-26'),
('general', 'Abrar Zahin', 'Business Administration', 'Matlab Uttar', '25-26'),
('general', 'Tasin Ibrahim', 'Business Administration', 'Kachua', '25-26'),
('general', 'Abdullah Al Noman Bhuiyan', 'Sociology', 'Chandpur Sadar', '25-26'),
('general', 'Tahsin Mostofa', 'Civil & Environmental Engineering', 'Shahrasti', '25-26'),
('general', 'Pronoy Shil Om', 'Civil & Environmental Engineering', 'Hajiganj', '25-26'),
('general', 'Simanta biswas', 'Chemistry', 'Matlab Uttar', '25-26'),
('general', 'Joynal Abedin', 'Biochemistry and Molecular Biology', 'Matlab Uttar', '25-26'),
('general', 'Mahmudul Alam Anik', 'Electrical & Electronic Engineering', 'Hajiganj', '25-26'),
('general', 'Ashraful Alam Ishti', 'Computer Science & Engineering', 'Chandpur Sadar', '25-26'),
('general', 'Nabil ahmad talukder', 'Statistics', 'Matlab Uttar', '25-26'),
('general', 'Aurnob Saha', 'Statistics', 'Chandpur Sadar', '25-26'),
('general', 'Ahmed Farhaz Khan', 'Statistics', 'Chandpur Sadar', '25-26'),
('general', 'Md. Fahmi Alam', 'Industrial & Production Engineering', 'Shahrasti', '25-26');

-- Teachers from Chandpur
INSERT INTO public.people (category, name, dept, position, phone) VALUES
('teacher', 'Dr. SM Saiful Islam', 'Chemistry', 'Professor', '8801972448030'),
('teacher', 'Dr. Md Zakir Hossain', 'Statistics', 'Professor', '8801711140801'),
('teacher', 'Dr. Mirza Nazmul Hasan', 'Statistics', 'Professor', '8801767013458'),
('teacher', 'Dr. Mohammad Jasim Uddin', 'Sociology', 'Professor', '8801715055869'),
('teacher', 'Dr Mohammad Abdul Hannan Pradhan', 'Economics', 'Professor', '8801731247170'),
('teacher', 'Dr. Masud Alam', 'Economics', 'Professor', '8801770340474'),
('teacher', 'Dr. Nur Mohammad Majumder', 'Anthropology', 'Professor', '8801815107547'),
('teacher', 'Dr. Nilufa Aktar', 'Bangla', 'Professor', '8801711013131'),
('teacher', 'Dr Mohammad Razaul Karim', 'Chemistry', 'Professor', '8801750200968'),
('teacher', 'Syed Towfiq Mahmood Hasan', 'Business Administration', 'Professor', '8801715018035'),
('teacher', 'Dr. Mohammad Abdullah-Al-Shoeb', 'Biochemistry and Molecular Biology', 'Professor', '8801787501398'),
('teacher', 'Dr. Mohammad Shaiful Alam Amin', 'Chemical Engineering & Polymer Science', 'Professor', '8801717466578'),
('teacher', 'Md. Syamul Bashar', 'Mechanical Engineering', 'Assistant Professor', '8801307486552'),
('teacher', 'Shahla Safwat Ravhee', 'Architecture', 'Assistant Professor', '8801675868645'),
('teacher', 'Mahabub Alam', 'Food Engineering & Tea Technology', 'Assistant Professor', '8801837572299'),
('teacher', 'Md. Mahin Uddin', 'Geography and Environment', 'Lecturer', '8801580380279');

-- Staff from Chandpur
INSERT INTO public.people (category, name, dept, position) VALUES
('staff', 'Mr. Helan Hossain Dewan', 'Accounts', 'Assistant Director'),
('staff', 'Mr. Md. Hasan Mahmud Khan', 'IICT', 'Technician'),
('staff', 'Mr. Md. Farkul Islam', 'Registrar Office', 'Administrative Officer'),
('staff', 'Mr. Md. Khoka Mia', 'Chemistry', 'Senior Lab Assistant'),
('staff', 'Mr. Md. Nazrul Islam', 'Civil & Environmental Engineering', 'Instrument Engineer'),
('staff', 'Mr. Md. Nasir Uddin Bepari', 'Registrar Office', 'Senior Guest House Attendant'),
('staff', 'Mr. Md. Babul Hossain', 'Forestry & Environmental Science', 'Technician Officer'),
('staff', 'Mr. Abu Yusuf', 'Research Center', 'Officer'),
('staff', 'Mr. Abdul Karim', 'Mathematics', 'Office Attendant'),
('staff', 'Mr. Md. Jakir Hossain', 'Registrar Office', 'Office Assistant'),
('staff', 'Ms. Rina Ferdousi', 'Medical Center', 'Nurse'),
('staff', 'Mr. Monir Hossain', 'Transport', 'Senior Driver'),
('staff', 'Mr. Alauddin Shah', 'Telephone', 'Senior Operator'),
('staff', 'Ms. Farhana Begum', 'Female Hall', 'Assistant'),
('staff', 'Mr. Md. Jitu Mia', 'Anthropology', 'Administrative Officer'),
('staff', 'Mr. Md. Taslim Dewan', 'Registrar Office', 'Senior Guard'),
('staff', 'Mr. Imam Hossain', '2nd Female Hall', 'Senior Guard'),
('staff', 'Mr. Abdur Rob', 'Registrar Office', 'Security Assistant'),
('staff', 'Mr. Anisur Rahman', 'VC Bungalow', 'Senior Gardener'),
('staff', 'Mr. Shahjahan Molla', 'Industrial & Production Engineering', 'Office Attendant'),
('staff', 'Mr. Md. Sohel Ahmed', 'Industrial & Production Engineering', 'Office Attendant');


-- ==============================================================================
-- SEED DATA: EVENT INFORMATION
-- ==============================================================================
DELETE FROM public.events;

INSERT INTO public.events (title, date_text, location, description, thumb, emoji, photos, captions, display_order) VALUES
(
    'Intra Association Football Tournament 2026',
    'July 4, 2026',
    'Mahmudabad Sports Center',
    'From the first whistle to the final blow—every match was filled with excitement, emotion, battle, and memorable moments.Great goals, incredible saves, intense competition, and every moment on the field made this tournament truly special.<br> However, beyond victory and defeat, the greatest achievement of this season was friendship, unity, sportsmanship, and bringing everyone together on one stage.<br> 📸Thank you to all the players, organizers, volunteers, and spectators, whose cooperation and love made the AoC Football Tournament 2026 a grand success<br>.We will meet again with a bigger event, more intense competition, and many more memorable moments.Until then, let the love for football remain unbroken.',
    'football2026/1.jpg',
    '⚽',
    '["football2026/1.jpg","football2026/2.jpg","football2026/3.jpg","football2026/4.jpg","football2026/5.jpg","football2026/6.jpg","football2026/7.jpg","football2026/8.jpg","football2026/9.jpg","football2026/10.jpg"]'::jsonb,
    '[]'::jsonb,
    1
),
(
    '✨ Sha-Pa Day 2026 ✨',
    'May 05, 2026',
    'London Inn',
    'The much-awaited Sha-Pa Day 2026 of our association was successfully celebrated with the enthusiastic participation of students from different batches.<br>The event took place at London Inn Restaurant in Sylhet, creating a warm and memorable atmosphere for everyone present.<br>The program began with a vibrant photo session, followed by a delightful lunch and meaningful interaction among the members. Throughout the event, the spirit of unity, friendship, and shared belonging was beautifully reflected.<br>The day concluded with a renewed commitment to remain connected and work together to make the association even more dynamic, active, and strong in the days ahead.<br>',
    'shapaday2026/1 (1).jpg',
    '🎭',
    '["shapaday2026/1 (1).jpg","shapaday2026/1 (2).jpg","shapaday2026/1 (3).jpg","shapaday2026/IMG-20260505-WA0098.jpg","shapaday2026/1 (5).jpg","shapaday2026/1 (6).jpg","shapaday2026/1 (7).jpg"]'::jsonb,
    '["8th Executive Committee","Batch 22","Batch 23","Batch 24","Batch 23 Boys","President Omio and GS Tanvir Bhai","A Moment of Togetherness"]'::jsonb,
    2
),
(
    'Biennial Conference and Scholarship Ceremony',
    'March 6, 2026',
    'Malancha Community Center , Kumarpara',
    'On 6 March 2026, the Chandpur District Welfare Association, Sylhet, hosted its biennial conference and scholarship award ceremony, attended by Zakaria Talukdar Amio, President of the 8th Executive Committee of the Chandpur Association, Shahjalal University of Science and Technology (SUST), and Organizing Secretary Tahsin Arnav.<br>At the beginning of the event, a commemorative magazine was presented to the President and Organizing Secretary of the Chandpur Association by Mohammad Abu Yusuf, Executive Member of the Chandpur District Welfare Association and Assistant Administrative Officer of SUST. The program also included an Iftar gathering in celebration of the holy month of Ramadan. 🌙<br>After the conference, the President and Organizing Secretary of the Chandpur Association paid a courtesy visit to Professor Dr. S. M. Saiful Islam, Chief Advisor of the Chandpur Association, SUST and Chandpur District Welfare Association, Sylhet, during which they informed him about the association''s current and future activities. Dr. Islam assured full support for the association''s initiatives.<br>Courtesy meetings were also held with Gazi Mohammad Zahirul Islam, President, and Mohammad Mohsin Bhuiya, General Secretary of the Chandpur District Welfare Association, Sylhet. They were informed about the association''s future plans and assured their full support while inviting participation in upcoming events.<br>Additionally, a courtesy visit was made to Gazi Mohammad Zahirul Islam, esteemed advisor of the Chandpur District Student Association, Sylhet Agricultural University, who emphasized the importance of collaboration between the two organizations and invited the association for a meeting at Sylhet Agricultural University.<br>Other distinguished attendees included Engr. Mohammad Abdul Haque Miazi, Assistant Engineer, Sylhet City Corporation; Shah Mohammad Fazle Alam Patwari, Police Inspector, PBI, Sylhet; Mohammad Shahjahan, D.G.M., Jalalabad Gas T&D System Limited; and Engr. Abul Hasnat, Assistant Engineer, Jalalabad Ragib-Rabeya Medical College & Hospital, Sylhet.<br>✨ Through mutual cooperation and unity, it is hoped that the bonds among Chandpur students will grow even stronger.',
    '8.jpg',
    '',
    '["8.jpg","9.jpg","10.jpg","11.jpg","12.jpg"]'::jsonb,
    '[]'::jsonb,
    3
),
(
    'Iftar Mahfil 2025 and General Meeing',
    'February 28, 2026',
    'D Builiding',
    'Association of Chandpur''s Iftar Gathering and General Meeting Successfully Held<br>On February 28, 2026, the Iftar gathering and general meeting of the Association of Chandpur, SUST, were held with great enthusiasm. At the event, the 8th Executive Committee of the organization was officially announced, and important discussions were conducted regarding the future activities of the association.<br>The chief guest of the ceremony was Dr. Saiful Islam, Professor of the Department of Chemistry and Chief Advisor of the Association of Chandpur. The special guest was Mohammad Shaiful Alam Amin, Professor of the Department of Chemical Engineering and Polymer Science and an advisor. Also present was Md. Mahin Uddin, Lecturer of the Department of Geography and Environment and an advisor.<br>Among others present were Gazi Md. Jahirul Islam, President of the Chandpur District Welfare Association, and Md. Mohsin Bhuiyan, General Secretary. Current and former members of the organization, officers and staff, students from various departments, and invited guests spent a lively and cordial time together.<br>Heartfelt thanks are extended to everyone involved for the successful completion of this event. The Association of Chandpur will continue to organize such gatherings and general meetings in the future, further strengthening the bonds of friendship, brotherhood, and unity.',
    '3.jpg',
    '',
    '["3.jpg","7.jpeg","4.jpg","6.jpeg","1.jpg","2.jpg"]'::jsonb,
    '[]'::jsonb,
    4
),
(
    'BBQ Night and Freshers Orientation',
    'November 28, 2025',
    'SUST Basketball Ground',
    'On 28 November 2025, the Association of Chandpur, SUST, organized a grand Freshers'' Reception and BBQ event. Alongside warmly welcoming the new students from Chandpur of the 2024–25 session, the event turned into a vibrant festival of joy, harmony, and reunion.<br>Distinguished guests present at the event included Professor Dr. Saiful Islam, Professor of the Department of Chemistry and esteemed advisor of the Association of Chandpur; Professor Rezaul Karim, Professor of the Department of Chemistry and advisor; Professor Dr. Mirza Nazmul Hasan, Professor of the Department of Statistics and advisor; Professor Dr. Roksana Begum, Professor of the Department of Chemistry and advisor; and Md. Mahin Uddin, Lecturer of the Department of Geography and Environment and advisor.<br>In addition, the event was attended by current and former members of the association, students from various departments, officers and staff, and invited guests. With everyone''s active participation, the program became lively and truly memorable.<br>In the final segment of the event, a musical performance was presented by the newly admitted and current students, making the colorful cultural evening even more enjoyable.<br>Heartfelt thanks to everyone involved for making this event a success. The Association of Chandpur hopes to continue strengthening the bonds of friendship, unity, and cooperation through such gatherings in the future.<br>— Chandpur Association, SUST',
    'bbq2025/1.jpg',
    '',
    '["bbq2025/1.jpg","bbq2025/2.jpg","bbq2025/3.jpg","bbq2025/4.jpg","bbq2025/1.jpeg","bbq2025/2.jpeg","bbq2025/5.jpg"]'::jsonb,
    '[]'::jsonb,
    5
),
(
    'Get together',
    'April 01, 2025',
    'Chandpur Boro Station',
    'On the second day of Eid, 2nd Shawwal 1446, it was quite a delightful and memorable day. The Chandpur Association had been determined to ceremony a get-together event during Eid, and finally, on this day, both current and former SUSTians from Chandpur came together and were bound by a beautiful bond of shared memories and togetherness.<br>',
    'getTogether/1.jpg',
    '',
    '["getTogether/1.jpg","getTogether/2.jpg","getTogether/3.jpg","getTogether/4.jpg","getTogether/5.jpg"]'::jsonb,
    '[]'::jsonb,
    6
),
(
    'Intra-association football tournament',
    'June 27, 2025',
    'Green Valley Sports Center',
    'Our flagship annual event celebrating Chandpur''s rich culture. An evening filled with traditional music, dance, Ilish-themed cuisine, and heartfelt reunions. Students dressed in traditional attire, performed baul songs, and shared stories from the banks of Meghna.',
    'football/3.jpeg',
    '',
    '["football/1.jpeg","football/2.jpeg","football/3.jpeg","football/5.jpeg","football/4.jpeg"]'::jsonb,
    '[]'::jsonb,
    7
),
(
    'Orientation Programm 2023',
    'December 6th, 2023',
    'SUST Research Center, Library',
    'Welcoming our fresh faces and new minds from Chandpur to SUST with warm guidance and mentorship.',
    'Or2023/1.jpeg',
    '🎭',
    '["Or2023/1.jpeg","Or2023/2.jpeg","Or2023/4.jpeg","Or2023/5.jpeg","Or2023/3.jpeg"]'::jsonb,
    '[]'::jsonb,
    8
);

-- ==============================================================================
-- SEED DATA: ADMIN SETTINGS
-- ==============================================================================
INSERT INTO public.admin_settings (key, value, label) VALUES
('logo_url', '', 'Site Logo URL (leave empty to use default pictures/logo.png)')
ON CONFLICT (key) DO NOTHING;
