# Page Specification: 11 — Interactive Demo Sandbox (`/demo`)

## 1. Overview
The Demonstration Portal simulates a realistic customer B2B SaaS platform (*CloudDesk*) embedding SupportFlow's customer widget. Designed specifically for hackathon judges, walkthrough videos, and live demonstrations.

---

## 2. Wireframe & Visual Layout

```text
┌────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: [Mode: Split Demo View | Customer SaaS App | Operator Full]   │
├────────────────────────────────────────────────────────────────────────┤
│ CLOUDDESK SAAS APPLICATION                                             │
│ Welcome back, Alex Rivera (Account CUST-001) · Cluster: us-east-1a     │
│ Plan Status: FREE TIER (BILLING MISMATCH DETECTED)                     │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ ONE-CLICK HACKATHON TEST SCENARIOS FOR JUDGES                      │ │
│ │ [⚡ 1. Billing Desync: Paid Pro, Still Free (TKT-1001)]            │ │
│ │ [⚡ 2. Emergency Concurrency Limit Increase (TKT-1002)]             │ │
│ │ [⚡ 3. Enterprise Okta SAML 2.0 Setup (TKT-1003)]                   │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ Live Metrics: CPU 34.2% · Memory 12.8GB · API 1,420/s · Billing: Sync  │
│ Pods: api-gateway (4/4) · auth-service (2/2) · billing-worker (1/2)    │
│                                                                        │
│                                               ┌──────────────────────┐ │
│                                               │ CloudDesk Support    │ │ (Embedded
│                                               │ ──────────────────── │ │  Widget)
│                                               │ Hi there! How can we │ │
│                                               │ help today?          │ │
│                                               │                      │ │
│                                               │ [Start conversation] │ │
│                                               └──────────────────────┘ │
│                                                              [💬 Widget]│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Breakdown

| Component | File Path | Responsibility |
| :--- | :--- | :--- |
| `CloudDeskDemo` | `src/demo/CloudDeskDemo.tsx` | Simulated B2B cloud infrastructure SaaS platform |
| `SupportWidget` | `src/widget/SupportWidget.tsx` | Embeddable customer widget container (supports floating or docked) |
| `WidgetHeader` | `src/widget/WidgetHeader.tsx` | Customer header with online presence indicator |
| `HomeView` | `src/widget/views/HomeView.tsx` | Welcome screen, start conversation CTA, scenario shortcuts |
| `ConversationView` | `src/widget/views/ConversationView.tsx` | Live message stream, agent typing indicator, CSAT rating |
| `WidgetTrigger` | `src/widget/WidgetTrigger.tsx` | Circular bottom-right launcher button with unread counter |

---

## 4. Key Interactions & Transitions
- **Trigger Scenario Button:** Injects the scenario immediately into both the widget and the operator inbox.
- **Typing in Widget:** Emits `GHOST_TYPING` WebSocket event; operator sees live keystroke preview before submit.
- **Split View Switcher:** Toggles split-screen layout where judges can see the customer typing on the left and the operator desk responding on the right.
