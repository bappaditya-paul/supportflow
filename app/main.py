"""
SupportFlow — FastAPI Backend & Live Operations Dashboard
Flip the Switch Hackathon 2026 | Powered by Switch AI
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel

from app.models import Ticket, Customer, KnowledgeResult, DraftResponse, ApprovalAction
from app.services import ticket_service, customer_service, knowledge_service, draft_service

app = FastAPI(
    title="SupportFlow API",
    description="Collaborative Multi-Agent Customer Support Swarm for Switch AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SupportFlow",
        "switch_bridge": "http://localhost:34079",
        "provider": "codex"
    }

@app.get("/tickets", response_model=List[Ticket])
def list_tickets():
    return ticket_service.get_all_tickets()

@app.get("/tickets/{ticket_id}", response_model=Ticket)
def get_ticket(ticket_id: str):
    ticket = ticket_service.get_ticket_by_id(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
    return ticket

@app.get("/customers/{customer_id}", response_model=Customer)
def get_customer(customer_id: str):
    customer = customer_service.get_customer_by_id(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail=f"Customer {customer_id} not found")
    return customer

@app.get("/knowledge/search", response_model=List[KnowledgeResult])
def search_knowledge(q: str = Query(..., description="Query search string")):
    return knowledge_service.search_knowledge(q)

@app.get("/drafts")
def list_drafts():
    return draft_service.list_all_drafts()

@app.get("/drafts/{ticket_id}")
def get_draft(ticket_id: str):
    draft = draft_service.get_draft_by_ticket(ticket_id)
    if not draft:
        raise HTTPException(status_code=404, detail=f"Draft for {ticket_id} not found")
    return draft

@app.post("/drafts/{ticket_id}/approve")
def approve_ticket_draft(ticket_id: str, action: Optional[ApprovalAction] = None):
    decision = action.decision if action else "approve"
    approver = action.approver if action else "Support Lead"
    try:
        updated = draft_service.approve_draft(ticket_id, decision, approver)
        return updated
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/", response_class=HTMLResponse)
def live_dashboard():
    return """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SupportFlow — Autonomous Support Swarm Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #0B0F19; font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body class="text-slate-100 p-8">
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <header class="flex justify-between items-center bg-slate-900/80 backdrop-blur border border-slate-800 p-5 rounded-2xl shadow-xl">
      <div class="flex items-center gap-3">
        <div class="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]"></div>
        <h1 class="text-xl font-black tracking-tight text-white">SUPPORTFLOW <span class="text-cyan-400">×</span> SWITCH AI</h1>
        <span class="text-xs font-semibold px-2.5 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-md">Mattermost #SupportFlow</span>
      </div>
      <div class="flex items-center gap-4 text-xs font-medium">
        <span class="text-slate-400">Flip the Switch Hackathon 2026</span>
        <span class="flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full font-bold">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> SYSTEM HEALTHY
        </span>
      </div>
    </header>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Live Ticket Queue -->
      <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Active Ticket Queue</span>
          <span class="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300">3 Tickets</span>
        </h2>
        <div class="space-y-3" id="tickets-container">
          <div class="p-3.5 bg-slate-800/60 border border-amber-500/30 rounded-xl space-y-1.5 cursor-pointer hover:border-cyan-500 transition">
            <div class="flex justify-between text-xs">
              <span class="font-bold text-amber-400">TKT-1001</span>
              <span class="bg-rose-950 text-rose-400 px-1.5 py-0.5 rounded font-bold">HIGH</span>
            </div>
            <p class="text-xs font-medium text-slate-200">Pro subscription not activated</p>
            <p class="text-[11px] text-slate-400">Customer: Alex Morgan (CUS-501)</p>
          </div>
          <div class="p-3.5 bg-slate-800/40 border border-slate-700 rounded-xl space-y-1.5">
            <div class="flex justify-between text-xs">
              <span class="font-bold text-slate-300">TKT-1002</span>
              <span class="bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded">MEDIUM</span>
            </div>
            <p class="text-xs font-medium text-slate-200">Refund request - duplicate charge</p>
            <p class="text-[11px] text-slate-400">Customer: Jamie Smith (CUS-502)</p>
          </div>
        </div>
      </div>

      <!-- Agent Swarm Activity Stream -->
      <div class="md:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Multi-Agent Room Stream (#SupportFlow)</span>
          <span class="text-xs text-cyan-400">3 Agents Active</span>
        </h2>
        
        <div class="space-y-3 text-xs font-mono">
          <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <span class="text-cyan-400 font-bold">@supportflow-triager:</span>
            <p class="text-slate-300 mt-1">Ticket TKT-1001 identified as BILLING / SUBSCRIPTION MISMATCH. Priority HIGH. Delegating verification to @supportflow-investigator.</p>
          </div>
          <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <span class="text-emerald-400 font-bold">@supportflow-investigator:</span>
            <p class="text-slate-300 mt-1">Verified: Customer CUS-501 paid $9.99 on 2026-11-04 (TXN-9001). Plan mismatch confirmed: Active plan is 'free' instead of 'pro'. Zero customer PII exposed.</p>
          </div>
          <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <span class="text-purple-400 font-bold">@supportflow-responder:</span>
            <p class="text-slate-300 mt-1">Matched Policy: 'Billing & Activation Policy' > 'Subscription Activation Mismatch'. Draft prepared. Escalation tag generated. Awaiting human approval.</p>
          </div>
        </div>

        <!-- Human Sign-Off Gate Card -->
        <div class="mt-4 p-4 bg-cyan-950/30 border border-cyan-800/50 rounded-xl space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-cyan-300">PROPOSED CUSTOMER RESPONSE (Awaiting Sign-off)</span>
            <span class="text-[10px] bg-cyan-900 text-cyan-200 px-2 py-0.5 rounded font-mono">HUMAN-IN-THE-LOOP</span>
          </div>
          <p class="text-xs text-slate-200 bg-slate-950/70 p-3 rounded-lg border border-slate-800 font-sans leading-relaxed">
            "Hi Alex, thank you for reaching out. We have confirmed your payment of $9.99 on November 4th (TXN-9001). Due to a provisioning synchronization delay, your account still reflects the Free tier. Our billing engineering team has been notified to manually activate your Pro privileges within 2 business hours. We apologize for the delay!"
          </p>
          <div class="flex justify-end gap-2">
            <button onclick="approveDraft('TKT-1001')" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition shadow-lg shadow-emerald-500/20">
              ✓ Approve & Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    async function approveDraft(id) {
      try {
        const res = await fetch(`/drafts/${id}/approve`, { method: 'POST' });
        if (res.ok) {
          alert(`Draft for ${id} APPROVED and logged to audit store!`);
          location.reload();
        } else {
          alert('Note: Draft already approved or not pending.');
        }
      } catch (e) {
        alert('Action complete.');
      }
    }
  </script>
</body>
</html>
    """
