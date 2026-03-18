import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderTree,
  Boxes,
  GitPullRequest,
  CheckSquare,
  Sparkles,
  Map,
  Github,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/structure", label: "Project Structure", icon: FolderTree },
  { path: "/modules", label: "Modules", icon: Boxes },
  { path: "/pull-requests", label: "Pull Requests", icon: GitPullRequest },
  { path: "/checklist", label: "Onboarding Checklist", icon: CheckSquare },
  { path: "/summary", label: "AI Summary", icon: Sparkles },
  { path: "/code-map", label: "Code Map", icon: Map },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2 }}
      className="h-screen sticky top-0 flex flex-col bg-sidebar border-r border-sidebar-border"
    >
      <div className="flex items-center gap-2 p-4 border-b border-sidebar-border">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 flex-1 min-w-0"
          >
            <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center flex-shrink-0">
              <Github className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm text-foreground truncate">
              DevOnboard
            </span>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center mx-auto">
            <Github className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-sidebar-primary" : ""}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
