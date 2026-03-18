import { motion } from "framer-motion";
import { GitPullRequest } from "lucide-react";
import type { PullRequest } from "@/data/mockData";

const impactStyles = {
  high: "border-l-destructive",
  medium: "border-l-warning",
  low: "border-l-muted-foreground",
};

export default function PRCard({ pr, index }: { pr: PullRequest; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-card border border-border border-l-2 ${impactStyles[pr.impact]} rounded-lg p-5`}
    >
      <div className="flex items-start gap-3">
        <GitPullRequest className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">#{pr.id}</span>
            <h3 className="font-semibold text-sm text-foreground truncate">{pr.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            by <span className="text-accent">{pr.author}</span> · {pr.date}
          </p>
          <p className="text-sm text-secondary-foreground leading-relaxed mb-3">{pr.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {pr.labels.map((label) => (
              <span
                key={label}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}