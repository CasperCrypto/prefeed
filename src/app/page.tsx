import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  MessageSquare,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";

const workflow = [
  {
    icon: Eye,
    label: "Preview",
    text: "Post mockups stay close to the real platform output.",
  },
  {
    icon: MessageSquare,
    label: "Annotate",
    text: "Clients leave focused feedback on the exact creative.",
  },
  {
    icon: CheckCircle2,
    label: "Approve",
    text: "Approved posts move out of review without another meeting.",
  },
  {
    icon: Share2,
    label: "Share",
    text: "Zero-login review links keep external collaborators moving.",
  },
];

const platformRows = [
  ["X", "Caption", "Draft"],
  ["Instagram", "Media", "Review"],
  ["Facebook", "Client", "Approved"],
  ["TikTok", "Cut", "Ready"],
];

export default function HomePage() {
  return (
    <main className="min-h-dvh overflow-hidden bg-background text-foreground">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-background/82 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/12 bg-white text-black">
              <Zap size={15} />
            </span>
            <span className="font-mono text-sm font-semibold">prefeed</span>
          </Link>

          <div className="hidden items-center gap-8 text-xs font-medium uppercase text-zinc-500 md:flex">
            <a href="#workflow" className="hover:text-white">
              Workflow
            </a>
            <a href="#studio" className="hover:text-white">
              Studio
            </a>
            <a href="#review" className="hover:text-white">
              Review
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-white/16 bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
            >
              Launch app
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[92dvh] px-5 pt-28 md:px-8">
        <div className="absolute inset-0 dot-grid opacity-[0.18]" />
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-white/8 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />

        <div className="relative mx-auto grid max-w-7xl gap-12 pb-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="max-w-3xl pt-10 lg:pt-20">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300">
              <Sparkles size={13} />
              Built for social review, not spreadsheet chasing
            </div>

            <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-6xl lg:text-7xl">
              Approve social posts
              <br />
              <span className="text-zinc-400">like never before</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-400 md:text-xl">
              Fewer threads. More approvals. Preview posts pixel-perfect,
              collect exact feedback, and ship client work without the noise.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black hover:bg-zinc-200"
              >
                Start free
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/14 bg-white/4 px-6 text-sm font-semibold text-white hover:bg-white/8"
              >
                Open workspace
              </Link>
            </div>
          </div>

          <div id="studio" className="relative mx-auto w-full max-w-3xl lg:pt-14">
            <div className="absolute -left-8 top-12 hidden h-56 w-56 rounded-full border border-white/8 md:block" />
            <div className="relative overflow-hidden rounded-lg border border-white/12 bg-black/70 paper-edge">
              <div className="flex h-12 items-center justify-between border-b border-white/10 bg-white/5 px-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                </div>
                <span className="font-mono text-[11px] uppercase text-zinc-500">
                  Live approval canvas
                </span>
              </div>

              <div className="grid min-h-[520px] md:grid-cols-[220px_1fr]">
                <aside className="border-b border-white/10 bg-white/[0.025] p-4 md:border-b-0 md:border-r">
                  <div className="mb-5 h-8 w-24 rounded-md bg-white/10" />
                  <div className="space-y-2">
                    {platformRows.map((row) => (
                      <div
                        key={row[0]}
                        className="grid grid-cols-[52px_1fr] gap-3 rounded-md border border-white/8 bg-black/30 p-3"
                      >
                        <div className="font-mono text-xs text-white">{row[0]}</div>
                        <div>
                          <div className="text-xs font-medium text-zinc-300">
                            {row[1]}
                          </div>
                          <div className="mt-1 text-[11px] text-zinc-600">
                            {row[2]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>

                <div className="relative overflow-hidden p-5 md:p-8">
                  <div className="absolute inset-0 fine-grid opacity-60" />
                  <div className="relative mx-auto max-w-md rounded-lg border border-white/10 bg-[#050505] p-4 shadow-2xl">
                    <div className="flex items-center gap-3 border-b border-white/8 pb-4">
                      <div className="h-10 w-10 rounded-full bg-white/10" />
                      <div className="min-w-0 flex-1">
                        <div className="h-3 w-28 rounded-full bg-white/18" />
                        <div className="mt-2 h-2 w-20 rounded-full bg-white/8" />
                      </div>
                      <div className="h-8 w-8 rounded-md border border-white/10" />
                    </div>
                    <div className="space-y-2 py-4">
                      <div className="h-3 w-full rounded-full bg-white/18" />
                      <div className="h-3 w-5/6 rounded-full bg-white/12" />
                      <div className="h-3 w-2/3 rounded-full bg-white/8" />
                    </div>
                    <div className="aspect-[4/3] rounded-md border border-white/10 bg-white/[0.035] dot-grid opacity-95" />
                    <div className="mt-4 flex justify-between text-zinc-600">
                      <span className="h-8 w-16 rounded-full border border-white/8" />
                      <span className="h-8 w-16 rounded-full border border-white/8" />
                      <span className="h-8 w-16 rounded-full border border-white/8" />
                    </div>
                  </div>

                  <div className="absolute right-6 top-16 max-w-[190px] rounded-md border border-white/12 bg-black/80 p-3 backdrop-blur">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      <span className="text-xs font-semibold text-white">
                        Client note
                      </span>
                    </div>
                    <p className="text-xs leading-5 text-zinc-400">
                      Tighten caption and keep the final creative in frame.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="border-y border-white/8 bg-white/[0.018] px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase text-zinc-500">
                Review system
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight text-white md:text-5xl">
                Everything stays structured from draft to approval.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-zinc-400 lg:ml-auto">
              PreFeed keeps the agency loop small: one workspace, platform
              previews, exact comments, and a clear approval state for every
              post.
            </p>
          </div>

          <div className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {workflow.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-black/35 p-5"
              >
                <item.icon size={18} className="text-zinc-200" />
                <h3 className="mt-8 text-lg font-semibold text-white">
                  {item.label}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="review" className="px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] p-8">
            <div className="absolute inset-0 dot-grid opacity-[0.14]" />
            <div className="relative mx-auto mt-8 max-w-sm rounded-lg border border-white/12 bg-black p-5 paper-edge">
              <div className="mb-5 flex items-center justify-between">
                <div className="h-8 w-28 rounded-md bg-white/12" />
                <div className="h-8 w-8 rounded-full border border-white/12" />
              </div>
              <div className="space-y-2">
                <div className="h-3 rounded-full bg-white/18" />
                <div className="h-3 w-4/5 rounded-full bg-white/10" />
              </div>
              <div className="mt-5 aspect-square rounded-md bg-white/[0.045]" />
              <div className="mt-5 flex gap-2">
                <div className="h-9 flex-1 rounded-md bg-white text-black" />
                <div className="h-9 flex-1 rounded-md border border-white/12" />
              </div>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase text-zinc-500">
              Client side
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-5xl">
              Review links that feel calm, not crowded.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400">
              The interface gives clients only what they need: the creative,
              the caption, comments, and a clear approval action.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/14 bg-white px-6 text-sm font-semibold text-black hover:bg-zinc-200"
            >
              Create workspace
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/8 px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-zinc-600 md:flex-row md:items-center md:justify-between">
          <span className="font-mono">prefeed</span>
          <span>Social content preview and approval.</span>
        </div>
      </footer>
    </main>
  );
}
