# BiteBalance UI Overhaul — Implementation Plan

**Based on:** `2026-01-31-ui-overhaul-design.md`
**Branch:** `feature/ui-overhaul`
**Created:** January 31, 2026

---

## Phase 1: Foundation

### Task 1.1: Set Up CSS Variables & Base Styles
**Files:** `src/styles/variables.css`, `src/styles/base.css`

Create the design token system:
```
- All color variables (--bg-*, --text-*, --accent-*)
- Spacing scale (--space-1 through --space-9)
- Border radius tokens (--radius-sm through --radius-full)
- Shadow definitions (--shadow-sm through --shadow-xl, glows)
- Timing/easing variables for animations
```

### Task 1.2: Install & Configure Fonts
**Files:** `index.html`, `src/styles/base.css`

- Add Google Fonts link: Outfit (400-800), DM Sans (400-600), JetBrains Mono (400-600)
- Set up font-family CSS variables
- Configure font-display: swap for performance

### Task 1.3: Create Animation Utilities
**Files:** `src/styles/animations.css`

Define reusable keyframes and utility classes:
- `fadeInUp` keyframe + `.animate-in` class
- `.stagger-children` with delay utilities
- `shimmer` for skeleton loading
- `pulse`, `bounce`, `float` keyframes
- Transition utility classes

### Task 1.4: Update Tailwind Configuration
**Files:** `tailwind.config.js`

Extend Tailwind with:
- Custom colors matching design tokens
- Custom fonts
- Custom spacing values
- Custom border-radius values
- Animation utilities

### Task 1.5: Create Global Styles Entry Point
**Files:** `src/styles/index.css`, `src/main.jsx`

- Import order: variables → base → animations
- Import into main.jsx
- Add grain texture overlay to body

---

## Phase 2: Core Components

### Task 2.1: Create Button Component
**Files:** `src/components/ui/Button.jsx`, `src/components/ui/Button.css`

Variants: Primary (coral), Secondary, Ghost, Teal, Gold
Sizes: sm, md, lg
States: default, hover, active, disabled, loading
Animations: lift on hover, scale on press, spinner for loading

### Task 2.2: Create Card Component
**Files:** `src/components/ui/Card.jsx`, `src/components/ui/Card.css`

- Base card with white background, soft shadow
- Gradient blob background option (coral/teal/gold)
- Hover animation: lift + blob transform
- Support for header, content, footer slots

### Task 2.3: Create Input Component
**Files:** `src/components/ui/Input.jsx`, `src/components/ui/Input.css`

- Text input with focus glow animation
- Error state with red glow
- Optional label (floating or static)
- Optional icon prefix/suffix

### Task 2.4: Create FeatureCard Component
**Files:** `src/components/FeatureCard.jsx`

Specialized card for home page features:
- Gradient blob background
- Icon display (48px solid)
- Title + description
- Hover animations
- Click navigation

### Task 2.5: Redesign Navbar
**Files:** `src/components/Navbar.jsx`, `src/components/Navbar.css`

- Fixed positioning with scroll detection
- Blur backdrop on scroll
- Logo left, nav center, profile right
- Nav link hover: underline slide animation
- Mobile: hamburger menu drawer
- Profile dropdown

### Task 2.6: Create Upload Zone Component
**Files:** `src/components/ui/UploadZone.jsx`, `src/components/ui/UploadZone.css`

- Dashed border dropzone
- Drag-over state with coral highlight
- Bouncing icon on drag
- Progress state with bar
- Success state with checkmark animation
- Integrate with existing upload logic

### Task 2.7: Create Toast/Notification System
**Files:** `src/components/ui/Toast.jsx`, `src/contexts/ToastContext.jsx`

- Toast container (fixed bottom-right)
- Types: success, error, warning, info
- Slide-in/out animations
- Auto-dismiss with progress indicator
- Context provider for app-wide use

---

## Phase 3: Page Redesigns

### Task 3.1: Redesign Home Page
**Files:** `src/pages/Home.jsx`, `src/css/home.css` (or delete and use Tailwind)

- Welcome greeting with user name
- 3 FeatureCards in responsive grid
- Staggered entrance animation
- Today's summary section (if data exists)
- Floating background blobs

### Task 3.2: Redesign Meal Tracking Page (Endproduct/Tracker)
**Files:** `src/pages/Endproduct.jsx`, `src/pages/Tracker.jsx`

