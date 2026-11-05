from pydantic import BaseModel, Field
from typing import Optional, List

class Ticket(BaseModel):
    ticket_id: str
    customer_id: str
    category: str
    priority: str
    subject: str
    message: str
    status: str
    created_at: str

class Customer(BaseModel):
    customer_id: str
    name: str
    email_masked: str
    plan: str
    expected_plan: Optional[str] = None
    payment_status: str
    payment_amount: float
    payment_date: Optional[str] = None
    transaction_id: Optional[str] = None
    card_last4: Optional[str] = None
    discrepancy_detected: bool = False
    discrepancy_note: Optional[str] = None

class KnowledgeResult(BaseModel):
    policy: str
    file: str
    section: str
    content: str
    relevance_score: int

class DraftResponse(BaseModel):
    ticket_id: str
    status: str
    draft_text: str
    evidence_used: str
    policy_references: str
    quality_score: str
    human_approval_required: bool = True
    created_at: str

class ApprovalAction(BaseModel):
    ticket_id: str
    decision: str  # approve or reject
    approver: str = "Support Lead"
