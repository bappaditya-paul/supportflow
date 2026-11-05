from pathlib import Path
from typing import List
from app.models import KnowledgeResult

KB_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "knowledge_base"

def search_knowledge(query: str) -> List[KnowledgeResult]:
    if not KB_DIR.exists():
        return []

    tokens = [q.lower().strip() for q in query.split() if len(q) > 2]
    results = []

    for path in sorted(KB_DIR.glob("*.md")):
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        sections = content.split("## ")
        doc_title = sections[0].replace("# ", "").strip()

        for sec in sections[1:]:
            lines = sec.splitlines()
            sec_title = lines[0].strip()
            sec_body = "\n".join(lines[1:]).strip()

            score = 0
            text_lower = (sec_title + " " + sec_body).lower()
            for t in tokens:
                if t in text_lower:
                    score += 1

            if score > 0:
                results.append(KnowledgeResult(
                    policy=doc_title,
                    file=path.name,
                    section=sec_title,
                    content=sec_body,
                    relevance_score=score
                ))

    results.sort(key=lambda x: x.relevance_score, reverse=True)
    return results[:5]
