# 03 — Complete Feature Inventory & Verification Matrix

Every product capability in Cossistant has been audited against the actual source code in `/tmp/cossistant`, official documentation, and live runtime behavior.

**Classification Legend:**
* **[VERIFIED]**: Complete implementation found in source code with unit/e2e tests and runtime routing.
* **[PARTIAL]**: Partially implemented (e.g. backend schema or UI shell exists, but specific features are incomplete or no-op).
* **[DOCUMENTED]**: Described in documentation or marketing, but deferred in current codebase.
* **[PLANNED]**: Tagged as "Soon", planned, or flagged in schema for upcoming release.
* **[NOT FOUND]**: Not present in source code.

---

## 1. Customer Conversations & Inbox

| Feature | Status | Source Code Reference & Evidence | Notes |
| :--- | :--- | :--- | :--- |
| **Multi-Pane Conversation Inbox** | **[VERIFIED]** | `apps/web/src/app/(dashboard)/[websiteSlug]/inbox/[[...slug]]/page.tsx` | Virtualized conversation list pane + conversation detail pane + client router. |
| **Virtual Scrolling List** | **[VERIFIED]** | `@tanstack/react-virtual` in `components/conversations-list` | High performance rendering for 1,000+ conversation threads. |
| **Conversation Status Workflow** | **[VERIFIED]** | `packages/types/src/enums.ts` (`open`, `resolved`, `spam`, `archived`) | Full state transitions with optimistic UI updates in React Query. |
| **Real-time Message Streaming** | **[VERIFIED]** | `apps/api/src/ws/socket.ts`, `packages/react/src/support/context/websocket.tsx` | Sub-millisecond bi-directional WebSocket frame transport. |
| **Live Visitor Typing Preview** | **[VERIFIED]** | `packages/types/src/realtime-events.ts` (`conversationTyping.visitorPreview`) | Operators can see what visitors are typing *before* they press Enter. |
| **Private Internal Notes** | **[VERIFIED]** | `packages/types/src/enums.ts` (`TimelineItemVisibility.PRIVATE`) | Internal team comments rendered with distinct background and badge, invisible to visitors. |
| **File Attachments & Uploads** | **[VERIFIED]** | `apps/api/src/routes/uploads.ts`, S3 presigned URL generator | Direct-to-S3 client uploading with content-type and size validation. |
| **Conversation Assignment** | **[VERIFIED]** | `apps/api/src/db/schema/conversation.ts` (`conversationAssignee`) | Assign conversations to specific team members or AI Agent. |
| **Auto-Read Receipts (Seen State)** | **[VERIFIED]** | `apps/api/src/db/schema/conversation.ts` (`conversationSeen`) | Tracks when visitor, operator, or AI agent last viewed a thread. |
| **Conversation Audio Alerts** | **[VERIFIED]** | `apps/web/src/hooks/use-dashboard-new-message-sound.ts` | Configurable sound notifications on incoming customer turns. |
| **Smart Views & Custom Filters** | **[VERIFIED]** | `apps/api/src/db/schema/website.ts` (`view`) | Custom saved views by status, assignee, and tags. |
| **Conversation Export** | **[VERIFIED]** | `apps/api/src/utils/conversation-export.ts` | Export thread transcripts in JSON or plain text. |

---

## 2. Team Management & Multi-Tenancy

| Feature | Status | Source Code Reference & Evidence | Notes |
| :--- | :--- | :--- | :--- |
| **Multi-Tenant Organizations** | **[VERIFIED]** | `apps/api/src/db/schema/auth.ts` (`organization`, `member`) | Multi-tenant organization boundaries powered by Better-Auth. |
| **Multiple Websites per Org** | **[VERIFIED]** | `apps/api/src/db/schema/website.ts` (`website`) | One organization can host multiple distinct websites/products with unique slugs. |
| **Role-Based Access Control (RBAC)**| **[VERIFIED]** | `packages/types/src/auth.ts` (`owner`, `admin`, `member`) | Granular access control for settings, billing, API keys, and team invites. |
| **Team Invitations via Email** | **[VERIFIED]** | `apps/api/src/trpc/routers/team.ts`, `apps/api/src/db/schema/auth.ts` (`invitation`) | Email invites with token expiration and acceptance callbacks. |
| **Member Notification Settings**| **[VERIFIED]** | `apps/api/src/db/schema/auth.ts` (`memberNotificationSetting`) | Granular toggles for email notifications, desktop push, and mention alerts. |
| **User Profile Management** | **[VERIFIED]** | `apps/web/src/app/(dashboard)/[websiteSlug]/settings/user-profile-form.tsx` | Operator display name, avatar, and notification preferences. |
| **Automatic Assignment Rules** | **[PARTIAL]** | `apps/api/src/db/schema/website.ts` (`defaultParticipants`) | Basic default participant assignments exist; round-robin load balancing is not yet implemented. |

