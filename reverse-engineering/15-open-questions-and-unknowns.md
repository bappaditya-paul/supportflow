# 15 — Open Questions, Inferred Architectural Decisions & Unknowns

This document distinguishes **empirically verified facts** from **inferred architectural decisions**, and catalogs remaining open questions for self-hosting and clean-room development.

---

## 1. Confirmed Facts (Empirically Verified in Code)

1. **Bun is the Canonical Runtime:** Both `apps/api` and `apps/workers` rely directly on Bun-specific primitives (e.g. `Bun.serve`, `createBunWebSocket`, `bun:test`). While Node.js compatibility packages exist, production Dockerfiles run on `oven/bun:1.3`.
2. **Decoupled AI Pipeline with 30s Debounce:** Verified in `apps/api/src/ai-pipeline/ai-pipeline-workflow-spec.md` and `apps/workers/src/queues/ai-agent-background/worker.ts`. The primary queue handles real-time response generation, while the background queue is strictly debounced by 30 seconds for non-blocking triage.
3. **No Standalone Vector Database Needed:** Verified in `apps/api/src/db/schema/chunk.ts`. Cossistant avoids external vector services (Pinecone, Qdrant, Weaviate) in favor of native PostgreSQL `pgvector` with HNSW cosine indexes on 1536-dimensional embeddings.
4. **Better-Auth for Identity:** Authentication is handled by Better-Auth v1.6 with schema generated into Drizzle ORM (`apps/api/src/db/schema/auth.ts`).
5. **Polar.sh for Monetization:** Subscriptions and AI token metering are hooked to Polar.sh SDK rather than direct Stripe Checkout, allowing developer-friendly usage metering.

---

## 2. Inferred Architectural Choices & Nuances

1. **Tinybird vs. Local Redis for Analytics:**
   * *Observation:* The repo contains a full `tinybird/` directory with ClickHouse pipes for presence and conversation metrics, but also contains local Redis presence trackers.
   * *Inference:* Production Cloud (`cossistant.com`) uses Tinybird for analytical scale, while self-hosted / local developer instances fall back to Redis-based presence counters when `TINYBIRD_ENABLED=false`.
2. **OpenRouter BYOK Implementation:**
   * *Observation:* Schema contains `websiteOpenRouterKey`, and the AI pipeline accepts model override flags.
   * *Inference:* The platform was intentionally designed to mitigate high LLM infrastructure costs by allowing power users to bypass the built-in credit system with their own OpenRouter keys.

---

## 3. Open Questions & Areas for Verification

1. **Background Pipeline Triage Roadmap:**
   * In `ai-pipeline-workflow-spec.md`, section 10 explicitly notes: *"Background worker and queue are fully wired; background pipeline executes as shell/no-op (logs + metrics); triage/metadata actions are intentionally deferred in v1."*
   * *Question:* How should an independent implementation schedule sentiment analysis and auto-tagging?
   * *Recommendation:* Implement sentiment analysis immediately in the 30s background queue using lightweight models (e.g. `gpt-4o-mini` or Claude 3.5 Haiku) to ensure the inbox displays priority badges without delaying the customer response.
2. **Large File Ingestion & Parsing:**
   * Currently, `.md` and `.txt` are natively parsed. How are complex multi-page PDF documents and tables chunked?
   * *Recommendation:* Use a standard LangChain/LlamaIndex chunking strategy with semantic overlap (512 tokens with 64-token overlap) to prevent losing context across page boundaries.
3. **Outbound Webhook Delivery Retry Policy:**
   * The schema supports outbound events, but webhook retry schedules ("Webhooks Soon") are in development.
   * *Recommendation:* Implement standard exponential backoff with jitter (5 retries: 10s, 1m, 5m, 30m, 2h) backed by BullMQ delay semantics.

