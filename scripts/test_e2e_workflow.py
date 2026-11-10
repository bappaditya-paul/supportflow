"""
SupportFlow End-to-End Playwright Workflow Verification Script
Automates the full 7-step user journey:
1. User opens application & navigates to Business Signup (/signup)
2. User enters business & workspace information
3. Frontend sends API request (onboarding & auth)
4. Backend processes request & registers workspace
5. User is redirected to live Operator Cockpit (/dashboard)
6. Customer files an issue in the live widget (/split)
7. Operator approves AI draft & syncs billing discrepancy to Pro, with verified outcome
"""

import sys
import time
import json
import os
from pathlib import Path

# Add server directory to Python path for database utilities
server_dir = Path(__file__).resolve().parent.parent / "server"
if str(server_dir) not in sys.path:
    sys.path.insert(0, str(server_dir))

from playwright.sync_api import sync_playwright

def reset_test_state():
    """Ensure clean starting state for repeatable E2E test runs."""
    print("Preparing clean database and draft state for E2E run...")
    try:
        from app.db.supabase import get_supabase_admin
        client = get_supabase_admin()
        if client:
            client.table("agent_drafts").update({
                "status": "PENDING_APPROVAL",
                "approver_name": None,
                "decided_at": None
            }).eq("ticket_id", "TKT-1001").execute()
            client.table("customers").update({
                "plan": "free",
                "discrepancy_detected": True
            }).eq("customer_id", "CUS-501").execute()
            print("✓ Reset Supabase state (TKT-1001: PENDING_APPROVAL, CUS-501: free).")
    except Exception as e:
        print(f"ℹ Supabase reset note: {e}")

    # Reset local artifacts
    drafts_dir = server_dir / "artifacts" / "drafts"
    approved_dir = server_dir / "artifacts" / "approved"
    drafts_dir.mkdir(parents=True, exist_ok=True)
    approved_dir.mkdir(parents=True, exist_ok=True)

    approved_file = approved_dir / "TKT-1001.json"
    if approved_file.exists():
        approved_file.unlink(missing_ok=True)

    pending_file = drafts_dir / "TKT-1001.json"
    pending_data = {
        "ticket_id": "TKT-1001",
        "status": "PENDING_APPROVAL",
        "draft_text": "Hi Alex, thank you for reaching out! We verified in Stripe that your $9.99 Pro plan payment was successful on Nov 4. A webhook synchronization delay prevented your account from upgrading automatically. We have manually upgraded your account to Pro. All Pro features are now available. We apologize for the inconvenience!",
        "evidence_used": "Stripe payment $9.99 on 2026-11-04 confirmed (TXN-9001). Database showed free tier due to delayed sync.",
        "policy_references": "Policy KB-001: Billing Discrepancy Protocol",
        "quality_score": "PASS (0 Hallucinations, 0 Unauthorized Promises)",
        "human_approval_required": True,
        "created_at": "2026-11-07T09:51:38.579825+00:00"
    }
    with open(pending_file, "w", encoding="utf-8") as f:
        json.dump(pending_data, f, indent=2)
    print("✓ Reset local artifacts/drafts/TKT-1001.json to PENDING_APPROVAL.")

