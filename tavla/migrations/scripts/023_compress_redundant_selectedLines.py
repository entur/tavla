"""
Purpose: Komprimer tile.filter.quaysFilter.quays[].selectedLines til [] der
den feilaktig representerer «alle linjer» — reparerer en bug arvet fra det
gamle tile.quays-feltet.

Description:
1. tile.quays (fjernet i migrering 021) hadde en bug: å velge *alle* linjer på
   en plattform skulle komprimeres til [] («ingen filter, vis alt»), men en
   string/number-sammenligningsfeil i TileCard/utils.ts (fikset i commit
   1a00e084) gjorde at kompresjonen aldri slo inn. Det fulle, eksplisitte
   linje-arrayet ble lagret i stedet. Migrering 021 kopierte denne uferdige
   dataen rett inn i quaysFilter.quays[].selectedLines.
2. Kun quaysFilter er berørt. stopPlaceFilter.selectedLines kan ikke ha arvet
   bugen: migrering 021 satte den alltid til et hardkodet tomt array for
   tiles uten et gammelt quays-array, og dagens StopPlaceFilterView-UI
   komprimerer korrekt ved lagring. Denne migreringen rører derfor aldri
   stopPlaceFilter.
3. «Alle linjer» for en quay avgjøres mot én fasit: alle linjer som
   noensinne har hatt en stop_times-rad på quayen, hentet fra en lokal
   GTFS-dump (Entur sin "rb_norway-aggregated-gtfs"), validert til 94 %
   eksakt match mot live-API-ets quay.lines på et utvalg på 100 quays. Dette
   dekker ikke linjer valgt ut fra et snevrere, avgangsbasert syn på "alle" —
   se https://claude.ai/artifact/BQcXUnucHpgWxvxfb2qnCE for analysen bak
   42 %-anslaget denne migreringen bygger på.
4. selectedLines komprimeres til [] kun når den er identisk (som mengde) med
   denne fasiten. Alt annet røres ikke: migreringen er strengt innskrenkende —
   den komprimerer aldri til noe annet enn [], legger aldri til linjer, og
   kollapser aldri selve quays-arrayet (se compress_quays_filter for hvorfor).
5. En quay uten stop_times-rader i GTFS-dumpen kan ikke verifiseres, og
   tiles som bruker den hoppes derfor over fremfor å gjette (samme prinsipp
   som 019).
6. GTFS-oppslag gjøres i en prefetch-fase utenfor Firestore-transaksjonene
   (også som i 019), slik at transaksjonscallbacken er fri for side-effekter.

Forutsetning:
    En lokal DuckDB-fil bygget fra Entur sin nasjonale GTFS-eksport
    ("rb_norway-aggregated-gtfs"), med tabellene stop_times, trips og routes
    importert (se --gtfs-db under). Følger ikke med repoet — må lastes ned og
    bygges separat, og er et øyeblikksbilde som bør fornyes før en skarp
    kjøring i prod.

Usage:
    # Tørrkjøring (default — skriver ingenting, kun rapport):
    ./migration run scripts/023_compress_redundant_selectedLines.py local --gtfs-db /path/to/rb_norway.duckdb

    # Faktisk skriving:
    ./migration run scripts/023_compress_redundant_selectedLines.py local --gtfs-db /path/to/rb_norway.duckdb --write

    # Begrens til de N første boardene (rask test):
    ./migration run scripts/023_compress_redundant_selectedLines.py local --gtfs-db /path/to/rb_norway.duckdb --limit 50

Date: 2026-11-16
Author: Magnus
"""

import copy
import sys
import time

import duckdb
import init
from google.cloud import firestore

collection_name = "boards"
LOG_FILENAME = "migration_023_log.txt"


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


def tile_is_eligible(tile: dict) -> bool:
    return bool(quays_filter_quay_entries(tile))


def scan_and_collect(db: firestore.Client, limit: int | None) -> tuple:
    stats = {
        "total_boards": 0,
        "total_tiles": 0,
        "eligible_boards": 0,
        "eligible_tiles": 0,
        "eligible_quay_rows": 0,
    }
    needed_quay_ids = set()

    for doc_snap in stream_documents_in_batches(db.collection(collection_name), batch_size=500, limit=limit):
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

        if board_has_work:
            stats["eligible_boards"] += 1

    return stats, needed_quay_ids


def print_scan_summary(stats: dict, needed_quay_ids: set):
    print("\n📊 Status før migrering:")
    print(f"   Boards skannet              : {stats['total_boards']}")
    print(f"   Boards med kandidater       : {stats['eligible_boards']}")
    print(f"   Tiles totalt                : {stats['total_tiles']}")
    print(f"   Tiles med kandidater        : {stats['eligible_tiles']}")
    print(f"   — quaysFilter-quayrader     : {stats['eligible_quay_rows']}")
    print(f"   Unike quays å slå opp       : {len(needed_quay_ids)}")


