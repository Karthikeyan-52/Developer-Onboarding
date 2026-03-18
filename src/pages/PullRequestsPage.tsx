import PRCard from "@/components/PRCard";
import { useRepo } from "@/context/RepoContext";

export default function PullRequestsPage() {
  const { isConnected, data } = useRepo();
  const pullRequests = isConnected && data ? data.pullRequests : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Recent Pull Requests</h1>
        <p className="text-sm text-muted-foreground">
          Key pull requests that shaped this project.
        </p>
      </div>
      {pullRequests.length > 0 ? (
        <div className="space-y-4">
          {pullRequests.map((pr, i) => (
            <PRCard key={pr.id} pr={pr} index={i} />
          ))}
        </div>
      ) : isConnected ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No recent pull requests could be found for this repository.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-12">
          Connect a GitHub repository from the Dashboard to see pull requests.
        </p>
      )}
    </div>
  );
}