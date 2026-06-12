-- ==============================================================================
-- PreFeed - Migration 002: Tighten Row Level Security
-- Replaces the permissive MVP policies (USING (true)) with scoped policies.
-- Anonymous reviewers never hit the database directly for writes — those go
-- through token-validated API routes using the service role. Anon keeps
-- read-only access to posts/comments so Supabase Realtime can deliver rows
-- on the public /review/[token] page.
-- ==============================================================================

-- 1. Drop the old permissive policies
DROP POLICY IF EXISTS "Enable read/write for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read/write for authenticated users" ON public.projects;
DROP POLICY IF EXISTS "Enable read/write for authenticated users" ON public.project_members;
DROP POLICY IF EXISTS "Enable read/write for authenticated users" ON public.posts;
DROP POLICY IF EXISTS "Enable read/write for authenticated users" ON public.comments;
DROP POLICY IF EXISTS "Enable read/write for authenticated users" ON public.client_access_tokens;
DROP POLICY IF EXISTS "Enable read for public clients on posts" ON public.posts;
DROP POLICY IF EXISTS "Enable read/write for public clients on comments" ON public.comments;

-- 2. Helper: is the current user the owner of a project?
--    SECURITY DEFINER avoids recursive RLS evaluation.
CREATE OR REPLACE FUNCTION public.is_project_owner(p_project_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = p_project_id AND owner_id = auth.uid()
  );
$$;

-- Helper: is the current user a member of a project (any role)?
CREATE OR REPLACE FUNCTION public.is_project_member(p_project_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = ''
STABLE
AS $$
  SELECT public.is_project_owner(p_project_id) OR EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_id = p_project_id AND profile_id = auth.uid()
  );
$$;

-- 3. profiles
CREATE POLICY "profiles_select_authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- 4. projects (owner full access; members read)
CREATE POLICY "projects_owner_all" ON public.projects
  FOR ALL TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "projects_member_select" ON public.projects
  FOR SELECT TO authenticated USING (public.is_project_member(id));

-- 5. project_members (owner manages; members can see their rows)
CREATE POLICY "project_members_owner_all" ON public.project_members
  FOR ALL TO authenticated
  USING (public.is_project_owner(project_id))
  WITH CHECK (public.is_project_owner(project_id));
CREATE POLICY "project_members_self_select" ON public.project_members
  FOR SELECT TO authenticated USING (profile_id = auth.uid());

-- 6. posts (project members read/write)
CREATE POLICY "posts_member_all" ON public.posts
  FOR ALL TO authenticated
  USING (public.is_project_member(project_id))
  WITH CHECK (public.is_project_member(project_id));

-- 7. comments (project members read/write; must author as self)
CREATE POLICY "comments_member_select" ON public.comments
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.posts p
    WHERE p.id = post_id AND public.is_project_member(p.project_id)
  ));
CREATE POLICY "comments_member_insert" ON public.comments
  FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = post_id AND public.is_project_member(p.project_id)
    )
  );
CREATE POLICY "comments_author_update" ON public.comments
  FOR UPDATE TO authenticated
  USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
CREATE POLICY "comments_author_delete" ON public.comments
  FOR DELETE TO authenticated USING (author_id = auth.uid());

-- 8. client_access_tokens (project owner only; never exposed to anon)
CREATE POLICY "tokens_owner_all" ON public.client_access_tokens
  FOR ALL TO authenticated
  USING (public.is_project_owner(project_id))
  WITH CHECK (public.is_project_owner(project_id));

-- 9. Anonymous reviewers: READ-ONLY on posts + comments.
--    Writes from /review/[token] go through API routes that validate the
--    token server-side and use the service role.
CREATE POLICY "posts_anon_select" ON public.posts
  FOR SELECT TO anon USING (true);
CREATE POLICY "comments_anon_select" ON public.comments
  FOR SELECT TO anon USING (true);

-- 10. Realtime: make sure posts + comments broadcast changes
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
