import { ChatMessage } from '../chat-message'

export default function ChatMessageExample() {
  return (
    <div className="space-y-4 max-w-2xl">
      <ChatMessage
        role="user"
        content="Can you explain the derivative of sin(x)?"
      />
      <ChatMessage
        role="assistant"
        content={`The derivative of sin(x) is cos(x). Here's why:

Using the limit definition of a derivative:

\`\`\`math
f'(x) = lim(h→0) [sin(x+h) - sin(x)] / h
\`\`\`

The key insight is using the trigonometric identity for sin(a+b).

**Step-by-step:**
1. Apply the angle addition formula
2. Factor and simplify
3. Take the limit

This is a fundamental derivative that you'll use throughout calculus!`}
      />
    </div>
  )
}
