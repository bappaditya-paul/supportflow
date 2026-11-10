export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'investigating' | 'awaiting_approval' | 'resolved' | 'spam';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'operator' | 'admin' | 'judge';
  roleTitle: string;
  workspace: string;
  avatarSeed: string;
  token?: string;
}

export interface Ticket {
  ticket_id: string;
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  subject: string;
  complaint?: string;
  message?: string;
  plan?: string;
  created_at: string;
  status: TicketStatus;
  priority?: TicketPriority;
  category?: string;
  discrepancy?: boolean;
}

export interface Customer {
  customer_id: string;
  name: string;
  email?: string;
  email_masked?: string;
  plan: string;
  paid_plan?: string;
  expected_plan?: string;
  payment_status: string;
  payment_amount?: number;
  last_payment_date?: string;
  payment_date?: string;
  stripe_charge_id?: string;
  transaction_id?: string;
  card_last4?: string;
  account_created?: string;
  discrepancy_detected?: boolean;
  discrepancy_note?: string;
}

export interface TimelineItem {
  id: string;
  ticket_id: string;
  sender_type: 'customer' | 'agent' | 'system' | 'operator';
  sender_name: string;
  text: string;
  visibility: 'public' | 'private';
  created_at: string;
  tool_call?: {
    name: string;
    params: Record<string, any>;
    result: Record<string, any>;
    status: 'running' | 'completed' | 'error';
  };
}

export interface DraftResponse {
  ticket_id: string;
  customer_name?: string;
  complaint_summary?: string;
  investigation_findings?: string[];
  applicable_policies?: string[];
  proposed_response?: string;
  draft_text?: string;
  evidence_used?: string;
  policy_references?: string;
  quality_score?: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  approved_by?: string;
  approved_at?: string;
  decided_at?: string;
}

export interface SwitchAgentState {
  name: string;
  role: string;
  status: 'idle' | 'analyzing' | 'querying_db' | 'drafting' | 'ready';
  last_action?: string;
}
