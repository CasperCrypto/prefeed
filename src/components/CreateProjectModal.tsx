"use client";

import { useActionState, useState } from "react";
import { createProject } from "@/app/actions/projects";
import { Plus, X } from "lucide-react";

export function CreateProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (prevState: any, formData: FormData) => {
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
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-colors"
      >
        <Plus size={16} />
        New Project
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Create Project</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form action={formAction} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                  Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  autoFocus
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  placeholder="e.g. Acme Corp"
                />
              </div>

              {state?.error && (
                <p className="text-sm text-red-400">{state.error}</p>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg transition-colors"
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
