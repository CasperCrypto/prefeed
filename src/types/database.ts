// ============================================================
// PreFeed — Supabase TypeScript Database Types
// ============================================================

export type UserRole = "owner" | "editor";
export type MemberRole = "owner" | "editor" | "viewer";
export type Platform = "x" | "facebook" | "instagram" | "tiktok";
export type PostStatus = "draft" | "pending" | "approved";

// ─── Row shapes ───────────────────────────────────────────
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  owner_id: string;
  slug: string | null;
  logo_url: string | null;
  brand_color: string;
  created_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  profile_id: string;
  role: MemberRole;
  joined_at: string;
}

export interface Post {
  id: string;
  project_id: string;
  platform: Platform;
  content_text: string;
  media_urls: string[];
  status: PostStatus;
  scheduled_at: string | null;
  created_by: string;
  updated_at: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_id: string | null;
  message: string;
  x_coord: number;
  y_coord: number;
  resolved: boolean;
  created_at: string;
}

export interface ClientAccessToken {
  id: string;
  project_id: string;
  token: string;
  email: string;
  client_name: string | null;
  expires_at: string;
  last_used_at: string | null;
  created_at: string;
}

// ─── Insert types ─────────────────────────────────────────
export type ProfileInsert = Partial<Profile> & Pick<Profile, "id" | "email">;
export type ProjectInsert = Omit<Project, "id" | "created_at"> & { id?: string; created_at?: string };
export type ProjectMemberInsert = Omit<ProjectMember, "id" | "joined_at"> & { id?: string; joined_at?: string };
export type PostInsert = Omit<Post, "id" | "updated_at" | "created_at"> & { id?: string; updated_at?: string; created_at?: string };
export type CommentInsert = Omit<Comment, "id" | "created_at"> & { id?: string; created_at?: string };
export type ClientAccessTokenInsert = Omit<ClientAccessToken, "id" | "token" | "last_used_at" | "created_at"> & { id?: string; token?: string; last_used_at?: string | null; created_at?: string };

// ─── Supabase Database type map ───────────────────────────
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: Partial<Omit<Profile, "id">>;
        Relationships: [];
      };
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: Partial<Omit<Project, "id">>;
        Relationships: [];
      };
      project_members: {
        Row: ProjectMember;
        Insert: ProjectMemberInsert;
        Update: Partial<Omit<ProjectMember, "id">>;
        Relationships: [];
      };
      posts: {
        Row: Post;
        Insert: PostInsert;
        Update: Partial<Omit<Post, "id">>;
        Relationships: [];
      };
      comments: {
        Row: Comment;
        Insert: CommentInsert;
        Update: Partial<Omit<Comment, "id">>;
        Relationships: [];
      };
      client_access_tokens: {
        Row: ClientAccessToken;
        Insert: ClientAccessTokenInsert;
        Update: Partial<Omit<ClientAccessToken, "id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// ─── Joined / enriched types (used in UI) ────────────────
export interface PostWithAuthor extends Post {
  author: Pick<Profile, "id" | "full_name" | "avatar_url"> | null;
}

export interface CommentWithAuthor extends Comment {
  author: Pick<Profile, "id" | "full_name" | "avatar_url"> | null;
}

export interface ProjectWithMeta extends Project {
  posts_count?: number;
  pending_count?: number;
  members?: ProjectMember[];
}

// ─── Client reviewer session (localStorage) ──────────────
export interface ClientSession {
  token: string;
  projectId: string;
  email: string;
  name: string;
  expiresAt: string;
}
