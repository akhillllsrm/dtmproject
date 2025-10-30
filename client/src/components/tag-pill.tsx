import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagPillProps {
  label: string;
  onRemove?: () => void;
  variant?: "default" | "secondary" | "outline";
  icon?: React.ReactNode;
  className?: string;
}

export function TagPill({ 
  label, 
  onRemove, 
  variant = "secondary",
  icon,
  className 
}: TagPillProps) {
  return (
    <Badge 
      variant={variant}
      className={cn(
        "rounded-full gap-1 px-3 py-1",
        onRemove && "pr-1",
        className
      )}
      data-testid={`tag-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {icon && <span className="h-3 w-3">{icon}</span>}
      <span className="text-xs">{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 rounded-full p-0.5 hover-elevate"
          data-testid="button-remove-tag"
          aria-label={`Remove ${label} tag`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}
