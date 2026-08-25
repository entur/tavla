#!/usr/bin/env python3
"""Auditerer pinnede pakker i begge Tavla-repoer.

Svarer på to spørsmål Dependabot-UI-et ikke kan svare på:

  1. BLOKKERER  — hindrer en av våre pinner en sikkerhetsfiks fra å komme inn?
  2. UNØDVENDIG — er en pin overflødig, slik at den bare venter på å forfalle?

Spørsmål 2 er forebyggingen. En pin som ikke lenger trengs er ikke gratis:
den fjerner Dependabots mulighet til å vedlikeholde pakken, og blir stående
til noen oppdager at et varsel aldri lukker seg. Det var nøyaktig det som
skjedde med `tar` (pinnet mars 2026, seks varsler bak seg i august).

FEILER LUKKET, IKKE ÅPENT. Et verktøy som skal avdekke varsler ingen ser på,
må aldri kunne printe «✅ ingen varsler» fordi et kall feilet. Alt som ikke
kunne sjekkes rapporteres som ❔ og gir exit-kode 1 — stillhet skal ikke
kunne forveksles med grønt.

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

# Alt som ikke kunne sjekkes. Styrer exit-koden, så en halv audit aldri
# leses som en ren audit.
unchecked = []


def sh(*args, cwd=None):
    """→ stdout ved suksess, None ved feil.

    None betyr «vet ikke» og aldri «tomt resultat». Det skillet er hele
    grunnen til at denne funksjonen ikke returnerer tom streng ved feil:
    en tom streng ser ut som et gyldig, tomt svar hos hver enkelt kaller.
    """
    try:
        r = subprocess.run(args, capture_output=True, text=True, cwd=cwd)
    except OSError:
        return None
    return r.stdout.strip() if r.returncode == 0 else None


VERSION_RE = re.compile(
    r"^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$"
)


def vkey(v):
    """Semver-sortering med prerelease. → None hvis v ikke er en eksakt versjon.

    None er viktig: et range-pin (`7.x`, `^7.5.0`) skal ikke sammenlignes
    numerisk med en fiksversjon — det ga tidligere falske 🔴, fordi `7.x`
    ble lest som 7.0.0.
    """
    m = VERSION_RE.match(str(v).strip())
    if not m:
        return None
    major, minor, patch, pre = int(m[1]), int(m[2]), int(m[3]), m[4]
    if pre is None:
        return (major, minor, patch, 1, ())  # release rangerer over prerelease
    ids = tuple((0, int(p), "") if p.isdigit() else (1, 0, p) for p in pre.split("."))
    return (major, minor, patch, 0, ids)


# ---------------------------------------------------------------- alerts

def _alert(a):
    sv = a.get("security_vulnerability") or {}
    return {
        "pkg": ((a.get("dependency") or {}).get("package") or {}).get("name"),
        "sev": (a.get("security_advisory") or {}).get("severity"),
        "fix": (sv.get("first_patched_version") or {}).get("identifier"),
        "vuln": sv.get("vulnerable_version_range"),
        "n": a.get("number"),
    }


def open_alerts(repo):
    """→ liste med åpne varsler, eller None hvis de ikke kunne hentes.

    Bruker `--paginate --slurp`. GitHub kapper på 100 varsler per side, så
    uten paginering ville varsel nr. 101 og oppover vært usynlige — og pinner
    foran dem rapportert som friske. Merk at dette endepunktet *ikke* støtter
    `page`-parameteren (den gir HTTP 400); paginering er cursor-basert via
    Link-headeren, som `--paginate` følger. `--slurp` samler sidene i én
    JSON-verdi, ellers får vi flere arrayer etter hverandre som ikke kan
    json-parses.
    """
    raw = sh("gh", "api", "--paginate", "--slurp",
             f"repos/{repo}/dependabot/alerts?state=open&per_page=100")
    if raw is None:
        return None
    try:
        pages = json.loads(raw)
    except json.JSONDecodeError:
        return None
    if not isinstance(pages, list):
        return None
    # --slurp gir én liste per side. Tåler også en flat liste, i tilfelle
    # gh endrer formen.
    raw_alerts = []
    for page in pages:
        if isinstance(page, list):
            raw_alerts += page
        elif isinstance(page, dict):
            raw_alerts.append(page)
        else:
            return None
    return [_alert(a) for a in raw_alerts]


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
    → {"resolved": {range: version|None}, "pinok": {range: bool|None}} eller None"""
    script = (
        "const s=require('semver');const[vs,rs,pin]=JSON.parse(process.argv[1]);"
        "const f=(fn)=>{try{return fn()}catch(e){return null}};"
        "console.log(JSON.stringify({"
        "resolved:Object.fromEntries(rs.map(r=>[r,f(()=>s.maxSatisfying(vs,r))])),"
        "pinok:Object.fromEntries(rs.map(r=>[r,f(()=>s.satisfies(pin,r))]))"
        "}))"
    )
    out = sh("node", "-e", script, json.dumps([versions, ranges, str(pin)]), cwd="tavla")
    if out is None:
        return None
    try:
        return json.loads(out)
    except json.JSONDecodeError:
        return None


