# Page Specification: 04 — Sign Up Page (`/signup`)

## 1. Overview
The Registration page allows new companies, support leads, and developers to create a SupportFlow workspace and configure their primary team chat bridge (Mattermost, Slack, Discord).

---

## 2. Wireframe & Visual Layout

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo] SupportFlow                                     [Back to Home]  │
├──────────────────────────────────┬─────────────────────────────────────┤
│                                  │                                     │
│  CREATE YOUR WORKSPACE           │  WHY SUPPORTFLOW?                   │
│  Set up multi-agent support      │                                     │
│                                  │  ✓ Deploy in under 3 minutes        │
│  Full Name                       │  ✓ Agents run inside your chat      │
│  [ Alex Rivera                 ] │  ✓ Human sign-off on every response │
│                                  │  ✓ Zero PII exposed to external AI  │
│  Work Email                      │                                     │
│  [ alex@clouddesk.dev          ] │  "SupportFlow reduced our billing   │
│                                  │   resolution time from 4 hours to   │
│  Workspace Subdomain             │   90 seconds."                      │
│  [ clouddesk   ].supportflow.ai  │   — Engineering Lead, TechCorp      │
│                                  │                                     │
│  Choose Team Chat Bridge         │                                     │
│  (•) Mattermost  ( ) Slack  ( )  │                                     │
│                                  │                                     │
│  Password                        │                                     │
│  [ ••••••••••••••••••          ] │                                     │
│                                  │                                     │
│  [ Create Workspace & Team -> ]  │                                     │
│                                  │                                     │
│  Already have an account? Sign in│                                     │
└──────────────────────────────────┴─────────────────────────────────────┘
```

---

## 3. Component Breakdown

| Component | Responsibility | Props / State |
| :--- | :--- | :--- |
| `SignupHeader` | Branding and navigation link back to `/` | Static |
| `SignupForm` | Multi-field registration form with live slug availability check | `formData`, `onChange`, `onSubmit` |
| `ChatBridgeSelector` | Radio card group to select chat backend (Mattermost, Slack, Discord) | `selectedBridge`, `onSelectBridge` |
| `SubdomainInput` | Live formatted input showing `.supportflow.ai` suffix with availability indicator | `subdomain`, `isAvailable` |
| `SocialProofTestimonial` | Customer testimonial and security assurance badges on right panel | Static |

---

## 4. Key Interactions & Transitions
- **Subdomain Check:** Live debounced check verifying slug availability (`clouddesk.supportflow.ai`).
- **Bridge Selection:** Changes setup hints (e.g. prompts for Mattermost webhook URL or Switch Docker container).
- **Form Submission:** Generates user account, provisions initial workspace, and redirects to `/dashboard/inbox`.
