# 📐 SupportFlow UI Design System & Frontend Architecture Specification

> **Reference Source:** Reverse-Engineered from **Cossistant** (`https://cossistant.com/`, GitHub `@cossistantcom/cossistant`) & Audited Visual Assets.  
> **Target Framework:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.  
> **Visual Identity:** Linear Utilitarian Brutalism, Technical Blueprint Geometry, OKLCH Color Modeling, High-Density Information Hierarchy.

---

## 1. Executive Summary & Design System Philosophy

SupportFlow adopts a **developer-first, utilitarian brutalist design system** inspired by Cossistant. Unlike typical rounded, consumer-facing SaaS tools with soft 12px–16px radii and heavy gradients, SupportFlow uses:
- **Sharp 2px Geometry (`--radius: 2px`):** Applied uniformly to buttons, cards, input fields, badges, and drawers to project mathematical precision.
- **Blueprint Line-Work:** Subtle 1px solid hairline borders and dashed dividers (`border-dashed border-neutral-800`) mimicking engineering schematics and architectural blueprints.
- **Dual-Surface Canvas:**
  - **Dark Mode (Default Operator Cockpit):** Deep Obsidian (`#0d0e12`) and Carbon surfaces (`#121319`, `#161720`) with vibrant functional accents.
  - **Light Mode (Customer Widget Canvas):** Warm Ivory (`#FCFCFB` / `#FCFCFC`) with charcoal typography (`#131313`).
- **High-Density Data Display:** Monospace fonts for timestamps, IDs (`TKT-1001`), database values, and Stripe transaction hashes with zero wasted whitespace.

---

## 2. Typography Hierarchy & Tokens

Standardized on **Geist Sans** (for UI prose, form labels, and headings) and **Geist Mono** (for ticket IDs, code snippets, timestamps, and tool parameters).

```
Google Fonts Import:
https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Geist:wght@300;400;500;600;700&display=swap
```

### Typography Scale Table

| Token | Family | Weight | Size | Line Height | Tracking | Usage & Context |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `text-display` | Geist Sans | Bold (700) | `3rem` (48px) | 1.1 | `-0.025em` | Marketing landing page hero headlines |
| `text-h1` | Geist Sans | SemiBold (600) | `2rem` (32px) | 1.25 | `-0.02em` | Section headers, workspace view titles |
| `text-h2` | Geist Sans | SemiBold (600) | `1.5rem` (24px) | 1.3 | `-0.015em` | Card titles, modal headers, pricing tiers |
| `text-h3` | Geist Sans | Medium (500) | `1.125rem` (18px) | 1.4 | `-0.01em` | Pane headers, drawer titles |
| `text-base` | Geist Sans | Regular (400) | `1rem` (16px) | 1.5 | `0` | Long-form policy text, blog articles |
| `text-sm` | Geist Sans | Regular (400) | `0.875rem` (14px) | 1.5 | `0` | Message bubbles, dashboard text, inputs |
| `text-xs` | Geist Sans | Regular / Med (400/500) | `0.75rem` (12px) | 1.4 | `+0.01em` | Ticket subjects, secondary metadata, buttons |
| `text-caption` | Geist Sans | Regular (400) | `0.6875rem` (11px)| 1.35 | `+0.02em` | Subtitles, helper text, presence status |
| `text-mono-sm` | Geist Mono | Medium (500) | `0.8125rem` (13px)| 1.45 | `0` | Terminal code blocks, JSON tool arguments |
| `text-mono-xs` | Geist Mono | Medium / Bold (500/700)| `0.6875rem` (11px)| 1.3 | `+0.03em` | Ticket IDs (`TKT-1001`), agent tags (`@triager`) |
| `text-mono-nano`| Geist Mono | Bold (700) | `0.5625rem` (9px) | 1.2 | `+0.05em` | Discrepancy pills, status badges, protocol tags |

---

## 3. Color Tokens & OKLCH Color Modeling

Colors are modeled in OKLCH to preserve perceptual uniformity across monitors and dark/light shifts.

### Light Mode Surface Scale (Customer Widget)
```css
:root {
  --canvas-bg: oklch(99% 0 0);           /* #FCFCFB — Crisp Ivory Canvas */
  --canvas-card: oklch(98.5% 0 0);       /* #FAFAFA — Card fill */
  --canvas-muted: oklch(96% 0 0);        /* #F4F4F3 — Secondary container */
  --canvas-hover: oklch(94% 0 0);        /* Hover highlight */
  --canvas-border: oklch(92.2% 0 0);     /* Hairline outline */
  --canvas-text: oklch(14.5% 0 0);       /* #131313 — Obsidian primary text */
  --canvas-text-muted: oklch(55% 0 0);   /* #737373 — Secondary metadata */
}
```

