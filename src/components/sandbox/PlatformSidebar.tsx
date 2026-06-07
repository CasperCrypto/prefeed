"use client";

import { PLATFORM_LABELS, PLATFORM_COLORS } from "@/lib/utils";
import type { Platform } from "@/types/database";
import { cn } from "@/lib/utils";

interface PlatformSidebarProps {
  activePlatform: Platform;
  onChange: (platform: Platform) => void;
}

export function PlatformSidebar({ activePlatform, onChange }: PlatformSidebarProps) {
  const platforms: Platform[] = ["x", "instagram", "facebook", "tiktok"];

  return (
    <div className="w-16 md:w-20 border-r border-white/5 bg-[#111113] flex flex-col items-center py-6 gap-4 shrink-0 overflow-y-auto">
      {platforms.map((p) => {
        const isActive = activePlatform === p;
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              "relative w-12 h-12 flex items-center justify-center rounded-xl transition-all",
              isActive 
                ? "bg-white/10 shadow-lg scale-105" 
                : "hover:bg-white/5 text-zinc-500 hover:text-zinc-300"
            )}
            title={PLATFORM_LABELS[p]}
          >
            {/* Very simple icon representation using the first letter for MVP, real icons can be added later */}
            <div 
              className="font-bold text-xl uppercase" 
              style={{ color: isActive ? PLATFORM_COLORS[p] : "inherit" }}
            >
              {p.charAt(0)}
            </div>
            
            {isActive && (
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-md"
                style={{ backgroundColor: PLATFORM_COLORS[p] }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
