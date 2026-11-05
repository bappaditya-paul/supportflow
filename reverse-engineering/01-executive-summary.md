# 01 — Executive Summary: Cossistant Architecture & Teardown

## 1. Product Identity & Core Mission
* **Product Name:** Cossistant ([cossistant.com](https://cossistant.com/))
* **Tagline:** *"AI agent customer support for your SaaS in under 10 lines of code"*
* **Target Audience (ICP):** B2B SaaS founders, developer-led startups, and engineering teams using React and Next.js.
* **Open Source Repository:** [github.com/cossistantcom/cossistant](https://github.com/cossistantcom/cossistant) (Licensed under MIT/Commercial Dual Model, ~740+ GitHub stars).
* **Core Value Proposition:** Unlike legacy customer support chat widgets (Intercom, Zendesk) that rely on static FAQs or black-box generative bots that hallucinate, Cossistant provides an **embeddable support widget backed by an autonomous AI agent that has deterministic tool calling (Stripe, Linear, DBs), learns from operator answers, and hands off to humans via an integrated team inbox**.

---

## 2. Key Architectural Inventions & Insights

Through direct source-code inspection of the cloned monorepo and live inspection of `cossistant.com`, we uncovered the core engineering choices powering the platform:

```
                                  COSSISTANT ARCHITECTURE AT A GLANCE
                                  
  [ Customer / Website Visitor ]                               [ Support Team / Operators ]
                │                                                           │
        React / Next.js Widget                                       Next.js 16 Dashboard
     (@cossistant/react / next)                                    (apps/web: TanStack Query)
                │                                                           │
         WebSocket + REST                                            tRPC + WebSockets
                │                                                           │
                ▼                                                           ▼
     ┌─────────────────────────────────────────────────────────────────────────────┐
     │                             Hono API Server (apps/api)                      │
     │   • Better-Auth Authentication (OAuth2, Sessions, Organizations)            │
     │   • Drizzle ORM on PostgreSQL 17 + pgvector (Vector embeddings)             │
     │   • Realtime WebSocket Router + Redis PubSub Distribution                   │
     └──────────────────────────────────────┬──────────────────────────────────────┘
                                            │ Enqueue Turn
                                            ▼
     ┌─────────────────────────────────────────────────────────────────────────────┐
     │                       BullMQ Workers & Job Queues (apps/workers)            │
     │   • Primary Queue (`ai-agent`): Immediate streaming reply + tool calls      │
     │   • Background Queue (`ai-agent-background`): 30s debounce sentiment/title  │
     │   • Vercel AI SDK 6 + OpenRouter BYOK (Bring Your Own Key)                  │
     │   • Resend & Web-Push Notifications                                         │
     └─────────────────────────────────────────────────────────────────────────────┘
```

1. **Decoupled Primary & Background AI Pipeline:**
   Instead of blocking responses while summarizing or extracting metadata, Cossistant splits AI execution into two queues:
   * **Primary Pipeline (`ai-agent`):** Executes sub-second customer message intake, deterministic scope checks, tool execution (knowledge retrieval, visitor identification), and streams the public response.
   * **Background Pipeline (`ai-agent-background`):** Triggered on primary completion, debounced by 30 seconds. Silently executes sentiment analysis, conversation title generation, categorization, and detects knowledge gaps.

2. **Self-Learning Knowledge Clarification Loop:**
   When the AI agent encounters an inquiry it cannot answer from the knowledge base, it executes the tool `requestKnowledgeClarification`. This creates a pending clarification record in the database, notifies the human team in the dashboard, and prompts an operator to provide the authoritative answer once. The new answer is automatically indexed into vector storage for future sessions.

3. **Multi-Tenant Monorepo with Native TypeScript Protocol:**
   The entire system is managed via **Turborepo** and **Bun 1.3**. Protocol schemas, event contracts, and types are shared across the frontend widget (`@cossistant/react`), the full Next.js dashboard (`apps/web`), the Hono backend (`apps/api`), and background workers (`apps/workers`) via `@cossistant/types` and `@cossistant/protocol`.

---

## 3. Technology Stack Breakdown

| Layer | Technologies Selected | Rationale in Source Code |
| :--- | :--- | :--- |
| **Monorepo & Runtime** | Bun 1.3 + Turborepo + Biome | High-speed compilation, native TypeScript execution, ultra-fast test runs via Bun Test. |
| **Backend API** | Hono 4.12 + tRPC 11.8 + Zod | Type-safe RPC between Next.js dashboard and backend, high-throughput HTTP edge routing. |
| **Database & ORM** | PostgreSQL 17 + pgvector + Drizzle ORM | Relational multi-tenancy + native vector cosine similarity search in one single database. |
| **Realtime Engine** | Bun WebSockets + Redis 7 PubSub | Low-latency bi-directional messaging, distributed pub/sub across multi-instance API servers. |
| **Background Queues** | BullMQ 5.34 + Redis | Reliable job scheduling, retries, and decoupled 30s debounced background summarization. |
| **Authentication** | Better-Auth 1.6 + OAuth (Google, GitHub) | Modern cookie session management, multi-tenant organizations, and user invitations. |
| **Embeddable Widget** | React 19 + Radix UI + Custom CSS | Zero-dependency footprint, embeddable via Next.js component or standalone browser bundle. |
| **Dashboard Frontend** | Next.js 16 + Tailwind CSS v4 + TanStack Query v5 | Server components, instant URL state via `nuqs`, rich markdown editing via Tiptap. |
| **Monetization** | Polar.sh SDK | Modern developer-focused subscription billing and AI credit metering. |

---

## 4. Key Takeaways for Building an Independent Alternative

To build an alternative or apply these patterns to **SupportFlow**:
* The **separation of concerns** between immediate streaming replies (Primary Pipeline) and metadata extraction (Background Pipeline) prevents high latency and keeps LLM token consumption efficient.
* Implementing **human-in-the-loop clarification** transforms a static support bot into a compound learning asset for small businesses.
* Native team chat integrations (like our Switch AI + Mattermost model) provide a superior operational UX compared to web-only dashboards by removing context-switching entirely.

