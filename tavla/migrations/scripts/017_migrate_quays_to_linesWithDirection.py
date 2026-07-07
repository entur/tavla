"""
Purpose: Backfyll linesWithDirection på tiles fra quays / whitelistedLines

Description:
    Itererer gjennom alle boards og legger til det nye feltet
    tiles[].linesWithDirection ({ lineId, frontTexts }[]) basert på eksisterende
    filtrering. Feltet konsumeres av visningen (stopplass-nivå + klient-filter på
    (lineId, frontText)) og erstatter quay-basert filtrering.

    Klassifisering per flis (presedens: linesWithDirection -> quays ->
    whitelistedLines -> show_all):
      - already_migrated : har linesWithDirection      -> urørt (idempotent)
      - quay             : quays ikke-tom              -> API-oppslag per quay
      - stop_place_legacy: tom quays + whitelistedLines -> frontTexts: [] per linje
      - show_all         : verken filter               -> ingen endring

    For quay-fliser hentes frontTexts per (quay, linje) fra journey-planner
    (samme QuayEstimatedCalls-query som admin bruker), unionert per linje på tvers
    av flisens quays. Vi lagrer EKSPLISITTE frontTexts (ingen "alle retninger ->
    []"-kollaps) for å bevare historiske retninger og slippe å hente alle quays
    ved stoppet. Fail-open: valgt linje uten frontTexts lagres med [] (alle
    retninger), aldri droppet.

    Additiv: quays / whitelistedLines beholdes urørt. En senere migrering (018)
    kan fjerne dem etter BigQuery-verifisering.

    NB: API-kall gjøres i en egen prefetch-fase UTENFOR transaksjonene (011 gjorde
    API-kall inne i transaksjon -> GCP-timeout).

Usage:
    ./migration run scripts/017_migrate_quays_to_linesWithDirection.py

Date: 2026-07-07
Author: Guro
"""

import copy
import time

import init
import requests
from google.cloud import firestore

COLLECTION = "boards"

JOURNEY_PLANNER_URL = "https://api.entur.io/journey-planner/v3/graphql"
CLIENT_NAME = "entur-tavla"
API_SLEEP_SECONDS = 0.2
LOG_FILENAME = "migration_017_log.txt"

