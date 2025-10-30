# StudyHub AI - Design Guidelines

## Design Approach

**Hybrid Approach**: Combine Material Design's structured component system with inspiration from Discord (community feel), Stack Overflow (reputation/upvoting mechanics), and Linear (clean typography and spacing).

**Core Principles**:
- Information clarity over decoration
- Efficient scanning and navigation
- Trust-building through consistent patterns
- Seamless AI integration without disruption

## Typography System

**Font Families**:
- Primary: Inter (UI elements, body text, posts)
- Monospace: JetBrains Mono (code snippets, inline code)

**Hierarchy**:
- H1: 2.5rem (40px) - Page titles
- H2: 2rem (32px) - Section headers, post titles
- H3: 1.5rem (24px) - Discussion board names, profile sections
- H4: 1.25rem (20px) - Comment headers, card titles
- Body Large: 1.125rem (18px) - Post content, main discussion text
- Body: 1rem (16px) - Comments, descriptions, UI labels
- Body Small: 0.875rem (14px) - Metadata (timestamps, vote counts, tags)
- Caption: 0.75rem (12px) - Tiny labels, badges text

**Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistency
- Component padding: p-4 to p-6
- Section spacing: mb-8, mt-12
- Card gaps: gap-6
- List item spacing: space-y-4

**Container Structure**:
- Max width: max-w-7xl for main content area
- Sidebar: Fixed 280px width on desktop, collapsible on tablet/mobile
- AI Chat Drawer: 400px width, slides from right edge

**Grid Layouts**:
- Discussion boards overview: 3-column grid (lg:grid-cols-3, md:grid-cols-2, grid-cols-1)
- Post feed: Single column with max-w-4xl for optimal reading
- User profile stats: 4-column grid for badges/achievements

**Responsive Breakpoints**:
- Mobile: < 768px (single column, hamburger menu, bottom AI chat button)
- Tablet: 768px - 1024px (2-column grids, drawer sidebar)
- Desktop: > 1024px (full 3-column layouts, persistent sidebar)

## Component Library

### Navigation & Layout

**Top Navigation Bar** (h-16, sticky):
- Logo + "StudyHub AI" wordmark (left)
- Global search bar (center, max-w-xl, rounded-full)
- User avatar + notifications + dark mode toggle (right)
- Mobile: Hamburger menu, search icon triggers modal

**Sidebar** (Desktop persistent, mobile drawer):
- Navigation sections with icons:
  - AI Assistant (chat icon)
  - Home Feed (home icon)
  - Topic Boards (grid icon)
  - Saved Posts (bookmark icon)
  - Profile (user icon)
- Compact board list with unread indicators
- "Create Post" prominent button at bottom

**Main Content Area**:
- Three-column layout for home feed:
  - Left: Sticky sidebar (280px)
  - Center: Post feed (flex-1, max-w-4xl, mx-auto)
  - Right: Trending sidebar (320px, hidden on tablet)

### AI Chat Components

**AI Chat Drawer** (sliding panel):
- Header: "AI Study Assistant" with close icon
- Conversation area with message bubbles (rounded-2xl, p-4)
- User messages: Right-aligned, semibold username
- AI responses: Left-aligned, with small AI avatar icon
- Input area: Sticky bottom with rounded-lg textarea
- Action buttons row above input: "Simplify", "Step-by-step", "Summarize", "Explain like a teacher" (compact pills, text-sm)

**AI Message Enhancements**:
- Code blocks: Syntax highlighted with copy button (top-right)
- Math formulas: Rendered LaTeX with padding
- Collapsible step-by-step sections with numbered headers

### Discussion Components

**Post Card** (rounded-lg border, p-6):
- Header row: User avatar (h-10 w-10) + username + timestamp + board tag (small pill)
- Title: H3, semibold, mb-3
- Content preview: Line-clamp-3 for body text
- Footer row: Upvote button + count, comment count, bookmark icon, "AI Summarize" button
- Hover state: Subtle elevation increase

**Full Post View**:
- Large title (H2) with board tag
- Author info bar with reputation score and badges
- Full Markdown/LaTeX rendered content with proper spacing
- Code blocks with "Ask AI About This Code" button overlay
- Action bar: Upvote (large), Save, Share, "AI Summarize Discussion"

