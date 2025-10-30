import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  userName?: string;
}

export function ChatMessage({ role, content, userName = "You" }: ChatMessageProps) {
  const [theme] = useState(() => 
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  const isAssistant = role === "assistant";
  
  return (
    <div 
      className={cn(
        "flex gap-3 mb-4",
        isAssistant ? "items-start" : "items-start flex-row-reverse"
      )}
      data-testid={`message-${role}`}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className={isAssistant ? "bg-primary text-primary-foreground" : ""}>
          {isAssistant ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn("flex-1 min-w-0", !isAssistant && "flex flex-col items-end")}>
        <div className="text-xs text-muted-foreground mb-1 font-medium">
          {isAssistant ? "AI Study Assistant" : userName}
        </div>
        <div 
          className={cn(
            "rounded-2xl p-4 max-w-full",
            isAssistant 
              ? "bg-card border" 
              : "bg-primary text-primary-foreground"
          )}
        >
          {isAssistant ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeString = String(children).replace(/\n$/, "");
                    const isInline = !className;
                    
                    return !isInline && match ? (
                      <div className="relative group">
                        <CopyButton text={codeString} />
                        <SyntaxHighlighter
                          style={theme === 'dark' ? oneDark as any : oneLight as any}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg !mt-2 !mb-2"
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className={cn("bg-muted px-1.5 py-0.5 rounded", className)} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleCopy}
      data-testid="button-copy-code"
    >
      <Copy className="h-4 w-4" />
      {copied && <span className="sr-only">Copied!</span>}
    </Button>
  );
}
