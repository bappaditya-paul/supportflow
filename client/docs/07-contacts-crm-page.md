# Page Specification: 07 — Customer CRM (`/dashboard/contacts`)

## 1. Overview
The Customer Directory provides support leads and operators with a complete audit trail of customer accounts, comparing application database plans against payment gateway (Stripe) records to immediately expose billing discrepancies.

---

## 2. Wireframe & Visual Layout

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Sidebar]   CUSTOMER CRM & ENTITLEMENT AUDITOR                         │
│             Verify user plan status against payment records            │
│                                                                        │
│ [Search by name, email, or customer ID...                        ]     │
├────────────────────────────────────────────────────────────────────────┤
│ CUSTOMER ID  NAME          EMAIL                  DB PLAN  STRIPE  SYNC│
│ CUST-001     Alex Rivera   alex@example.com       free     pro     [!] │
│ CUST-002     Sarah Chen    sarah.chen@techcorp.io enterpr. enterpr. [✓]│
│ CUST-003     Marcus Vance  m.vance@startup.co     free     free    [✓]│
│ CUST-004     Elena Rostova elena@acmelabs.ai      pro      pro     [✓]│
├────────────────────────────────────────────────────────────────────────┤
│ DRAWER (When CUST-001 is clicked):                                     │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Customer: Alex Rivera (alex@example.com)                           │ │
│ │ Status: BILLING DISCREPANCY DETECTED                               │ │
│ │ Stripe Transaction: TXN-9001 ($49.00 USD on Nov 4, 2026)           │ │
│ │ Internal Postgres Record: plan="free" (Desynced)                   │ │
│ │ Action: [Force Sync Database to Pro]  [Open Stripe Dashboard ->]   │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Breakdown

| Component | Responsibility | Props / State |
| :--- | :--- | :--- |
| `ContactsHeader` | Page title, customer count, and CSV export trigger | `totalCount: number` |
| `ContactsFilterBar` | Search input, plan filter dropdown (Free, Pro, Enterprise, Discrepancies) | `searchQuery`, `planFilter` |
| `CustomerDataTable` | Tabular display of customers with colored status badges | `customers: Customer[]`, `onSelectCustomer` |
| `CustomerDetailDrawer` | Slide-out panel with detailed billing history and manual sync button | `customer: Customer`, `onForceSync` |

---

## 4. Key Interactions & Transitions
- **Search Filtering:** Instant client-side fuzzy search across IDs, names, and emails.
- **Discrepancy Tag:** Customers with mismatched tiers flash a soft amber/red warning pill.
- **Force Sync Action:** Calls backend service to immediately update user's database role and clears the discrepancy tag.
