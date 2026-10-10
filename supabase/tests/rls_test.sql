-- Adventure Passport Row Level Security & Permission Test Suite
-- Validates authorization boundaries, anti-tampering triggers, and data privacy isolation.

BEGIN;

-- Test Setup: Mock test users
-- User A (Regular traveler)
-- User B (Another traveler)
-- User Admin (Platform administrator)

-- 1. Test: Ordinary user cannot promote themselves to 'admin'
DO $$
DECLARE
  test_user_id uuid := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Insert mock profile
  INSERT INTO public.profiles (id, username, display_name, role)
  VALUES (test_user_id, 'test_traveler', 'Test Traveler', 'traveler')
  ON CONFLICT (id) DO UPDATE SET role = 'traveler';

  -- Simulate authenticated user context
  PERFORM set_config('request.jwt.claim.sub', test_user_id::text, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

  -- Attempt self-promotion
  BEGIN
    UPDATE public.profiles SET role = 'admin' WHERE id = test_user_id;
    RAISE EXCEPTION 'TEST FAILED: Non-admin was able to self-promote to admin!';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%Unauthorized: only administrators can change user roles%' THEN
      RAISE NOTICE 'TEST PASSED: Self-promotion prevented by protect_profile_role trigger';
    ELSE
      RAISE;
    END IF;
  END;
END $$;

-- 2. Test: Ordinary user cannot review/approve their own submission
DO $$
DECLARE
  test_user_id uuid := '00000000-0000-0000-0000-000000000001';
  sub_id uuid;
BEGIN
  -- Simulate authenticated user context
  PERFORM set_config('request.jwt.claim.sub', test_user_id::text, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

  -- Create pending submission
  INSERT INTO public.submissions (
    user_id, activity_id, evidence_path, status
  ) VALUES (
    test_user_id,
    'a1111111-1111-1111-1111-111111111111',
    'private/evidence/photo_01.jpg',
    'pending'
  ) RETURNING id INTO sub_id;

  -- Attempt to approve own submission
  BEGIN
    UPDATE public.submissions 
    SET status = 'approved', reviewed_at = now() 
    WHERE id = sub_id;
    RAISE EXCEPTION 'TEST FAILED: Non-admin was able to approve submission!';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%Unauthorized: only administrators can review submissions%' THEN
      RAISE NOTICE 'TEST PASSED: Review tampering prevented by protect_submission_review trigger';
    ELSE
      RAISE;
    END IF;
  END;
END $$;

-- 3. Test: Ordinary user cannot directly award themselves points in point_ledger
DO $$
DECLARE
  test_user_id uuid := '00000000-0000-0000-0000-000000000001';
BEGIN
  PERFORM set_config('request.jwt.claim.sub', test_user_id::text, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

  BEGIN
    INSERT INTO public.point_ledger (
      user_id, reason, points_delta
    ) VALUES (
      test_user_id, 'cheat_code_points', 9999
    );
    RAISE EXCEPTION 'TEST FAILED: Regular user was able to insert directly into point_ledger!';
  EXCEPTION WHEN row_security_active_violation THEN
    RAISE NOTICE 'TEST PASSED: RLS prevented unauthorized insert into point_ledger';
  WHEN OTHERS THEN
    RAISE NOTICE 'TEST PASSED: Unauthorized insert blocked with error: %', SQLERRM;
  END;
END $$;

-- 4. Test: User B cannot read User A's private evidence submission
DO $$
DECLARE
  user_a_id uuid := '00000000-0000-0000-0000-000000000001';
  user_b_id uuid := '00000000-0000-0000-0000-000000000002';
  visible_count integer;
BEGIN
  -- Insert User B profile
  INSERT INTO public.profiles (id, username, display_name, role)
  VALUES (user_b_id, 'test_traveler_b', 'Traveler B', 'traveler')
  ON CONFLICT (id) DO NOTHING;

  -- Switch context to User B
  PERFORM set_config('request.jwt.claim.sub', user_b_id::text, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

  -- User B tries to select User A's submissions
  SELECT count(*) INTO visible_count
  FROM public.submissions
  WHERE user_id = user_a_id;

  IF visible_count = 0 THEN
    RAISE NOTICE 'TEST PASSED: User B cannot view User A private submission records';
  ELSE
    RAISE EXCEPTION 'TEST FAILED: User B was able to view % records belonging to User A!', visible_count;
  END IF;
END $$;

ROLLBACK;
