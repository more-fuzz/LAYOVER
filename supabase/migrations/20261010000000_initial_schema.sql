-- Adventure Passport Initial Schema Migration
-- Defines core entities, constraints, indexes, Row Level Security, and auth triggers.

-- ============================================================================
-- 1. Core Tables
-- ============================================================================

-- 1.1 Profiles Table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  display_name text NOT NULL,
  avatar_url text,
  role text NOT NULL DEFAULT 'traveler' CHECK (role IN ('traveler', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT username_length_check CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format_check CHECK (username ~* '^[a-zA-Z0-9_]+$')
);

-- 1.2 Activities Table
CREATE TABLE public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN (
    'hiking', 'climbing', 'diving', 'kayaking', 
    'paragliding', 'caving', 'biking', 'mountaineering'
  )),
  description text NOT NULL,
  difficulty integer NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  latitude numeric(9, 6) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
  longitude numeric(9, 6) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
  base_points integer NOT NULL CHECK (base_points >= 0),
  estimated_cost numeric(10, 2) CHECK (estimated_cost IS NULL OR estimated_cost >= 0),
  requirements text[] NOT NULL DEFAULT '{}'::text[],
  safety_info text NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1.3 Destinations Table
CREATE TABLE public.destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN (
    'historical', 'natural_wonder', 'mystery_trail', 
    'abandoned', 'cultural_heritage'
  )),
  description text NOT NULL,
  historical_context text,
  source_url text,
  latitude numeric(9, 6) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
  longitude numeric(9, 6) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
  access_notes text,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1.4 Rewards Table
CREATE TABLE public.rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  cost_points integer NOT NULL CHECK (cost_points > 0),
  stock integer CHECK (stock IS NULL OR stock >= 0),
  is_active boolean NOT NULL DEFAULT true
);

-- 1.5 Submissions Table
CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  activity_id uuid NOT NULL REFERENCES public.activities(id) ON DELETE RESTRICT,
  evidence_path text NOT NULL,
  claimed_latitude numeric(9, 6) CHECK (claimed_latitude IS NULL OR (claimed_latitude >= -90 AND claimed_latitude <= 90)),
  claimed_longitude numeric(9, 6) CHECK (claimed_longitude IS NULL OR (claimed_longitude >= -180 AND claimed_longitude <= 180)),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  review_notes text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

