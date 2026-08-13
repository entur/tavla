"""
Purpose: Berik tiles[].linesWithDirection[].frontTexts med retninger 017 ikke rakk å se

Description:
    Migrering 017 hentet frontTexts fra journey-planner med `numberOfDepartures: 200`.
    Den parameteren er et tak på RÅ avganger hentet FØR
    `numberOfDeparturesPerLineAndDestinationDisplay: 1` deduplikerer, og avgjør derfor
    i praksis hvor langt fram i tid spørringen rekker — ikke `timeRange`. Målt på
    Trondheim S pl. 11 rakk 200 kun ~1,8 døgn, godt innenfor 017 sitt 30-dagersvindu.

    Konsekvens: retninger som eksisterer, men ikke rakk å bli observert, mangler i
    lagrede frontTexts. Visningen filtrerer på (lineId, frontText), så disse avgangene
    blir stille filtrert bort fra tavla. Det er den alvorlige feilen — passasjerer
    mister avganger.

    Denne migreringen er STRENGT ADDITIV:
      - legger til manglende frontTexts på entries som allerede har en ikke-tom liste
      - fjerner aldri linjer eller retninger
      - legger aldri til nye linjer
      - rører ALDRI entries med frontTexts: []

    Det siste er kritisk. `[]` betyr «alle retninger». Å legge til der ville snevret
    inn fra «alle» til «disse», altså en regresjon. Slike entries hoppes over.

    Avgrensning til boards uten brukerintensjon:
      017 skrev kun `tiles`, aldri `meta.dateModified`. Admin bygger linesWithDirection
      fra bunnen ved hver lagring. Boards med dateModified ELDRE enn 017-kjøringen
      (10. juli 2026) har derfor fortsatt 017 sin output, uten brukervalg lagt oppå —
      de kan beriges trygt. Boards lagret etter 017 røres ikke; der er dataene admin
      sitt verk.

    Boards uten dateModified hoppes over (kan ikke bevises urørt).

    Merk: å utvide frontTexts kan gjøre at avganger med samme linje og retning fra en
    SØSKEN-quay på samme stoppested også vises. Det er tiltenkt oppførsel — spor-bytte
    var hele grunnen til at filtreringen ble flyttet til (lineId, frontText). Retningen
    legges kun til når den faktisk betjenes fra tileens egen quay.

    Denne migreringen fikser IKKE fantomlinjer (linjer fra quay.lines uten avganger,
    lagret som frontTexts: []). Det krever en endring av utvalgsregelen og er en
    separat beslutning.

    API-kall gjøres i en prefetch-fase UTENFOR transaksjonene (011 gjorde kall inne i
    transaksjon -> GCP-timeout). Transaksjonscallbacken er fri for side-effekter, siden
    Firestore kan kjøre den om igjen ved contention.

Usage:
    # Tørrkjøring (default — skriver ingenting, kun rapport):
    ./migration run scripts/019_enrich_linesWithDirection_frontTexts.py local

    # Faktisk skriving:
    ./migration run scripts/019_enrich_linesWithDirection_frontTexts.py local --write

    # Begrens til de N første boardene (rask test):
    ./migration run scripts/019_enrich_linesWithDirection_frontTexts.py local --limit 50

Date: 2026-08-11
Author: Guro
"""

import copy
import sys
import time
from datetime import datetime, timezone

import init
import requests
from google.cloud import firestore

COLLECTION = "boards"

JOURNEY_PLANNER_URL = "https://api.entur.io/journey-planner/v3/graphql"
CLIENT_NAME = "entur-tavla"
API_SLEEP_SECONDS = 0.2
API_MAX_RETRIES = 3
API_RETRY_BACKOFF_SECONDS = 2
API_TIMEOUT_SECONDS = 30
LOG_FILENAME = "migration_019_log.txt"

# Boards lagret ETTER dette tidspunktet røres ikke — der er linesWithDirection
# bygget av admin, ikke av 017.
#
# 017 ble kjørt i prod 10. juli 2026. Cutoff settes til STARTEN av den dagen, ikke
# selve kjøretidspunktet: et board lagret den 10. kan ha blitt lagret enten før eller
# etter migreringen, og vi kan ikke skille dem. Slike boards regnes derfor som
# ineligible — bedre å hoppe over noen som kunne vært beriket enn å overskrive et
# reelt brukervalg.
MIGRATION_017_RUN = datetime(2026, 7, 10, tzinfo=timezone.utc)
MIGRATION_017_RUN_MS = int(MIGRATION_017_RUN.timestamp() * 1000)

