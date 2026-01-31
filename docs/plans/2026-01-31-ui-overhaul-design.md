# BiteBalance UI Overhaul — Design Document

**Theme Name:** Vibrant Harvest
**Date:** January 31, 2026
**Status:** Approved for Implementation

---

## 1. Design Philosophy

BiteBalance transforms from a functional prototype into a distinctive, memorable nutrition app. The design balances **warm, organic foundations** with **bold, vibrant energy** — like a modern farmers market brand crossed with a confident lifestyle app.

**Core Principles:**
- **Warm but Bold:** Cream backgrounds with punchy coral, teal, and gold accents
- **Confident Typography:** Headlines that command attention
- **Organic Flow:** Soft corners, curved shapes, natural movement
- **Delightful Details:** Micro-animations that make every interaction feel alive
- **Dynamic Density:** Spacious heroes, compact data sections

---

## 2. Color System

### Primary Palette

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--bg-primary` | Warm Cream | `#FAF7F2` | Page backgrounds |
| `--bg-secondary` | Sand | `#F0EBE3` | Section backgrounds, hover states |
| `--bg-surface` | Pure White | `#FFFFFF` | Cards, modals, inputs |
| `--text-primary` | Deep Charcoal | `#2D2A26` | Headlines, primary text |
| `--text-secondary` | Warm Gray | `#6B6560` | Body text, descriptions |
| `--text-muted` | Stone | `#9C9690` | Placeholders, captions |

### Accent Colors

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--accent-coral` | Coral Orange | `#E85D4C` | Primary actions, Meal Tracking |
| `--accent-teal` | Teal Green | `#2A9D8F` | Success states, Recipe Generator |
| `--accent-gold` | Golden Yellow | `#E9C46A` | Highlights, Stats |
| `--accent-coral-light` | Coral Light | `#FDF0EE` | Coral backgrounds |
| `--accent-teal-light` | Teal Light | `#EDF7F6` | Teal backgrounds |
| `--accent-gold-light` | Gold Light | `#FDF8EC` | Gold backgrounds |

### Semantic Colors

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--success` | Fresh Green | `#4CAF50` | Success messages |
| `--warning` | Amber | `#FF9800` | Warnings |
| `--error` | Red | `#D32F2F` | Errors |
| `--info` | Blue | `#2196F3` | Information |

### Gradients

```css
--gradient-coral: linear-gradient(135deg, #E85D4C 0%, #F4A261 100%);
--gradient-teal: linear-gradient(135deg, #2A9D8F 0%, #48BFB3 100%);
--gradient-gold: linear-gradient(135deg, #E9C46A 0%, #F4D58D 100%);
--gradient-warm: linear-gradient(180deg, #FAF7F2 0%, #F0EBE3 100%);
--gradient-hero: linear-gradient(135deg, #FAF7F2 0%, #FDF0EE 50%, #EDF7F6 100%);
```

---

## 3. Typography

### Font Stack

```css
--font-display: 'Outfit', sans-serif;      /* Headlines - Bold/Black */
--font-body: 'DM Sans', sans-serif;        /* Body text - Regular/Medium */
--font-mono: 'JetBrains Mono', monospace;  /* Numbers, data, code */
```

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| `display-xl` | 48px / 3rem | 800 | 1.1 | Hero headlines |
| `display-lg` | 36px / 2.25rem | 700 | 1.2 | Page titles |
| `heading-lg` | 28px / 1.75rem | 700 | 1.3 | Section headers |
| `heading-md` | 22px / 1.375rem | 600 | 1.4 | Card titles |
| `heading-sm` | 18px / 1.125rem | 600 | 1.4 | Subsections |
| `body-lg` | 18px / 1.125rem | 400 | 1.6 | Lead paragraphs |
| `body-md` | 16px / 1rem | 400 | 1.6 | Body text |
| `body-sm` | 14px / 0.875rem | 400 | 1.5 | Secondary text |
| `caption` | 12px / 0.75rem | 500 | 1.4 | Labels, captions |
| `data-lg` | 32px / 2rem | 600 | 1.2 | Large statistics |
| `data-md` | 24px / 1.5rem | 600 | 1.2 | Medium statistics |

