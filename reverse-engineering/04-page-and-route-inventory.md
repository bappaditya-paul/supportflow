# 04 — Page & Application Route Inventory

This inventory documents all routes discovered across the public website (`cossistant.com`), the documentation portal, and the internal operational workspace dashboard (`apps/web`).

---

## 1. Public Marketing & Information Routes (`(lander-docs)`)

| Route Path | Page Title / Purpose | Key UI Components | Interactive Elements & State Transitions |
| :--- | :--- | :--- | :--- |
| `/` | **Landing Page**<br>Product showcase, value prop, interactive demo widget | `TopBar`, `PrecisionFlowSection`, `Globe` (Cobe 3D), `MovingUsersFacehashes`, `InstallTabs`, `Footer` | • Tab switcher (`pnpm`, `npm`, `yarn`, `bun`).<br>• Interactive demo chat bubble replay.<br>• Dynamic customer presence counters.<br>• CTAs: "Install Cossistant now", "Explore the docs". |
| `/pricing` | **Pricing & Tiers**<br>Subscription plans and feature comparison table | `PricingCards`, `PromoBannerOrnaments`, `FeatureComparisonTable` | • Annual / Monthly billing toggle.<br>• Tier selection buttons (Free, Hobby $20/mo, Pro $40/mo).<br>• Expandable FAQ disclosure cards. |
| `/login` | **Authentication (Sign In)**<br>User session creation | `LoginForm`, `GoogleIcon`, `GithubIcon`, `DiscordIcon`, `FakeSupportWidget` | • Email + password inputs with client validation.<br>• OAuth triggers (`/api/auth/sign-in/social`).<br>• Links to `/forgot-password` and `/sign-up`. |
| `/sign-up` | **Registration (Sign Up)**<br>New user account onboarding | `SignupForm`, OAuth buttons, split-screen widget preview | • Full name, email, password input fields.<br>• Submits via Better-Auth client mutation.<br>• Redirects to `/welcome/[organizationSlug]` upon success. |
| `/forgot-password` | **Password Recovery**<br>Request password reset link | `ForgotPasswordForm`, email input, submit button | • Sends password reset email via Resend/SES.<br>• Displays "Check your email" confirmation state. |
| `/reset-password` | **Password Reset**<br>Set new password via token | `ResetPasswordForm`, password confirmation input | • Verifies query param token.<br>• Updates user credentials in auth database. |
| `/terms` | **Terms of Service**<br>Legal guidelines | `LegalPageLayout`, markdown typography | • Static legal terms and governing conditions. |
| `/privacy` | **Privacy Policy**<br>Data collection and compliance | `LegalPageLayout`, markdown typography | • Details PII handling, cookie policies, and data retention. |
| `/open-source-program` | **OSS Sponsorship Program**<br>Application for free Pro tier for open source projects | `ApplicationCard`, `FeaturesList`, application form | • Form for GitHub repo submission, star validation, and automated grant evaluation. |
| `/changelog` | **Product Changelog**<br>Chronological release notes | `ChangelogItem`, release tags, code blocks | • Reverse chronological list of new features, bug fixes, and SDK releases. |
| `/blog` & `/[slug]` | **Technical Blog**<br>Engineering articles and tutorials | `BlogCard`, MDX renderer, author bio, social share | • Category filtering, syntax-highlighted code blocks, reading time estimates. |

---

## 2. Documentation Routes (`/docs`)

Powered by **Fumadocs** with full OpenAPI and TypeScript integration:

| Route Path | Topic & Documentation Scope | Key Features & Content |
| :--- | :--- | :--- |
| `/docs` | **Documentation Hub** | Overview, architecture mental model, quick links to SDKs and frameworks. |
| `/docs/what` | **What is Cossistant?** | Conceptual distinction between generic chatbots vs. tool-augmented agent teammates. |
| `/docs/quickstart` | **Next.js Integration Guide** | Step-by-step setup using `pnpm add @cossistant/next` with App Router code samples. |
| `/docs/quickstart/react` | **React Integration Guide** | Setup guide for Vite, Create React App, and generic React single-page apps. |
| `/docs/quickstart/api-keys` | **API Key Setup** | Differentiates publishable keys (`pk_*`) from secret API keys (`sk_*`). |
| `/docs/support-component` | **`<Support />` Component Reference** | Props, event handlers, and lifecycle hooks for the customer-facing widget. |
| `/docs/support-component/customization` | **Widget Customization** | Slot overrides, trigger button replacements, and layout docking options. |
| `/docs/support-component/theme` | **Theme & Styling** | CSS variables, OKLCH color token overrides, dark mode sync, and border-radius rules. |
| `/docs/support-component/routing` | **Widget Pages & Routing** | Managing widget navigation (`home`, `conversation`, `history`, `articles`). |
| `/docs/support-component/hooks` | **React Hooks API** | `useVisitor()`, `useSendMessage()`, `useConversations()`, `useRealtimeSupport()`. |
| `/docs/support-component/events` | **Manual Events Reference** | Emitting custom user actions and page change events to contextualize support turns. |
| `/docs/concepts/contacts` | **Contacts & CRM Concepts** | Anonymous visitor lifecycle transition to identified CRM contact. |
| `/docs/concepts/timeline-items` | **Timeline Architecture** | Structure of public messages, private internal notes, and tool execution cards. |
| `/docs/self-host` | **Self-Hosting Guide** | Docker Compose deployment, PostgreSQL pgvector setup, Redis, and MinIO storage. |
| `/docs/openapi` | **Interactive OpenAPI Explorer** | Interactive Swagger/Scalar API explorer generated directly from Hono Zod schemas. |

