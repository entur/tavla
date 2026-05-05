"""
Purpose: Remove leftover commas in the name fields of boards and remove unused combinedTiles field

Description:
    Iterates through all the boards and copies all names which have commas in them to a list.
    For all the names in this list, creates a new name where the comma and anything after the first comma is removed.
    These two lists, with an arrow like this:
        "Old, name -> Old"
    Shows how the names will be changed to verify. Does NOT update the boards yet, as that will be implemented
    once the logic is deemed correct.

Usage:
    ./migration run scripts/014_remove_commas_and_combinedTiles_field.py

Date: 2026-04-16
Author: Ola
"""

from google.cloud import firestore
import time
from enum import Enum
import init

boards = "boards"


class MigrationResult(Enum):
    UPDATED = "updated"
    SKIPPED = "skipped"
    FAILED = "failed"


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


def update_board(doc_snap, log_file) -> MigrationResult:
    doc_id = doc_snap.id

    if not doc_snap.exists:
        log_file.write(f"❌ Document doesn't exist (id={doc_id})\n")
        return MigrationResult.FAILED

    data = doc_snap.to_dict()
    if not data:
        log_file.write(f"❌ No data for document (id={doc_id})\n")
        return MigrationResult.FAILED

    updates = {}

    # Remove comma and everything after the first comma
    tiles = data.get("tiles")
    if isinstance(tiles, list):
        new_tiles = []
        tiles_changed = False
        for tile in tiles:
            new_tile = dict(tile)
            name = tile.get("name")
            if isinstance(name, str) and "," in name:
                new_name = name.split(",")[0]
                log_file.write(f"  ✏️  Tile name: \"{name}\" -> \"{new_name}\"\n")
                new_tile["name"] = new_name
                tiles_changed = True
            new_tiles.append(new_tile)
        if tiles_changed:
            updates["tiles"] = new_tiles

    # Remove combinedTiles field if present
    if "combinedTiles" in data:
        board_name = data.get("name", "<no name>")
        log_file.write(f"  🗑️  Removing 'combinedTiles' field (board name: \"{board_name}\")\n")
        updates["combinedTiles"] = firestore.DELETE_FIELD

    if not updates:
        return MigrationResult.SKIPPED

    doc_snap.reference.update(updates)
    log_file.write(f"  ✅ Updated document (id={doc_id})\n")
    return MigrationResult.UPDATED


def migrate(db: firestore.Client):
    collection_ref = db.collection(boards)

    success_count = 0
    skip_count = 0
    fail_count = 0
    total_count = 0

    log_filename = f"{db.project}_migration_014_log.txt"

    with open(log_filename, "a", encoding="utf-8") as log_file:
        log_file.write("--- Starting migration 014: remove commas from names and combinedTiles field ---\n")

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
    db = init.prod()
    migrate(db)


if __name__ == "__main__":
    run_migration()