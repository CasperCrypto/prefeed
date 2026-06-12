"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FacebookCard } from "@/components/mockups/FacebookCard";
import { InstagramCard } from "@/components/mockups/InstagramCard";
import { TikTokCard } from "@/components/mockups/TikTokCard";
import { XCard } from "@/components/mockups/XCard";
import { cn, PLATFORM_LABELS } from "@/lib/utils";
import type { Comment, Post } from "@/types/database";
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  MessageSquarePlus,
  X,
  Zap,
} from "lucide-react";

interface ReviewClientProps {
  token: string;
  reviewerEmail: string;
  reviewerName: string | null;
  projectId: string;
  projectName: string;
  initialPosts: Post[];
  initialComments: Comment[];
}

interface DraftPin {
  postId: string;
  x: number;
  y: number;
}

export function ReviewClient({
  token,
  reviewerEmail,
  reviewerName,
  projectId,
  projectName,
  initialPosts,
  initialComments,
}: ReviewClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [draftPin, setDraftPin] = useState<DraftPin | null>(null);
  const [draftMessage, setDraftMessage] = useState("");
  const [annotatingPostId, setAnnotatingPostId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activePin, setActivePin] = useState<string | null>(null);
  const supabaseRef = useRef(createClient());

  const postIds = useMemo(() => new Set(posts.map((p) => p.id)), [posts]);

  // ── Realtime: live comment + status updates ──────────────────────
  useEffect(() => {
    const supabase = supabaseRef.current;
    const channel = supabase
      .channel(`review-${projectId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        (payload) => {
          const comment = payload.new as Comment;
          if (!postIds.has(comment.post_id)) return;
          setComments((prev) =>
            prev.some((c) => c.id === comment.id) ? prev : [...prev, comment]
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "posts",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          const post = payload.new as Post;
          setPosts((prev) =>
            prev.map((p) => (p.id === post.id ? { ...p, ...post } : p))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, postIds]);

  // ── Annotation flow ───────────────────────────────────────────────
  const handleCanvasClick = (
    e: React.MouseEvent<HTMLDivElement>,
    postId: string
  ) => {
    if (annotatingPostId !== postId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDraftPin({ postId, x, y });
    setDraftMessage("");
  };

  const submitComment = async () => {
    if (!draftPin || !draftMessage.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/review/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: draftPin.postId,
          project_id: projectId,
          message: draftMessage.trim(),
          x_coord: draftPin.x,
          y_coord: draftPin.y,
          author_name: reviewerName || reviewerEmail,
          client_token: token,
        }),
      });
      const data = await res.json();
      if (res.ok && data.comment) {
        setComments((prev) =>
          prev.some((c) => c.id === data.comment.id)
            ? prev
            : [...prev, data.comment]
        );
        setDraftPin(null);
        setDraftMessage("");
        setAnnotatingPostId(null);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Approve flow ──────────────────────────────────────────────────
  const approvePost = async (postId: string) => {
    setApprovingId(postId);
    try {
      const res = await fetch("/api/review/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          project_id: projectId,
          client_token: token,
        }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, status: "approved" } : p))
        );
      }
    } finally {
      setApprovingId(null);
    }
  };

  // ── One-click copy ────────────────────────────────────────────────
  const copyPost = async (post: Post) => {
    await navigator.clipboard.writeText(post.content_text);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadMedia = (post: Post) => {
    post.media_urls.forEach((url, i) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = `post-media-${i + 1}`;
      a.target = "_blank";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  };

  const approvedCount = posts.filter((p) => p.status === "approved").length;

  const renderMockup = (post: Post) => {
    const props = { contentText: post.content_text, mediaUrls: post.media_urls };
    switch (post.platform) {
      case "x":
        return <XCard {...props} />;
      case "instagram":
        return <InstagramCard {...props} />;
      case "facebook":
        return <FacebookCard {...props} />;
      case "tiktok":
        return <TikTokCard {...props} />;
    }
  };

  return (
    <main className="light relative min-h-dvh bg-neutral-50 pb-28 text-neutral-900">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.45]" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-900 text-white">
              <Zap size={15} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{projectName}</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                Client review
              </p>
            </div>
          </div>
          <span className="hidden truncate rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-500 sm:inline-flex">
            {reviewerEmail}
          </span>
        </div>
      </header>

      {/* Feed */}
      <div className="relative mx-auto max-w-2xl space-y-10 px-4 py-8 md:py-12">
        {posts.length === 0 && (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white/70 p-12 text-center">
            <h2 className="text-lg font-semibold">Nothing to review yet</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Posts will appear here as soon as the team shares drafts.
            </p>
          </div>
        )}

        {posts.map((post) => {
          const postComments = comments.filter((c) => c.post_id === post.id);
          const isApproved = post.status === "approved";
          const isAnnotating = annotatingPostId === post.id;

          return (
            <article key={post.id} className="animate-fade-in">
              {/* Card header */}
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                    {PLATFORM_LABELS[post.platform].replace(" (Twitter)", "")}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize",
                      isApproved
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    )}
                  >
                    {isApproved ? "Approved" : "Awaiting review"}
                  </span>
                </div>
                {postComments.length > 0 && (
                  <span className="text-xs font-medium text-neutral-400">
                    {postComments.length} note{postComments.length === 1 ? "" : "s"}
                  </span>
                )}
              </div>

              {/* Annotatable mockup */}
              <div
                onClick={(e) => handleCanvasClick(e, post.id)}
                className={cn(
                  "relative flex justify-center rounded-xl border bg-white p-4 transition-shadow md:p-8",
                  isAnnotating
                    ? "cursor-crosshair border-neutral-900 shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
                    : "border-neutral-200 card-soft"
                )}
              >
                {renderMockup(post)}

                {/* Comment pins */}
                {postComments.map((comment, idx) => (
                  <button
                    key={comment.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePin(activePin === comment.id ? null : comment.id);
                    }}
                    style={{
                      left: `${comment.x_coord}%`,
                      top: `${comment.y_coord}%`,
                    }}
                    className="absolute z-20 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full rounded-bl-none bg-neutral-900 text-[11px] font-bold text-white shadow-lg animate-pin-drop hover:scale-110"
                  >
                    {idx + 1}
                  </button>
                ))}

                {/* Pin tooltip */}
                {postComments.map(
                  (comment) =>
                    activePin === comment.id && (
                      <div
                        key={`tip-${comment.id}`}
                        style={{
                          left: `${Math.min(comment.x_coord, 60)}%`,
                          top: `${comment.y_coord}%`,
                        }}
                        className="absolute z-30 mt-4 w-56 rounded-xl border border-neutral-200 bg-white p-3.5 shadow-xl animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-xs font-semibold text-neutral-900">
                          {comment.author_name}
                        </p>
                        <p className="mt-1.5 text-xs leading-5 text-neutral-600">
                          {comment.message}
                        </p>
                      </div>
                    )
                )}

                {/* Draft pin + popover */}
                {draftPin?.postId === post.id && (
                  <>
                    <span
                      style={{ left: `${draftPin.x}%`, top: `${draftPin.y}%` }}
                      className="absolute z-20 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full rounded-bl-none bg-neutral-900 text-white shadow-lg animate-pin-drop"
                    >
                      <MessageSquarePlus size={12} />
                    </span>
                    <div
                      style={{
                        left: `${Math.min(draftPin.x, 50)}%`,
                        top: `${Math.min(draftPin.y + 4, 88)}%`,
                      }}
                      className="absolute z-30 w-64 rounded-xl border border-neutral-200 bg-white p-3 shadow-xl animate-fade-in"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <textarea
                        autoFocus
                        value={draftMessage}
                        onChange={(e) => setDraftMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            submitComment();
                          }
                          if (e.key === "Escape") setDraftPin(null);
                        }}
                        placeholder="Leave a note..."
                        className="h-20 w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none"
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setDraftPin(null)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                        >
                          <X size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={submitComment}
                          disabled={submitting || !draftMessage.trim()}
                          className="h-8 rounded-full bg-neutral-900 px-3.5 text-xs font-semibold text-white hover:bg-neutral-700 disabled:opacity-50"
                        >
                          {submitting ? "Posting..." : "Post note"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Post actions */}
              <div className="mt-3 flex items-center gap-2 px-1">
                <button
                  type="button"
                  onClick={() =>
                    setAnnotatingPostId(isAnnotating ? null : post.id)
                  }
                  className={cn(
                    "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border text-sm font-semibold",
                    isAnnotating
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                  )}
                >
                  <MessageSquarePlus size={15} />
                  {isAnnotating ? "Click the post to pin" : "Leave feedback"}
                </button>

                {isApproved ? (
                  <>
                    <button
                      type="button"
                      onClick={() => copyPost(post)}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white text-sm font-semibold text-neutral-700 hover:border-neutral-400"
                    >
                      {copiedId === post.id ? (
                        <>
                          <Check size={15} className="text-emerald-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={15} />
                          Copy caption
                        </>
                      )}
                    </button>
                    {post.media_urls.length > 0 && (
                      <button
                        type="button"
                        onClick={() => downloadMedia(post)}
                        title="Download media"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                      >
                        <Download size={15} />
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => approvePost(post.id)}
                    disabled={approvingId === post.id}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
                  >
                    <CheckCircle2 size={15} />
                    {approvingId === post.id ? "Approving..." : "Approve post"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Sticky progress bar */}
      {posts.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-2xl items-center justify-between gap-4 px-5">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-28 overflow-hidden rounded-full bg-neutral-200 sm:w-40">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                  style={{
                    width: `${posts.length ? (approvedCount / posts.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="text-sm font-medium text-neutral-600">
                {approvedCount}/{posts.length} approved
              </p>
            </div>
            <p className="hidden text-xs text-neutral-400 sm:block">
              Click &ldquo;Leave feedback&rdquo;, then pin a note anywhere on a post.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