---

## 3. Operations Workspace Dashboard (`(dashboard)/[websiteSlug]`)

The authenticated operator workspace where support reps and founders manage customer inquiries:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  COSSISTANT DASHBOARD SHELL                                                            │
├──────────────┬─────────────────────────┬───────────────────────────────────────────────┤
│ Top Left:    │ Sub-navigation / List:  │ Main Detail View:                             │
│ Org Switcher │ • Status Filter Tabs    │                                               │
│ ──────────── │   (Open, Resolved, Spam)│ • Conversation Message Stream                 │
│ Navigation:  │ • Virtual Conversation  │ • Real-time Visitor Typing Preview            │
│ • Inbox (6)  │   Cards (TanStack)      │ • Message Composer (Rich Text / Tiptap)       │
│ • Contacts   │ • Search & Date Filters │ • Internal Team Note Toggle                   │
│ • AI Agent   │ • Priority & Tags       │ • Tool Execution Traces                       │
│ • Settings   │                         ├───────────────────────────────────────────────┤
│ • Billing    │                         │ Right Drawer:                                 │
│ ──────────── │                         │ • Visitor Profile, GeoIP Country & Device     │
│ Bottom: User │                         │ • Recent Browsing Activity & Past Tickets     │
└──────────────┴─────────────────────────┴───────────────────────────────────────────────┘
```

### Route Detailed Breakdown:

### A. Conversation Inbox: `/[websiteSlug]/inbox/[[...slug]]`
* **Purpose:** Primary workspace for viewing, triaging, and responding to live customer tickets.
* **Layout Structure:** Three-column layout (Sidebar navigation | Conversation virtual list | Active conversation viewport with right-side visitor metadata inspector).
* **Key Components:**
  * `ConversationsListPane`: Virtualized list with unread badges, status filters, and sound alert triggers.
  * `ConversationPane`: Scrollable timeline of messages, tool executions, and system events.
  * `MessageComposer`: Tiptap-powered input supporting markdown, file drag-and-drop, and private note toggles.
  * `TimelineItemSender`: Distinguishes visitor messages from AI Agent responses and human operator replies.
* **Loading & Error States:** `loading.tsx` with animated skeletons matching message bubble widths; `error.tsx` boundary with retry action.

### B. Contacts CRM: `/[websiteSlug]/contacts`
* **Purpose:** Directory of all unique visitors and identified customer contacts across the website.
* **Key Components:**
  * `ContactsTable`: TanStack Table with keyboard navigation (`use-contacts-keyboard-navigation.ts`), column sorting, and pagination.
  * `ContactSheetWrapper`: Slide-out sheet detailing visitor email, name, first seen timestamp, location (GeoIP city/flag), device/browser specs, and full conversation history.

### C. AI Agent Studio: `/[websiteSlug]/agent/(settings)`
* **Purpose:** Configure the autonomous agent's personality, knowledge base, tools, and guardrails.
* **Sub-Routes:**
  * `(general)`: Set model provider (OpenAI, OpenRouter, Anthropic), temperature, persona instructions, and greeting copy.
  * `/training/faq`: Direct Q&A pair editor with vector sync status.
  * `/training/files`: Drag-and-drop ingestion for `.md`, `.txt`, and `.pdf` files.
  * `/training/web`: Crawl documentation domains and sitemaps.
  * `/tools`: Enable/disable tool integrations (Linear, Stripe, Cal.com, custom MCP servers).
  * `/behavior`: Configure reasoning token limits (`ai-thinking-form.tsx`) and max tool calls per turn (`tool-invocation-budget-form.tsx`).

### D. Settings & Integrations: `/[websiteSlug]/settings`
* **Sub-Routes:**
  * `/settings/team`: Team member roster, roles (`owner`, `admin`, `member`), invite modal with email dispatch.
  * `/settings/developers`: API Key creation sheet (`pk_*` publishable and `sk_*` secret keys), allowed domain CORS origins, OpenRouter BYOK credentials.
  * `/settings/notifications`: Personal notification routing (desktop push via VAPID, email alerts).
  * `/settings/plan`: Polar.sh subscription status, AI credit consumption progress bar, and upgrade triggers.

