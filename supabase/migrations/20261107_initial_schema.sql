-- SupportFlow Initial Schema & RLS Policies
-- Compatible with Supabase PostgreSQL 15+

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. User Profiles Table (Mirrors and extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'operator' CHECK (role IN ('operator', 'admin', 'judge', 'customer')),
    workspace_id TEXT NOT NULL DEFAULT 'ws_default',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to automatically populate public.profiles on user signup / OAuth login
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
        'operator'
    )
    ON CONFLICT (id) DO UPDATE
    SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Customers Table (Reconciled with Stripe)
CREATE TABLE IF NOT EXISTS public.customers (
    customer_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    email_masked TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'free',
    expected_plan TEXT,
    payment_status TEXT NOT NULL DEFAULT 'unpaid',
    payment_amount NUMERIC(10, 2) DEFAULT 0.00,
    payment_date DATE,
    transaction_id TEXT,
    card_last4 TEXT,
    discrepancy_detected BOOLEAN NOT NULL DEFAULT false,
    discrepancy_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Tickets Table
CREATE TABLE IF NOT EXISTS public.tickets (
    ticket_id TEXT PRIMARY KEY,
    customer_id TEXT REFERENCES public.customers(customer_id) ON DELETE SET NULL,
    category TEXT NOT NULL DEFAULT 'general',
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'awaiting_approval', 'resolved', 'spam')),
    assigned_agent TEXT DEFAULT '@triager',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON public.tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_customer ON public.tickets(customer_id);

-- 5. Ticket Timeline & Audit Logs
CREATE TABLE IF NOT EXISTS public.ticket_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id TEXT NOT NULL REFERENCES public.tickets(ticket_id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'agent', 'operator', 'system')),
    sender_name TEXT NOT NULL,
    text TEXT NOT NULL,
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    tool_name TEXT,
    tool_params JSONB,
    tool_result JSONB,
    tool_status TEXT CHECK (tool_status IN ('executing', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_timeline_ticket ON public.ticket_timeline(ticket_id, created_at ASC);

-- 6. AI Agent Draft Responses (Human-in-the-Loop Governance Gate)
CREATE TABLE IF NOT EXISTS public.agent_drafts (
    ticket_id TEXT PRIMARY KEY REFERENCES public.tickets(ticket_id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL' CHECK (status IN ('PENDING_APPROVAL', 'APPROVED', 'REJECTED')),
    draft_text TEXT NOT NULL,
    evidence_used TEXT,
    policy_references TEXT,
    quality_score TEXT,
    human_approval_required BOOLEAN NOT NULL DEFAULT true,
    approver_name TEXT,
    decided_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Knowledge Base & FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    categories TEXT[] NOT NULL DEFAULT '{}',
    related_questions TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Developer Workspace Settings
CREATE TABLE IF NOT EXISTS public.api_keys (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    key_type TEXT NOT NULL CHECK (key_type IN ('Test Public Key', 'Live Public Key', 'Secret Key')),
    prefix TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.allowed_domains (
    id TEXT PRIMARY KEY,
    domain TEXT NOT NULL UNIQUE,
    is_test BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Row Level Security (RLS) Setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allowed_domains ENABLE ROW LEVEL SECURITY;

-- 10. RLS Security Policies
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Authenticated operators full tickets access" ON public.tickets
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated operators full timeline access" ON public.ticket_timeline
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated operators full drafts access" ON public.agent_drafts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated operators full customers access" ON public.customers
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read for FAQs" ON public.faqs
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated operators full api keys access" ON public.api_keys
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated operators full domains access" ON public.allowed_domains
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 11. Seed Initial Data
INSERT INTO public.customers (customer_id, name, email, email_masked, plan, expected_plan, payment_status, payment_amount, payment_date, transaction_id, card_last4, discrepancy_detected, discrepancy_note)
VALUES
    ('CUS-501', 'Alex Morgan', 'alex.morgan@example.com', 'al***n@example.com', 'free', 'pro', 'paid', 9.99, '2026-11-04', 'TXN-9001', '4242', true, 'Payment of $9.99 confirmed, but plan is ''free'' instead of ''pro''!'),
    ('CUS-502', 'Jamie Smith', 'jamie.smith@example.com', 'ja***h@example.com', 'pro', 'pro', 'duplicate_charge_reported', 9.99, '2026-11-04', 'TXN-9002-A', '1122', true, 'Duplicate charge reported in ledger.'),
    ('CUS-503', 'Taylor Lee', 'taylor.lee@example.com', 'ta***e@example.com', 'pro', 'pro', 'paid', 9.99, '2026-11-01', 'TXN-9003', '8899', false, NULL)
ON CONFLICT (customer_id) DO NOTHING;

INSERT INTO public.tickets (ticket_id, customer_id, category, priority, subject, message, status, assigned_agent)
VALUES
    ('TKT-1001', 'CUS-501', 'billing', 'high', 'Pro subscription not activated', 'I paid for the Pro plan yesterday, but my account still shows the Free plan. My payment was deducted. Please resolve this issue.', 'open', '@triager'),
    ('TKT-1002', 'CUS-502', 'refund', 'normal', 'Refund request - duplicate charge', 'I was charged twice for my monthly subscription ($9.99 x 2). Please refund the duplicate transaction.', 'open', '@triager'),
    ('TKT-1003', 'CUS-503', 'technical', 'normal', 'Cannot log in to dashboard', 'The login page keeps throwing an authentication error after password submit.', 'open', '@triager')
ON CONFLICT (ticket_id) DO NOTHING;

INSERT INTO public.agent_drafts (ticket_id, status, draft_text, evidence_used, policy_references, quality_score, human_approval_required, approver_name, decided_at)
VALUES
    ('TKT-1001', 'PENDING_APPROVAL', 'Hi Alex, thank you for reaching out! We verified in Stripe that your $9.99 Pro plan payment was successful on Nov 4. A webhook synchronization delay prevented your account from upgrading automatically. We have manually upgraded your account to Pro. All Pro features are now available. We apologize for the inconvenience!', 'Stripe payment $9.99 on 2026-11-04 confirmed (TXN-9001). Database showed free tier due to delayed sync.', 'Policy KB-001: Billing Discrepancy Protocol', 'PASS (0 Hallucinations, 0 Unauthorized Promises)', true, NULL, NULL)
ON CONFLICT (ticket_id) DO NOTHING;

INSERT INTO public.api_keys (id, name, key_type, prefix)
VALUES
    ('key_1', 'DevScaleLab - Test Public API Key', 'Test Public Key', 'pk_test_0c06...3622'),
    ('key_2', 'DevScaleLab - Live Public API Key', 'Live Public Key', 'pk_7d6b...9986')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.allowed_domains (id, domain, is_test)
VALUES
    ('dom_1', 'https://devscalelab.com', false),
    ('dom_2', 'http://localhost:3000', true)
ON CONFLICT (id) DO NOTHING;

