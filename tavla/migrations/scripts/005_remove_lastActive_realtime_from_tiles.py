"""
Purpose: Remove "realtime" from tiles[].columns in Firestore documents and remove "lastActive" from meta.

Description:
1. Iterates through all documents in a specified Firestore collection (e.g. "boards").
2. For each document, removes the string "realtime" from each tile.columns array if
    it exists.
3. Removes the "lastActive" field from the "meta" object if it exists.
4. All other fields remain unchanged. The script logs every operation to a file.

Usage:
    ./migration run scripts/005_remove_lastActive_realtime_from_tiles.py

Date: 2025-10-23
Author: Erlend
"""

from google.cloud import firestore
import time
import copy 
import init 


collection_name = "boards" 


def remove_realtime_from_tiles(data: dict, log_file) -> dict:
    if not data:
        return data 

    changed = False

    # Remove 'realtime' from tiles[].columns
    if "tiles" in data and isinstance(data["tiles"], list):
        tiles = data["tiles"]
        updated_tiles = []
        for tile in tiles:
            if not isinstance(tile, dict):
                updated_tiles.append(tile)
                continue

            columns = tile.get("columns")
            if isinstance(columns, list) and "realtime" in columns:
                old_columns = list(columns)
                new_columns = [c for c in columns if c != "realtime"]
                tile["columns"] = new_columns
                changed = True
                log_file.write(f"🧹 Removed 'realtime' from columns: {old_columns} -> {new_columns}\n")
            updated_tiles.append(tile)
        if changed:
            data["tiles"] = updated_tiles

    ## Remove old 'lastActive' field from meta if it exists
    if "meta" in data and isinstance(data["meta"], dict):
        if "lastActive" in data["meta"]:
            old_value = data["meta"]["lastActive"]
            del data["meta"]["lastActive"]
            changed = True
            log_file.write(f"🧹 Removed 'lastActive' from meta: {old_value}\n")

    return data


def update_documents(db: firestore.Client):
    docs = db.collection(collection_name).stream()

    success_count = 0
    fail_count = 0
    total_count = 0

    with open("remove_realtime_log.txt", "a", encoding="utf-8") as log_file:
        for i, doc_snap in enumerate(docs):
            total_count += 1
            doc_id = doc_snap.id
            log_file.write(f"\n-----> 🏁 Checking document: {doc_id}\n")

            try:
                data = doc_snap.to_dict()
                if not data:
                    log_file.write("⚠️ Empty or missing data, skipping.\n")
                    continue

                original_data = copy.deepcopy(data)

                new_data = remove_realtime_from_tiles(data, log_file)

                if new_data != original_data:
                    db.collection(collection_name).document(doc_id).set(new_data)
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
    db = init.local()
    print(f"Connected to project: {db.project}, host: {getattr(db, '_emulator_host', None)}")
    update_documents(db)


if __name__ == "__main__":
    run()
