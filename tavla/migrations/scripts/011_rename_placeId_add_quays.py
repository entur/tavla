"""
Purpose: Update boards to support choosing platforms and add a field for stopPlaceId

Description:
    Iterates through all boards and updates their tiles. Adds a new field 'stopPlaceId' and copies
    the value from the existing 'placeId'. Initializes an empty 'quays' list for each tile. 
    Specifically for tiles of type 'quay', it retrieves the parent StopPlace ID via the Entur API 
    to use as the 'stopPlaceId', and moves the original quay ID and whitelisted lines into the new 'quays' list.


NOTE:
    - API calls are done inside a transaction, which is not recommended for performance reasons.
    This causes GCP to time out. It should probably be rewritten to use a map or batched API calls.

Usage:
    ./migration run scripts/011_rename_placeId_add_quays.py 

Date: 2026-02-13
Author: Ola
"""

from google.cloud import firestore
from typing import Dict
import time
import requests
import copy
import init

boards = "boards"
stop_places_id = "https://api.entur.io/stop-places/v1/read/quays/"

def get_parent_stop_place(quay_id: str) -> str:
    """
    Fetches the parent StopPlace ID for a given Quay ID using EnTur Geocoder API.
    """
    try:
        response = requests.get(f"{stop_places_id}/{quay_id}/stop-place?")
        response.raise_for_status()
        data = response.json()
        return data.get("id")
    except Exception as e:
        print(f"Error fetching parent for quay {quay_id}: {e}")
    return None

def transform_board_data(data: Dict, log_file) -> Dict:
    """
    Applies transformations to the board data.
    """
    if not isinstance(data, dict):
        return data

    transformed = data.copy()
    
    # Extract tiles and create a deep copy of the list to avoid modifying the original data reference
    # and ensure we are working on the transformed object's data
    original_tiles = transformed.get("tiles", [])
    new_tiles = []

    if original_tiles:
        new_tiles = copy.deepcopy(original_tiles)
    
    for i in range(len(new_tiles)):
        place_id = new_tiles[i].get("placeId")
        tile_type = new_tiles[i].get("type")
        whitelisted_lines = new_tiles[i].get("whitelistedLines", [])

        # Initialize stopPlaceId with existing placeId.
        if place_id:
            new_tiles[i]["stopPlaceId"] = place_id
            new_tiles[i]["quays"] = []
       
        if tile_type == "quay" and place_id:
            # Note: Making external API calls inside a transaction is generally not recommended 
            # due to latency and potential for holding locks, but for this migration script it simplifies the logic to keep it here.
            log_file.write(f"🔍 Looking up parent for Quay: {place_id}\n")
            parent_id = get_parent_stop_place(place_id)
            
            if parent_id:
                log_file.write(f"✅ Found parent StopPlace: {parent_id}\n")
                new_tiles[i]["stopPlaceId"] = parent_id
                
                # Add to quays list
                # "adds an { id: string, whitelistedLines: string[] } to the quays array"
                new_quay = {
                    "id": place_id,
                    "whitelistedLines": whitelisted_lines
                }
                
                new_tiles[i]["quays"] = [new_quay]
            else:
                log_file.write(f"⚠️ Could not find parent for Quay: {place_id}. Keeping original ID.\n")
                
    transformed["tiles"] = new_tiles
    return transformed

@firestore.transactional
def migrate_board_transactional(transaction, source_ref, target_ref, log_file):
    snapshot = source_ref.get(transaction=transaction)
    if not snapshot.exists:
        log_file.write(f"❌ Document {source_ref.id} does not exist\n")
        return False

    src_data = snapshot.to_dict()
    if not src_data:
        log_file.write("🗑️ Data is not available\n")
        return False
    
    new_data = transform_board_data(src_data, log_file)
    
    # Write to new collection using transaction
    transaction.set(target_ref, new_data)
    return True

def copy_and_change_boards(db: firestore.Client):
    source_collection = db.collection(boards).stream()
    
    success_count = 0
    fail_count = 0
    total_count = 0

    with open("migration_011_log.txt", "a") as log_file:
        for i, board in enumerate(source_collection):
            board_id = board.id
            board_data = board.to_dict()
            tiles = board_data.get("tiles", [])
            
            if tiles and all("quays" in tile and "stopPlaceId" in tile for tile in tiles):
                print("skipping")
                log_file.write(f"ℹ️ Skipping board: {board_id} (already migrated)\n")
                continue
                
            total_count += 1
            log_file.write(f"-----> 🏁 Starting board: {board_id}\n")

            try:
                # Create references -> same ref = update in place
                # Explicitly creates two identical refs, 1) for readability and 2) to easily change collection if needed
                source_ref = db.collection(boards).document(board_id)
                target_ref = db.collection(boards).document(board_id)
                
                # Create a transaction
                transaction = db.transaction()
                
                # Execute transaction
                success = migrate_board_transactional(transaction, source_ref, target_ref, log_file)
                
                if success:
                    success_count += 1
                    log_file.write("✅ Document migrated successfully\n")
                else:
                    fail_count += 1

            except Exception as e:
                log_file.write(f"❌ Error migrating document {board_id}: {str(e)}\n")
                fail_count += 1

            if i % 15 == 0 and i != 0:
                log_file.flush()

            if i % 100 == 0 and i != 0:
                log_file.write(f"😴 Taking a nap after {i} documents...\n")
                time.sleep(1) # Sleep to avoid rate limits

        log_file.write(f"\n🎉 Migration complete: {success_count} succeeded, {fail_count} failed, {total_count} in total 🎉\n")
        print(f"Migration complete. Check migration_011_log.txt for details.")

def run_migration(): 
    db = init.prod()
    print(f"db: {db.project}, {db._emulator_host}")
    copy_and_change_boards(db)

if __name__ == "__main__":
    run_migration()
