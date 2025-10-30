import { TopicBoardCard } from '../topic-board-card'
import { Calculator } from 'lucide-react'

export default function TopicBoardCardExample() {
  return (
    <TopicBoardCard
      name="Math"
      icon={Calculator}
      postCount={1247}
      activeUsers={89}
      lastActivity={new Date(Date.now() - 1000 * 60 * 15)}
      description="Algebra, calculus, geometry, and all things mathematics"
      onClick={() => console.log('Open Math board')}
    />
  )
}
