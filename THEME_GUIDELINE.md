# Aldora Marketplace - Theme & UI Guidelines

## 1. Overview
The Aldora Marketplace UI must inspire **trust, calm, and medical professionalism** while maintaining a modern, premium SaaS ("Zillow for Rehabs") aesthetic. The design should feel both clinical and luxurious, ensuring users feel safe, supported, and confident in the platform.

### Core Principles
- **Trustworthy & Clinical:** Clean lines, ample whitespace, strict alignment.
- **Calm & Supportive:** Soft medical blues, earthy teals, and muted backgrounds.
- **Modern & Premium:** Subtle glassmorphism, refined shadows, and crisp typography.
- **Zillow-Inspired Usability:** Map-forward navigation, highly visual listing cards, structured filter bars, and clear call-to-actions.

---

## 2. Color Palette (Tailwind CSS Tokens)

### Primary Colors (Brand & Action)
Used for primary buttons, active states, and brand highlights.
- **`primary`**: `hsl(215 85% 45%)` - Deep Medical Blue (Trust, Clinical)
- **`primary-foreground`**: `hsl(210 40% 98%)` - Off-White
- **`primary-hover`**: `hsl(215 85% 35%)`

### Secondary Colors (Accents & Highlights)
Used for secondary actions, badges, and map accents.
- **`secondary`**: `hsl(180 40% 92%)` - Soft Teal (Calm, Healing)
- **`secondary-foreground`**: `hsl(180 70% 20%)` - Dark Teal
- **`secondary-hover`**: `hsl(180 40% 85%)`

### Background Colors
- **`background`**: `hsl(210 40% 98%)` - Very light, cool off-white (reduces eye strain compared to pure white).
- **`surface`**: `hsl(0 0% 100%)` - Pure white for cards and modals to create contrast.
- **`muted`**: `hsl(210 20% 94%)` - For subtle backgrounds (e.g., table headers, disabled states).
- **`muted-foreground`**: `hsl(215 15% 45%)` - For secondary text and icons.

### Border Colors
- **`border`**: `hsl(215 20% 88%)` - Soft, barely-there borders for clean separation.
- **`input`**: `hsl(215 20% 85%)` - Slightly darker for form inputs to ensure accessibility.
- **`ring`**: `hsl(215 85% 45%)` - Matches primary color for focus states.

### Status Colors
- **`success`**: `hsl(145 65% 35%)` - Medical Green (Verified, Available)
- **`success-bg`**: `hsl(145 60% 95%)`
- **`warning`**: `hsl(35 90% 50%)` - Soft Orange (Pending, Limited Availability)
- **`warning-bg`**: `hsl(35 90% 95%)`
- **`destructive` (Error)**: `hsl(0 80% 50%)` - Softened Red (Errors, Critical Actions)
- **`destructive-foreground`**: `hsl(0 0% 100%)`

---

## 3. Typography System
We use a modern, highly legible sans-serif stack. **Inter** or **Geist** is recommended for data-heavy UIs.
- **Font Family**: `Inter, sans-serif` (or Next.js Geist)
- **H1**: `text-4xl font-semibold tracking-tight text-slate-900`
- **H2**: `text-3xl font-semibold tracking-tight text-slate-900`
- **H3**: `text-2xl font-semibold tracking-tight text-slate-900`
- **H4**: `text-xl font-medium tracking-tight text-slate-900`
- **Body Large**: `text-lg font-normal text-slate-700`
- **Body Default**: `text-base font-normal text-slate-600`
- **Body Small**: `text-sm font-normal text-slate-500`
- **Micro/Overline**: `text-xs font-semibold uppercase tracking-wider text-slate-400`

---

## 4. Spacing & Layout System
- **Base Unit**: `0.25rem` (Tailwind standard)
- **Container Max-Width**: `max-w-7xl` (1280px) for standard pages. Full-width (`w-full`) for map views.
- **Section Spacing**: `py-16 md:py-24`
- **Element Spacing**: `gap-4` or `gap-6` standard.
- **Page Paddings**: `px-4 md:px-8`

