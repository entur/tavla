"""
Purpose:
    Restore (rollback) Firestore from the most recent backup or a specific version.

Usage:
    python rollback_firestore.py dev
    python rollback_firestore.py prod
    python rollback_firestore.py dev firestore-ent-tavla-dev-2025-10-17_12-30-00
"""

import sys
import subprocess
import datetime

def rollback_firestore(env: str, version: str = None):
    """Perform rollback for Firestore environment (dev or prod)."""

    # Determine project and bucket
    if env == "dev":
        project = "ent-tavla-dev"
        bucket = "gs://tavla-firestore-backups-dev"
    elif env == "prod":
        project = "ent-tavla-prd"
        bucket = "gs://tavla-firestore-backups-prd"
    else:
        print("❌ Invalid environment. Use 'dev' or 'prod'.")
        sys.exit(1)

    print(f"🔧 Selected project: {project}")
    print(f"🪣 Using bucket: {bucket}")

    # Get all backups
    try:
        backups = subprocess.check_output(["gsutil", "ls", bucket], text=True).strip().split("\n")
        backups = [b for b in backups if "firestore-" in b]

        if not backups:
            print("❌ No backups found in bucket.")
            sys.exit(1)

        # Pick latest or specific version
        if version:
            match = [b for b in backups if version in b]
            if not match:
                print(f"❌ Backup version '{version}' not found.")
                sys.exit(1)
            export_path = match[-1]
        else:
            export_path = backups[-1]

        print(f"\n📦 Restoring Firestore '{project}' from:\n   {export_path}\n")
        confirm = input("⚠️  This will overwrite ALL current Firestore data. Continue? (yes/no): ")
        if confirm.lower() != "yes":
            print("❌ Rollback cancelled.")
            sys.exit(1)

        subprocess.run(
            ["gcloud", "firestore", "import", export_path, "--project", project],
            check=True
        )

        print(f"\n✅ Successfully restored Firestore from:\n   {export_path}\n")

    except subprocess.CalledProcessError as e:
        print(f"❌ Restore command failed:\n{e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error during rollback: {e}")
        sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print("❌ Usage: python rollback_firestore.py [dev|prod] [optional: version]")
        sys.exit(1)

    env = sys.argv[1].lower()
    version = sys.argv[2] if len(sys.argv) > 2 else None
    rollback_firestore(env, version)

if __name__ == "__main__":
    main()
