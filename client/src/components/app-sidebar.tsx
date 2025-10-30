import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  Home, 
  Grid3x3, 
  Bookmark, 
  User, 
  Calculator,
  Beaker,
  Code,
  PenTool,
  GraduationCap,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigation = [
  { title: "Home Feed", url: "/", icon: Home },
  { title: "Topic Boards", url: "/boards", icon: Grid3x3 },
  { title: "Saved Posts", url: "/saved", icon: Bookmark },
  { title: "Profile", url: "/profile", icon: User },
];

const boards = [
  { title: "Math", url: "/boards/math", icon: Calculator },
  { title: "Science", url: "/boards/science", icon: Beaker },
  { title: "Coding", url: "/boards/coding", icon: Code },
  { title: "Writing", url: "/boards/writing", icon: PenTool },
  { title: "Exams", url: "/boards/exams", icon: GraduationCap },
];

interface AppSidebarProps {
  currentPath?: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

export function AppSidebar({ currentPath = "/", user }: AppSidebarProps) {
  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <Sidebar data-testid="app-sidebar">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg">StudyHub AI</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Topic Boards</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {boards.map((board) => (
                <SidebarMenuItem key={board.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath === board.url}
                    data-testid={`board-${board.title.toLowerCase()}`}
                  >
                    <a href={board.url}>
                      <board.icon className="h-4 w-4" />
                      <span>{board.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <Button className="w-full gap-2 mb-4" data-testid="button-create-post">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
        
        {user && (
          <div className="flex items-center gap-3 p-2 rounded-lg hover-elevate cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium truncate">{user.name}</span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
