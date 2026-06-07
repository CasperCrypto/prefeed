import type { Metadata } from "next";
import { validateClientToken } from "@/lib/tokens";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Review",
  description: "Review and approve social media posts",
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ReviewPage({ params }: Props) {
  const { token } = await params;

  const tokenRecord = await validateClientToken(token);

  if (!tokenRecord) {
    notFound();
  }

  return (
    <div className="min-h-dvh bg-[#09090b] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600" />
          <span className="font-semibold text-sm">PreFeed Review</span>
        </div>
        <span className="text-xs text-zinc-500 bg-zinc-800 rounded-full px-3 py-1">
          Reviewing as {tokenRecord.email}
        </span>
      </div>

      {/* Content */}
      <div className="p-8 text-center">
        <p className="text-zinc-400 text-sm">
          Project: <code className="text-indigo-400">{tokenRecord.project_id}</code>
          <br />
          <br />
          Full Reviewer UI — built in Step 3
        </p>
      </div>
    </div>
  );
}
