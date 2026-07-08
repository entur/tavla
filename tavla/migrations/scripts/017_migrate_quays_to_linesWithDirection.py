"""
Purpose: Backfyll linesWithDirection på tiles fra quays / whitelistedLines

Description:
    Itererer gjennom alle boards og legger til det nye feltet
    tiles[].linesWithDirection ({ lineId, frontTexts }[]) basert på eksisterende
    filtrering. Feltet konsumeres av visningen (stopplass-nivå + klient-filter på
    (lineId, frontText)) og erstatter quay-basert filtrering.

    Klassifisering per tile (presedens: linesWithDirection -> quays ->
    whitelistedLines -> show_all):
      - already_migrated : har linesWithDirection      -> urørt (idempotent)
      - quay             : quays ikke-tom              -> API-oppslag per quay
      - stop_place_legacy: tom quays + whitelistedLines -> frontTexts: [] per linje
      - show_all         : verken filter               -> ingen endring

    For quay-tileer hentes frontTexts per (quay, linje) fra journey-planner
    (samme QuayEstimatedCalls-query som admin bruker), unionert per linje på tvers
    av tileens quays. Vi lagrer EKSPLISITTE frontTexts (ingen "alle retninger ->
    []"-kollaps) for å bevare historiske retninger.

    En quay med tom whitelistedLines betyr "alle linjer på plattformen" (kommer
    typisk fra migrering 011: type=="quay"-tiles uten linjefilter). For å bevare
    dette eksakt henter vi quayens KOMPLETTE linjeliste (quay.lines) i samme query,
    ikke bare linjene som tilfeldigvis har avganger i vinduet — slik at sesong-/
    dvale-linjer ikke mistes. frontTexts settes fra estimatedCalls (eller [] hvis
    linja ikke har avganger i vinduet).

    Feilhåndtering av API-kall:
      - Hvert quay-oppslag prøves på nytt med backoff (API_MAX_RETRIES).
      - Blir et oppslag stående å feile, settes IKKE linesWithDirection på tileer
        som bruker den quayen — de forblir umigrerte og fanges opp ved en senere
        kjøring (idempotent). Vi skriver aldri ufullstendig retningsdata.
      - Et VELLYKKET oppslag som gir 0 frontTexts for en linje (linja har ingen
        avganger i vinduet) lagres som [] (alle retninger) — det er reell data,
        ikke en feil.

    Additiv: quays / whitelistedLines beholdes urørt. En senere migrering (018)
    kan fjerne dem etter BigQuery-verifisering.

    NB: API-kall gjøres i en egen prefetch-fase UTENFOR transaksjonene (011 gjorde
    API-kall inne i transaksjon -> GCP-timeout). Transaksjonscallbacken er fri for
    side-effekter (logging skjer etter commit), siden Firestore kan kjøre den om
    igjen ved contention.

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
API_MAX_RETRIES = 3
API_RETRY_BACKOFF_SECONDS = 2  # base for eksponentiell backoff (2, 4, 8 ...)
API_TIMEOUT_SECONDS = 30
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
        lines {
            id
        }
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


def board_arrival_or_departure(data: dict) -> str:
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
    (quayId, arrival_or_departure) som må hentes fra journey-planner.
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
        arrival_or_departure = board_arrival_or_departure(data)
        tiles = data.get("tiles") or []

        for tile in tiles:
            stats["total_tiles"] += 1
            cls = classify_tile(tile)
            stats[cls] += 1
            if cls == "quay":
                for quay in tile.get("quays") or []:
                    quay_id = quay.get("id")
                    if quay_id:
                        needed.add((quay_id, arrival_or_departure))

    return stats, needed


def print_scan_summary(label: str, stats: dict, needed: set | None):
    print(f"\n📊 Status {label} migrering:")
    print(f"   Boards skannet    : {stats['total_boards']}")
    print(f"   Tileer totalt     : {stats['total_tiles']}")
    print(f"   quay              : {stats['quay']}")
    print(f"   stop_place_legacy : {stats['stop_place_legacy']}")
    print(f"   show_all          : {stats['show_all']}")
    print(f"   already_migrated  : {stats['already_migrated']}")
    if needed is not None:
        print(f"   Unike quay-oppslag: {len(needed)}")


# ---------------------------------------------------------------------------
# Fase B: prefetch frontTexts per (quayId, arrival_or_departure) -- UTENFOR transaksjon
# ---------------------------------------------------------------------------
def fetch_quay_data(quay_id: str, arrival_or_departure: str) -> dict:
    """
    Returnerer { "all_lines": set(lineId), "fronttexts": { lineId: set(frontText) } }.
      - all_lines : alle linjer quayen betjener (quay.lines) — komplett, uavhengig
        av 7-dagersvinduet. Brukes for tom-whitelist-quays så ingen linje mistes.
      - fronttexts: retninger observert i estimatedCalls (7-dagersvindu).
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

            data = payload.get("data") or {}
            quay = data.get("quay") or {}

            all_lines = {
                line.get("id")
                for line in (quay.get("lines") or [])
                if line.get("id")
            }

            fronttexts: dict = {}
            for call in quay.get("estimatedCalls") or []:
                line = (call.get("serviceJourney") or {}).get("line") or {}
                line_id = line.get("id")
                front_text = (call.get("destinationDisplay") or {}).get("frontText")
                if not line_id or not front_text:
                    continue
                fronttexts.setdefault(line_id, set()).add(front_text)

            return {"all_lines": all_lines, "fronttexts": fronttexts}

        except Exception as e:  # noqa: BLE001 - transient nettverks-/API-feil
            last_error = e
            if attempt < API_MAX_RETRIES:
                time.sleep(API_RETRY_BACKOFF_SECONDS * (2 ** (attempt - 1)))

    raise last_error


