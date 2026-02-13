"""
Purpose:
    Restore (rollback) Firestore from the most recent backup or a specific version.

Usage:
    python rollback_firestore.py dev
    python rollback_firestore.py prod
    python rollback_firestore.py local
    python rollback_firestore.py dev firestore-ent-tavla-dev-2025-10-17_12-30-00
"""

import sys
import subprocess
import datetime
import os
import shutil
import json
import urllib.request
import urllib.error

def rollback_firestore(env: str, version: str = None):
    """Perform rollback for Firestore environment (local, dev or prod)."""

    # Determine project and bucket
    if env == "local":
        project = "ent-tavla-dev"
        bucket = "gs://tavla-firestore-backups-dev"
    elif env == "dev":
        project = "ent-tavla-dev"
        bucket = "gs://tavla-firestore-backups-dev"
    elif env == "prod":
        project = "ent-tavla-prd"
        bucket = "gs://tavla-firestore-backups-prd"
    else:
        print("❌ Invalid environment. Use 'local', 'dev' or 'prod'.")
        sys.exit(1)

    print(f"🔧 Selected project: {project}, environment: {env}")
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

        if env == "local":
            print(f"\n‼️  You are restoring the LOCAL (localhost:8080) Firebase instance. Make sure the Firebase emulator is NOT running (yarn dev:persist). If it is, you may kill the process now and continue.")

        print(f"\n📦 Restoring Firestore '{env}' ({project}) from:\n   {export_path}\n")
        confirm = input("⚠️  This will overwrite ALL current Firestore data. Continue? (yes/no): ")
        if confirm.lower() != "yes":
            print("❌ Rollback cancelled.")
            sys.exit(1)

        if env == "local":
            # Check if emulator is running and warn user
            # If the emulator is running with --export-on-exit, it will overwrite our changes when it stops.
            try:
                # Simple check to see if port 8080 is open
                with urllib.request.urlopen("http://localhost:8080", timeout=2) as response:
                    print("❌ The Firestore Emulator appears to be running (localhost:8080).")
                    print("   You MUST stop the emulator before running this script.")
                    print("   Otherwise, the emulator will overwrite the restored data when it shuts down (export-on-exit).")
                    print("\n   Please stop 'yarn dev:persist' and try again.")
                    sys.exit(1)
            except (urllib.error.URLError, ConnectionRefusedError):
                # Emulator not running, which is good!
                pass
            except Exception as e:
                # Other errors, just warn but proceed
                print(f"⚠️  Could not check if emulator is running: {e}")

            local_temp_dir = os.path.abspath("./firestore_restore_temp")

            # Clean up previous temp dir
            if os.path.exists(local_temp_dir):
                shutil.rmtree(local_temp_dir)
            os.makedirs(local_temp_dir)

            print(f"⬇️ Downloading backup to {local_temp_dir}...")
            # Using -m for parallel download, -r for recursive
            subprocess.run(["gsutil",  "cp", "-r", export_path, local_temp_dir], check=True)

            # The download creates a subdirectory with the backup name
            # export_path is like gs://bucket/path/backup_name/
            backup_name = export_path.rstrip('/').split('/')[-1]
            local_backup_path = os.path.join(local_temp_dir, backup_name)
            
            # Locate the .db directory (assumed to be at ../../.db relative to this script)
            script_dir = os.path.dirname(os.path.abspath(__file__))
            # Adjusted path: script is in tavla/migrations/scripts/
            # .db is in tavla/.db/ (sibling of migrations?)
            # Let's try to find it dynamically or assume standard structure
            # Standard: tavla/migrations/scripts -> tavla/.db is ../../.db
            
            # However, in monorepo, it might be different. 
            # Based on ls output: tavla/.db exists. Script is likely in tavla/migrations/scripts.
            # So ../../.db
            
            project_root = os.path.abspath(os.path.join(script_dir, "../../"))
            db_path = os.path.join(project_root, ".db")
            
            # Verify .db existence
            if not os.path.exists(db_path):
                 # Try one level deeper just in case (tavla/tavla/.db vs tavla/.db)
                 # Wait, 'ls tavla/.db' worked from repo root.
                 # 'ls tavla/tavla' failed.
                 # So the structure is repo/tavla/.db
                 # And script is repo/tavla/migrations/scripts/rollback_firestore.py
                 pass

            if not os.path.exists(db_path):
                print(f"❌ Could not find local emulator data directory at {db_path}")
                print("   Please run 'yarn dev:persist' at least once to initialize it.")
                sys.exit(1)

            firestore_export_path = os.path.join(db_path, "firestore_export")
            
            # Remove existing firestore_export
            if os.path.exists(firestore_export_path):
                shutil.rmtree(firestore_export_path)
            
            # Move downloaded backup to firestore_export
            shutil.move(local_backup_path, firestore_export_path)
            
            # Rename metadata file to match what firebase-export-metadata.json likely expects
            # (firestore_export.overall_export_metadata)
            # We need to check if we should rename it or update json.
            # Renaming is safer to avoid breaking other things.
            
            found_metadata = False
            for root, dirs, files in os.walk(firestore_export_path):
                for file in files:
                    if file.endswith("overall_export_metadata"):
                        old_file = os.path.join(root, file)
                        new_file = os.path.join(root, "firestore_export.overall_export_metadata")
                        os.rename(old_file, new_file)
                        found_metadata = True
                        break
                if found_metadata:
                    break
            
            if not found_metadata:
                 print("⚠️  Warning: Could not find metadata file to rename. Emulator might fail to load.")

            print("\n✅ Successfully updated local .db directory.")
            print("🔄 You can now START your emulator (yarn dev:persist) to see the changes.")

        else:
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
        print("❌ Usage: python rollback_firestore.py [local|dev|prod] [optional: version]")
        sys.exit(1)

    env = sys.argv[1].lower()
    version = sys.argv[2] if len(sys.argv) > 2 else None
    rollback_firestore(env, version)

if __name__ == "__main__":
    main()