def vuln_hits(versions, ranges):
    """GitHub-intervaller ('>= 4.0.0, < 5.1.8') → semver-AND ('>=4.0.0 <5.1.8').

    → {"bad": [uparsebare intervall], "hits": {versjon: [intervall den ligger i]}}
      eller None hvis sjekken ikke kunne kjøres.

    Returnerer aldri «ingen treff» ved feil. Et intervall vi ikke klarer å
    tolke er ukjent risiko, ikke fravær av risiko.
    """
    conv = [r.replace(", ", " ").replace("= ", "=") for r in ranges if r]
    if not conv or not versions:
        return {"bad": [], "hits": {v: [] for v in versions}}
    script = (
        "const s=require('semver');const[vs,rs]=JSON.parse(process.argv[1]);"
        "const bad=rs.filter(r=>!s.validRange(r));"
        "console.log(JSON.stringify({bad,hits:Object.fromEntries(vs.map(v=>[v,"
        "rs.filter(r=>{try{return s.satisfies(v,r,{includePrerelease:true})}"
        "catch(e){return false}})]))}))"
    )
    out = sh("node", "-e", script, json.dumps([versions, conv]), cwd="tavla")
    if out is None:
        return None
    try:
        return json.loads(out)
    except json.JSONDecodeError:
        return None


def npm_versions(pkg):
    """→ liste med publiserte versjoner, eller None hvis npm ikke svarte."""
    raw = sh("npm", "view", pkg, "versions", "--json")
    if raw is None:
        return None
    try:
        v = json.loads(raw)
    except json.JSONDecodeError:
        return None
    return v if isinstance(v, list) else [v]


# ------------------------------------------------------------------ pins

def load_pins(path, repo):
    if os.path.exists(path):
        pkg = json.load(open(path))
    else:
        raw = sh("gh", "api", f"repos/{repo}/contents/package.json", "--jq", ".content")
        if not raw:
            return None
        try:
            pkg = json.loads(base64.b64decode(raw))
        except (ValueError, json.JSONDecodeError):
            return None
    return pkg.get("resolutions") or pkg.get("pnpm", {}).get("overrides", {}) or {}


# ----------------------------------------------------------------- report

blocking, unfixable, removable = [], [], []

print("=" * 72)
print("DEL 1 — Blokkerer noen pin en sikkerhetsfiks?")
print("=" * 72)