- Hero section with heading
- Centered UploadZone component
- Results display after upload:
  - Image preview
  - Detected food name
  - Nutrition stats grid (animated counters)
  - Meal type selector
  - Confirm/Edit buttons
- Loading state with skeleton

### Task 3.3: Redesign Recipe Generator Page
**Files:** `src/pages/Ingredients.jsx`

- Hero heading
- Upload zone for ingredients photo
- Preferences section:
  - Cuisine dropdown
  - Time dropdown
  - Difficulty dropdown
- Dietary tags (toggle chips)
- Generate button with sparkle icon
- Results: Recipe card with ingredients, steps

### Task 3.4: Redesign Stats Page
**Files:** `src/pages/Stats.jsx`, `src/components/Charts.jsx`

- Page header with date range selector
- Main chart (weekly calorie trend) - redesigned styling
- Stat cards row (avg calories, protein, streak)
- Macro breakdown pie chart
- Heatmap calendar
- All numbers animate on mount

### Task 3.5: Redesign Login Page
**Files:** `src/pages/Auth/Login.jsx`

- Centered card layout
- Gradient background (warm tones)
- Logo prominently displayed
- Google sign-in button (styled)
- Subtle entrance animation

---

## Phase 4: Polish & Integration

### Task 4.1: Page Transitions
**Files:** `src/App.jsx` or wrapper component

- Fade transitions between routes
- Consider using React Transition Group or Framer Motion

### Task 4.2: Loading States & Skeletons
**Files:** Various components

- Create Skeleton component
- Add loading states to:
  - Stats page (charts)
  - Meal detection (results)
  - Recipe generation

### Task 4.3: Error States
**Files:** Various components

- Styled error messages
- Retry buttons
- Empty states with illustrations

### Task 4.4: Cleanup & Optimization
**Files:** Various

- Remove unused MUI components
- Remove unused CSS files
- Remove Material Tailwind if not needed
- Audit and remove unused dependencies
- Performance check (Lighthouse)

### Task 4.5: Responsive Testing & Fixes
- Test all breakpoints
- Fix any layout issues
- Ensure touch targets are adequate on mobile

---

## File Structure After Implementation

```
src/
├── styles/
│   ├── index.css          # Main entry, imports all
│   ├── variables.css      # Design tokens
│   ├── base.css           # Reset, typography, global
│   └── animations.css     # Keyframes, utilities
│
├── components/
│   ├── ui/                # Reusable UI primitives
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── UploadZone.jsx
│   │   ├── Toast.jsx
│   │   ├── Skeleton.jsx
│   │   └── index.js       # Barrel export
│   │
│   ├── Navbar.jsx         # Redesigned
│   ├── FeatureCard.jsx    # New
│   ├── NutritionDisplay.jsx # Redesigned
│   └── ... (other existing)
│
├── pages/
│   ├── Home.jsx           # Redesigned
│   ├── Tracker.jsx        # Redesigned
│   ├── Stats.jsx          # Redesigned
│   ├── Ingredients.jsx    # Redesigned
│   └── Auth/
│       └── Login.jsx      # Redesigned
│
└── contexts/
    ├── AuthContext.jsx    # Existing
    └── ToastContext.jsx   # New
```

---

## Dependencies

### To Install
```bash
# None strictly required - CSS-first approach
# Optional for complex animations:
npm install framer-motion
```

### To Remove (after migration)
```bash
npm uninstall @mui/material @mui/icons-material @emotion/react @emotion/styled
npm uninstall @material-tailwind/react
```

---

## Execution Order

1. **Foundation first** (Tasks 1.1-1.5) — Sets up the design system
2. **UI primitives** (Tasks 2.1-2.3) — Button, Card, Input
3. **Navbar** (Task 2.5) — Visible on all pages
4. **Home page** (Task 3.1) — Uses FeatureCard
5. **Upload components** (Task 2.6) — Needed for Tracker/Ingredients
6. **Tracker page** (Task 3.2)
7. **Ingredients page** (Task 3.3)
8. **Stats page** (Task 3.4)
9. **Login page** (Task 3.5)
10. **Toast system** (Task 2.7) — Can be added anytime
11. **Polish** (Phase 4) — Final pass

---

## Review Checkpoints

- [ ] After Phase 1: Design tokens working, fonts loading
- [ ] After Task 2.5 (Navbar): Core navigation styled
- [ ] After Task 3.1 (Home): First full page complete
- [ ] After Phase 3: All pages redesigned
- [ ] After Phase 4: Production ready

---

*Plan created: January 31, 2026*
