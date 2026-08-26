#!/usr/bin/env python3
"""Vurder ÉN pinnet pakke: blokkerer pinnen en fiks, og trengs den fortsatt?

Dette er den dyre halvparten av pin-arbeidet, og den kjøres bevisst én pakke
om gangen. `pin-oversikt.py` sier hva som er pinnet og hvor gammelt det er;
dette scriptet svarer på hva som bør gjøres med én av dem.

Bruk (fra repo-rot i entur/tavla):
    python3 .claude/skills/tavla-dependency-triage/scripts/pin-vurder.py tar
    python3 .claude/skills/tavla-dependency-triage/scripts/pin-vurder.py immutable visning

FEILER LUKKET. Kan noe ikke sjekkes, sies det med ❔ og exit-kode 1 — aldri
med en beroligende konklusjon. Se `references/pin-vedlikehold.md` for
beslutningsrekkefølgen «fjern → eksakt + audit».

Krever `gh` autentisert, nettverk mot npm, og node med `semver`
(tavla/node_modules etter `yarn install`).
"""

import os
import sys

import _pinfelles as pf

REPOS = {
    "tavla": ("entur/tavla", pf.TAVLA_PKG),
    "visning": ("entur/tavla-visning", pf.VISNING_PKG),
}

if not 2 <= len(sys.argv) <= 3:
    print(__doc__)
    sys.exit(2)

name = sys.argv[1]
repo_key = sys.argv[2] if len(sys.argv) == 3 else "tavla"
if repo_key not in REPOS:
    print(f"Ukjent repo «{repo_key}». Bruk tavla eller visning.")
    sys.exit(2)
repo, pkg_path = REPOS[repo_key]

pins = pf.load_pins(pkg_path, repo)
if pins is None:
    print(f"❔ fikk ikke lest package.json for {repo} — ingenting vurdert")
    sys.exit(1)
pin = pins.get(name)
if pin is None:
    print(f"«{name}» er ikke pinnet i {repo}. Pinnede pakker der:")
    for k, v in sorted(pins.items()):
        print(f"  • {k} ({v})")
    sys.exit(1)

print("=" * 72)
print(f"{name} — pinnet {pin} i {repo}")
print("=" * 72)

# ------------------------------------------------------------- historikk

print("\n## Hvorfor står pinnen der?\n")
chain = pf.value_changes(name, repo_key)
if chain is None:
    print("  ❔ kunne ikke lese git-historikken")
    pf.unchecked.append(f"{repo}: historikk for {name} utilgjengelig")
elif not chain:
    print("  ❔ fant ingen verdiendring for pinnen i historikken til blokka")
    pf.unchecked.append(f"{repo}: ingen historikk-treff for {name}")
else:
    for datestr, sha, pr, before, after in chain:
        prtxt = f"#{pr}" if pr else sha[:8]
        wat = f"{before} → {after}" if before else f"innført på {after}"
        print(f"  {datestr}  {prtxt:<8} {wat}")
    age = pf.human_age(chain[0][0])
    print(f"\n  Sist satt for {age} siden. JSON tåler ikke kommentarer, så")
    print("  PR-tittelen er dokumentasjonen — les den før du rører pinnen.")

# --------------------------------------------- 1. blokkerer pinnen en fiks?

print("\n## 1. Blokkerer pinnen en fiks?\n")
alerts = pf.open_alerts(repo)
need = None
verdict1 = None
if alerts is None:
    print("  ❔ kunne ikke hente sikkerhetsvarsler (gh: token, scope, nett?)")
    print("     Dette er ikke et grønt resultat — ingenting er sjekket.")
    pf.unchecked.append(f"{repo}: varsler for {name} ikke hentet")