# ---------------------------------------------------------------------------
# Fase B: prefetch linjesett per quay fra lokal GTFS — UTENFOR transaksjon
# ---------------------------------------------------------------------------
def build_gtfs_cache(gtfs_db_path: str, needed_quay_ids: set) -> dict:
    """
    Returnerer {"quay_lines_all": {quay_id: set(route_id)}} — alle linjer som
    noensinne har stoppet ved hver quay. En quay uten data i GTFS er
    fraværende fra dict-en, behandlet som «ukjent, hopp over».
    """
    con = duckdb.connect(gtfs_db_path, read_only=True)

    quay_lines_all: dict = {}

    if needed_quay_ids:
        params = list(needed_quay_ids)

        con.execute(
            f"CREATE OR REPLACE TEMP TABLE needed_quays AS SELECT * FROM "
            f"(VALUES {','.join('(?)' for _ in needed_quay_ids)}) AS t(quay_id)",
            params,
        )

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

    con.close()

    return {"quay_lines_all": quay_lines_all}


# ---------------------------------------------------------------------------
# Fase C: transform (ren, uten I/O) + transaksjonell skriv
# ---------------------------------------------------------------------------
def selected_lines_is_all(selected_lines: list, quay_id: str, cache: dict) -> bool:
    """True kun når selected_lines er identisk med GTFS-fasiten for quayen.
    Ukjent quay (ikke funnet i GTFS) gir alltid False."""
    if not selected_lines:
        return False
    all_lines = cache["quay_lines_all"].get(quay_id)
    if all_lines is None:
        return False
    return set(selected_lines) == all_lines


def compress_quays_filter(filt: dict, cache: dict) -> tuple[dict, bool, list]:
    """
    Komprimerer selectedLines til [] per quay som matcher GTFS-fasiten, uten
    å røre quays-arrayets struktur eller lengde. Frontend sin
    expandQuaysFilter (EditStopPlaceModal/utils.ts) tolker en tom quays-array
    som «ingen filter konfigurert» og viser da alle quayer på stoppestedet,
    ikke bare de som sto i filteret — å kollapse arrayet her kunne dermed
    utvidet et bevisst smalt filter i stedet for å innskrenke det. Den
    avgjørelsen eies av frontend sin egen compressQuaysFilter, som sjekker
    mot stoppestedets fulle quay-liste.
    """
    quays = filt.get("quays") or []
    new_quays = []
    changed = False
    log_lines = []

    for quay in quays:
        quay_id = quay.get("id")
        selected = quay.get("selectedLines") or []
        if selected and quay_id and selected_lines_is_all(selected, quay_id, cache):
            new_quays.append({"id": quay_id, "selectedLines": []})
            changed = True
            log_lines.append(f"🧹 quay {quay_id}: komprimerte {len(selected)} linjer til []")
        else:
            new_quays.append(quay)

    if not changed:
        return filt, False, []

    new_filter = {"type": "quaysFilter", "quays": new_quays}
    return new_filter, True, log_lines


def compress_tile(tile: dict, cache: dict) -> tuple[dict, bool, list]:
    """Rører kun quaysFilter-tiles — stopPlaceFilter har ingen bug å reparere (se docstring)."""
    filt = tile.get("filter") or {}
    if filt.get("type") != "quaysFilter":
        return tile, False, []

    new_filter, changed, logs = compress_quays_filter(filt, cache)
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
    collection_ref = db.collection(collection_name)

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
                board_ref = db.collection(collection_name).document(doc_id)
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

            except Exception as e:
                fail_count += 1
                log_file.write(f"❌ Error updating {doc_id}: {str(e)}\n")

            if i % 15 == 0 and i != 0:
                log_file.flush()

            if i % 100 == 0 and i != 0:
                log_file.write(f"\n💤 Sleeping after {i} documents...\n\n")
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
    if limit:
        print(f"Begrenset til {limit} boards")

    print("\n🔍 Scanner databasen...")
    stats, needed_quay_ids = scan_and_collect(db, limit)
    print_scan_summary(stats, needed_quay_ids)

    if stats["eligible_tiles"] == 0:
        print("\nIngenting å komprimere.")
        return

    print(f"\n🗃️  Slår opp {len(needed_quay_ids)} quays i GTFS...")
    cache = build_gtfs_cache(gtfs_db, needed_quay_ids)
    not_found_quays = needed_quay_ids - set(cache["quay_lines_all"].keys())
    if not_found_quays:
        print(f"⚠️  {len(not_found_quays)} quays fantes ikke i GTFS — tiles som bruker dem hoppes over.")

    totals = update_documents(db, cache, write, limit)
    print_totals(totals, write)

    if not write:
        print("\nKjør på nytt med --write for å faktisk skrive endringene.")


if __name__ == "__main__":
    run()
