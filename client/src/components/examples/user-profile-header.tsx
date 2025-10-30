import { UserProfileHeader } from '../user-profile-header'
import { Star, Zap, Award } from 'lucide-react'

export default function UserProfileHeaderExample() {
  return (
    <UserProfileHeader
      name="Sarah Chen"
      reputation={12450}
      memberSince={new Date(Date.now() - 1000 * 60 * 60 * 24 * 180)}
      postCount={87}
      commentCount={342}
      badges={[
        { id: 'helpful', name: 'Helpful', icon: <Star className="h-3 w-3" />, color: '#f59e0b' },
        { id: 'active', name: 'Active Member', icon: <Zap className="h-3 w-3" />, color: '#3b82f6' },
        { id: 'expert', name: 'Math Expert', icon: <Award className="h-3 w-3" />, color: '#10b981' },
      ]}
      isOwnProfile={true}
      onEditProfile={() => console.log('Edit profile')}
    />
  )
}