else:
    hits = [a for a in alerts if a["pkg"] == name]
    if not hits:
        verdict1 = "ok"
        print(f"  ✅ ingen åpne varsler for {name}")
    else:
        fixes = [a["fix"] for a in hits if a["fix"] and pf.vkey(a["fix"])]
        need = max(fixes, key=pf.vkey) if fixes else None
        sevs = ",".join(sorted({a["sev"] for a in hits if a["sev"]}))
        nums = ", #".join(str(a["n"]) for a in sorted(hits, key=lambda a: a["n"] or 0))
        word = "varsel" if len(hits) == 1 else "varsler"
        pk = pf.vkey(pin)
        if need is None:
            verdict1 = "unfixable"
            print(f"  🔴 {len(hits)} {word} ({sevs}) har INGEN fiksversjon → #{nums}")
            print("     Kan ikke lukkes ved å bumpe, uansett hvor høyt du går.")
        elif pk is None:
            verdict1 = "nonexact"
            print(f"  ⚠️  pinnen «{pin}» er ikke en eksakt versjon, så den kan ikke")
            print(f"     sammenlignes med fiks {need} → #{nums}")
            pf.unchecked.append(f"{repo}: {name} har ikke-eksakt pin, ikke vurdert mot fiks")
        elif pk < pf.vkey(need):
            verdict1 = "blocking"
            print(f"  🔴 pinnet {pin}, men fiks krever {need} — BLOKKERER "
                  f"{len(hits)} {word} ({sevs}) → #{nums}")
        else:
            verdict1 = "merged"
            print(f"  🟡 pinnet {pin} ≥ fiks {need} — {word} lukkes når "
                  f"endringen er merget → #{nums}")

# ------------------------------------------- 2. trengs pinnen fortsatt?

print("\n## 2. Trengs pinnen fortsatt?\n")
verdict2 = None
target = None

if repo_key == "visning":
    print("  ⚠️  pnpm-lock v9 lagrer resolverte versjoner, ikke konsumentenes")
    print("      ranges, så dette kan ikke avgjøres automatisk. Test manuelt:")
    print(f"\n      Fjern «{name}» fra pnpm.overrides og kjør:")
    print("        pnpm install --lockfile-only")
    print(f"        grep -n '^  {name}@' pnpm-lock.yaml")
    print("\n      Én kopi på en trygg versjon ⇒ pinnen kan fjernes permanent.")
    pf.unchecked.append(f"{repo}: {name} Del 2 må gjøres manuelt (pnpm-lock v9)")
elif alerts is None:
    print("  ❔ varsellista manglet, så en trygg/usikker-vurdering er umulig")
else:
    entries = pf.parse_berry(pf.TAVLA_LOCK) if os.path.exists(pf.TAVLA_LOCK) else None
    if entries is None:
        print("  ❔ fant ikke tavla/yarn.lock — kjør fra repo-rot i entur/tavla")
        pf.unchecked.append(f"{repo}: yarn.lock ikke funnet")
    else:
        cons = pf.consumers_of(entries, name)
        versions = pf.npm_versions(name) if cons else None
        if not cons:
            print(f"  ❔ fant ingen konsumenter av {name} i yarn.lock — er pakken i bruk?")
            pf.unchecked.append(f"{repo}: {name} uten konsumenter i yarn.lock")
        elif not versions:
            print("  ❔ fikk ikke versjonsliste fra npm")
            pf.unchecked.append(f"{repo}: {name} manglet versjonsliste fra npm")
        else:
            ranges = sorted({r for _, r in cons})
            res = pf.resolve_ranges(versions, ranges, pin)
            if res is None:
                print("  ❔ semver utilgjengelig (kjør `yarn install` i tavla/)")
                pf.unchecked.append(f"{repo}: {name} kunne ikke resolveres")
            else:
                resolved = res["resolved"]
                unresolvable = sorted(r for r, v in resolved.items() if not v)
                if unresolvable:
                    print(f"  ❔ klarte ikke å resolve {len(unresolvable)} av {len(ranges)}")
                    print(f"     konsumentranges ({', '.join(unresolvable)}) — ikke rene")
                    print("     semver-ranges (alias, patch: eller workspace:?)")
                    pf.unchecked.append(f"{repo}: {name} hadde uresolverbare ranges")
                else:
                    distinct = sorted(set(resolved.values()), key=pf.vkey)
                    pkg_alerts = [a for a in alerts if a["pkg"] == name]
                    vulns = [a.get("vuln") for a in pkg_alerts]
                    vh = pf.vuln_hits(distinct, vulns)
                    if vh is None:
                        print("  ❔ kunne ikke sjekke mot sårbare intervall")
                        pf.unchecked.append(f"{repo}: {name} ikke sjekket mot intervall")
                    elif vh["bad"]:
                        print(f"  ❔ klarte ikke å tolke {len(vh['bad'])} sårbart intervall")
                        print(f"     ({', '.join(vh['bad'])}) — ukjent risiko")
                        pf.unchecked.append(f"{repo}: {name} uparsebare intervall")
                    else:
                        unsafe = [v for v in distinct if vh["hits"].get(v)]
                        fiks = f"fiks: {need}" if need else "ingen fiksversjon finnes"
                        if unsafe:
                            verdict2 = "needed"
                            print(f"  🔒 PINNEN TRENGS. Uten den ville {', '.join(unsafe)}")
                            print(f"     blitt liggende igjen, fortsatt i et sårbart "
                                  f"intervall ({fiks}).")
                        elif len(distinct) == 1:
                            verdict2, target = "removable", distinct[0]
                            print(f"  🟢 KAN FJERNES. Alle {len(ranges)} konsumentranges")
                            print(f"     ({', '.join(ranges)}) konvergerer til {target}")
                            print(f"     uten pinnen — én kopi, "
                                  f"{'utenfor alle sårbare intervall' if need else 'ingen åpne varsler'}.")
                        else:
                            verdict2 = "dedup"
                            print(f"  🟡 pinnen tjener deduplisering. Uten den blir det")
                            print(f"     {len(distinct)} kopier ({', '.join(distinct)}), alle trygge.")

                        outside = sorted({(l, r) for l, r in cons
                                          if res["pinok"].get(r) is False})
                        if outside:
                            why = "; ".join(f"{l} krever {r}" for l, r in outside[:3])
                            more = f" (+{len(outside) - 3} flere)" if len(outside) > 3 else ""
                            print(f"\n  ⚠️  Pinnen tvinger konsumenter utenfor deklarasjonen")
                            print(f"      sin: {why}{more}. Pakken kjører på en versjon den")
                            print("      ikke selv sier den støtter — alltid verdt å rette.")