# Samme tak som admin bruker etter justeringen. numberOfDepartures er det som
# faktisk styrer rekkevidden; 1000 gir ~6 døgn på travle quays og full dekning
# på rolige. 2000 ga kun 2 par ekstra i måling — gevinsten flater ut.
QUAY_ESTIMATED_CALLS_QUERY = """
query QuayEstimatedCalls(
    $quayId: String!
    $arrivalDeparture: ArrivalDeparture = departures
) {
    quay(id: $quayId) {
        estimatedCalls(
            numberOfDepartures: 1000
            numberOfDeparturesPerLineAndDestinationDisplay: 1
            timeRange: 2592000
            includeCancelledTrips: true
            arrivalDeparture: $arrivalDeparture
        ) {
            destinationDisplay {
                frontText
            }
            serviceJourney {
                line {
                    id
                }
            }
        }
    }
}
"""


def board_arrival_or_departure(data: dict) -> str:
    """Ankomsttavler enumererer ankomst-frontTexts, ellers avgang."""
    return "arrivals" if data.get("isArrivals") else "departures"


def board_is_eligible(data: dict) -> tuple[bool, str]:
    """
    Returnerer (kan_beriges, grunn). Kun boards urørt siden 017 kan beriges —
    der finnes ingen brukervalg å overskrive.
    """
    modified = (data.get("meta") or {}).get("dateModified")
    if modified is None:
        return False, "mangler dateModified"
    if modified >= MIGRATION_017_RUN_MS:
        return False, "lagret etter 017"
    return True, ""


def tile_is_eligible(tile: dict) -> bool:
    """
    Tilen må være quay-scopet (ellers vet vi ikke hvilken plattform å slå opp)
    og ha minst én entry med eksplisitte frontTexts å berike.
    """
    if not tile.get("quays"):
        return False
    return any(
        entry.get("frontTexts")
        for entry in tile.get("linesWithDirection") or []
    )


# ---------------------------------------------------------------------------
# Fase A: scan + samle nødvendige API-oppslag
# ---------------------------------------------------------------------------
def scan_and_collect(db: firestore.Client, limit: int | None) -> tuple:
    stats = {
        "total_boards": 0,
        "eligible_boards": 0,
        "skipped_saved_after_017": 0,
        "skipped_missing_modified": 0,
        "total_tiles": 0,
        "eligible_tiles": 0,
        "all_direction_entries": 0,
    }
    needed = set()

    for doc_snap in stream_in_batches(db.collection(COLLECTION), limit=limit):
        stats["total_boards"] += 1
        data = doc_snap.to_dict() or {}
        tiles = data.get("tiles") or []
        stats["total_tiles"] += len(tiles)

        eligible, reason = board_is_eligible(data)
        if not eligible:
            if reason == "lagret etter 017":
                stats["skipped_saved_after_017"] += 1
            else:
                stats["skipped_missing_modified"] += 1
            continue

        arrival_or_departure = board_arrival_or_departure(data)
        board_has_work = False

        for tile in tiles:
            stats["all_direction_entries"] += sum(
                1
                for entry in tile.get("linesWithDirection") or []
                if not entry.get("frontTexts")
            )
            if not tile_is_eligible(tile):
                continue
            stats["eligible_tiles"] += 1
            board_has_work = True
            for quay in tile.get("quays") or []:
                quay_id = quay.get("id")
                if quay_id:
                    needed.add((quay_id, arrival_or_departure))

        if board_has_work:
            stats["eligible_boards"] += 1

    return stats, needed


def print_scan_summary(stats: dict, needed: set | None):
    print("\n📊 Status før migrering:")
    print(f"   Boards skannet          : {stats['total_boards']}")
    print(f"   Boards som kan beriges  : {stats['eligible_boards']}")
    print(f"   — hoppet: lagret etter 017 : {stats['skipped_saved_after_017']}")
    print(f"   — hoppet: mangler dateModified : {stats['skipped_missing_modified']}")
    print(f"   Tileer totalt           : {stats['total_tiles']}")
    print(f"   Tileer som kan beriges  : {stats['eligible_tiles']}")
    print(f"   Entries med [] (urørt)  : {stats['all_direction_entries']}")
    if needed is not None:
        print(f"   Unike quay-oppslag      : {len(needed)}")


