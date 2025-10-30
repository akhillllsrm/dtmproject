import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UpvoteButton } from "./upvote-button";
import { TagPill } from "./tag-pill";
import { MessageSquare, Bookmark, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface PostCardProps {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    reputation: number;
  };
  board: {
    name: string;
    icon?: React.ReactNode;
  };
  tags: string[];
  votes: number;
  commentCount: number;
  createdAt: Date;
  saved?: boolean;
  onSave?: () => void;
  onSummarize?: () => void;
  onClick?: () => void;
}

export function PostCard({
  title,
  content,
  author,
  board,
  tags,
  votes,
  commentCount,
  createdAt,
  saved = false,
  onSave,
  onSummarize,
  onClick,
}: PostCardProps) {
  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card 
      className="p-6 hover-elevate cursor-pointer"
      onClick={onClick}
      data-testid="card-post"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <UpvoteButton initialCount={votes} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={author.avatar} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm" data-testid="text-author">
                  {author.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {author.reputation} pts
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground" data-testid="text-timestamp">
                  {formatDistanceToNow(createdAt, { addSuffix: true })}
                </span>
                <TagPill 
                  label={board.name} 
                  icon={board.icon}
                  variant="outline"
                  className="ml-auto"
                />
              </div>
              
              <h3 className="text-lg font-semibold mt-2 mb-2" data-testid="text-title">
                {title}
              </h3>
              
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                {content}
              </p>
              
              {tags.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-3">
                  {tags.map((tag) => (
                    <TagPill key={tag} label={tag} />
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-2 flex-wrap">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8"
                  data-testid="button-comments"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span className="text-xs">{commentCount}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSave?.();
                  }}
                  data-testid="button-save"
                >
                  <Bookmark className={saved ? "h-4 w-4 fill-current" : "h-4 w-4"} />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 ml-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSummarize?.();
                  }}
                  data-testid="button-summarize"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  <span className="text-xs">AI Summarize</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
