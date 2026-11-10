import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_onboarding_flow():
    res = client.post("/api/v1/onboarding/website", json={
        "website_name": "Test Company",
        "domain": "testcompany.io",
        "framework": "nextjs"
    })
    assert res.status_code == 200
    data = res.json()
    assert "test_key" in data
    assert "pk_test_" in data["test_key"]
    assert data["website_name"] == "Test Company"

def test_agent_config():
    res = client.get("/api/v1/agent/config")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "active"
    assert "behavior_policies" in data
    assert "response_behavior" in data["behavior_policies"]

def test_tools_catalog():
    res = client.get("/api/v1/agent/tools")
    assert res.status_code == 200
    tools = res.json()
    assert len(tools) >= 5
    clarification_tool = next(t for t in tools if t["id"] == "tool_clarification")
    assert clarification_tool["enabled"] is True

def test_knowledge_and_faqs():
    res = client.get("/api/v1/knowledge/sources")
    assert res.status_code == 200
    sources = res.json()
    assert len(sources) >= 5

    res_faq = client.post("/api/v1/knowledge/faqs", json={
        "question": "What is Switch AI?",
        "categories": ["AI", "Architecture"],
        "answer": "Switch AI is an autonomous agent runtime.",
        "related_questions": ["How does Switch work?"]
    })
    assert res_faq.status_code == 200
    assert res_faq.json()["question"] == "What is Switch AI?"

def test_developer_keys_and_domains():
    res = client.get("/api/v1/settings/keys")
    assert res.status_code == 200
    assert len(res.json()) >= 2

    res_domains = client.get("/api/v1/settings/domains")
    assert res.status_code == 200
    domains = res_domains.json()
    assert any("localhost:3000" in d["domain"] for d in domains)

