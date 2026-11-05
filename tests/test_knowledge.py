import pytest
from app.services.knowledge_service import search_knowledge

def test_knowledge_search_billing():
    results = search_knowledge("subscription payment mismatch")
    assert len(results) > 0
    top = results[0]
    assert "billing" in top.file.lower() or "subscription" in top.file.lower()
    assert "mismatch" in top.section.lower() or "activation" in top.section.lower()

def test_knowledge_search_refund():
    results = search_knowledge("duplicate charge refund")
    assert len(results) > 0
    top = results[0]
    assert "refund" in top.file.lower() or "billing" in top.file.lower()

def test_knowledge_search_no_match():
    results = search_knowledge("xylophone quantum mechanics alien")
    assert len(results) == 0