repos = [("entur/tavla", TAVLA_PKG), ("entur/tavla-visning", VISNING_PKG)]
pinmap, alertmap = {}, {}
for repo, path in repos:
    pins = load_pins(path, repo)
    pinmap[repo] = pins
    print(f"\n### {repo}")
    if pins is None:
        print("  ❔ fant ikke package.json, og kunne ikke hente den via gh — ikke sjekket")
        unchecked.append(f"{repo}: fikk ikke lest package.json")
        continue
    if not pins:
        print("  (ingen pinner)")
        continue
    alerts = open_alerts(repo)
    alertmap[repo] = alerts
    if alerts is None:
        print("  ❔ kunne ikke hente sikkerhetsvarsler (gh feilet — token, scope, nett?)")
        print("     INGEN av pinnene under er sjekket. Dette er ikke et grønt resultat.")
        unchecked.append(f"{repo}: fikk ikke hentet sikkerhetsvarsler, {len(pins)} pin(ner) usjekket")
        continue
    for name, pin in pins.items():
        hits = [a for a in alerts if a["pkg"] == name]
        if not hits:
            print(f"  ✅ {name}: pinnet {pin} — ingen åpne varsler")
            continue
        fixes = [a["fix"] for a in hits if a["fix"] and vkey(a["fix"])]
        need = max(fixes, key=vkey) if fixes else None
        sevs = ",".join(sorted({a["sev"] for a in hits if a["sev"]}))
        nums = ", #".join(str(a["n"]) for a in sorted(hits, key=lambda a: a["n"] or 0))
        word = "varsel" if len(hits) == 1 else "varsler"
        pk = vkey(pin)

        if need is None:
            unfixable.append((repo, name, pin, len(hits)))
            print(f"  🔴 {name}: pinnet {pin} — {len(hits)} {word} ({sevs}) har INGEN "
                  f"fiksversjon → #{nums}")
            print(f"       Kan ikke lukkes ved å bumpe. Enten bytter du versjonslinje, "
                  f"eller varselet må allowlistes/dismisses med begrunnelse "
                  f"(references/sikkerhets-triage.md, Steg 5).")
        elif pk is None:
            print(f"  ⚠️  {name}: pinnet «{pin}» er ikke en eksakt versjon, så den kan ikke "
                  f"sammenlignes med fiks {need} → #{nums}")
            print(f"       Tavla skal bruke eksakte pinner — se references/pin-vedlikehold.md.")
            unchecked.append(f"{repo}: {name} har ikke-eksakt pin «{pin}», ikke vurdert mot fiks")
        elif pk < vkey(need):
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
tavla_alerts = alertmap.get("entur/tavla")  # gjenbruk fra Del 1, ikke nytt kall
if not os.path.exists(TAVLA_LOCK):
    print("  ❔ fant ikke yarn.lock — kjør fra repo-rot i entur/tavla")
    unchecked.append("entur/tavla: yarn.lock ikke funnet, Del 2 ikke kjørt")
elif not tavla_pins:
    print("  (ingen pinner)")
elif tavla_alerts is None:
    print("  ❔ sikkerhetsvarsler manglet fra Del 1 — kan ikke avgjøre om en pin trengs")
    unchecked.append("entur/tavla: Del 2 ikke kjørt, varsler manglet")
