# 07 — Complete User Journey & Workflow Analysis

This document traces the 13 foundational workflows in Cossistant, detailing user interactions, frontend state changes, network requests, backend operations, and database state transitions.

---

## Journey 1: User Registration & Workspace Creation
* **Initial State:** Unauthenticated user navigates to `/sign-up`.
* **User Action:** Enters full name, email, password, and clicks "Create Account".
* **UI Response:** Submit button enters loading state (`BaseSubmitButton`), inputs disabled.
* **API Request:** `POST /api/auth/sign-up/email` with `{ name, email, password }`.
* **Backend Operation:** 
  1. Better-Auth hashes password using Scrypt/Argon2.
  2. Creates records in `user` and `account` tables.
  3. Mints HTTP-only session cookie.
  4. Generates initial personal `organization` and default `website` with slug.
* **Database Changes:** Inserts into `user`, `account`, `session`, `organization`, `member` (`role: "owner"`), and `website`.
* **Final State:** Browser redirects to onboarding screen: `/(dashboard)/[websiteSlug]/welcome`.
* **Error Scenarios:** Email already taken -> 409 Conflict with inline form error "Account already exists".

---

## Journey 2: Workspace Onboarding & Initial Setup
* **Initial State:** New user on `/(dashboard)/[websiteSlug]/welcome`.
* **User Action:** Enters product name (e.g. "CloudDesk"), domain (`app.clouddesk.com`), and chooses support widget primary color.
* **UI Response:** Live widget preview on right side updates instantaneously with chosen branding.
* **API Request:** `trpc.website.update` mutation with `{ websiteSlug, name, domain, theme }`.
* **Backend Operation:** Validates domain structure; persists website branding configuration.
* **Database Changes:** Updates `website` row (`name`, `domain`, `themeSettings`).
* **Final State:** Completes onboarding step; navigates to `/inbox`.

---

## Journey 3: API Key Generation
* **Initial State:** User in `/[websiteSlug]/settings/developers`.
* **User Action:** Clicks "Create API Key", enters description "Production Web Widget", selects `Publishable (pk_*)` type.
* **UI Response:** Slide-out sheet opens; on submit, displays one-time modal with generated key.
* **API Request:** `trpc.website.createApiKey` with `{ type: "publishable", name: "Production Web Widget" }`.
* **Backend Operation:** Generates random 64-char string prefixed with `pk_`; computes SHA-256 hash for database storage.
* **Database Changes:** Inserts row into `apiKey` table (`keyHash`, `prefix`, `type`, `websiteId`, `createdAt`).
* **Final State:** User copies key; key appears in `ApiKeysTable` displaying prefix `pk_8950...`.

---

## Journey 4: Customer-Facing Chat Widget Installation
* **Initial State:** Developer has a Next.js / React application.
* **User Action:** Runs `pnpm add @cossistant/next` and adds `<Support websiteId="pk_..." />` to root layout.
* **UI Response:** Floating circular launcher button renders in bottom-right corner of their web app.
* **API Request:** On mount, widget calls `GET /api/v1/support?websiteId=pk_...` to fetch public settings and opens WebSocket connection to `wss://api.cossistant.com/ws`.
* **Backend Operation:** Authenticates publishable key against CORS allowed domains; registers socket in `connection-registry.ts`.
* **Final State:** Widget is online, displaying support team avatars and "Ask a question" prompt.

---

## Journey 5: Customer Sending a Message (Turn Lifecycle)
* **Initial State:** Visitor opens chat widget on customer website.
* **User Action:** Types: *"I paid for Pro yesterday but my account still shows Free plan"* and presses Enter.
* **UI Response:** Message bubble immediately renders optimistically in right-aligned dark styling; message composer clears; typing indicator appears.
* **API Request:** `POST /api/v1/conversations` (or WebSocket `conversationMessage` event) with `{ content, visitorId, metadata }`.
* **Backend Operation:**
  1. Inserts row into `conversation` and `conversationTimelineItem` (`type: "message"`, `visibility: "public"`).
  2. Publishes `timelineItemCreated` event to Redis Pub/Sub.
  3. Enqueues primary AI job in BullMQ queue `ai-agent` with `{ conversationId, websiteId }`.
* **Database Changes:** Inserts into `conversationTimelineItem`.
* **Final State:** Real-time WebSocket pushes item to operator dashboard.

---

## Journey 6: AI Agent Processing & Autonomous Response
* **Initial State:** Job waiting in BullMQ `ai-agent` queue.
* **Worker Action:** `apps/workers/src/queues/ai-agent/worker.ts` picks up job and invokes `runPrimaryPipeline`.
* **Pipeline Execution:**
  1. Emits typing indicator event over WebSocket (`conversationTyping: true`).
  2. Calls `searchKnowledgeBase` tool against pgvector `chunk` embeddings for billing policies.
  3. LLM synthesizes response grounded in retrieved markdown policy context.
  4. Generates reply: *"I see your Pro payment was deducted. In order to sync your entitlement, please confirm your Stripe billing email."*
  5. Inserts response timeline item and tracks credit consumption via Polar.sh meter.
* **Database Changes:** Inserts into `conversationTimelineItem`, updates `aiAgentLastProcessedMessageId`.
* **Final State:** Streamed token-by-token into customer chat widget; worker enqueues 30s debounced background job.

---

