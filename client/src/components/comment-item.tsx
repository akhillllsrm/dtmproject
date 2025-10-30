import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UpvoteButton } from "./upvote-button";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

interface CommentItemProps {
  id: string;
  author: {
    name: string;
    avatar?: string;
    reputation: number;
  };
  content: string;
  votes: number;
  createdAt: Date;
  replies?: CommentItemProps[];
  depth?: number;
  onReply?: (commentId: string) => void;
}

export function CommentItem({
  id,
  author,
  content,
  votes,
  createdAt,
  replies = [],
  depth = 0,
  onReply,
}: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(true);
  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const maxDepth = 3;
  const shouldNest = depth < maxDepth;

  return (
    <div className="group" data-testid={`comment-${id}`}>
      <div className={`flex gap-3 ${shouldNest && depth > 0 ? 'pl-6 border-l-2 border-border' : ''}`}>
        <div className="flex-shrink-0 pt-1">
          <UpvoteButton initialCount={votes} vertical />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={author.avatar} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-medium text-sm" data-testid="text-comment-author">
                  {author.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {author.reputation} pts
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(createdAt, { addSuffix: true })}
                </span>
              </div>
              
              <p className="text-sm mb-2" data-testid="text-comment-content">
                {content}
              </p>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onReply?.(id)}
                data-testid="button-reply"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Reply
              </Button>
            </div>
          </div>

          {replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {showReplies ? (
                <>
                  {replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      {...reply}
                      depth={depth + 1}
                      onReply={onReply}
                    />
                  ))}
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setShowReplies(true)}
                  data-testid="button-show-replies"
                >
                  Show {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
