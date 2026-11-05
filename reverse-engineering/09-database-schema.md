# 09 — Comprehensive Database Schema & Relationships

Cossistant uses **PostgreSQL 17** with the **`pgvector`** extension, modeled and queried via **Drizzle ORM**.

---

## 1. Entity-Relationship Overview

```
 [organization] (Tenant Owner)
    ├── [member] ── [user] (Operator)
    │     └── [memberNotificationSetting]
    └── [website] (Product Instance)
          ├── [apiKey] (Public pk_* & Secret sk_*)
          ├── [websiteOpenRouterKey] (BYOK Credentials)
          ├── [aiAgent] (Support Bot Persona)
          │     └── [aiAgentPromptDocument]
          ├── [knowledge] (Source Docs, URLs, FAQs)
          │     └── [chunk] (1536d Vector Embeddings via HNSW)
          ├── [visitor] (Web Visitor / Device)
          │     └── [contact] (Identified User Profile)
          └── [conversation] (Ticket Thread)
                ├── [conversationTimelineItem] (Messages, Tools, Notes)
                ├── [conversationAssignee]
                ├── [conversationParticipant]
                ├── [conversationSeen]
                ├── [feedback] (CSAT Ratings)
                └── [knowledgeClarificationRequest] (Agent Learning Turns)
```

---

## 2. Table Specifications

### A. Authentication & Multi-Tenancy

#### `organization`
* `id`: `varchar(26)` (ULID, Primary Key)
* `name`: `text` (Not Null)
* `slug`: `text` (Not Null, Unique)
* `logo`: `text`
* `createdAt`: `timestamp`
* `metadata`: `jsonb`

#### `member`
* `id`: `varchar(26)` (ULID, Primary Key)
* `organizationId`: `varchar(26)` (FK ➔ `organization.id`, On Delete Cascade)
* `userId`: `varchar(26)` (FK ➔ `user.id`, On Delete Cascade)
* `role`: `varchar` (`owner`, `admin`, `member`)
* `createdAt`: `timestamp`

#### `website`
* `id`: `varchar(26)` (ULID, Primary Key)
* `organizationId`: `varchar(26)` (FK ➔ `organization.id`, On Delete Cascade)
* `name`: `text` (Not Null)
* `slug`: `text` (Not Null, Unique Index)
* `domain`: `text`
* `allowedOrigins`: `jsonb` (Array of approved CORS domain strings)
* `themeSettings`: `jsonb` (Primary color, radius, placement, greeting text)
* `defaultParticipants`: `jsonb` (Default assigned agent or user IDs)
* `createdAt`: `timestamp`

---

### B. Conversation & Messaging Engine

#### `conversation`
* `id`: `varchar(21)` (NanoID, Primary Key)
* `organizationId`: `varchar(26)` (FK ➔ `organization.id`)
* `websiteId`: `varchar(26)` (FK ➔ `website.id`)
* `visitorId`: `varchar(26)` (FK ➔ `visitor.id`)
* `status`: `conversation_status` enum (`open`, `resolved`, `spam`, `archived`)
* `priority`: `conversation_priority` enum (`low`, `normal`, `high`, `urgent`)
* `prioritySource`: `varchar` (`ai`, `user`)
* `sentiment`: `conversation_sentiment` enum (`positive`, `neutral`, `negative`, `frustrated`)
* `sentimentConfidence`: `real`
* `title`: `text` (Generated summary or operator title)
* `titleSource`: `varchar` (`ai`, `user`)
* `channel`: `text` (Default `'widget'`, `'email'`, `'slack'`)
* `metadata`: `jsonb` (Custom client-injected context)
* `escalatedAt`: `timestamp`
* `escalationReason`: `text`
* `aiPausedUntil`: `timestamp`
* `aiAgentLastProcessedMessageId`: `varchar(26)` (Cursor for FIFO message queue)
* `aiAgentLastProcessedMessageCreatedAt`: `timestamp`
* `startedAt`: `timestamp`
* `firstResponseAt`: `timestamp`
* `resolvedAt`: `timestamp`

