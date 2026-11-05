# 14 — Phased Implementation Roadmap (Stages 1 – 10)

This roadmap outlines a sequential, test-driven engineering plan to construct an independent, production-grade customer support platform. Each stage defines tangible deliverables, architecture components, and verification gates before progressing.

---

```mermaid
gantt
    title Implementation Execution Timeline
    dateFormat  YYYY-MM-DD
    section Core Foundation
    Stage 1: Foundation & Auth           :done,    s1, 2026-03-01, 5d
    Stage 2: Multi-Tenancy & Workspace   :done,    s2, after s1, 4d
    section Conversation Engine
    Stage 3: Conversations & Inbox       :active,  s3, after s2, 6d
    Stage 4: Real-Time WebSockets & Bus  :         s4, after s3, 5d
    Stage 5: React Support Widget        :         s5, after s4, 5d
    section Team & Integrations
    Stage 6: Team Management & Assign    :         s6, after s5, 4d
    Stage 7: Tool Calling & Webhooks     :         s7, after s6, 5d
    section AI & Intelligence
    Stage 8: AI Pipelines & RAG Loop     :         s8, after s7, 7d
    section Polish & Production
    Stage 9: Presence & Analytics        :         s9, after s8, 4d
    Stage 10: Security Audit & Launch    :         s10, after s9, 5d
```

---

## Stage 1: Project Foundation & Authentication
* **Deliverables:**
  * Turborepo monorepo setup with Bun runtime and Biome linter.
  * Docker Compose environment: PostgreSQL 17 + `pgvector`, Redis 7.
  * Better-Auth integration with email/password and Google/GitHub OAuth.
  * Database migration scripts with Drizzle ORM.
* **Verification Gate:** Run unit tests for user sign-up, login, session issuance, and cookie validation.

---

## Stage 2: Workspace & Multi-Tenancy
* **Deliverables:**
  * `organization`, `member`, and `website` tables.
  * Subdomain / slug routing (`/[websiteSlug]/...`).
  * Publishable key (`pk_*`) and secret key (`sk_*`) generation with SHA-256 hashing.
  * CORS allowed domains validator middleware.
* **Verification Gate:** Verify tenant data isolation: cross-tenant access returns HTTP 403 / 404.

---

## Stage 3: Customer Conversations & Inbox
* **Deliverables:**
  * `conversation` and `conversationTimelineItem` schemas.
  * Virtualized conversation list pane with TanStack Virtual.
  * Rich-text message composer (Tiptap) supporting markdown.
  * Private internal notes mode (`visibility: 'private'`).
* **Verification Gate:** Seed 1,000 conversations; verify smooth 60fps scrolling and status transitions (Open ➔ Resolved).

---

## Stage 4: Real-Time Messaging & Pub/Sub
* **Deliverables:**
  * Native WebSocket server on Bun runtime.
  * Redis Pub/Sub cluster distribution (`realtime-pubsub.ts`).
  * Connection registry with heartbeat keep-alives.
  * Real-time events: `conversationTyping` (with live visitor keystroke preview), `conversationSeen`, `timelineItemCreated`.
* **Verification Gate:** Simulate concurrent connections across two server instances; verify sub-50ms message propagation.

---

## Stage 5: React & Next.js Customer Support Widget
* **Deliverables:**
  * Standalone `@support/react` package with compound components (`<Support />`, `<Trigger />`).
  * Custom theme wrapper supporting OKLCH CSS variables, brand color injection, and border radius.
  * Anonymous visitor tracking (`localStorage`) and `useVisitor().identify(...)` SDK hook.
  * Standalone vanilla JS embed script (`<script src="...">`).
* **Verification Gate:** Embed widget into a clean Next.js sample app; verify zero hydration mismatch errors.

---

## Stage 6: Team Management & Assignment
* **Deliverables:**
  * Team member roster and role-based access control (`owner`, `admin`, `member`).
  * Invitation workflow via transactional email (Resend / AWS SES).
  * Direct conversation assignment to specific teammates.
  * Web-Push desktop notifications using VAPID keys.
* **Verification Gate:** Send invite to secondary email; complete signup flow; confirm immediate assignment reflection.

---

## Stage 7: Deterministic Tool Integrations & Webhooks
* **Deliverables:**
  * Outbound webhook dispatcher with signature headers (`X-Signature-SHA256`).
  * Deterministic lookup tools for billing (Stripe API) and issue tracking (Linear API).
  * Slack notification webhook bridge for real-time room alerts.
* **Verification Gate:** Mock Stripe checkout failure; verify automated tool query retrieves transaction ID and returns structured error.

---

## Stage 8: AI Support Pipelines & Self-Learning RAG
* **Deliverables:**
  * Decoupled BullMQ queues: `ai-agent` (Primary) and `ai-agent-background` (30s debounce).
  * Vector embedding pipeline using `pgvector` with HNSW cosine index.
  * Web documentation crawler and FAQ document editor.
  * Human knowledge clarification tool (`requestKnowledgeClarification`) and operator answer ingestion loop.
  * OpenRouter BYOK (Bring Your Own Key) credential manager.
* **Verification Gate:** Ask novel question; verify AI triggers clarification request; answer via dashboard; verify subsequent identical query is answered autonomously.

---

## Stage 9: Presence & Real-Time Analytics
* **Deliverables:**
  * Visitor presence tracking integrated with Tinybird ClickHouse or Redis hyperloglog.
  * Python FastAPI GeoIP microservice with MaxMind GeoLite2 for real-time visitor country/flag detection.
  * Operational metrics: median first response time, resolution time, and CSAT satisfaction index.
* **Verification Gate:** Inspect live dashboard; confirm accurate visitor count and GeoIP flag resolution.

---

## Stage 10: Security Audit, Testing & Production Deployment
* **Deliverables:**
  * End-to-end integration test suite using Playwright.
  * Content Security Policy (CSP) and strict CORS configuration.
  * Multi-stage Dockerfiles (`Dockerfile.api`, `Dockerfile.workers`, `Dockerfile.web`).
  * Complete user documentation and self-hosting manual.
* **Verification Gate:** 100% automated test pass rate; zero critical findings on static security scanners (`biome check`, `npm audit`).

