"""
Migrering 023: kollaps quaysFilter.quays[].selectedLines til [] der alle mulige
linjer for plattformen er valgt.

Bakgrunn: en bug gjorde at enkelte tiles med filter.type == 'quaysFilter' lagret
"alle linjer valgt" som en eksplisitt liste med linje-ider i stedet for den
komprimerte tomme lista (= alle linjer). Slike tavler får ikke med seg nye linjer
som legges til på plattformen senere.

Mulige linjer: samme definisjon som appen (useQuaysWithFrontTexts.ts), dvs. linjer
i quay.lines med minst én avgang (med frontText) de neste 30 dagene. Kollaps-regelen
speiler compressQuaysFilter i
app/(innlogget)/tavler/[id]/rediger/components/EditStopPlaceModal/utils.ts:
er alle mulige linjer valgt, settes selectedLines til []. Ekstra, utgåtte linje-ider
i utvalget er greit. Til forskjell fra appen kollapses aldri en plattform uten mulige
linjer.

Stegvis prosess:
1. Hent kandidater fra Firestore (kun lesing): gå gjennom alle tavler og samle
   plattformer i quaysFilter med ikke-tom selectedLines, og tavlene de står på.
2. Slå opp linjene til alle kandidat-plattformene i GTFS med én DuckDB-spørring.
   Plattformer som mangler i GTFS logges.
3. Migrer hver kandidat-tavle i en egen transaksjon. Per plattform:
   a. Sjekk mot GTFS (hele perioden). GTFS er en øvre grense for linjene med
      avganger de neste 30 dagene, så er alle GTFS-linjene valgt, kollapses
      plattformen uten API-kall.
   b. Gir GTFS "partial" eller "ukjent plattform", slås plattformen opp i Journey
      Planner (samme parametere som QuayEstimatedCalls), og status settes på nytt
      ut fra de linjene. Resultatet caches, så hver plattform slås opp maks én gang
      per kjøring.
   Kun tiles skrives, og bare med --write.

Utfall per plattform (etter steg 3a/3b):
- collapsed                           alle mulige linjer valgt   -> settes til []
- partial                             delvis valgt               -> uendret
- relevant_no_overlap                 ingen valgte linjer mulige -> uendret, logges
- relevant_unknown_quay               ingen mulige linjer        -> uendret, logges
- relevant_journey_planner_failed     oppslaget feilet           -> uendret, logges
Tavler med relevant_*-plattformer listes til slutt i loggen for oppfølging.

Logg: migrate_filter_selected_lines_log.txt i katalogen scriptet kjøres fra
(legges til, overskrives ikke).

Resultatet avhenger av datoen (30-dagersvinduet i Journey Planner) og av hvor fersk
GTFS-filen er. Kjør tørrkjøring og --write på prod samme dag, med nylig nedlastet GTFS.

GTFS-dataene legges i en lokal DuckDB:
1. Last ned rb_norway-aggregated-gtfs.zip fra
   https://developer.entur.org/stops-and-timetable-data og pakk ut.
2. Fra den utpakkede mappen:
   duckdb gtfs.duckdb "CREATE TABLE quay_lines AS
     SELECT DISTINCT st.stop_id AS quay_id, t.route_id AS line_id
     FROM read_csv('stop_times.txt', header=true, all_varchar=true, quote='\"', escape='\"') st
     JOIN read_csv('trips.txt', header=true, all_varchar=true, quote='\"', escape='\"') t USING (trip_id);"
3. Sjekk at quay_id er NSR:Quay:* og line_id har samme format som linje-idene i
   Firestore (XXX:Line:*), f.eks. for NSR:Quay:107371.

Kjør:
cd tavla/migrations
./migration run scripts/023_migrate_filter_selected_lines.py <local|dev|prod> --gtfs-db path/to/gtfs.duckdb [--limit N] [--write]

Uten --write er det en tørrkjøring: ingenting skrives til Firestore, men steg 3b
gjør fortsatt kall mot Journey Planner.
--limit N begrenser steg 3 til de N første kandidat-tavlene (sortert på id), for
korte testkjøringer.
"""

from google.cloud import firestore
import sys
import time
import copy
from typing import Callable
import duckdb
import requests
import init

collection_name = "boards"

JOURNEY_PLANNER_URL = "https://api.entur.io/journey-planner/v3/graphql"
JOURNEY_PLANNER_CLIENT_NAME = "entur-tavla-migration"

