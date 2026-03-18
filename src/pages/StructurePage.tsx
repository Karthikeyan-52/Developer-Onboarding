import FileTree from "@/components/FileTree";
import { useRepo } from "@/context/RepoContext";

export default function StructurePage() {
  const { isConnected, data } = useRepo();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Project Structure</h1>
        <p className="text-sm text-muted-foreground">
          Explore the codebase layout. Click files and folders to expand.
        </p>
      </div>
      {isConnected && data ? (
        <FileTree tree={data.fileTree} />
      ) : (
        <p className="text-sm text-muted-foreground text-center py-12">
          Connect a GitHub repository from the Dashboard to view project structure.
        </p>
      )}
    </div>
  );
}