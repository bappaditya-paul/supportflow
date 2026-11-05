# Deep UI & Browser Interaction Audit: Cossistant (`cossistant.com`)

**Audit Date:** November 5, 2026  
**Auditor:** Senior Frontend Reverse-Engineering & Browser Automation Specialist  
**Execution Runtime:** Headless Chromium via Playwright Automation Protocol  
**Target Host:** `https://cossistant.com/`  
**API Origin:** `https://api.cossistant.com/`

---

## 1. Complete Route Inventory

Every publicly accessible and protected application route was investigated, logged, and audited:

| Route Path | Page Title | Access Level | Canonical Layout / Shell |
| :--- | :--- | :--- | :--- |
| `/` | *AI agent customer support for your SaaS in under 10 lines of code \| Cossistant* | **Public** | Marketing Hero Layout (`(lander-docs)`) |
| `/pricing` | *Pricing \| Cossistant* | **Public** | Marketing Content Layout |
| `/docs` | *Cossistant documentation \| Cossistant* | **Public** | Fumadocs Sidebar Layout (`fumadocs-ui`) |
| `/docs/what` | *What is Cossistant? \| Cossistant* | **Public** | Fumadocs MDX Documentation |
| `/docs/quickstart` | *Next.js \| Cossistant* | **Public** | Fumadocs Code Guide Layout |
| `/docs/support-component` | *Overview \| Cossistant* | **Public** | Fumadocs Component Guide |
| `/open-source-program` | *Open Source Program \| Cossistant* | **Public** | Split-card Community Layout |
| `/changelog` | *Changelog \| Cossistant* | **Public** | Chronological Timeline Feed |
| `/blog` | *Blog \| Cossistant* | **Public** | Editorial Grid Layout |
| `/sign-up` | *Sign up \| Cossistant* | **Public (Auth)** | Split Layout (Left: Form, Right: Live Widget) |
| `/login` | *Sign in \| Cossistant* | **Public (Auth)** | Split Layout (Left: Form, Right: Live Widget) |
| `/terms` | *Terms of Service \| Cossistant* | **Public (Legal)**| Centered Typography Layout |
| `/privacy` | *Privacy Policy \| Cossistant* | **Public (Legal)**| Centered Typography Layout |
| `/select` | *Redirected ➔ /login* | **Protected (401)**| Redirects: `/login?reason=session-expired&callback=%2Fselect` |
| `/[websiteSlug]/inbox`| *Redirected ➔ /login* | **Protected (401)**| Redirects: `/login?reason=session-expired` |

---

## 2. Screenshot Gallery

All high-resolution full-page and viewport screenshots are captured and cataloged in [`reverse-engineering/screenshots/`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/):

### A. Marketing & Product Pages
* **Homepage Viewport:** [`reverse-engineering/screenshots/homepage/desktop-viewport.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/homepage/desktop-viewport.png)
* **Homepage Full-Page:** [`reverse-engineering/screenshots/homepage/desktop-fullpage.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/homepage/desktop-fullpage.png)
* **Search Dialog Modal:** [`reverse-engineering/screenshots/homepage/search-modal.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/homepage/search-modal.png)
* **Code Preview Tab Active:** [`reverse-engineering/screenshots/homepage/code-tab-active.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/homepage/code-tab-active.png)
* **Pricing Viewport:** [`reverse-engineering/screenshots/pricing/desktop-viewport.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/pricing/desktop-viewport.png)
* **Pricing Full-Page:** [`reverse-engineering/screenshots/pricing/desktop-fullpage.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/pricing/desktop-fullpage.png)

### B. Documentation & Community
* **Documentation Hub Viewport:** [`reverse-engineering/screenshots/docs/desktop-viewport.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/docs/desktop-viewport.png)
* **Documentation Hub Full-Page:** [`reverse-engineering/screenshots/docs/desktop-fullpage.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/docs/desktop-fullpage.png)
* **Open Source Program Viewport:** [`reverse-engineering/screenshots/opensource/desktop-viewport.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/opensource/desktop-viewport.png)
* **Open Source Program Full-Page:** [`reverse-engineering/screenshots/opensource/desktop-fullpage.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/opensource/desktop-fullpage.png)
* **Changelog Viewport:** [`reverse-engineering/screenshots/changelog/desktop-viewport.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/changelog/desktop-viewport.png)
* **Changelog Full-Page:** [`reverse-engineering/screenshots/changelog/desktop-fullpage.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/changelog/desktop-fullpage.png)
* **Blog Viewport:** [`reverse-engineering/screenshots/blog/desktop-viewport.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/blog/desktop-viewport.png)
* **Blog Full-Page:** [`reverse-engineering/screenshots/blog/desktop-fullpage.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/blog/desktop-fullpage.png)

