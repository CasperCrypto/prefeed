"use client";

import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Globe } from "lucide-react";
import Image from "next/image";
import { formatRelative } from "@/lib/utils";

interface FacebookCardProps {
  contentText: string;
  mediaUrls: string[];
  authorName?: string;
  authorAvatar?: string | null;
  createdAt?: string;
}

export function FacebookCard({
  contentText,
  mediaUrls,
  authorName = "PreFeed Page",
  authorAvatar,
  createdAt = new Date().toISOString()
}: FacebookCardProps) {
  return (
    <div className="w-full max-w-[500px] mx-auto bg-[#242526] text-[#e4e6eb] rounded-lg overflow-hidden shadow-2xl font-[Segoe_UI,Helvetica,Arial,sans-serif]">
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center">
            {authorAvatar ? (
              <Image
                src={authorAvatar}
                alt={authorName}
                width={40}
                height={40}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-bold text-sm text-zinc-500 uppercase">{authorName.charAt(0)}</span>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-[15px] leading-tight hover:underline cursor-pointer">
              {authorName}
            </h4>
            <div className="flex items-center gap-1 text-[13px] text-[#b0b3b8]">
              <span className="hover:underline cursor-pointer">{formatRelative(createdAt)}</span>
              <span>-</span>
              <Globe size={12} className="fill-current" />
            </div>
          </div>
        </div>
        <button className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-[#b0b3b8] transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content Text */}
      <div className="px-4 pb-3 text-[15px] leading-normal whitespace-pre-wrap">
        {contentText || "What's on your mind?"}
      </div>

      {/* Full-bleed Media */}
      {mediaUrls.length > 0 && (
        <div className="w-full bg-black aspect-video flex items-center justify-center overflow-hidden border-y border-white/5">
          <Image
            src={mediaUrls[0]}
            alt="Post media"
            width={720}
            height={405}
            unoptimized
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-4 py-2.5 flex items-center justify-between text-[15px] text-[#b0b3b8] border-b border-white/10">
        <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
          <div className="w-4 h-4 rounded-full bg-[#1877F2] flex items-center justify-center">
            <ThumbsUp size={10} className="text-white fill-white" />
          </div>
          <span>1.2K</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hover:underline cursor-pointer">120 comments</span>
          <span className="hover:underline cursor-pointer">45 shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-3 py-1 flex items-center justify-between">
        <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md hover:bg-white/5 text-[#b0b3b8] font-semibold text-[15px] transition-colors">
          <ThumbsUp size={20} />
          Like
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md hover:bg-white/5 text-[#b0b3b8] font-semibold text-[15px] transition-colors">
          <MessageSquare size={20} />
          Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md hover:bg-white/5 text-[#b0b3b8] font-semibold text-[15px] transition-colors">
          <Share2 size={20} />
          Share
        </button>
      </div>
    </div>
  );
}
