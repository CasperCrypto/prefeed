/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PostWithAuthor, Platform, PostStatus } from "@/types/database";

export async function createPost({
  projectId,
  platform,
  contentText,
  mediaUrls,
}: {
  projectId: string;
  platform: Platform;
  contentText: string;
  mediaUrls: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data, error } = await (supabase as any)
    .from("posts")
    .insert({
      project_id: projectId,
      platform,
      content_text: contentText,
      media_urls: mediaUrls,
      created_by: user.id,
      status: "draft" as PostStatus,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/projects/${projectId}/sandbox`);
  return { data };
}

export async function updatePost({
  postId,
  projectId,
  contentText,
  mediaUrls,
}: {
  postId: string;
  projectId: string;
  contentText: string;
  mediaUrls: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data, error } = await (supabase as any)
    .from("posts")
    .update({
      content_text: contentText,
      media_urls: mediaUrls,
    })
    .eq("id", postId)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/projects/${projectId}/sandbox`);
  return { data };
}

export async function getProjectPosts(projectId: string): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  
  const { data, error } = await (supabase as any)
    .from("posts")
    .select(`
      *,
      author:profiles(id, full_name, avatar_url)
    `)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }

  // Map Supabase nested result to the expected flat `author` format
  return (data || []).map((post: any) => ({
    ...post,
    author: post.author && !Array.isArray(post.author) ? post.author : null
  })) as PostWithAuthor[];
}