-- 1.6 Point Ledger Table
CREATE TABLE public.point_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  submission_id uuid REFERENCES public.submissions(id) ON DELETE RESTRICT,
  reason text NOT NULL,
  points_delta integer NOT NULL CHECK (points_delta <> 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Partial Unique Index: Prevent duplicate activity-completion award for the same submission
CREATE UNIQUE INDEX idx_point_ledger_unique_submission_award 
ON public.point_ledger(submission_id) 
WHERE submission_id IS NOT NULL;

-- 1.7 Redemptions Table
CREATE TABLE public.redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  reward_id uuid NOT NULL REFERENCES public.rewards(id) ON DELETE RESTRICT,
  points_spent integer NOT NULL CHECK (points_spent > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1.8 Consent Records Table
CREATE TABLE public.consent_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  terms_version text NOT NULL,
  accepted_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. Performance & Filtering Indexes
-- ============================================================================

CREATE INDEX idx_activities_published_category 
ON public.activities(category) 
WHERE is_published = true;

CREATE INDEX idx_destinations_published_category 
ON public.destinations(category) 
WHERE is_published = true;

CREATE INDEX idx_submissions_user_time 
ON public.submissions(user_id, submitted_at DESC);

CREATE INDEX idx_submissions_pending 
ON public.submissions(submitted_at ASC) 
WHERE status = 'pending';

CREATE INDEX idx_point_ledger_user_time 
ON public.point_ledger(user_id, created_at DESC);

CREATE INDEX idx_redemptions_user_time 
ON public.redemptions(user_id, created_at DESC);

CREATE INDEX idx_consent_records_user 
ON public.consent_records(user_id, accepted_at DESC);

-- ============================================================================
-- 3. Functions and Triggers
-- ============================================================================

-- 3.1 Helper function: check if authenticated user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 3.2 Trigger: Prevent ordinary users from self-promoting to admin or modifying roles
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (NEW.role IS DISTINCT FROM OLD.role) AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: only administrators can change user roles';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_protect_profile_role
BEFORE UPDATE OF role ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- 3.3 Trigger: Prevent regular users from tampering with review decisions or reviewers
CREATE OR REPLACE FUNCTION public.protect_submission_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (
    (NEW.status IS DISTINCT FROM OLD.status) OR
    (NEW.reviewer_id IS DISTINCT FROM OLD.reviewer_id) OR
    (NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at) OR
    (NEW.review_notes IS DISTINCT FROM OLD.review_notes)
  ) AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: only administrators can review submissions';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_protect_submission_review
BEFORE UPDATE OF status, reviewer_id, reviewed_at, review_notes ON public.submissions
FOR EACH ROW EXECUTE FUNCTION public.protect_submission_review();

-- 3.4 Auth Trigger for Profile Initialization
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username text;
  final_username text;
  suffix integer := 1;
BEGIN
  -- Extract username from user metadata or fallback to email prefix
  base_username := coalesce(
    nullif(trim(new.raw_user_meta_data->>'username'), ''),
    split_part(new.email, '@', 1),
    'traveler'
  );

  -- Sanitize username characters (alphanumeric and underscores)
  base_username := regexp_replace(lower(base_username), '[^a-z0-9_]', '', 'g');
  IF length(base_username) < 3 THEN
    base_username := 'traveler_' || substr(new.id::text, 1, 6);
  END IF;

  -- Ensure username uniqueness
  final_username := base_username;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    final_username := base_username || '_' || suffix;
    suffix := suffix + 1;
  END LOOP;

  -- Insert profile, strictly forcing role = 'traveler' (never trust metadata role)
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    avatar_url,
    role
  ) VALUES (
    new.id,
    final_username,
    coalesce(nullif(trim(new.raw_user_meta_data->>'display_name'), ''), final_username),
    nullif(trim(new.raw_user_meta_data->>'avatar_url'), ''),
    'traveler'
  );

  RETURN new;
END;
$$;

-- Trigger firing on auth.users registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 4. Row Level Security (RLS) Configuration
-- ============================================================================

-- Enable RLS across all application tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own non-role profile fields"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Activities Policies
CREATE POLICY "Published activities are viewable by anyone"
ON public.activities FOR SELECT
USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins have full access to activities"
ON public.activities FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Destinations Policies
CREATE POLICY "Published destinations are viewable by anyone"
ON public.destinations FOR SELECT
USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins have full access to destinations"
ON public.destinations FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Submissions Policies
CREATE POLICY "Users can view their own submissions, admins view all"
ON public.submissions FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create their own pending submissions"
ON public.submissions FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND 
  status = 'pending' AND 
  reviewer_id IS NULL AND 
  reviewed_at IS NULL
);

CREATE POLICY "Admins can update submissions (for reviews)"
ON public.submissions FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Users can delete their own pending submissions"
ON public.submissions FOR DELETE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending');

-- Point Ledger Policies
CREATE POLICY "Users can view their own point ledger entries, admins view all"
ON public.point_ledger FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- Client cannot directly INSERT/UPDATE/DELETE point_ledger (only trusted server / service_role)
CREATE POLICY "Disallow client direct write to point_ledger"
ON public.point_ledger FOR INSERT
TO authenticated
WITH CHECK (false);

-- Rewards Policies
CREATE POLICY "Active rewards are viewable by anyone"
ON public.rewards FOR SELECT
USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins have full access to rewards"
ON public.rewards FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Redemptions Policies
CREATE POLICY "Users can view their own redemptions, admins view all"
ON public.redemptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- Disallow direct client redemption insert
CREATE POLICY "Disallow direct client redemption insert"
ON public.redemptions FOR INSERT
TO authenticated
WITH CHECK (false);

-- Consent Records Policies
CREATE POLICY "Users can view their own consent records, admins view all"
ON public.consent_records FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can record their own terms consent"
ON public.consent_records FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
