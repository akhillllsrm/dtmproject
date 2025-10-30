import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UpvoteButton } from "@/components/upvote-button";
import { TagPill } from "@/components/tag-pill";
import { CommentItem } from "@/components/comment-item";
import { Bookmark, Sparkles, Calculator, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const mockPost = {
  id: "1",
  title: "How do I solve this derivative problem?",
  content: `I'm working on calculus homework and I'm completely stuck on this problem:

**Find the derivative of:** f(x) = x³ · sin(x)

I know I need to use the product rule, which states:
- If f(x) = u(x) · v(x)
- Then f'(x) = u'(x) · v(x) + u(x) · v'(x)

But when I try to apply it, I get confused about which parts need the chain rule. Here's what I've tried so far:

1. u(x) = x³, so u'(x) = 3x²
2. v(x) = sin(x), so v'(x) = cos(x)
3. f'(x) = 3x² · sin(x) + x³ · cos(x)

Is this correct? I feel like I'm missing something. Any step-by-step explanation would be super helpful!`,
  author: {
    name: "Sarah Chen",
    reputation: 1250,
    avatar: "",
  },
  board: {
    name: "Math",
    icon: <Calculator className="h-3 w-3" />,
  },
  tags: ["Calculus", "Derivatives", "Product Rule"],
  votes: 24,
  createdAt: new Date(Date.now() - 1000 * 60 * 45),
};

const mockComments = [
  {
    id: "c1",
    author: { name: "Alex Johnson", reputation: 2840 },
    content: "Great question! Actually, your answer is correct! The product rule doesn't require the chain rule here because both x³ and sin(x) are relatively simple functions. You've applied it perfectly.",
    votes: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    replies: [
      {
        id: "c2",
        author: { name: "Sarah Chen", reputation: 1250 },
        content: "Thank you so much! I was second-guessing myself. So when would I need to use the chain rule with the product rule?",
        votes: 8,
        createdAt: new Date(Date.now() - 1000 * 60 * 25),
        replies: [
          {
            id: "c3",
            author: { name: "Alex Johnson", reputation: 2840 },
            content: "Good question! You'd need the chain rule when one of your functions is composite. For example, if you had x³ · sin(2x), then you'd need the chain rule for sin(2x) because it's sin(u) where u = 2x.",
            votes: 12,
            createdAt: new Date(Date.now() - 1000 * 60 * 20),
          },
        ],
      },
    ],
  },
  {
    id: "c4",
    author: { name: "David Kim", reputation: 1890 },
    content: "Just to add - you can verify your answer by checking specific points or using a graphing calculator to compare the original function's slope with your derivative!",
    votes: 6,
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
  },
];

export default function PostDetail() {
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const initials = mockPost.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <UpvoteButton initialCount={mockPost.votes} />
          </div>

          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarImage src={mockPost.author.avatar} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-medium" data-testid="text-author">
                    {mockPost.author.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {mockPost.author.reputation} pts
                  </span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(mockPost.createdAt, { addSuffix: true })}
                  </span>
                  <TagPill
                    label={mockPost.board.name}
                    icon={mockPost.board.icon}
                    variant="outline"
                    className="ml-auto"
                  />
                </div>

                <h1 className="text-3xl font-bold mb-4" data-testid="text-title">
                  {mockPost.title}
                </h1>

                <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
                  <p className="whitespace-pre-wrap">{mockPost.content}</p>
                </div>

                <div className="flex gap-2 flex-wrap mb-4">
                  {mockPost.tags.map((tag) => (
                    <TagPill key={tag} label={tag} />
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSaved(!saved)}
                    data-testid="button-save"
                  >
                    <Bookmark className={saved ? "h-4 w-4 fill-current" : "h-4 w-4"} />
                    <span className="ml-1">{saved ? "Saved" : "Save"}</span>
                  </Button>

                  <Button variant="ghost" size="sm" data-testid="button-share">
                    <Share2 className="h-4 w-4" />
                    <span className="ml-1">Share</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    data-testid="button-summarize"
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    AI Summarize Discussion
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-4">
                {mockComments.reduce((total, c) => total + 1 + (c.replies?.length || 0), 0)} Comments
              </h2>

              <div className="mb-6">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-2"
                  data-testid="input-comment"
                />
                <Button
                  disabled={!comment.trim()}
                  onClick={() => {
                    console.log("Post comment:", comment);
                    setComment("");
                  }}
                  data-testid="button-post-comment"
                >
                  Post Comment
                </Button>
              </div>

              <div className="space-y-4">
                {mockComments.map((commentData) => (
                  <CommentItem
                    key={commentData.id}
                    {...commentData}
                    onReply={(id) => console.log("Reply to", id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
