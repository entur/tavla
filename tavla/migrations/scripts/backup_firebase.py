"""
Purpose: Quick test of Firestore backup from init.py

Usage:
    python test_backup.py dev
    python test_backup.py prod
    python test_backup.py local
"""

import sys
import init

def main():
    if len(sys.argv) < 2:
        print("❌ Usage: python test_backup.py [dev|prod|local]")
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
