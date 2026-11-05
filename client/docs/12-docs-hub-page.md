# Page Specification: 12 — Documentation Hub (`/docs`)

## 1. Overview
The Developer Documentation portal provides guides, copy-paste React snippets, API references, and Switch AI room setup templates for teams integrating SupportFlow into their applications.

---

## 2. Wireframe & Visual Layout

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo] SupportFlow    Features   Pricing   [Docs]   GitHub ★   [Sign In]│
├─────────────────────┬──────────────────────────────────────────────────┤
│ SIDEBAR NAVIGATION  │ GETTING STARTED: NEXT.JS & REACT INTEGRATION     │
│                     │                                                  │
│ Getting Started     │ Install the SupportFlow client package:          │
│ • Quickstart Guide  │                                                  │
│ • Installation      │ ```bash                                          │
│ • API Keys          │ pnpm add @supportflow/react                      │
│                     │ ```                                              │
│ Components          │                                                  │
│ • <SupportWidget /> │ Add the widget to your root layout:              │
│ • Customizing Theme │                                                  │
│ • Widget Hooks      │ ```tsx                                           │
│                     │ import { SupportWidget } from '@supportflow/react│
│ Switch AI Swarm     │                                                  │
│ • Room Templates    │ export default function Layout({ children }) {   │
│ • Custom Tools      │   return (                                       │
│ • Deterministic CLI │     <html>                                       │
│                     │       <body>                                     │
│ API Reference       │         {children}                               │
│ • REST Endpoints    │         <SupportWidget apiKey="pk_live_123" />   │
│ • WebSocket Protocol│       </body>                                    │
│                     │     </html>                                      │
│                     │   );                                             │
│                     │ }                                                │
│                     │ ```                                              │
└─────────────────────┴──────────────────────────────────────────────────┘
```

---

## 3. Component Breakdown

| Component | Responsibility | Props / State |
| :--- | :--- | :--- |
| `DocsSidebar` | Multi-tier navigation tree (Getting Started, Components, Switch AI, API Reference) | `currentSlug`, `tree` |
| `MdxContentRenderer` | Formatted technical documentation with syntax highlighting and copy buttons | `content: string` |
| `CodeSnippetBlock` | Utilitarian code block with package manager tabs (`npm`, `pnpm`, `yarn`, `bun`) | `tabs`, `activeTab` |
| `DocsSearchModal` | Cmd+K fuzzy search modal for instant keyword lookups | `isOpen`, `onClose` |

---

## 4. Key Topics Documented
- **Quickstart:** Adding `<SupportWidget />` to Next.js App Router and Vite React SPAs.
- **Switch Room Setup:** Importing `server/switch/supportflow-room.template.yaml` into Switch Console.
- **Deterministic Tools:** Writing read-only Python scripts that prevent AI hallucinations.
- **WebSocket Specs:** Connecting to the real-time ghost typing and event stream.

