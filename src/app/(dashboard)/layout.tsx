import Link from "next/link";
import { signout } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { Zap, LayoutDashboard, FolderKanban, Settings, LogOut } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Projects", href: "/projects", icon: FolderKanban },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-dvh bg-[#09090b] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-white/5 bg-[#111113]">
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm tracking-tight">
              PreFeed
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* User Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                <span className="text-xs text-zinc-400 font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-white truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <form action={signout}>
              <button
                type="submit"
                className="p-1.5 text-zinc-500 hover:text-red-400 rounded-md transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
