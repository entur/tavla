import os
import firebase_admin
from firebase_admin import credentials
import firebase_admin.firestore
from google.cloud import firestore

organizations = "organizations"
boards = "boards"

# Init local database with default credentials
def init_local_app() -> firestore.Client:
    # Use the application default credentials.
    cred = credentials.ApplicationDefault()

    options = {
        "databaseURL": "http://localhost:8080"
    }

    os.environ["FIRESTORE_EMULATOR_HOST"] = "127.0.0.1:8080"
    
    app = firebase_admin.initialize_app(cred, options, name="ent-tavla-local")

    print(f"Connected to: {app.name}")

    return firebase_admin.firestore.client(app)

# Init dev database with the right service key for dev credentials
def init_dev_app() -> firestore.Client:
    cred = credentials.Certificate("./ent-tavla-dev-875a70280651.json")

    options = {
        "projectId": "ent-tavla-dev"
    }
    
    app = firebase_admin.initialize_app(cred, options, name="ent-tavla-dev")
    
    print(f"Connected to: {app.name}")
    
    return firebase_admin.firestore.client(app)

# Init prod database with the right service key for prod credentials
def init_prod_app() -> firestore.Client:
    cred = credentials.Certificate("./ent-tavla-prd-54ef424ea2f0.json")

    options = {
        "projectId": "ent-tavla-prd"
    }
    
    app = firebase_admin.initialize_app(cred, options, name="ent-tavla-prd")
    
    print(f"Connected to: {app.name}")
    
    return firebase_admin.firestore.client(app)


# Each migration has to be run through a firestore transaction
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
    db = init_local_app()
    print(f"db: {db.project}, {db._emulator_host}")
    migrate_footer(db)

migrate()
