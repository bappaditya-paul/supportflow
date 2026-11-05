# Page Specification: 06 — Operator Inbox (`/dashboard/inbox`)

## 1. Overview
The flagship operational cockpit of SupportFlow. This page coordinates real-time ticket triage, multi-agent Switch AI tool executions, live customer ghost typing, and the mandatory **Human Review & Dispatch Gate**.

---

## 2. Wireframe & Visual Layout

```text
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: SupportFlow PRO | Switch AI: 34079 [Online] | Mode: Split / Full | WS: Connected         │
├────────────┬──────────────────────┬──────────────────────────────────────────┬────────────────────┤
│ SIDEBAR    │ CONVERSATIONS        │ MAIN THREAD: TKT-1001 (Alex Rivera)      │ VISITOR PROFILE    │
│            │                      │ Status: AWAITING APPROVAL | Room #support│                    │
│ [SF] Logo  │ [Search tickets... ] ├──────────────────────────────────────────┤ Alex Rivera        │
│            │                      │ [LIVE GHOST TYPING: Alex is typing...]   │ alex@example.com   │
│ • Inbox (3)│ [All][Inv][Appr][Res]├──────────────────────────────────────────┤                    │
│ • Contacts │                      │ Initial Ticket:                          │ Plan Discrepancy:  │
│ • Swarm    │ TKT-1001 [DISCREP]   │ "Paid for Pro, still Free"               │ Stripe: PRO ($49)  │
│ • KB Docs  │ Alex Rivera          ├──────────────────────────────────────────┤ DB:     FREE       │
│ • Settings │ "Paid for Pro..."    │ > Tool: lookup_customer("CUST-001")      │ [Sync DB Now]      │
│            │                      │   Result: { plan: "free", status: "ok" } ├────────────────────┤
│ Switch:    │ TKT-1002             ├──────────────────────────────────────────┤ Charge ID:         │
│ localhost: │ Sarah Chen           │ > Tool: check_stripe("alex@example.com") │ ch_3P7a9xK201LMN7  │
│ 34079      │ "Quota Increase..."  │   Result: { status: "paid", plan: "pro" }│ Last Paid: Nov 4   │
│            │                      ├──────────────────────────────────────────┤ Account Age: 142d  │
│ Operator:  │ TKT-1003             │ ┌──────────────────────────────────────┐ │ GeoIP: US-West     │
│ admin@sf.ai│ Marcus Vance         │ │ HUMAN REVIEW & DISPATCH GATE (Pending│ │                    │
│            │ "SAML SSO Cert..."   │ │ "Hi Alex, we confirmed your $49..."  │ │                    │
│            │                      │ │ [Edit Draft]   [✓ Approve & Dispatch]│ │                    │
│            │                      │ └──────────────────────────────────────┘ │                    │
│            │                      ├──────────────────────────────────────────┤                    │
│            │                      │ Composer: [Internal Note] / [Public Reply│                    │
└────────────┴──────────────────────┴──────────────────────────────────────────┴────────────────────┘
```

---

## 3. Component Breakdown

| Component | File Path | Responsibility |
| :--- | :--- | :--- |
| `SidebarNav` | `src/dashboard/SidebarNav.tsx` | Global navigation, unread badges, Switch status |
| `ConversationListPane` | `src/dashboard/ConversationListPane.tsx` | Filtered list of tickets (All, Investigating, Awaiting Approval, Resolved) |
| `ConversationDetailPane` | `src/dashboard/ConversationDetailPane.tsx` | Central message stream, ticket header, composer |
| `GhostTypingPreview` | `src/dashboard/GhostTypingPreview.tsx` | Pulsating bar showing live keystrokes before customer hits enter |
| `ToolExecutionCard` | `src/dashboard/ToolExecutionCard.tsx` | Expandable execution card with raw arguments and JSON results |
| `ApprovalDispatchGate` | `src/dashboard/ApprovalDispatchGate.tsx` | Human sign-off card with inline editing and 1-click dispatch |
| `VisitorProfileDrawer` | `src/dashboard/VisitorProfileDrawer.tsx` | Customer metadata, Stripe charge ID, DB mismatch alert |
| `InternalNoteComposer` | `src/dashboard/InternalNoteComposer.tsx` | Tabbed input for private team notes vs. public replies |
| `SwitchRoomBadge` | `src/dashboard/SwitchRoomBadge.tsx` | Real-time agent activity indicator (`@triager`, `@investigator`, `@responder`) |

---

## 4. Real-Time Data & WebSocket Events
- `GHOST_TYPING`: Receives keystroke stream `{ ticket_id, text, is_typing }` via `ws://localhost:8000/ws`.
- `TOOL_INVOKED`: Renders newly executed tool calls dynamically in thread.
- `DRAFT_READY`: Displays the Human Review card when `@responder` completes policy grounding.
- `DISPATCH_APPROVED`: Triggers instant DB sync and emits the message to the customer's chat widget.