#### `conversation_timeline_item`
* `id`: `varchar(26)` (ULID, Primary Key)
* `conversationId`: `varchar(21)` (FK ➔ `conversation.id`, On Delete Cascade)
* `organizationId`: `varchar(26)` (FK ➔ `organization.id`)
* `visibility`: `item_visibility` enum (`public`, `private`)
* `type`: `conversation_timeline_type` enum (`message`, `tool`, `event`)
* `text`: `text` (Raw markdown / plain text)
* `parts`: `jsonb` (Rich media, tool input/output envelopes, attachments)
* `userId`: `varchar(26)` (FK ➔ `user.id`, Nullable)
* `visitorId`: `varchar(26)` (FK ➔ `visitor.id`, Nullable)
* `aiAgentId`: `varchar(26)` (FK ➔ `aiAgent.id`, Nullable)
* `createdAt`: `timestamp` (Indexed with `conversationId`)
* `deletedAt`: `timestamp`

#### `conversation_seen`
* `conversationId`: `varchar(21)` (FK ➔ `conversation.id`)
* `actorType`: `text` (`visitor`, `user`, `ai_agent`)
* `actorId`: `varchar(26)`
* `lastSeenAt`: `timestamp`
* *Primary Key:* `(conversationId, actorType, actorId)`

---

### C. RAG Knowledge & Vector Storage

#### `knowledge`
* `id`: `varchar(26)` (ULID, Primary Key)
* `websiteId`: `varchar(26)` (FK ➔ `website.id`, On Delete Cascade)
* `title`: `text`
* `sourceType`: `text` (`faq`, `file`, `web_crawl`)
* `sourceUrl`: `text`
* `content`: `text`
* `syncStatus`: `varchar` (`pending`, `synced`, `failed`)
* `createdAt`: `timestamp`
* `updatedAt`: `timestamp`

#### `chunk` (Vector Embeddings)
* `id`: `varchar(26)` (ULID, Primary Key)
* `websiteId`: `varchar(26)` (FK ➔ `website.id`, On Delete Cascade)
* `knowledgeId`: `varchar(26)` (FK ➔ `knowledge.id`, Nullable)
* `visitorId`: `varchar(26)` (FK ➔ `visitor.id`, Nullable)
* `contactId`: `varchar(26)` (FK ➔ `contact.id`, Nullable)
* `sourceType`: `text` (`knowledge`, `visitor_memory`, `contact_memory`)
* `content`: `text` (Raw chunk text slice)
* `embedding`: `vector(1536)` (OpenAI `text-embedding-3-small` dimensions)
* `chunkIndex`: `integer`
* `metadata`: `jsonb`
* **Index:** `chunk_embedding_idx` USING `hnsw` (`embedding vector_cosine_ops`)

#### `knowledge_clarification_request`
* `id`: `varchar(26)` (ULID, Primary Key)
* `conversationId`: `varchar(21)` (FK ➔ `conversation.id`)
* `websiteId`: `varchar(26)` (FK ➔ `website.id`)
* `question`: `text` (Unanswered customer query)
* `summary`: `text`
* `status`: `text` (`pending`, `answered`, `ignored`)
* `resolvedKnowledgeId`: `varchar(26)` (FK ➔ `knowledge.id`, Nullable)
* `createdAt`: `timestamp`

---

### D. Security & Developers

#### `api_key`
* `id`: `varchar(26)` (ULID, Primary Key)
* `websiteId`: `varchar(26)` (FK ➔ `website.id`, On Delete Cascade)
* `keyHash`: `varchar(64)` (SHA-256 hash of API key)
* `prefix`: `varchar(16)` (e.g. `pk_8950...` or `sk_4120...`)
* `type`: `varchar` (`publishable`, `secret`)
* `name`: `text`
* `createdAt`: `timestamp`
* `revokedAt`: `timestamp`

