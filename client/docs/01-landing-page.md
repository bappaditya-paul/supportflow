# Page Specification: 01 — Landing Page (`/`)

## 1. Overview
The public homepage communicates the core value proposition of SupportFlow: an autonomous, evidence-backed customer support desk living directly inside team chat (Mattermost, Slack, Discord) via Switch AI, governed by a human sign-off review gate.

---

## 2. Wireframe & Visual Layout

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo] SupportFlow    Features   Pricing   Docs   GitHub ★   [Sign In]  │ (Sticky Nav)
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                AI CUSTOMER SUPPORT IN YOUR TEAM CHAT                   │
│          Zero hallucinations. Deterministic tools. Human sign-off.     │
│                                                                        │
│        [Get Started Free ->]      [Watch 2-Min Demo]                   │
│        $ npm i @supportflow/react                                      │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ INTERACTIVE REPLAY: TKT-1001 Billing Desync Resolution             │ │ (Hero Widget)
│ │ Customer: "Paid for Pro, still Free"                               │ │
│ │   └─> @triager: Category BILLING, Urgency HIGH                     │ │
│ │   └─> @investigator: Stripe $49 SUCCEEDED vs DB free MISMATCH      │ │
│ │   └─> @responder: Grounded in Policy KB-001                        │ │
│ │   └─> Operator: [✓ Approve & Dispatch]                             │ │
│ └────────────────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│ │ Zero Hallucinate │  │ Live Ghost Type  │  │ Human Review Gate│       │ (Feature Grid)
│ │ Deterministic DB │  │ Read keystrokes  │  │ 1-click approval │       │
│ │ verification     │  │ before submit    │  │ dispatch         │       │
│ └──────────────────┘  └──────────────────┘  └──────────────────┘       │
├────────────────────────────────────────────────────────────────────────┤
│ Footer: Product · Docs · Community · Privacy · Terms                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Breakdown

| Component | Responsibility | Props / State |
| :--- | :--- | :--- |
| `TopBar` | Brand identity, anchor links, theme toggle, authentication button | `isSignedIn`, `onSignInClick` |
| `HeroSection` | High-impact headline, subhead, CTA buttons, copyable install snippet | `installCmd: "npm i @supportflow/react"` |
| `InteractiveReplayCard` | Simulated step-by-step playback of multi-agent triage and human approval | `stepIndex`, `isPlaying`, `onPlayToggle` |
| `FeatureCardsGrid` | 4-column utilitarian card grid highlighting architectural pillars | `features: FeatureItem[]` |
| `LiveMetricsBanner` | Real-time SLA counters: <15s triage, 0 hallucinated refunds, 100% human sign-off | Static counters with subtle heartbeat |
| `CallToActionSection` | Final conversion block with email input and GitHub repo link | `onSubscribe`, `repoUrl` |
| `Footer` | Site map, legal links, copyright, and Switch AI attribution | Static |

---

## 4. Key Interactions & Transitions
- **Copy Install Command:** Clicking the terminal pill copies `npm i @supportflow/react` to clipboard and shows "Copied!" checkmark.
- **Interactive Replay:** Clicking "Replay Flow" steps through the multi-agent execution timeline with pulsating agent avatars.
- **Call-to-Action:** Clicking "Get Started Free" redirects to `/signup`.
- **Sign In:** Redirects to `/login`.