# Samme query som admin (tavla/src/graphql/queries/quayEstimatedCalls.graphql):
# numberOfDeparturesPerLineAndDestinationDisplay: 1 enumererer distinkte
# (linje, destinasjon)-par; timeRange 7 dager fanger sjeldne avganger.
QUAY_ESTIMATED_CALLS_QUERY = """
query QuayEstimatedCalls(
    $quayId: String!
    $numberOfDepartures: Int = 200
    $arrivalDeparture: ArrivalDeparture = departures
) {
    quay(id: $quayId) {
        estimatedCalls(
            numberOfDepartures: $numberOfDepartures
            numberOfDeparturesPerLineAndDestinationDisplay: 1
            timeRange: 604800
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


def board_mode(data: dict) -> str:
    """Ankomsttavler enumererer ankomst-frontTexts, ellers avgang."""
    return "arrivals" if data.get("isArrivals") else "departures"


def classify_tile(tile: dict) -> str:
    if tile.get("linesWithDirection") is not None:
        return "already_migrated"
    if tile.get("quays"):
        return "quay"
    if tile.get("whitelistedLines"):
        return "stop_place_legacy"
    return "show_all"


def board_needs_migration(tiles: list) -> bool:
    return any(classify_tile(t) in ("quay", "stop_place_legacy") for t in tiles)


# ---------------------------------------------------------------------------
# Fase A: scan + samle nødvendige API-oppslag
# ---------------------------------------------------------------------------
def scan_and_collect(db: firestore.Client) -> tuple:
    """
    Returnerer (stats, needed_lookups) der needed_lookups er et sett av
    (quayId, mode) som må hentes fra journey-planner.
    """
    stats = {
        "total_boards": 0,
        "total_tiles": 0,
        "quay": 0,
        "stop_place_legacy": 0,
        "show_all": 0,
        "already_migrated": 0,
    }
    needed = set()

    for doc_snap in stream_in_batches(db.collection(COLLECTION)):
        stats["total_boards"] += 1
        data = doc_snap.to_dict() or {}
        mode = board_mode(data)
        tiles = data.get("tiles") or []

        for tile in tiles:
            stats["total_tiles"] += 1
            cls = classify_tile(tile)
            stats[cls] += 1
            if cls == "quay":
                for quay in tile.get("quays") or []:
                    quay_id = quay.get("id")
                    if quay_id:
                        needed.add((quay_id, mode))

    return stats, needed


def print_scan_summary(label: str, stats: dict, needed: set | None):
    print(f"\n📊 Status {label} migrering:")
    print(f"   Boards skannet    : {stats['total_boards']}")
    print(f"   Fliser totalt     : {stats['total_tiles']}")
    print(f"   quay              : {stats['quay']}")
    print(f"   stop_place_legacy : {stats['stop_place_legacy']}")
    print(f"   show_all          : {stats['show_all']}")
    print(f"   already_migrated  : {stats['already_migrated']}")
    if needed is not None:
        print(f"   Unike quay-oppslag: {len(needed)}")


# ---------------------------------------------------------------------------
# Fase B: prefetch frontTexts per (quayId, mode) -- UTENFOR transaksjon
# ---------------------------------------------------------------------------
def fetch_quay_fronttexts(quay_id: str, mode: str) -> dict:
    """Returnerer { lineId: set(frontText) } for en quay. Kaster ved API-feil."""
    response = requests.post(
        JOURNEY_PLANNER_URL,
        headers={
            "Content-Type": "application/json",
            "ET-Client-Name": CLIENT_NAME,
        },
        json={
            "query": QUAY_ESTIMATED_CALLS_QUERY,
            "variables": {"quayId": quay_id, "arrivalDeparture": mode},
        },
        timeout=30,
    )
    response.raise_for_status()

    data = response.json().get("data") or {}
    quay = data.get("quay") or {}
    calls = quay.get("estimatedCalls") or []

    line_to_fronttexts: dict = {}
    for call in calls:
        line = (call.get("serviceJourney") or {}).get("line") or {}
        line_id = line.get("id")
        front_text = (call.get("destinationDisplay") or {}).get("frontText")
        if not line_id or not front_text:
            continue
        line_to_fronttexts.setdefault(line_id, set()).add(front_text)

    return line_to_fronttexts


def build_cache(needed: set) -> dict:
    """{ (quayId, mode): { lineId: set(frontText) } }. Fail-open ved feil."""
    cache = {}
    total = len(needed)

    with open(LOG_FILENAME, "a", encoding="utf-8") as log_file:
        log_file.write(f"\n===== PREFETCH ({total} unike quay-oppslag) =====\n")
        for i, (quay_id, mode) in enumerate(sorted(needed), start=1):
            try:
                fronttexts = fetch_quay_fronttexts(quay_id, mode)
                cache[(quay_id, mode)] = fronttexts
                num_fronttexts = sum(len(v) for v in fronttexts.values())
                log_file.write(
                    f"🔍 {quay_id} [{mode}]: {len(fronttexts)} linjer, "
                    f"{num_fronttexts} frontTexts\n"
                )
                if not fronttexts:
                    log_file.write(
                        f"⚠️ {quay_id} [{mode}]: ingen frontTexts (fail-open)\n"
                    )
            except Exception as e:
                cache[(quay_id, mode)] = {}
                log_file.write(f"❌ {quay_id} [{mode}]: API-feil: {e}\n")

            if i % 25 == 0:
                log_file.flush()
                print(f"   Prefetch {i}/{total} quay-oppslag...")

            time.sleep(API_SLEEP_SECONDS)

    return cache


# ---------------------------------------------------------------------------
# Fase C: transform + transaksjonell skriv
# ---------------------------------------------------------------------------
def build_stop_place_legacy(tile: dict) -> list:
    """Flis-nivå whitelistedLines -> hver linje med frontTexts: [] (alle retninger)."""
    seen = []
    for line_id in tile.get("whitelistedLines") or []:
        if line_id not in seen:
            seen.append(line_id)
    return [{"lineId": line_id, "frontTexts": []} for line_id in seen]


def build_quay_lines_with_direction(tile: dict, mode: str, cache: dict) -> list:
    """Union av frontTexts per linje på tvers av flisens valgte quays."""
    acc: dict = {}  # lineId -> set(frontText)
    for quay in tile.get("quays") or []:
        quay_map = cache.get((quay.get("id"), mode), {})
        whitelisted = quay.get("whitelistedLines") or []
        if whitelisted:
            for line_id in whitelisted:
                # tomt sett = fail-open [] (alle retninger)
                acc.setdefault(line_id, set()).update(quay_map.get(line_id, set()))
        else:
            # tom quay-whitelist = alle linjer på plattformen
            for line_id, fronttexts in quay_map.items():
                acc.setdefault(line_id, set()).update(fronttexts)

    return [
        {"lineId": line_id, "frontTexts": sorted(fronttexts)}
        for line_id, fronttexts in acc.items()
    ]


def transform_tiles(tiles: list, mode: str, cache: dict, log_file) -> tuple:
    """Returnerer (new_tiles, antall_endrede_fliser)."""
    new_tiles = copy.deepcopy(tiles)
    changed = 0

    for tile in new_tiles:
        cls = classify_tile(tile)
        if cls == "stop_place_legacy":
            tile["linesWithDirection"] = build_stop_place_legacy(tile)
            changed += 1
        elif cls == "quay":
            lines_with_direction = build_quay_lines_with_direction(tile, mode, cache)
            tile["linesWithDirection"] = lines_with_direction
            changed += 1
            empty = [
                entry["lineId"]
                for entry in lines_with_direction
                if not entry["frontTexts"]
            ]
            if empty:
                log_file.write(
                    f"   ⚠️ flis {tile.get('uuid', '?')}: {len(empty)} linje(r) "
                    f"uten frontTexts (alle retninger): {empty}\n"
                )
        # show_all / already_migrated: urørt

    return new_tiles, changed


@firestore.transactional
def migrate_board(transaction, board_ref, cache, log_file):
    snapshot = board_ref.get(transaction=transaction)
    if not snapshot.exists:
        log_file.write(f"☠️ Board finnes ikke: {board_ref.id}\n")
        return False

    data = snapshot.to_dict() or {}
    tiles = data.get("tiles") or []

    if not board_needs_migration(tiles):
        return None  # None = ingen endring nødvendig

    mode = board_mode(data)
    new_tiles, changed = transform_tiles(tiles, mode, cache, log_file)
    transaction.update(board_ref, {"tiles": new_tiles})
    log_file.write(f"✅ {board_ref.id}: {changed} flis(er) migrert\n")
    return True


def migrate_all(db: firestore.Client, cache: dict):
    collection_ref = db.collection(COLLECTION)
    success_count = 0
    skip_count = 0
    fail_count = 0
    total_count = 0

    with open(LOG_FILENAME, "a", encoding="utf-8") as log_file:
        log_file.write("\n===== SKRIV =====\n")
        for i, doc_snap in enumerate(stream_in_batches(collection_ref)):
            total_count += 1
            board_id = doc_snap.id
            log_file.write(f"\n-----> 🏁 Board: {board_id}\n")

            try:
                board_ref = db.collection(COLLECTION).document(board_id)
                transaction = db.transaction()
                result = migrate_board(transaction, board_ref, cache, log_file)

                if result is True:
                    success_count += 1
                elif result is None:
                    skip_count += 1
                    log_file.write("⏭️ Ingenting å migrere, hopper over\n")
                else:
                    fail_count += 1

            except Exception as e:
                fail_count += 1
                log_file.write(f"❌ Feil ved oppdatering av {board_id}: {str(e)}\n")

            if i % 15 == 0 and i != 0:
                log_file.flush()

            if i % 100 == 0 and i != 0:
                log_file.write(f"\n😴 Puster etter {i} dokumenter...\n\n")
                time.sleep(1)

        log_file.write(
            f"\n🎉 Ferdig: {success_count} migrert, {skip_count} hoppet over, "
            f"{fail_count} feilet, {total_count} totalt 🎉\n"
        )
        print(f"Migrering fullført. Se {LOG_FILENAME} for detaljer.")


def stream_in_batches(collection_ref, batch_size=500):
    """Generator that yields all documents in batches to avoid Firestore timeouts."""
    last_doc = None
    while True:
        query = collection_ref.order_by("__name__").limit(batch_size)
        if last_doc:
            query = query.start_after(last_doc)
        docs = list(query.stream())
        if not docs:
            break
        yield from docs
        last_doc = docs[-1]
        print(f"📦 Prosesserte batch til dokument: {last_doc.id}")
        time.sleep(1)


def run():
    db = init.dev()  # Bytt til init.prod() når klar for prod
    print(f"Tilkoblet prosjekt: {db.project}")

    print("\n🔍 Scanner databasen før migrering...")
    stats, needed = scan_and_collect(db)
    print_scan_summary("FØR", stats, needed)

    if stats["quay"] == 0 and stats["stop_place_legacy"] == 0:
        print("Ingenting å migrere.")
        return

    print(f"\n🌐 Henter frontTexts for {len(needed)} unike (quay, mode)-oppslag...")
    cache = build_cache(needed)

    migrate_all(db, cache)

    print("\n🔍 Scanner databasen etter migrering...")
    stats_after, _ = scan_and_collect(db)
    print_scan_summary("ETTER", stats_after, None)


if __name__ == "__main__":
    run()
