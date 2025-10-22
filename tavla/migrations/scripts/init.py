"""
Purpose: Init-functions overview

Description:
    Provides Firestore initialization for local, dev, and prod environments,
    and includes an automatic Firestore backup utility that knows which project
    is active.

Usage:
    import init
    db = init.dev()
    init.backup_firestore()

Date: 2025-10-17
Author: Annika, Silje & Erlend
"""

import os
import sys
import subprocess
import datetime
from pathlib import Path
import firebase_admin
from firebase_admin import credentials
import firebase_admin.firestore
from google.cloud import firestore

APP_ROOT = Path(__file__).resolve().parents[2]


def _certificate_path(filename: str) -> str:
    path = APP_ROOT / filename
    if not path.exists():
        raise FileNotFoundError(f"Fant ikke sertifikatfilen: {path}")
    return str(path)


# Track current Firestore project globally
_current_project = None


# -------------------------------------------------------
# 🔹 Database initialization
# -------------------------------------------------------

def local(name="ent-tavla-local") -> firestore.Client:
    """Connect to local Firestore emulator."""
    global _current_project
    _current_project = "local-emulator"

    cred = credentials.ApplicationDefault()
    os.environ["FIRESTORE_EMULATOR_HOST"] = "127.0.0.1:8080"

    options = {
        "databaseURL": "http://localhost:8080"
    }

    app = firebase_admin.initialize_app(cred, options, name=name)

    print(f"✅ Connected to: {app.name} (local emulator at {os.getenv('FIRESTORE_EMULATOR_HOST')})")
    return firebase_admin.firestore.client(app)


def dev() -> firestore.Client:
    """Connect to Firestore development environment."""
    global _current_project
    _current_project = "ent-tavla-dev"

    cred = credentials.Certificate(_certificate_path("ent-tavla-dev-875a70280651.json"))
    options = {"projectId": _current_project}

    app = firebase_admin.initialize_app(cred, options, name=_current_project)
    print(f"✅ Connected to: {app.name}")
    return firebase_admin.firestore.client(app)


def prod() -> firestore.Client:
    """Connect to Firestore production environment, with confirmation."""
    global _current_project
    _current_project = "ent-tavla-prd"

    confirm = input("⚠️  You are about to connect to PRODUCTION Firestore. Continue? (yes/no): ")
    if confirm.lower() != "yes":
        print("❌ Aborted connection to PROD.")
        sys.exit(1)

    cred = credentials.Certificate(_certificate_path("ent-tavla-prd-54ef424ea2f0.json")) 
    options = {"projectId": _current_project}

    app = firebase_admin.initialize_app(cred, options, name=_current_project)
    print(f"✅ Connected to: {app.name}")
    return firebase_admin.firestore.client(app)

# -------------------------------------------------------
# 💾 Firestore backup
# -------------------------------------------------------

def backup_firestore(bucket: str = None):
    """
    Create a timestamped Firestore export in the appropriate GCS bucket.
    Automatically selects bucket based on environment (dev/prod) and skips
    backup for local emulator.
    """
    global _current_project

    if not _current_project:
        print("❌ No Firestore environment initialized. Run init.dev() or init.prod() first.")
        sys.exit(1)

    if _current_project == "local-emulator":
        print("⚠️  Skipping backup: Firestore emulator does not support exports.")
        return None

    # 🪣 Automatically select correct bucket
    if bucket is None:
        if _current_project == "ent-tavla-dev":
            bucket = "gs://tavla-firestore-backups-dev"
        elif _current_project == "ent-tavla-prd":
            bucket = "gs://tavla-firestore-backups-prd"
        else:
            print(f"⚠️  Unknown project '{_current_project}', using default bucket name.")
            bucket = "gs://tavla-firestore-backups"

    try:
        # Create timestamped export path
        date = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        export_path = f"{bucket}/firestore-{_current_project}-{date}"

        print(f"\n📦 Starting Firestore backup for project: {_current_project}")
        subprocess.run(["gcloud", "firestore", "export", export_path], check=True)
        print(f"✅ Backup created at: {export_path}")

        # Verify metadata exists
        verify = subprocess.check_output(["gsutil", "ls", export_path + "/"], text=True)
        if "firestore_export_metadata" in verify:
            print("🔍 Verified backup successfully.\n")
        else:
            print("⚠️  Warning: metadata file not found in bucket — verify manually.\n")

        return export_path

    except subprocess.CalledProcessError as e:
        print(f"❌ Backup command failed: {e.output}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error during backup: {e}")
        sys.exit(1)
