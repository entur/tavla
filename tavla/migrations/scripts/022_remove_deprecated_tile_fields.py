"""
Purpose: Remove deprecated fields from tiles in Firestore documents

Description:
1. Iterates through all documents in the "boards" collection.
2. For each tile in tiles[], checks if any of the deprecated fields exist:
   quays, linesWithDirection, placeId, type, whitelistedLines, whitelistedTransportModes.
3. If any exist, removes them from the tile.
4. All other fields remain unchanged. The script logs every operation to a file.

Usage:
    ./migration run scripts/022_remove_deprecated_tile_fields.py

Date: 2026-11-17
Author: Agnes
"""

from google.cloud import firestore
import time
import copy
import init

collection_name = "boards"

DEPRECATED_FIELDS = [
    "quays",
    "linesWithDirection",
    "placeId",
    "type",
    "whitelistedLines",
    "whitelistedTransportModes",
]

def remove_deprecated_fields_from_tiles(data: dict) -> tuple[dict, list]:
    log_lines: list = []

    if not data:
        log_lines.append(f"❌ No data..")
        return data, log_lines

    changed = False

    if "tiles" in data and isinstance(data["tiles"], list):
        tiles = data["tiles"]
        updated_tiles = []

        for tile in tiles:
            if not isinstance(tile, dict):
                updated_tiles.append(tile)
                continue

            for field in DEPRECATED_FIELDS:
                if field in tile:
                    old_value = tile[field]
                    del tile[field]
                    changed = True
                    log_lines.append(f"🧹 Removed '{field}' from tile, old value: {old_value}")

            updated_tiles.append(tile)

        if changed:
            data["tiles"] = updated_tiles
    else:
        log_lines.append(f"⚠️ No 'tiles' field (or not a list) on this document")

    return data, log_lines


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

@firestore.transactional
def remove_deprecated_fields_transactional(transaction, board_ref):
    snapshot = board_ref.get(transaction=transaction)
    if not snapshot.exists:
        return {"status": "missing", "log_lines": []}

    data = snapshot.to_dict()
    if not data:
        return {"status": "unchanged", "log_lines": ["⚠️ Document exists but has no data"]}

    original_data = copy.deepcopy(data)
    new_data, log_lines = remove_deprecated_fields_from_tiles(data)

    if new_data == original_data:
        return {"status": "unchanged", "log_lines": log_lines}

    transaction.update(board_ref, {"tiles": new_data.get("tiles", [])})

    return {"status": "ok", "log_lines": log_lines}


def update_documents(db: firestore.Client):
    collection_ref = db.collection(collection_name)

    success_count = 0
    fail_count = 0
    total_count = 0

    with open("remove_deprecated_tile_fields_log.txt", "a", encoding="utf-8") as log_file:
        for i, doc_snap in enumerate(stream_documents_in_batches(collection_ref, batch_size=500)):
            total_count += 1
            doc_id = doc_snap.id
            log_file.write(f"\n-----> 🏁 Checking document: {doc_id}\n")

            try:
                board_ref = db.collection(collection_name).document(doc_id)
                transaction = db.transaction()
                result = remove_deprecated_fields_transactional(transaction, board_ref)
                status = result["status"]

                for line in result["log_lines"]:
                    log_file.write(f"   board {doc_id} · {line}\n")

                if status == "ok":
                    success_count += 1
                    log_file.write(f"✅ Updated document {doc_id}\n")
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
                time.sleep(1)

        log_file.write(
            f"\n🎉 Finished: {success_count} updated, {fail_count} failed, {total_count} total 🎉\n"
        )


def run():
    db = init.dev()
    print(f"Connected to project: {db.project}, host: {getattr(db, '_emulator_host', None)}")
    update_documents(db)


if __name__ == "__main__":
    run()
