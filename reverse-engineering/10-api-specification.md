# 10 — Complete API Specification & Contracts

Cossistant exposes two distinct API protocols:
1. **Public REST & OpenAPI Endpoints (`/api/v1/*`)**: Consumed by the embeddable chat widget, SDKs, and third-party developer integrations.
2. **tRPC v11 Procedures (`/trpc/*`)**: Consumed by the operational Next.js dashboard.

---

## 1. Authentication Mechanisms

| Auth Scheme | Header Format | Scope / Usage |
| :--- | :--- | :--- |
| **Publishable Key** | `x-cossistant-key: pk_...` (or query `?key=pk_...`) | Public client-side support widget. Read-only settings, create conversations, post visitor messages. |
| **Secret API Key** | `Authorization: Bearer sk_...` | Server-to-server operations, full CRUD over contacts, knowledge base, conversations. |
| **Session Cookie** | `Cookie: cossistant_session=...` | Better-Auth authenticated dashboard operators. |

---

## 2. Public REST API Endpoint Reference (`packages/protocol/src/routes`)

### A. Support Widget State & Config
* **`GET /api/v1/support`**
  * **Auth:** Publishable Key (`pk_*`)
  * **Response:**
    ```json
    {
      "website": {
        "id": "web_01J...",
        "name": "CloudDesk",
        "themeSettings": {
          "primaryColor": "#131313",
          "radius": 2,
          "position": "bottom-right"
        }
      },
      "agent": {
        "id": "agent_01J...",
        "name": "SupportBot",
        "avatar": "https://..."
      },
      "team": {
        "onlineNowCount": 3,
        "recentAvatars": ["https://..."]
      }
    }
    ```

---

### B. Conversation Lifecycle

* **`POST /api/v1/conversations`**
  * **Auth:** Publishable Key
  * **Request Body:**
    ```json
    {
      "visitorId": "vis_01J...",
      "initialMessage": "I paid for Pro yesterday but my account still shows Free plan.",
      "metadata": {
        "currentUrl": "https://clouddesk.com/billing",
        "plan": "free"
      }
    }
    ```
  * **Response (HTTP 201 Created):**
    ```json
    {
      "conversationId": "c_9q2mK9x1",
      "status": "open",
      "createdAt": "2026-11-05T12:00:00.000Z"
    }
    ```

* **`GET /api/v1/conversations/{conversationId}/timeline`**
  * **Auth:** Dual Auth (Visitor Token or Session)
  * **Response:**
    ```json
    {
      "items": [
        {
          "id": "item_01J...",
          "type": "message",
          "visibility": "public",
          "text": "I paid for Pro yesterday...",
          "senderType": "visitor",
          "createdAt": "2026-11-05T12:00:00Z"
        },
        {
          "id": "item_01K...",
          "type": "message",
          "visibility": "public",
          "text": "I see your payment of $29 was received yesterday. I am syncing your entitlement now.",
          "senderType": "ai_agent",
          "createdAt": "2026-11-05T12:00:04Z"
        }
      ]
    }
    ```

* **`POST /api/v1/conversations/{conversationId}/messages`**
  * **Auth:** Dual Auth
  * **Request Body:**
    ```json
    {
      "text": "Thank you, it works now!",
      "attachments": []
    }
    ```

* **`POST /api/v1/conversations/{conversationId}/resolve`**
  * **Auth:** Secret Key or Operator Session
  * **Response:** `{ "success": true, "status": "resolved" }`

* **`POST /api/v1/conversations/{conversationId}/typing`**
  * **Request Body:** `{ "isTyping": true, "preview": "Can I also..." }`

---

### C. Visitor Tracking & CRM

* **`POST /api/v1/contacts/identify`**
  * **Auth:** Publishable Key
  * **Request Body:**
    ```json
    {
      "visitorId": "vis_01J...",
      "email": "customer@acme.com",
      "name": "Jane Doe",
      "customAttributes": {
        "monthlySpend": 299,
        "companyName": "Acme Corp"
      }
    }
    ```
  * **Response:** `{ "contactId": "cnt_01J...", "identified": true }`

---

### D. File Uploads

* **`POST /api/v1/uploads/sign-url`**
  * **Auth:** Publishable Key or Session
  * **Request Body:**
    ```json
    {
      "filename": "screenshot-bug.png",
      "contentType": "image/png",
      "byteSize": 1048576
    }
    ```
  * **Response:**
    ```json
    {
      "uploadUrl": "https://cossistant-dev.s3.us-east-1.amazonaws.com/uploads/...?X-Amz-Signature=...",
      "publicUrl": "https://cdn.cossistant.com/uploads/uuid-screenshot-bug.png"
    }
    ```

---

## 3. Internal tRPC Router Inventory (`origamiTRPCRouter`)

Mounted on `/trpc` and queried via `@trpc/tanstack-react-query`:

1. **`conversation.*`**:
   * `conversation.listInbox({ websiteSlug, status, page })`
   * `conversation.getById({ conversationId })`
   * `conversation.updateStatus({ conversationId, status })`
   * `conversation.setPriority({ conversationId, priority })`
   * `conversation.setAssignee({ conversationId, memberId })`
   * `conversation.sendTimelineItem({ conversationId, text, visibility: "private" | "public" })`
2. **`knowledge.*`**:
   * `knowledge.list({ websiteSlug })`
   * `knowledge.create({ websiteSlug, title, content, sourceType: "faq" })`
   * `knowledge.delete({ id })`
3. **`knowledgeClarification.*`**:
   * `knowledgeClarification.listPending({ websiteSlug })`
   * `knowledgeClarification.answer({ id, answerText })`
4. **`aiAgent.*`**:
   * `aiAgent.getConfig({ websiteSlug })`
   * `aiAgent.updateConfig({ websiteSlug, model, temperature, instructions })`
   * `aiAgent.updateThinkingBudget({ websiteSlug, thinkingTokens })`
5. **`team.*`**:
   * `team.listMembers({ websiteSlug })`
   * `team.inviteMember({ websiteSlug, email, role })`
   * `team.removeMember({ memberId })`
6. **`website.*`**:
   * `website.getSettings({ websiteSlug })`
   * `website.createApiKey({ websiteSlug, name, type })`
   * `website.revokeApiKey({ apiKeyId })`
   * `website.setOpenRouterKey({ websiteSlug, apiKey })`

