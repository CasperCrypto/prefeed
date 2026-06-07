import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string to relative time (e.g. "2 hours ago") */
export function formatRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Format scheduled date for display */
export function formatScheduled(dateStr: string | null): string {
  if (!dateStr) return "Unscheduled";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Platform display labels */
export const PLATFORM_LABELS: Record<string, string> = {
  x: "X (Twitter)",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
};

/** Platform colors */
export const PLATFORM_COLORS: Record<string, string> = {
  x: "#000000",
  facebook: "#1877F2",
  instagram: "#E1306C",
  tiktok: "#010101",
};

/** Status badge colors */
export const STATUS_COLORS: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  draft: {
    bg: "bg-zinc-800/50",
    text: "text-zinc-400",
    dot: "bg-zinc-500",
  },
  pending: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  approved: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
};

/** Generate a review URL from token */
export function getReviewUrl(token: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base}/review/${token}`;
}

/** Truncate text to N chars */
export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

/** Copy text to clipboard */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Convert File to base64 for preview */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Extract initials from a name */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
