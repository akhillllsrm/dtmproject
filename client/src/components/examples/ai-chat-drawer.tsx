import { AIChatDrawer } from '../ai-chat-drawer'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function AIChatDrawerExample() {
  const [isOpen, setIsOpen] = useState(true)
  
  return (
    <div className="h-screen w-full relative">
      <div className="p-4">
        <Button onClick={() => setIsOpen(true)}>Open AI Chat</Button>
      </div>
      <AIChatDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}
