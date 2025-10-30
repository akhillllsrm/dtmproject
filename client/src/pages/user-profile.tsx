import { UserProfileHeader } from "@/components/user-profile-header";
import { PostCard } from "@/components/post-card";
import { Star, Zap, Award, Trophy, Target, Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Calculator, Code } from "lucide-react";

const mockUser = {
  name: "Sarah Chen",
  avatar: "",
  reputation: 12450,
  memberSince: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180),
  postCount: 87,
  commentCount: 342,
  badges: [
    { id: "helpful", name: "Helpful", icon: <Star className="h-3 w-3" />, color: "#f59e0b" },
    { id: "active", name: "Active Member", icon: <Zap className="h-3 w-3" />, color: "#3b82f6" },
    { id: "expert", name: "Math Expert", icon: <Award className="h-3 w-3" />, color: "#10b981" },
    { id: "contributor", name: "Top Contributor", icon: <Trophy className="h-3 w-3" />, color: "#8b5cf6" },
    { id: "teacher", name: "Great Teacher", icon: <Target className="h-3 w-3" />, color: "#ef4444" },
    { id: "popular", name: "Popular Post", icon: <Heart className="h-3 w-3" />, color: "#ec4899" },
  ],
};

const mockPosts = [
  {
    id: "1",
    title: "How do I solve this derivative problem?",
    content: "I'm stuck on finding the derivative of f(x) = x^3 * sin(x)...",
    author: { name: "Sarah Chen", reputation: 1250 },
    board: { name: "Math", icon: <Calculator className="h-3 w-3" /> },
    tags: ["Calculus", "Derivatives"],
    votes: 24,
    commentCount: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: "2",
    title: "TypeError: Cannot read property of undefined",
    content: "Getting this error in my React app when trying to map over an array...",
    author: { name: "Sarah Chen", reputation: 1250 },
    board: { name: "Coding", icon: <Code className="h-3 w-3" /> },
    tags: ["React", "JavaScript"],
    votes: 18,
    commentCount: 6,
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
  },
];

export default function UserProfile() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <UserProfileHeader
          {...mockUser}
          isOwnProfile={true}
          onEditProfile={() => console.log("Edit profile")}
        />

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full justify-start" data-testid="tabs-profile">
            <TabsTrigger value="posts" data-testid="tab-posts">
              Posts ({mockUser.postCount})
            </TabsTrigger>
            <TabsTrigger value="comments" data-testid="tab-comments">
              Comments ({mockUser.commentCount})
            </TabsTrigger>
            <TabsTrigger value="badges" data-testid="tab-badges">
              Badges ({mockUser.badges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4 mt-6">
            {mockPosts.map((post) => (
              <PostCard
                key={post.id}
                {...post}
                onClick={() => console.log("Open post", post.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="comments" className="mt-6">
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Comment history coming soon</p>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockUser.badges.map((badge) => (
                <Card key={badge.id} className="p-6" data-testid={`card-badge-${badge.id}`}>
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${badge.color}20` }}
                    >
                      <div style={{ color: badge.color }}>{badge.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-semibold">{badge.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Earned for outstanding contributions
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
