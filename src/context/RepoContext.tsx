import { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { FileNode, Module, PullRequest } from "@/data/mockData";

interface RepoStats {
  totalFiles: number;
  totalFolders: number;
  totalPRs: number;
  stars: number;
  language: string;
  repoName: string;
}

interface RepoData {
  fileTree: FileNode;
  modules: Module[];
  pullRequests: PullRequest[];
  stats: RepoStats;
}

interface RepoContextType {
  repoUrl: string;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  data: RepoData | null;
  connectRepo: (url: string) => Promise<void>;
}

const RepoContext = createContext<RepoContextType | null>(null);

export function RepoProvider({ children }: { children: ReactNode }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RepoData | null>(null);

  const connectRepo = async (url: string) => {
    setRepoUrl(url);
    setIsLoading(true);
    setError(null);

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        "fetch-github-repo",
        { body: { repoUrl: url } }
      );

      if (fnError) throw new Error(fnError.message);
      if (result?.error) throw new Error(result.error);

      setData(result);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch repo");
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RepoContext.Provider value={{ repoUrl, isConnected, isLoading, error, data, connectRepo }}>
      {children}
    </RepoContext.Provider>
  );
}

export function useRepo() {
  const ctx = useContext(RepoContext);
  if (!ctx) throw new Error("useRepo must be used within RepoProvider");
  return ctx;
}