-- =============================================
-- FIX 1: Counselor Profiles - Hide sensitive data from public
-- =============================================

-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Everyone can view verified counselor profiles" ON public.counselor_profiles;

-- Create a secure view that exposes only non-sensitive counselor data
CREATE OR REPLACE VIEW public.public_counselor_profiles AS
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
  -- EXCLUDED: email, phone, user_id, verification_document_url
FROM public.counselor_profiles
WHERE verification_status = 'verified';

-- Grant access to the public view for authenticated users
GRANT SELECT ON public.public_counselor_profiles TO authenticated;
GRANT SELECT ON public.public_counselor_profiles TO anon;

-- Add policy for authenticated users to view verified counselors' basic info
CREATE POLICY "Authenticated users can view verified counselor public info"
ON public.counselor_profiles
FOR SELECT
USING (
  verification_status = 'verified' 
  AND auth.uid() IS NOT NULL
);

-- =============================================
-- FIX 2: Reviews - Hide student identity from public view
-- =============================================

-- Drop the overly permissive public reviews policy
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;

-- Create a secure view for public review data (no student_id exposed)
CREATE OR REPLACE VIEW public.public_reviews AS
SELECT 
  id,
  counselor_id,
  rating,
  comment,
  created_at,
  session_id
  -- EXCLUDED: student_id
FROM public.reviews;

-- Grant access to the public reviews view
GRANT SELECT ON public.public_reviews TO authenticated;
GRANT SELECT ON public.public_reviews TO anon;

-- Add policy: Only involved parties can see full review details
CREATE POLICY "Counselors can view their reviews"
ON public.reviews
FOR SELECT
USING (
  counselor_id IN (
    SELECT id FROM counselor_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Students can view their own reviews"
ON public.reviews
FOR SELECT
USING (
  student_id IN (
    SELECT id FROM student_profiles WHERE user_id = auth.uid()
  )
);