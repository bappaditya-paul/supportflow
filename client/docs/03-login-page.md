# Page Specification: 03 — Login Page (`/login`)

## 1. Overview
The Sign In page provides access for human support operators, team leads, and administrators. It features social OAuth buttons and magic email links, paired with a live terminal simulation on the right.

---

## 2. Wireframe & Visual Layout

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo] SupportFlow                                     [Back to Home]  │
├──────────────────────────────────┬─────────────────────────────────────┤
│                                  │                                     │
│  WELCOME BACK                    │  SWITCH AGENT TELEMETRY (LIVE)      │
│  Sign in to your operator desk   │                                     │
│                                  │  [terminal session: localhost:34079]│
│  [ Sign in with GitHub     ]     │  $ switch connect --room #support   │
│  [ Sign in with Google     ]     │  ✓ Connected to Mattermost channel  │
│                                  │  ✓ Loaded @triager [classifier]     │
│  ────────── or email ──────────  │  ✓ Loaded @investigator [db tools]  │
│                                  │  ✓ Loaded @responder [drafting]     │
│  Work Email                      │  ⚡ Ready for incoming tickets...    │
│  [ operator@company.com        ] │                                     │
│                                  │                                     │
│  Password           [Forgot?]    │                                     │
│  [ ••••••••••••••••••          ] │                                     │
│                                  │                                     │
│  [ Sign In to Workspace -> ]     │                                     │
│                                  │                                     │
│  Don't have an account? Sign up  │                                     │
└──────────────────────────────────┴─────────────────────────────────────┘
```

---

## 3. Component Breakdown

| Component | Responsibility | Props / State |
| :--- | :--- | :--- |
| `AuthHeader` | Brand badge and return-to-home link | Static |
| `SocialAuthButtons` | GitHub and Google OAuth 2.0 triggers | `onOAuthClick: (provider: string) => void` |
| `LoginForm` | Email and password inputs with field validation and submit handler | `onSubmit`, `loading`, `error` |
| `LiveTerminalPreview` | Simulated CLI readout of Switch server connectivity and agent readiness | Animated monospace stream |
| `AuthFooterLinks` | Links to `/signup` and `/forgot-password` | Static |

---

## 4. State & Form Validation
- **Email Validation:** Checks for standard email pattern (`operator@domain.com`).
- **Password Validation:** Minimum 8 characters.
- **Loading State:** Button disables, displays spinner and text "Authenticating...".
- **Error State:** Red hairline banner above inputs with clear error description.
- **Success Transition:** Redirects directly to `/dashboard/inbox`.
