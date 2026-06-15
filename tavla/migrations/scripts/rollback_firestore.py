"""
Purpose:
    Restore (rollback) Firestore from the most recent backup or a specific version.

Usage:
    python rollback_firestore.py local
    python rollback_firestore.py local --from prod
    python rollback_firestore.py dev
    python rollback_firestore.py prod
    python rollback_firestore.py dev firestore-ent-tavla-dev-2025-10-17_12-30-00
    python rollback_firestore.py local --from prod firestore-ent-tavla-prd-2025-10-17_12-30-00
"""

import argparse
import os
import shutil
import subprocess
import sys
import urllib.error
import urllib.request

BUCKETS = {
    "dev": "gs://tavla-firestore-backups-dev",
    "prod": "gs://tavla-firestore-backups-prd",
}

PROJECTS = {
    "dev": "ent-tavla-dev",
    "prod": "ent-tavla-prd",
}


def rollback_firestore(env: str, version: str = None, source_env: str = None):
    """
    Perform rollback for Firestore environment (local, dev or prod).

    env        — destination: where to restore TO (local, dev, prod)
    source_env — where to fetch the backup FROM (dev or prod, defaults to env)
    version    — optional specific backup name; uses latest if omitted
    """
    source = source_env or ("dev" if env == "local" else env)

    if source not in BUCKETS:
        print(f"❌ Invalid source environment '{source}'. Use 'dev' or 'prod'.")
        sys.exit(1)

    if env not in ("local", "dev", "prod"):
        print(f"❌ Invalid destination environment '{env}'. Use 'local', 'dev' or 'prod'.")
        sys.exit(1)

    bucket = BUCKETS[source]
    project = PROJECTS[source if env != "local" else "dev"]

    print(f"🔧 Destination: {env}, source: {source}")
    print(f"🪣 Using bucket: {bucket}")

    try:
        backups = subprocess.check_output(["gsutil", "ls", bucket], text=True).strip().split("\n")
        backups = [b for b in backups if "firestore-" in b]

        if not backups:
            print("❌ No backups found in bucket.")
            sys.exit(1)

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
            _restore_local(export_path)
            if source == "prod":
                print("\n🚨 PÅMINNELSE: Du har nå produksjonsdata på maskinen din.")
                print("   Start emulatoren med 'yarn dev' (ikke 'yarn dev:persist') under testingen,")
                print("   så unngår du at proddata spres til andre mapper.")
                print()
                print("   Husk å slette .db-mappen når du er ferdig:")
                print()
                print("     rm -rf tavla/.db")
                print()
                print("   Eller gjenopprett fra dev-backup for å gå tilbake til dev-data:")
                print()
                print("     ./migration run scripts/rollback_firestore.py local")
                print()
        else:
            subprocess.run(
                ["gcloud", "firestore", "import", export_path, "--project", project],
                check=True,
            )
            print(f"\n✅ Successfully restored Firestore from:\n   {export_path}\n")

    except subprocess.CalledProcessError as e:
        print(f"❌ Restore command failed:\n{e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error during rollback: {e}")
        sys.exit(1)


def _restore_local(export_path: str):
    """Download a GCS backup and place it in the local emulator's .db directory."""
    try:
        with urllib.request.urlopen("http://localhost:8080", timeout=2):
            print("❌ The Firestore Emulator appears to be running (localhost:8080).")
            print("   You MUST stop the emulator before running this script.")
            print("   Otherwise, the emulator will overwrite the restored data when it shuts down (export-on-exit).")
            print("\n   Please stop 'yarn dev:persist' and try again.")
            sys.exit(1)
    except (urllib.error.URLError, ConnectionRefusedError):
        pass  # Emulator not running — good
    except Exception as e:
        print(f"⚠️  Could not check if emulator is running: {e}")

    local_temp_dir = os.path.abspath("./firestore_restore_temp")

    if os.path.exists(local_temp_dir):
        shutil.rmtree(local_temp_dir)
    os.makedirs(local_temp_dir)

    print(f"⬇️ Downloading backup to {local_temp_dir}...")
    subprocess.run(["gsutil", "cp", "-r", export_path, local_temp_dir], check=True)

    backup_name = export_path.rstrip("/").split("/")[-1]
    local_backup_path = os.path.join(local_temp_dir, backup_name)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(script_dir, "../../.db")

    if not os.path.exists(db_path):
        print(f"❌ Could not find local emulator data directory at {db_path}")
        print("   Please run 'yarn dev:persist' at least once to initialize it.")
        sys.exit(1)

    firestore_export_path = os.path.join(db_path, "firestore_export")

    if os.path.exists(firestore_export_path):
        shutil.rmtree(firestore_export_path)

    shutil.move(local_backup_path, firestore_export_path)

    # Rename metadata file to the name the emulator expects
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


def main():
    parser = argparse.ArgumentParser(
        description="Restore Firestore from a backup.",
        formatter_class=argparse.RawTextHelpFormatter,
        epilog=(
            "examples:\n"
            "  rollback_firestore.py local\n"
            "  rollback_firestore.py local --from prod\n"
            "  rollback_firestore.py local --from prod firestore-ent-tavla-prd-2025-10-17_12-30-00\n"
            "  rollback_firestore.py dev\n"
            "  rollback_firestore.py prod firestore-ent-tavla-prd-2025-10-17_12-30-00\n"
        ),
    )
    parser.add_argument(
        "env",
        choices=["local", "dev", "prod"],
        help="destination environment to restore TO",
    )
    parser.add_argument(
        "version",
        nargs="?",
        default=None,
        help="specific backup name to restore (uses latest if omitted)",
    )
    parser.add_argument(
        "--from",
        dest="source_env",
        choices=["dev", "prod"],
        default=None,
        help="source environment to fetch the backup FROM (defaults to same as destination)",
    )
    args = parser.parse_args()
    rollback_firestore(args.env, args.version, args.source_env)


if __name__ == "__main__":
    main()
