"use client";

import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { formatRelative } from "@/lib/utils";

interface InstagramCardProps {
  contentText: string;
  mediaUrls: string[];
  authorName?: string;
  authorAvatar?: string | null;
  createdAt?: string;
}

export function InstagramCard({
  contentText,
  mediaUrls,
  authorName = "prefeed.agency",
  authorAvatar,
  createdAt = new Date().toISOString()
}: InstagramCardProps) {
  return (
    <div className="w-full max-w-sm mx-auto bg-black text-white border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden ring-1 ring-zinc-700 flex items-center justify-center">
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-xs text-zinc-500 uppercase">{authorName.charAt(0)}</span>
            )}
          </div>
          <span className="font-semibold text-sm tracking-tight">{authorName}</span>
        </div>
        <button className="text-white">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Media Viewport (1:1 Aspect Ratio usually) */}
      <div className="w-full aspect-square bg-zinc-900 border-y border-zinc-800 flex items-center justify-center overflow-hidden">
        {mediaUrls.length > 0 ? (
          <img src={mediaUrls[0]} alt="Post media" className="w-full h-full object-cover" />
        ) : (
          <div className="text-zinc-600 text-sm">Add media for preview</div>
        )}
      </div>

      {/* Action Row */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <Heart size={24} className="hover:text-zinc-400 cursor-pointer transition-colors" />
            <MessageCircle size={24} className="hover:text-zinc-400 cursor-pointer transition-colors" />
            <Send size={24} className="hover:text-zinc-400 cursor-pointer transition-colors" />
          </div>
          <Bookmark size={24} className="hover:text-zinc-400 cursor-pointer transition-colors" />
        </div>

        <div className="font-semibold text-sm mb-1 cursor-pointer">1,234 likes</div>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold mr-2 cursor-pointer">{authorName}</span>
          <span className="whitespace-pre-wrap">{contentText || "Write a caption..."}</span>
        </div>

        {/* Date */}
        <div className="text-[10px] text-zinc-500 uppercase mt-2 tracking-wide cursor-pointer">
          {formatRelative(createdAt)}
        </div>
      </div>
    </div>
  );
}
