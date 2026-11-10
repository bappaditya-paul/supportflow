from pydantic import BaseModel
from typing import Optional, List, Dict

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
    ticket_id: Optional[str] = None
    decision: str = "approve"  # approve or reject
    approver: str = "Support Lead"

# --- Elevated Cossistant/SupportFlow Models ---

class WebsiteOnboardingRequest(BaseModel):
    website_name: str
    domain: str
    framework: str = "nextjs"

class WebsiteOnboardingResponse(BaseModel):
    website_id: str
    website_slug: str
    website_name: str
    domain: str
    framework: str
    publishable_key: str
    test_key: str
    ai_setup_prompt: str
    crawled_pages_count: int = 5
    created_at: str

class AgentConfig(BaseModel):
    agent_id: str = "agent_01M6T922AE4MTMB5XWB5FV6T8K"
    name: str = "SupportFlow Swarm"
    status: str = "active"  # active or disabled
    model: str = "Switch Orchestrator (Node 34079)"
    system_prompt: str
    behavior_policies: Dict[str, str]

class ToolDefinition(BaseModel):
    id: str
    name: str
    tier: str  # behavior or action
    description: str
    enabled: bool
    instructions: Optional[str] = None

class CustomSkill(BaseModel):
    id: str
    name: str
    description: str
    markdown_instructions: str
    created_at: str

class KnowledgeSource(BaseModel):
    id: str
    domain: str
    path: str
    size_kb: int
    status: str = "indexed"
    last_crawled: str

class FAQItem(BaseModel):
    id: str
    question: str
    categories: List[str]
    related_questions: List[str] = []
    answer: str
    created_at: str

class ApiKeyItem(BaseModel):
    id: str
    name: str
    key_type: str  # Test Public Key, Live Public Key, Secret Key
    prefix: str
    created_at: str
    linked_teammate: Optional[str] = None

class AllowedDomain(BaseModel):
    id: str
    domain: str
    is_test: bool = False
    created_at: str

class AnalyticsOverview(BaseModel):
    live_visitors: int = 3
    median_response_time: str = "18s"
    median_resolution_time: str = "2m 14s"
    percent_handled_by_ai: str = "78%"
    satisfaction_index: int = 94
    unique_visitors_7d: int = 142
