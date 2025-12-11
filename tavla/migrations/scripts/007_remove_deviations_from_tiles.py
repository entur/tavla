"""
Purpose: Remove "deviations" from tiles[].columns in Firestore documents 

Description:
1. Iterates through all documents in a specified Firestore collection (e.g. "boards").
2. For each document, removes the string "deviations" from each tile.columns array if
    it exists.
3. All other fields remain unchanged. The script logs every operation to a file.

Usage:
    ./migration run scripts/006_remove_deviations_from_tiles.py

Date: 2025-10-23
Author: Erlend
"""

from google.cloud import firestore
import time
import copy
import init

collection_name = "boards"


def remove_deviations_from_tiles(data: dict, log_file) -> dict:
    if not data:
        return data

    changed = False

    # Remove 'deviations' from tiles[].columns
    if "tiles" in data and isinstance(data["tiles"], list):
        tiles = data["tiles"]
        updated_tiles = []
        for tile in tiles:
            if not isinstance(tile, dict):
                updated_tiles.append(tile)
                continue

            columns = tile.get("columns")
            if isinstance(columns, list) and "deviations" in columns:
                old_columns = list(columns)
                new_columns = [c for c in columns if c != "deviations"]
                tile["columns"] = new_columns
                changed = True
                log_file.write(
                    f"🧹 Removed 'deviations' from columns: {old_columns} -> {new_columns}\n"
                )
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
        time.sleep(1)  # Optional small pause between batches


def update_documents(db: firestore.Client):
    collection_ref = db.collection(collection_name)

    success_count = 0
    fail_count = 0
    total_count = 0

    with open("remove_deviations_log.txt", "a", encoding="utf-8") as log_file:
        for i, doc_snap in enumerate(stream_documents_in_batches(collection_ref, batch_size=500)):
            total_count += 1
            doc_id = doc_snap.id
            log_file.write(f"\n-----> 🏁 Checking document: {doc_id}\n")

            try:
                data = doc_snap.to_dict()
                if not data:
                    log_file.write("⚠️ Empty or missing data, skipping.\n")
                    continue

                original_data = copy.deepcopy(data)
                new_data = remove_deviations_from_tiles(data, log_file)

                if new_data != original_data:
                    db.collection(collection_name).document(doc_id).set(new_data, merge=True)
                    success_count += 1
                    log_file.write(f"✅ Updated document {doc_id}\n")
                    log_file.write(f"📝 Old tiles: {original_data.get('tiles')}\n")
                    log_file.write(f"🆕 New tiles: {new_data.get('tiles')}\n")
                else:
                    log_file.write(f"ℹ️ No change needed for {doc_id}\n")

            except Exception as e:
                fail_count += 1
                log_file.write(f"❌ Error updating {doc_id}: {str(e)}\n")

            if i % 15 == 0 and i != 0:
                log_file.write(f"\n💤 Sleeping after {i} documents...\n\n")
                log_file.flush()
                time.sleep(2)

        log_file.write(
            f"\n🎉 Finished: {success_count} updated, {fail_count} failed, {total_count} total 🎉\n"
        )


def run():
    db = init.prod()
    print(f"Connected to project: {db.project}, host: {getattr(db, '_emulator_host', None)}")
    update_documents(db)


if __name__ == "__main__":
    run()
