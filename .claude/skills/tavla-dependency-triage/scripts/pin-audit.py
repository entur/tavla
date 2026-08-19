#!/usr/bin/env python3
"""Auditerer pinnede pakker i begge Tavla-repoer.

Svarer på to spørsmål Dependabot-UI-et ikke kan svare på:

  1. BLOKKERER  — hindrer en av våre pinner en sikkerhetsfiks fra å komme inn?
  2. UNØDVENDIG — er en pin overflødig, slik at den bare venter på å forfalle?

Spørsmål 2 er forebyggingen. En pin som ikke lenger trengs er ikke gratis:
den fjerner Dependabots mulighet til å vedlikeholde pakken, og blir stående
til noen oppdager at et varsel aldri lukker seg. Det var nøyaktig det som
skjedde med `tar` (pinnet mars 2026, seks varsler bak seg i august).

Bruk (fra repo-rot i entur/tavla):
    python3 .claude/skills/tavla-dependency-triage/scripts/pin-audit.py

Krever `gh` autentisert, nettverk mot npm, og node med `semver` tilgjengelig
(ligger i tavla/node_modules etter `yarn install`).
"""

import base64
import json
import os
import re
import subprocess
import sys

TAVLA_PKG = "tavla/package.json"
TAVLA_LOCK = "tavla/yarn.lock"
VISNING_PKG = "../tavla-visning/package.json"


def sh(*args, cwd=None):
    r = subprocess.run(args, capture_output=True, text=True, cwd=cwd)
    return r.stdout.strip() if r.returncode == 0 else ""


def vkey(v):
    out = []
    for part in str(v).split("-")[0].split("."):
        try:
            out.append(int(part))
        except ValueError:
            out.append(0)
    return tuple(out + [0, 0, 0])[:3]


# ---------------------------------------------------------------- alerts

def open_alerts(repo):
    raw = sh("gh", "api", f"repos/{repo}/dependabot/alerts?state=open&per_page=100",
             "--jq", "[.[]|{pkg:.dependency.package.name,"
                     "sev:.security_advisory.severity,"
                     "fix:.security_vulnerability.first_patched_version.identifier,"
                     "vuln:.security_vulnerability.vulnerable_version_range,"
                     "n:.number}]")
    return json.loads(raw or "[]")


# ------------------------------------------------------- yarn.lock parsing

def parse_berry(path):
    """→ [{name, version, deps: {dep_name: range}}] for hver lockfile-blokk."""
    entries, cur, section = [], None, None
    for line in open(path):
        line = line.rstrip("\n")
        if line and not line[0].isspace() and line.rstrip().endswith(":"):
            key = line.rstrip()[:-1]
            if key == "__metadata":
                cur = None
                continue
            first = key.split(", ")[0].strip('"')
            name = first.rsplit("@npm:", 1)[0] if "@npm:" in first else first.rsplit("@", 1)[0]
            cur = {"name": name, "version": None, "deps": {}}
            entries.append(cur)
            section = None
            continue
        if cur is None:
            continue
        m = re.match(r"^  version: (.+)$", line)
        if m:
            cur["version"] = m.group(1).strip('"')
        if re.match(r"^  (dependencies|optionalDependencies):", line):
            section = "deps"
            continue
        if re.match(r"^  \S", line):
            section = None
            continue
        if section == "deps":
            m = re.match(r'^    "?([^":]+)"?: "?(.+?)"?$', line)
            if m:
                cur["deps"][m.group(1)] = m.group(2)
    return entries


def consumers_of(entries, pkg):
    """→ [(consumer_label, declared_range)] for alle som ber om pkg."""
    out = []
    for e in entries:
        rng = e["deps"].get(pkg)
        if rng is None:
            continue
        rng = rng.replace("npm:", "")
        label = "package.json (direkte)" if e["version"] == "0.0.0-use.local" \
            else f"{e['name']}@{e['version']}"
        out.append((label, rng))
    return out


def resolve_ranges(versions, ranges, pin):
    """For hver range: hvilken versjon ville yarn valgt uten pinnen (maxSatisfying),
    og tilfredsstiller selve pinnen rangen?
    → {"resolved": {range: version|None}, "pinok": {range: bool|None}}"""
    script = (
        "const s=require('semver');const[vs,rs,pin]=JSON.parse(process.argv[1]);"
        "const f=(fn)=>{try{return fn()}catch(e){return null}};"
        "console.log(JSON.stringify({"
        "resolved:Object.fromEntries(rs.map(r=>[r,f(()=>s.maxSatisfying(vs,r))])),"
        "pinok:Object.fromEntries(rs.map(r=>[r,f(()=>s.satisfies(pin,r))]))"
        "}))"
    )
    out = sh("node", "-e", script, json.dumps([versions, ranges, str(pin)]), cwd="tavla")
    try:
        return json.loads(out)
    except Exception:
        return None


