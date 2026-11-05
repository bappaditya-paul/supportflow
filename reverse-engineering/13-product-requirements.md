# 13 — Product Requirements Document (PRD)

## 1. Product Vision & Goals

**Product Name:** SupportEngine (Independent Clean-Room Implementation)  
**Vision:** An open-standard customer support platform for software companies that combines an embeddable website support widget, an autonomous tool-augmented AI agent, and an integrated team inbox with human-in-the-loop review.

### Primary Goals:
1. **Developer Simplicity:** Under 10 lines of code to embed in React/Next.js applications.
2. **Deterministic Fact Grounding:** The AI agent must never hallucinate; answers must cite verified database records, Stripe receipts, or company documentation.
3. **Compound Learning:** When the agent cannot answer, it asks the human team once; the answer permanently enriches the knowledge base.
4. **Zero-Friction Team Collaboration:** Provide both a web dashboard and native team chat integration (Mattermost/Slack) so support staff can resolve issues where they already work.

---

## 2. User Personas

1. **The Startup Founder / Lead Engineer:**
   * Wants zero-maintenance setup, low token costs, and assurance that AI will not promise unauthorized refunds or invent fake policies.
2. **The Support Lead / Operator:**
   * Needs a fast, keyboard-navigable inbox (`Cmd + Enter` to resolve, arrow keys to navigate), clear internal notes, and instant visibility into what visitors are typing.
3. **The End Customer / Website Visitor:**
   * Seeks instantaneous, accurate answers to billing, account, or bug questions without filling out clunky ticket forms.

---

## 3. Detailed Feature Specifications

### Feature: `FEAT-01` — Embeddable Support Widget
* **User Story:** As a website visitor, I want a floating support launcher in the corner of the app so that I can immediately ask questions and see past conversations.
* **Acceptance Criteria:**
  * Displays floating trigger button with unread message badge.
  * Clicking trigger expands docked window (`380px` wide, `600px` high).
  * Renders conversation history and knowledge base search bar on home view.
  * Supports custom brand colors, border radius, and dark mode syncing.
* **Frontend Requirements:** Zero heavy runtime dependencies; clean CSS variables; mobile fullscreen view (`<640px`).
* **Backend Requirements:** `GET /api/v1/support` endpoint returning public branding and team presence.
* **Database Requirements:** `website.themeSettings`, `website.name`.
* **Priority:** P0 (Critical).

---

### Feature: `FEAT-02` — Real-Time Streaming Messaging & Visitor Typing Preview
* **User Story:** As an operator, I want to see customer messages and live typing previews in real time so that I can prepare responses before they submit.
* **Acceptance Criteria:**
  * Bi-directional WebSocket connects with automatic reconnect backoff.
  * Keystrokes in visitor composer send debounced `conversationTyping` preview events.
  * Operator dashboard displays live preview italicized below the conversation thread.
* **Frontend Requirements:** `useRealtimeSupport` hook managing socket connection and sound effects.
* **Backend Requirements:** Bun WebSocket server with Redis Pub/Sub distribution across server nodes.
* **Database Requirements:** `conversation_timeline_item` table.
* **Priority:** P0 (Critical).

---

### Feature: `FEAT-03` — Primary AI Response Pipeline with Vector Retrieval (RAG)
* **User Story:** As a customer, I want immediate answers to common technical and policy questions so that I do not have to wait for human business hours.
* **Acceptance Criteria:**
  * When a visitor submits a question, a job is enqueued in BullMQ `ai-agent`.
  * AI pipeline queries `chunk` table using pgvector cosine similarity search (`vector_cosine_ops`).
  * If similarity exceeds `0.75`, synthesizes an answer strictly citing document sources.
  * Streams response tokens back to visitor chat window.
* **Frontend Requirements:** Animated typing indicator; streaming text updates; markdown rendering.
* **Backend Requirements:** Vercel AI SDK 6 with OpenAI / OpenRouter providers; pgvector HNSW query execution.
* **Database Requirements:** `chunk` table with 1536-dimensional embeddings.
* **Priority:** P0 (Critical).

---

### Feature: `FEAT-04` — Self-Learning Knowledge Clarification Loop
* **User Story:** As a support operator, I want the AI to notify me when documentation is missing so that I can provide the answer once and have the AI remember it forever.
* **Acceptance Criteria:**
  * When vector similarity falls below threshold or customer states an unknown issue, AI triggers `requestKnowledgeClarification` tool.
  * Displays high-priority clarification banner in the operator dashboard.
  * Operator enters the authoritative answer; system automatically chunks, embeds, and stores it in the vector table.
  * Automatically notifies customer with the verified answer.
* **Frontend Requirements:** Inline clarification review card with "Answer & Save to Knowledge Base" button.
* **Backend Requirements:** `knowledgeClarification.answer` tRPC procedure; automatic chunker and embedding pipeline.
* **Database Requirements:** `knowledge_clarification_request` table.
* **Priority:** P1 (High).

---

### Feature: `FEAT-05` — Human-in-the-Loop Private Notes & Escalation Gate
* **User Story:** As a human operator, I want to leave internal comments and take over conversations from AI when sensitive edge cases occur.
* **Acceptance Criteria:**
  * Operator can toggle between "Public Reply" and "Internal Note".
  * Internal notes are rendered with distinctive amber background and lock icon.
  * Internal notes are strictly excluded from the customer widget WebSocket feed.
  * Clicking "Pause AI" sets `aiPausedUntil` timestamp, preventing autonomous bot interference.
* **Frontend Requirements:** Tiptap composer with mode toggle (`public` vs `private`).
* **Backend Requirements:** `TimelineItemVisibility.PRIVATE` enforcement in API query layer.
* **Database Requirements:** `conversation_timeline_item.visibility`, `conversation.aiPausedUntil`.
* **Priority:** P0 (Critical).

---

### Feature: `FEAT-06` — Bring Your Own Key (BYOK) & Developer API Keys
* **User Story:** As a developer, I want to use my own OpenRouter / LLM credentials and authenticate custom backend scripts with API keys.
* **Acceptance Criteria:**
  * Generate publishable (`pk_*`) and secret (`sk_*`) keys with SHA-256 database hashing.
  * Provide BYOK OpenRouter input with automated model compatibility verification.
* **Frontend Requirements:** API key creation slide-out sheet with copy-to-clipboard toast.
* **Backend Requirements:** Key hashing middleware; constant-time hash comparison; OpenRouter credential injection.
* **Database Requirements:** `api_key` and `website_openrouter_key` tables.
* **Priority:** P1 (High).

