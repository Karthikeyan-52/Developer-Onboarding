import { useState, useEffect, useRef } from "react";
import { useRepo } from "@/context/RepoContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SUMMARIZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/summarize-repo`;

export default function SummaryPage() {
  const { isConnected, data } = useRepo();
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const autoTriggered = useRef(false);

  const generateSummary = async () => {
    if (!data) return;
    setIsLoading(true);
    setSummary("");
    setHasGenerated(true);

    try {
      const resp = await fetch(SUMMARIZE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          fileTree: data.fileTree,
          modules: data.modules,
          stats: data.stats,
          pullRequests: data.pullRequests,
        }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              accumulated += content;
              setSummary(accumulated);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (err) {
      toast({
        title: "Summary failed",
        description: err instanceof Error ? err.message : "Could not generate summary",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && data && !hasGenerated && !autoTriggered.current) {
      autoTriggered.current = true;
      generateSummary();
    }
  }, [isConnected, data]);
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground">
        <AlertCircle className="w-12 h-12" />
        <p className="text-lg">Connect a repository first to generate a summary.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Summary</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Get an AI-powered analysis and summary of your repository
          </p>
        </div>
        <Button
          onClick={generateSummary}
          disabled={isLoading}
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {isLoading ? "Analyzing..." : hasGenerated ? "Regenerate" : "Generate Summary"}
        </Button>
      </div>

      {isLoading && !summary && (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/6" />
          </CardContent>
        </Card>
      )}

      {summary && (
        <Card>
          <CardContent className="pt-6 prose prose-sm dark:prose-invert max-w-none">
            <MarkdownRenderer content={summary} />
          </CardContent>
        </Card>
      )}

      {!hasGenerated && !isLoading && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <Sparkles className="w-10 h-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Click "Generate Summary" to analyze your repository with AI
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div>
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return <h2 key={i} className="text-lg font-semibold mt-6 mb-2 text-foreground">{line.slice(3)}</h2>;
        }
        if (line.startsWith("### ")) {
          return <h3 key={i} className="text-base font-semibold mt-4 mb-1 text-foreground">{line.slice(4)}</h3>;
        }
        if (line.startsWith("- ")) {
          return (
            <li key={i} className="ml-4 text-muted-foreground list-disc">
              <InlineMarkdown text={line.slice(2)} />
            </li>
          );
        }
        if (line.trim() === "") {
          return <div key={i} className="h-2" />;
        }
        return <p key={i} className="text-muted-foreground leading-relaxed"><InlineMarkdown text={line} /></p>;
      })}
    </div>
  );
}

function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i} className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-foreground">{part.slice(1, -1)}</code>;
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-foreground font-medium">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}