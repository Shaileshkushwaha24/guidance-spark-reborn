-- Fix SECURITY DEFINER views - change to SECURITY INVOKER

-- Drop and recreate public_counselor_profiles view with SECURITY INVOKER
DROP VIEW IF EXISTS public.public_counselor_profiles;

CREATE VIEW public.public_counselor_profiles 
WITH (security_invoker = true)
AS
SELECT 
  id,
  bio,
  experience_years,
  hourly_rate,
  is_available,
  languages,
  profile_picture_url,
  verification_status,
  full_name,
  specialization,
  certifications,
  qualifications,
  rating,
  total_reviews,
  total_sessions
FROM public.counselor_profiles
WHERE verification_status = 'verified';

-- Regrant access
GRANT SELECT ON public.public_counselor_profiles TO authenticated;
GRANT SELECT ON public.public_counselor_profiles TO anon;

-- Drop and recreate public_reviews view with SECURITY INVOKER
DROP VIEW IF EXISTS public.public_reviews;

CREATE VIEW public.public_reviews 
WITH (security_invoker = true)
AS
SELECT 
  id,
  counselor_id,
  rating,
  comment,
  created_at,
  session_id
FROM public.reviews;

-- Regrant access
GRANT SELECT ON public.public_reviews TO authenticated;
GRANT SELECT ON public.public_reviews TO anon;