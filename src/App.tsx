import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import About from "./pages/About";
import BestPractices from "./pages/BestPractices";
import Resources from "./pages/Resources";
import Templates from "./pages/Templates";
import Documentation from "./pages/Documentation";
import Roadmap from "./pages/Roadmap";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProjectProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SignedIn>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="/best-practices" element={<BestPractices />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/roadmap" element={<Roadmap />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </BrowserRouter>
      </TooltipProvider>
    </ProjectProvider>
  </QueryClientProvider>
);

export default App;