# ---------------------------------------------------------------------------
# Fase B: prefetch frontTexts per (quayId, arrival_or_departure) — UTENFOR transaksjon
# ---------------------------------------------------------------------------
def fetch_quay_fronttexts(quay_id: str, arrival_or_departure: str) -> dict:
    """
    Returnerer { lineId: set(frontText) } observert på quayen.
    Prøver på nytt med backoff; kaster siste feil når alle forsøk er brukt opp.
    """
    last_error = None
    for attempt in range(1, API_MAX_RETRIES + 1):
        try:
            response = requests.post(
                JOURNEY_PLANNER_URL,
                headers={
                    "Content-Type": "application/json",
                    "ET-Client-Name": CLIENT_NAME,
                },
                json={
                    "query": QUAY_ESTIMATED_CALLS_QUERY,
                    "variables": {
                        "quayId": quay_id,
                        "arrivalDeparture": arrival_or_departure,
                    },
                },
                timeout=API_TIMEOUT_SECONDS,
            )
            response.raise_for_status()
            payload = response.json()

            # GraphQL kan svare 200 med errors + null data -> behandle som feil.
            if payload.get("errors"):
                raise RuntimeError(f"GraphQL errors: {payload['errors']}")

            quay = (payload.get("data") or {}).get("quay") or {}

            fronttexts: dict = {}
            for call in quay.get("estimatedCalls") or []:
                line = (call.get("serviceJourney") or {}).get("line") or {}
                line_id = line.get("id")
                front_text = (call.get("destinationDisplay") or {}).get("frontText")
                if not line_id or not front_text:
                    continue
                fronttexts.setdefault(line_id, set()).add(front_text)

            return fronttexts

        except Exception as e:  # noqa: BLE001 - transient nettverks-/API-feil
            last_error = e
            if attempt < API_MAX_RETRIES:
                time.sleep(API_RETRY_BACKOFF_SECONDS * (2 ** (attempt - 1)))

    raise last_error


def build_cache(needed: set) -> tuple:
    """
    Returnerer (cache, failed):
      - cache:  { (quayId, arrival_or_departure): { lineId: set(frontText) } }
      - failed: set av oppslag som feilet etter alle forsøk
    """
    cache = {}
    failed = set()
    total = len(needed)

    with open(LOG_FILENAME, "a", encoding="utf-8") as log_file:
        log_file.write(f"\n===== PREFETCH ({total} unike quay-oppslag) =====\n")
        for i, (quay_id, arrival_or_departure) in enumerate(sorted(needed), start=1):
            try:
                fronttexts = fetch_quay_fronttexts(quay_id, arrival_or_departure)
                cache[(quay_id, arrival_or_departure)] = fronttexts
                log_file.write(
                    f"🔍 {quay_id} [{arrival_or_departure}]: {len(fronttexts)} linjer, "
                    f"{sum(len(v) for v in fronttexts.values())} frontTexts\n"
                )
            except Exception as e:  # noqa: BLE001
                failed.add((quay_id, arrival_or_departure))
                log_file.write(
                    f"❌ {quay_id} [{arrival_or_departure}]: API-feil etter "
                    f"{API_MAX_RETRIES} forsøk: {e} — tiles som bruker denne quayen "
                    f"hoppes over\n"
                )

            if i % 25 == 0:
                log_file.flush()
                print(f"   Prefetch {i}/{total} quay-oppslag...")

            time.sleep(API_SLEEP_SECONDS)

        if failed:
            log_file.write(f"\n⚠️ {len(failed)} quay-oppslag feilet totalt.\n")

    return cache, failed


# ---------------------------------------------------------------------------
# Fase C: transform (ren, uten I/O) + transaksjonell skriv
# ---------------------------------------------------------------------------
def observed_fronttexts_for_tile(tile: dict, arrival_or_departure: str, cache: dict) -> dict:
    """Union av observerte frontTexts per linje på tvers av tileens egne quays."""
    acc: dict = {}
    for quay in tile.get("quays") or []:
        cached = cache.get((quay.get("id"), arrival_or_departure), {})
        for line_id, fronttexts in cached.items():
            acc.setdefault(line_id, set()).update(fronttexts)
    return acc


def enrich_tile(tile: dict, arrival_or_departure: str, cache: dict) -> tuple:
    """
    Muterer tile in-place. Returnerer (antall_linjer_endret, antall_retninger_lagt_til,
    detaljer) der detaljer er en liste med (lineId, [nye frontTexts]).

    Additiv: kun entries med eksisterende ikke-tom frontTexts berikes.
    """
    observed = observed_fronttexts_for_tile(tile, arrival_or_departure, cache)
    lines_changed = 0
    fronttexts_added = 0
    details = []

    for entry in tile.get("linesWithDirection") or []:
        existing = entry.get("frontTexts") or []
        if not existing:
            # frontTexts: [] betyr "alle retninger" — å legge til her ville snevret inn.
            continue

        new_fronttexts = observed.get(entry.get("lineId"), set()) - set(existing)
        if not new_fronttexts:
            continue

        entry["frontTexts"] = sorted(set(existing) | new_fronttexts)
        lines_changed += 1
        fronttexts_added += len(new_fronttexts)
        details.append((entry.get("lineId"), sorted(new_fronttexts)))

    return lines_changed, fronttexts_added, details


