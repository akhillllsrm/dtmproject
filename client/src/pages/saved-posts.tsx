import { PostCard } from "@/components/post-card";
import { Card } from "@/components/ui/card";
import { Bookmark, Calculator, Code } from "lucide-react";
import { useState } from "react";

const mockSavedPosts = [
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
    content: "Getting this error in my React app...",
    author: { name: "Alex Rivera", reputation: 3420 },
    board: { name: "Coding", icon: <Code className="h-3 w-3" /> },
    tags: ["React", "JavaScript"],
    votes: 18,
    commentCount: 6,
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
  },
];

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState<Set<string>>(
    new Set(mockSavedPosts.map((p) => p.id))
  );

  const handleUnsave = (postId: string) => {
    setSavedPosts((prev) => {
      const next = new Set(prev);
      next.delete(postId);
      return next;
    });
  };

  const displayedPosts = mockSavedPosts.filter((post) => savedPosts.has(post.id));

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Bookmark className="h-6 w-6" />
          <h1 className="text-2xl font-bold" data-testid="text-page-title">
            Saved Posts
          </h1>
        </div>

        {displayedPosts.length > 0 ? (
          <div className="space-y-4">
            {displayedPosts.map((post) => (
              <PostCard
                key={post.id}
                {...post}
                saved={true}
                onSave={() => handleUnsave(post.id)}
                onClick={() => console.log("Open post", post.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg font-medium mb-2">No saved posts yet</h2>
            <p className="text-sm text-muted-foreground">
              Save posts you want to read later by clicking the bookmark icon
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
