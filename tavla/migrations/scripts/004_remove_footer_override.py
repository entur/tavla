"""
Purpose: Remove legacy 'override' field from footer objects in boards

Description:
    Removes the deprecated 'override' field from footer objects in all board documents. 
    The field was removed from frontend code but still exists as legacy data in the database.
    This is a cleanup migration since the field is no longer used anywhere in the codebase.

Usage:
    ./migration run scripts/004_remove_footer_override.py

Date: 2025-09-22
Author: Erlend
"""

from google.cloud import firestore
import time

import init

boards = "boards"

# Each migration should be run through a firestore transaction to ensure that no
# migrations are halfway done. Ensures either complete failure or complete success.
@firestore.transactional
def remove_override_from_footer(transaction, board_ref, log_file):
    snapshot = board_ref.get(transaction=transaction)

    if not snapshot.exists:
        log_file.write(f"☠️ Board does not exist: {board_ref.id}\n")
        return

    board = snapshot.to_dict()
    footer = board.get("footer")

    if not footer or not isinstance(footer, dict):
        log_file.write(f"⏭️ Board '{board_ref.id}': No footer object found\n")
        return

    if "override" not in footer:
        log_file.write(f"⏭️ Board '{board_ref.id}': No override field in footer\n")
        return

    # Remove the override field
    old_override_value = footer.get("override")
    transaction.update(board_ref, {
        "footer.override": firestore.DELETE_FIELD,
        "meta.dateModified": firestore.SERVER_TIMESTAMP
    })
    
    log_file.write(f"✅ Board '{board_ref.id}': Removed override field (was: {old_override_value})\n")

# Reads through the database and creates a log-file, runs a transaction if all
# requirements are met
def remove_footer_override(db: firestore.Client):
    board_collection = db.collection(boards).stream()

    # Open a local file to store the results of the migration
    with open("remove_footer_override_result.txt", "a") as log_file:
        log_file.write(f"--- Starting migration: Remove footer.override ---\n")
        
        total_processed = 0
        
        for board_doc in board_collection:
            total_processed += 1
            board_ref = db.collection(boards).document(board_doc.id)

            try: 
                transaction = db.transaction()
                remove_override_from_footer(transaction, board_ref, log_file)
            except Exception as e: 
                log_file.write(f"❌ Failed to update board '{board_doc.id}': {e}\n")
            
            # Add sleep every 100 operations to be gentle on the database
            if total_processed % 100 == 0:
                log_file.write(f"💤 Processed {total_processed} boards, sleeping for 1 second...\n")
                log_file.flush()
                time.sleep(1)
        
        log_file.write(f"--- Migration completed. Total processed: {total_processed} ---\n")

# Inits the database connection and runs the migration script
def migrate():
    db = init.local()
    print(f"db: {db.project}, {db._emulator_host}")
    remove_footer_override(db)

migrate()