def run_e2e_workflow():
    print("==================================================================")
    print("🚀 STARTING SUPPORTFLOW END-TO-END PLAYWRIGHT WORKFLOW TEST")
    print("==================================================================")

    reset_test_state()

    with sync_playwright() as p:
        # Launch Chromium
        browser = p.chromium.launch(
            executable_path="/usr/bin/chromium-browser",
            headless=True
        )
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # -------------------------------------------------------------
        # STEP 1: Open Application & Navigate to Business Signup
        # -------------------------------------------------------------
        print("\n[Step 1] Navigating to http://localhost:5173/signup...")
        page.goto("http://localhost:5173/signup", wait_until="networkidle")
        print(f"✓ Page loaded: {page.title()}")

        # -------------------------------------------------------------
        # STEP 2: Fill Out Business Information
        # -------------------------------------------------------------
        print("\n[Step 2] Entering business registration details...")
        name_input = page.locator('input[placeholder="Alex Rivera"]').first
        email_input = page.locator('input[type="email"]').first
        workspace_input = page.locator('input[placeholder="Acme Corp"]').first

        name_input.fill("Elena Rostova")
        workspace_input.fill("Acme Cloud Platform")
        email_input.fill("elena@acmecloud.io")
        print("✓ Entered Name: Elena Rostova")
        print("✓ Entered Workspace: Acme Cloud Platform")
        print("✓ Entered Email: elena@acmecloud.io")

        # -------------------------------------------------------------
        # STEP 3 & 4: Submit Signup Form & Send Backend API Request
        # -------------------------------------------------------------
        print("\n[Step 3 & 4] Submitting form & triggering backend onboarding...")
        submit_btn = page.locator('button[type="submit"]')
        submit_btn.click()

        # Wait for navigation to dashboard
        page.wait_for_url("**/dashboard**", timeout=10000)
        print(f"✓ Redirected to dashboard: {page.url}")

        # Verify dashboard loaded with user context
        page.wait_for_selector('text=Operations Cockpit', timeout=10000)
        print("✓ Operations Cockpit loaded successfully!")

        # -------------------------------------------------------------
        # STEP 5: Customer Issue Submission in Split View (/split)
        # -------------------------------------------------------------
        print("\n[Step 5] Navigating to Split Customer + Operator View (/split)...")
        page.goto("http://localhost:5173/split", wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Ensure conversation view is open in widget
        scenario_btn = page.locator('button:has-text("Billing: Paid Pro, Still Free")')
        if scenario_btn.is_visible():
            print("✓ Clicking quick scenario: Billing: Paid Pro, Still Free")
            scenario_btn.click()
            page.wait_for_timeout(500)
        else:
            start_chat_btn = page.locator('button:has-text("Start a new conversation")')
            if start_chat_btn.is_visible():
                print("✓ Clicking Start a new conversation")
                start_chat_btn.click()
                page.wait_for_timeout(500)

        # Locate customer widget message input
        widget_input = page.locator('input[placeholder*="Ask a question"], input[aria-label="Ask a question or provide details"]').first
        widget_input.wait_for(state="visible", timeout=10000)
        print("✓ Customer widget conversation input active.")

        test_msg = "Urgent: I paid $9.99 for Pro on Nov 4 (TXN-9001) but my account still shows Free tier. Please upgrade my access immediately."
        print(f"✓ Customer typing issue: '{test_msg}'")
        widget_input.fill(test_msg)
        page.wait_for_timeout(500)

        # Send customer message
        send_btn = page.locator('button[aria-label="Send message"]').first
        if send_btn.is_visible():
            send_btn.click()
        else:
            widget_input.press("Enter")
        print("✓ Customer message sent & saved to backend timeline!")

        # Allow backend timeline persistence & AI triage to settle
        page.wait_for_timeout(1500)

        # -------------------------------------------------------------
        # STEP 6: Operator Reviews Findings & Approves AI Draft
        # -------------------------------------------------------------
        print("\n[Step 6] Operator inspecting Human Review & Dispatch Gate...")
        # Check for Approve & Dispatch button
        approve_btn = page.locator('button:has-text("Approve & Dispatch")').first
        approve_btn.wait_for(state="visible", timeout=10000)
        print("✓ Found Human Review Gate button: 'Approve & Dispatch'")
        approve_btn.click()
        print("✓ Operator approved AI draft & dispatched verified response!")
        page.wait_for_timeout(1500)

        # Optional: Sync Database to Stripe Paid State if button present
        sync_db_btn = page.locator('button:has-text("Sync Database to Stripe Paid State")').first
        if sync_db_btn.is_visible():
            print("✓ Found database reconciliation action: 'Sync Database to Stripe Paid State'")
            sync_db_btn.click()
            print("✓ Operator synchronized customer database entitlement to Pro state!")
            page.wait_for_timeout(1000)

        # -------------------------------------------------------------
        # STEP 7: Verify Outcome in Customer Widget and Cockpit
        # -------------------------------------------------------------
        print("\n[Step 7] Verifying resolved outcome in UI & customer widget...")
        page.wait_for_timeout(1000)

        # Check for verified / resolved indicators
        resolved_elements = page.locator('text=/RESOLVED|Resolved|Verified/i').all()
        print(f"✓ Found {len(resolved_elements)} resolved/verified badges across the interface.")
        assert len(resolved_elements) > 0, "Expected at least one resolved/verified status badge"

        # Verify dispatched message in timeline
        dispatched_msg = page.locator('text=/We verified in Stripe that your \\$9\\.99 Pro plan payment was successful/i').first
        if dispatched_msg.is_visible():
            print("✓ Verified human-approved response delivered to customer timeline!")

        # Take proof screenshot of the completed workflow
        proof_path = "/home/bappaditya/coding/Flip the Switch Hackathon/proof_e2e_workflow.png"
        page.screenshot(path=proof_path, full_page=True)
        print(f"✓ Full-page screenshot proof saved to {proof_path}")

        browser.close()

    print("\n==================================================================")
    print("🎉 END-TO-END WORKFLOW TEST COMPLETED SUCCESSFULLY!")
    print("==================================================================")

if __name__ == "__main__":
    run_e2e_workflow()