def in_vuln_range(version, ranges):
    """GitHub-intervaller ('>= 4.0.0, < 5.1.8') → semver-AND ('>=4.0.0 <5.1.8').
    → liste over intervaller `version` faktisk ligger inne i."""
    conv = [r.replace(", ", " ").replace("= ", "=") for r in ranges if r]
    if not conv:
        return []
    script = (
        "const s=require('semver');const[v,rs]=JSON.parse(process.argv[1]);"
        "console.log(JSON.stringify(rs.filter(r=>{"
        "try{return s.satisfies(v,r,{includePrerelease:true})}catch(e){return false}})))"
    )
    out = sh("node", "-e", script, json.dumps([version, conv]), cwd="tavla")
    try:
        return json.loads(out)
    except Exception:
        return []


def npm_versions(pkg):
    raw = sh("npm", "view", pkg, "versions", "--json")
    try:
        v = json.loads(raw)
        return v if isinstance(v, list) else [v]
    except Exception:
        return []


# ------------------------------------------------------------------ pins

def load_pins(path, repo):
    if os.path.exists(path):
        pkg = json.load(open(path))
    else:
        raw = sh("gh", "api", f"repos/{repo}/contents/package.json", "--jq", ".content")
        if not raw:
            return None
        pkg = json.loads(base64.b64decode(raw))
    return pkg.get("resolutions") or pkg.get("pnpm", {}).get("overrides", {}) or {}


# ----------------------------------------------------------------- report

blocking, removable = [], []

print("=" * 72)
print("DEL 1 — Blokkerer noen pin en sikkerhetsfiks?")
print("=" * 72)

repos = [("entur/tavla", TAVLA_PKG), ("entur/tavla-visning", VISNING_PKG)]
pinmap = {}
for repo, path in repos:
    pins = load_pins(path, repo)
    pinmap[repo] = pins
    print(f"\n### {repo}")
    if pins is None:
        print("  (fant ikke package.json — hopper over)")
        continue
    if not pins:
        print("  (ingen pinner)")
        continue
    alerts = open_alerts(repo)
    for name, pin in pins.items():
        hits = [a for a in alerts if a["pkg"] == name]
        if not hits:
            print(f"  ✅ {name}: pinnet {pin} — ingen åpne varsler")
            continue
        fixes = [a["fix"] for a in hits if a["fix"]]
        need = max(fixes, key=vkey) if fixes else None
        sevs = ",".join(sorted({a["sev"] for a in hits}))
        nums = ", #".join(str(a["n"]) for a in sorted(hits, key=lambda a: a["n"]))
        word = "varsel" if len(hits) == 1 else "varsler"
        if need and vkey(str(pin).lstrip("^~>=<ex ")) < vkey(need):
            blocking.append((repo, name, pin, need))
            print(f"  🔴 {name}: pinnet {pin}, men fiks krever {need} "
                  f"— BLOKKERER {len(hits)} {word} ({sevs}) → #{nums}")
        else:
            print(f"  🟡 {name}: pinnet {pin} ≥ fiks {need} "
                  f"— {word} lukkes når endringen er merget → #{nums}")

print()
print("=" * 72)
print("DEL 2 — Trengs pinnen fortsatt? (forebygging)")
print("=" * 72)
print("\nEn pin som ikke lenger trengs, blokkerer Dependabot uten å gi noe igjen.")
print("Fjern den, så vedlikeholder Dependabot pakken slik den gjorde før pinnen.\n")

# --- entur/tavla: hva ville skjedd uten pinnen?
print("### entur/tavla")
tavla_pins = pinmap.get("entur/tavla") or {}
tavla_alerts = open_alerts("entur/tavla") if tavla_pins else []
if not os.path.exists(TAVLA_LOCK):
    print("  (fant ikke yarn.lock — kjør fra repo-rot i entur/tavla)")
