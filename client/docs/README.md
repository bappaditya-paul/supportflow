# 📚 SupportFlow Frontend Page Documentation

Welcome to the frontend architecture and page specifications for **SupportFlow**. This directory documents the visual layout, UX requirements, components, data flows, and design tokens for every page in the application.

---

## 🗺️ Page Directory & Routes

| File | Route | Page Title | Category | Status |
| :--- | :--- | :--- | :--- | :--- |
| **[`01-landing-page.md`](./01-landing-page.md)** | `/` | Marketing Landing Page | Public Marketing | Specified |
| **[`02-pricing-page.md`](./02-pricing-page.md)** | `/pricing` | Pricing & Subscription Plans | Public Marketing | Specified |
| **[`03-login-page.md`](./03-login-page.md)** | `/login` | Operator & User Sign In | Authentication | Specified |
| **[`04-signup-page.md`](./04-signup-page.md)** | `/signup` | Workspace Registration | Authentication | Specified |
| **[`05-forgot-password-page.md`](./05-forgot-password-page.md)** | `/forgot-password` | Password Recovery & Reset | Authentication | Specified |
| **[`06-inbox-dashboard-page.md`](./06-inbox-dashboard-page.md)** | `/dashboard/inbox` | Operator Cockpit & Triage Inbox | Authenticated Workspace | Implemented |
| **[`07-contacts-crm-page.md`](./07-contacts-crm-page.md)** | `/dashboard/contacts` | Customer CRM & Entitlement Directory | Authenticated Workspace | Implemented |
| **[`08-switch-swarm-page.md`](./08-switch-swarm-page.md)** | `/dashboard/agents` | Switch AI Multi-Agent Studio | Authenticated Workspace | Implemented |
| **[`09-knowledge-base-page.md`](./09-knowledge-base-page.md)** | `/dashboard/kb` | Policy & Grounding Management | Authenticated Workspace | Implemented |
| **[`10-settings-page.md`](./10-settings-page.md)** | `/dashboard/settings` | Bridge & Workspace Settings | Authenticated Workspace | Implemented |
| **[`11-demo-sandbox-page.md`](./11-demo-sandbox-page.md)** | `/demo` | CloudDesk SaaS & Floating Widget Sandbox | Interactive Demo | Implemented |
| **[`12-docs-hub-page.md`](./12-docs-hub-page.md)** | `/docs` | Developer Integration & SDK Docs | Documentation | Specified |

---

## 🎨 Global Design Tokens (Cossistant Utilitarian Brutalism)

All pages adhere to the design system reverse-engineered from **Cossistant**:
- **Border Radius:** `--radius: 2px` (strictly 2px across buttons, cards, drawers, and inputs).
- **Typography:** `Geist Sans` for UI prose, `Geist Mono` for IDs (`TKT-1001`), code snippets, and timestamps.
- **Borders:** `1px solid` or `1px dashed` subtle borders (`border-neutral-800` in dark, `border-neutral-200` in light).
- **Color Palette:**
  - Backgrounds: Dark `#0d0e12`, `#121319`, `#161720` | Light `#FCFCFB`, `#F4F4F3`
  - Text: Primary `#f3f4f6`, Muted `#9ca3af`, Subtle `#6b7280`
  - Accents: Electric Blue `#2563eb`, Emerald Green `#10b981`, Amber Warning `#f59e0b`, Rose Red `#f43f5e`

