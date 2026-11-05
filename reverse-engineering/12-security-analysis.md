# 12 — Security & Engineering Analysis

This document provides a comprehensive security audit of Cossistant’s codebase, identifying security mechanisms in place and defining the mandatory controls required for an independent alternative.

---

## 1. Authentication & Session Security

* **Framework:** **Better-Auth** (`1.6.15`).
* **Session Storage:** Server-side sessions in PostgreSQL (`session` table) with high-entropy token hashes.
* **Cookie Configuration:**
  * `HttpOnly: true` (prevents client-side JavaScript access via XSS).
  * `Secure: true` in production (enforces HTTPS transmission).
  * `SameSite: "Lax"` (mitigates Cross-Site Request Forgery / CSRF attacks).
* **Social OAuth Security:** State tokens validated via PKCE (Proof Key for Code Exchange) to prevent authorization code interception.

---

## 2. API Key Architecture & Protection

* **Key Partitioning:**
  * **Publishable Keys (`pk_*`):** Public-facing, limited to read-only widget config and visitor-scoped conversation turns. Strictly bound to the `allowedOrigins` domain whitelist.
  * **Secret Keys (`sk_*`):** Server-only, granting full administrative programmatic access.
* **Storage Standard:**
  * Plaintext keys are **never stored** in the database.
  * Upon creation, the full key is presented to the user **once**.
  * The database only stores the key prefix (`pk_8950...`) for identification and a salted **SHA-256 hash** (`keyHash`) in `apps/api/src/db/schema/api-keys.ts`.
  * Incoming API keys are hashed and matched in constant time to prevent timing attacks.

---

## 3. Data Isolation & Multi-Tenancy Defense

* **Tenant Boundary Invariant:** Every query in the codebase enforces tenancy checks at the root SQL level:
  ```typescript
  where(and(eq(conversation.id, conversationId), eq(conversation.websiteId, currentWebsiteId)))
  ```
* **ID Obfuscation:**
  * Avoids auto-incrementing sequential integers (`1, 2, 3...`) which are vulnerable to ID enumeration (Insecure Direct Object Reference / IDOR).
  * Conversations use **NanoID** (21-character cryptographically strong URL-safe strings).
  * Database entities use **ULID** (Universally Unique Lexicographically Sortable Identifier) for sortable distributed uniqueness without exposing database sequences.

---

## 4. Input Validation & Injection Defenses

* **SQL Injection:**
  * All database operations utilize **Drizzle ORM** with tagged template literals (`sql`...) or query builders that compile to parameterized SQL queries (`$1, $2, ...`). Direct string interpolation into SQL queries is completely absent from the codebase.
* **Payload Validation:**
  * 100% of incoming HTTP and WebSocket payloads are validated through **Zod v4** schemas before reaching route handlers (`packages/protocol/src/routes`).
  * Malformed payloads, unknown fields, or prototype pollution attempts are rejected with HTTP 422 Unprocessable Entity.
* **XSS Prevention:**
  * Message rendering in the customer widget and dashboard uses React’s native JSX virtual DOM escaping.
  * Rich-text editing via Tiptap and markdown rendering via `@cossistant/tiny-markdown` sanitize HTML tags, discarding unsafe elements like `<script>`, `<iframe>`, `<object>`, and `onerror` handlers.

---

## 5. File Upload Safeguards

* **No Direct File Proxying:** Uploaded files never pass through application server memory, eliminating buffer overflow and local file inclusion (LFI) vectors.
* **Presigned S3 Upload Pipeline:**
  1. File MIME types are validated against a strict allowlist (`image/jpeg`, `image/png`, `image/webp`, `image/gif`, `application/pdf`, `text/plain`). Executable binaries (`.exe`, `.sh`, `.bat`, `.html`, `.svg`) are rejected to prevent stored XSS.
  2. Maximum upload size is strictly capped at **10 MB**.
  3. S3 bucket policies enforce private writes with restricted public read via CDN.

---

## 6. AI Guardrails & Privacy Protections

* **Telemetry Redaction (`apps/api/src/ai-pipeline/shared/tools/telemetry/sanitize.ts`):**
  * Before tool arguments or context are persisted to timeline traces, sensitive tokens (authorization headers, credit card numbers, passwords) are scrubbed.
* **Prompt Injection Defense:**
  * System prompts explicitly instruct the AI agent to reject tool invocation when input violates safety boundaries.
  * Maximum tool invocation budget (`tool-invocation-budget-form.tsx`) terminates agent execution if a turn exceeds configured limits (e.g., 5 tool calls), preventing runaway API billing loops.

---

## 7. Mandatory Requirements for Independent Implementation

1. **Enforce Tenant Isolation in Middleware:** Do not rely on developers remembering to add `websiteId` filters manually; attach tenant-scoping query extensions.
2. **Never Log Sensitive Payloads:** Ensure all LLM prompts and API key hashes are excluded from stdout logging.
3. **Strict Origin Checking on WebSockets:** Reject WebSocket upgrade requests whose `Origin` header does not match the website's authorized domains.

