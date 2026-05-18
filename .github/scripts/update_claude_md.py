#!/usr/bin/env python3
"""
Analyzes the current codebase and suggests updates to CLAUDE.md.
Exits with code 0 if no changes are needed, writes updated CLAUDE.md if changes are suggested.
"""

import json
import os
import subprocess
import sys

from openai import OpenAI


def read_file(path: str) -> str:
    with open(path) as f:
        return f.read()


def run_git(args: list[str]) -> str:
    result = subprocess.run(
        ["git"] + args,
        capture_output=True,
        text=True,
        cwd=os.environ.get("GITHUB_WORKSPACE", "."),
    )
    return result.stdout.strip()


def gather_context(repo_root: str) -> str:
    parts = []

    # Current CLAUDE.md
    claude_md_path = os.path.join(repo_root, "CLAUDE.md")
    parts.append(f"## Current CLAUDE.md\n\n{read_file(claude_md_path)}")

    # Frontend package.json (scripts + key deps)
    pkg_path = os.path.join(repo_root, "tavla", "package.json")
    if os.path.exists(pkg_path):
        pkg = json.loads(read_file(pkg_path))
        parts.append(
            "## tavla/package.json\n\n"
            f"Scripts: {json.dumps(pkg.get('scripts', {}), indent=2)}\n\n"
            f"Key dependencies:\n"
            f"  next: {pkg.get('dependencies', {}).get('next', '?')}\n"
            f"  react: {pkg.get('dependencies', {}).get('react', '?')}\n"
            f"  typescript: {pkg.get('devDependencies', {}).get('typescript', '?')}\n"
            f"  @biomejs/biome: {pkg.get('devDependencies', {}).get('@biomejs/biome', '?')}"
        )

    # Backend Cargo.toml
    cargo_path = os.path.join(repo_root, "backend", "Cargo.toml")
    if os.path.exists(cargo_path):
        parts.append(f"## backend/Cargo.toml\n\n{read_file(cargo_path)}")

    # Recent git commits (last 30 days)
    recent = run_git(["log", "--since=30 days ago", "--oneline", "--no-merges"])
    if recent:
        parts.append(f"## Git commits siste 30 dager\n\n{recent}")

    return "\n\n---\n\n".join(parts)


def build_prompt(context: str) -> str:
    return f"""Du er en teknisk dokumentasjonsassistent. Din oppgave er å holde CLAUDE.md oppdatert og nøyaktig.

Analyser konteksten nedenfor og avgjør om CLAUDE.md trenger oppdatering basert på faktiske endringer i kodebasen.

REGLER:
- Behold eksisterende struktur, tone og stil nøyaktig
- Oppdater kun fakta som faktisk har endret seg (f.eks. versjoner, skript, avhengigheter)
- Ikke legg til spekulativt innhold eller seksjoner som ikke allerede finnes
- Ikke fjern innhold med mindre det er åpenbart utdatert
- Hvis ingenting trenger å endres, svar med nøyaktig teksten: NO_CHANGES_NEEDED

Svar enten med den fulle, oppdaterte CLAUDE.md (kun markdown-innholdet, ingen forklaring), eller med NO_CHANGES_NEEDED.

{context}"""


def main() -> int:
    repo_root = os.environ.get("GITHUB_WORKSPACE", ".")
    claude_md_path = os.path.join(repo_root, "CLAUDE.md")

    print("Samler kontekst fra kodebasen...")
    context = gather_context(repo_root)

    print("Kaller GitHub Models (GPT-4o)...")
    client = OpenAI(
        base_url="https://models.inference.ai.azure.com",
        api_key=os.environ["GITHUB_TOKEN"],
    )
    message = client.chat.completions.create(
        model="gpt-4o",
        max_tokens=4096,
        messages=[{"role": "user", "content": build_prompt(context)}],
    )

    response = message.choices[0].message.content.strip()

    if response == "NO_CHANGES_NEEDED":
        print("Ingen endringer nødvendig. CLAUDE.md er oppdatert.")
        return 0

    print("Endringer foreslått. Skriver oppdatert CLAUDE.md...")
    with open(claude_md_path, "w") as f:
        f.write(response + "\n")

    return 1  # Signal til workflow at det er endringer


if __name__ == "__main__":
    sys.exit(main())
