"""
Purpose: Erstatt gamle linje-ID-er med nye i boards-samlingen

Description:
    Itererer gjennom alle boards og oppdaterer whitelistedLines på to nivåer:
    - tiles[].whitelistedLines (deprecated felt som fortsatt kan finnes i unmigrated docs)
    - tiles[].quays[].whitelistedLines (gjeldende struktur)

    Mapping-en er hentet fra tavla/app/_utils/compatibility.ts og tilsvarer
    ID-endringer da VY/NSB/GJB gikk over til nye linje-ID-er.

    Etter at migreringen er kjørt og verifisert med BigQuery kan compatibility.ts slettes.

Usage:
    ./migration run scripts/015_migrate_line_ids.py

Date: 2026-05-21
Author: Guro
"""

import copy
import time

import init
from google.cloud import firestore

COLLECTION = "boards"

LINE_ID_MAP = {
    "VYG:Line:41": "VYG:Line:F4",
    "VYG:Line:45": "VYG:Line:R40",
    "VYG:Line:43": "VYG:Line:L4",
    "FLB:Line:42": "VYG:Line:R45",
    "VYG:Line:70": "VYG:Line:F1",
    "NSB:Line:R20": "VYG:Line:RE20",
    "NSB:Line:RX20": "VYG:Line:RX20",
    "NSB:Line:L21": "VYG:Line:R21",
    "NSB:Line:L22": "VYG:Line:R22",
    "NSB:Line:R23": "VYG:Line:R23",
    "NSB:Line:R23x": "VYG:Line:R23x",
    "NSB:Line:L2": "VYG:Line:L2",
    "NSB:Line:L2x": "VYG:Line:L2x",
    "GJB:Line:R30": "VYG:Line:RE30",
    "GJB:Line:L3": "VYG:Line:R31",
    "NSB:Line:R10": "VYG:Line:RE10",
    "NSB:Line:R11": "VYG:Line:RE11",
    "NSB:Line:RX11": "VYG:Line:RX11",
    "NSB:Line:L12": "VYG:Line:R12",
    "NSB:Line:L13": "VYG:Line:R13",
    "NSB:Line:R13x": "VYG:Line:R13x",
    "NSB:Line:L14": "VYG:Line:R14",
    "NSB:Line:52": "VYG:Line:R55",
    "NSB:Line:L1": "VYG:Line:L1",
}

OLD_IDS = set(LINE_ID_MAP.keys())


def remap_lines(line_ids: list) -> tuple:
    """Returns (remapped_list, changed_ids) where changed_ids lists replaced IDs."""
    remapped = [LINE_ID_MAP.get(lid, lid) for lid in line_ids]
    changed_ids = [lid for lid in line_ids if lid in OLD_IDS]
    return remapped, changed_ids


def board_has_old_ids(tiles: list) -> bool:
    for tile in tiles:
        if any(lid in OLD_IDS for lid in tile.get("whitelistedLines") or []):
            return True
        for quay in tile.get("quays") or []:
            if any(lid in OLD_IDS for lid in quay.get("whitelistedLines") or []):
                return True
    return False


def transform_tiles(tiles: list, log_file) -> tuple:
    """
    Returns (new_tiles, total_change_count).
    Remaps old IDs in both tile-level and quay-level whitelistedLines.
    """
    new_tiles = copy.deepcopy(tiles)
    total_changes = 0

    for tile in new_tiles:
        tile_lines = tile.get("whitelistedLines") or []
        if tile_lines:
            remapped, changed_ids = remap_lines(tile_lines)
            if changed_ids:
                tile["whitelistedLines"] = remapped
                total_changes += len(changed_ids)
                for old_id in changed_ids:
                    log_file.write(f"   🔄 tile.whitelistedLines: {old_id} → {LINE_ID_MAP[old_id]}\n")

        for quay in tile.get("quays") or []:
            quay_lines = quay.get("whitelistedLines") or []
            if quay_lines:
                remapped, changed_ids = remap_lines(quay_lines)
                if changed_ids:
                    quay["whitelistedLines"] = remapped
                    total_changes += len(changed_ids)
                    for old_id in changed_ids:
                        log_file.write(f"   🔄 quays[{quay.get('id', '?')}].whitelistedLines: {old_id} → {LINE_ID_MAP[old_id]}\n")

    return new_tiles, total_changes


@firestore.transactional
def migrate_board(transaction, board_ref, log_file):
    snapshot = board_ref.get(transaction=transaction)
    if not snapshot.exists:
        log_file.write(f"☠️ Board finnes ikke: {board_ref.id}\n")
        return False

    data = snapshot.to_dict()
    tiles = data.get("tiles") or []

    if not board_has_old_ids(tiles):
        return None  # None = ingen endring nødvendig

    new_tiles, change_count = transform_tiles(tiles, log_file)
    transaction.update(board_ref, {"tiles": new_tiles})
    log_file.write(f"✅ {board_ref.id}: {change_count} linje-id(er) oppdatert\n")
    return True


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


def migrate_all(db: firestore.Client):
    collection_ref = db.collection(COLLECTION)
    success_count = 0
    skip_count = 0
    fail_count = 0
    total_count = 0

    log_filename = "migration_015_log.txt"

    with open(log_filename, "a", encoding="utf-8") as log_file:
        for i, doc_snap in enumerate(stream_in_batches(collection_ref)):
            total_count += 1
            board_id = doc_snap.id
            log_file.write(f"\n-----> 🏁 Board: {board_id}\n")

            try:
                board_ref = db.collection(COLLECTION).document(board_id)
                transaction = db.transaction()
                result = migrate_board(transaction, board_ref, log_file)

                if result is True:
                    success_count += 1
                elif result is None:
                    skip_count += 1
                    log_file.write(f"⏭️ Ingen gamle ID-er, hopper over\n")
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
            f"\n🎉 Ferdig: {success_count} oppdatert, {skip_count} hoppet over, "
            f"{fail_count} feilet, {total_count} totalt 🎉\n"
        )
        print(f"Migrering fullført. Se {log_filename} for detaljer.")


def run():
    db = init.dev()  # Bytt til init.prod() når klar for prod
    print(f"Tilkoblet prosjekt: {db.project}")
    migrate_all(db)


if __name__ == "__main__":
    run()