### Dark Mode Surface Scale (Operator Cockpit & Marketing)
```css
.dark, :root {
  --carbon-bg: #0d0e12;                  /* Deepest backdrop canvas */
  --carbon-surface: #121319;             /* Navigation & container headers */
  --carbon-card: #161720;                /* Central cards, pane backgrounds */
  --carbon-elevated: #1a1b24;            /* Hover states & active selections */
  --carbon-border: #222430;              /* Hairline solid divider */
  --carbon-border-dashed: rgba(255, 255, 255, 0.12); /* Blueprint dashed border */
  --carbon-text: #f3f4f6;                /* Primary readable white */
  --carbon-text-muted: #9ca3af;          /* Neutral gray subtext */
  --carbon-text-subtle: #6b7280;         /* Low-contrast labels */
}
```

### Functional & Semantic Accents
| Accent Token | Hex / HSL | Purpose & Screen Presence |
| :--- | :--- | :--- |
| `--color-blue` | `#2563eb` / `#75A8FD` | Primary action buttons, link hovers, `@triager` avatar pill |
| `--color-emerald`| `#0EB86D` / `#10b981` | Success, approved drafts, active Switch socket, resolved tickets |
| `--color-amber` | `#f59e0b` / `#F6F878` | **Live Ghost Typing**, pending approvals, warnings, internal notes |
| `--color-rose` | `#f43f5e` / `#DF3E03` | **Billing Discrepancies** (Stripe paid vs DB free), critical alerts |
| `--color-purple` | `#9333ea` / `#c084fc` | `@responder` agent tags, policy grounding badges |

---

## 4. Geometry, Borders & Elevation

### 1. Border Radius Rules
- **Buttons, Inputs, Cards, Drawers:** Strictly `--radius: 2px` (`rounded-[2px]`).
- **Outer Shell Containers & Dialogs:** `rounded-[4px]` or `rounded-[6px]`.
- **Floating Launcher & User Avatars:** `rounded-full` (9999px).

### 2. Border Rules
- **Solid Structural Hairline:** `border border-neutral-800` (Dark) / `border border-neutral-200` (Light).
- **Blueprint Dashed Hairline:** `border border-dashed border-neutral-700` (Dark) / `border border-dashed border-neutral-300` (Light). Used to separate technical panes, tool executions, and the Human Review Gate.

### 3. Shadows & Elevation
- **Flat Architectural Rule:** Avoid soft blurred shadows on standard cards.
- **Floating Widget & Popovers Only:**  
  `box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05);`

---

## 5. Component Design Tokens & Tailwind Recipes

### 1. Buttons
```tsx
// Primary Action (Approve, Submit)
className="h-8 px-3.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white text-xs font-semibold rounded-[2px] transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"

// Secondary Action (Cancel, Secondary Filter)
className="h-8 px-3 bg-[#1a1b24] hover:bg-[#222430] text-neutral-300 hover:text-white border border-neutral-800 text-xs rounded-[2px] transition-colors cursor-pointer inline-flex items-center gap-1.5"

// Destructive (Reject, Delete)
className="h-8 px-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs rounded-[2px] transition-colors cursor-pointer inline-flex items-center gap-1.5"
```

### 2. Form Inputs & Textareas
```tsx
// Text Input
className="h-8 px-2.5 bg-[#14151c] border border-neutral-800 focus:border-blue-500 text-xs text-neutral-200 placeholder:text-neutral-500 rounded-[2px] focus:outline-none transition-colors font-sans"

// Monospace Code / Key Input
className="h-8 px-2.5 bg-[#101116] border border-neutral-800 text-xs text-neutral-300 font-mono rounded-[2px] focus:outline-none"

// Textarea (Composer)
className="w-full p-2.5 bg-[#121319] border border-neutral-800 focus:border-blue-500 text-xs text-neutral-100 placeholder:text-neutral-500 rounded-[2px] focus:outline-none resize-none leading-relaxed"
```

### 3. Discrepancy & Status Badges
```tsx
// Billing Discrepancy Warning (Stripe Pro vs DB Free)
className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-rose-950/80 text-rose-300 border border-rose-800/70 rounded-[2px] animate-pulse inline-flex items-center gap-1"

// Live Ghost Typing Pill
className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-[2px] inline-flex items-center gap-1"

// Switch Room Agent Tag
className="px-2 py-0.5 text-[11px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-[2px] inline-flex items-center gap-1"
```

---

## 6. Route-by-Route Screenshot Audit & Reference Gallery

Every route inspected in `reverse-engineering/screenshots/` provides direct architectural blueprints for building the frontend:

### 1. Homepage (`reverse-engineering/screenshots/homepage/`)
* **`desktop-fullpage.png` & `desktop-viewport.png`:**
  - **Layout:** Sticky minimalist navigation with a 1px bottom border.
  - **Hero Area:** Oversized sans-serif title with hairline dashed container around an interactive chat replay window.
  - **Terminal Install Block:** `$ pnpm add @cossistant/next` with a copy button.
  - **Customer Orbit:** Circular avatars with online presence indicator dots.
* **`code-tab-active.png`:**
  - Shows code tab switcher (`Next.js App Router`, `Pages Router`, `React SPA`) with syntax-highlighted TypeScript blocks.
* **`search-modal.png`:**
  - `Cmd+K` global command palette with fuzzy search filter, keyboard arrow navigation, and shortcut hints (`ESC`, `ENTER`).

### 2. Pricing (`reverse-engineering/screenshots/pricing/`)
* **`desktop-fullpage.png` & `desktop-viewport.png`:**
  - **Tiers:** 3-column grid (`Free`, `Hobby $20`, `Pro $40`) with high-contrast highlighted borders on the featured tier.
  - **Billing Toggle:** Clean capsule pill switcher for Monthly vs Annual.
  - **Feature Grid:** Dense checkmark table with dashed horizontal cell dividers.

### 3. Sign In & Registration (`reverse-engineering/screenshots/login/` & `signup/`)
* **`login/desktop-fullpage.png`:**
  - Split-pane layout: Left is the authentication card (OAuth buttons, email magic link); Right is an interactive simulated terminal session.
* **`signup/desktop-fullpage.png` & `signup-email-form-expanded.png`:**
  - Progressive disclosure: Selecting "Sign up with email" smoothly expands the name, email, subdomain slug, and password fields.

### 4. Documentation (`reverse-engineering/screenshots/docs/`)
* **`desktop-fullpage.png` & `desktop-viewport.png`:**
  - Three-column layout: Left sidebar navigation tree; Center prose rendered with high-contrast typography; Right "On this page" TOC anchor links.
  - Interactive OpenAPI playground tabs.

### 5. Responsive Behavior (`reverse-engineering/screenshots/responsive/`)
* **`homepage-mobile-375.png` & `tablet-768.png`:**
  - Stacks hero columns vertically.
  - Mobile burger menu replaces horizontal nav links.
  - Support widget launcher shrinks from `w-14 h-14` to `w-12 h-12`.
* **`pricing-mobile-375.png` & `tablet-768.png`:**
  - 3-column pricing cards collapse into a clean single-column vertical stack with full-width CTA buttons.
* **`docs-mobile-375.png`:**
  - Left sidebar collapses into an expandable drawer.

---

## 7. Frontend Optimization & Performance Strategy

To ensure sub-second loads and ultra-fast operator workflows:

1. **Zero Runtime CSS (Tailwind CSS v4 `@theme inline`):**
   - No CSS-in-JS overhead. All tokens compile to native CSS custom properties at build time (`dist/assets/*.css` < 50 kB gzip).
2. **Real-Time WebSocket Decoupling:**
   - The `GHOST_TYPING` event stream bypasses React root re-renders. It updates only the isolated `GhostTypingPreview` component via targeted local state.
3. **Optimistic UI Updates:**
   - When the operator clicks **[Approve & Dispatch]**, the UI immediately transitions to "APPROVED", updates the ticket badge to "Resolved", and fires the WebSocket event in the background without waiting for HTTP round-trips.
4. **Font Optimization:**
   - Preconnect headers for `fonts.googleapis.com` and `fonts.gstatic.com` with `font-display: swap` to prevent Flash of Invisible Text (FOIT).
5. **Code Splitting & Bundle Size:**
   - Route-level lazy loading (`React.lazy`) for documentation and settings.
   - Vite builds complete in under **1.3 seconds** with total production bundle under **320 kB**.

---

## 8. Implementation Checklist for Developers

- [x] Configure `@theme inline` with Cossistant OKLCH tokens in `client/src/index.css`.
- [x] Enforce `--radius: 2px` on all buttons, cards, and inputs.
- [x] Implement `SupportWidget` with `HomeView` and `ConversationView`.
- [x] Build `DashboardLayout` with `ConversationListPane`, `ConversationDetailPane`, and `VisitorProfileDrawer`.
- [x] Add real-time `GhostTypingPreview` connected to `/ws`.
- [x] Implement the `ApprovalDispatchGate` with 1-click human verification.
- [x] Add 3-way view switcher in `App.tsx` (`Split Demo`, `Customer SaaS`, `Operator Cockpit`).
- [x] Compile cleanly with `npm run build` in `client/`.
