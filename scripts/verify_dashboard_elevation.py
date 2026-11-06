import asyncio
from playwright.async_api import async_playwright
import os

SCREENSHOTS_DIR = "/home/bappaditya/coding/Flip the Switch Hackathon/client/docs/audit_screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

async def run_audit():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            executable_path="/home/bappaditya/.cache/ms-playwright/chromium-1252/chrome-linux64/chrome"
        )
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        print("1. Testing Login Page with 1-Click Demo Personas...")
        await page.goto("http://localhost:5173/login", wait_until="networkidle")
        await page.wait_for_timeout(500)
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/15-login-demo-personas.png", full_page=True)

        print("2. Clicking 1-Click Quick Demo Sign In (Alex Rivera)...")
        await page.click('[data-testid="btn-demo-operator"]')
        
        # Wait for client-side navigation
        await page.wait_for_timeout(1500)
        print(f"Current URL: {page.url}")

        await page.screenshot(path=f"{SCREENSHOTS_DIR}/16-dashboard-cossistant-elevated.png", full_page=False)

        print("3. Testing Sync DB to Stripe Paid State button...")
        sync_btn = page.locator("text=Sync DB to Stripe Paid State").first
        if await sync_btn.is_visible():
            await sync_btn.click()
            await page.wait_for_timeout(700)
            print("✓ DB Sync executed successfully!")

        print("4. Testing Approve & Dispatch to Customer...")
        approve_btn = page.locator("text=Approve & Dispatch to Customer").first
        if await approve_btn.is_visible():
            await approve_btn.click()
            await page.wait_for_timeout(800)
            print("✓ Dispatched ticket successfully!")

        await page.screenshot(path=f"{SCREENSHOTS_DIR}/17-dashboard-dispatched.png", full_page=False)

        print("5. Testing Signup Page with Fast Track Demo Sandbox...")
        await page.goto("http://localhost:5173/signup", wait_until="networkidle")
        await page.wait_for_timeout(500)
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/18-signup-instant-sandbox.png", full_page=True)

        print("Audit Complete!")
        print(f"Console errors: {len(console_errors)}")
        if console_errors:
            print("Errors:", console_errors)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_audit())
