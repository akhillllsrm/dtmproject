import { Button } from "@/components/ui/button";
import { GraduationCap, Sparkles, MessageSquare, TrendingUp, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold">StudyHub AI</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your intelligent study companion combining AI-powered tutoring with collaborative learning
          </p>
          <Button size="lg" className="gap-2" asChild>
            <a href="/api/login" data-testid="button-login">
              <Sparkles className="h-5 w-5" />
              Get Started
            </a>
          </Button>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="p-8">
            <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Study Assistant</h3>
            <p className="text-muted-foreground mb-4">
              Get instant help with homework, code debugging, and complex concepts. Our AI provides step-by-step explanations, simplifies difficult topics, and adapts to your learning style.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Supports text, code, and math (LaTeX)
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Multiple explanation modes
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Available 24/7
              </li>
            </ul>
          </Card>

          <Card className="p-8">
            <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Community Discussions</h3>
            <p className="text-muted-foreground mb-4">
              Join topic-based boards, ask questions, and help fellow students. Earn reputation points and badges as you contribute to the community.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Math, Science, Coding, Writing, Exams
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Upvote helpful answers
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Build your reputation
              </li>
            </ul>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="text-center">
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h4 className="font-semibold mb-2">Threaded Discussions</h4>
            <p className="text-sm text-muted-foreground">
              Organized conversations with nested replies and context
            </p>
          </div>

          <div className="text-center">
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h4 className="font-semibold mb-2">Smart Sorting</h4>
            <p className="text-sm text-muted-foreground">
              Find the best content with Hot, New, and Top sorting
            </p>
          </div>

          <div className="text-center">
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h4 className="font-semibold mb-2">AI Summaries</h4>
            <p className="text-sm text-muted-foreground">
              Get quick summaries of long discussions with one click
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" className="gap-2" asChild>
            <a href="/api/login" data-testid="button-login-footer">
              <GraduationCap className="h-5 w-5" />
              Join StudyHub AI
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