---

## 5. UI Components

### Card Design Rules (Zillow-style)
- **Background**: Pure white (`bg-surface`).
- **Border**: `border border-border`.
- **Shadow**: Subtle, elegant shadow `shadow-sm hover:shadow-md`.
- **Border Radius**: `rounded-xl` (smooth, approachable).
- **Transitions**: `transition-all duration-200 ease-in-out` on hover.
- **Image Treatment**: Top image must have `aspect-[4/3]`, `object-cover`, with `rounded-t-xl`.

### Button Rules
- **Border Radius**: `rounded-lg` for standard buttons, `rounded-full` for map filters/pills.
- **Primary Button**: Solid background, high contrast text. No borders.
- **Secondary Button**: Outline or subtle background. `bg-secondary text-secondary-foreground`.
- **Ghost Button**: Transparent background, dark text on hover.
- **Icon Buttons**: Must have `sr-only` text for screen readers.

### Form Styling
- **Inputs**: `rounded-lg border-input bg-surface px-4 py-2 text-sm`.
- **Focus State**: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
- **Labels**: `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`.
- **Error States**: Red border + inline red text below the input.

### Shadows & Depth
- **Level 1 (Cards, Inputs)**: `shadow-sm`
- **Level 2 (Dropdowns, Hover States)**: `shadow-md`
- **Level 3 (Modals, Floating Nav)**: `shadow-xl`

---

## 6. Specific Layouts

### Map & Listing Platform (Zillow-style)
- **Layout**: 50/50 split (or 40/60) on desktop. Map on right, scrollable list on left.
- **Map Pins**:
  - **Standard**: `bg-primary` pill with white text (price/availability).
  - **Hover/Active**: Expands slightly, color changes to `bg-slate-900`.
  - **Featured/Luxury**: Gold or dark teal outline.
- **Filter Bar**: Sticky top, horizontal scrolling on mobile, pill-shaped buttons.

### Navbar
- **Style**: Glassmorphism or solid white. Sticky top.
- **Height**: `h-16`.
- **Border**: `border-b border-border`.
- **Content**: Logo left, Search/Filters center, User Actions right.

### Modals & Dialogs
- **Backdrop**: `bg-black/40 backdrop-blur-sm`.
- **Panel**: `bg-surface rounded-xl shadow-xl`.
- **Close Button**: Absolute top-right, subtle ghost button.

### Admin Panel
- **Sidebar**: Fixed left, `bg-slate-50 border-r border-border`.
- **Header**: Minimal, breadcrumb navigation.
- **Data Tables**: Zebra striping disabled, clean bottom borders `border-b border-border`, muted header backgrounds `bg-muted`.

---

## 7. Interaction & Animation Rules
- **Micro-interactions**: Use Framer Motion for subtle scale-ups (`scale: 1.02`) on card hovers.
- **Page Transitions**: Soft fade-in (`opacity: 0 -> 1`).
- **Drawers/Modals**: Slide up from bottom on mobile, scale-in from center on desktop.
- **Carousel (Embla)**: Smooth snapping, hidden scrollbars, circular arrow buttons overflowing the edges.

---

## 8. Accessibility (A11y)
- **Contrast**: All text must pass WCAG AA contrast ratios (at least 4.5:1 for normal text).
- **Focus Rings**: Never remove outline without providing a custom `focus-visible:ring` alternative.
- **Icons**: Always pair icons with text or `aria-label`/`<span className="sr-only">`.

---

## 9. Iconography
- **Library**: `lucide-react` (clean, consistent line weight).
- **Stroke Width**: `1.5px` or `2px` (keep consistent).
- **Size**: Default `w-5 h-5` for inline text, `w-4 h-4` for small buttons.

*(Reference this file for all UI/UX decisions, Tailwind class applications, and component structuring.)*