elif tavla_pins:
    entries = parse_berry(TAVLA_LOCK)
    for name, pin in tavla_pins.items():
        cons = consumers_of(entries, name)
        if not cons:
            print(f"  ❔ {name}: fant ingen konsumenter i yarn.lock — "
                  f"sjekk om pakken fortsatt er i bruk")
            continue
        versions = npm_versions(name)
        if not versions:
            print(f"  ❔ {name}: fikk ikke versjonsliste fra npm — sjekk manuelt")
            continue
        ranges = sorted({r for _, r in cons})
        res = resolve_ranges(versions, ranges, pin)
        if res is None:
            print(f"  ❔ {name}: semver utilgjengelig (kjør `yarn install` i tavla/)")
            continue

        # Hva ville hver konsument fått uten pinnen?
        resolved = res["resolved"]
        distinct = sorted({v for v in resolved.values() if v}, key=vkey)

        # Ligger noen av de resolverte versjonene fortsatt inne i et sårbart intervall?
        pkg_alerts = [a for a in tavla_alerts if a["pkg"] == name]
        vulns = [a.get("vuln") for a in pkg_alerts]
        fixes = [a["fix"] for a in pkg_alerts if a["fix"]]
        need = max(fixes, key=vkey) if fixes else None

        # Tvinger pinnen noen konsument utenfor sin egen deklarasjon?
        outside = [(lbl, r) for lbl, r in cons if res["pinok"].get(r) is False]

        unsafe = [v for v in distinct if in_vuln_range(v, vulns)]

        if unsafe:
            verdict = (f"  🔒 {name}: pinnet {pin} — PINNEN TRENGS. Uten den ville "
                       f"{', '.join(unsafe)} blitt liggende igjen, fortsatt i et sårbart intervall (fiks: {need}).")
        elif len(distinct) == 1:
            removable.append((name, pin, distinct[0]))
            verdict = (f"  🟢 {name}: pinnet {pin} — KAN FJERNES. Alle {len(ranges)} "
                       f"konsumentranges ({', '.join(ranges)}) konvergerer til "
                       f"{distinct[0]} uten pinnen — én kopi, "
                       f"{'utenfor alle sårbare intervall (fiks: ' + need + ')' if need else 'ingen åpne varsler'}.")
        else:
            verdict = (f"  🟡 {name}: pinnet {pin} — pinnen tjener deduplisering. "
                       f"Uten den blir det {len(distinct)} kopier ({', '.join(distinct)}), "
                       f"alle trygge. Fjerning er mulig, men vurder om flere kopier er ok.")
        print(verdict)

        if outside:
            why = "; ".join(f"{lbl} krever {r}" for lbl, r in sorted(set(outside))[:3])
            more = f" (+{len(set(outside)) - 3} flere)" if len(set(outside)) > 3 else ""
            print(f"       ⚠️  Pinnen tvinger konsumenter utenfor deklarasjonen sin: "
                  f"{why}{more}. Pakken kjører da på en versjon den ikke selv "
                  f"sier den støtter — se references/pin-vedlikehold.md.")
else:
    print("  (ingen pinner)")

# --- entur/tavla-visning: pnpm-lock v9 har ikke konsumentranges
print("\n### entur/tavla-visning")
vpins = pinmap.get("entur/tavla-visning") or {}
if vpins:
    print("  ⚠️  pnpm-lock v9 lagrer resolverte versjoner, ikke konsumentenes ranges,")
    print("      så denne sjekken kan ikke gjøres automatisk. Test manuelt per pin:")
    for name, pin in vpins.items():
        print(f"        • {name} (pinnet {pin})")
    print("\n      Fjern pinnen midlertidig fra pnpm.overrides og kjør:")
    print("        pnpm install --lockfile-only && grep -n '^  <pakke>@' pnpm-lock.yaml")
    print("      Får du én kopi på en trygg versjon, kan pinnen fjernes permanent.")
else:
    print("  (ingen pinner)")

# ------------------------------------------------------------- oppsummering
print()
print("=" * 72)
if blocking:
    print(f"🔴 {len(blocking)} pin(ner) blokkerer sikkerhetsfikser — inn i briefen og todo-lista:")
    for repo, name, pin, need in blocking:
        print(f"     {repo}: {name} {pin} → må minst til {need}")
else:
    print("✅ Ingen pinner blokkerer fikser denne uken.")
if removable:
    print(f"\n🟢 {len(removable)} pin(ner) er trolig overflødige — vurder fjerning "
          f"(se references/pin-vedlikehold.md):")
    for name, pin, target in removable:
        print(f"     entur/tavla: {name} {pin} → fjern, resolverer til {target}")
    print("\n   Fjerning er å foretrekke framfor å heve pinnen: det gir Dependabot")
    print("   ansvaret tilbake, og pinnen kan ikke forfalle igjen.")
print("=" * 72)
sys.exit(0)
