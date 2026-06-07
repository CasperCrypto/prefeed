import { signout } from "@/app/actions/auth";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
      <p className="text-zinc-400 mb-8">Manage your account preferences.</p>

      <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-medium text-white mb-1">Profile</h2>
          <p className="text-sm text-zinc-500">Your personal account details.</p>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
            <input 
              type="email" 
              disabled 
              className="w-full px-3 py-2 bg-zinc-900/50 border border-white/5 rounded-lg text-zinc-500 cursor-not-allowed"
              value="user@example.com"
            />
            <p className="text-xs text-zinc-600 mt-2">Email changes are not supported in the MVP.</p>
          </div>
        </div>

        <div className="p-6 bg-red-500/5">
          <h2 className="text-lg font-medium text-red-400 mb-1">Danger Zone</h2>
          <p className="text-sm text-red-400/70 mb-4">Actions here are permanent.</p>
          
          <form action={signout}>
            <button className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium px-4 py-2 rounded-lg transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
