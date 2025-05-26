from google.cloud import firestore

import init

organizations = "organizations"
boards = "boards"

# Each migration has to be run through a firestore transaction
@firestore.transactional
def update_board_footer(transaction, board_ref, org_footer, log_file):
    snapshot = board_ref.get(transaction=transaction)

    if not snapshot.exists:
        log_file.write(f"☠️ Board does not exist: {board_ref.id}\n")
        return

    board = snapshot.to_dict()
    footer = board.get("footer")

    if footer:
        transaction.update(board_ref, {
            "footer.footer": org_footer,
        })
        log_file.write(f"✅ Updating board '{board_ref.id}', board footer: '{footer.get("footer")}' -> organization footer: '{org_footer}'\n")

# Reads through the database 
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

# Init the database connection and run the specified migration definition
def migrate():
    db = init.local()
    print(f"db: {db.project}, {db._emulator_host}")
    migrate_footer(db)

migrate()
