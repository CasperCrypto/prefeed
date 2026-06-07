import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-2">Projects</h1>
      <p className="text-zinc-400 text-sm">
        Project list — wired in Step 2
      </p>
    </div>
  );
}
