/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { validateClientToken } from "@/lib/tokens";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { ReviewClient } from "./ReviewClient";
import type { Comment, Post, Project } from "@/types/database";

export const metadata: Metadata = {
  title: "Review · PreFeed",
  description: "Review and approve social media posts",
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ReviewPage({ params }: Props) {
  const { token } = await params;

  const tokenRecord = await validateClientToken(token);

  if (!tokenRecord) {
    notFound();
  }

  const supabase = createAdminClient();

  const [{ data: project }, { data: posts }] = await Promise.all([
    (supabase as any)
      .from("projects")
      .select("id, name")
      .eq("id", tokenRecord.project_id)
      .single() as Promise<{ data: Pick<Project, "id" | "name"> | null }>,
    (supabase as any)
      .from("posts")
      .select("*")
      .eq("project_id", tokenRecord.project_id)
      .order("created_at", { ascending: false }) as Promise<{ data: Post[] | null }>,
  ]);

  const postIds = (posts ?? []).map((p) => p.id);

  let comments: Comment[] = [];
  if (postIds.length > 0) {
    const { data } = (await (supabase as any)
      .from("comments")
      .select("*")
      .in("post_id", postIds)
      .order("created_at", { ascending: true })) as { data: Comment[] | null };
    comments = data ?? [];
  }

  return (
    <ReviewClient
      token={token}
      reviewerEmail={tokenRecord.email}
      reviewerName={tokenRecord.client_name}
      projectId={tokenRecord.project_id}
      projectName={project?.name ?? "Review"}
      initialPosts={posts ?? []}
      initialComments={comments}
    />
  );
}
