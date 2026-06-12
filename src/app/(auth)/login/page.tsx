"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import Link from "next/link";
import { Zap } from "lucide-react";

type AuthActionState = {
  success?: boolean;
  error?: string;
} | null;

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prevState: AuthActionState, formData: FormData) => {
      return await login(formData);
    },
    null
  );

  return (
    <main className="light relative flex min-h-dvh items-center justify-center overflow-hidden bg-neutral-50 px-4 py-12 text-neutral-900">
      <div className="absolute inset-0 dot-grid opacity-[0.5]" />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white to-transparent" />

      <div className="relative w-full max-w-sm">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 text-white">
              <Zap size={16} />
            </span>
            <span className="font-mono text-base font-semibold tracking-tight">
              prefeed
            </span>
          </Link>
          <p className="mt-5 text-sm text-neutral-500">
            Sign in to your workspace.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-7 card-soft">
          <form action={formAction} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                name="email"
                placeholder="you@agency.com"
                required
                type="email"
                className="h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Password
              </label>
              <input
                name="password"
                placeholder="********"
                required
                type="password"
                className="h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none"
              />
            </div>

            {state?.error && (
              <p className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="h-11 w-full rounded-full bg-neutral-900 text-sm font-semibold text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Need a workspace?{" "}
          <Link href="/signup" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
