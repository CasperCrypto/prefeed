import { getProjects } from "@/app/actions/projects";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  Plus,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Total projects",
    value: (count: number) => count,
    icon: FolderKanban,
  },
  {
    label: "Pending review",
    value: () => 0,
    icon: Activity,
  },
  {
    label: "Approved posts",
    value: () => 0,
    icon: CheckCircle2,
  },
];

export default async function DashboardPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-14">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-neutral-400">
            Workspace overview
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            Welcome back
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
            Review activity, project state, and the latest client work in one
            quiet view.
          </p>
        </div>
        <Link
          href="/projects"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white hover:bg-neutral-700"
        >
          <Plus size={16} />
          New project
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-neutral-200 bg-white p-6 card-soft"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
              <stat.icon size={16} className="text-neutral-400" />
            </div>
            <div className="mt-8 text-4xl font-semibold tracking-tight text-neutral-900">
              {stat.value(projects.length)}
            </div>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white card-soft">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">Recent projects</h2>
            <p className="mt-1 text-sm text-neutral-400">
              The last workspaces created in PreFeed.
            </p>
          </div>
          {projects.length > 0 && (
            <Link
              href="/projects"
              className="hidden text-sm font-medium text-neutral-500 hover:text-neutral-900 md:inline-flex"
            >
              View all
            </Link>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="flex min-h-[320px] items-center justify-center p-6 text-center">
            <div className="max-w-sm">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
                <FolderKanban size={22} className="text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">
                No projects yet
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Create the first workspace for a brand, client, or campaign.
              </p>
              <Link
                href="/projects"
                className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white hover:bg-neutral-700"
              >
                Go to projects
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {projects.slice(0, 5).map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}/sandbox`}
                className="group flex items-center justify-between gap-4 px-6 py-4 hover:bg-neutral-50"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50">
                    <span className="font-mono text-sm font-semibold uppercase text-neutral-700">
                      {project.name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {project.name}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      Created {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-neutral-300 group-hover:translate-x-0.5 group-hover:text-neutral-900"
                />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
