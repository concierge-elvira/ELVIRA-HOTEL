# Floating Widget Components

A modular, animated floating action button system for guest interactions.

## Structure

```
floating-widget/
├── FloatingWidgetMenu.tsx      # Main container component
├── FloatingBellButton.tsx      # Bell toggle button with animations
├── FloatingActionButton.tsx    # Individual action buttons
├── index.ts                    # Export file
└── README.md                   # Documentation
```

## Components

### FloatingWidgetMenu

Main container that manages the floating widget state and renders all buttons.

**Props:**

- `onClockClick?: () => void` - Callback for room service/clock button
- `onMessageClick?: () => void` - Callback for message button
- `hasNotifications?: boolean` - Shows notification badge on bell

**Features:**

- Backdrop overlay when open
- Auto-close after action click
- Stacked button layout with staggered animations

### FloatingBellButton

Toggle button with bell icon and animated transitions.

**Props:**

- `isOpen: boolean` - Menu open state
- `onClick: () => void` - Toggle handler
- `hasNotifications?: boolean` - Shows pulsing notification badge

**Animations:**

- Wiggle animation when notifications present
- Rotate and scale on toggle
- Ripple effect when opening
- Smooth icon transition (Bell → X)

### FloatingActionButton

Individual action buttons that appear when menu is open.

**Props:**

- `icon: LucideIcon` - Icon component
- `label: string` - Tooltip label
- `onClick: () => void` - Action handler
- `bgColor?: string` - Tailwind background color class
- `index: number` - Position in stack (for animation timing)
- `isVisible: boolean` - Visibility state

**Features:**

- Slide-up animation with staggered delay
- Hover tooltip on right side
- Scale animation on hover/click
- Customizable background color

## Usage

### In GuestPageLayout

```tsx
<GuestPageLayout
  // ... other props
  onClockClick={() => console.log("Room service clicked")}
  onMessageClick={() => console.log("Messages clicked")}
  hasNotifications={true}
>
  {/* page content */}
</GuestPageLayout>
```

### Standalone Usage

```tsx
import { FloatingWidgetMenu } from "@/components/guest/floating-widget";

<FloatingWidgetMenu
  onClockClick={handleRoomService}
  onMessageClick={handleMessages}
  hasNotifications={hasUnreadMessages}
/>;
```

## Customization

### Adding New Actions

Edit `FloatingWidgetMenu.tsx`:

```tsx
const actions = [
  {
    icon: MessageCircle,
    label: "Messages",
    onClick: () => handleActionClick(onMessageClick),
    bgColor: "bg-blue-500",
  },
  {
    icon: Clock,
    label: "Room Service",
    onClick: () => handleActionClick(onClockClick),
    bgColor: "bg-purple-500",
  },
  // Add your new action here:
  {
    icon: YourIcon,
    label: "Your Label",
    onClick: () => handleActionClick(onYourClick),
    bgColor: "bg-green-500",
  },
];
```

### Changing Colors

- Bell button: Edit `bg-emerald-500` in `FloatingBellButton.tsx`
- Action buttons: Pass `bgColor` prop (e.g., `"bg-blue-500"`)
- Notification badge: Edit `bg-red-500` in `FloatingBellButton.tsx`

### Animations

All animations are defined in `tailwind.config.js`:

- `wiggle`: Bell shake animation
- `slide-up`: Button entrance animation
- `ping`: Ripple effect

## Positioning

- Fixed at `bottom-20 right-6` (above bottom nav)
- Z-index: `z-50` (below modals, above content)
- Backdrop: `-z-10` relative to widget

## Accessibility

- ARIA labels on all buttons
- Keyboard navigation support
- Focus states with Tailwind ring utilities
- Semantic HTML structure
