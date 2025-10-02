"""
Purpose: Remove legacy 'override' field and fix timestamp format in boards

Description:
    1. Removes the deprecated 'override' field from footer objects
    2. Fixes Firestore Timestamps in meta.dateModified (converts to milliseconds)
    
    This migration cleans up legacy data and fixes Next.js serialization issues.

Usage:
    ./migration run scripts/004_remove_footer_override.py

Date: 2025-09-22 (updated 2025-09-25)
Author: Erlend
"""

from google.cloud import firestore
import time
from datetime import datetime

import init

boards = "boards"

def convert_firestore_timestamp_to_milliseconds(timestamp_obj):
    """Convert Firestore Timestamp to milliseconds since epoch"""
    if hasattr(timestamp_obj, 'timestamp'):
        return int(timestamp_obj.timestamp() * 1000)
    return timestamp_obj  # Already in correct format

def should_remove_override(footer):
    """Check if footer has override field that needs to be removed"""
    return footer and isinstance(footer, dict) and "override" in footer

def should_fix_timestamp(date_modified):
    """Check if dateModified is a Firestore Timestamp that needs conversion"""
    return date_modified and hasattr(date_modified, 'timestamp')

@firestore.transactional
def process_board(transaction, board_ref, log_file):
    """Process a single board: remove override and fix timestamp format"""
    snapshot = board_ref.get(transaction=transaction)
    
    if not snapshot.exists:
        log_file.write(f"☠️ Board does not exist: {board_ref.id}\n")
        return

    board = snapshot.to_dict()
    updates = {}
    changes = []

    # Remove override field from footer
    footer = board.get("footer")
    if should_remove_override(footer):
        old_value = footer.get("override")
        updates["footer.override"] = firestore.DELETE_FIELD
        changes.append(f"removed override field (was: {old_value})")

    # Fix timestamp format in meta.dateModified
    meta = board.get("meta", {})
    date_modified = meta.get("dateModified")
    if should_fix_timestamp(date_modified):
        milliseconds = convert_firestore_timestamp_to_milliseconds(date_modified)
        updates["meta.dateModified"] = milliseconds
        changes.append(f"converted timestamp to milliseconds ({milliseconds})")

    # Apply updates
    if updates:
        transaction.update(board_ref, updates)
        log_file.write(f"✅ Board '{board_ref.id}': {', '.join(changes)}\n")
    else:
        log_file.write(f"⏭️ Board '{board_ref.id}': No changes needed\n")

def run_migration(db: firestore.Client):
    """Process all boards with pagination and logging"""
    page_size = 50
    last_doc = None
    total_processed = 0
    
    with open("remove_footer_override_result.txt", "a") as log_file:
        log_file.write("--- Starting migration: Remove footer.override and fix timestamps ---\n")
        
        while True:
            # Get next page of boards
            query = db.collection(boards).limit(page_size)
            if last_doc:
                query = query.start_after(last_doc)
            
            board_docs = list(query.stream())
            if not board_docs:
                break
            
            # Process each board in this page
            for board_doc in board_docs:
                total_processed += 1
                board_ref = db.collection(boards).document(board_doc.id)
                
                try:
                    transaction = db.transaction()
                    process_board(transaction, board_ref, log_file)
                except Exception as e:
                    log_file.write(f"❌ Failed to update board '{board_doc.id}': {e}\n")
                
                # Be gentle on the database
                if total_processed % 100 == 0:
                    log_file.write(f"💤 Processed {total_processed} boards, sleeping...\n")
                    log_file.flush()
                    time.sleep(1)
            
            # Prepare for next page
            last_doc = board_docs[-1]
            log_file.write(f"📄 Processed page of {len(board_docs)} boards (total: {total_processed})\n")
            log_file.flush()
        
        log_file.write(f"--- Migration completed. Total processed: {total_processed} ---\n")

def migrate():
    """Initialize database connection and run the migration"""
    db = init.local()
    print(f"Running migration on database: {db.project}")
    run_migration(db)

if __name__ == "__main__":
    migrate()