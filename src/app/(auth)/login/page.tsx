import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your PreFeed account",
};

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#09090b] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              PreFeed
            </span>
          </div>
          <p className="text-sm text-zinc-500">Sign in to your workspace</p>
        </div>

        {/* Card */}
        <div className="bg-[#111113] border border-white/8 rounded-2xl p-7">
          <p className="text-center text-sm text-zinc-400 mb-6">
            Auth UI component will be wired to Supabase Auth in Step 2
          </p>
          <div className="space-y-3">
            <div className="h-10 skeleton rounded-lg" />
            <div className="h-10 skeleton rounded-lg" />
            <div className="h-10 skeleton rounded-lg bg-indigo-600/30" />
          </div>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-5">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Sign up free
          </a>
        </p>
      </div>
    </div>
  );
}
