# Page Specification: 02 — Pricing Page (`/pricing`)

## 1. Overview
The Pricing Page presents transparent, developer-first pricing tiers for SupportFlow. Emphasizes the open-source self-hosted tier vs. managed cloud with Switch AI infrastructure.

---

## 2. Wireframe & Visual Layout

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo] SupportFlow    Features   [Pricing]   Docs   GitHub ★   [Sign In]│
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                      SIMPLE, TRANSPARENT PRICING                       │
│             Self-host for free or deploy with managed Switch AI        │
│                                                                        │
│                    [ Monthly ]  (•) Annual (Save 20%)                  │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐   │
│ │ COMMUNITY (OSS)    │ │ PRO (MOST POPULAR) │ │ ENTERPRISE         │   │
│ │ $0 / month         │ │ $49 / month        │ │ Custom             │   │
│ │                    │ │                    │ │                    │   │
│ │ • Self-hosted      │ │ • Hosted Switch    │ │ • Dedicated Matter-│   │
│ │ • 1 Agent Room     │ │ • 3 AI Agents      │ │   most Cluster     │   │
│ │ • SQLite Storage   │ │ • Live Ghost Type  │ │ • Custom DB Tools  │   │
│ │ • Community Slack  │ │ • Human Sign-off   │ │ • 99.99% SLA       │   │
│ │                    │ │ • Priority Support │ │ • SAML 2.0 / SSO   │   │
│ │ [Deploy OSS ->]    │ │ [Start 14-Day Pro] │ │ [Contact Sales ->] │   │
│ └────────────────────┘ └────────────────────┘ └────────────────────┘   │
├────────────────────────────────────────────────────────────────────────┤
│ FEATURE COMPARISON TABLE                                               │
│ Feature                     Community      Pro          Enterprise     │
│ Switch AI Multi-Agent       Yes            Yes          Yes            │
│ Deterministic CLI Tools     Yes            Yes          Yes            │
│ Live Keystroke Ghost Typing No             Yes          Yes            │
│ Human Sign-off Gate         Manual CLI     Web Cockpit  Web + Mobile   │
├────────────────────────────────────────────────────────────────────────┤
│ FREQUENTLY ASKED QUESTIONS (Accordion Disclosures)                     │
│ [+] Can I run this completely offline in Docker?                       │
│ [+] How does Switch AI connect to Mattermost without API key leaks?    │
│ [+] What happens if an agent suggests a refund without approval?       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Breakdown

| Component | Responsibility | Props / State |
| :--- | :--- | :--- |
| `BillingCycleToggle` | Toggles between monthly and annual billed rates | `isAnnual: boolean`, `onToggle: () => void` |
| `PricingCard` | Tier price, feature list, highlighted border (Pro tier), CTA button | `tier: TierData`, `isAnnual: boolean` |
| `FeatureComparisonTable` | Granular table comparing all platform capabilities across tiers | `features: FeatureMatrixRow[]` |
| `FaqAccordion` | Accessible collapsible FAQ items | `items: FaqItem[]`, `expandedId: string` |
| `EnterpriseContactCta` | Contact banner for custom team chat installations | `onContactSales` |

---

## 4. Key Interactions & Transitions
- **Annual/Monthly Toggle:** Smooth transition animating the price amount and displaying "-20% Applied".
- **Tier Selection:**
  - Community: Redirects to GitHub README Quickstart.
  - Pro: Redirects to `/signup?plan=pro`.
  - Enterprise: Opens modal or mailto trigger.
- **Accordion:** Smooth height transition revealing policy details.

