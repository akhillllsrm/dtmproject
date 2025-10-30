import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Calculator, Beaker, Code, PenTool, GraduationCap, TrendingUp, Clock, Flame } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";

const BOARD_ICONS: Record<string, any> = {
  Math: Calculator,
  Science: Beaker,
  Coding: Code,
  Writing: PenTool,
  Exams: GraduationCap,
};

type SortOption = "hot" | "new" | "top";

export default function Home() {
  const [sortBy, setSortBy] = useState<SortOption>("hot");
  const { toast } = useToast();

  const { data: posts = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/posts?sortBy=${sortBy}`],
    retry: false,
  });

  const savePostMutation = useMutation({
    mutationFn: async ({ postId, saved }: { postId: string; saved: boolean }) => {
      if (saved) {
        await apiRequest("DELETE", `/api/saved-posts/${postId}`);
      } else {
        await apiRequest("POST", `/api/saved-posts/${postId}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-posts"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">
            Home Feed
          </h1>
          
          <div className="flex gap-2">
            <Button
              variant={sortBy === "hot" ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setSortBy("hot")}
              data-testid="button-sort-hot"
            >
              <Flame className="h-4 w-4" />
              Hot
            </Button>
            <Button
              variant={sortBy === "new" ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setSortBy("new")}
              data-testid="button-sort-new"
            >
              <Clock className="h-4 w-4" />
              New
            </Button>
            <Button
              variant={sortBy === "top" ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setSortBy("top")}
              data-testid="button-sort-top"
            >
              <TrendingUp className="h-4 w-4" />
              Top
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 h-48 animate-pulse bg-muted/50" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const IconComponent = BOARD_ICONS[post.board] || Code;
              const authorName = post.author?.firstName && post.author?.lastName
                ? `${post.author.firstName} ${post.author.lastName}`
                : post.author?.email || "Anonymous";
              
              return (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  content={post.content}
                  author={{
                    name: authorName,
                    avatar: post.author?.profileImageUrl,
                    reputation: post.author?.reputation || 0,
                  }}
                  board={{
                    name: post.board,
                    icon: <IconComponent className="h-3 w-3" />,
                  }}
                  tags={post.tags || []}
                  votes={post.votes}
                  commentCount={post.commentCount}
                  createdAt={new Date(post.createdAt)}
                  onSave={() => savePostMutation.mutate({ postId: post.id, saved: false })}
                  onSummarize={() => console.log("Summarize post", post.id)}
                  onClick={() => console.log("Open post", post.id)}
                />
              );
            })}
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">
              <p className="text-lg font-medium mb-2">No posts yet</p>
              <p className="text-sm">Be the first to ask a question!</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
