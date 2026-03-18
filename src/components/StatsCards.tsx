import { motion } from "framer-motion";
import { FolderTree, Boxes, GitPullRequest, Star } from "lucide-react";
import { useRepo } from "@/context/RepoContext";

export default function StatsCards() {
  const { data, isConnected } = useRepo();

  const stats = isConnected && data
    ? [
        { label: "Files", value: String(data.stats.totalFiles), icon: FolderTree, color: "text-accent" },
        { label: "Folders", value: String(data.stats.totalFolders), icon: Boxes, color: "text-primary" },
        { label: "Recent PRs", value: String(data.stats.totalPRs), icon: GitPullRequest, color: "text-warning" },
        { label: "Stars", value: String(data.stats.stars), icon: Star, color: "text-success" },
      ]
    : [
        { label: "Files & Folders", value: "—", icon: FolderTree, color: "text-accent" },
        { label: "Key Modules", value: "—", icon: Boxes, color: "text-primary" },
        { label: "Important PRs", value: "—", icon: GitPullRequest, color: "text-warning" },
        { label: "Stars", value: "—", icon: Star, color: "text-success" },
      ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-card border border-border rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
