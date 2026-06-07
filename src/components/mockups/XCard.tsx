"use client";

import { MessageCircle, Repeat2, Heart, BarChart2, Share, CheckCircle2 } from "lucide-react";
import { formatRelative, PLATFORM_COLORS } from "@/lib/utils";

interface XCardProps {
  contentText: string;
  mediaUrls: string[];
  authorName?: string;
  authorHandle?: string;
  authorAvatar?: string | null;
  createdAt?: string;
}

export function XCard({
  contentText,
  mediaUrls,
  authorName = "PreFeed User",
  authorHandle = "prefeed",
  authorAvatar,
  createdAt = new Date().toISOString()
}: XCardProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-black text-white border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-4 flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0 overflow-hidden flex items-center justify-center">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold text-zinc-500">{authorName.charAt(0)}</span>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-[15px] text-[#e7e9ea] truncate hover:underline cursor-pointer">
                {authorName}
              </span>
              <CheckCircle2 size={16} className="text-[#1d9bf0] fill-current" />
              <span className="text-[15px] text-[#71767b] truncate">@{authorHandle}</span>
              <span className="text-[15px] text-[#71767b]">·</span>
              <span className="text-[15px] text-[#71767b] hover:underline cursor-pointer">
                {formatRelative(createdAt)}
              </span>
            </div>
          </div>

          <div className="text-[15px] leading-normal text-[#e7e9ea] whitespace-pre-wrap break-words mb-3">
            {contentText || "What is happening?!"}
          </div>

          {/* Media */}
          {mediaUrls.length > 0 && (
            <div className="rounded-2xl overflow-hidden border border-zinc-800 mb-3 bg-zinc-900 mt-2 aspect-video">
              {/* Note: Simplified media renderer for MVP. Would normally support grids for multiple images. */}
              <img src={mediaUrls[0]} alt="Post media" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between text-[#71767b] max-w-md pr-4 mt-3">
            <div className="flex items-center gap-2 hover:text-[#1d9bf0] cursor-pointer group transition-colors">
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                <MessageCircle size={18} />
              </div>
              <span className="text-[13px]">12</span>
            </div>
            <div className="flex items-center gap-2 hover:text-[#00ba7c] cursor-pointer group transition-colors">
              <div className="p-2 rounded-full group-hover:bg-[#00ba7c]/10 transition-colors">
                <Repeat2 size={18} />
              </div>
              <span className="text-[13px]">4</span>
            </div>
            <div className="flex items-center gap-2 hover:text-[#f91880] cursor-pointer group transition-colors">
              <div className="p-2 rounded-full group-hover:bg-[#f91880]/10 transition-colors">
                <Heart size={18} />
              </div>
              <span className="text-[13px]">48</span>
            </div>
            <div className="flex items-center gap-2 hover:text-[#1d9bf0] cursor-pointer group transition-colors">
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                <BarChart2 size={18} />
              </div>
              <span className="text-[13px]">1.2K</span>
            </div>
            <div className="flex items-center gap-2 hover:text-[#1d9bf0] cursor-pointer group transition-colors">
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                <Share size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
