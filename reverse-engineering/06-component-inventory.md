# 06 — Reusable Component Inventory

This component inventory catalogues the core frontend UI components across the client widget library (`@cossistant/react`) and the operational dashboard (`apps/web`).

---

## 1. Customer Support Widget Components (`@cossistant/react`)

| Component Name | Purpose | Key Props | States & Variants | Key Interactions | Responsive Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `<Support />` | Root widget provider & viewport container | `websiteId: string`<br>`defaultOpen?: boolean`<br>`theme?: ThemeConfig`<br>`slots?: SlotOverrides` | • `closed` (floating bubble)<br>• `open` (docked chat window)<br>• `fullscreen` (mobile viewport) | Clicking trigger toggles visibility; handles ESC key to close. | Floating bottom-right on desktop; expands to 100vw × 100vh modal on mobile (`<640px`). |
| `<Trigger />` | Floating circular launcher button | `children?: ReactNode`<br>`unreadCount?: number` | • `default`<br>• `unreadBadge` (displays pulse count)<br>• `active` (turns into close 'X') | Clicking expands widget; plays subtle transition animation. | Stays pinned to viewport bottom-right (`bottom-6 right-6`). |
| `<HomePage />` | Widget initial screen | `onStartConversation: () => void`<br>`onOpenHistory: () => void` | • `loading`<br>• `hasPastConversations`<br>• `emptyHistory` | Start new chat CTA; search knowledge base; resume recent ticket. | Scrolls smoothly inside the widget container. |
| `<ConversationPage />` | Active chat room view | `conversationId: string`<br>`onBack: () => void` | • `streaming`<br>• `awaitingReply`<br>• `resolved`<br>• `agentTyping` | Scroll-to-bottom anchor; message sending; image zooming. | Auto-scrolls on new incoming token or message. |
| `<TimelineMessageItem />`| Renders individual message bubble | `item: TimelineItem`<br>`isViewer: boolean` | • `visitor` (right-aligned, black)<br>• `agent` (left-aligned, white)<br>• `operator` (left-aligned, with avatar) | Hover reveals timestamp and delivery status checkmarks. | Text wraps cleanly with responsive max-width (`80%`). |
| `<TimelineToolCard />` | Renders tool execution trace | `toolName: string`<br>`input: unknown`<br>`output: unknown`<br>`status: "running" \| "done"` | • `running` (pulsing indicator)<br>• `completed` (green check)<br>• `error` (amber alert) | Click to expand/collapse raw JSON execution details. | Monospace compact card formatting. |
| `<TypingIndicator />` | Displays agent/visitor typing status | `actorName?: string`<br>`isTyping: boolean` | • `hidden`<br>• `visible` (3 pulsing dots) | Plays subtle typing sound if user audio preferences enabled. | Rendered at base of message timeline. |
| `<MessageComposer />` | Text input with file upload | `onSend: (text: string, files?: File[]) => void`<br>`placeholder?: string` | • `empty`<br>• `hasText`<br>• `uploading`<br>• `disabled` | Enter to send, Shift+Enter for newline; drag-and-drop file attachment. | Multi-line auto-expand textarea. |

---

## 2. Operations Dashboard Components (`apps/web`)

| Component Name | Purpose | Key Props | States & Variants | Key Interactions | Responsive Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `<ConversationsList />` | Virtualized ticket list | `conversations: ConversationHeader[]`<br>`selectedId?: string`<br>`onSelect: (id: string) => void` | • `empty`<br>• `loadingSkeleton`<br>• `activeSelection`<br>• `hasUnread` | Arrow key up/down navigation; click to activate; sound notification. | Left pane in 3-column desktop layout; full-width on mobile with slide transition. |
| `<ConversationPane />` | Comprehensive thread viewer | `conversationId: string`<br>`websiteSlug: string` | • `loading`<br>• `error`<br>• `open`<br>• `resolved` | Mark resolved; mark spam; assign teammate; export conversation. | Fills central viewport with flex-1 auto layout. |
| `<ContactSheet />` | Drawer for visitor profile | `visitorId: string`<br>`open: boolean`<br>`onClose: () => void` | • `loading`<br>• `anonymous`<br>• `identified` (email + name) | Click email to copy; view GeoIP map coordinates; see past sessions. | Slides in from right screen edge (width `420px`). |
| `<AiAgentForm />` | AI agent instruction editor | `websiteSlug: string`<br>`initialConfig: AiAgentConfig` | • `pristine`<br>• `dirty`<br>• `saving`<br>• `testing` | Change model (OpenAI/Anthropic/OpenRouter); adjust temperature; edit prompt. | Full-page form with sticky save bar. |
| `<ApiKeysTable />` | Displays developer API keys | `keys: ApiKeyItem[]`<br>`onRevoke: (id: string) => void` | • `empty`<br>• `populated` | Copy key to clipboard (with Sonner toast); revoke key dialog. | Responsive table with horizontal scroll on small viewports. |
| `<AllowedDomainsForm />`| Configures CORS origins | `domains: string[]`<br>`onUpdate: (domains: string[]) => void` | • `valid`<br>• `invalidHostname` | Add new domain; delete domain; test domain match. | Clean tag-list input container. |

---

## 3. Shared Primitives & Utility Components (`components/ui`)

| Component Name | Underlying Technology | Variants / Features |
| :--- | :--- | :--- |
| `<Button />` | Radix UI Slot + Class Variance Authority | `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`. Sizes: `sm` (h-8), `md` (h-9), `lg` (h-10), `icon` (size-9). |
| `<Input />` | HTML5 input with CSS tokens | Standard, password with eye toggle, search with magnifying glass icon. |
| `<Dialog />` & `<Sheet />` | `@radix-ui/react-dialog` | Modal overlays, slide-out lateral sheets with backdrop blur. |
| `<DropdownMenu />` | `@radix-ui/react-dropdown-menu` | Filter selectors, status pickers, user profile menu. |
| `<Tabs />` | `@radix-ui/react-tabs` | Navigation switchers (e.g. Open / Resolved / Spam). |
| `<FacehashAvatar />` | Custom HTML5 SVG generator | Deterministic abstract avatar hash generated from visitor ID strings. |
| `<TiptapEditor />` | TipTap rich-text framework | Markdown shortcuts, bold/italic, code blocks, bullet lists, internal note mode. |