---

## 4. Spacing & Layout

### Spacing Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;
--space-9: 96px;
```

### Border Radius

```css
--radius-sm: 8px;      /* Buttons, inputs, small elements */
--radius-md: 12px;     /* Cards, modals */
--radius-lg: 16px;     /* Large cards, sections */
--radius-xl: 24px;     /* Hero sections, featured cards */
--radius-full: 9999px; /* Pills, avatars */
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(45, 42, 38, 0.04);
--shadow-md: 0 4px 12px rgba(45, 42, 38, 0.08);
--shadow-lg: 0 8px 24px rgba(45, 42, 38, 0.12);
--shadow-xl: 0 16px 48px rgba(45, 42, 38, 0.16);
--shadow-glow-coral: 0 4px 24px rgba(232, 93, 76, 0.25);
--shadow-glow-teal: 0 4px 24px rgba(42, 157, 143, 0.25);
--shadow-glow-gold: 0 4px 24px rgba(233, 196, 106, 0.25);
```

### Container Widths

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
```

---

## 5. Micro-Animations

### Timing & Easing

```css
/* Durations */
--duration-instant: 100ms;
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
--duration-slower: 500ms;

/* Easings */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);        /* Primary - smooth deceleration */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);    /* Symmetric movements */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1); /* Playful overshoot */
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Subtle spring */
```

### Animation Definitions

#### Button Interactions
```css
.btn {
  transition:
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out),
    background-color var(--duration-fast) var(--ease-out);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn:active {
  transform: translateY(0) scale(0.98);
  transition-duration: var(--duration-instant);
}
```

#### Card Hover
```css
.card {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

/* Gradient blob inside card animates on hover */
.card:hover .card-blob {
  transform: scale(1.1) rotate(5deg);
  opacity: 0.9;
}
```

#### Page Load - Staggered Fade In
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeInUp var(--duration-slow) var(--ease-out) forwards;
  opacity: 0;
}

/* Stagger children */
.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 75ms; }
.stagger-children > *:nth-child(3) { animation-delay: 150ms; }
.stagger-children > *:nth-child(4) { animation-delay: 225ms; }
.stagger-children > *:nth-child(5) { animation-delay: 300ms; }
```

#### Input Focus
```css
.input {
  transition:
    border-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.input:focus {
  border-color: var(--accent-coral);
  box-shadow: 0 0 0 3px rgba(232, 93, 76, 0.15);
}
```

#### Icon Hover
```css
.icon-btn {
  transition:
    transform var(--duration-fast) var(--ease-bounce),
    color var(--duration-fast) var(--ease-out);
}

.icon-btn:hover {
  transform: scale(1.15);
  color: var(--accent-coral);
}

.icon-btn:active {
  transform: scale(0.95);
}
```

#### Navbar Scroll
```css
.navbar {
  transition:
    background-color var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out),
    backdrop-filter var(--duration-normal) var(--ease-out);
}

.navbar.scrolled {
  background-color: rgba(250, 247, 242, 0.85);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-md);
}
```

#### Progress/Loading States
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 25%,
    var(--bg-surface) 50%,
    var(--bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

#### Number Counter Animation
```css
@keyframes countUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.stat-number {
  animation: countUp var(--duration-slow) var(--ease-out) forwards;
}
```

#### Floating Blob Animation (Background)
```css
@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -10px) rotate(5deg); }
  50% { transform: translate(0, -20px) rotate(0deg); }
  75% { transform: translate(-10px, -10px) rotate(-5deg); }
}

.floating-blob {
  animation: float 8s var(--ease-in-out) infinite;
}
```

#### Upload Dropzone
```css
.dropzone {
  transition:
    border-color var(--duration-fast) var(--ease-out),
    background-color var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);
}

.dropzone:hover,
.dropzone.drag-over {
  border-color: var(--accent-coral);
  background-color: var(--accent-coral-light);
  transform: scale(1.01);
}