## Journey 7: AI Knowledge Clarification (When Agent Doesn't Know)
* **Initial State:** Customer asks a novel question not present in the documentation (e.g. *"What is your policy for enterprise self-hosted air-gapped clusters?"*).
* **AI Action:** AI checks vector database; cosine similarity score falls below threshold (`0.70`).
* **Tool Call:** AI invokes `requestKnowledgeClarification` tool with `{ question, summary }`.
* **Backend Operation:**
  1. Inserts record into `knowledgeClarificationRequest` table.
  2. Emits real-time notification to operator dashboard.
  3. Sends conversational handoff message: *"Let me connect you with our technical team to confirm this specific detail."*
* **Database Changes:** Inserts into `knowledgeClarificationRequest` (`status: "pending"`).
* **Final State:** Operator sees high-priority clarification banner in inbox.

---

## Journey 8: Support Operator Answering Clarification (Self-Learning Loop)
* **Initial State:** Operator sees clarification request banner in conversation thread.
* **User Action:** Operator types authoritative answer: *"We support air-gapped clusters via our enterprise Helm chart with license key validation."* and clicks "Save to Knowledge Base & Reply".
* **UI Response:** Message sends to customer; knowledge card updates to "Indexed".
* **API Request:** `trpc.knowledgeClarification.answer` mutation with `{ clarificationId, answerText }`.
* **Backend Operation:**
  1. Generates text chunks from answer.
  2. Calls embedding model (text-embedding-3-small) to create vector embeddings.
  3. Saves vector chunks into `chunk` table.
* **Database Changes:** Updates `knowledgeClarificationRequest` to `resolved`; inserts into `knowledge` and `chunk`.
* **Final State:** Future customer queries on air-gapped clusters are answered automatically by the AI agent.

---

## Journey 9: Team Member Invitation
* **Initial State:** Admin on `/[websiteSlug]/settings/team`.
* **User Action:** Enters teammate email `sarah@company.com`, selects role `member`, and clicks "Send Invite".
* **UI Response:** Form resets; pending invite card appears in table with "Invited" badge.
* **API Request:** `trpc.team.inviteMember` with `{ email: "sarah@company.com", role: "member" }`.
* **Backend Operation:** Better-Auth creates secure invitation record with 7-day token; enqueues invitation email job in Resend/SES worker.
* **Database Changes:** Inserts into `invitation` table (`id`, `organizationId`, `email`, `role`, `token`, `expiresAt`).
* **Final State:** Teammate receives email containing personalized onboarding link `/j/[inviteToken]`.

---

## Journey 10: Assigning a Conversation
* **Initial State:** Operator viewing unassigned conversation in `/[websiteSlug]/inbox`.
* **User Action:** Clicks "Assign" dropdown and selects teammate "Sarah".
* **UI Response:** Assignee avatar updates immediately in conversation header and list pane.
* **API Request:** `trpc.conversation.setAssignee` with `{ conversationId, memberId: "mem_123" }`.
* **Backend Operation:** Verifies member belongs to organization; inserts/updates `conversationAssignee` record; emits WebSocket event.
* **Database Changes:** Upserts `conversationAssignee` table.
* **Final State:** Sarah receives desktop push notification and conversation appears in her assigned filter view.

---

## Journey 11: Adding Private Team Notes
* **Initial State:** Operator investigating ticket needs to leave internal context.
* **User Action:** Toggles composer switch from "Public Reply" to "Internal Note", types: *"Checked Stripe dashboard: payment charge ch_321 succeeded. Manual webhook trigger required."* and presses Send.
* **UI Response:** Message renders with distinctive amber background and lock icon.
* **API Request:** `trpc.conversation.sendTimelineItem` with `{ visibility: "private", content: "..." }`.
* **Backend Operation:** Validates actor has operator privileges; persists item with `visibility = 'private'`.
* **Database Changes:** Inserts row into `conversationTimelineItem` with `visibility: 'private'`.
* **Final State:** Visible to dashboard teammates; filtered out of customer chat widget feed.

---

## Journey 12: Resolving a Conversation
* **Initial State:** Customer issue addressed and verified.
* **User Action:** Operator presses keyboard shortcut `Cmd + Enter` or clicks "Resolve".
* **UI Response:** Conversation badge changes from green "Open" to purple "Resolved"; ticket disappears from Open inbox.
* **API Request:** `trpc.conversation.updateStatus` with `{ conversationId, status: "resolved" }`.
* **Backend Operation:** Updates conversation row; inserts resolution timeline event; triggers satisfaction feedback rating prompt to customer.
* **Database Changes:** Updates `conversation` row (`status: 'resolved'`, `resolvedAt: NOW()`).
* **Final State:** Widget prompts visitor: *"How was your experience today? [👍] [👎]"*.

---

## Journey 13: Configuring AI Tools & BYOK (Bring Your Own Key)
* **Initial State:** User wants to use their own OpenRouter account and custom tools.
* **User Action:** Navigates to `/[websiteSlug]/settings/developers`, inputs OpenRouter API Key `sk-or-v1-...`, and enables Stripe integration tool.
* **UI Response:** "Key Verified" checkmark renders; toast confirms "Custom key activated".
* **API Request:** `trpc.website.setOpenRouterKey` with `{ apiKey: "sk-or-v1-..." }`.
* **Backend Operation:** Validates key against OpenRouter `/models` endpoint; encrypts key before storing in `websiteOpenRouterKey`.
* **Database Changes:** Upserts `websiteOpenRouterKey` table (`encryptedKey`, `verifiedAt`).
* **Final State:** Future AI agent turns use tenant's OpenRouter credentials directly.

