
-- Fix user_roles RLS - Add INSERT policy for users to set their own role
CREATE POLICY "Users can insert their own role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Expand student_profiles with comprehensive fields
ALTER TABLE public.student_profiles
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS education_level text,
ADD COLUMN IF NOT EXISTS stream text,
ADD COLUMN IF NOT EXISTS skills text[],
ADD COLUMN IF NOT EXISTS learning_preferences text[],
ADD COLUMN IF NOT EXISTS preferred_courses text[],
ADD COLUMN IF NOT EXISTS preferred_countries text[],
ADD COLUMN IF NOT EXISTS budget_min numeric,
ADD COLUMN IF NOT EXISTS budget_max numeric;

-- Expand counselor_profiles with comprehensive fields
ALTER TABLE public.counselor_profiles
ADD COLUMN IF NOT EXISTS certifications text[],
ADD COLUMN IF NOT EXISTS languages text[],
ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_sessions integer DEFAULT 0;

-- Create counseling_sessions table
CREATE TABLE IF NOT EXISTS public.counseling_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  counselor_id uuid NOT NULL REFERENCES public.counselor_profiles(id) ON DELETE CASCADE,
  scheduled_at timestamp with time zone NOT NULL,
  duration_minutes integer DEFAULT 60,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rejected')),
  notes text,
  meeting_link text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.counseling_sessions ENABLE ROW LEVEL SECURITY;

-- Sessions RLS policies
CREATE POLICY "Students can view their own sessions"
ON public.counseling_sessions FOR SELECT
USING (student_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Counselors can view their own sessions"
ON public.counseling_sessions FOR SELECT
USING (counselor_id IN (SELECT id FROM counselor_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can create sessions"
ON public.counseling_sessions FOR INSERT
WITH CHECK (student_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Counselors can update their sessions"
ON public.counseling_sessions FOR UPDATE
USING (counselor_id IN (SELECT id FROM counselor_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can update their sessions"
ON public.counseling_sessions FOR UPDATE
USING (student_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid()));

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.counseling_sessions(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  counselor_id uuid NOT NULL REFERENCES public.counselor_profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(session_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Reviews RLS policies
CREATE POLICY "Anyone can view reviews"
ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Students can create reviews for their sessions"
ON public.reviews FOR INSERT
WITH CHECK (student_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid()));

-- Create trigger for sessions updated_at
CREATE TRIGGER update_sessions_updated_at
BEFORE UPDATE ON public.counseling_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update counselor rating after review
CREATE OR REPLACE FUNCTION public.update_counselor_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE counselor_profiles
  SET 
    rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE counselor_id = NEW.counselor_id),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE counselor_id = NEW.counselor_id)
  WHERE id = NEW.counselor_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_rating_on_review
AFTER INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_counselor_rating();
