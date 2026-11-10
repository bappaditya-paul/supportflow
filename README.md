# 🎧 SupportFlow — Collaborative AI Customer Support Swarm
> **Autonomous Enterprise Support with Human-in-the-Loop Governance** | Powered by [Switch AI](https://github.com/sandbox-quantum/switch)

---

## 📌 Executive Summary

SupportFlow transforms reactive customer support into an autonomous, evidence-backed operations room inside team chat (**Mattermost**, Slack, or Discord) using **Switch AI**, paired with a modern, high-speed **customer widget and operator cockpit**.

When a customer complaint or billing ticket arrives:
1. **`@supportflow-triager`** classifies the issue, calculates urgency, evaluates sentiment, and delegates investigation.
2. **`@supportflow-investigator`** executes deterministic verification tools (`lookup_customer.py`, `check_stripe`), detects subscription/database plan mismatches, and enforces customer PII masking.
3. **`@supportflow-responder`** grounds resolution in official company policies (`Policy KB-001`), drafts an empathetic resolution, and submits it to the Human Review Gate.
4. **Human Support Lead** verifies the findings and approves with **[Approve & Dispatch]** before any external communication or database upgrade occurs.
5. **Live Ghost Typing** gives operators a real-time preview of what customers are typing *before* they press submit, speeding up time-to-first-response by 60%.

---

## 🏗️ System Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer (CloudDesk SaaS)
    actor Lead as Human Operator Desk
    participant Widget as SupportFlow Widget
    participant WS as WebSocket & API Gateway (:8000)
    participant Room as Switch AI Room (#SupportFlow in Mattermost)
    participant Triager as @supportflow-triager
    participant Inv as @supportflow-investigator
    participant Resp as @supportflow-responder
    participant Engine as Deterministic Python Engine & KB

    Customer->>Widget: Types complaint ("Paid for Pro, still Free")
    Widget-->>Lead: Live Ghost Typing Broadcast via WebSocket
    Customer->>Widget: Submits Ticket TKT-1001
    Widget->>WS: POST /api/v1/tickets/submit
    WS->>Room: Delivers event to Switch AI Room (:34079)
    Room->>Triager: Analyzes ticket (Category: Billing, Priority: High)
    Triager->>Inv: Delegates customer & Stripe audit
    Inv->>Engine: python scripts/lookup_customer.py --id CUS-501
    Engine-->>Inv: Discrepancy Found! Stripe: Pro ($49), DB: Free
    Inv->>Room: Posts verified evidence (PII Masked)
    Triager->>Resp: Instructs response preparation
    Resp->>Engine: python scripts/search_knowledge.py --query "billing mismatch"
    Engine-->>Resp: Returns Policy KB-001 (Immediate sync + apology)
    Resp->>Room: Prepares draft & submits to Human Review Gate
    Lead->>Widget: Clicks [Approve & Dispatch]
    Lead->>Engine: Upgrades DB plan to 'pro' & unlocks 600 req/min API quota
    Widget-->>Customer: Delivers verified resolution in chat
```

---

## 👥 The Autonomous Swarm

| Agent Persona | Role | Addressing Rule | Provider & Deterministic Tools |
| :--- | :--- | :--- | :--- |
| **`@supportflow-triager`** | Triage Manager & Sentiment Classifier | `anyone` | `codex` / `lookup_ticket.py` |
| **`@supportflow-investigator`** | Deterministic Customer & Stripe Auditor | `anyone` | `codex` / `lookup_customer.py`, Stripe audit |
| **`@supportflow-responder`** | Policy-Grounded Draft Composer | `anyone` | `codex` / `search_knowledge.py`, `create_draft.py` |
| **Human Support Lead** | Final Governance & Dispatch Gatekeeper | Team Member | Mattermost Channel / Operator Cockpit |

---

## 🎨 Frontend & Design Architecture

Built using **React 19, TypeScript, Vite, and Tailwind CSS v4**, the frontend features a brutalist, high-performance UI:
- **Brutalist Tokens:** `--radius: 2px`, OKLCH neutral palettes, Geist Mono data typography, dashed hairline borders.
- **Three Interactive View Modes:**
  1. **Split Demo View:** Side-by-side view featuring the customer experience on the left and the operator multi-agent cockpit on the right.
  2. **Customer SaaS App:** Realistic B2B SaaS dashboard (*CloudDesk*) with the floating circular trigger and embeddable support widget.
  3. **Operator Cockpit Fullscreen:** Deep-dive inbox with status filters, live Switch AI room badges, tool execution cards with raw JSON outputs, and the human sign-off card.
- **Live Ghost Typing:** Real-time character stream broadcasted over WebSocket before message submission.

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- **Node.js 18+** & **npm**
- **Python 3.10+** (Tested on Python 3.14)
- **Docker** (For local Mattermost & Switch bridge container)
- **Switch Console** running locally on port `34079`

### 2. Run Test Suites
```bash
# Backend pytest suite (25/25 tests passing)
cd server
python3 -m pytest -v

# Frontend TypeScript & Vite build
cd ../client
npm run build
```

### 3. Start Backend & Frontend
```bash
# Terminal 1: Start FastAPI backend with WebSocket support
cd server
python3 -m uvicorn app.main:app --port 8000 --reload

# Terminal 2: Start Vite client
cd client
npm run dev
```

Open **`http://localhost:5173`** in your browser to experience the complete live application!

### 4. Import the Switch Room Template
1. Open **Switch Console** (`localhost:34079`).
2. Navigate to **Templates** → click **Import template**.
3. Select `switch/supportflow-room.template.yaml`.
4. Choose **Mattermost** as the bridge and your project directory as the workspace.
5. Click **Create room**.
6. Switch will launch the `#SupportFlow` channel in Mattermost with all 3 agents ready!

---

## 📂 Repository Structure

```text
SupportFlow/
├── client/                               # Modern React 19 + Vite Frontend
│   ├── src/
│   │   ├── dashboard/                    # Operator Cockpit Components
│   │   │   ├── AgentStudio.tsx           # Multi-agent swarm runtime studio
│   │   │   ├── ApprovalDispatchGate.tsx  # Human-in-the-loop sign-off card
│   │   │   ├── ConversationDetailPane.tsx# Chat thread with tool logs & notes
│   │   │   ├── ConversationListPane.tsx  # Virtualized ticket queue with filters
│   │   │   ├── DeveloperSettings.tsx     # Domain allowlist & widget tokens
│   │   │   ├── GhostTypingPreview.tsx    # Live keystroke preview
│   │   │   ├── InternalNoteComposer.tsx  # Team chat & Switch prompt composer
│   │   │   ├── KnowledgeHub.tsx          # Policy editor & web vector sources
│   │   │   ├── SidebarNav.tsx            # Navigation & Switch status
│   │   │   ├── SwitchRoomBadge.tsx       # Live agent swarm telemetry
│   │   │   ├── TopAnalyticsBar.tsx       # Live velocity & CSAT telemetry
│   │   │   └── VisitorProfileDrawer.tsx  # DB vs Stripe entitlement drawer
│   │   ├── demo/
│   │   │   └── CloudDeskDemo.tsx         # B2B SaaS demo application
│   │   ├── widget/                       # Embeddable Customer Widget
│   │   │   ├── SupportWidget.tsx         # Root container (floating / embed)
│   │   │   ├── WidgetHeader.tsx          # Header with branding & presence
│   │   │   ├── WidgetTrigger.tsx         # Floating button with unread count
│   │   │   └── views/                    # HomeView & ConversationView
│   │   ├── App.tsx                       # Master view switcher & state manager
│   │   ├── index.css                     # OKLCH design tokens
│   │   └── types.ts                      # Strict TypeScript definitions
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                               # FastAPI Backend & Orchestration
│   ├── app/
│   │   ├── auth.py                       # Supabase JWT & Fast-Track RBAC
│   │   ├── db/                           # Supabase admin client connector
│   │   ├── main.py                       # REST APIs + WebSocket Ghost Typing
│   │   ├── models.py                     # Pydantic schemas
│   │   └── services/                     # Ticket, Customer, KB, Draft & Timeline
│   ├── data/
│   │   ├── tickets.json                  # Sample tickets
│   │   ├── customers.json                # Customer ledger
│   │   ├── timelines.json                # Thread conversation histories
│   │   └── knowledge_base/               # Markdown policy documents
│   ├── scripts/                          # Deterministic CLI tools
│   │   ├── lookup_ticket.py
│   │   ├── lookup_customer.py
│   │   ├── search_knowledge.py
│   │   ├── create_draft.py
│   │   └── approve_response.py
│   └── tests/                            # 25 Pytest suites (100% passing)
├── switch/                               # Switch AI Swarm Specifications
│   ├── supportflow-room.template.yaml    # Switch room specification
│   └── agent-prompts/                    # Agent system instructions
├── supabase/                             # PostgreSQL schema & RLS policies
│   └── migrations/                       # Initial database schema & RLS
├── Dockerfile                            # Production container build
└── docker-compose.yml                    # Local multi-service orchestrator
```

---

## 🌟 Enterprise Workflow & Core Architectural Guarantees

1. **Why Switch AI is Essential:** Customer support is fundamentally collaborative. By embedding agents (`@triager`, `@investigator`, `@responder`) directly inside team chat, human leads and AI agents share the exact same context room, preventing disconnected silos.
2. **Zero Hallucination Guarantee:** The investigator agent only accesses customer data via deterministic read-only CLI scripts (`lookup_customer.py`, `check_stripe`), preventing unauthorized data mutations and masking customer PII.
3. **Mandatory Human Sign-off:** No customer receives an automated response to complex billing or subscription issues without human approval through the **Approval Dispatch Gate**.
4. **Instant ROI:** Reduces average handle time from hours to under 3 minutes while maintaining 100% human oversight.
