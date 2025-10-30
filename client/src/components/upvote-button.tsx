import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface UpvoteButtonProps {
  initialCount?: number;
  initialVote?: "up" | "down" | null;
  onVote?: (vote: "up" | "down" | null) => void;
  vertical?: boolean;
}

export function UpvoteButton({ 
  initialCount = 0, 
  initialVote = null,
  onVote,
  vertical = true 
}: UpvoteButtonProps) {
  const [vote, setVote] = useState<"up" | "down" | null>(initialVote);
  const [count, setCount] = useState(initialCount);

  const handleVote = (type: "up" | "down") => {
    let newVote: "up" | "down" | null = type;
    let delta = 0;

    if (vote === type) {
      newVote = null;
      delta = type === "up" ? -1 : 1;
    } else if (vote === null) {
      delta = type === "up" ? 1 : -1;
    } else {
      delta = type === "up" ? 2 : -2;
    }

    setVote(newVote);
    setCount(count + delta);
    onVote?.(newVote);
  };

  const containerClass = vertical 
    ? "flex flex-col items-center gap-1" 
    : "flex items-center gap-2";

  return (
    <div className={containerClass} data-testid="upvote-button">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8",
          vote === "up" && "text-primary"
        )}
        onClick={() => handleVote("up")}
        data-testid="button-upvote"
      >
        <ArrowUp className={cn("h-4 w-4", vote === "up" && "fill-current")} />
      </Button>
      <span 
        className={cn(
          "text-sm font-medium min-w-[2ch] text-center",
          vote === "up" && "text-primary",
          vote === "down" && "text-destructive"
        )}
        data-testid="text-vote-count"
      >
        {count}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8",
          vote === "down" && "text-destructive"
        )}
        onClick={() => handleVote("down")}
        data-testid="button-downvote"
      >
        <ArrowDown className={cn("h-4 w-4", vote === "down" && "fill-current")} />
      </Button>
    </div>
  );
}
