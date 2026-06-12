import { getProjects } from "@/app/actions/projects";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { ArrowRight, FolderKanban } from "lucide-react";
import Link from "next/link";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-64px)] w-full max-w-6xl flex-col px-5 py-10 md:px-8 md:py-14">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-neutral-400">
            Workspaces
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            Projects
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
            Keep each client, brand, or campaign separated with its own review
            room.
          </p>
        </div>
        <CreateProjectModal />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white/60 p-6">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
              <FolderKanban size={26} className="text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900">
              Create your first project
            </h3>
            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Start with a client or campaign workspace, then draft posts and
              share review links from the sandbox.
            </p>
            <div className="mt-6 flex justify-center">
              <CreateProjectModal />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}/sandbox`}
              className="group rounded-xl border border-neutral-200 bg-white p-6 card-soft hover:border-neutral-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50">
                  <span className="font-mono text-base font-semibold uppercase text-neutral-700">
                    {project.name.charAt(0)}
                  </span>
                </div>
                <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-500">
                  Active
                </span>
              </div>

              <div className="mt-8">
                <h3 className="truncate text-lg font-semibold text-neutral-900">
                  {project.name}
                </h3>
                <p className="mt-2 text-sm text-neutral-400">
                  Created {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-4 text-sm font-medium text-neutral-500">
                <span>Open sandbox</span>
                <ArrowRight
                  size={16}
                  className="text-neutral-300 group-hover:translate-x-0.5 group-hover:text-neutral-900"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
