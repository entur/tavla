"""
Purpose: Move all boards in Trøndelag which use either blue-bus or green-bus palettes over to local (AtB) palette.

Description:
    For the given boards and their IDs, change the transportPalette to be "atb".

Usage:
    ./migration run scripts/013_rename_placeId_add_quays.py

Date: 2026-03-19
Author: Ola
"""

from google.cloud import firestore
import init

BOARD_IDS = [
    # removed for privacy
]

BLUE_BUS_IDS = [
    # removed for privacy
]

GREEN_BUS_IDS = [
    # removed for privacy
]

TARGET_PALETTES = {"blue-bus", "green-bus"}
TARGET_IDS = BLUE_BUS_IDS + GREEN_BUS_IDS

@firestore.transactional
def update_palette_transactional(transaction, board_ref):
    snapshot = board_ref.get(transaction=transaction)
    if not snapshot.exists:
        return False
    transaction.update(board_ref, {"transportPalette": "atb"})
    return True

def migrate_palettes(db):
    boards_collection = db.collection("boards")

    success_count = 0
    fail_count = 0
    not_found_count = 0

    for board_id in TARGET_IDS:
        board_ref = boards_collection.document(board_id)
        snapshot = board_ref.get()

        if not snapshot.exists:
            print(f"❌ Not found: {board_id}")
            not_found_count += 1
            continue

        try:
            transaction = db.transaction()
            ok = update_palette_transactional(transaction, board_ref)
            if ok:
                print(f"✅ Updated {board_id}")
                success_count += 1
            else:
                print(f"⚠️  Skipped {board_id} (not found in transaction)")
                fail_count += 1
        except Exception as e:
            print(f"❌ Error updating {board_id}: {e}")
            fail_count += 1

    print(f"\n🎉 Done: {success_count} updated, {fail_count} failed, {not_found_count} not found (out of {len(TARGET_IDS)} total)")


def run_migration(): 
    db = init.prod()
    migrate_palettes(db)

if __name__ == "__main__":
    run_migration()
