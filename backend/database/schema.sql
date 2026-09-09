-- ==============================================================================
-- SUPABASE DATABASE INITIALIZATION SCHEMA
-- ==============================================================================
-- You can run this script in the Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/shqdkeoboannuyxprwqv/sql
-- ==============================================================================

-- 1. Create Profiles Table (Synchronized with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 2. Trigger function to automatically create profile on auth.user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if already exists and re-create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Create Sample Application Table (items)
CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on items
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Items RLS Policies
-- Allow anyone (including anonymous users) to view items
CREATE POLICY "Allow public read access to items"
  ON public.items FOR SELECT 
  USING (true);

-- Allow authenticated or demo users to insert items
CREATE POLICY "Allow inserts on items"
  ON public.items FOR INSERT 
  WITH CHECK (true);

-- Allow updates
CREATE POLICY "Allow updates on items"
  ON public.items FOR UPDATE 
  USING (true);

-- Allow deletes
CREATE POLICY "Allow deletes on items"
  ON public.items FOR DELETE 
  USING (true);

-- 4. Indexes for optimal query performance
CREATE INDEX IF NOT EXISTS idx_items_user_id ON public.items (user_id);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON public.items (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);

-- 5. Seed sample items for testing
INSERT INTO public.items (title, description, status)
VALUES 
  ('Welcome to Supabase!', 'This item confirms your Supabase PostgreSQL database is connected and operational.', 'completed'),
  ('Build amazing features', 'Connect backend APIs and frontend UI with Supabase Auth and Database.', 'in_progress');
