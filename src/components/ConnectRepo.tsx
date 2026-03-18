import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Link, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRepo } from "@/context/RepoContext";

export default function ConnectRepo() {
  const { isConnected, isLoading, error, repoUrl: connectedUrl, connectRepo } = useRepo();
  const [inputUrl, setInputUrl] = useState("");

  const handleConnect = () => {
    if (!inputUrl) return;
    connectRepo(inputUrl);
  };

  if (isConnected && connectedUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-primary/30 rounded-lg p-6 glow-primary"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Repository Connected</p>
            <p className="text-xs text-muted-foreground font-mono">{connectedUrl}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Github className="w-5 h-5 text-foreground" />
        <h3 className="font-semibold text-sm text-foreground">Connect GitHub Repository</h3>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="https://github.com/org/repo"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            disabled={isLoading}
            className="w-full bg-muted border border-border rounded-md pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
          />
        </div>
        <button
          onClick={handleConnect}
          disabled={!inputUrl || isLoading}
          className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? "Analyzing..." : "Connect"}
        </button>
      </div>
      {error && (
        <div className="mt-3 flex items-center gap-2 text-destructive text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
