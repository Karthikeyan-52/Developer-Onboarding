import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppSidebar from "@/components/AppSidebar";
import DashboardPage from "@/pages/DashboardPage";
import StructurePage from "@/pages/StructurePage";
import ModulesPage from "@/pages/ModulesPage";
import PullRequestsPage from "@/pages/PullRequestsPage";
import ChecklistPage from "@/pages/ChecklistPage";
import SummaryPage from "@/pages/SummaryPage";
import CodeMapPage from "@/pages/CodeMapPage";
import NotFound from "@/pages/NotFound";
import { RepoProvider } from "@/context/RepoContext";
import Chatbot from "@/components/Chatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RepoProvider>
          <div className="flex min-h-screen">
            <AppSidebar />
            <main className="flex-1 p-8 max-w-5xl">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/structure" element={<StructurePage />} />
                <Route path="/modules" element={<ModulesPage />} />
                <Route path="/pull-requests" element={<PullRequestsPage />} />
                <Route path="/checklist" element={<ChecklistPage />} />
                <Route path="/summary" element={<SummaryPage />} />
                <Route path="/code-map" element={<CodeMapPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Chatbot />
          </div>
        </RepoProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