else:
    entries = parse_berry(TAVLA_LOCK)
    for name, pin in tavla_pins.items():
        cons = consumers_of(entries, name)
        if not cons:
            print(f"  ❔ {name}: fant ingen konsumenter i yarn.lock — "
                  f"sjekk om pakken fortsatt er i bruk")
            unchecked.append(f"entur/tavla: {name} uten konsumenter i yarn.lock")
            continue
        versions = npm_versions(name)
        if not versions:
            print(f"  ❔ {name}: fikk ikke versjonsliste fra npm — sjekk manuelt")
            unchecked.append(f"entur/tavla: {name} manglet versjonsliste fra npm")
            continue
        ranges = sorted({r for _, r in cons})
        res = resolve_ranges(versions, ranges, pin)
        if res is None:
            print(f"  ❔ {name}: semver utilgjengelig (kjør `yarn install` i tavla/)")
            unchecked.append(f"entur/tavla: {name} kunne ikke resolveres, semver manglet")
            continue

        resolved = res["resolved"]

        # Ranges vi ikke klarte å resolve kan ikke bare droppes: da ville de
        # gjenværende «konvergere» og gi en falsk 🟢.
        unresolvable = sorted(r for r, v in resolved.items() if not v)
        if unresolvable:
            print(f"  ❔ {name}: klarte ikke å resolve {len(unresolvable)} av "
                  f"{len(ranges)} konsumentranges ({', '.join(unresolvable)}) — "
                  f"ikke rene semver-ranges (alias, patch: eller workspace:?). "
                  f"Kan ikke konkludere; sjekk manuelt.")
            unchecked.append(f"entur/tavla: {name} hadde {len(unresolvable)} uresolverbare ranges")
            continue

        distinct = sorted({v for v in resolved.values()}, key=vkey)

        pkg_alerts = [a for a in tavla_alerts if a["pkg"] == name]
        vulns = [a.get("vuln") for a in pkg_alerts]
        fixes = [a["fix"] for a in pkg_alerts if a["fix"] and vkey(a["fix"])]
        need = max(fixes, key=vkey) if fixes else None

        vh = vuln_hits(distinct, vulns)
        if vh is None:
            print(f"  ❔ {name}: kunne ikke sjekke de resolverte versjonene mot "
                  f"sårbare intervall — ikke konkludert")
            unchecked.append(f"entur/tavla: {name} ikke sjekket mot sårbare intervall")
            continue
        if vh["bad"]:
            print(f"  ❔ {name}: klarte ikke å tolke {len(vh['bad'])} sårbart intervall "
                  f"({', '.join(vh['bad'])}) — ukjent risiko, ikke konkludert")
            unchecked.append(f"entur/tavla: {name} hadde uparsebare sårbare intervall")
            continue

        unsafe = [v for v in distinct if vh["hits"].get(v)]

        # Tvinger pinnen noen konsument utenfor sin egen deklarasjon?
        outside = sorted({(lbl, r) for lbl, r in cons if res["pinok"].get(r) is False})

        if unsafe:
            fiks = f"fiks: {need}" if need else "ingen fiksversjon finnes"
            verdict = (f"  🔒 {name}: pinnet {pin} — PINNEN TRENGS. Uten den ville "
                       f"{', '.join(unsafe)} blitt liggende igjen, fortsatt i et sårbart "
                       f"intervall ({fiks}).")
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
            why = "; ".join(f"{lbl} krever {r}" for lbl, r in outside[:3])
            more = f" (+{len(outside) - 3} flere)" if len(outside) > 3 else ""
            print(f"       ⚠️  Pinnen tvinger konsumenter utenfor deklarasjonen sin: "
                  f"{why}{more}. Pakken kjører da på en versjon den ikke selv "
                  f"sier den støtter — se references/pin-vedlikehold.md.")

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
if unfixable:
    print(f"\n🔴 {len(unfixable)} pin(ner) står på en versjonslinje uten fiks — "
          f"varslene lukkes ikke av seg selv:")
    for repo, name, pin, n in unfixable:
        print(f"     {repo}: {name} {pin} → {n} varsel/varsler uten fiksversjon. "
              f"Bytt versjonslinje, eller allowlist med begrunnelse.")
if not blocking and not unfixable:
    # Bare grønt hvis alt faktisk ble sjekket. «Ingen funn» og «ikke sett
    # etter» må aldri skrives likt.
    if unchecked:
        print("❔ Ingen blokkerende pinner FUNNET, men auditen er ufullstendig (se under).")
    else:
        print("✅ Ingen pinner blokkerer fikser denne uken.")
if removable:
    print(f"\n🟢 {len(removable)} pin(ner) er trolig overflødige — vurder fjerning "
          f"(se references/pin-vedlikehold.md):")
    for name, pin, target in removable:
        print(f"     entur/tavla: {name} {pin} → fjern, resolverer til {target}")
    print("\n   Fjerning er å foretrekke framfor å heve pinnen: det gir Dependabot")
    print("   ansvaret tilbake, og pinnen kan ikke forfalle igjen.")
if unchecked:
    print()
    print("=" * 72)
    print(f"❔ {len(unchecked)} ting kunne IKKE sjekkes. Auditen er ufullstendig — "
          f"ikke før den inn i briefen som grønn:")
    for u in unchecked:
        print(f"     • {u}")
print("=" * 72)
sys.exit(1 if unchecked else 0)
