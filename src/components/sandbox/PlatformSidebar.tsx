"use client";

import { PLATFORM_LABELS } from "@/lib/utils";
import type { Platform } from "@/types/database";
import { cn } from "@/lib/utils";

interface PlatformSidebarProps {
  activePlatform: Platform;
  onChange: (platform: Platform) => void;
}

const platforms: Platform[] = ["x", "instagram", "facebook", "tiktok"];

export function PlatformSidebar({
  activePlatform,
  onChange,
}: PlatformSidebarProps) {
  return (
    <div className="flex w-16 shrink-0 flex-col items-center gap-2 overflow-y-auto border-r border-neutral-200 bg-white px-2 py-4 md:w-24">
      {platforms.map((platform) => {
        const isActive = activePlatform === platform;

        return (
          <button
            key={platform}
            onClick={() => onChange(platform)}
            className={cn(
              "group flex h-14 w-full flex-col items-center justify-center gap-1 rounded-lg border text-neutral-400 hover:border-neutral-200 hover:bg-neutral-50 hover:text-neutral-700",
              isActive
                ? "border-neutral-900 bg-neutral-900 text-white hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                : "border-transparent"
            )}
            title={PLATFORM_LABELS[platform]}
            type="button"
          >
            <span className="font-mono text-base font-semibold uppercase">
              {platform.charAt(0)}
            </span>
            <span className="hidden max-w-full truncate px-1 text-[10px] font-medium md:block">
              {PLATFORM_LABELS[platform].replace(" (Twitter)", "")}
            </span>
          </button>
        );
      })}
    </div>
  );
}
