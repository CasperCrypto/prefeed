/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Project } from "@/types/database";

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  if (!name) return { error: "Project name is required" };

  const { error } = await (supabase as any).from("projects").insert({
    name,
    owner_id: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await (supabase as any)
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false }) as { data: Project[] | null; error: unknown };

  if (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }

  return data ?? [];
}
