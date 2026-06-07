"use client";

import { useActionState } from "react";
import { signup } from "@/app/actions/auth";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await signup(formData);
    },
    null
  );

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#09090b] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              PreFeed
            </span>
          </Link>
          <p className="text-sm text-zinc-500">Create your free workspace</p>
        </div>

        <div className="bg-[#111113] border border-white/8 rounded-2xl p-7">
          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                required
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                placeholder="you@agency.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <p className="text-sm text-red-400">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors"
            >
              {pending ? "Creating workspace..." : "Sign up"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
