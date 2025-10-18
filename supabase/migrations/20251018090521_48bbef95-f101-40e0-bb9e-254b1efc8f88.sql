-- Create role enum
CREATE TYPE public.app_role AS ENUM ('student', 'counselor', 'admin');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Student profiles table
CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  grade TEXT,
  school TEXT,
  interests TEXT[],
  career_goals TEXT,
  profile_picture_url TEXT,
  profile_completion INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- Counselor profiles table
CREATE TABLE public.counselor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  specialization TEXT[],
  experience_years INTEGER,
  qualifications TEXT,
  bio TEXT,
  hourly_rate DECIMAL(10,2),
  profile_picture_url TEXT,
  verification_status TEXT DEFAULT 'pending',
  verification_document_url TEXT,
  is_available BOOLEAN DEFAULT true,
  profile_completion INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.counselor_profiles ENABLE ROW LEVEL SECURITY;

-- Counselor availability table
CREATE TABLE public.counselor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_id UUID REFERENCES public.counselor_profiles(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(counselor_id, day_of_week, start_time)
);

ALTER TABLE public.counselor_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for student_profiles
CREATE POLICY "Students can view their own profile"
  ON public.student_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students can update their own profile"
  ON public.student_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own profile"
  ON public.student_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Counselors can view student profiles"
  ON public.student_profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'counselor'));

CREATE POLICY "Admins can view all student profiles"
  ON public.student_profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for counselor_profiles
CREATE POLICY "Everyone can view verified counselor profiles"
  ON public.counselor_profiles FOR SELECT
  USING (verification_status = 'verified');

CREATE POLICY "Counselors can view their own profile"
  ON public.counselor_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Counselors can update their own profile"
  ON public.counselor_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Counselors can insert their own profile"
  ON public.counselor_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all counselor profiles"
  ON public.counselor_profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for counselor_availability
CREATE POLICY "Everyone can view counselor availability"
  ON public.counselor_availability FOR SELECT
  USING (true);

CREATE POLICY "Counselors can manage their own availability"
  ON public.counselor_availability FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.counselor_profiles
      WHERE id = counselor_availability.counselor_id
      AND user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_counselor_profiles_updated_at
  BEFORE UPDATE ON public.counselor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for profile pictures and documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-assets', 'profile-assets', true);

-- Storage policies for profile assets
CREATE POLICY "Users can upload their own profile assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-assets' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own profile assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-assets' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own profile assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-assets' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Profile assets are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-assets');