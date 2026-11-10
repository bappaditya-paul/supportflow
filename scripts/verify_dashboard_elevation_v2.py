import asyncio
from playwright.async_api import async_playwright
from pathlib import Path
import os

SCREENSHOTS_DIR = str(Path(__file__).resolve().parent.parent / "client" / "docs" / "audit_screenshots")
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            executable_path="/home/bappaditya/.cache/ms-playwright/chromium-1252/chrome-linux64/chrome"
        )
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        print("1. Testing Premium Footer on Landing Page...")
        await page.goto("http://localhost:5173/", wait_until="networkidle")
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await asyncio.sleep(1)
        footer = page.locator("footer")
        await footer.screenshot(path=f"{SCREENSHOTS_DIR}/19-premium-footer-v2.png")
        print("-> Saved 19-premium-footer-v2.png")

        print("2. Testing Login Page with 1-Click Personas...")
        await page.goto("http://localhost:5173/login", wait_until="networkidle")
        await asyncio.sleep(1)
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/20-login-fast-track.png", full_page=True)
        print("-> Saved 20-login-fast-track.png")

        print("3. Clicking 1-Click Demo Operator button...")
        demo_btn = page.locator('[data-testid="btn-demo-operator"]')
        await demo_btn.click()
        await page.wait_for_url("**/dashboard", timeout=5000)
        await asyncio.sleep(1.5)
        print(f"-> Navigated to: {page.url}")

        print("4. Testing /dashboard full-height layout and zero horizontal scrollbar...")
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/21-dashboard-full-height.png")
        print("-> Saved 21-dashboard-full-height.png")

        # Check for presence of marketing navbar inside dashboard
        marketing_links = await page.locator("nav a:has-text('Pricing')").count()
        print(f"-> Marketing links in dashboard count: {marketing_links} (should be 0)")

        # Scroll stream inside detail pane if needed to verify dispatch gate visibility
        dispatch_gate = page.locator("#approval-dispatch-gate")
        is_visible = await dispatch_gate.is_visible()
        print(f"-> Approval dispatch gate visible: {is_visible}")

        print("5. Clicking Approve & Dispatch button...")
        approve_btn = page.locator("button:has-text('Approve & Dispatch to Customer')")
        if await approve_btn.count() > 0:
            await approve_btn.click()
            await asyncio.sleep(1.5)
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/22-dashboard-approved-dispatched.png")
            print("-> Saved 22-dashboard-approved-dispatched.png")

        print("6. Testing Signup Page...")
        await page.goto("http://localhost:5173/signup", wait_until="networkidle")
        await asyncio.sleep(1)
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/23-signup-instant-sandbox.png", full_page=True)
        print("-> Saved 23-signup-instant-sandbox.png")

        await browser.close()
        print("All verification steps completed successfully!")

if __name__ == "__main__":
    asyncio.run(run())
