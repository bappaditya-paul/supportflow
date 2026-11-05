# Page Specification: 09 — Knowledge Base & Grounding (`/dashboard/kb`)

## 1. Overview
The Knowledge Base page manages the authoritative markdown policy documents and FAQs that `@responder` uses to ground customer drafts. Enforces the "Zero Hallucination" rule — agents cannot invent answers outside these verified articles.

---

## 2. Wireframe & Visual Layout

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Sidebar]   KNOWLEDGE BASE & POLICY GROUNDING                          │
│             Authoritative source documents for Switch AI Swarm         │
│                                                                        │
│ [Search articles & policies...                     ]  [+ New Policy]  │
├────────────────────────────────────────────────────────────────────────┤
│ POLICY ARTICLES:                                                       │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Policy KB-001: Subscription & Billing Discrepancies                │ │
│ │ Category: Billing · Last Updated: Nov 2026 · Used by: @responder   │ │
│ │ "When Stripe records an active charge for a paid tier (Pro), but   │ │
│ │  the application database reflects Free due to webhook latency:     │ │
│ │  1. Verify charge ID in Stripe immediately.                         │ │
│ │  2. Upgrade database tier to Pro and restore 600 req/min limit.    │ │
│ │  3. Proactively apologize without blaming payment provider.        │ │
│ │ [View Full Markdown ->]  [Edit Grounding]                          │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Policy KB-002: SLA Response Time & Priority Triage                 │ │
│ │ Category: Operations · Last Updated: Oct 2026 · Used by: @triager   │ │
│ │ "Pro tier subscribers are guaranteed < 15-minute response times... │ │
│ │ [View Full Markdown ->]  [Edit Grounding]                          │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Breakdown

| Component | Responsibility | Props / State |
| :--- | :--- | :--- |
| `KbHeader` | Header with total active policies and "New Policy" trigger | `totalPolicies: number` |
| `PolicySearchBar` | Filter policies by keyword or category tag | `searchQuery`, `onSearchChange` |
| `PolicyCard` | Card showing policy ID, title, summary snippet, and agent usage tag | `policy: PolicyItem` |
| `MarkdownPolicyModal` | Full-screen markdown viewer and editor for policy authors | `policy`, `isOpen`, `onSave` |

---

## 4. Key Interactions & Transitions
- **Instant Search:** Filters policies in real time as the operator types.
- **Edit Policy:** Opens inline editor; saving updates the backend markdown file under `server/data/knowledge_base/` immediately.
- **Grounding Verification:** Displays which tickets have referenced each policy for accountability.