# Samme parametere som QuayEstimatedCalls i src/graphql/queries/quayEstimatedCalls.graphql
QUAY_DEPARTURE_LINES_QUERY = """
query QuayDepartureLines($quayId: String!) {
    quay(id: $quayId) {
        lines {
            id
        }
        estimatedCalls(
            numberOfDepartures: 1000
            numberOfDeparturesPerLineAndDestinationDisplay: 1
            timeRange: 2592000
            includeCancelledTrips: true
            arrivalDeparture: departures
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

# Statuser per plattform
COLLAPSED = "collapsed"
UNKNOWN_QUAY = "relevant_unknown_quay"
NO_OVERLAP = "relevant_no_overlap"
PARTIAL = "partial"
JP_FAILED = "relevant_journey_planner_failed"
QUAY_STATUSES = [COLLAPSED, UNKNOWN_QUAY, NO_OVERLAP, PARTIAL, JP_FAILED]

# Returnerer mulige linjer for en plattform, eller None hvis oppslaget feilet
LinesLookup = Callable[[str], set[str] | None]


def candidate_quays(tile: dict) -> list[dict]:
    """Plattformer i et quaysFilter med minst én valgt linje."""
    tile_filter = tile.get("filter")
    if not isinstance(tile_filter, dict) or tile_filter.get("type") != "quaysFilter":
        return []
    return [q for q in tile_filter.get("quays", []) if q.get("selectedLines")]


def classify_quay(selected_lines: list[str], possible_lines: set[str]) -> str:
    if not possible_lines:
        return UNKNOWN_QUAY
    selected = set(selected_lines)
    if possible_lines <= selected:
        return COLLAPSED
    if not possible_lines & selected:
        return NO_OVERLAP
    return PARTIAL


def migrate_board(
    data: dict, possible_lines: dict[str, set[str]], lookup_lines: LinesLookup
) -> tuple[dict, list[str], dict[str, int]]:
    """Transform: returnerer (ny data, logglinjer, telling per status).

    lookup_lines brukes kun for plattformer som er partial eller ukjente i GTFS.
    """
    new_data = copy.deepcopy(data)
    log_lines = []
    counts = {status: 0 for status in QUAY_STATUSES}

    for tile in new_data.get("tiles", []) or []:
        tile_id = tile.get("uuid", "?")
        for quay in candidate_quays(tile):
            quay_id = quay.get("id")
            selected = quay["selectedLines"]
            possible = possible_lines.get(quay_id, set())
            # 3A - Sjekker opp status basert på valgte og mulige linjer fra GTFS
            status = classify_quay(selected, possible)
            source = "gtfs"

            if status in (PARTIAL, UNKNOWN_QUAY):
                # 3B - Dersom status er partial eller ukjent, prøv å hente linjer fra journey planner
                jp_lines = lookup_lines(quay_id)
                source = "journey-planner"
                if jp_lines is None:
                    status = JP_FAILED
                else:
                    possible = jp_lines
                    status = classify_quay(selected, possible)

            counts[status] += 1

            log_lines.append(
                f"tile {tile_id} · quay {quay_id} · {status} "
                f"(valgt {len(selected)}, mulige {len(possible)}, kilde {source})"
            )
            if status == COLLAPSED:
                quay["selectedLines"] = []

    return new_data, log_lines, counts


def fetch_departure_lines(quay_id: str, retries: int = 3) -> set[str] | None:
    """Linjer i quay.lines med minst én avgang de neste 30 dagene, som i appen.

    Returnerer None hvis oppslaget feiler etter alle forsøk.
    """
    for attempt in range(1, retries + 1):
        try:
            response = requests.post(
                JOURNEY_PLANNER_URL,
                json={"query": QUAY_DEPARTURE_LINES_QUERY, "variables": {"quayId": quay_id}},
                headers={"ET-Client-Name": JOURNEY_PLANNER_CLIENT_NAME},
                timeout=30,
            )
            response.raise_for_status()
            body = response.json()
            if body.get("errors"):
                raise RuntimeError(body["errors"])

            quay = (body.get("data") or {}).get("quay")
            if quay is None:
                return set()

            departure_lines = {
                call["serviceJourney"]["line"]["id"]
                for call in quay.get("estimatedCalls") or []
                if (call.get("destinationDisplay") or {}).get("frontText")
                and ((call.get("serviceJourney") or {}).get("line") or {}).get("id")
            }
            return {line["id"] for line in quay.get("lines") or []} & departure_lines
        except Exception as e:
            print(f"⚠️ Journey Planner feilet for {quay_id} (forsøk {attempt}/{retries}): {e}")
            time.sleep(2 * attempt)

    return None


def cached_lookup(cache: dict[str, set[str] | None]) -> LinesLookup:
    """Slår opp hver plattform maks én gang per kjøring."""

    def lookup(quay_id: str) -> set[str] | None:
        if quay_id not in cache:
            cache[quay_id] = fetch_departure_lines(quay_id)
        return cache[quay_id]

    return lookup


def stream_documents_in_batches(collection_ref, batch_size=500):
    """Generator that yields all documents in batches to avoid Firestore timeouts."""
    last_doc = None
    while True:
        query = collection_ref.order_by("__name__").limit(batch_size)
        if last_doc:
            query = query.start_after(last_doc)

        docs = list(query.stream())
        if not docs:
            break

        for d in docs:
            yield d

        last_doc = docs[-1]
        print(f"📦 Processed batch up to document: {last_doc.id}")
        time.sleep(1)


def collect_candidate_quay_ids(collection_ref) -> tuple[set[str], set[str]]:
    """Steg 1: returnerer (relevante quay-ider, tavle-ider som har dem)."""
    quay_ids = set()
    board_ids = set()
    for doc_snap in stream_documents_in_batches(collection_ref):
        data = doc_snap.to_dict() or {}
        for tile in data.get("tiles", []) or []:
            for quay in candidate_quays(tile):
                quay_ids.add(quay.get("id"))
                board_ids.add(doc_snap.id)
    return quay_ids, board_ids


def load_possible_lines(gtfs_db: str, quay_ids: set[str]) -> dict[str, set[str]]:
    """Steg 2: { quay_id: {line_id, ...} } fra lokal GTFS-DuckDB."""
    possible_lines: dict[str, set[str]] = {}
    if not quay_ids:
        return possible_lines

    with duckdb.connect(gtfs_db, read_only=True) as con:
        rows = con.execute(
            "SELECT quay_id, line_id FROM quay_lines WHERE quay_id IN (SELECT unnest(?))",
            [sorted(quay_ids)],
        ).fetchall()

    for quay_id, line_id in rows:
        possible_lines.setdefault(quay_id, set()).add(line_id)
    return possible_lines


@firestore.transactional
def migrate_filter_transactional(
    transaction, board_ref, possible_lines, lookup_lines: LinesLookup, write: bool
):
    snapshot = board_ref.get(transaction=transaction)
    if not snapshot.exists:
        return {"status": "missing", "log_lines": [], "counts": {}}

    data = snapshot.to_dict()
    if not data:
        return {
            "status": "unchanged",
            "log_lines": ["⚠️ Document exists but has no data"],
            "counts": {},
        }

    new_data, log_lines, counts = migrate_board(data, possible_lines, lookup_lines)

    if new_data == data:
        return {"status": "unchanged", "log_lines": log_lines, "counts": counts}

    if write:
        transaction.update(board_ref, {"tiles": new_data.get("tiles", [])})

    return {"status": "ok", "log_lines": log_lines, "counts": counts}


def update_documents(db: firestore.Client, gtfs_db: str, write: bool, limit: int | None):
    collection_ref = db.collection(collection_name)

    success_count = 0
    unchanged_count = 0
    fail_count = 0
    quay_totals = {status: 0 for status in QUAY_STATUSES}
    relevant_board_ids = {status: set() for status in [UNKNOWN_QUAY, NO_OVERLAP, JP_FAILED]}
    jp_cache: dict[str, set[str] | None] = {}
    lookup_lines = cached_lookup(jp_cache)

    mode = "WRITE" if write else "DRY RUN — nothing is written"

    with open("migrate_filter_selected_lines_log.txt", "a", encoding="utf-8") as log_file:
        log_file.write(f"\n===== {mode} =====\n")

        # 1 - Hent kandidat-plattformer og tavler fra Firestore
        print("🔎 Steg 1: finner kandidat-plattformer")
        quay_ids, board_ids = collect_candidate_quay_ids(collection_ref)
        log_file.write(
            f"\n📋 Steg 1: {len(quay_ids)} unike plattformer på {len(board_ids)} tavler "
            f"har quaysFilter med valgte linjer\n"
        )

        # 2 - Slå opp mulige linjer i GTFS
        print("🗺️ Steg 2: slår opp mulige linjer i GTFS")
        possible_lines = load_possible_lines(gtfs_db, quay_ids)
        missing = sorted(quay_ids - possible_lines.keys())
        log_file.write(
            f"📋 Steg 2: fant linjer for {len(possible_lines)} plattformer, "
            f"{len(missing)} finnes ikke i GTFS\n"
        )
        for quay_id in missing:
            log_file.write(f"   ⚠️ Ikke i GTFS: {quay_id}\n")

        # 3 - Migrer tavler basert på mulige linjer og evt Journey Planner lookup
        boards_to_migrate = sorted(board_ids)[:limit]
        print(f"✏️ Steg 3: migrerer {len(boards_to_migrate)} av {len(board_ids)} kandidat-tavler")
        log_file.write(f"📋 Steg 3: migrerer {len(boards_to_migrate)} av {len(board_ids)} kandidat-tavler\n")
        for i, doc_id in enumerate(boards_to_migrate):
            log_file.write(f"\n-----> 🏁 Checking document: {doc_id}\n")

            try:
                board_ref = collection_ref.document(doc_id)
                transaction = db.transaction()
                result = migrate_filter_transactional(
                    transaction, board_ref, possible_lines, lookup_lines, write
                )
                status = result["status"]

                for line in result["log_lines"]:
                    log_file.write(f"   board {doc_id} · {line}\n")
                for quay_status, count in result["counts"].items():
                    quay_totals[quay_status] += count
                    if count and quay_status in relevant_board_ids:
                        relevant_board_ids[quay_status].add(doc_id)

                if status == "ok":
                    success_count += 1
                    verb = "Updated" if write else "Would update"
                    log_file.write(f"✅ {verb} document {doc_id}\n")
                elif status == "missing":
                    log_file.write(f"❌ Document doesn't exist: {doc_id}\n")
                else:
                    unchanged_count += 1
                    log_file.write(f"ℹ️ No change needed for {doc_id}\n")

            except Exception as e:
                fail_count += 1
                log_file.write(f"❌ Error updating {doc_id}: {str(e)}\n")

            if i % 15 == 0 and i != 0:
                log_file.flush()

            if i % 100 == 0 and i != 0:
                log_file.write(f"\n💤 Sleeping after {i} documents...\n\n")
                time.sleep(1)

        for status, ids in relevant_board_ids.items():
            log_file.write(f"\n📌 Tavler med {status} ({len(ids)}):\n")
            for doc_id in sorted(ids):
                log_file.write(f"   {doc_id}\n")

        summary = (
            f"\n🎉 Finished: {success_count} updated, {unchanged_count} unchanged, "
            f"{fail_count} failed, {len(boards_to_migrate)} of {len(board_ids)} candidate boards 🎉\n"
            f"   Plattformer: "
            + ", ".join(f"{status}={count}" for status, count in quay_totals.items())
            + "\n"
            f"   Journey Planner: {len(jp_cache)} unike plattformer slått opp, "
            f"{sum(1 for lines in jp_cache.values() if lines is None)} feilet\n"
        )
        log_file.write(summary)
        print(summary)


def parse_args() -> tuple:
    env = "local"
    write = False
    gtfs_db = None
    limit = None

    args = sys.argv[1:]
    i = 0
    while i < len(args):
        arg = args[i]
        if arg in ("local", "dev", "prod"):
            env = arg
        elif arg == "--write":
            write = True
        elif arg == "--gtfs-db" and i + 1 < len(args):
            i += 1
            gtfs_db = args[i]
        elif arg == "--limit" and i + 1 < len(args) and args[i + 1].isdigit():
            i += 1
            limit = int(args[i])
        else:
            print(f"Unknown argument: {arg}")
            sys.exit(1)
        i += 1

    if not gtfs_db:
        print("Missing required argument: --gtfs-db path/to/gtfs.duckdb")
        sys.exit(1)

    return env, write, gtfs_db, limit


def run():
    env, write, gtfs_db, limit = parse_args()

    db = {"local": init.local, "dev": init.dev, "prod": init.prod}[env]()
    print(f"Connected to project: {db.project} ({env})")
    print(f"Mode: {'WRITE' if write else 'DRY RUN — nothing is written'}")

    update_documents(db, gtfs_db, write, limit)

    if not write:
        print("\nRun again with --write to actually write the changes.")


if __name__ == "__main__":
    run()
