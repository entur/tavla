"""
Purpose: Remove deprecated fields from tiles in Firestore board documents.

Description:
    Iterates through all documents in the "boards" collection and removes the
    following deprecated fields from each tile object:
      - placeId             (replaced by stopPlaceId)
      - type                (enum 'stop_place' | 'quay', replaced by quays structure)
      - whitelistedLines    (moved to tiles[].quays[].whitelistedLines)
      - whitelistedTransportModes (removed, no replacement)

    These fields were kept for backward compatibility after migration 011
    (011_rename_placeId_add_quays.py) which introduced the new quays structure.
    This script completes the "contract" phase of the Expand and Contract pattern.

    NOTE: Only tile-level fields are removed. Fields inside tiles[].quays[] are
    NOT touched — quays[].whitelistedLines is the valid new structure and must
    be preserved.

    Documents with no deprecated fields are skipped without any write.

Usage:
    ./migration run scripts/017_remove_deprecated_tile_fields.py

Date: 2026-07-01
Author: Maiken
"""

from google.cloud import firestore
import time
import copy
import init

collection_name = "boards"

DEPRECATED_FIELDS = {"placeId", "type", "whitelistedLines", "whitelistedTransportModes"}


def remove_deprecated_tile_fields(data: dict, log_file) -> dict:
    if not data:
        return data

    tiles = data.get("tiles")
    if not isinstance(tiles, list) or len(tiles) == 0:
        return data

    changed = False
    updated_tiles = []

    for tile in tiles:
        if not isinstance(tile, dict):
            updated_tiles.append(tile)
            continue

        found_fields = DEPRECATED_FIELDS & tile.keys()

        if found_fields:
            new_tile = {k: v for k, v in tile.items() if k not in DEPRECATED_FIELDS}
            changed = True
            log_file.write(f"🧹 Removed deprecated fields {found_fields} from tile '{tile.get('uuid', 'unknown')}'\n")
            updated_tiles.append(new_tile)
        else:
            updated_tiles.append(tile)

    if changed:
        data["tiles"] = updated_tiles

    return data


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


def update_documents(db: firestore.Client):
    collection_ref = db.collection(collection_name)

    success_count = 0
    fail_count = 0
    skipped_count = 0
    total_count = 0

    with open("migration_017_log.txt", "a", encoding="utf-8") as log_file:
        for i, doc_snap in enumerate(stream_documents_in_batches(collection_ref, batch_size=500)):
            total_count += 1
            doc_id = doc_snap.id
            log_file.write(f"\n-----> 🏁 Checking document: {doc_id}\n")

            try:
                data = doc_snap.to_dict()
                if not data:
                    log_file.write("⚠️ Empty or missing data, skipping.\n")
                    skipped_count += 1
                    continue

                original_data = copy.deepcopy(data)
                new_data = remove_deprecated_tile_fields(data, log_file)

                if new_data != original_data:
                    db.collection(collection_name).document(doc_id).set(new_data, merge=True)
                    success_count += 1
                    log_file.write(f"✅ Updated document {doc_id}\n")
                else:
                    skipped_count += 1
                    log_file.write(f"ℹ️ No deprecated fields found, skipping {doc_id}\n")

            except Exception as e:
                fail_count += 1
                log_file.write(f"❌ Error updating {doc_id}: {str(e)}\n")

            if i % 15 == 0 and i != 0:
                log_file.write(f"\n💤 Sleeping after {i} documents...\n\n")
                log_file.flush()
                time.sleep(2)

        log_file.write(
            f"\n🎉 Finished: {success_count} updated, {skipped_count} skipped, {fail_count} failed, {total_count} total 🎉\n"
        )


def run():
    db = init.prod()
    print(f"Connected to project: {db.project}, host: {getattr(db, '_emulator_host', None)}")
    update_documents(db)


if __name__ == "__main__":
    run()
