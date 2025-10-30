import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TopicBoardCardProps {
  name: string;
  icon: LucideIcon;
  postCount: number;
  activeUsers: number;
  lastActivity: Date;
  description?: string;
  onClick?: () => void;
}

export function TopicBoardCard({
  name,
  icon: Icon,
  postCount,
  activeUsers,
  lastActivity,
  description,
  onClick,
}: TopicBoardCardProps) {
  return (
    <Card 
      className="p-6 hover-elevate cursor-pointer"
      onClick={onClick}
      data-testid={`card-board-${name.toLowerCase()}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base mb-1" data-testid="text-board-name">
            {name}
          </h4>
          {description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {description}
            </p>
          )}
          
          <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
            <span data-testid="text-post-count">{postCount} posts</span>
            <span>•</span>
            <span data-testid="text-active-users">{activeUsers} active</span>
            <span>•</span>
            <span data-testid="text-last-activity">
              {formatDistanceToNow(lastActivity, { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
