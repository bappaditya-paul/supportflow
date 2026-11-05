# Page Specification: 10 — Settings Page (`/dashboard/settings`)

## 1. Overview
The Settings Page manages infrastructure connections, chat bridges, API keys, and workspace governance preferences.

---

## 2. Wireframe & Visual Layout

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Sidebar]   WORKSPACE & INTEGRATION SETTINGS                           │
│                                                                        │
│ [General]  [Chat Bridges]  [Switch AI]  [API Keys]  [Team & Roles]    │
├────────────────────────────────────────────────────────────────────────┤
│ SWITCH AI SERVER CONFIGURATION                                         │
│                                                                        │
│ Bridge Server URL                                                      │
│ [ http://localhost:34079/api/v1/bridge                              ]  │
│ Status: Connected · Latency: 12ms                                      │
│                                                                        │
│ Target Mattermost Channel                                              │
│ [ #cloud-support                                                    ]  │
│ Channel ID: ch-supportflow-99                                          │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ HUMAN GOVERNANCE THRESHOLDS                                            │
│                                                                        │
│ [x] Require Human Sign-Off for all Billing Changes                     │
│ [x] Mask Customer PII (Email & Credit Card) before Tool Calls          │
│ [ ] Auto-dispatch resolutions if Confidence Score > 98% (Disabled)     │
│                                                                        │
│ [ Save Changes ]                                                       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Breakdown

| Component | Responsibility | Props / State |
| :--- | :--- | :--- |
| `SettingsNav` | Sub-navigation tabs (General, Chat Bridges, Switch AI, API Keys, Team) | `activeTab`, `onSelectTab` |
| `SwitchConfigCard` | Server URL, port mapping, bridge health indicator | `config`, `onChange` |
| `ChatBridgeCard` | Webhook URL, bot token, and Mattermost channel target | `bridgeSettings`, `onTestConnection` |
| `GovernanceToggles` | Checkbox toggles enforcing PII masking and mandatory human approval | `policies`, `onToggle` |
| `ApiKeyManager` | Create and revoke publishable (`pk_*`) and secret (`sk_*`) keys | `keys: ApiKey[]`, `onGenerate` |

---

## 4. Key Interactions & Transitions
- **Test Connection:** Pings `http://localhost:34079/health` and displays live ping response time.
- **Toggle Governance:** Saving immediately enforces security checks across the FastAPI backend.
- **Copy API Key:** Clicking key field copies token to clipboard securely.

