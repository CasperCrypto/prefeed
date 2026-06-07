"use client";

import { Heart, MessageCircle, Bookmark, Share, Music, Plus } from "lucide-react";

interface TikTokCardProps {
  contentText: string;
  mediaUrls: string[];
  authorHandle?: string;
  authorAvatar?: string | null;
}

export function TikTokCard({
  contentText,
  mediaUrls,
  authorHandle = "prefeed_user",
  authorAvatar,
}: TikTokCardProps) {
  // TikTok uses a 9:16 aspect ratio usually, filling the mobile screen.
  // We'll mimic this with a fixed height container.
  
  return (
    <div className="relative w-full max-w-[320px] mx-auto h-[568px] bg-black text-white rounded-2xl overflow-hidden shadow-2xl font-[ProximaNova,sans-serif]">
      {/* Video Background */}
      {mediaUrls.length > 0 ? (
        <img src={mediaUrls[0]} alt="Post media" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
          <span className="text-zinc-600 font-medium">Add 9:16 media</span>
        </div>
      )}

      {/* UI Overlay Gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />

      {/* Right Side Actions */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
        {/* Profile */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-[1.5px] border-white overflow-hidden bg-zinc-800 flex items-center justify-center">
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorHandle} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-zinc-500 uppercase">{authorHandle.charAt(0)}</span>
            )}
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#fe2c55] rounded-full flex items-center justify-center border border-white">
            <Plus size={14} className="text-white" />
          </div>
        </div>

        {/* Like */}
        <div className="flex flex-col items-center gap-1 group cursor-pointer mt-2">
          <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
            <Heart size={32} className="fill-white" />
          </div>
          <span className="text-xs font-semibold drop-shadow-md">1.2M</span>
        </div>

        {/* Comment */}
        <div className="flex flex-col items-center gap-1 group cursor-pointer">
          <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
            <MessageCircle size={32} className="fill-white" />
          </div>
          <span className="text-xs font-semibold drop-shadow-md">4,281</span>
        </div>

        {/* Bookmark */}
        <div className="flex flex-col items-center gap-1 group cursor-pointer">
          <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
            <Bookmark size={32} className="fill-white" />
          </div>
          <span className="text-xs font-semibold drop-shadow-md">120K</span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center gap-1 group cursor-pointer">
          <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
            <Share size={32} className="fill-white" />
          </div>
          <span className="text-xs font-semibold drop-shadow-md">8,531</span>
        </div>

        {/* Audio Record Spinner */}
        <div className="mt-4 w-12 h-12 rounded-full border-[10px] border-[#252525] flex items-center justify-center animate-spin overflow-hidden bg-zinc-800">
          <Music size={14} className="text-white animate-pulse" />
        </div>
      </div>

      {/* Bottom Left Info */}
      <div className="absolute bottom-4 left-4 right-20">
        <h3 className="font-semibold text-base mb-2 drop-shadow-md hover:underline cursor-pointer">
          @{authorHandle}
        </h3>
        <p className="text-sm font-medium leading-snug mb-3 drop-shadow-md line-clamp-3">
          {contentText || "Write a caption for your TikTok here! #prefeed #socialmedia"}
        </p>
        <div className="flex items-center gap-2">
          <Music size={16} className="shrink-0" />
          <div className="text-sm font-medium overflow-hidden whitespace-nowrap">
            <div className="animate-[shimmer_5s_linear_infinite] inline-block">
              original sound - {authorHandle} 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
