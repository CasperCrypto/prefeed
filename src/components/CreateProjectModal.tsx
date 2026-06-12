"use client";

import { useActionState, useState } from "react";
import { createProject } from "@/app/actions/projects";
import { Plus, X } from "lucide-react";

type ProjectActionState = {
  success?: boolean;
  error?: string;
} | null;

export function CreateProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (_prevState: ProjectActionState, formData: FormData) => {
      const result = await createProject(formData);
      if (result.success) {
        setIsOpen(false);
      }
      return result;
    },
    null
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white hover:bg-neutral-700"
      >
        <Plus size={16} />
        New project
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Create project
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  Add a client, brand, or campaign workspace.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <form action={formAction} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Project name
                </label>
                <input
                  autoFocus
                  name="name"
                  placeholder="Acme launch"
                  required
                  type="text"
                  className="h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none"
                />
              </div>

              {state?.error && (
                <p className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                  {state.error}
                </p>
              )}

              <div className="flex justify-end gap-2 border-t border-neutral-100 pt-5">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-10 rounded-lg px-4 text-sm font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="h-10 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pending ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
