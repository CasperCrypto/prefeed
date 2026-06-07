import { getProjects } from "@/app/actions/projects";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import Link from "next/link";
import { FolderKanban, Settings } from "lucide-react";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Projects</h1>
          <p className="text-zinc-400">Manage your brand and client workspaces.</p>
        </div>
        <CreateProjectModal />
      </div>

      {projects.length === 0 ? (
        <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderKanban size={24} className="text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
            <p className="text-zinc-500 max-w-sm mx-auto">
              Create a project to start previewing and approving social media content.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}/sandbox`}
              className="group bg-[#111113] border border-white/5 hover:border-indigo-500/30 rounded-2xl p-5 transition-all hover:bg-[#18181b]"
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                  style={{ backgroundColor: `${p.brand_color}20` }}
                >
                  <span
                    className="text-lg font-bold"
                    style={{ color: p.brand_color }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button className="text-zinc-600 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors">
                  <Settings size={18} />
                </button>
              </div>

              <h3 className="font-semibold text-lg text-white mb-1 group-hover:text-indigo-400 transition-colors">
                {p.name}
              </h3>
              <p className="text-sm text-zinc-500">
                Created {new Date(p.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
