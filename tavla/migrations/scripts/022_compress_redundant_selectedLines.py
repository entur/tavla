"""
Purpose: Komprimer tile.filter.selectedLines til [] der den uheldet representerer
«alle linjer» — reparerer en bug som levde videre fra det gamle tile.quays-feltet.

Description:
    tile.quays (fjernet, se migrering 021) hadde en kjent bug: når en bruker valgte
    *alle* linjer på en plattform, skulle det komprimeres til et tomt array
    ([] = «ingen filter, vis alt»), men en string/number-sammenligningsfeil i
    TileCard/utils.ts gjorde at kompresjonen aldri slo inn (fikset i commit
    1a00e084). Resultatet ble lagret som et fullt, eksplisitt linje-array i stedet
    for []. Migrering 021 kopierte denne uferdige dataen rett inn i det nå aktive
    filter-feltet (quaysFilter.quays[].selectedLines / stopPlaceFilter.selectedLines)
    uten å vite om arrayet opprinnelig betydde «alt».

    En egen analyse (BigQuery mot ent-tavla-prd + sammenligning mot Entur sitt
    JourneyPlanner-API) fant at ca. 42 % av tiles med ikke-tom selectedLines i dag
    faktisk er slike bug-tilfeller — resten er bevisste, delvise filtre. Se
    rapporten: https://claude.ai/artifact/BQcXUnucHpgWxvxfb2qnCE

    «Alle linjer» for en quay avgjøres mot to uavhengige fasiter, begge hentet fra
    en lokal GTFS-dump (Entur sin nasjonale "rb_norway-aggregated-gtfs") i stedet
    for live API-kall — validert til 94 % (alle linjer) / 89 % (30-dagers avganger)
    eksakt match mot live-API på et tilfeldig utvalg på 100 quays, og langt raskere
    (hele sammenligningen tar <100 ms mot DuckDB, versus ett nettverkskall per quay):

      A) quay.lines-ekvivalent: alle linjer som noensinne har en stop_times-rad på
         quayen (stop_times → trips → routes), uavhengig av om de kjører nå.
      B) 30-dagers-avganger-ekvivalent: linjer med minst én tur hvis service er
         gyldig i [i dag, i dag+30] (calendar + calendar_dates), og der man faktisk
         kan gå PÅ her (pickup_type != 1 — ekskluderer avstigning-only-stopp, som
         ellers fikk GTFS til å systematisk overtelle mot live-API sin
         arrivalDeparture: departures-semantikk).

    selectedLines komprimeres til [] KUN når den — som mengde, ikke bare antall —
    er identisk med A ELLER B. Alt annet røres ikke: dette er en STRENGT
    INNSKRENKENDE migrering i én retning (komprimerer aldri til noe annet enn [],
    utvider aldri et filter, legger aldri til linjer). selectedTransportModes
    (stopPlaceFilter) røres aldri, uansett — kun selectedLines.

    En quay/stoppested uten treff i GTFS-dumpen (eksisterer ikke i stops.txt, f.eks.
    nedlagt eller nylig omstrukturert) kan ikke verifiseres, og tiles som bruker den
    hoppes derfor over — samme prinsipp som 019 sin "hopp over fremfor å gjette".

    API-kall (her: GTFS-oppslag) gjøres i en prefetch-fase UTENFOR transaksjonene,
    som i 019 — transaksjonscallbacken er fri for side-effekter.

Forutsetning:
    En lokal DuckDB-fil bygget fra Entur sin nasjonale GTFS-eksport
    ("rb_norway-aggregated-gtfs"), med tabellene stops, routes, trips, stop_times,
    calendar, calendar_dates importert (se --gtfs-db under). Denne følger IKKE med
    repoet — den må lastes ned og bygges separat, og er et øyeblikksbilde som bør
    fornyes før en skarp kjøring i prod.

Usage:
    # Tørrkjøring (default — skriver ingenting, kun rapport):
    ./migration run scripts/022_compress_redundant_selectedLines.py local --gtfs-db /path/to/rb_norway.duckdb

    # Faktisk skriving:
    ./migration run scripts/022_compress_redundant_selectedLines.py local --gtfs-db /path/to/rb_norway.duckdb --write

    # Begrens til de N første boardene (rask test):
    ./migration run scripts/022_compress_redundant_selectedLines.py local --gtfs-db /path/to/rb_norway.duckdb --limit 50

Date: 2026-11-16
Author: Magnus
"""

