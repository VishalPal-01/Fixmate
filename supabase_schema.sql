-- FixMate Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ============================================================
-- DROP EXISTING OLD TABLES AND TRIGGERS (CLEAN SLATE)
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop old non-prefixed tables if they exist
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.technician_profiles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop existing fixmate_* tables if re-running
DROP TABLE IF EXISTS public.fixmate_reviews CASCADE;
DROP TABLE IF EXISTS public.fixmate_bookings CASCADE;
DROP TABLE IF EXISTS public.fixmate_technician_profiles CASCADE;
DROP TABLE IF EXISTS public.fixmate_profiles CASCADE;


-- ============================================================
-- 1. FIXMATE_PROFILES TABLE (one row per authenticated user)
-- ============================================================
CREATE TABLE public.fixmate_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  email       TEXT,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'provider')),
  category    TEXT,    -- only used when role = 'provider'
  avatar_url  TEXT,
  address     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 2. FIXMATE_TECHNICIAN_PROFILES TABLE (one row per provider user)
-- ============================================================
CREATE TABLE public.fixmate_technician_profiles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID UNIQUE REFERENCES public.fixmate_profiles(id) ON DELETE CASCADE,
  name             TEXT,
  title            TEXT,
  category         TEXT,
  bio              TEXT,
  price_start      INTEGER DEFAULT 299,
  experience_years INTEGER DEFAULT 1,
  area             TEXT,
  skills           TEXT[] DEFAULT '{}',
  verified         BOOLEAN DEFAULT FALSE,
  online           BOOLEAN DEFAULT TRUE,
  rating           NUMERIC(3, 2) DEFAULT 5.0,
  review_count     INTEGER DEFAULT 0,
  completed_jobs   INTEGER DEFAULT 0,
  response_time    TEXT DEFAULT '~15 min',
  distance_km      NUMERIC(4, 1) DEFAULT 1.5,
  avatar_url       TEXT,
  badges           TEXT[] DEFAULT '{}',
  languages        TEXT[] DEFAULT '{"English", "Hindi"}',
  gallery          INTEGER[] DEFAULT '{1, 2, 3}',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- AUTO-SYNC NEW AUTH USER -> FIXMATE_PROFILES & TECHNICIAN PROFILES
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  user_name TEXT;
  user_category TEXT;
BEGIN
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
  user_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  user_category := NEW.raw_user_meta_data->>'category';

  INSERT INTO public.fixmate_profiles (id, name, email, phone, role, category)
  VALUES (
    NEW.id,
    user_name,
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    user_role,
    user_category
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    category = EXCLUDED.category;

  IF user_role = 'provider' THEN
    INSERT INTO public.fixmate_technician_profiles (user_id, name, category, title)
    VALUES (
      NEW.id,
      user_name,
      COALESCE(user_category, 'plumbing'),
      initcap(COALESCE(user_category, 'plumbing')) || ' Specialist'
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 3. FIXMATE_BOOKINGS TABLE
-- ============================================================
CREATE TABLE public.fixmate_bookings (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref    TEXT UNIQUE,
  customer_id    UUID REFERENCES public.fixmate_profiles(id) ON DELETE CASCADE,
  provider_id    UUID REFERENCES public.fixmate_profiles(id) ON DELETE SET NULL,
  technician_id  UUID REFERENCES public.fixmate_technician_profiles(id) ON DELETE SET NULL,
  provider_ref   TEXT,
  service        TEXT NOT NULL,
  scheduled_for  TIMESTAMPTZ,
  address        TEXT,
  notes          TEXT,
  price          INTEGER,
  status         TEXT NOT NULL DEFAULT 'requested'
                   CHECK (status IN ('requested', 'accepted', 'en_route', 'in_progress', 'completed', 'cancelled')),
  timeline       JSONB DEFAULT '[]',
  eta            TEXT,
  cancel_reason  TEXT,
  rated          BOOLEAN DEFAULT FALSE,
  rating_given   INTEGER CHECK (rating_given BETWEEN 1 AND 5),
  review_comment TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 4. FIXMATE_REVIEWS TABLE
-- ============================================================
CREATE TABLE public.fixmate_reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID REFERENCES public.fixmate_bookings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.fixmate_profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.fixmate_profiles(id) ON DELETE CASCADE,
  service     TEXT,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.fixmate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixmate_technician_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixmate_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixmate_reviews ENABLE ROW LEVEL SECURITY;

-- fixmate_profiles policies
CREATE POLICY "fixmate_profiles_select_all" ON public.fixmate_profiles FOR SELECT USING (true);
CREATE POLICY "fixmate_profiles_insert_own" ON public.fixmate_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "fixmate_profiles_update_own" ON public.fixmate_profiles FOR UPDATE USING (auth.uid() = id);

-- fixmate_technician_profiles policies
CREATE POLICY "fixmate_tech_profiles_select_all" ON public.fixmate_technician_profiles FOR SELECT USING (true);
CREATE POLICY "fixmate_tech_profiles_insert_own" ON public.fixmate_technician_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fixmate_tech_profiles_update_own" ON public.fixmate_technician_profiles FOR UPDATE USING (auth.uid() = user_id);

-- fixmate_bookings policies
CREATE POLICY "fixmate_bookings_customer_select" ON public.fixmate_bookings
  FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = provider_id);

CREATE POLICY "fixmate_bookings_customer_insert" ON public.fixmate_bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "fixmate_bookings_update_parties" ON public.fixmate_bookings
  FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = provider_id);

-- fixmate_reviews policies
CREATE POLICY "fixmate_reviews_select_all" ON public.fixmate_reviews FOR SELECT USING (true);
CREATE POLICY "fixmate_reviews_insert_customer" ON public.fixmate_reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);