def transform_tiles(tiles: list, arrival_or_departure: str, cache: dict, failed: set) -> tuple:
    """
    Ren funksjon (ingen I/O — trygg ved transaksjons-retry).
    Returnerer (new_tiles, tiles_changed, lines_changed, fronttexts_added, log_lines).
    """
    new_tiles = copy.deepcopy(tiles)
    tiles_changed = 0
    lines_changed = 0
    fronttexts_added = 0
    log_lines: list = []

    for tile in new_tiles:
        if not tile_is_eligible(tile):
            continue

        quay_ids = [q.get("id") for q in tile.get("quays") or []]
        if any((quay_id, arrival_or_departure) in failed for quay_id in quay_ids):
            log_lines.append(
                f"⏭️ tile {tile.get('uuid', '?')}: hoppet over (API-feil på quay)"
            )
            continue

        tile_lines, tile_added, details = enrich_tile(tile, arrival_or_departure, cache)
        if tile_lines == 0:
            continue

        tiles_changed += 1
        lines_changed += tile_lines
        fronttexts_added += tile_added
        for line_id, added in details:
            log_lines.append(
                f"➕ tile {tile.get('uuid', '?')} · {line_id}: {added}"
            )

    return new_tiles, tiles_changed, lines_changed, fronttexts_added, log_lines


@firestore.transactional
def migrate_board(transaction, board_ref, cache, failed, write: bool):
    """
    Side-effekt-fri: read + (evt.) update, returnerer resultat kalleren logger
    etter commit. Firestore kan kjøre denne om igjen ved contention.
    """
    snapshot = board_ref.get(transaction=transaction)
    if not snapshot.exists:
        return {"status": "missing", "log_lines": []}

    data = snapshot.to_dict() or {}
    eligible, reason = board_is_eligible(data)
    if not eligible:
        return {"status": "skip", "reason": reason, "log_lines": []}

    tiles = data.get("tiles") or []
    if not any(tile_is_eligible(t) for t in tiles):
        return {"status": "skip", "reason": "ingen kvalifiserte tiles", "log_lines": []}

    arrival_or_departure = board_arrival_or_departure(data)
    new_tiles, tiles_changed, lines_changed, fronttexts_added, log_lines = transform_tiles(
        tiles, arrival_or_departure, cache, failed
    )

    if tiles_changed == 0:
        return {"status": "unchanged", "log_lines": log_lines}

    if write:
        transaction.update(board_ref, {"tiles": new_tiles})

    return {
        "status": "ok",
        "tiles_changed": tiles_changed,
        "lines_changed": lines_changed,
        "fronttexts_added": fronttexts_added,
        "log_lines": log_lines,
    }


