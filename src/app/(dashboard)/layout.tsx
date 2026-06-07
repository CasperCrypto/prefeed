export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#09090b] flex">
      {/* Sidebar — built in Step 2 */}
      <aside className="hidden md:flex w-60 flex-col border-r border-white/5 bg-[#111113]">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="font-bold text-white text-sm tracking-tight">
              PreFeed
            </span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {["Dashboard", "Projects", "Settings"].map((item) => (
            <div
              key={item}
              className="h-9 skeleton rounded-lg opacity-30"
            />
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
