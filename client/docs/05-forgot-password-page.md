# Page Specification: 05 — Forgot & Reset Password (`/forgot-password`)

## 1. Overview
The password recovery page allows users to securely reset their credentials via an authenticated magic reset link.

---

## 2. Wireframe & Visual Layout

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo] SupportFlow                                     [Back to Login] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                      RESET YOUR OPERATOR PASSWORD                      │
│      Enter your work email address to receive a secure recovery link   │
│                                                                        │
│                    ┌──────────────────────────────┐                    │
│                    │ Work Email Address           │                    │
│                    │ [ operator@company.com     ] │                    │
│                    │                              │                    │
│                    │ [ Send Recovery Email -> ]   │                    │
│                    └──────────────────────────────┘                    │
│                                                                        │
│                  Remember your password? [Back to Sign In]             │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ CONFIRMATION STATE (After submit):                                     │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ ✓ Check your inbox                                                 │ │
│ │ We've sent a password reset link to operator@company.com.           │ │
│ │ The link expires in 15 minutes.                                    │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Breakdown

| Component | Responsibility | Props / State |
| :--- | :--- | :--- |
| `RecoveryForm` | Single input email form with rate limiting guard | `email`, `onSubmit`, `loading` |
| `ConfirmationCard` | Success state with resend button and timer countdown | `email`, `onResend`, `canResend` |
| `SecurityNotice` | Brief explanation of cryptographic token expiration (15 mins) | Static |

---

## 4. Key Interactions & Transitions
- **Submission:** Dispatches request to `/api/auth/forgot-password`.
- **View Swap:** In-place animated transition from input form to confirmation banner.
- **Resend Action:** Debounced 60-second cooldown timer before allowing another email dispatch.

