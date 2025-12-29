-- Create enum for difficulty levels
CREATE TYPE public.quiz_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');

-- Skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty quiz_difficulty NOT NULL DEFAULT 'beginner',
  duration_minutes INTEGER NOT NULL DEFAULT 15,
  passing_score INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of {id, text}
  correct_option_id TEXT NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quiz attempts table
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  skipped_questions INTEGER DEFAULT 0,
  score_percentage NUMERIC(5,2) DEFAULT 0,
  time_taken_seconds INTEGER,
  recommended_level quiz_difficulty,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quiz answers table
CREATE TABLE public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option_id TEXT,
  is_correct BOOLEAN,
  is_skipped BOOLEAN DEFAULT false,
  answered_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(attempt_id, question_id)
);

-- Enable RLS on all tables
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

-- Skills: Everyone can view active skills
CREATE POLICY "Anyone can view skills" ON public.skills
  FOR SELECT USING (true);

-- Skills: Only admins can manage skills
CREATE POLICY "Admins can manage skills" ON public.skills
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Quizzes: Everyone can view active quizzes
CREATE POLICY "Anyone can view active quizzes" ON public.quizzes
  FOR SELECT USING (is_active = true);

-- Quizzes: Admins can manage quizzes
CREATE POLICY "Admins can manage quizzes" ON public.quizzes
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Questions: Authenticated users can view questions for active quizzes
CREATE POLICY "Authenticated users can view questions" ON public.questions
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.quizzes q 
    WHERE q.id = quiz_id AND q.is_active = true
  ));

-- Questions: Admins can manage questions
CREATE POLICY "Admins can manage questions" ON public.questions
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Quiz attempts: Users can view their own attempts
CREATE POLICY "Users can view own attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

-- Quiz attempts: Users can create their own attempts
CREATE POLICY "Users can create own attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Quiz attempts: Users can update their own attempts
CREATE POLICY "Users can update own attempts" ON public.quiz_attempts
  FOR UPDATE USING (auth.uid() = user_id);

-- Quiz answers: Users can view their own answers
CREATE POLICY "Users can view own answers" ON public.quiz_answers
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.quiz_attempts a 
    WHERE a.id = attempt_id AND a.user_id = auth.uid()
  ));

-- Quiz answers: Users can insert their own answers
CREATE POLICY "Users can insert own answers" ON public.quiz_answers
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.quiz_attempts a 
    WHERE a.id = attempt_id AND a.user_id = auth.uid()
  ));

-- Create indexes for performance
CREATE INDEX idx_quizzes_skill_id ON public.quizzes(skill_id);
CREATE INDEX idx_questions_quiz_id ON public.questions(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_answers_attempt_id ON public.quiz_answers(attempt_id);

-- Trigger for updated_at
CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample skills and quizzes
INSERT INTO public.skills (name, description, category, icon) VALUES
  ('Programming', 'Test your coding knowledge across various programming languages', 'Technology', 'Code'),
  ('Data Science', 'Assess your data analysis and machine learning skills', 'Technology', 'BarChart'),
  ('UI/UX Design', 'Evaluate your design thinking and user experience knowledge', 'Design', 'Palette'),
  ('Communication', 'Measure your verbal and written communication abilities', 'Soft Skills', 'MessageSquare'),
  ('Leadership', 'Test your management and leadership capabilities', 'Soft Skills', 'Users');

-- Insert sample quizzes
INSERT INTO public.quizzes (skill_id, title, description, difficulty, duration_minutes) 
SELECT 
  s.id,
  'Introduction to ' || s.name,
  'Basic concepts and fundamentals of ' || s.name,
  'beginner',
  10
FROM public.skills s;

INSERT INTO public.quizzes (skill_id, title, description, difficulty, duration_minutes) 
SELECT 
  s.id,
  'Advanced ' || s.name,
  'Advanced concepts and real-world applications of ' || s.name,
  'advanced',
  20
FROM public.skills s;

-- Insert sample questions for Programming beginner quiz
INSERT INTO public.questions (quiz_id, question_text, options, correct_option_id, explanation, order_index)
SELECT 
  q.id,
  'What does HTML stand for?',
  '[{"id": "a", "text": "Hyper Text Markup Language"}, {"id": "b", "text": "High Tech Modern Language"}, {"id": "c", "text": "Home Tool Markup Language"}, {"id": "d", "text": "Hyperlink Text Management Language"}]'::jsonb,
  'a',
  'HTML stands for Hyper Text Markup Language, the standard markup language for creating web pages.',
  1
FROM public.quizzes q
JOIN public.skills s ON q.skill_id = s.id
WHERE s.name = 'Programming' AND q.difficulty = 'beginner';

INSERT INTO public.questions (quiz_id, question_text, options, correct_option_id, explanation, order_index)
SELECT 
  q.id,
  'Which programming language is primarily used for web front-end development?',
  '[{"id": "a", "text": "Python"}, {"id": "b", "text": "JavaScript"}, {"id": "c", "text": "Java"}, {"id": "d", "text": "C++"}]'::jsonb,
  'b',
  'JavaScript is the primary language for web front-end development, running in browsers to create interactive web pages.',
  2
FROM public.quizzes q
JOIN public.skills s ON q.skill_id = s.id
WHERE s.name = 'Programming' AND q.difficulty = 'beginner';

INSERT INTO public.questions (quiz_id, question_text, options, correct_option_id, explanation, order_index)
SELECT 
  q.id,
  'What is a variable in programming?',
  '[{"id": "a", "text": "A fixed value that never changes"}, {"id": "b", "text": "A container for storing data values"}, {"id": "c", "text": "A type of loop"}, {"id": "d", "text": "A programming language"}]'::jsonb,
  'b',
  'A variable is a container for storing data values that can be changed during program execution.',
  3
FROM public.quizzes q
JOIN public.skills s ON q.skill_id = s.id
WHERE s.name = 'Programming' AND q.difficulty = 'beginner';

INSERT INTO public.questions (quiz_id, question_text, options, correct_option_id, explanation, order_index)
SELECT 
  q.id,
  'What is CSS used for?',
  '[{"id": "a", "text": "Server-side scripting"}, {"id": "b", "text": "Database management"}, {"id": "c", "text": "Styling web pages"}, {"id": "d", "text": "Network protocols"}]'::jsonb,
  'c',
  'CSS (Cascading Style Sheets) is used for styling and formatting the visual presentation of web pages.',
  4
FROM public.quizzes q
JOIN public.skills s ON q.skill_id = s.id
WHERE s.name = 'Programming' AND q.difficulty = 'beginner';

INSERT INTO public.questions (quiz_id, question_text, options, correct_option_id, explanation, order_index)
SELECT 
  q.id,
  'What does API stand for?',
  '[{"id": "a", "text": "Application Programming Interface"}, {"id": "b", "text": "Advanced Program Integration"}, {"id": "c", "text": "Automated Processing Input"}, {"id": "d", "text": "Application Process Indicator"}]'::jsonb,
  'a',
  'API stands for Application Programming Interface, which allows different software applications to communicate with each other.',
  5
FROM public.quizzes q
JOIN public.skills s ON q.skill_id = s.id
WHERE s.name = 'Programming' AND q.difficulty = 'beginner';