import copy
import sys
import time
from datetime import datetime, timezone

import duckdb
import init
from google.cloud import firestore

COLLECTION = "boards"
LOG_FILENAME = "migration_022_log.txt"
WINDOW_DAYS = 30

# Skille mellom "ikke slått opp ennå" og "slått opp, fantes ikke i GTFS" —
# sistnevnte betyr quayen/stoppestedet ikke finnes i GTFS-dumpen, og tiles som
# bruker den hoppes over fordi vi ikke kan verifisere "alle linjer" for den.
NOT_FOUND = object()


# ---------------------------------------------------------------------------
# Fase A: scan + samle nødvendige GTFS-oppslag
# ---------------------------------------------------------------------------
def quays_filter_quay_entries(tile: dict):
    """Quay-entries i en quaysFilter-tile med ikke-tom selectedLines."""
    filt = tile.get("filter") or {}
    if filt.get("type") != "quaysFilter":
        return []
    return [
        quay
        for quay in filt.get("quays") or []
        if quay.get("id") and quay.get("selectedLines")
    ]


def stop_place_filter_is_eligible(tile: dict) -> bool:
    """stopPlaceFilter-tile med ikke-tom selectedLines på toppnivå."""
    filt = tile.get("filter") or {}
    return filt.get("type") == "stopPlaceFilter" and bool(filt.get("selectedLines"))


def tile_is_eligible(tile: dict) -> bool:
    return bool(quays_filter_quay_entries(tile)) or stop_place_filter_is_eligible(tile)


def scan_and_collect(db: firestore.Client, limit: int | None) -> tuple:
    stats = {
        "total_boards": 0,
        "total_tiles": 0,
        "eligible_boards": 0,
        "eligible_tiles": 0,
        "eligible_quay_rows": 0,
        "eligible_stopplace_rows": 0,
    }
    needed_quay_ids = set()
    needed_stop_place_ids = set()

    for doc_snap in stream_documents_in_batches(db.collection(COLLECTION), batch_size=500, limit=limit):
        stats["total_boards"] += 1
        data = doc_snap.to_dict() or {}
        tiles = data.get("tiles") or []
        stats["total_tiles"] += len(tiles)

        board_has_work = False
        for tile in tiles:
            quay_entries = quays_filter_quay_entries(tile)
            if quay_entries:
                board_has_work = True
                stats["eligible_tiles"] += 1
                stats["eligible_quay_rows"] += len(quay_entries)
                for quay in quay_entries:
                    needed_quay_ids.add(quay["id"])

            if stop_place_filter_is_eligible(tile):
                board_has_work = True
                stats["eligible_tiles"] += 1
                stats["eligible_stopplace_rows"] += 1
                stop_place_id = tile.get("stopPlaceId")
                if stop_place_id:
                    needed_stop_place_ids.add(stop_place_id)

        if board_has_work:
            stats["eligible_boards"] += 1

    return stats, needed_quay_ids, needed_stop_place_ids


def print_scan_summary(stats: dict, needed_quay_ids: set, needed_stop_place_ids: set):
    print("\n📊 Status før migrering:")
    print(f"   Boards skannet              : {stats['total_boards']}")
    print(f"   Boards med kandidater       : {stats['eligible_boards']}")
    print(f"   Tiles totalt                : {stats['total_tiles']}")
    print(f"   Tiles med kandidater        : {stats['eligible_tiles']}")
    print(f"   — quaysFilter-quayrader     : {stats['eligible_quay_rows']}")
    print(f"   — stopPlaceFilter-tiles     : {stats['eligible_stopplace_rows']}")
    print(f"   Unike quays å slå opp       : {len(needed_quay_ids)}")
    print(f"   Unike stoppesteder å slå opp: {len(needed_stop_place_ids)}")