**Comment Thread**:
- Nested structure with left border indicators (border-l-2, pl-4)
- Max 3 levels of nesting, then "Continue thread" link
- Each comment: Avatar + username + reputation points + timestamp
- Upvote count on left side (vertical alignment)
- "Reply" button appears on hover
- Collapsed by default after 5 replies with "Show more" button

**Topic Board Cards** (3-column grid):
- Icon + board name (H4)
- Post count + active users count
- Recent activity timestamp
- Rounded-xl with hover lift effect

### User Profile Components

**Profile Header**:
- Large avatar (h-32 w-32, rounded-full)
- Username (H2) + reputation score (large, bold)
- Member since date + total posts/comments
- Badge collection: Horizontal scrolling row with tooltips
- "Edit Profile" button (if own profile)

**Reputation Score Display**:
- Large number with animated counter on page load
- Progress bar to next reputation tier
- Breakdown: "X from posts, Y from answers, Z from votes received"

**Badge System**:
- Badge cards: rounded-lg, p-4, with icon + name + description
- Categories: Participation, Quality, Specialist, Milestones
- Unlocked badges: Full saturation
- Locked badges: Grayscale with lock icon overlay

### Forms & Input

**Post Creation Form**:
- Title input: text-lg, border-2, rounded-lg, p-4
- Topic selector: Dropdown with icons
- Tag input: Pills with X to remove, text input to add
- Content editor: Markdown toolbar above textarea
  - Bold, Italic, Code, Link, Image, Math buttons
  - Live preview panel (split view on desktop)
- Submit button: Large, rounded-lg, w-full on mobile

**Search Bar**:
- Rounded-full input with search icon
- Dropdown filters appear below: Topic, Sort by, Time range
- Results modal: Full-screen on mobile, centered card on desktop
- Result items: Title + snippet + metadata

### UI Patterns

**Upvote Component**:
- Vertical layout: Up arrow, count, down arrow
- Arrows: Rounded-md buttons, hover scale effect
- Voted state: Filled arrow

**Tag Pills**:
- Rounded-full, px-3 py-1, text-sm
- Board tags: Slightly larger with icon
- User-added tags: Smaller, lighter treatment

**Loading States**:
- Skeleton screens for post cards and comments
- Spinner for AI responses in chat
- Progress bar for file uploads

**Empty States**:
- Centered illustration + heading + description
- "No posts yet" - create first post CTA
- "No saved posts" - browse feed CTA

**Notification Toast**:
- Bottom-right corner, rounded-lg, p-4, shadow-xl
- Icon + message + dismiss X
- Auto-dismiss after 4 seconds

## Interaction Patterns

**AI Chat Drawer**:
- Opens with slide-in animation (300ms ease)
- Backdrop dim overlay when open on mobile
- Draggable header to resize on desktop
- Persists across page navigation (sticky state)

**Infinite Scroll**:
- Post feed loads more on scroll proximity
- Loading indicator at bottom
- "Back to top" button appears after 2 screen heights

**Keyboard Shortcuts**:
- "/" to focus search
- "C" to create post
- "A" to toggle AI chat
- "?" to show shortcuts modal

## Accessibility

- Focus visible rings (ring-2) on all interactive elements
- Aria labels on icon-only buttons
- Keyboard navigation for all features
- Screen reader announcements for AI responses and vote updates
- Color contrast ratios meet WCAG AA standards (will be verified in color phase)

## Images

**Hero Image**: Not applicable - this is a utility-focused app, not a marketing site. The dashboard/feed is the primary interface.

**In-App Images**:
- User avatars: Rounded-full throughout (various sizes: h-8 to h-32)
- Board icons: Simple, monochromatic SVG icons (24x24px)
- Badge illustrations: Colorful vector graphics (64x64px)
- Empty state illustrations: Friendly, simple line art (200x200px)
- Code snippet preview thumbnails in search results

**Image Treatment**:
- Avatar images: Always circular with subtle border
- All images use lazy loading
- Broken image fallback: Initials on solid background