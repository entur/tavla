"""
Purpose: Migrate footer from organizations to boards

Description:
    Migrates the footer-value from organization/folder level down to board level as we
    want to remove the footer-functionality from the organization/folder settings. If
    a board has setting "override = true" on their footer, then the organization footer
    value should be migrated to the board footer (and have the existing value overwritten). 

Usage:
    ./migration run scripts/001_migrate_footer.py

Date: 2025-05-08
Author: Annika and Silje
"""

from google.cloud import firestore

import init

organizations = "organizations"
boards = "boards"

# Each migration should to be run through a firestore transaction to ensure that no
# migrations are halfway done. Ensures either complete failure or complete success.
@firestore.transactional
def update_board_footer(transaction, board_ref, org_footer, log_file):
    snapshot = board_ref.get(transaction=transaction)

    if not snapshot.exists:
        log_file.write(f"☠️ Board does not exist: {board_ref.id}\n")
        return

    board = snapshot.to_dict()
    footer = board.get("footer")

    if footer and footer.get("override"):
        transaction.update(board_ref, {
            "footer.footer": org_footer,
            "footer.override": False,
        })
        log_file.write(f"✅ Updating board '{board_ref.id}', board footer: '{footer.get("footer")}' -> organization footer: '{org_footer}'\n")

# Reads through the database and creates a log-file, runs a transaction if all
# requirements are met
def migrate_footer(db: firestore.Client):
    org_collection = db.collection(organizations).stream()
    board_collection = db.collection(boards)

    # Open a local file to store the results of the migration
    with open("migrate_prod_footer_result.txt", "a") as log_file:
        
        for organization in org_collection:
            org = organization.to_dict()
            org_footer = org.get("footer")

            if not org_footer:
                continue

            log_file.write(f"--- Updating for folder ID: {organization.id} ---\n")

            for board_id in org.get("boards", []):
                board_ref = board_collection.document(board_id)

                try: 
                    transaction = db.transaction()
                    update_board_footer(transaction, board_ref, org_footer, log_file)
                except Exception as e: 
                    log_file.write(f"❌ failed to update board '{board_id}': {e}\n")

# Inits the database connection and runs the migration script
def migrate():
    db = init.local()
    print(f"db: {db.project}, {db._emulator_host}")
    migrate_footer(db)

migrate()
