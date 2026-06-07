/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAdminClient } from "@/lib/supabase/admin";
import type { ClientAccessToken } from "@/types/database";

/**
 * Validate a client review token server-side.
 * Returns the token record if valid, null if expired/not found.
 */
export async function validateClientToken(
  token: string
): Promise<ClientAccessToken | null> {
  const supabase = createAdminClient();

  const { data, error } = await (supabase as any)
    .from("client_access_tokens")
    .select("*")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single() as { data: ClientAccessToken | null; error: unknown };

  if (error || !data) return null;

  // Update last_used_at silently
  await (supabase as any)
    .from("client_access_tokens")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return data;
}

/**
 * Generate a new client access token for a project.
 */
export async function createClientToken({
  projectId,
  email,
  clientName,
  daysValid = 30,
}: {
  projectId: string;
  email: string;
  clientName?: string;
  daysValid?: number;
}): Promise<ClientAccessToken | null> {
  const supabase = createAdminClient();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + daysValid);

  const { data, error } = await (supabase as any)
    .from("client_access_tokens")
    .insert({
      project_id: projectId,
      email,
      client_name: clientName ?? null,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single() as { data: ClientAccessToken | null; error: unknown };

  if (error || !data) {
    console.error("[createClientToken]", error);
    return null;
  }

  return data;
}

/**
 * List all tokens for a project (owner only).
 */
export async function getProjectTokens(projectId: string): Promise<ClientAccessToken[]> {
  const supabase = createAdminClient();

  const { data, error } = await (supabase as any)
    .from("client_access_tokens")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false }) as { data: ClientAccessToken[] | null; error: unknown };

  if (error) return [];
  return data ?? [];
}

/**
 * Revoke (delete) a client access token.
 */
export async function revokeClientToken(tokenId: string): Promise<boolean> {
  const supabase = createAdminClient();

  const { error } = await (supabase as any)
    .from("client_access_tokens")
    .delete()
    .eq("id", tokenId) as { error: unknown };

  return !error;
}