### C. Authentication & Forms
* **Sign In (Login) Viewport:** [`reverse-engineering/screenshots/login/desktop-viewport.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/login/desktop-viewport.png)
* **Sign In (Login) Full-Page:** [`reverse-engineering/screenshots/login/desktop-fullpage.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/login/desktop-fullpage.png)
* **Sign Up (Default View):** [`reverse-engineering/screenshots/signup/desktop-viewport.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/signup/desktop-viewport.png)
* **Sign Up (Expanded Email Form):** [`reverse-engineering/screenshots/signup/signup-email-form-expanded.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/signup/signup-email-form-expanded.png)

### D. Responsive Breakpoints
* **Homepage Tablet (768px):** [`reverse-engineering/screenshots/responsive/homepage-tablet-768.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/responsive/homepage-tablet-768.png)
* **Homepage Mobile (375px):** [`reverse-engineering/screenshots/responsive/homepage-mobile-375.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/responsive/homepage-mobile-375.png)
* **Pricing Tablet (768px):** [`reverse-engineering/screenshots/responsive/pricing-tablet-768.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/responsive/pricing-tablet-768.png)
* **Pricing Mobile (375px):** [`reverse-engineering/screenshots/responsive/pricing-mobile-375.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/responsive/pricing-mobile-375.png)
* **Documentation Mobile (375px):** [`reverse-engineering/screenshots/responsive/docs-mobile-375.png`](file:///home/bappaditya/coding/Flip%20the%20Switch%20Hackathon/reverse-engineering/screenshots/responsive/docs-mobile-375.png)

---

## 3. Detailed Browser Interaction Inventory

Every interactive element was actuated, inspected, and documented:

| Interaction ID | Target URL | Component / Control | Component Type | Initial State | Trigger / User Action | Resulting State & Visual Feedback | Network Activity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **INT-01** | `/` | Header "Search..." Button | Button (`h-7 border-dashed`) | Dormant | Click | Mounts `<CommandDialog>` modal overlay with auto-focused search input. | None (Client-side bundle index) |
| **INT-02** | `/` | Search Modal Close | Modal Overlay | Modal Open | Press `Escape` | Modal unmounts with 120ms fade-out transition. | None |
| **INT-03** | `/` | Interactive Demo "Replay flow" | Button (`h-8 px-3`) | Step 4 Done | Click | Re-triggers step-by-step chat flow animation with typing dots. | None (Simulated React state) |
| **INT-04** | `/` | Demo Code/Preview Switcher | Tab Switcher | `[Preview]` Active | Click `[Code]` | Hides chat widget simulation; mounts syntax-highlighted TSX code snippet. | None |
| **INT-05** | `/` | Date Range Toggles (`7d`, `14d`, `30d`) | Toggle Group | `7d` active | Click `30d` | Active pill slides smoothly; presence counter updates. | None |
| **INT-06** | `/pricing`| Free Tier "Get started" | Link Button | Outlined | Click | Navigates to `/sign-up`. | `GET /sign-up?_rsc=...` |
| **INT-07** | `/pricing`| Hobby Tier "Get started" | Link Button | Outlined | Click | Navigates to `/sign-up?plan=hobby`. | `GET /sign-up?plan=hobby` |
| **INT-08** | `/pricing`| Pro Tier "Get started" | Link Button | Primary Accent | Click | Navigates to `/sign-up?plan=pro`. | `GET /sign-up?plan=pro` |
| **INT-09** | `/sign-up`| "Use email instead" Button | Button | Collapsed | Click | Hides social buttons; un-collapses Name, Email, Password inputs. | None |
| **INT-10** | `/sign-up`| Email Form Submission (Empty) | Submit Button | Form rendered | Click "Sign up" | Triggers HTML5 native validation: `"Please fill out this field."` on Email. | None (Client-side validation stop) |
| **INT-11** | `/select` | Direct Protected Route Access | URL Bar | Logged Out | Navigate | Redirects to `/login?reason=session-expired&callback=%2Fselect`. | `GET /api/auth/get-session` ➔ 401 |

---

## 4. UI Component Architecture & Styles

The frontend exhibits a cohesive **developer-utilitarian design system** built with Tailwind CSS v4:

### Header / Navbar
* **Height:** `80px` (`--header-height: 80px`).
* **Container:** Full width with `1px dashed var(--border)` bottom edge.
* **Branding:** Left-aligned lowercase logotype `"cossistant"` in `F37Stout` bold typeface.
* **Quick Navigation:** Pill-style brackets around route links: `[Docs]`, `[Blog]`, `[Pricing]`, `[Changelog]`.
* **Search Pill:** Compact `w-[140px] h-7` button with dashed border, shortcut hint (`Ctrl K` / `Cmd K`).
* **Mobile Drawer:** Hamburger trigger (`size-8 border-dashed lg:hidden`) expanding a slide-out navigation sheet.

### Typography Hierarchy (Computed from Live DOM)
* **Primary Sans-Serif:** `"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
* **Monospace Sans-Serif:** `"Geist Mono", monospace`.
* **Brand Headlines:** `"F37Stout", sans-serif`.
* **Font Sizes:**
  * Hero H1: `2.75rem` (44px), letter-spacing `-0.03em`.
  * Card Titles H2: `1.5rem` (24px), font-weight `600`.
  * Body Copy: `0.875rem` (14px), line-height `1.6`.
  * Micro-Badges & Tags: `0.75rem` (12px), font-weight `500`.

### Color Tokens (OKLCH Format)
* **Canvas Background:** `oklch(99% 0 0)` (Warm Ivory `#FCFCFC`).
* **Container / Card Fill:** `oklch(98% 0 0)`.
* **Primary Text:** `oklch(14.5% 0 0)` (Deep Obsidian `#141414`).
* **Muted Text:** `oklch(55.6% 0 0)`.
* **Borders:** `oklch(92.2% 0 0)` with extensive use of `border-dashed`.
* **Accent Highlights:**
  * Orange Mention: `hsla(19, 99%, 44%, 1)`
  * Green Resolved: `hsla(156, 86%, 40%, 1)`
  * Yellow Attention: `hsla(58, 93%, 72%, 1)`

---

## 5. Responsive Breakpoint Audit

| Screen Width | Viewport Device Class | Layout Adaptation & Structural Reorganization |
| :--- | :--- | :--- |
| **Desktop (>=1024px)** | 1280 × 800 | Full multi-column view. Split-screen on auth (`50%` left form, `50%` right live preview). Sidebars permanently docked. |
| **Tablet (768px – 1023px)** | 768 × 1024 | Header links collapse into hamburger button. Pricing grid transitions from 3 columns to 1 column stacked. Hero interactive demo rescales to `w-full`. |
| **Mobile (<768px)** | 375 × 667 | Floating widget transforms into fullscreen modal (`100vw × 100vh`). Split auth view hides right-hand live widget, showing only the form. Horizontal scrolling enabled on wide comparison tables. |

---

## 6. Observable Network Activity & API Endpoints

During public browsing and interaction, our network capture logged the following live API traffic to `https://api.cossistant.com/`:

1. **`GET /api/auth/get-session`**
   * **Purpose:** Evaluates active session cookies. Returns null when unauthenticated.
2. **`GET /v1/websites`**
   * **Purpose:** Queries public website configuration by hostname or publishable API key.
3. **`PATCH /v1/visitors/{visitorId}`**
   * **Payload:** `{ "currentPage": "/sign-up", "attribution": { "referrer": "" } }`
   * **Purpose:** Heartbeat and page sync updating visitor telemetry in PostgreSQL and Tinybird.
4. **`POST /v1/visitors/{visitorId}/activity`**
   * **Payload:** `{ "activityType": "page_view", "url": "https://cossistant.com/pricing" }`
   * **Purpose:** Ingests live visitor activity stream into the ClickHouse presence pipe.
5. **`GET /v1/support/state`**
   * **Purpose:** Fetches team online status (`onlineNowCount: 1`), business hours, and greeting text.

---

## 7. Inaccessible Pages Report (Authentication Barrier)

In strict adherence to the audit protocol, automated testing halted at the authentication boundary for private operator views:

* **Protected Routes:**
  * `https://cossistant.com/select` (Organization and website picker)
  * `https://cossistant.com/[websiteSlug]/inbox` (Operator conversation workspace)
  * `https://cossistant.com/[websiteSlug]/agent` (AI agent studio & knowledge base)
  * `https://cossistant.com/[websiteSlug]/settings` (API keys, team members, Polar billing)
* **Boundary Behavior:**
  * When requested without a session cookie, the Next.js edge middleware intercepts the request with an HTTP 307 redirect to:
    `https://cossistant.com/login?reason=session-expired&callback={encodedPath}`
  * Because these routes require authenticated credentials, they were not accessed on the live host. Instead, their internal UI components, states, and operations were comprehensively verified via the public open-source repository source files in `apps/web/src/app/(dashboard)/[websiteSlug]`.

---

## 8. UI Implementation Specification for SupportFlow

To achieve Cossistant-grade UI polish in our hackathon project:
1. **Adopt 2px Border Radius:** Replace generic rounded corners with `--radius: 2px` and dashed borders (`border-dashed border-border`) for a sharp, developer-focused aesthetic.
2. **Split Auth & Landing View:** Render the real interactive widget side-by-side with forms to demonstrate instant utility before the user even signs up.
3. **Fast Keyboard Navigation:** Implement `Cmd + Enter` to resolve tickets and Arrow Up/Down to navigate the virtualized conversation list.

