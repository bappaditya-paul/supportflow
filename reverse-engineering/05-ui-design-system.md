# 05 — UI Design System & Visual Tokens

Cossistant's visual design combines **modern linear/brutalist utility** with high-density information architecture. It uses **Tailwind CSS v4** with native `@theme inline` variables, strict **OKLCH color modeling**, and subtle sharp geometric geometry (`2px` border radius).

---

## 1. Color Palette & Token Definitions

The design system implements a strict OKLCH tonal palette with custom high-contrast status accents:

```css
:root {
  /* Neutral Background Scale (Light Mode) */
  --background: oklch(99% 0 0);          /* #FCFCFC - Crisp Ivory Canvas */
  --background-50: oklch(98.5% 0 0);
  --background-100: oklch(98% 0 0);      /* Card & Container Fill */
  --background-200: oklch(97% 0 0);      /* Hover state */
  --background-300: oklch(96% 0 0);      /* Muted component background */
  --background-400: oklch(94% 0 0);
  --background-500: oklch(92% 0 0);      /* Active border outline */

  /* Neutral Foreground Scale */
  --foreground: oklch(14.5% 0 0);        /* Deep Obsidian Text */
  --muted-foreground: oklch(55.6% 0 0);  /* Subdued Secondary Micro-copy */

  /* Brand Accents (Vibrant Functional Highlights) */
  --cossistant-pink: hsla(314, 100%, 80%, 1);   /* #FFA8F5 - Playful Highlights */
  --cossistant-yellow: hsla(58, 93%, 72%, 1);   /* #F6F878 - Attention & Badges */
  --cossistant-blue: hsla(218, 92%, 72%, 1);    /* #75A8FD - Interactive Links */
  --cossistant-orange: hsla(19, 99%, 44%, 1);   /* #DF3E03 - Mentions & Warnings */
  --cossistant-green: hsla(156, 86%, 40%, 1);   /* #0EB86D - Resolved & Success */

  /* Semantic UI Tokens */
  --primary: oklch(20.5% 0 0);
  --primary-foreground: oklch(98.5% 0 0);
  --border: oklch(92.2% 0 0);                   /* 1px subtle dashed / solid line */
  --input: oklch(92.2% 0 0);
  --ring: oklch(70.8% 0 0);
  --radius: 2px;                                /* Minimal utilitarian rounding */
}

.dark {
  --background: oklch(14.5% 0 0);        /* #141414 - Carbon Surface */
  --background-50: oklch(17% 0 0);
  --background-100: oklch(20% 0 0);
  --foreground: oklch(98.5% 0 0);
  --muted-foreground: oklch(65% 0 0);
  --border: oklch(25% 0 0);
  --input: oklch(25% 0 0);
}
```

---

## 2. Typography Hierarchy

The system standardizes on **Geist** for crisp UI legibility and **Geist Mono** for developer identifiers and code snippets:

| Token | Family | Weight | Size | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `font-display` | F37Stout / Geist | Bold (700) | `3rem` (48px) | 1.1 | Marketing hero headlines |
| `font-h1` | Geist | SemiBold (600) | `2rem` (32px) | 1.25 | Section headers, page titles |
| `font-h2` | Geist | SemiBold (600) | `1.5rem` (24px) | 1.3 | Card titles, modal headers |
| `font-h3` | Geist | Medium (500) | `1.125rem` (18px) | 1.4 | Drawer headers, group titles |
| `font-body` | Geist | Regular (400) | `0.875rem` (14px) | 1.5 | Message bubbles, dashboard text |
| `font-caption` | Geist | Regular (400) | `0.75rem` (12px) | 1.4 | Timestamps, status pills, meta |
| `font-mono` | Geist Mono | Regular (400) | `0.8125rem` (13px)| 1.45 | API keys, code blocks, IDs |

---

## 3. Spatial System, Borders & Geometry

* **Base Spacing Unit:** 4px grid (`p-1` = 4px, `p-2` = 8px, `p-3` = 12px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px).
* **Border Radii:**
  * Utilitarian / Technical default: `--radius: 2px` (used on buttons, inputs, badge tags).
  * Rounded container default: `rounded-lg` (8px) for modals and outer popups.
  * Chat Widget Pill: `rounded-full` (9999px) for the floating launcher button.
* **Borders & Dividers:**
  * Structural grid dividers: `1px solid var(--border)` or `1px dashed var(--border)`.
  * Dashed borders are extensively used on marketing landing pages and dashboard pane dividers to convey a technical blueprint feel.
* **Elevation & Shadows:**
  * Flat design ethos: minimal heavy box-shadows.
  * Popovers & Floating Widgets: `0 10px 30px -10px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.15)`.

---

## 4. Component Styles & Variants

### Button Variants (`cva` specification)
1. **Default / Primary:** Dark obsidian background (`bg-primary text-primary-foreground hover:bg-primary/90`), 2px radius, font-medium, height `36px` (`h-9 px-4`).
2. **Secondary:** Clean neutral background (`bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border`).
3. **Ghost:** Transparent background with subtle hover highlight (`hover:bg-muted text-foreground`).
4. **Destructive:** Bright crimson alert styling (`bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20`).
5. **Icon Button:** `size-8 p-0 flex items-center justify-center`.

### Input & Form Fields
* Height: `36px` (`h-9`).
* Background: `bg-background`.
* Border: `border border-input` with subtle ring focus: `focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none`.
* Placeholder: `placeholder:text-muted-foreground text-sm`.

### Chat Message Bubbles
* **Customer / Visitor Message:** Aligned right, dark obsidian fill (`bg-primary text-primary-foreground rounded-2xl rounded-tr-xs px-4 py-2.5 max-w-[80%]`).
* **AI Agent Message:** Aligned left, clean white/gray fill (`bg-background border border-border text-foreground rounded-2xl rounded-tl-xs px-4 py-2.5 max-w-[85%]`). Includes Facehash avatar and "AI Agent" tag.
* **Private Team Note:** Aligned center-left, distinctive amber/orange fill (`bg-amber-500/10 border border-amber-500/20 text-amber-950 dark:text-amber-100 rounded-lg p-3 text-xs`). Tagged with "Internal Note — Only visible to team".
* **Tool Execution Card:** Monospaced card displaying tool name, parameters inspected, and resolution status with expandable JSON trace.

---

## 5. Animation & Motion Design

* Implemented with **Motion** (`motion@^12.29.0`) and **tw-animate-css**.
* **Transitions:** `transition-all duration-150 ease-out`.
* **Modal / Popover Entry:** Scale and fade-in (`scale-95 -> scale-100`, `opacity-0 -> opacity-100` over 120ms).
* **Live Typing Indicator:** Three pulsing dots (`pulse-dot`) with staggered delay (0ms, 150ms, 300ms).
* **Reduced Motion:** Full accessibility fallback via `@media (prefers-reduced-motion: reduce)` automatically zeroing out duration.

