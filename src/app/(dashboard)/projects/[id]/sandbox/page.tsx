import { SandboxClient } from "./SandboxClient";

export default async function SandboxPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  
  return (
    <div className="h-full">
      <SandboxClient projectId={resolvedParams.id} />
    </div>
  );
}
