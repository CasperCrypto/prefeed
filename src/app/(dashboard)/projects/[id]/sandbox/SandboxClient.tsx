"use client";

import { useState, use } from "react";
import { PlatformSidebar } from "@/components/sandbox/PlatformSidebar";
import { PostEditor } from "@/components/sandbox/PostEditor";
import { XCard } from "@/components/mockups/XCard";
import { InstagramCard } from "@/components/mockups/InstagramCard";
import { FacebookCard } from "@/components/mockups/FacebookCard";
import { TikTokCard } from "@/components/mockups/TikTokCard";
import type { Platform } from "@/types/database";
import { createPost } from "@/app/actions/posts";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface SandboxClientProps {
  projectId: string;
}

export function SandboxClient({ projectId }: SandboxClientProps) {
  const [platform, setPlatform] = useState<Platform>("x");
  const [contentText, setContentText] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
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
      // Reset form or keep it to create another variant
    } else {
      alert(result.error || "Failed to save post");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-64px)] md:h-full bg-black overflow-hidden relative">
      {/* Top Bar */}
      <div className="h-14 border-b border-white/5 bg-[#09090b] flex items-center justify-between px-4 shrink-0">
        <Link 
          href="/projects" 
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
        <div className="flex items-center gap-3">
          {showSuccess && (
            <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium animate-fade-in">
              <CheckCircle2 size={16} />
              Saved to drafts
            </span>
          )}
          <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded font-medium">Sandbox Mode</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Platform Switcher */}
        <PlatformSidebar activePlatform={platform} onChange={setPlatform} />

        {/* Middle: Editor */}
        <div className="w-full md:w-[400px] lg:w-[450px] border-r border-white/5 shrink-0 flex flex-col bg-[#09090b]">
          <PostEditor 
            contentText={contentText}
            setContentText={setContentText}
            mediaUrls={mediaUrls}
            setMediaUrls={setMediaUrls}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1 bg-[#09090b] relative overflow-hidden flex flex-col hidden md:flex">
          {/* Subtle grid background */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />
          
          <div className="p-4 border-b border-white/5 bg-[#111113]/80 backdrop-blur-md flex justify-between items-center z-10 shrink-0">
            <h2 className="text-sm font-semibold text-white">Live Preview</h2>
            <span className="text-xs text-zinc-500">Updates instantly as you type</span>
          </div>

          <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center relative">
            <div className="w-full max-w-2xl transform scale-[0.95] xl:scale-100 transition-transform origin-center flex justify-center">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
