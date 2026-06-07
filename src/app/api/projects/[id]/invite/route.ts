/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClientToken } from "@/lib/tokens";

/**
 * POST /api/projects/[id]/invite
 * Generate a client access token for a project.
 * Only accessible by the project owner.
 *
 * Body: { email: string; client_name?: string; days_valid?: number }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();
    const { email, client_name, days_valid = 30 } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the authenticated user is the project owner
    const { data: project, error: projectError } = await (supabase as any)
      .from("projects")
      .select("id, owner_id")
      .eq("id", projectId)
      .single() as { data: { id: string; owner_id: string } | null; error: unknown };

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.owner_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create token
    const token = await createClientToken({
      projectId,
      email,
      clientName: client_name,
      daysValid: days_valid,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Failed to create token" },
        { status: 500 }
      );
    }

    const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/review/${token.token}`;

    return NextResponse.json(
      { token, review_url: reviewUrl },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/projects/[id]/invite]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