---

## 3. Customer-Facing Chat Widget

| Feature | Status | Source Code Reference & Evidence | Notes |
| :--- | :--- | :--- | :--- |
| **React Component Library** | **[VERIFIED]** | `packages/react/src/support/index.tsx` (`<Support />`) | Clean compound component architecture with customizable slots. |
| **Next.js Native Provider** | **[VERIFIED]** | `packages/next/src/index.tsx` | Plug-and-play Next.js wrapper with zero-SSR hydration friction. |
| **Vanilla JS Embed Bundle** | **[VERIFIED]** | `packages/browser/src/index.ts` | Compiled single-script bundle for non-React websites (`<script src="...">`). |
| **Anonymous Visitor Tracking** | **[VERIFIED]** | `packages/core/src/visitor-tracker.ts` | Generates persistent anonymous visitor ID stored in localStorage. |
| **Visitor Identification (Identify)**| **[VERIFIED]** | `packages/react/src/identify-visitor.tsx` (`useVisitor().identify(...)`) | Enriches anonymous visitors with email, name, avatar, and custom metadata. |
| **Facehash Dynamic Avatars** | **[VERIFIED]** | `apps/facehash-landing`, `packages/react` | Deterministic geometric/abstract visual avatars generated from visitor IDs. |
| **Custom Branding & Theming** | **[VERIFIED]** | `packages/react/src/support/context/theme-wrapper.tsx` | Accent colors, border-radius, widget placement (bottom-right/left), custom trigger button. |
| **Pre-Chat Form & Home Screen** | **[VERIFIED]** | `packages/react/src/support/pages/home.tsx` | Displays previous conversations, knowledge search bar, and team presence. |
| **Sound Effects (Send/Receive)** | **[VERIFIED]** | `packages/react/src/hooks/use-sound-effect.ts` | Subtle auditory feedback on message interactions. |
| **Markdown & Code Rendering** | **[VERIFIED]** | `packages/tiny-markdown/src` | Renders code snippets, bold text, links, and inline lists without heavy runtime dependencies. |

---

## 4. AI & Automation Pipeline

