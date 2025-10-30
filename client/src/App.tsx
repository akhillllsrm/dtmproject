// From javascript_log_in_with_replit blueprint
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopNav } from "@/components/top-nav";
import { AIChatDrawer } from "@/components/ai-chat-drawer";
import Home from "@/pages/home";
import TopicBoards from "@/pages/topic-boards";
import PostDetail from "@/pages/post-detail";
import UserProfile from "@/pages/user-profile";
import SavedPosts from "@/pages/saved-posts";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

function AppContent() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (isLoading || !isAuthenticated) {
    return (
      <>
        <Switch>
          <Route path="/" component={Landing} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </>
    );
  }

  const userData = user as any;
  const displayName = userData?.firstName && userData?.lastName 
    ? `${userData.firstName} ${userData.lastName}` 
    : userData?.email || "User";

  return (
    <>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <AppSidebar 
            currentPath="/"
            user={{ 
              name: displayName,
              avatar: userData?.profileImageUrl 
            }}
          />
          <div className="flex flex-col flex-1">
            <TopNav
              user={{ 
                name: displayName,
                avatar: userData?.profileImageUrl 
              }}
              notificationCount={0}
              onOpenAI={() => setIsAIChatOpen(true)}
              onSearch={(query) => console.log("Search:", query)}
            />
            <main className="flex-1 overflow-hidden">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/boards" component={TopicBoards} />
                <Route path="/post/:id" component={PostDetail} />
                <Route path="/profile" component={UserProfile} />
                <Route path="/saved" component={SavedPosts} />
                <Route component={NotFound} />
              </Switch>
            </main>
          </div>
        </div>
        <AIChatDrawer 
          isOpen={isAIChatOpen} 
          onClose={() => setIsAIChatOpen(false)} 
        />
      </SidebarProvider>
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