def build_cache(needed: set) -> tuple:
    """
    Returnerer (cache, failed):
      - cache:  { (quayId, arrival_or_departure): { lineId: set(frontText) } } for vellykkede oppslag
      - failed: set av (quayId, arrival_or_departure) som feilet etter alle forsøk
    """
    cache = {}
    failed = set()
    total = len(needed)

    with open(LOG_FILENAME, "a", encoding="utf-8") as log_file:
        log_file.write(f"\n===== PREFETCH ({total} unike quay-oppslag) =====\n")
        for i, (quay_id, arrival_or_departure) in enumerate(sorted(needed), start=1):
            try:
                quay_data = fetch_quay_data(quay_id, arrival_or_departure)
                cache[(quay_id, arrival_or_departure)] = quay_data
                num_lines = len(quay_data["all_lines"])
                num_fronttexts = sum(len(v) for v in quay_data["fronttexts"].values())
                log_file.write(
                    f"🔍 {quay_id} [{arrival_or_departure}]: {num_lines} linjer, "
                    f"{num_fronttexts} frontTexts\n"
                )
            except Exception as e:  # noqa: BLE001
                failed.add((quay_id, arrival_or_departure))
                log_file.write(
                    f"❌ {quay_id} [{arrival_or_departure}]: API-feil etter {API_MAX_RETRIES} "
                    f"forsøk: {e} — tileer som bruker denne quayen forblir umigrerte\n"
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
def build_stop_place_legacy(tile: dict) -> list:
    """Tile-nivå whitelistedLines -> hver linje med frontTexts: [] (alle retninger)."""
    seen = []
    for line_id in tile.get("whitelistedLines") or []:
        if line_id not in seen:
            seen.append(line_id)
    return [{"lineId": line_id, "frontTexts": []} for line_id in seen]


def build_quay_lines_with_direction(tile: dict, arrival_or_departure: str, cache: dict) -> list:
    """Union av frontTexts per linje på tvers av tilens valgte quays."""
    acc: dict = {}  # lineId -> set(frontText)
    empty_quay = {"all_lines": set(), "fronttexts": {}}
    for quay in tile.get("quays") or []:
        # Hent quay-data fra cache (prefetch-fase). Hvis oppslaget feilet, returneres tomt sett.
        cached_quay_data = cache.get((quay.get("id"), arrival_or_departure), empty_quay)
        cached_fronttexts = cached_quay_data["fronttexts"]
        whitelisted = quay.get("whitelistedLines") or []
        if whitelisted:
            # for hver linje i whitelistedLines, sett union av frontTexts fra cache (eller [] hvis ingen)
            for line_id in whitelisted:
                acc.setdefault(line_id, set()).update(cached_fronttexts.get(line_id, set()))
        else:
            # Hvis vi har tom quay-whitelist, vis alle linjer på plattformen. Disse typen tiles stammer fra migrering 011, der type=="quay" uten whitelistedLines betyr "alle linjer på plattformen".
            # For å beholde alle linjer (ikke bare de med avganger neste 7 dager) bruker vi hele settet fra quay.lines i cache
            # Legg til frontTexts fra cache  hvis linja har avganger i vinduet, ellers [] (alle retninger)
            for line_id in cached_quay_data["all_lines"]:
                acc.setdefault(line_id, set()).update(cached_fronttexts.get(line_id, set()))

    return [
        {"lineId": line_id, "frontTexts": sorted(fronttexts)}
        for line_id, fronttexts in acc.items()
    ]


def transform_tiles(tiles: list, arrival_or_departure: str, cache: dict, failed: set) -> tuple:
    """
    Ren funksjon (ingen I/O — trygg ved transaksjons-retry).
    Returnerer (new_tiles, changed, deferred, log_lines).
    Tileer hvis quay-oppslag feilet utsettes (ingen linesWithDirection).
    """
    new_tiles = copy.deepcopy(tiles)
    changed = 0
    deferred = 0
    log_lines: list = []

    for tile in new_tiles:
        tile_classification = classify_tile(tile)
        if tile_classification == "stop_place_legacy":
            tile["linesWithDirection"] = build_stop_place_legacy(tile)
            changed += 1
        elif tile_classification == "quay":
            quay_ids = [q.get("id") for q in tile.get("quays") or []]
            if any((quay_id, arrival_or_departure) in failed for quay_id in quay_ids):
                # Ufullstendig data -> ikke migrer tile
                deferred += 1
                log_lines.append(
                    f"⏭️ tile {tile.get('uuid', '?')}: utsatt (API-feil på quay) "
                    f"— forblir umigrert"
                )
                continue
            lines_with_direction = build_quay_lines_with_direction(tile, arrival_or_departure, cache)
            tile["linesWithDirection"] = lines_with_direction
            changed += 1
            empty = [
                entry["lineId"]
                for entry in lines_with_direction
                if not entry["frontTexts"]
            ]
            if empty:
                log_lines.append(
                    f"⚠️ tile {tile.get('uuid', '?')}: {len(empty)} linje(r) "
                    f"uten frontTexts (alle retninger): {empty}"
                )
        # show_all / already_migrated: urørt

    return new_tiles, changed, deferred, log_lines


@firestore.transactional
def migrate_board(transaction, board_ref, cache, failed):
    """
    Side-effekt-fri: gjør kun read + (evt.) update, og returnerer et resultat som
    kalleren logger ETTER commit. Firestore kan kjøre denne om igjen ved contention.
    """
    snapshot = board_ref.get(transaction=transaction)
    if not snapshot.exists:
        return {"status": "missing", "log_lines": []}

    data = snapshot.to_dict() or {}
    tiles = data.get("tiles") or []

    if not board_needs_migration(tiles):
        return {"status": "skip", "log_lines": []}

    arrival_or_departure = board_arrival_or_departure(data)
    new_tiles, changed, deferred, log_lines = transform_tiles(
        tiles, arrival_or_departure, cache, failed
    )

    if changed == 0:
        # Alle migrerbare tileer ble utsatt (API-feil) -> ikke skriv.
        return {"status": "deferred", "deferred": deferred, "log_lines": log_lines}

    transaction.update(board_ref, {"tiles": new_tiles})
    return {
        "status": "ok",
        "changed": changed,
        "deferred": deferred,
        "log_lines": log_lines,
    }


def migrate_all(db: firestore.Client, cache: dict, failed: set):
    collection_ref = db.collection(COLLECTION)
    success_count = 0
    skip_count = 0
    deferred_count = 0
    fail_count = 0
    total_count = 0

    with open(LOG_FILENAME, "a", encoding="utf-8") as log_file:
        log_file.write("\n===== SKRIV =====\n")
        for i, doc_snap in enumerate(stream_in_batches(collection_ref)):
            total_count += 1
            board_id = doc_snap.id

            try:
                board_ref = db.collection(COLLECTION).document(board_id)
                transaction = db.transaction()
                result = migrate_board(transaction, board_ref, cache, failed)
                status = result["status"]

                # Logg ETTER commit (transaksjonscallbacken er side-effekt-fri).
                # board_id på hver logglinje for å kunne søke i loggfilen og lettere slå opp i databasen
                for line in result["log_lines"]:
                    log_file.write(f"   board {board_id} · {line}\n")

                if status == "ok":
                    success_count += 1
                    suffix = (
                        f", {result['deferred']} utsatt" if result["deferred"] else ""
                    )
                    log_file.write(
                        f"✅ {board_id}: {result['changed']} tile(er) migrert{suffix}\n"
                    )
                elif status == "deferred":
                    deferred_count += 1
                    log_file.write(
                        f"⏭️ {board_id}: alle migrerbare tileer utsatt (API-feil) "
                        f"— umigrert, tas ved neste kjøring\n"
                    )
                elif status == "skip":
                    skip_count += 1
                elif status == "missing":
                    fail_count += 1
                    log_file.write(f"☠️ Board finnes ikke: {board_id}\n")

            except Exception as e:  # noqa: BLE001
                fail_count += 1
                log_file.write(f"❌ Feil ved oppdatering av {board_id}: {str(e)}\n")

            if i % 15 == 0 and i != 0:
                log_file.flush()

            if i % 100 == 0 and i != 0:
                log_file.write(f"\n😴 Puster etter {i} dokumenter...\n\n")
                time.sleep(1)

        log_file.write(
            f"\n🎉 Ferdig: {success_count} migrert, {skip_count} hoppet over, "
            f"{deferred_count} utsatt (API-feil), {fail_count} feilet, "
            f"{total_count} totalt 🎉\n"
        )
        print(f"Migrering fullført. Se {LOG_FILENAME} for detaljer.")
        if deferred_count:
            print(
                f"⚠️ {deferred_count} board(s) utsatt pga. API-feil — "
                f"kjør skriptet på nytt senere for å fange dem opp."
            )


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

    print(f"\n🌐 Henter frontTexts for {len(needed)} unike (quay, arrival_or_departure)-oppslag...")
    cache, failed = build_cache(needed)
    if failed:
        print(f"⚠️ {len(failed)} quay-oppslag feilet — berørte tileer forblir umigrerte.")

    migrate_all(db, cache, failed)

    print("\n🔍 Scanner databasen etter migrering...")
    stats_after, _ = scan_and_collect(db)
    print_scan_summary("ETTER", stats_after, None)


if __name__ == "__main__":
    run()
