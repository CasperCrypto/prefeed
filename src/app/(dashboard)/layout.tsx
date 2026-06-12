import Link from "next/link";
import { signout } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";
import {
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="light min-h-dvh bg-neutral-50 text-neutral-900 md:flex">
      <aside className="hidden w-[248px] shrink-0 flex-col border-r border-neutral-200 bg-white md:flex">
        <div className="flex h-16 items-center border-b border-neutral-200 px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-white">
              <Zap size={15} />
            </span>
            <span className="font-mono text-sm font-semibold tracking-tight">prefeed</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            >
              <item.icon size={16} className="text-neutral-400 group-hover:text-neutral-700" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100">
              <span className="font-mono text-xs font-semibold uppercase text-neutral-600">
                {user?.email?.charAt(0) ?? "U"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-800">
                {user?.email ?? "Workspace"}
              </p>
              <p className="mt-0.5 text-xs text-neutral-400">Active session</p>
            </div>
            <form action={signout}>
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex min-h-dvh flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white/90 px-4 backdrop-blur md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-white">
              <Zap size={15} />
            </span>
            <span className="font-mono text-sm font-semibold tracking-tight">prefeed</span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                title={item.label}
              >
                <item.icon size={16} />
              </Link>
            ))}
          </div>
        </header>

        <main className="relative flex-1 overflow-auto">
          <div className="pointer-events-none absolute inset-0 fine-grid opacity-[0.6]" />
          <div className="relative">{children}</div>
        </main>
      </div>
    </div>
  );
}
