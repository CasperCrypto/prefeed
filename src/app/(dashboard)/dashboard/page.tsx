import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-zinc-400 text-sm">
        Project overview — wired in Step 2
      </p>
    </div>
  );
}