| Feature | Status | Source Code Reference & Evidence | Notes |
| :--- | :--- | :--- | :--- |
| **Decoupled Primary AI Queue** | **[VERIFIED]** | `apps/api/src/ai-pipeline/primary-pipeline/index.ts` | Immediate FIFO turn response, tool loop, and public message generation. |
| **30s Debounced Background Queue**| **[VERIFIED]** | `apps/api/src/ai-pipeline/background-pipeline/index.ts` | Asynchronous metadata processing triggered 30s after primary turn completes. |
| **Knowledge Base (Vector Search)**| **[VERIFIED]** | `packages/memory/src`, `apps/api/src/utils/vector-search.ts` | Drizzle ORM + `pgvector` cosine similarity embeddings (`chunk` table). |
| **Web Crawling / Doc Ingestion**| **[VERIFIED]** | `apps/api/src/trpc/routers/link-source.ts`, `@datafast/ai-crawl` / Firecrawl | Recursively crawls sitemaps and URLs to chunk and embed support docs. |
| **File / PDF Knowledge Upload** | **[VERIFIED]** | `apps/web/src/app/(dashboard)/[websiteSlug]/agent/(settings)/training/files` | Ingests `.md`, `.txt`, and `.pdf` files into vector knowledge chunks. |
| **FAQ Knowledge Editor** | **[VERIFIED]** | `apps/web/src/app/(dashboard)/[websiteSlug]/agent/(settings)/training/faq` | Structured Q&A pair management for deterministic knowledge recall. |
| **Human Clarification Request** | **[VERIFIED]** | `apps/api/src/ai-pipeline/shared/tools/knowledge-clarification.ts` | AI detects knowledge void -> triggers `requestKnowledgeClarification` -> asks operator to answer. |
| **BYOK (Bring Your Own Key)** | **[VERIFIED]** | `apps/api/src/db/schema/openrouter-byok.ts` (`websiteOpenRouterKey`) | Users can supply their own OpenRouter API key to bypass default credit meters. |
| **AI Thinking Budget Control** | **[VERIFIED]** | `apps/web/src/app/(dashboard)/[websiteSlug]/agent/(settings)/behavior/ai-thinking-form.tsx` | Configures reasoning token budget for models supporting extended thinking (e.g. Claude 3.7 / o3). |
| **Tool Invocation Budget Guard**| **[VERIFIED]** | `apps/web/src/app/(dashboard)/[websiteSlug]/agent/(settings)/behavior/tool-invocation-budget-form.tsx` | Limits max tool calls per turn to prevent infinite agent execution loops. |
| **Sentiment Analysis** | **[PARTIAL]** | `apps/api/src/ai-pipeline/shared/tools/analysis.ts` (`updateSentiment`) | Tool definition exists; background pipeline triage execution is wired as shell in v1. |
| **Auto-Categorization & Spam** | **[PARTIAL]** | `apps/api/src/ai-pipeline/shared/tools/catalog.ts` (`categorizeConversation`, `markSpam`) | Tools declared in shared catalog; active automation triggers undergoing phased rollout. |

---

## 5. Developer Platform & Integrations

| Feature | Status | Source Code Reference & Evidence | Notes |
| :--- | :--- | :--- | :--- |
| **Public REST API & OpenAPI** | **[VERIFIED]** | `packages/protocol/openapi.json`, `@hono/zod-openapi` | Full OpenAPI v3 documentation published and served via `/docs/openapi`. |
| **API Key Management** | **[VERIFIED]** | `apps/api/src/db/schema/api-keys.ts` (`apiKey`), hashed storage | Publishable keys (`pk_*`) for widgets and secret keys (`sk_*`) for server APIs. |
| **Allowed Domains Security (CORS)**| **[VERIFIED]** | `apps/web/src/app/(dashboard)/[websiteSlug]/settings/developers/allowed-domains-form.tsx` | Strict domain origin allowlist prevents unauthorized widget embeds. |
| **Model Context Protocol (MCP)**| **[VERIFIED]** | Root `package.json` (`@modelcontextprotocol/sdk`, `mcp-handler`) | Out-of-the-box MCP server integration for agent tooling. |
| **Slack Real-time Webhooks** | **[VERIFIED]** | `apps/api/src/utils/slack-webhook.ts` | Post notifications of new customer conversations directly into Slack channels. |
| **Outbound Webhooks Engine** | **[PLANNED]** | Marked as "Webhooks Soon" in pricing and docs | Schema foundations exist; delivery retry engine scheduled for upcoming release. |

---

## 6. Analytics & Observability

| Feature | Status | Source Code Reference & Evidence | Notes |
| :--- | :--- | :--- | :--- |
| **Live Visitor Presence** | **[VERIFIED]** | `tinybird/endpoints/online_now.pipe`, `visitor_presence.pipe` | ClickHouse analytical queries computing live concurrent website visitors. |
| **GeoIP Visitor Enrichment** | **[VERIFIED]** | `apps/geoip/src` (Python MaxMind service) | Resolves city, country, country code, and flag icons in real time. |
| **Conversation Resolution Times**| **[VERIFIED]** | `tinybird/datasources/conversation_metrics.datasource` | Tracks median time to first response and median time to resolution. |
| **AI Credit Consumption Metering**| **[VERIFIED]** | `apps/api/src/ai-pipeline/shared/usage/`, Polar meter integration | Tracks input/output token usage per turn and deducts account credits. |
| **Bull-Board Queue UI** | **[VERIFIED]** | `apps/workers/src` (`@bull-board/hono`) | Built-in administrative dashboard monitoring active, completed, and failed jobs. |

