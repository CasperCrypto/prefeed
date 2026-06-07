import Link from "next/link";
import {
  Zap,
  Eye,
  MessageSquare,
  CheckCircle2,
  Share2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Pixel-Perfect Previews",
    description:
      "See exactly how your posts will look on X, Instagram, Facebook, and TikTok — before publishing.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: MessageSquare,
    title: "Figma-Style Annotations",
    description:
      "Clients click anywhere on the post preview to drop a comment pin. Real-time, precise feedback.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Share2,
    title: "Zero-Login Review Links",
    description:
      "Send clients a secure magic link. They review and approve — no account, no subscription, no friction.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: CheckCircle2,
    title: "One-Click Approve",
    description:
      "Green-light posts instantly. Copy caption + download assets with a single click, ready to publish.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

const platforms = ["X (Twitter)", "Instagram", "Facebook", "TikTok"];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#09090b] text-white overflow-x-hidden">
      {/* ── Nav ───────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">PreFeed</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-1.5 rounded-lg transition-colors"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 px-6 text-center">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-violet-600/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles size={12} />
            No per-seat fees. Ever.
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Social content{" "}
            <span className="gradient-text">approved faster</span>
            <br />
            without the chaos
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Pixel-perfect post previews. Figma-style client annotations.
            Zero-login review links. Built for agencies who are done with Google
            Docs and expensive seat licenses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25"
            >
              Start for free
              <ArrowRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
            <Link
              href="/demo"
              className="flex items-center gap-2 text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 font-medium px-7 py-3.5 rounded-xl transition-all"
            >
              <Eye size={16} />
              See a live preview
            </Link>
          </div>

          {/* Platform pills */}
          <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
            <span className="text-xs text-zinc-500">Supports</span>
            {platforms.map((p) => (
              <span
                key={p}
                className="text-xs text-zinc-400 bg-zinc-800 border border-white/5 rounded-full px-3 py-1"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything your agency needs
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              One tool to preview, annotate, and approve social content —
              without the spreadsheet chaos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 bg-[#111113] border border-white/5 rounded-2xl hover:border-white/10 transition-all hover:bg-[#18181b]"
              >
                <div
                  className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-4`}
                >
                  <f.icon size={20} className={f.color} />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-10 bg-[#111113] border border-white/8 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-violet-600/5 pointer-events-none" />
            <h2 className="text-3xl font-bold tracking-tight mb-4 relative">
              Ready to ditch the chaos?
            </h2>
            <p className="text-zinc-400 mb-8 relative">
              Free forever for solo agencies. No credit card required.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:scale-[1.02] relative"
            >
              Create your workspace
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-sm text-zinc-600">
          © {new Date().getFullYear()} PreFeed. Built for agencies, not
          spreadsheets.
        </p>
      </footer>
    </div>
  );
}
