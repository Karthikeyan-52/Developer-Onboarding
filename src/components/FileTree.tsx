import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { FileNode } from "@/data/mockData";

function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const [selected, setSelected] = useState(false);
  const isFolder = node.type === "folder";

  return (
    <div>
      <button
        onClick={() => {
          if (isFolder) setOpen(!open);
          setSelected(!selected);
        }}
        className={`w-full flex items-center gap-1.5 py-1.5 px-2 rounded-md text-sm hover:bg-muted/50 transition-colors group ${
          selected ? "bg-muted" : ""
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isFolder ? (
          <>
            {open ? (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            {open ? (
              <FolderOpen className="w-4 h-4 text-accent" />
            ) : (
              <Folder className="w-4 h-4 text-accent" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5" />
            <File className="w-4 h-4 text-muted-foreground" />
          </>
        )}
        <span className="font-mono text-xs truncate">{node.name}</span>
      </button>

      {selected && node.description && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-xs text-muted-foreground px-3 pb-1"
          style={{ paddingLeft: `${depth * 16 + 40}px` }}
        >
          {node.description}
        </motion.div>
      )}

      <AnimatePresence>
        {isFolder && open && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            {node.children.map((child) => (
              <FileTreeNode key={child.name} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FileTree({ tree }: { tree: FileNode }) {
  return (
    <div className="bg-card rounded-lg border border-border p-3">
      <FileTreeNode node={tree} />
    </div>
  );
}
