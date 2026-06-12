"use client";

import { useState } from "react";
import Link from "next/link";
import { createPost } from "@/app/actions/posts";
import { FacebookCard } from "@/components/mockups/FacebookCard";
import { InstagramCard } from "@/components/mockups/InstagramCard";
import { TikTokCard } from "@/components/mockups/TikTokCard";
import { XCard } from "@/components/mockups/XCard";
import { PlatformSidebar } from "@/components/sandbox/PlatformSidebar";
import { PostEditor } from "@/components/sandbox/PostEditor";
import { ShareReviewModal } from "@/components/sandbox/ShareReviewModal";
import type { Platform } from "@/types/database";
import { ArrowLeft, CheckCircle2, Eye, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface SandboxClientProps {
  projectId: string;
}

export function SandboxClient({ projectId }: SandboxClientProps) {
  const [platform, setPlatform] = useState<Platform>("x");
  const [contentText, setContentText] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    const result = await createPost({
      projectId,
      platform,
      contentText,
      mediaUrls,
    });
    setIsSaving(false);

    if (result.data) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      setSaveError(result.error || "Failed to save post");
    }
  };

  const mockup = (
    <>
      {platform === "x" && (
        <XCard contentText={contentText} mediaUrls={mediaUrls} />
      )}
      {platform === "instagram" && (
        <InstagramCard contentText={contentText} mediaUrls={mediaUrls} />
      )}
      {platform === "facebook" && (
        <FacebookCard contentText={contentText} mediaUrls={mediaUrls} />
      )}
      {platform === "tiktok" && (
        <TikTokCard contentText={contentText} mediaUrls={mediaUrls} />
      )}
    </>
  );

  return (
    <div className="relative flex h-[calc(100dvh-64px)] flex-col overflow-hidden bg-neutral-50 md:h-dvh">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4">
        <Link
          href="/projects"
          className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900"
        >
          <ArrowLeft size={16} />
          Projects
        </Link>

        {/* Mobile edit/preview toggle */}
        <div className="flex rounded-full border border-neutral-200 bg-neutral-100 p-0.5 md:hidden">
          {(["edit", "preview"] as const).map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setMobileView(view)}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold capitalize",
                mobileView === view
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500"
              )}
            >
              {view === "edit" ? <PenLine size={13} /> : <Eye size={13} />}
              {view}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {showSuccess && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 animate-fade-in">
              <CheckCircle2 size={16} />
              Saved
            </span>
          )}
          {saveError && (
            <span className="max-w-[200px] truncate text-sm font-medium text-red-600 animate-fade-in">
              {saveError}
            </span>
          )}
          <ShareReviewModal projectId={projectId} />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <PlatformSidebar activePlatform={platform} onChange={setPlatform} />

        <div
          className={cn(
            "w-full shrink-0 flex-col border-r border-neutral-200 bg-white md:flex md:w-[400px] lg:w-[440px]",
            mobileView === "edit" ? "flex" : "hidden"
          )}
        >
          <PostEditor
            contentText={contentText}
            setContentText={setContentText}
            mediaUrls={mediaUrls}
            setMediaUrls={setMediaUrls}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </div>

        <div
          className={cn(
            "relative flex-1 flex-col overflow-hidden bg-neutral-50 md:flex",
            mobileView === "preview" ? "flex" : "hidden"
          )}
        >
          <div className="absolute inset-0 fine-grid opacity-[0.7]" />
          <div className="relative z-10 flex h-12 shrink-0 items-center justify-between border-b border-neutral-200 bg-white/70 px-5 backdrop-blur">
            <h2 className="text-sm font-semibold text-neutral-900">Live preview</h2>
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
              Updates as you type
            </span>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-y-auto p-6 lg:p-10">
            <div className="flex w-full max-w-2xl justify-center">{mockup}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
