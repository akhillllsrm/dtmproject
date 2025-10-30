import { PostCard } from '../post-card'
import { Calculator } from 'lucide-react'

export default function PostCardExample() {
  return (
    <PostCard
      id="1"
      title="How do I solve this derivative problem?"
      content="I'm stuck on finding the derivative of f(x) = x^3 * sin(x). I know I need to use the product rule, but I'm getting confused with the chain rule application. Can someone explain the step-by-step process?"
      author={{
        name: "Sarah Chen",
        reputation: 1250
      }}
      board={{
        name: "Math",
        icon: <Calculator className="h-3 w-3" />
      }}
      tags={["Calculus", "Derivatives", "Product Rule"]}
      votes={24}
      commentCount={8}
      createdAt={new Date(Date.now() - 1000 * 60 * 45)}
      onSave={() => console.log('Post saved')}
      onSummarize={() => console.log('Summarize post')}
      onClick={() => console.log('Open post')}
    />
  )
}
