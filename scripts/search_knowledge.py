#!/usr/bin/env python3
"""
Search Knowledge Base Script
Deterministic keyword and semantic policy matcher for AI agents.
"""

import argparse
import sys
from pathlib import Path

KB_DIR = Path(__file__).resolve().parent.parent / "data" / "knowledge_base"

def search_kb(query: str):
    if not KB_DIR.exists():
        print(f"[ERROR] Knowledge base folder not found: {KB_DIR}", file=sys.stderr)
        sys.exit(1)

    query_tokens = [q.lower().strip() for q in query.split() if len(q) > 2]
    matches = []

    for file_path in sorted(KB_DIR.glob("*.md")):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        sections = content.split("## ")
        doc_title = sections[0].replace("# ", "").strip()

        for sec in sections[1:]:
            sec_lines = sec.splitlines()
            sec_title = sec_lines[0].strip()
            sec_body = "\n".join(sec_lines[1:]).strip()

            score = 0
            sec_lower = (sec_title + " " + sec_body).lower()
            for token in query_tokens:
                if token in sec_lower:
                    score += 1

            if score > 0:
                matches.append({
                    "file": file_path.name,
                    "doc": doc_title,
                    "section": sec_title,
                    "content": sec_body,
                    "score": score
                })

    matches.sort(key=lambda x: x["score"], reverse=True)

    if not matches:
        print(f"[NO_MATCH] No policy found matching query: '{query}'")
        return

    print(f"=== KNOWLEDGE SEARCH RESULTS ({len(matches)} found) ===")
    for i, m in enumerate(matches[:3], 1):
        print(f"\n[Result {i}] Policy: {m['doc']} ({m['file']}) > {m['section']}")
        print(m['content'])
    print("\n================================================")

def main():
    parser = argparse.ArgumentParser(description="Search SupportFlow Knowledge Base")
    parser.add_argument("--query", required=True, help="Search query (e.g. 'subscription payment mismatch')")
    args = parser.parse_args()
    search_kb(args.query)

if __name__ == "__main__":
    main()
