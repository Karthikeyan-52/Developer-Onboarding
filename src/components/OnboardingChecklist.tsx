import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ChecklistItem } from "@/data/mockData";
import { onboardingChecklist } from "@/data/mockData";

type Role = "frontend" | "backend" | "fullstack";

const roleLabels: Record<Role, string> = {
  frontend: "Frontend Developer",
  backend: "Backend Developer",
  fullstack: "Full-Stack Developer",
};

export default function OnboardingChecklist() {
  const [role, setRole] = useState<Role>("fullstack");
  const [items, setItems] = useState<ChecklistItem[]>(onboardingChecklist);

  const filtered = items.filter((item) => item.roles.includes(role));
  const completed = filtered.filter((i) => i.completed).length;
  const progress = filtered.length > 0 ? (completed / filtered.length) * 100 : 0;

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const categories = [...new Set(filtered.map((i) => i.category))];

  return (
    <div className="space-y-6">
      {/* Role selector */}
      <div className="flex gap-2">
        {(Object.keys(roleLabels) as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              role === r
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {roleLabels[r]}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-foreground font-medium">Onboarding Progress</span>
          <span className="text-muted-foreground">
            {completed}/{filtered.length} completed
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-primary rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Checklist by category */}
      {categories.map((cat) => (
        <div key={cat}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {cat}
          </h3>
          <div className="space-y-2">
            {filtered
              .filter((i) => i.category === cat)
              .map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`flex items-start gap-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                    item.completed
                      ? "bg-primary/5 border-primary/20"
                      : "bg-card border-border hover:border-muted-foreground/30"
                  }`}
                  onClick={() => toggle(item.id)}
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border transition-colors ${
                      item.completed
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {item.completed && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        item.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
