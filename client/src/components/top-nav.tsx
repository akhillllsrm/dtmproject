import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Sparkles } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface TopNavProps {
  user?: {
    name: string;
    avatar?: string;
  };
  notificationCount?: number;
  onOpenAI?: () => void;
  onSearch?: (query: string) => void;
}

export function TopNav({ 
  user, 
  notificationCount = 0,
  onOpenAI,
  onSearch 
}: TopNavProps) {
  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <header className="flex items-center justify-between gap-4 p-4 border-b bg-background sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <SidebarTrigger data-testid="button-sidebar-toggle" />
      </div>

      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts, topics, or users..."
            className="pl-10 rounded-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch?.(e.currentTarget.value);
              }
            }}
            data-testid="input-search"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          className="gap-2"
          onClick={onOpenAI}
          data-testid="button-open-ai"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">AI Assistant</span>
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            data-testid="button-notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>
          {notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
              data-testid="badge-notification-count"
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </Badge>
          )}
        </div>

        <ThemeToggle />

        {user && (
          <Avatar className="h-8 w-8 cursor-pointer" data-testid="avatar-user">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  );
}
