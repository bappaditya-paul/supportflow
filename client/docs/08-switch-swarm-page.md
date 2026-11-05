# Page Specification: 08 — Switch AI Swarm Studio (`/dashboard/agents`)

## 1. Overview
The Switch Swarm Studio provides real-time observability, prompt inspection, and connectivity controls for the autonomous multi-agent support team operating inside Mattermost via the Switch AI server.

---

## 2. Wireframe & Visual Layout

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Sidebar]   SWITCH AI SWARM STUDIO                                     │
│             Live telemetry for multi-agent support room in Mattermost  │
│                                                                        │
│ Server: localhost:34079 [ONLINE] · Bridge: Mattermost · Channel: #cloud│
├────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐ │
│ │ @triager             │ │ @investigator        │ │ @responder       │ │
│ │ [ACTIVE]             │ │ [ACTIVE]             │ │ [ACTIVE]         │ │
│ │                      │ │                      │ │                  │ │
│ │ Role: Classification │ │ Role: Deterministic  │ │ Role: Policy     │ │
│ │ & Urgency Ranking    │ │ Data Verification    │ │ Grounded Drafts  │ │
│ │                      │ │                      │ │                  │ │
│ │ Provider: Switch     │ │ Tools Executed:      │ │ Grounding:       │ │
│ │ Model: Codex         │ │ • lookup_customer.py │ │ • Policy KB-001  │ │
│ │                      │ │ • check_stripe.py    │ │ • Policy KB-002  │ │
│ │ Current: IDLE        │ │ Current: IDLE        │ │ Gate: Human Sign │ │
│ │                      │ │                      │ │ Current: IDLE    │ │
│ │ [View Prompt ->]     │ │ [View Tool Config ->]│ │ [View Policies ->│ │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ LIVE EVENT STREAM (SSE from Switch Server localhost:34079)             │
│ [14:22:10] @triager joined #cloud-support room                          │
│ [14:22:11] @investigator connected deterministic tool bridge           │
│ [14:22:12] @responder initialized with Policy KB-001 & KB-002          │
│ [14:22:15] Incoming ticket TKT-1001 delegated to @investigator         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Breakdown

| Component | Responsibility | Props / State |
| :--- | :--- | :--- |
| `SwarmStatusBar` | Server port indicator, Mattermost bridge state, SSE health | `serverStatus`, `bridgeUrl` |
| `AgentCard` | Persona card detailing role, provider, tools, and current execution state | `agent: SwitchAgentState` |
| `LiveSseEventLog` | Terminal-style chronological event log streamed from Switch Server | `events: SwitchEvent[]` |
| `PromptInspectorModal` | Inspects system instructions loaded from `server/switch/agent-prompts/` | `selectedAgent`, `isOpen` |

---

## 4. Key Interactions & Transitions
- **Agent Status Indicator:** Flashes amber during analysis, green when idle/ready, and red on tool failure.
- **Inspect Prompts:** Opens modal displaying the exact system instructions and addressing rules (`addressing: anyone`).
- **Restart Room:** Button to trigger Switch bridge reload if needed.
