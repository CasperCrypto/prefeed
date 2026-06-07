/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateClientToken } from "@/lib/tokens";

/**
 * POST /api/review/comment
 * Creates a positioned comment on a post.
 * Accepts both authenticated users and client token holders.
 *
 * Body: {
 *   post_id: string;
 *   message: string;
 *   x_coord: number;
 *   y_coord: number;
 *   author_name: string;
 *   project_id: string;
 *   // For clients:
 *   client_token?: string;
 *   // For auth users — read from session server-side
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { post_id, message, x_coord, y_coord, author_name, project_id, client_token } = body;

    // Validate required fields
    if (!post_id || !message || x_coord == null || y_coord == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Validate client token if provided (anonymous reviewer)
    if (client_token) {
      const tokenRecord = await validateClientToken(client_token);
      if (!tokenRecord || tokenRecord.project_id !== project_id) {
        return NextResponse.json(
          { error: "Invalid or expired review token" },
          { status: 403 }
        );
      }

      const { data, error } = await (supabase as any)
        .from("comments")
        .insert({
          post_id,
          message,
          x_coord: Math.min(100, Math.max(0, x_coord)),
          y_coord: Math.min(100, Math.max(0, y_coord)),
          author_name: author_name || tokenRecord.email,
          author_id: null,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ comment: data }, { status: 201 });
    }

    // Fallback: unauthenticated anonymous comment
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid client_token." },
      { status: 401 }
    );
  } catch (err) {
    console.error("[POST /api/review/comment]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
