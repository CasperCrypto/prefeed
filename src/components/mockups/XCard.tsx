"use client";

import {
  BarChart2,
  CheckCircle2,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
} from "lucide-react";
import Image from "next/image";
import { formatRelative } from "@/lib/utils";

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
  createdAt = new Date().toISOString(),
}: XCardProps) {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg border border-zinc-800 bg-black text-white shadow-2xl">
      <div className="flex gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800">
          {authorAvatar ? (
            <Image
              src={authorAvatar}
              alt={authorName}
              width={40}
              height={40}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-bold text-zinc-500">
              {authorName.charAt(0)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="truncate text-[15px] font-bold text-[#e7e9ea] hover:underline">
                {authorName}
              </span>
              <CheckCircle2 size={16} className="fill-current text-[#1d9bf0]" />
              <span className="truncate text-[15px] text-[#71767b]">
                @{authorHandle}
              </span>
              <span className="text-[15px] text-[#71767b]">-</span>
              <span className="text-[15px] text-[#71767b] hover:underline">
                {formatRelative(createdAt)}
              </span>
            </div>
          </div>

          <div className="mb-3 whitespace-pre-wrap break-words text-[15px] leading-normal text-[#e7e9ea]">
            {contentText || "What is happening?!"}
          </div>

          {mediaUrls.length > 0 && (
            <div className="mb-3 mt-2 aspect-video overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
              <Image
                src={mediaUrls[0]}
                alt="Post media"
                width={640}
                height={360}
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="mt-3 flex max-w-md items-center justify-between pr-4 text-[#71767b]">
            <div className="group flex cursor-pointer items-center gap-2 transition-colors hover:text-[#1d9bf0]">
              <div className="rounded-full p-2 transition-colors group-hover:bg-[#1d9bf0]/10">
                <MessageCircle size={18} />
              </div>
              <span className="text-[13px]">12</span>
            </div>
            <div className="group flex cursor-pointer items-center gap-2 transition-colors hover:text-[#00ba7c]">
              <div className="rounded-full p-2 transition-colors group-hover:bg-[#00ba7c]/10">
                <Repeat2 size={18} />
              </div>
              <span className="text-[13px]">4</span>
            </div>
            <div className="group flex cursor-pointer items-center gap-2 transition-colors hover:text-[#f91880]">
              <div className="rounded-full p-2 transition-colors group-hover:bg-[#f91880]/10">
                <Heart size={18} />
              </div>
              <span className="text-[13px]">48</span>
            </div>
            <div className="group flex cursor-pointer items-center gap-2 transition-colors hover:text-[#1d9bf0]">
              <div className="rounded-full p-2 transition-colors group-hover:bg-[#1d9bf0]/10">
                <BarChart2 size={18} />
              </div>
              <span className="text-[13px]">1.2K</span>
            </div>
            <div className="group flex cursor-pointer items-center gap-2 transition-colors hover:text-[#1d9bf0]">
              <div className="rounded-full p-2 transition-colors group-hover:bg-[#1d9bf0]/10">
                <Share size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
