import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Award } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserProfileHeaderProps {
  name: string;
  avatar?: string;
  reputation: number;
  memberSince: Date;
  postCount: number;
  commentCount: number;
  badges: Array<{
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
  }>;
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
}

export function UserProfileHeader({
  name,
  avatar,
  reputation,
  memberSince,
  postCount,
  commentCount,
  badges,
  isOwnProfile = false,
  onEditProfile,
}: UserProfileHeaderProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-card border rounded-lg p-6" data-testid="profile-header">
      <div className="flex flex-col sm:flex-row gap-6">
        <Avatar className="h-32 w-32 flex-shrink-0">
          <AvatarImage src={avatar} />
          <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="text-profile-name">
                {name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span data-testid="text-member-since">
                  Member for {formatDistanceToNow(memberSince)}
                </span>
              </div>
            </div>
            
            {isOwnProfile && (
              <Button 
                variant="outline"
                onClick={onEditProfile}
                data-testid="button-edit-profile"
              >
                Edit Profile
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 rounded-lg bg-background border">
              <div className="text-2xl font-bold text-primary" data-testid="text-reputation">
                {reputation.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Reputation</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background border">
              <div className="text-2xl font-bold" data-testid="text-posts">
                {postCount}
              </div>
              <div className="text-xs text-muted-foreground">Posts</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background border">
              <div className="text-2xl font-bold" data-testid="text-comments">
                {commentCount}
              </div>
              <div className="text-xs text-muted-foreground">Comments</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background border">
              <div className="text-2xl font-bold" data-testid="text-badges-count">
                {badges.length}
              </div>
              <div className="text-xs text-muted-foreground">Badges</div>
            </div>
          </div>

          {badges.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Recent Badges</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {badges.slice(0, 5).map((badge) => (
                  <Badge
                    key={badge.id}
                    variant="outline"
                    className="gap-1"
                    data-testid={`badge-${badge.id}`}
                  >
                    <span style={{ color: badge.color }}>{badge.icon}</span>
                    <span className="text-xs">{badge.name}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
