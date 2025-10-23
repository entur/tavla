"""
Purpose: Script to back up Firestore database for different environments (dev, prod, local).

Usage:
    python backup_firebase.py dev
    python backup_firebase.py prod
    python backup_firebase.py local
"""

import sys

import init


def main():
    if len(sys.argv) < 2:
        print("❌ Usage: python backup_firebase.py [dev|prod|local]")
        sys.exit(1)

    env = sys.argv[1].lower()

    if env == "dev":
        db = init.dev()
    elif env == "prod":
        db = init.prod()
    elif env == "local":
        db = init.local()
    else:
        print("❌ Invalid environment. Use dev, prod, or local.")
        sys.exit(1)

    print(f"\n🧠 Connected to Firestore ({env}). Now creating backup...\n")

    result = init.backup_firestore()

    if result:
        print(f"\n✅ Backup complete! Path:\n{result}")
    else:
        print("\n⚠️  No backup created (probably using local emulator).")


if __name__ == "__main__":
    main()