# ---------------------------------------------------------------------------
# Fase B: prefetch linjesett per quay/stoppested fra lokal GTFS — UTENFOR transaksjon
# ---------------------------------------------------------------------------
def build_gtfs_cache(gtfs_db_path: str, needed_quay_ids: set, needed_stop_place_ids: set) -> dict:
    """
    Returnerer:
      {
        "quay_lines_all": {quay_id: set(route_id)},   # A — alle linjer noensinne
        "quay_lines_30d": {quay_id: set(route_id)},   # B — linjer med avgang neste 30 dager
        "stopplace_lines_all": {stop_place_id: set(route_id)},
        "stopplace_lines_30d": {stop_place_id: set(route_id)},
      }
    En quay/stoppested uten data i GTFS er rett og slett fraværende fra dict-ene —
    behandles som «ukjent, hopp over» av transform-funksjonene.
    """
    con = duckdb.connect(gtfs_db_path, read_only=True)

    # Finn quayene som hører til de etterspurte stoppestedene, og slå dem sammen
    # med quayene vi allerede trenger direkte — én samlet GTFS-spørring holder.
    stop_place_to_quays: dict = {}
    if needed_stop_place_ids:
        placeholders = ",".join("?" for _ in needed_stop_place_ids)
        rows = con.execute(
            f"""
            SELECT parent_station, stop_id
            FROM stops
            WHERE parent_station IN ({placeholders})
              AND stop_id LIKE 'NSR:Quay:%'
            """,
            list(needed_stop_place_ids),
        ).fetchall()
        for parent_station, quay_id in rows:
            stop_place_to_quays.setdefault(parent_station, set()).add(quay_id)

    all_quay_ids = set(needed_quay_ids)
    for quays in stop_place_to_quays.values():
        all_quay_ids |= quays

    quay_lines_all: dict = {}
    quay_lines_30d: dict = {}

    if all_quay_ids:
        placeholders = ",".join("?" for _ in all_quay_ids)
        params = list(all_quay_ids)

        con.execute(f"CREATE OR REPLACE TEMP TABLE needed_quays AS SELECT * FROM (VALUES {','.join('(?)' for _ in all_quay_ids)}) AS t(quay_id)", params)

        con.execute(
            f"""
            CREATE OR REPLACE TEMP TABLE window_dates AS
            SELECT
              d::DATE AS date_val,
              CAST(strftime(d::DATE, '%Y%m%d') AS BIGINT) AS yyyymmdd,
              CASE EXTRACT(isodow FROM d::DATE)
                WHEN 1 THEN 'monday' WHEN 2 THEN 'tuesday' WHEN 3 THEN 'wednesday'
                WHEN 4 THEN 'thursday' WHEN 5 THEN 'friday' WHEN 6 THEN 'saturday' WHEN 7 THEN 'sunday'
              END AS weekday_col
            FROM generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL {WINDOW_DAYS} DAY, INTERVAL 1 DAY) AS t(d)
            """
        )

        con.execute(
            """
            CREATE OR REPLACE TEMP TABLE calendar_long AS
            SELECT service_id, 'monday' AS weekday, monday AS active, start_date, end_date FROM calendar
            UNION ALL SELECT service_id, 'tuesday', tuesday, start_date, end_date FROM calendar
            UNION ALL SELECT service_id, 'wednesday', wednesday, start_date, end_date FROM calendar
            UNION ALL SELECT service_id, 'thursday', thursday, start_date, end_date FROM calendar
            UNION ALL SELECT service_id, 'friday', friday, start_date, end_date FROM calendar
            UNION ALL SELECT service_id, 'saturday', saturday, start_date, end_date FROM calendar
            UNION ALL SELECT service_id, 'sunday', sunday, start_date, end_date FROM calendar
            """
        )

        con.execute(
            """
            CREATE OR REPLACE TEMP TABLE calendar_pattern_valid AS
            SELECT cl.service_id, wd.yyyymmdd
            FROM calendar_long cl
            JOIN window_dates wd ON wd.weekday_col = cl.weekday
            WHERE cl.active = 1
              AND wd.yyyymmdd BETWEEN cl.start_date AND cl.end_date
            """
        )

        con.execute(
            """
            CREATE OR REPLACE TEMP TABLE service_window_valid AS
            SELECT service_id, yyyymmdd FROM calendar_pattern_valid
            EXCEPT
            SELECT cd.service_id, cd.date
            FROM calendar_dates cd JOIN window_dates wd ON wd.yyyymmdd = cd.date
            WHERE cd.exception_type = 2
            UNION
            SELECT cd.service_id, cd.date
            FROM calendar_dates cd JOIN window_dates wd ON wd.yyyymmdd = cd.date
            WHERE cd.exception_type = 1
            """
        )

        con.execute("CREATE OR REPLACE TEMP TABLE valid_services AS SELECT DISTINCT service_id FROM service_window_valid")

        a_rows = con.execute(
            """
            SELECT DISTINCT nq.quay_id, r.route_id
            FROM needed_quays nq
            JOIN stop_times st ON st.stop_id = nq.quay_id
            JOIN trips t ON st.trip_id = t.trip_id
            JOIN routes r ON t.route_id = r.route_id
            """
        ).fetchall()
        for quay_id, route_id in a_rows:
            quay_lines_all.setdefault(quay_id, set()).add(route_id)

        b_rows = con.execute(
            """
            SELECT DISTINCT nq.quay_id, r.route_id
            FROM needed_quays nq
            JOIN stop_times st ON st.stop_id = nq.quay_id
            JOIN trips t ON st.trip_id = t.trip_id
            JOIN routes r ON t.route_id = r.route_id
            WHERE t.service_id IN (SELECT service_id FROM valid_services)
              AND (st.pickup_type IS NULL OR st.pickup_type != 1)
            """
        ).fetchall()
        for quay_id, route_id in b_rows:
            quay_lines_30d.setdefault(quay_id, set()).add(route_id)

    con.close()

    stopplace_lines_all: dict = {}
    stopplace_lines_30d: dict = {}
    for stop_place_id, quay_ids in stop_place_to_quays.items():
        union_all = set()
        union_30d = set()
        for quay_id in quay_ids:
            union_all |= quay_lines_all.get(quay_id, set())
            union_30d |= quay_lines_30d.get(quay_id, set())
        if union_all:
            stopplace_lines_all[stop_place_id] = union_all
        if union_30d:
            stopplace_lines_30d[stop_place_id] = union_30d

    return {
        "quay_lines_all": quay_lines_all,
        "quay_lines_30d": quay_lines_30d,
        "stopplace_lines_all": stopplace_lines_all,
        "stopplace_lines_30d": stopplace_lines_30d,
    }


