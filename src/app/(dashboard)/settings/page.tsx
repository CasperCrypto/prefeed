import { signout } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8 md:py-14">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-wider text-neutral-400">
          Account
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
          Settings
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          Manage the basics for your PreFeed workspace.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white card-soft">
        <div className="border-b border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900">Profile</h2>
          <p className="mt-1 text-sm text-neutral-400">
            Your personal account details.
          </p>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              Email
            </label>
            <input
              type="email"
              disabled
              className="h-11 w-full cursor-not-allowed rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 text-sm text-neutral-500"
              value={user?.email ?? ""}
              readOnly
            />
            <p className="mt-2 text-xs text-neutral-400">
              Email changes are not supported in the MVP.
            </p>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900">Session</h2>
          <p className="mt-1 text-sm text-neutral-400">
            End the current authenticated session.
          </p>

          <form action={signout} className="mt-5">
            <button className="h-10 rounded-full border border-neutral-300 px-5 text-sm font-semibold text-neutral-700 hover:bg-neutral-900 hover:border-neutral-900 hover:text-white">
              Sign out
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
