-- ==============================================================================
-- PreFeed - Initial Database Schema Migration
-- ==============================================================================

-- 1. Create Tables
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'owner'::text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug text,
  logo_url text,
  brand_color text NOT NULL DEFAULT '#6366f1'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);

CREATE TABLE public.project_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'viewer'::text,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT project_members_pkey PRIMARY KEY (id),
  CONSTRAINT project_members_project_id_profile_id_key UNIQUE (project_id, profile_id)
);

CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  platform text NOT NULL,
  content_text text NOT NULL,
  media_urls text[] NOT NULL DEFAULT '{}'::text[],
  status text NOT NULL DEFAULT 'draft'::text,
  scheduled_at timestamp with time zone,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT posts_pkey PRIMARY KEY (id)
);

CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  message text NOT NULL,
  x_coord numeric NOT NULL,
  y_coord numeric NOT NULL,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT comments_pkey PRIMARY KEY (id)
);

CREATE TABLE public.client_access_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  token text NOT NULL,
  email text NOT NULL,
  client_name text,
  expires_at timestamp with time zone NOT NULL,
  last_used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT client_access_tokens_pkey PRIMARY KEY (id),
  CONSTRAINT client_access_tokens_token_key UNIQUE (token)
);

-- 2. Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'owner'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_access_tokens ENABLE ROW LEVEL SECURITY;

-- For MVP, we will use fairly permissive RLS so that authenticated users
-- can access everything. In a real production environment, you'd scope this down.
CREATE POLICY "Enable read/write for authenticated users" ON public.profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable read/write for authenticated users" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable read/write for authenticated users" ON public.project_members FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable read/write for authenticated users" ON public.posts FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable read/write for authenticated users" ON public.comments FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable read/write for authenticated users" ON public.client_access_tokens FOR ALL TO authenticated USING (true);

-- Anonymous users (clients using token) need access to read posts and read/write comments.
CREATE POLICY "Enable read for public clients on posts" ON public.posts FOR SELECT TO anon USING (true);
CREATE POLICY "Enable read/write for public clients on comments" ON public.comments FOR ALL TO anon USING (true);

-- 4. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