# ---------------------------------------------------------------------------
# Fase C: transform (ren, uten I/O) + transaksjonell skriv
# ---------------------------------------------------------------------------
def selected_lines_is_all(selected_lines: list, key: str, cache: dict) -> bool:
    """
    True kun når selected_lines — som MENGDE, ikke bare antall — er identisk med
    minst én av de to GTFS-fasitene for denne quayen/stoppestedet. Ukjent nøkkel
    (ikke funnet i GTFS) gir alltid False — vi komprimerer aldri på en gjetning.
    """
    if not selected_lines:
        return False
    selected = set(selected_lines)
    all_lines = cache["quay_lines_all"].get(key) or cache["stopplace_lines_all"].get(key)
    if all_lines is not None and selected == all_lines:
        return True
    dep_30d = cache["quay_lines_30d"].get(key) or cache["stopplace_lines_30d"].get(key)
    if dep_30d is not None and selected == dep_30d:
        return True
    return False


def compress_quays_filter(filt: dict, cache: dict) -> tuple[dict, bool, list]:
    """
    Komprimerer selectedLines til [] per quay der den matcher en av GTFS-fasitene,
    og komprimerer i tillegg hele quays-arrayet til [] dersom ALLE quayer i filteret
    endte opp tomme (speiler compressQuaysFilter i EditStopPlaceModal/utils.ts —
    med ett unntak: en quay vi ikke kunne verifisere mot GTFS telles IKKE som tom,
    så det samlede quays-arrayet komprimeres kun når vi positivt har bekreftet alt).
    """
    quays = filt.get("quays") or []
    new_quays = []
    changed = False
    log_lines = []
    all_verified_empty = True

    for quay in quays:
        quay_id = quay.get("id")
        selected = quay.get("selectedLines") or []
        if selected and quay_id and selected_lines_is_all(selected, quay_id, cache):
            new_quays.append({"id": quay_id, "selectedLines": []})
            changed = True
            log_lines.append(f"🧹 quay {quay_id}: komprimerte {len(selected)} linjer til []")
        else:
            new_quays.append(quay)
            if selected:
                all_verified_empty = False

    if not changed:
        return filt, False, []

    if all_verified_empty:
        new_filter = {"type": "quaysFilter", "quays": []}
        log_lines.append("🧹 alle quayer verifisert tomme — komprimerte hele quays-arrayet til []")
    else:
        new_filter = {"type": "quaysFilter", "quays": new_quays}

    return new_filter, True, log_lines


