"use client";

import { useState } from "react";
import { Check, Copy, Link2, X } from "lucide-react";

interface ShareReviewModalProps {
  projectId: string;
}

export function ShareReviewModal({ projectId }: ShareReviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [reviewUrl, setReviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create review link");
      } else {
        setReviewUrl(data.review_url);
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  };

  const handleCopy = async () => {
    if (!reviewUrl) return;
    await navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const close = () => {
    setIsOpen(false);
    setReviewUrl(null);
    setEmail("");
    setError(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 hover:border-neutral-400 hover:text-neutral-900"
        type="button"
      >
        <Link2 size={15} />
        <span className="hidden sm:inline">Share review link</span>
        <span className="sm:hidden">Share</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Share for review
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  No account or seat needed — clients open a secure link.
                </p>
              </div>
              <button
                onClick={close}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            {reviewUrl ? (
              <div className="space-y-5 p-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Review link for {email}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={reviewUrl}
                      onFocus={(e) => e.target.select()}
                      className="h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 font-mono text-xs text-neutral-700 focus:outline-none"
                    />
                    <button
                      onClick={handleCopy}
                      type="button"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white hover:bg-neutral-700"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-neutral-400">
                    Valid for 30 days. Anyone with the link can review and
                    approve posts in this project.
                  </p>
                </div>
                <div className="flex justify-end border-t border-neutral-100 pt-5">
                  <button
                    onClick={close}
                    type="button"
                    className="h-10 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white hover:bg-neutral-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-5 p-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Client email
                  </label>
                  <input
                    autoFocus
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@brand.com"
                    className="h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none"
                  />
                </div>

                {error && (
                  <p className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <div className="flex justify-end gap-2 border-t border-neutral-100 pt-5">
                  <button
                    type="button"
                    onClick={close}
                    className="h-10 rounded-lg px-4 text-sm font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pending}
                    className="h-10 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {pending ? "Creating..." : "Create link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
