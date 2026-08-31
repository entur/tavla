#!/usr/bin/env python3
"""Hva er pinnet i de to Tavla-repoene, og hvor lenge har det stått?

Dette er den billige, ukentlige kjøringen: den leser `resolutions` (tavla) og
`pnpm.overrides` (tavla-visning), finner ut når hver pin sist ble satt, og
sorterer eldst først. Ingen nettverkskall, ingen npm, ingen semver.

Den konkluderer med vilje ingenting. En pin har ingen utløpsdato — den var
trygg da den ble satt — og alder er signalet på at det er verdt å se på den
igjen. Hvilken pin som faktisk skal røres, er en vurdering, og den gjør du
én pin om gangen:

    python3 .claude/skills/tavla-dependency-triage/scripts/pin-vurder.py <pakke>

Bruk (fra repo-rot i entur/tavla):
    python3 .claude/skills/tavla-dependency-triage/scripts/pin-oversikt.py

Krever git og lesetilgang til de to package.json-filene. Ingenting annet.
"""

import os
import sys

import _pinfelles as pf

REPOS = [
    ("entur/tavla", "tavla", pf.TAVLA_PKG),
    ("entur/tavla-visning", "visning", pf.VISNING_PKG),
]


def rows_for(repo_key, path, repo_name):
    """→ [(sortnøkkel, pakke, pin, datotekst, pr, aldertekst)] eller None.

    Bruker load_pins_local, ikke load_pins: gh-fallbacken ville gjort denne
    kjøringen nettverksavhengig, og det er nettopp fordi den *ikke* er det at
    den kan kjøre uten å spørre. Uten lokal checkout er alderen ukjent
    uansett, siden git-historikken mangler — halv informasjon er ikke verdt
    å bytte den egenskapen for.
    """
    pins = pf.load_pins_local(path)
    if pins is None:
        return None
    if not pins:
        return []
    changes = pf.all_value_changes(repo_key)
    rows = []
    for pkg, pin in pins.items():
        chain = None if changes is None else changes.get(pkg)
        last = chain[0] if chain else None
        if last is None:
            # Ukjent alder er ikke det samme som «ny». Fører den i unchecked.
            pf.unchecked.append(
                f"{repo_name}: fant ikke historikk for {pkg}, alder ukjent")
            rows.append(("9999-99-99", pkg, pin, "❔ ukjent", None, "❔"))
            continue
        datestr, _sha, pr, _before, _after = last
        rows.append((datestr, pkg, pin, datestr, pr, pf.human_age(datestr) or "❔"))
    rows.sort(key=lambda r: r[0])  # eldst først — det er prioriteringssignalet
    return rows


print("=" * 72)
print("PIN-OVERSIKT — hva er pinnet, og hvor lenge har det stått?")
print("=" * 72)
print("\nSortert eldst først. Alder er ikke en dom, men det er signalet:")
print("en pin som har stått lenge har hatt lang tid på å bli overflødig,")
print("eller på å blokkere en fiks uten at noen la merke til det.\n")

any_pins = False
for repo_name, repo_key, path in REPOS:
    branch = pf.current_branch(repo_key)
    head = f"### {repo_name}"
    print(f"{head}  (gren: {branch})" if branch else f"{head}  (gren: ❔)")
    if branch is None:
        pf.unchecked.append(f"{repo_name}: fant ikke git-checkout, historikk utilgjengelig")

    rows = rows_for(repo_key, path, repo_name)
    if rows is None:
        if not os.path.exists(path):
            print(f"  ❔ fant ikke {path} — klon repoet ved siden av tavla for å få")
            print("     pin-oversikt for det. Enkeltpinner kan vurderes uansett:")
            print(f"     pin-vurder.py <pakke> {repo_key}")
            pf.unchecked.append(f"{repo_name}: ikke klonet lokalt, pinner ikke listet")
        else:
            print(f"  ❔ klarte ikke å lese {path} — ugyldig JSON? (merge-konflikt?)")
            pf.unchecked.append(f"{repo_name}: package.json kunne ikke leses")
        print()
        continue
    if not rows:
        print("  (ingen pinner)\n")
        continue

    any_pins = True
    wpkg = max(len(r[1]) for r in rows)
    wpin = max(len(str(r[2])) for r in rows)
    for _key, pkg, pin, datestr, pr, age in rows:
        prtxt = f"(#{pr})" if pr else "(ukjent PR)"
        print(f"  {pkg:<{wpkg}}  {str(pin):<{wpin}}  sist satt {datestr} {prtxt:<13} {age}")
    print()

print("=" * 72)
if any_pins:
    print("Vurder én pin (blokkerer den en fiks? trengs den fortsatt?):")
    print("  python3 .claude/skills/tavla-dependency-triage/scripts/pin-vurder.py "
          "<pakke> [tavla|visning]")
    print()
    print("Kryss lista mot de åpne sikkerhetsvarslene fra Steg 1: står en pinnet")
    print("pakke også der, er den kandidat nummer én.")

if pf.unchecked:
    print()
    print(f"❔ {len(pf.unchecked)} ting kunne IKKE sjekkes — oversikten er ufullstendig:")
    for u in pf.unchecked:
        print(f"     • {u}")
print("=" * 72)
sys.exit(1 if pf.unchecked else 0)