def compress_stop_place_filter(filt: dict, stop_place_id: str, cache: dict) -> tuple[dict, bool, list]:
    """
    Komprimerer kun selectedLines — selectedTransportModes røres aldri, i
    motsetning til compressStopPlaceFilter i appen, som også nullstiller den.
    Denne migreringen skal utelukkende reparere selectedLines-bugen.
    """
    selected = filt.get("selectedLines") or []
    if not selected or not stop_place_id:
        return filt, False, []

    if selected_lines_is_all(selected, stop_place_id, cache):
        new_filter = {**filt, "selectedLines": []}
        return new_filter, True, [f"🧹 stopPlace {stop_place_id}: komprimerte {len(selected)} linjer til []"]

    return filt, False, []


def compress_tile(tile: dict, cache: dict) -> tuple[dict, bool, list]:
    filt = tile.get("filter") or {}
    filter_type = filt.get("type")

    if filter_type == "quaysFilter":
        new_filter, changed, logs = compress_quays_filter(filt, cache)
    elif filter_type == "stopPlaceFilter":
        new_filter, changed, logs = compress_stop_place_filter(filt, tile.get("stopPlaceId"), cache)
    else:
        return tile, False, []

    if not changed:
        return tile, False, []

    new_tile = {**tile, "filter": new_filter}
    tile_id = tile.get("uuid", "?")
    return new_tile, True, [f"tile {tile_id} · {line}" for line in logs]


def transform_tiles(tiles: list, cache: dict) -> tuple[list, int, list]:
    """Ren funksjon (ingen I/O — trygg ved transaksjons-retry)."""
    new_tiles = copy.deepcopy(tiles)
    tiles_changed = 0
    log_lines: list = []

    for i, tile in enumerate(new_tiles):
        if not tile_is_eligible(tile):
            continue
        new_tile, changed, logs = compress_tile(tile, cache)
        if changed:
            new_tiles[i] = new_tile
            tiles_changed += 1
            log_lines.extend(logs)

    return new_tiles, tiles_changed, log_lines


# ---------------------------------------------------------------------------
# Transaksjon + batch-streaming — samme mønster som 020_remove_linesWithDirection.py
# ---------------------------------------------------------------------------
@firestore.transactional
def compress_selected_lines_transactional(transaction, board_ref, cache: dict, write: bool):
    snapshot = board_ref.get(transaction=transaction)
    if not snapshot.exists:
        return {"status": "missing", "log_lines": []}

    data = snapshot.to_dict()
    if not data:
        return {"status": "unchanged", "log_lines": []}

    tiles = data.get("tiles") or []
    if not any(tile_is_eligible(t) for t in tiles):
        return {"status": "unchanged", "log_lines": []}

    new_tiles, tiles_changed, log_lines = transform_tiles(tiles, cache)

    if tiles_changed == 0:
        return {"status": "unchanged", "log_lines": log_lines}

    # Tørrkjøring (default) gjør alt arbeidet over, men lar være å skrive —
    # 020/021 har ingen slik bryter, men denne migreringen har en ekstern
    # GTFS-fasit som bør valideres før den faktisk skriver til Firestore.
    if write:
        transaction.update(board_ref, {"tiles": new_tiles})

    return {"status": "ok", "tiles_changed": tiles_changed, "log_lines": log_lines}


def stream_documents_in_batches(collection_ref, batch_size=500, limit=None):
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

        for d in docs:
            yield d
            yielded += 1
            if limit is not None and yielded >= limit:
                return

        last_doc = docs[-1]
        print(f"📦 Processed batch up to document: {last_doc.id}")
        time.sleep(1)


