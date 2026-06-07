import { getProjects } from "@/app/actions/projects";
import { FolderKanban, Activity, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const projects = await getProjects();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-zinc-400">Here's what's happening across your projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111113] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <FolderKanban size={18} className="text-indigo-400" />
            <h3 className="font-medium">Total Projects</h3>
          </div>
          <p className="text-3xl font-bold text-white">{projects.length}</p>
        </div>
        <div className="bg-[#111113] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <Activity size={18} className="text-amber-400" />
            <h3 className="font-medium">Pending Review</h3>
          </div>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
        <div className="bg-[#111113] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <h3 className="font-medium">Approved Posts</h3>
          </div>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
      </div>

      <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Recent Projects</h2>
        {projects.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-zinc-500 mb-4">No projects yet. Create your first project to get started.</p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <FolderKanban size={16} />
              Go to Projects
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}/sandbox`}
                className="flex items-center justify-between p-4 bg-[#18181b] border border-white/5 rounded-xl hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${p.brand_color}20` }}
                  >
                    <span
                      className="font-bold"
                      style={{ color: p.brand_color }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{p.name}</h3>
                    <p className="text-xs text-zinc-500">
                      Created {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
