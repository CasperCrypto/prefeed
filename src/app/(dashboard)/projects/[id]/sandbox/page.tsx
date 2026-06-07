import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sandbox" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SandboxPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-2">Sandbox</h1>
      <p className="text-zinc-400 text-sm">
        Project ID: <code className="text-indigo-400">{id}</code>
        <br />
        Sandbox canvas — built in Step 3
      </p>
    </div>
  );
}