.dropzone.drag-over .upload-icon {
  animation: bounce 0.5s var(--ease-bounce) infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
```

#### Toast Notifications
```css
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

.toast-enter {
  animation: slideInRight var(--duration-normal) var(--ease-out) forwards;
}

.toast-exit {
  animation: slideOutRight var(--duration-normal) var(--ease-out) forwards;
}
```

#### Tab Indicator
```css
.tab-indicator {
  transition:
    left var(--duration-normal) var(--ease-spring),
    width var(--duration-normal) var(--ease-spring);
}
```

#### Success Checkmark
```css
@keyframes checkmark {
  0% { stroke-dashoffset: 50; }
  100% { stroke-dashoffset: 0; }
}

@keyframes scaleIn {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.success-icon {
  animation: scaleIn var(--duration-slow) var(--ease-bounce) forwards;
}

.success-icon path {
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  animation: checkmark var(--duration-normal) var(--ease-out) forwards;
  animation-delay: 200ms;
}
```

---

## 6. Component Specifications

### 6.1 Navbar

**Structure:**
- Fixed at top, full width
- Height: 72px desktop, 64px mobile
- Background: Warm Cream (`--bg-primary`)
- On scroll: Adds blur backdrop + subtle shadow

**Elements:**
- Logo (left): BiteBalance wordmark, links to home
- Navigation (center): Meal Tracking | Recipe Generator | Stats
- Profile (right): Avatar circle with dropdown on click

**Animations:**
- Nav links: Underline slides in from left on hover
- Avatar: Scale up slightly on hover
- Scroll transition: Smooth backdrop blur fade-in

```
┌─────────────────────────────────────────────────────────────┐
│  🥗 BiteBalance    [Meals]  [Recipes]  [Stats]        (👤) │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Feature Cards (Home)

**Structure:**
- 3 cards in responsive grid
- Size: Flexible, min 300px width
- Padding: 32px
- Border radius: 16px
- Background: White with gradient blob

**Each Card:**
- Abstract gradient blob (unique color per card)
- Solid icon (48px)
- Bold title (heading-md)
- Description (body-sm, secondary color)

**Card Assignments:**
| Card | Gradient | Icon |
|------|----------|------|
| Meal Tracking | Coral → Orange | Camera/Utensils |
| Recipe Generator | Teal → Light Teal | Chef Hat/Sparkles |
| Stats | Gold → Light Gold | Chart/Graph |

**Animations:**
- Staggered fade-in on page load
- Lift + shadow on hover
- Blob scales and rotates subtly on hover
- Icon has subtle pulse on hover

### 6.3 Buttons

**Variants:**

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Primary | `--accent-coral` | White | None |
| Secondary | `--bg-surface` | `--text-primary` | 1px `--text-muted` |
| Ghost | Transparent | `--accent-coral` | None |
| Teal | `--accent-teal` | White | None |
| Gold | `--accent-gold` | `--text-primary` | None |

**Sizes:**

| Size | Height | Padding | Font |
|------|--------|---------|------|
| sm | 36px | 16px | body-sm |
| md | 44px | 24px | body-md |
| lg | 52px | 32px | body-lg |

**States:**
- Default: Base styles
- Hover: Lift -2px, increased shadow, slightly lighter bg
- Active: Scale 0.98, no lift
- Disabled: 50% opacity, no interactions
- Loading: Spinner replaces text, same size

### 6.4 Input Fields

**Structure:**
- Height: 48px
- Padding: 16px
- Border: 1px solid `--text-muted`
- Border radius: 8px
- Background: White

**States:**
- Default: Subtle border
- Focus: Coral border + coral glow ring
- Error: Red border + red glow ring + error message below
- Disabled: Gray background, no interactions

**Animations:**
- Border color transition on focus
- Label floats up on focus (if using floating labels)

### 6.5 Upload Zone

**Structure:**
- Dashed border (2px)
- Border radius: 16px
- Min height: 200px
- Center-aligned content

**States:**
- Default: Dashed gray border, upload icon + text
- Hover: Coral border, light coral background
- Drag over: Pulsing border, bouncing icon
- Uploading: Progress bar, cancel button
- Complete: Success checkmark animation

### 6.6 Stats/Data Display

**Number Display:**
- Font: JetBrains Mono
- Size: data-lg for primary stats
- Color: Accent color matching context

**Progress Rings:**
- Stroke width: 8px
- Animated fill on mount
- Center shows percentage/value

**Mini Graphs:**
- Subtle line graphs
- Minimal axes
- Teal or coral gradient fills
- Animate drawing on scroll into view

### 6.7 Toast Notifications

**Structure:**
- Fixed bottom-right
- Width: 360px max
- Padding: 16px
- Border radius: 12px
- Shadow: shadow-lg

**Types:**
| Type | Left Border | Icon Color |
|------|-------------|------------|
| Success | Teal | Teal |
| Error | Red | Red |
| Warning | Gold | Gold |
| Info | Coral | Coral |

**Animations:**
- Slide in from right
- Auto-dismiss with progress bar
- Slide out on dismiss

---

## 7. Page Layouts

### 7.1 Home Page

```
┌─────────────────────────────────────────────────────────────┐
│                        [Navbar]                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│     Welcome back, {name}!                                   │
│     Track your nutrition journey                            │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ ░░░CORAL░░░ │  │ ░░░TEAL░░░░ │  │ ░░░GOLD░░░░ │         │
│  │     📷      │  │     👨‍🍳      │  │     📊      │         │
│  │             │  │             │  │             │         │
│  │   Meal      │  │   Recipe    │  │   Your      │         │
│  │   Tracking  │  │   Generator │  │   Stats     │         │
│  │             │  │             │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  ─────────── Today's Summary ───────────                    │
│                                                              │
│  🔥 1,847 cal    🥩 89g protein    💧 2.1L water           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Animations:**
- Greeting fades in first
- Cards stagger in (75ms delay each)
- Today's summary counters animate up
- Floating gradient orbs in background (slow, subtle)

### 7.2 Meal Tracking Page

```
┌─────────────────────────────────────────────────────────────┐
│                        [Navbar]                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│     Log Your Meal                                           │
│     Snap a photo and we'll do the rest                      │
│                                                              │
│     ┌─────────────────────────────────────┐                 │
│     │                                     │                 │
│     │      ┌─────┐                        │                 │
│     │      │  📷 │  Drop image here       │                 │
│     │      └─────┘  or click to browse    │                 │
│     │                                     │                 │
│     │         [Take Photo]                │                 │
│     │                                     │                 │
│     └─────────────────────────────────────┘                 │
│                                                              │
│     ──────── or ────────                                    │
│                                                              │
│     [Search food manually]                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**After Upload - Results:**
```
┌─────────────────────────────────────────────────────────────┐
│     ┌──────────────┐    Detected: Grilled Chicken Salad    │
│     │              │                                        │
│     │   [IMAGE]    │    Calories    Protein    Carbs       │
│     │              │      420         38g       24g        │
│     └──────────────┘                                        │
│                          Fat        Fiber      Sodium       │
│     [✓ Confirm]           18g        6g        380mg       │
│     [✎ Edit]                                               │
│                                                              │
│     ────────────────────────────────────────                │
│     Add to:  ○ Breakfast  ● Lunch  ○ Dinner  ○ Snack       │
│                                                              │
│              [Save Meal]                                    │
└─────────────────────────────────────────────────────────────┘
```

### 7.3 Recipe Generator Page

```
┌─────────────────────────────────────────────────────────────┐
│                        [Navbar]                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│     What's in your kitchen?                                 │
│     Show us your ingredients                                │
│                                                              │
│     ┌─────────────────────────────────────┐                 │
│     │        [Upload Photo]               │                 │
│     └─────────────────────────────────────┘                 │
│                                                              │
│     Preferences                                             │
│     ┌─────────┐ ┌─────────┐ ┌──────────┐                   │
│     │ Cuisine │ │  Time   │ │Difficulty│                   │
│     │  Any ▼  │ │ 30min ▼ │ │  Easy ▼  │                   │
│     └─────────┘ └─────────┘ └──────────┘                   │
│                                                              │
│     Dietary:  [Vegetarian] [Low-carb] [High-protein]       │
│                                                              │
│              [Generate Recipe ✨]                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 7.4 Stats Page

```
┌─────────────────────────────────────────────────────────────┐
│                        [Navbar]                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│     Your Progress                                           │
│     [This Week ▼]                                           │
│                                                              │
│     ┌───────────────────────────────────────────────────┐   │
│     │                                                   │   │
│     │              Weekly Calorie Trend                 │   │
│     │     ╱╲    ╱╲                                      │   │
│     │    ╱  ╲  ╱  ╲    ╱                               │   │
│     │   ╱    ╲╱    ╲  ╱                                │   │
│     │  ╱            ╲╱                                  │   │
│     │  M   T   W   T   F   S   S                       │   │
│     │                                                   │   │
│     └───────────────────────────────────────────────────┘   │
│                                                              │
│     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│     │   Avg Cal   │  │ Avg Protein │  │  Streak     │      │
│     │   1,892     │  │    94g      │  │   12 days   │      │
│     └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                              │
│     ──────── Macro Breakdown ────────                       │
│     [Pie chart]                                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Abstract Artistic Elements

### Gradient Blobs

Each feature area has a signature organic blob shape with gradient:

```css
.blob-coral {
  background: linear-gradient(135deg, #E85D4C 0%, #F4A261 100%);
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  filter: blur(40px);
  opacity: 0.6;
}

.blob-teal {
  background: linear-gradient(135deg, #2A9D8F 0%, #48BFB3 100%);
  border-radius: 40% 60% 70% 30% / 40% 70% 30% 60%;
  filter: blur(40px);
  opacity: 0.6;
}

.blob-gold {
  background: linear-gradient(135deg, #E9C46A 0%, #F4D58D 100%);
  border-radius: 70% 30% 50% 50% / 30% 50% 70% 50%;
  filter: blur(40px);
  opacity: 0.6;
}
```

### Grain Texture Overlay

Subtle noise texture for organic feel:

```css
.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,..."); /* noise pattern */
  z-index: 1000;
}
```

### Curved Section Dividers

Instead of straight horizontal lines:

```css
.wave-divider {
  height: 60px;
  background: url("data:image/svg+xml,..."); /* wave SVG */
  background-size: cover;
}
```

---

## 9. Responsive Breakpoints

```css
/* Mobile first */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

| Breakpoint | Navbar | Cards | Spacing |
|------------|--------|-------|---------|
| < 640px | Hamburger menu | 1 column | Compact |
| 640-1024px | Full nav | 2 columns | Balanced |
| > 1024px | Full nav | 3 columns | Spacious |

---

## 10. Implementation Priority

### Phase 1: Foundation
1. Set up CSS variables (colors, typography, spacing)
2. Install fonts (Outfit, DM Sans, JetBrains Mono)
3. Create base animation utilities
4. Update Tailwind config

### Phase 2: Core Components
1. Navbar with scroll behavior
2. Button component (all variants)
3. Card component with blob backgrounds
4. Input fields

### Phase 3: Pages
1. Home page redesign
2. Meal Tracking flow
3. Recipe Generator flow
4. Stats dashboard

### Phase 4: Polish
1. Page transitions
2. Loading states & skeletons
3. Toast notifications
4. Error states
5. Final micro-animation tuning

---

## 11. Technical Notes

### Dependencies to Add
- `framer-motion` - For complex animations (optional, CSS-first approach preferred)
- Google Fonts: Outfit, DM Sans, JetBrains Mono

### Files to Create/Update
- `src/styles/variables.css` - CSS custom properties
- `src/styles/animations.css` - Keyframes and animation utilities
- `src/styles/base.css` - Reset and base styles
- `tailwind.config.js` - Extended theme
- Component files - New styled versions

### Cleanup
- Remove Material UI components (replace with custom)
- Remove Material Tailwind (conflicting styles)
- Consolidate CSS files into organized structure
- Remove unused dependencies

---

## Approval

**Design Status:** ✅ Approved by user
**Ready for:** Implementation planning

---

*Document created: January 31, 2026*
*Last updated: January 31, 2026*
