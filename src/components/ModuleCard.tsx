import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Module } from "@/data/mockData";

const importanceBadge = {
  critical: "bg-destructive/15 text-destructive border-destructive/20",
  important: "bg-warning/15 text-warning border-warning/20",
  standard: "bg-muted text-muted-foreground border-border",
};

export default function ModuleCard({ module, index }: { module: Module; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-lg p-5 hover:border-primary/30 transition-colors group"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-sm text-foreground">{module.name}</h3>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${importanceBadge[module.importance]}`}
        >
          {module.importance}
        </span>
      </div>
      <p className="text-xs font-mono text-muted-foreground mb-3">{module.path}</p>
      <p className="text-sm text-secondary-foreground leading-relaxed mb-4">{module.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {module.connections.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-1 text-[10px] text-accent px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20"
          >
            <ArrowRight className="w-2.5 h-2.5" />
            {c}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
