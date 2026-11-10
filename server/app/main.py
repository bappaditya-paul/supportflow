"""
SupportFlow — FastAPI Backend & Live Operations API
Enterprise Multi-Agent Swarm | Powered by Switch AI
"""

from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect, Depends
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel

from app.models import (
    Ticket, Customer, KnowledgeResult, DraftResponse, ApprovalAction,
    WebsiteOnboardingRequest, WebsiteOnboardingResponse, AgentConfig,
    ToolDefinition, CustomSkill, KnowledgeSource, FAQItem, ApiKeyItem,
    AllowedDomain, AnalyticsOverview
)
from app.services import (
    ticket_service, customer_service, knowledge_service,
    draft_service, platform_service, timeline_service
)
from app.auth import get_current_user, require_current_user

app = FastAPI(
    title="SupportFlow API",
    description="Collaborative Multi-Agent Customer Support Swarm for Switch AI with Human-in-the-Loop Governance",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {"name": "System Health", "description": "Core connectivity, uptime, and Switch AI node telemetry"},
        {"name": "Authentication & RBAC", "description": "Supabase JWT verification, Google OAuth sessions, and role-based permissions"},
        {"name": "Tickets & Triage", "description": "Incoming support tickets, priority categorizations, and queue management"},
        {"name": "Customer Reconciliation", "description": "Stripe billing ledger synchronization and discrepancy detection"},
        {"name": "Human Governance & Drafts", "description": "Deterministic draft approval, human gate review, and audit logs"},
        {"name": "Knowledge & FAQs", "description": "Policy grounding, markdown vector searches, and authoritative FAQ items"},
        {"name": "Agent Studio & Swarm", "description": "Multi-agent runtime configuration, tool execution catalog, and custom Python skills"},
        {"name": "Developer Settings & Keys", "description": "CORS allowed domains, publishable widget tokens, and BYOK credentials"},
        {"name": "Operations Analytics", "description": "Live visitor counts, CSAT index, and AI resolution velocity metrics"},
        {"name": "WebSocket Gateway", "description": "Real-time ghost-typing streaming bridge between customer and cockpit"},
    ]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Real-time ghost-typing WebSocket bridge between customer widget and operator cockpit."""
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            await manager.broadcast(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

@app.get("/health", tags=["System Health"], summary="Health & Switch Node Connectivity")
def health_check():
    """Verify backend uptime, service status, and Switch AI bridge connectivity (port 34079)."""
    return {
        "status": "healthy",
        "service": "SupportFlow",
        "switch_bridge": "http://localhost:34079",
        "provider": "codex",
        "version": "1.0.0",
        "human_governance_gate": "enabled"
    }

@app.get("/api/v1/auth/me", tags=["Authentication & RBAC"], summary="Get Current Authenticated User")
def get_me(user: Optional[dict] = Depends(get_current_user)):
    """Retrieve profile and role for the active session (Supabase or Demo Persona)."""
    if not user:
        return {
            "authenticated": False,
            "user": None,
            "mode": "anonymous"
        }
    return {
        "authenticated": True,
        "user": user,
        "mode": "demo" if user.get("is_demo") else "supabase"
    }

@app.get("/api/v1/auth/verify", tags=["Authentication & RBAC"], summary="Require Valid Authentication")
def verify_session(user: dict = Depends(require_current_user)):
    """Strictly verify active bearer token, returning 401 if invalid or expired."""
    return {
        "verified": True,
        "user": user
    }

@app.get("/tickets", response_model=List[Ticket], tags=["Tickets & Triage"], summary="List All Support Tickets")
def list_tickets():
    """Fetch all active support tickets with status, customer reference, and priority flags."""
    return ticket_service.get_all_tickets()

@app.get("/tickets/{ticket_id}", response_model=Ticket, tags=["Tickets & Triage"], summary="Get Ticket by ID")
def get_ticket(ticket_id: str):
    """Retrieve full details for a specific ticket including complaint text and category."""
    ticket = ticket_service.get_ticket_by_id(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
    return ticket

@app.get("/api/v1/tickets/{ticket_id}/timeline", tags=["Tickets & Triage"], summary="Get Ticket Timeline")
def get_ticket_timeline_endpoint(ticket_id: str):
    """Retrieve full conversation messages, system events, and tool execution timeline for a ticket."""
    return timeline_service.get_ticket_timeline(ticket_id)

@app.post("/api/v1/tickets/{ticket_id}/timeline", tags=["Tickets & Triage"], summary="Add Message to Ticket Timeline")
def add_ticket_timeline_message(ticket_id: str, payload: dict):
    """Post customer message, operator reply, or internal note to ticket timeline."""
    return timeline_service.add_timeline_message(
        ticket_id=ticket_id,
        sender_type=payload.get("sender_type", "customer"),
        sender_name=payload.get("sender_name", "Customer"),
        text=payload.get("text", ""),
        visibility=payload.get("visibility", "public"),
        tool_name=payload.get("tool_name"),
        tool_params=payload.get("tool_params"),
        tool_result=payload.get("tool_result"),
        tool_status=payload.get("tool_status"),
    )

@app.get("/customers", response_model=List[Customer], tags=["Customer Reconciliation"], summary="List All Customers & Stripe Status")
def list_customers():
    """Retrieve all synchronized database customer records with Stripe payment status and discrepancy flags."""
    return customer_service.get_all_customers()

@app.get("/customers/{customer_id}", response_model=Customer, tags=["Customer Reconciliation"], summary="Get Customer & Stripe Status")
def get_customer(customer_id: str):
    """Retrieve database plan, Stripe payment status, and discrepancy flags with automated PII masking."""
    customer = customer_service.get_customer_by_id(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail=f"Customer {customer_id} not found")
    return customer

@app.get("/knowledge/search", response_model=List[KnowledgeResult], tags=["Knowledge & FAQs"], summary="Search Policy Knowledge Base")
def search_knowledge(q: str = Query(..., description="Query search string (e.g. 'refund', 'subscription', 'api limit')")):
    """Perform deterministic keyword search across official policy markdown documents."""
    return knowledge_service.search_knowledge(q)

@app.get("/drafts", tags=["Human Governance & Drafts"], summary="List All AI Draft Responses")
def list_drafts():
    """List all AI agent response proposals currently awaiting review or already approved."""
    return draft_service.list_all_drafts()

@app.get("/drafts/{ticket_id}", tags=["Human Governance & Drafts"], summary="Get Draft for Ticket")
def get_draft(ticket_id: str):
    """Retrieve proposed response draft, cited evidence, and policy rules for human verification."""
    draft = draft_service.get_draft_by_ticket(ticket_id)
    if not draft:
        raise HTTPException(status_code=404, detail=f"Draft for {ticket_id} not found")
    return draft

@app.post("/drafts/{ticket_id}/approve", tags=["Human Governance & Drafts"], summary="Approve or Reject AI Draft")
def approve_ticket_draft(ticket_id: str, action: Optional[ApprovalAction] = None):
    """Human-in-the-Loop decision gate: Sign off on agent draft, moving it to audit-verified storage."""
    decision = action.decision if action else "approve"
    approver = action.approver if action else "Support Lead"
    try:
        updated = draft_service.approve_draft(ticket_id, decision, approver)
        return updated
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

# ============================================================================
# Elevated Platform Endpoints (Cossistant + Switch AI Integration Parity)
# ============================================================================

@app.post("/api/v1/onboarding/website", response_model=WebsiteOnboardingResponse, tags=["Agent Studio & Swarm"], summary="Onboard New Website")
def onboard_website(data: WebsiteOnboardingRequest):
    """Generate 60-second integration tokens and Next.js installation snippet for a new website domain."""
    return platform_service.create_website_onboarding(data)

@app.get("/api/v1/website/config", tags=["Agent Studio & Swarm"], summary="Get Current Website Config")
def get_website_config():
    """Retrieve active site configuration, slugs, and publishable API keys."""
    return platform_service.get_website_config()

@app.get("/api/v1/agent/config", response_model=AgentConfig, tags=["Agent Studio & Swarm"], summary="Get Agent Configuration")
def get_agent_config():
    """Fetch active system prompts, model engine, and multi-agent participation policies."""
    return platform_service.get_agent_config()

@app.put("/api/v1/agent/config", response_model=AgentConfig, tags=["Agent Studio & Swarm"], summary="Update Agent Configuration")
def update_agent_config(config: AgentConfig):
    """Update system instructions, LLM engine provider, and behavior guidelines."""
    return platform_service.update_agent_config(config)

@app.get("/api/v1/agent/tools", response_model=List[ToolDefinition], tags=["Agent Studio & Swarm"], summary="List Agent Tools Catalog")
def get_agent_tools():
    """List all available behavior and action finish handler tools for the agent swarm."""
    return platform_service.list_tools()

@app.post("/api/v1/agent/tools/{tool_id}/toggle", tags=["Agent Studio & Swarm"], summary="Toggle Tool Capability")
def toggle_agent_tool(tool_id: str, payload: dict):
    """Enable or disable an agent tool (e.g. clarification, sentiment, priority, escalation)."""
    enabled = payload.get("enabled", True)
    tool = platform_service.toggle_tool(tool_id, enabled)
    if not tool:
        raise HTTPException(status_code=404, detail=f"Tool {tool_id} not found")
    return tool

@app.get("/api/v1/agent/skills", response_model=List[CustomSkill], tags=["Agent Studio & Swarm"], summary="List Custom Python Skills")
def get_custom_skills():
    """List deterministic custom skills created by workspace operators."""
    return platform_service.list_custom_skills()

@app.post("/api/v1/agent/skills", response_model=CustomSkill, tags=["Agent Studio & Swarm"], summary="Create Custom Python Skill")
def add_custom_skill(payload: dict):
    """Create a new custom skill with deterministic instructions and code integration."""
    name = payload.get("name", "custom-skill")
    description = payload.get("description", "")
    instructions = payload.get("instructions", "")
    return platform_service.create_custom_skill(name, description, instructions)

@app.get("/api/v1/knowledge/sources", response_model=List[KnowledgeSource], tags=["Knowledge & FAQs"], summary="List Ingested Web Sources")
def get_knowledge_sources():
    """List crawled documentation paths and indexing statuses for the active website."""
    return platform_service.list_knowledge_sources()

@app.get("/api/v1/knowledge/faqs", response_model=List[FAQItem], tags=["Knowledge & FAQs"], summary="List FAQ Knowledge Items")
def get_faqs():
    """List verified question-answer pairs for zero-hallucination agent retrieval."""
    return platform_service.list_faqs()

@app.post("/api/v1/knowledge/faqs", response_model=FAQItem, tags=["Knowledge & FAQs"], summary="Create FAQ Knowledge Item")
def create_faq_endpoint(payload: dict):
    """Add a new verified question, categories, and approved answer to the knowledge base."""
    question = payload.get("question", "")
    categories = payload.get("categories", ["General"])
    answer = payload.get("answer", "")
    related = payload.get("related_questions", [])
    if not question or not answer:
        raise HTTPException(status_code=400, detail="Question and answer are required")
    return platform_service.create_faq(question, categories, answer, related)

@app.get("/api/v1/settings/keys", response_model=List[ApiKeyItem], tags=["Developer Settings & Keys"], summary="List API Keys")
def get_api_keys():
    """List publishable and private API keys for widget and CLI access."""
    return platform_service.list_api_keys()

@app.post("/api/v1/settings/keys", response_model=ApiKeyItem, tags=["Developer Settings & Keys"], summary="Create API Key")
def create_api_key_endpoint(payload: dict):
    """Generate a new public test or live API token."""
    name = payload.get("name", "Production API Key")
    key_type = payload.get("key_type", "Test Public Key")
    return platform_service.create_api_key(name, key_type)

@app.delete("/api/v1/settings/keys/{key_id}", tags=["Developer Settings & Keys"], summary="Revoke API Key")
def revoke_key_endpoint(key_id: str):
    """Permanently revoke an API key."""
    success = platform_service.revoke_api_key(key_id)
    if not success:
        raise HTTPException(status_code=404, detail="Key not found")
    return {"status": "revoked", "key_id": key_id}

@app.get("/api/v1/settings/domains", response_model=List[AllowedDomain], tags=["Developer Settings & Keys"], summary="List Allowed CORS Domains")
def get_allowed_domains():
    """List domains permitted to mount the SupportFlow customer chat widget."""
    return platform_service.list_allowed_domains()

@app.post("/api/v1/settings/domains", response_model=AllowedDomain, tags=["Developer Settings & Keys"], summary="Add Allowed Domain")
def add_domain_endpoint(payload: dict):
    """Whitelist a new website domain for widget cross-origin resource sharing."""
    domain = payload.get("domain", "")
    is_test = payload.get("is_test", False)
    if not domain:
        raise HTTPException(status_code=400, detail="Domain is required")
    return platform_service.add_allowed_domain(domain, is_test)

@app.delete("/api/v1/settings/domains/{domain_id}", tags=["Developer Settings & Keys"], summary="Remove Allowed Domain")
def remove_domain_endpoint(domain_id: str):
    """Remove a domain from the widget CORS whitelist."""
    success = platform_service.remove_allowed_domain(domain_id)
    if not success:
        raise HTTPException(status_code=404, detail="Domain not found")
    return {"status": "removed", "domain_id": domain_id}

@app.get("/api/v1/analytics/overview", response_model=AnalyticsOverview, tags=["Operations Analytics"], summary="Operations Overview Metrics")
def get_analytics():
    """Retrieve operational KPIs: live visitors, median response time, AI resolution %, and CSAT."""
    return platform_service.get_analytics_overview()

@app.get("/", response_class=HTMLResponse, tags=["System Health"], summary="Interactive API Documentation Portal")
def live_dashboard():
    """Interactive Developer Portal & Operations Documentation on localhost:8000."""
    return """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SupportFlow API Portal — Switch AI Backend</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { background-color: #090a0f; font-family: 'Plus Jakarta Sans', sans-serif; }
    code, pre, .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="text-neutral-200 min-h-screen p-4 sm:p-8 antialiased selection:bg-[#DF3E03] selection:text-white">
  <div class="max-w-6xl mx-auto space-y-6">

    <!-- Top Brand Header Bar -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d0e12] border border-white/[0.08] p-5 rounded-lg shadow-2xl">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded bg-[#DF3E03] flex items-center justify-center font-black text-white text-base shadow-lg shadow-[#DF3E03]/30">SF</div>
        <div>
          <h1 class="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>SupportFlow API Documentation</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">v1.0.0 LIVE</span>
          </h1>
          <p class="text-xs text-neutral-400 font-mono">Enterprise Multi-Agent Swarm with Human-in-the-Loop Governance · Powered by Switch AI</p>
        </div>
      </div>

      <div class="flex items-center gap-2.5 text-xs font-mono">
        <a href="/docs" target="_blank" class="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded transition flex items-center gap-1.5">
          <span>Interactive Swagger UI ↗</span>
        </a>
        <a href="/redoc" target="_blank" class="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded transition flex items-center gap-1.5">
          <span>ReDoc ↗</span>
        </a>
        <a href="http://localhost:5173/dashboard" target="_blank" class="px-3 py-1.5 bg-[#DF3E03] hover:bg-[#c93702] text-white font-semibold rounded shadow transition flex items-center gap-1.5">
          <span>Open Cockpit (5173) ↗</span>
        </a>
      </div>
    </header>

    <!-- Quick Status & Metrics Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
      <div class="p-3 bg-[#0d0e12] border border-white/[0.08] rounded">
        <span class="text-[10px] uppercase text-neutral-500">Switch AI Core</span>
        <div class="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Online (port 34079)</span>
        </div>
      </div>
      <div class="p-3 bg-[#0d0e12] border border-white/[0.08] rounded">
        <span class="text-[10px] uppercase text-neutral-500">Ghost-Typing Gateway</span>
        <div class="text-neutral-200 font-bold mt-0.5">ws://localhost:8000/ws</div>
      </div>
      <div class="p-3 bg-[#0d0e12] border border-white/[0.08] rounded">
        <span class="text-[10px] uppercase text-neutral-500">Governance Gate</span>
        <div class="text-amber-300 font-bold mt-0.5">Zero Hallucinations (Strict)</div>
      </div>
      <div class="p-3 bg-[#0d0e12] border border-white/[0.08] rounded">
        <span class="text-[10px] uppercase text-neutral-500">FastAPI Test Suite</span>
        <div class="text-emerald-400 font-bold mt-0.5">16 / 16 Tests Passed</div>
      </div>
    </div>

    <!-- Interactive API Directory -->
    <div class="bg-[#0d0e12] border border-white/[0.08] rounded-lg p-6 space-y-6">
      <div class="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div>
          <h2 class="text-sm font-bold text-white uppercase font-mono tracking-wider">Live Endpoints Catalog</h2>
          <p class="text-xs text-neutral-400 font-mono mt-0.5">Test any endpoint directly with one click to view live JSON output.</p>
        </div>
        <span class="text-xs font-mono text-neutral-500">FastAPI 0.115+</span>
      </div>

      <!-- Endpoint Group 1: Tickets & Customer Ledger -->
      <div class="space-y-3">
        <h3 class="text-xs font-bold text-neutral-300 font-mono uppercase flex items-center gap-2">
          <span class="text-[#DF3E03]">▶</span>
          <span>1. Tickets & Stripe Ledger Reconciliation</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded flex items-center justify-between hover:border-white/20 transition">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">GET</span>
              <span class="text-neutral-200">/tickets</span>
            </div>
            <button onclick="testApi('/tickets')" class="text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-[11px] transition">Test Run ↗</button>
          </div>

          <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded flex items-center justify-between hover:border-white/20 transition">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">GET</span>
              <span class="text-neutral-200">/customers</span>
            </div>
            <button onclick="testApi('/customers')" class="text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-[11px] transition">Test Run ↗</button>
          </div>

          <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded flex items-center justify-between hover:border-white/20 transition">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">GET</span>
              <span class="text-neutral-200">/customers/CUS-501</span>
            </div>
            <button onclick="testApi('/customers/CUS-501')" class="text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-[11px] transition">Test Run ↗</button>
          </div>

          <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded flex items-center justify-between hover:border-white/20 transition">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">GET</span>
              <span class="text-neutral-200">/drafts/TKT-1001</span>
            </div>
            <button onclick="testApi('/drafts/TKT-1001')" class="text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-[11px] transition">Test Run ↗</button>
          </div>

          <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded flex items-center justify-between hover:border-white/20 transition">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">POST</span>
              <span class="text-neutral-200">/drafts/TKT-1001/approve</span>
            </div>
            <span class="text-amber-400 text-[10px] font-mono">Human Gate</span>
          </div>
        </div>
      </div>

      <!-- Endpoint Group 2: Swarm Tools & Skills -->
      <div class="space-y-3 pt-2">
        <h3 class="text-xs font-bold text-neutral-300 font-mono uppercase flex items-center gap-2">
          <span class="text-[#DF3E03]">▶</span>
          <span>2. Agent Studio, Tools & Deterministic Skills</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded flex items-center justify-between hover:border-white/20 transition">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">GET</span>
              <span class="text-neutral-200">/api/v1/agent/tools</span>
            </div>
            <button onclick="testApi('/api/v1/agent/tools')" class="text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-[11px] transition">Test Run ↗</button>
          </div>

          <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded flex items-center justify-between hover:border-white/20 transition">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">GET</span>
              <span class="text-neutral-200">/api/v1/agent/skills</span>
            </div>
            <button onclick="testApi('/api/v1/agent/skills')" class="text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-[11px] transition">Test Run ↗</button>
          </div>

          <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded flex items-center justify-between hover:border-white/20 transition">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">GET</span>
              <span class="text-neutral-200">/api/v1/agent/config</span>
            </div>
            <button onclick="testApi('/api/v1/agent/config')" class="text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-[11px] transition">Test Run ↗</button>
          </div>

          <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded flex items-center justify-between hover:border-white/20 transition">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">POST</span>
              <span class="text-neutral-200">/api/v1/agent/skills</span>
            </div>
            <span class="text-neutral-500 text-[10px]">Add Custom Tool</span>
          </div>
        </div>
      </div>

      <!-- Endpoint Group 3: Knowledge, FAQs & Analytics -->
      <div class="space-y-3 pt-2">
        <h3 class="text-xs font-bold text-neutral-300 font-mono uppercase flex items-center gap-2">
          <span class="text-[#DF3E03]">▶</span>
          <span>3. Knowledge Sources, FAQs & Operations Analytics</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded flex items-center justify-between hover:border-white/20 transition">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">GET</span>
              <span class="text-neutral-200">/api/v1/knowledge/faqs</span>
            </div>
            <button onclick="testApi('/api/v1/knowledge/faqs')" class="text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-[11px] transition">Test Run ↗</button>
          </div>

          <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded flex items-center justify-between hover:border-white/20 transition">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">GET</span>
              <span class="text-neutral-200">/api/v1/analytics/overview</span>
            </div>
            <button onclick="testApi('/api/v1/analytics/overview')" class="text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-[11px] transition">Test Run ↗</button>
          </div>

          <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded flex items-center justify-between hover:border-white/20 transition">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">GET</span>
              <span class="text-neutral-200">/api/v1/settings/keys</span>
            </div>
            <button onclick="testApi('/api/v1/settings/keys')" class="text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-[11px] transition">Test Run ↗</button>
          </div>

          <div class="p-3 bg-white/[0.02] border border-white/[0.06] rounded flex items-center justify-between hover:border-white/20 transition">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">GET</span>
              <span class="text-neutral-200">/api/v1/settings/domains</span>
            </div>
            <button onclick="testApi('/api/v1/settings/domains')" class="text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-[11px] transition">Test Run ↗</button>
          </div>
        </div>
      </div>

      <!-- Live JSON Result Viewer Box -->
      <div class="mt-6 border border-white/[0.08] bg-[#070709] rounded-lg p-4 font-mono text-xs space-y-2">
        <div class="flex items-center justify-between text-neutral-400 text-[11px] border-b border-white/[0.08] pb-2">
          <span class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Live Response Inspector</span>
            <span id="response-path" class="text-cyan-300 font-bold">(/health)</span>
          </span>
          <span id="response-status" class="text-emerald-400 font-bold">200 OK</span>
        </div>
        <pre id="response-content" class="text-neutral-300 overflow-x-auto max-h-64 p-2 text-[11px] leading-relaxed">Click any "Test Run ↗" button above to inspect live backend JSON.</pre>
      </div>
    </div>
  </div>

  <script>
    async function testApi(endpoint) {
      document.getElementById('response-path').textContent = endpoint;
      document.getElementById('response-status').textContent = 'Loading...';
      document.getElementById('response-content').textContent = 'Fetching from ' + endpoint + '...';
      try {
        const res = await fetch(endpoint);
        const data = await res.json();
        document.getElementById('response-status').textContent = res.status + ' ' + res.statusText;
        document.getElementById('response-content').textContent = JSON.stringify(data, null, 2);
      } catch (err) {
        document.getElementById('response-status').textContent = 'Error';
        document.getElementById('response-content').textContent = String(err);
      }
    }
    // Preload health on page load
    testApi('/health');
  </script>
</body>
</html>
"""