# --------------------------------------------------------------- anbefaling

print("\n## Anbefaling\n")
if verdict2 == "removable":
    print(f"  ✅ Fjern pinnen. Uten den resolverer {name} til {target}, i én kopi.")
    if verdict1 == "blocking":
        print(f"     Det lukker samtidig varslene pinnen blokkerer (fiks {need}).")
    print("     Fjerning slår heving: Dependabot får ansvaret tilbake permanent,")
    print("     og pinnen kan ikke forfalle igjen.")
elif verdict2 == "dedup":
    print("  ⚖️  Kan fjernes, men da får du flere kopier — alle trygge. Avveining.")
    if verdict1 == "blocking":
        print(f"     Blir den stående, må den heves til minst {need}.")
elif verdict2 == "needed":
    print("  🔒 Pinnen må bli stående.")
    if verdict1 == "blocking":
        print(f"     Hev den til minst {need}, og skriv i PR-tittelen hvorfor")
        print("     pinnen ikke kan fjernes.")
elif verdict1 == "unfixable":
    print("  🔴 Ingen fiksversjon finnes for denne linja. Bytt versjonslinje, eller")
    print("     allowlist varselet med begrunnelse — se references/sikkerhets-triage.md,")
    print("     Steg 5. Å la det ligge åpent er ikke et utfall.")
elif verdict1 == "blocking":
    # Del 2 er uavklart, men blokkeringen står. Den skal ikke forsvinne av at
    # den andre halvparten ikke kunne kjøres.
    print(f"  🔴 Pinnen blokkerer en fiks: den må minst til {need}.")
    print("     Avgjør først om den kan fjernes helt — det er det beste utfallet,")
    print("     og for tavla-visning må det gjøres manuelt (se Del 2 over).")
    print(f"     Kan den ikke fjernes, hev til {need} og skriv hvorfor den blir stående.")
elif verdict1 == "merged":
    print("  ⏸ Pinnen ligger allerede på eller over fiksversjonen — varslene lukkes")
    print("     når endringen er merget. Ingen handling utover det.")
elif verdict1 == "ok" and verdict2 is None:
    print("  ⏸ Del 2 kunne ikke avgjøres (se over). Ingen åpne varsler i mellomtiden.")
else:
    print("  ⏸ Ikke nok grunnlag til en anbefaling — se ❔-linjene over.")

print("\n  Beslutningsrekkefølgen er fjern → eksakt + audit. Range i resolutions")
print("  brukes ikke i Tavla; se references/pin-vedlikehold.md.")

if pf.unchecked:
    print()
    print("=" * 72)
    print(f"❔ {len(pf.unchecked)} ting kunne IKKE sjekkes — vurderingen er ufullstendig:")
    for u in pf.unchecked:
        print(f"     • {u}")
print("=" * 72)
sys.exit(1 if pf.unchecked else 0)
