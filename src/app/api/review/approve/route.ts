/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateClientToken } from "@/lib/tokens";

/**
 * PATCH /api/review/approve
 * Updates a post status to 'approved'.
 * Accepts both authenticated users and valid client token holders.
 *
 * Body: {
 *   post_id: string;
 *   project_id: string;
 *   client_token?: string;
 * }
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { post_id, project_id, client_token } = body;

    if (!post_id || !project_id) {
      return NextResponse.json(
        { error: "Missing post_id or project_id" },
        { status: 400 }
      );
    }

    // Validate token
    if (client_token) {
      const tokenRecord = await validateClientToken(client_token);
      if (!tokenRecord || tokenRecord.project_id !== project_id) {
        return NextResponse.json(
          { error: "Invalid or expired review token" },
          { status: 403 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await (supabase as any)
      .from("posts")
      .update({ status: "approved" as const })
      .eq("id", post_id)
      .eq("project_id", project_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ post: data });
  } catch (err) {
    console.error("[PATCH /api/review/approve]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
