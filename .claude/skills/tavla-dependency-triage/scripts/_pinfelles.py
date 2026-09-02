"""Delt grunnlag for pin-scriptene i dependency-triage-skillen.

Brukes av `pin-oversikt.py` (billig, ukentlig) og `pin-vurder.py` (dyr, én
pin om gangen). Ingen av funksjonene her skriver noe.

FEILER LUKKET, IKKE ÅPENT. Et verktøy som skal avdekke pinner ingen ser på,
må aldri kunne si «alt i orden» fordi et kall feilet. Derfor returnerer
`sh()` None ved feil — aldri tom streng — og hver funksjon som bygger på den
skiller «vet ikke» fra «tomt resultat». Kallerne fører det de ikke fikk
sjekket i `unchecked` og avslutter med exit-kode 1.

`pin-vurder.py` krever `gh` autentisert, nettverk mot npm, og node med
`semver` (ligger i tavla/node_modules etter `yarn install`). `pin-oversikt.py`
krever bare git og lesetilgang til de to package.json-filene.
"""

import base64
import json
from datetime import date
import os
import re
import subprocess

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

def _pins_from(pkg):
    return pkg.get("resolutions") or pkg.get("pnpm", {}).get("overrides", {}) or {}


def load_pins_local(path):
    """→ pin-dict fra en lokal package.json, eller None. Rører aldri nettverket.

    None betyr «vet ikke», ikke «ingen pinner»: en package.json som ikke kan
    leses — for eksempel midt i en uavklart merge-konflikt — skal gi ❔ og
    exit 1 hos kalleren, ikke en traceback.
    """
    if not os.path.exists(path):
        return None
    try:
        with open(path) as f:
            return _pins_from(json.load(f))
    except (OSError, json.JSONDecodeError):
        return None


def load_pins(path, repo):
    """Som load_pins_local, men faller tilbake på `gh api` når fila mangler.

    Fallbacken koster nettverk og et autentisert gh, så den hører bare i
    `pin-vurder.py`, som brukeren kjører bevisst. `pin-oversikt.py` bruker
    load_pins_local og holder seg lokal.
    """
    if os.path.exists(path):
        return load_pins_local(path)
    raw = sh("gh", "api", f"repos/{repo}/contents/package.json", "--jq", ".content")
    if not raw:
        return None
    try:
        return _pins_from(json.loads(base64.b64decode(raw)))
    except (ValueError, json.JSONDecodeError):
        return None


# ------------------------------------------------------------- git-historikk

# Hvor pin-blokka ligger i hvert repo: (linjeområde for `git log -L`,
# repo-relativ filsti, arbeidskatalog for git).
PIN_BLOCK = {
    "tavla": (r'/"resolutions": {/,/^    }/', "tavla/package.json", None),
    "visning": (r'/"overrides": {/,/^    }/', "package.json", "../tavla-visning"),
}


def current_branch(repo_key):
    """→ navnet på grenen historikken leses fra, eller None."""
    _, _, cwd = PIN_BLOCK[repo_key]
    return sh("git", "rev-parse", "--abbrev-ref", "HEAD", cwd=cwd)


def block_commits(repo_key):
    """→ [(sha, dato, emne)] for hver commit som rørte pin-blokka, nyest først.

    `git log -L` på hele blokka, ikke `git blame` på en linje: blame er
    upålitelig her, fordi enhver kosmetisk endring overtar linja.
    → None hvis git ikke svarte.
    """
    rng, path, cwd = PIN_BLOCK[repo_key]
    out = sh("git", "log", "-L", f"{rng}:{path}",
             "--format=%H%x09%ad%x09%s", "--date=short", "--no-patch", cwd=cwd)
    if out is None:
        return None
    rows = []
    for line in out.splitlines():
        parts = line.split("\t")
        if len(parts) == 3 and len(parts[0]) == 40:
            rows.append((parts[0], parts[1], parts[2]))
    return rows


_pins_cache = {}


def pins_at(repo_key, ref):
    """→ pin-dicten slik den var ved `ref`, eller None hvis den ikke kunne leses."""
    key = (repo_key, ref)
    if key in _pins_cache:
        return _pins_cache[key]
    _, path, cwd = PIN_BLOCK[repo_key]
    raw = sh("git", "show", f"{ref}:{path}", cwd=cwd)
    val = None
    if raw is not None:
        try:
            d = json.loads(raw)
        except json.JSONDecodeError:
            d = None
        if d is not None:
            val = _pins_from(d)
    _pins_cache[key] = val
    return val


def all_value_changes(repo_key, commits=None):
    """→ {pakke: [(dato, sha, pr, fra, til)]}, nyest først, eller None.

    Sammenligner de faktiske pin-dictene ved hver commit og forelderen dens.
    Å parse diff-linjer ville vært galt: en pakke kan stå i både
    `dependencies` og `resolutions`. `dompurify` gjør nettopp det i
    entur/tavla, og #2301 endret bare dependencies-oppføringen — en
    linjebasert lesning ville tilskrevet pinnen den endringen.

    En commit som bare flyttet et komma gir ingen dict-endring, og faller
    dermed ut av seg selv. Det er den samme fella `git blame` går i.
    """
    if commits is None:
        commits = block_commits(repo_key)
    if commits is None:
        return None
    out = {}
    for sha, datestr, subject in commits:
        after = pins_at(repo_key, sha)
        before = pins_at(repo_key, f"{sha}^")
        if after is None or before is None:
            continue
        pr = re.search(r"\(#(\d+)\)", subject)
        for pkg, val in after.items():
            if before.get(pkg) == val:
                continue
            out.setdefault(pkg, []).append(
                (datestr, sha, pr.group(1) if pr else None, before.get(pkg), val))
    return out


def value_changes(pkg, repo_key, commits=None):
    """→ endringskjeden for én pakke, nyest først, eller None."""
    allc = all_value_changes(repo_key, commits)
    return None if allc is None else allc.get(pkg, [])


def human_age(datestr):
    """→ alder i lesbar form, eller None hvis datoen ikke kan tolkes."""
    try:
        y, m, d = (int(x) for x in datestr.split("-"))
        days = (date.today() - date(y, m, d)).days
    except (ValueError, TypeError):
        return None
    if days < 0:
        return "i dag"
    if days < 14:
        return f"{days} d"
    if days < 60:
        return f"{days // 7} uker"
    if days < 730:
        return f"{days // 30} mnd"
    return f"{days // 365} år"
