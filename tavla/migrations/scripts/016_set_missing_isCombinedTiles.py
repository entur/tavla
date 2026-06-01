"""
Purpose: Sett isCombinedTiles = False på boards som mangler feltet

Description:
    Itererer gjennom alle boards og setter isCombinedTiles til False
    på boards der feltet ikke eksisterer. Boards som allerede har feltet
    (uavhengig av verdi) hoppes over.

    Rotårsaken til manglende felt er duplisering av gamle boards som aldri
    fikk feltet satt da det ble introdusert i migrasjon 013. False er riktig
    konservativ default — tilsvarer "separate tiles", som er fallback-en
    alle eksisterende code paths bruker.

Usage:
    ./migration run scripts/016_set_missing_isCombinedTiles.py

Date: 2026-05-28
Author: Ingebjørg
"""

import time

import init
from google.cloud import firestore

COLLECTION = "boards"
FIELD = "isCombinedTiles"
DEFAULT_VALUE = False


def board_is_missing_field(data: dict) -> bool:
    return FIELD not in data


def scan_missing(db: firestore.Client) -> dict:
    """
    Les gjennom alle boards og tell hvor mange som mangler isCombinedTiles.
    Returnerer:
        {
            "total_boards": int,
            "missing_boards": int,
        }
    """
    total_boards = 0
    missing_boards = 0

    for doc_snap in stream_in_batches(db.collection(COLLECTION)):
        total_boards += 1
        data = doc_snap.to_dict()
        if board_is_missing_field(data):
            missing_boards += 1

    return {
        "total_boards": total_boards,
        "missing_boards": missing_boards,
    }


def print_scan_summary(label: str, scan: dict):
    print(f"\n📊 Status {label} migrering:")
    print(f"   Totalt boards skannet       : {scan['total_boards']}")
    print(f"   Boards uten isCombinedTiles : {scan['missing_boards']}")
    if scan["missing_boards"] == 0:
        print("   ✅ Ingen boards mangler feltet\n")
    else:
        print()


@firestore.transactional
def migrate_board(transaction, board_ref, log_file):
    snapshot = board_ref.get(transaction=transaction)
    if not snapshot.exists:
        log_file.write(f"☠️ Board finnes ikke: {board_ref.id}\n")
        return False

    data = snapshot.to_dict()

    if not board_is_missing_field(data):
        return None  # None = ingen endring nødvendig

    transaction.update(board_ref, {FIELD: DEFAULT_VALUE})
    log_file.write(f"✅ {board_ref.id}: isCombinedTiles satt til {DEFAULT_VALUE}\n")
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

    log_filename = "migration_016_log.txt"

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
                    log_file.write("⏭️ isCombinedTiles allerede definert, hopper over\n")
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

    print("\n🔍 Scanner databasen før migrering...")
    before = scan_missing(db)
    print_scan_summary("FØR", before)

    if before["missing_boards"] == 0:
        print("Ingen boards mangler isCombinedTiles — migrering ikke nødvendig.")
        return

    migrate_all(db)

    print("\n🔍 Scanner databasen etter migrering...")
    after = scan_missing(db)
    print_scan_summary("ETTER", after)


if __name__ == "__main__":
    run()
