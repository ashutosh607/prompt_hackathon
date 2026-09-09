-- ==============================================================================
-- STUDYMATCH DATABASE SCHEMA & SEED DATA
-- ==============================================================================
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/shqdkeoboannuyxprwqv/sql
-- ==============================================================================

-- 1. Profiles (User details and academic preferences)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  academic_level TEXT DEFAULT 'undergraduate',
  learning_style TEXT DEFAULT 'visual',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Topics table
CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'BookOpen',
  suggested BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to topics" ON public.topics FOR SELECT USING (true);

-- 3. Diagnostic Questions
CREATE TABLE IF NOT EXISTS public.diagnostic_questions (
  id TEXT PRIMARY KEY,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE,
  question_order INT NOT NULL,
  concept TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.diagnostic_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to questions" ON public.diagnostic_questions FOR SELECT USING (true);

-- 4. Learning Resources
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  format TEXT NOT NULL, -- 'YouTube', 'PDF', 'Practice', 'Article'
  duration_minutes INT NOT NULL,
  difficulty TEXT NOT NULL, -- 'Beginner', 'Intermediate', 'Advanced'
  style TEXT NOT NULL, -- 'Visual', 'Conceptual', 'Hands-on', 'Rigorous'
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  match_reasons JSONB NOT NULL, -- list of strings
  is_featured BOOLEAN DEFAULT false,
  predicted_gain INT DEFAULT 18,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to resources" ON public.resources FOR SELECT USING (true);

-- 5. Student Quests (Saved learning journeys)
CREATE TABLE IF NOT EXISTS public.student_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE,
  focus_area TEXT NOT NULL,
  confidence_score INT NOT NULL,
  steps JSONB NOT NULL,
  completed_step_ids JSONB DEFAULT '[]'::jsonb,
  total_minutes INT DEFAULT 53,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.student_quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own quests" ON public.student_quests FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- ==============================================================================
-- SEED DATA FOR STUDYMATCH
-- ==============================================================================

-- Topics
INSERT INTO public.topics (id, title, category, description, suggested)
VALUES
  ('linear-regression', 'Linear Regression', 'Machine Learning & Statistics', 'Find relationships between variables with line fitting and slope intuition.', true),
  ('classification', 'Classification', 'Machine Learning', 'Categorize data points into discrete classes using decision boundaries.', true),
  ('probability', 'Probability', 'Mathematics', 'Quantify uncertainty and calculate likelihoods for events.', true),
  ('matrices', 'Matrices', 'Linear Algebra', 'Transform vectors and represent high-dimensional linear systems.', true)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, suggested = EXCLUDED.suggested;

-- Diagnostic Questions for Linear Regression
INSERT INTO public.diagnostic_questions (id, topic_id, question_order, concept, question, options)
VALUES
  ('lr-q1', 'linear-regression', 1, 'Slope Representation', 'Do you understand what slope represents in a graph?', '[
    {"id": "opt1", "label": "I can explain it", "level": "strong", "icon": "check"},
    {"id": "opt2", "label": "I understand a little", "level": "moderate", "icon": "partial"},
    {"id": "opt3", "label": "Not really", "level": "weak", "icon": "none"}
  ]'::jsonb),
  ('lr-q2', 'linear-regression', 2, 'Line of Best Fit', 'How comfortable are you with how a line of best fit minimizes errors?', '[
    {"id": "opt1", "label": "I can explain residuals and MSE", "level": "strong", "icon": "check"},
    {"id": "opt2", "label": "I understand the general idea", "level": "moderate", "icon": "partial"},
    {"id": "opt3", "label": "I get confused by how it is calculated", "level": "weak", "icon": "none"}
  ]'::jsonb),
  ('lr-q3', 'linear-regression', 3, 'Preferred Learning Format', 'What format helps you grasp tricky mathematical concepts fastest?', '[
    {"id": "opt1", "label": "Visual animations & graphs", "level": "visual", "icon": "check"},
    {"id": "opt2", "label": "Short concise reading notes", "level": "reading", "icon": "partial"},
    {"id": "opt3", "label": "Step-by-step interactive practice", "level": "practice", "icon": "check"}
  ]'::jsonb),
  ('lr-q4', 'linear-regression', 4, 'Current Academic Goal', 'What is your primary goal for studying this right now?', '[
    {"id": "opt1", "label": "Build intuitive foundation before deeper math", "level": "intuition", "icon": "check"},
    {"id": "opt2", "label": "Quick revision for an upcoming test", "level": "exam", "icon": "partial"},
    {"id": "opt3", "label": "Curiosity and project application", "level": "application", "icon": "check"}
  ]'::jsonb)
ON CONFLICT (id) DO UPDATE SET question = EXCLUDED.question, options = EXCLUDED.options;

-- Resources for Linear Regression
INSERT INTO public.resources (id, topic_id, title, format, duration_minutes, difficulty, style, url, thumbnail_url, match_reasons, is_featured, predicted_gain)
VALUES
  ('res-1', 'linear-regression', 'Linear Regression Explained Visually', 'YouTube', 18, 'Beginner', 'Visual', 'https://www.youtube.com/watch?v=nk2CQITm_eo', '/linear-regression-thumb.jpg', '["Builds slope intuition", "Visual explanation", "Beginner friendly", "Fits your available time"]'::jsonb, true, 18),
  ('res-2', 'linear-regression', 'Quick Regression Notes', 'PDF', 10, 'Beginner', 'Conceptual', '#', NULL, '["Summarizes slope & intercept equations", "Formulas cheat sheet"]'::jsonb, false, 12),
  ('res-3', 'linear-regression', 'Practice: 5 Problems', 'Practice', 20, 'Beginner', 'Hands-on', '#', NULL, '["Immediate feedback on calculating slope", "Interactive graphs"]'::jsonb, false, 15),
  ('res-4', 'linear-regression', 'Mini concept check', 'Practice', 5, 'Beginner', 'Conceptual', '#', NULL, '["Reinforces key takeaways in 3 questions"]'::jsonb, false, 8)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, match_reasons = EXCLUDED.match_reasons;
