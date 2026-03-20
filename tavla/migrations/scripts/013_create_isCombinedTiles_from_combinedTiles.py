"""
Purpose: Update boards to have a new boolean field "isCombinedTiles" based on the existing "combinedTiles" field.

Description:
    Iterates through all the boards and sets a new field like this:
        isCombinedTiles = combinedTiles && combinedTiles.length > 0
    All boards are updated, even those who don't have a combinedTiles field, as every board should have
    either a true or a false in this field. If the field already exists, we don't change it.

Usage:
    ./migration run scripts/013_create_isCombinedTiles_from_combinedTiles.py

Date: 2026-03-18
Author: Ola
"""

from google.cloud import firestore
import time
from enum import Enum
import init

boards = "boards"


def compute_is_combined_tiles(data: dict) -> bool:
    combined_tiles = data.get("combinedTiles")
    return isinstance(combined_tiles, list) and len(combined_tiles) > 0


class MigrationResult(Enum):
    UPDATED = "updated"
    SKIPPED = "skipped"
    FAILED = "failed"


def update_board(doc_snap, log_file) -> MigrationResult:
    doc_id = doc_snap.id

    if not doc_snap.exists:
        log_file.write(f"❌ Document doesn't exist (id={doc_id})\n")
        return MigrationResult.FAILED

    data = doc_snap.to_dict()
    if not data:
        log_file.write(f"❌ No data for document (id={doc_id})\n")
        return MigrationResult.FAILED

    if "isCombinedTiles" in data:
        log_file.write(
            f"ℹ️ 'isCombinedTiles' already exists ({data['isCombinedTiles']}), skipping document (id={doc_id})\n"
        )
        return MigrationResult.SKIPPED

    is_combined = compute_is_combined_tiles(data)
    doc_snap.reference.update({"isCombinedTiles": is_combined})
    log_file.write(f"✅ Set 'isCombinedTiles' = {is_combined} for document (id={doc_id})\n")
    return MigrationResult.UPDATED


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


def migrate_field(db: firestore.Client):
    collection_ref = db.collection(boards)

    success_count = 0
    skip_count = 0
    fail_count = 0
    total_count = 0

    log_filename = f"{db.project}_migration_012_log.txt"

    with open(log_filename, "a", encoding="utf-8") as log_file:
        log_file.write("--- Starting migration 012: create isCombinedTiles from combinedTiles ---\n")

        for i, doc_snap in enumerate(stream_documents_in_batches(collection_ref, batch_size=500)):
            total_count += 1
            doc_id = doc_snap.id
            log_file.write(f"\n-----> 🏁 Checking document: {doc_id}\n")

            try:
                result = update_board(doc_snap, log_file)

                if result == MigrationResult.UPDATED:
                    success_count += 1
                    log_file.write(f"✅ Updated document {doc_id}\n")
                elif result == MigrationResult.SKIPPED:
                    skip_count += 1
                elif result == MigrationResult.FAILED:
                    fail_count += 1

            except Exception as e:
                fail_count += 1
                log_file.write(f"❌ Error updating {doc_id}: {str(e)}\n")

            if i % 15 == 0 and i != 0:
                log_file.flush()

            if i % 100 == 0 and i != 0:
                log_file.write(f"😴 Taking a nap after {i} documents...\n")
                log_file.flush()
                time.sleep(1)

        log_file.write(
            f"\n🎉 Migration complete: {success_count} updated, {skip_count} skipped, "
            f"{fail_count} failed, {total_count} total 🎉\n"
        )
        print(f"Migration complete. Check {log_filename} for details.")


def run_migration():
    db = init.local()
    migrate_field(db)


if __name__ == "__main__":
    run_migration()