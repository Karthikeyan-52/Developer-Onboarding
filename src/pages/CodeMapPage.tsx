import { useState, useMemo } from "react";
import { useRepo } from "@/context/RepoContext";
import type { Module as RepoModule } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, AlertCircle } from "lucide-react";

// local stats type extending the repo module data
interface ModuleWithStats extends RepoModule {
  bubbleSize: number;
  color: string;
}

function ModuleBubble({
  name,
  size,
  color,
  onClick,
}: {
  name: string;
  size: number;
  color: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="rounded-full border flex items-center justify-center cursor-pointer transition hover:scale-105 text-center"
      style={{
        width: size,
        height: size,
        borderColor: color,
        color: color,
      }}
    >
      <span className="text-sm font-medium px-2">{name}</span>
    </div>
  );
}

export default function CodeMapPage() {
  const { isConnected, data } = useRepo();
  const [selected, setSelected] = useState<ModuleWithStats | null>(null);

  const modules: RepoModule[] = data?.modules || [];

  const moduleStats = useMemo(() => {
    return modules.map((m: RepoModule) => {
      const size = Math.floor(Math.random() * 80) + 80;

      let color = "#64748b";

      if (m.importance === "critical") color = "#ef4444";
      else if (m.importance === "important") color = "#3b82f6";
      else color = "#10b981";

      return {
        ...m,
        bubbleSize: size,
        color,
      };
    });
  }, [modules]);

  const maxSize = useMemo(() => {
    if (moduleStats.length === 0) return 100;
    return Math.max(...moduleStats.map((m) => m.bubbleSize));
  }, [moduleStats]);

  if (!isConnected || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground">
        <AlertCircle className="w-12 h-12" />
        <p className="text-lg">Connect a repository first to view the code map.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-foreground">Code Map</h1>
        <p className="text-sm text-muted-foreground">
          Visual overview of repository modules and architecture
        </p>
      </div>

      {/* Top Visualization */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Bubble Map */}
        <Card>
          <CardContent className="p-6 flex flex-wrap gap-10 justify-center items-center min-h-[350px]">
            {moduleStats.map((mod) => (
              <ModuleBubble
                key={mod.name}
                name={mod.name}
                size={mod.bubbleSize}
                color={mod.color}
                onClick={() => setSelected(mod)}
              />
            ))}
          </CardContent>
        </Card>

        {/* Module Details */}
        <Card>
          <CardContent className="p-6 flex items-center justify-center min-h-[350px]">
            {selected ? (
              <div className="space-y-3 text-center max-w-sm">
                <Folder
                  className="w-8 h-8 mx-auto"
                  style={{ color: selected.color }}
                />

                <h2 className="text-xl font-semibold">
                  {selected.name}
                </h2>

                <p className="text-sm text-muted-foreground">
                  {selected.description || "No description available"}
                </p>

                {selected.connections && selected.connections.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Dependencies
                    </p>

                    <div className="flex flex-wrap gap-1 justify-center">
                      {selected.connections.map((c) => (
                        <span
                          key={c}
                          className="text-xs bg-muted px-2 py-1 rounded"
                        >
                          → {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Importance: {selected.importance || "normal"}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                Select a module
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* All Modules */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-sm font-semibold mb-4 tracking-widest text-muted-foreground">
            ALL MODULES
          </h2>

          <div className="space-y-3">
            {moduleStats.map((mod) => {
              const percent = (mod.bubbleSize / maxSize) * 100;

              return (
                <div
                  key={mod.name}
                  className="flex items-center gap-6 py-2 border-b"
                >
                  <div className="flex items-center gap-2 w-40">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: mod.color }}
                    />

                    <span className="text-sm">
                      {mod.name}/
                    </span>
                  </div>

                  <div className="flex-1 bg-muted h-2 rounded">
                    <div
                      className="h-2 rounded"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: mod.color,
                      }}
                    />
                  </div>

                  <span className="text-xs text-muted-foreground w-16">
                    {Math.round(percent)}%
                  </span>

                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    {mod.importance || "normal"}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}