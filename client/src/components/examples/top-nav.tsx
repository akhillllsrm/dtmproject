import { TopNav } from '../top-nav'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function TopNavExample() {
  return (
    <SidebarProvider>
      <TopNav
        user={{ name: "Sarah Chen" }}
        notificationCount={3}
        onOpenAI={() => console.log('Open AI chat')}
        onSearch={(query) => console.log('Search:', query)}
      />
    </SidebarProvider>
  )
}
