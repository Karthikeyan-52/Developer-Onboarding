import ConnectRepo from "@/components/ConnectRepo";
import StatsCards from "@/components/StatsCards";
import ModuleCard from "@/components/ModuleCard";
import PRCard from "@/components/PRCard";
import { useRepo } from "@/context/RepoContext";
import { modules as mockModules, pullRequests as mockPRs } from "@/data/mockData";

export default function DashboardPage() {
  const { isConnected, data } = useRepo();

  const modules = isConnected && data ? data.modules : [];
  const pullRequests = isConnected && data ? data.pullRequests : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Developer Onboarding Assistant</h1>
        <p className="text-sm text-muted-foreground">
          {isConnected && data
            ? `Connected to ${data.stats.repoName} • ${data.stats.language || "Unknown"}`
            : "Get up to speed on any project, fast. Connect a repo to begin."}
        </p>
      </div>

      <ConnectRepo />
      <StatsCards />

      {modules.length > 0 || pullRequests.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Key Modules</h2>
            <div className="space-y-3">
              {modules.slice(0, 5).map((m, i) => (
                <ModuleCard key={m.name} module={m} index={i} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Recent Pull Requests</h2>
            <div className="space-y-3">
              {pullRequests.length > 0 ? (
                pullRequests.slice(0, 5).map((pr, i) => (
                  <PRCard key={pr.id} pr={pr} index={i} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent pull requests found.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        !isConnected && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Connect a GitHub repository above to see real project data.
          </p>
        )
      )}
    </div>
  );
}