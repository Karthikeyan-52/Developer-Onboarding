import ModuleCard from "@/components/ModuleCard";
import { useRepo } from "@/context/RepoContext";

export default function ModulesPage() {
  const { isConnected, data } = useRepo();
  const modules = isConnected && data ? data.modules : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Key Modules</h1>
        <p className="text-sm text-muted-foreground">
          Top-level directories and modules detected in the repository.
        </p>
      </div>
      {modules.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {modules.map((m, i) => (
            <ModuleCard key={m.name} module={m} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-12">
          Connect a GitHub repository from the Dashboard to see modules.
        </p>
      )}
    </div>
  );
}