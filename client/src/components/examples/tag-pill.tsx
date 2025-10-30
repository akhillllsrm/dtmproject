import { TagPill } from '../tag-pill'

export default function TagPillExample() {
  return (
    <div className="flex gap-2 flex-wrap">
      <TagPill label="Calculus" />
      <TagPill label="Homework Help" />
      <TagPill label="Derivatives" onRemove={() => console.log('Remove tag')} />
    </div>
  )
}