def migrate_all(db: firestore.Client, cache: dict, failed: set, write: bool, limit: int | None):
    collection_ref = db.collection(COLLECTION)
    totals = {
        "boards_changed": 0,
        "boards_unchanged": 0,
        "boards_skipped": 0,
        "boards_failed": 0,
        "tiles_changed": 0,
        "lines_changed": 0,
        "fronttexts_added": 0,
        "total": 0,
    }

    mode = "SKRIV" if write else "TØRRKJØRING (ingen skriving)"

    with open(LOG_FILENAME, "a", encoding="utf-8") as log_file:
        log_file.write(f"\n===== {mode} =====\n")
        for i, doc_snap in enumerate(stream_in_batches(collection_ref, limit=limit)):
            totals["total"] += 1
            board_id = doc_snap.id

            try:
                board_ref = db.collection(COLLECTION).document(board_id)
                transaction = db.transaction()
                result = migrate_board(transaction, board_ref, cache, failed, write)
                status = result["status"]

                for line in result["log_lines"]:
                    log_file.write(f"   board {board_id} · {line}\n")

                if status == "ok":
                    totals["boards_changed"] += 1
                    totals["tiles_changed"] += result["tiles_changed"]
                    totals["lines_changed"] += result["lines_changed"]
                    totals["fronttexts_added"] += result["fronttexts_added"]
                    log_file.write(
                        f"✅ {board_id}: {result['tiles_changed']} tile(er), "
                        f"{result['lines_changed']} linje(r), "
                        f"+{result['fronttexts_added']} retning(er)\n"
                    )
                elif status == "unchanged":
                    totals["boards_unchanged"] += 1
                elif status == "skip":
                    totals["boards_skipped"] += 1
                elif status == "missing":
                    totals["boards_failed"] += 1
                    log_file.write(f"☠️ Board finnes ikke: {board_id}\n")

            except Exception as e:  # noqa: BLE001
                totals["boards_failed"] += 1
                log_file.write(f"❌ Feil ved oppdatering av {board_id}: {str(e)}\n")

            if i % 15 == 0 and i != 0:
                log_file.flush()

            if i % 100 == 0 and i != 0:
                log_file.write(f"\n😴 Puster etter {i} dokumenter...\n\n")
                time.sleep(1)

        log_file.write(
            f"\n🎉 Ferdig ({mode}): {totals['boards_changed']} boards endret, "
            f"{totals['tiles_changed']} tiles, {totals['lines_changed']} linjer, "
            f"+{totals['fronttexts_added']} retninger. "
            f"{totals['boards_unchanged']} uendret, {totals['boards_skipped']} hoppet over, "
            f"{totals['boards_failed']} feilet, {totals['total']} totalt 🎉\n"
        )

    return totals


def print_totals(totals: dict, write: bool):
    print(f"\n{'✍️  SKREVET' if write else '🧪 TØRRKJØRING — ingenting skrevet'}")
    print(f"   Boards som ville blitt endret : {totals['boards_changed']}")
    print(f"   Tiles endret                  : {totals['tiles_changed']}")
    print(f"   Linjer endret                 : {totals['lines_changed']}")
    print(f"   Retninger lagt til            : {totals['fronttexts_added']}")
    print(f"   Boards uendret                : {totals['boards_unchanged']}")
    print(f"   Boards hoppet over            : {totals['boards_skipped']}")
    print(f"   Boards feilet                 : {totals['boards_failed']}")
    print(f"\nSe {LOG_FILENAME} for detaljer per board.")


def stream_in_batches(collection_ref, batch_size=500, limit=None):
    """Generator that yields all documents in batches to avoid Firestore timeouts."""
    last_doc = None
    yielded = 0
    while True:
        query = collection_ref.order_by("__name__").limit(batch_size)
        if last_doc:
            query = query.start_after(last_doc)
        docs = list(query.stream())
        if not docs:
            break
        for doc in docs:
            yield doc
            yielded += 1
            if limit is not None and yielded >= limit:
                return
        last_doc = docs[-1]
        print(f"📦 Prosesserte batch til dokument: {last_doc.id}")
        time.sleep(1)


def parse_args() -> tuple:
    env = "local"
    write = False
    limit = None

    args = sys.argv[1:]
    i = 0
    while i < len(args):
        arg = args[i]
        if arg in ("local", "dev", "prod"):
            env = arg
        elif arg == "--write":
            write = True
        elif arg == "--limit":
            i += 1
            limit = int(args[i])
        else:
            print(f"Ukjent argument: {arg}")
            sys.exit(1)
        i += 1

    return env, write, limit


def run():
    env, write, limit = parse_args()

    db = {"local": init.local, "dev": init.dev, "prod": init.prod}[env]()
    print(f"Tilkoblet prosjekt: {db.project} ({env})")
    print(f"Modus: {'SKRIVING' if write else 'TØRRKJØRING — ingenting skrives'}")
    print(
        f"Cutoff (017-kjøring): {MIGRATION_017_RUN.date()} — boards lagret etter "
        f"denne datoen røres ikke"
    )
    if limit:
        print(f"Begrenset til {limit} boards")

    print("\n🔍 Scanner databasen...")
    stats, needed = scan_and_collect(db, limit)
    print_scan_summary(stats, needed)

    if stats["eligible_tiles"] == 0:
        print("\nIngenting å berike.")
        return

    print(f"\n🌐 Henter frontTexts for {len(needed)} unike quay-oppslag...")
    cache, failed = build_cache(needed)
    if failed:
        print(f"⚠️ {len(failed)} quay-oppslag feilet — berørte tiles hoppes over.")

    totals = migrate_all(db, cache, failed, write, limit)
    print_totals(totals, write)

    if not write:
        print("\nKjør på nytt med --write for å faktisk skrive endringene.")


if __name__ == "__main__":
    run()