def update_documents(db: firestore.Client, cache: dict, write: bool, limit: int | None) -> dict:
    collection_ref = db.collection(COLLECTION)

    success_count = 0
    fail_count = 0
    total_count = 0
    tiles_changed_count = 0

    mode = "SKRIV" if write else "TØRRKJØRING (ingen skriving)"

    with open(LOG_FILENAME, "a", encoding="utf-8") as log_file:
        log_file.write(f"\n===== {mode} =====\n")
        for i, doc_snap in enumerate(stream_documents_in_batches(collection_ref, batch_size=500, limit=limit)):
            total_count += 1
            doc_id = doc_snap.id
            log_file.write(f"\n-----> 🏁 Checking document: {doc_id}\n")

            try:
                board_ref = db.collection(COLLECTION).document(doc_id)
                transaction = db.transaction()
                result = compress_selected_lines_transactional(transaction, board_ref, cache, write)
                status = result["status"]

                for line in result["log_lines"]:
                    log_file.write(f"   board {doc_id} · {line}\n")

                if status == "ok":
                    success_count += 1
                    tiles_changed_count += result["tiles_changed"]
                    log_file.write(f"✅ Updated document {doc_id} ({result['tiles_changed']} tile(r) komprimert)\n")
                elif status == "missing":
                    log_file.write(f"❌ Document doesn't exist: {doc_id}\n")
                else:
                    log_file.write(f"ℹ️ No change needed for {doc_id}\n")

            except Exception as e:  # noqa: BLE001
                fail_count += 1
                log_file.write(f"❌ Error updating {doc_id}: {str(e)}\n")

            if i % 15 == 0 and i != 0:
                log_file.write(f"\n💤 Sleeping after {i} documents...\n\n")
                log_file.flush()
                time.sleep(2)

        log_file.write(
            f"\n🎉 Finished ({mode}): {success_count} updated, {fail_count} failed, {total_count} total, "
            f"{tiles_changed_count} tiles komprimert 🎉\n"
        )

    return {
        "boards_changed": success_count,
        "boards_failed": fail_count,
        "boards_unchanged": total_count - success_count - fail_count,
        "tiles_changed": tiles_changed_count,
        "total": total_count,
    }


def print_totals(totals: dict, write: bool):
    print(f"\n{'✍️  SKREVET' if write else '🧪 TØRRKJØRING — ingenting skrevet'}")
    print(f"   Boards som ville blitt endret : {totals['boards_changed']}")
    print(f"   Tiles komprimert              : {totals['tiles_changed']}")
    print(f"   Boards uendret                : {totals['boards_unchanged']}")
    print(f"   Boards feilet                 : {totals['boards_failed']}")
    print(f"\nSe {LOG_FILENAME} for detaljer per board.")


def parse_args() -> tuple:
    env = "local"
    write = False
    limit = None
    gtfs_db = None

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
        elif arg == "--gtfs-db":
            i += 1
            gtfs_db = args[i]
        else:
            print(f"Ukjent argument: {arg}")
            sys.exit(1)
        i += 1

    if not gtfs_db:
        print("Mangler --gtfs-db <path til rb_norway.duckdb>. Se docstring for oppsett.")
        sys.exit(1)

    return env, write, limit, gtfs_db


def run():
    env, write, limit, gtfs_db = parse_args()

    db = {"local": init.local, "dev": init.dev, "prod": init.prod}[env]()
    print(f"Tilkoblet prosjekt: {db.project} ({env})")
    print(f"Modus: {'SKRIVING' if write else 'TØRRKJØRING — ingenting skrives'}")
    print(f"GTFS-database: {gtfs_db}")
    print(f"30-dagersvindu fra: {datetime.now(timezone.utc).date()}")
    if limit:
        print(f"Begrenset til {limit} boards")

    print("\n🔍 Scanner databasen...")
    stats, needed_quay_ids, needed_stop_place_ids = scan_and_collect(db, limit)
    print_scan_summary(stats, needed_quay_ids, needed_stop_place_ids)

    if stats["eligible_tiles"] == 0:
        print("\nIngenting å komprimere.")
        return

    print(f"\n🗃️  Slår opp {len(needed_quay_ids)} quays og {len(needed_stop_place_ids)} stoppesteder i GTFS...")
    cache = build_gtfs_cache(gtfs_db, needed_quay_ids, needed_stop_place_ids)
    not_found_quays = needed_quay_ids - set(cache["quay_lines_all"].keys())
    if not_found_quays:
        print(f"⚠️  {len(not_found_quays)} quays fantes ikke i GTFS — tiles som bruker dem hoppes over.")

    totals = update_documents(db, cache, write, limit)
    print_totals(totals, write)

    if not write:
        print("\nKjør på nytt med --write for å faktisk skrive endringene.")


if __name__ == "__main__":
    run()
