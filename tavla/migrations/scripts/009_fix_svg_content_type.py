"""
Purpose: Fix Content-Type metadata for SVG logo files in Firebase Storage

Description:
    Updates Content-Type metadata from application/octet-stream to image/svg+xml
    for all SVG logo files in Firebase Storage. This ensures that SVG logos are
    properly displayed in browsers and embedded webviews (like TVs).

Usage:
    ./migration run scripts/009_fix_svg_content_type.py

Date: 2026-01-13
Author: Guro
"""

from google.cloud import storage
import init

def fix_svg_content_types(bucket_name: str, prefix: str = "logo/"):
    """
    Fix Content-Type for SVG files in the specified bucket.
    
    Args:
        bucket_name: Name of the Firebase Storage bucket
        prefix: Folder prefix to search for SVG files (default: "logo/")
    """
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    
    print(f"Scanning bucket '{bucket_name}' for SVG files with prefix '{prefix}'...")
    
    blobs = bucket.list_blobs(prefix=prefix)
    fixed_count = 0
    skipped_count = 0
    error_count = 0
    
    for blob in blobs:
        # Skip if already has correct content type
        if blob.content_type == 'image/svg+xml':
            print(f"✓ Skipping {blob.name} (already correct)")
            skipped_count += 1
            continue
        
        # Download first 512 bytes to check if it's an SVG
        try:
            # Read first 512 bytes
            content_start = blob.download_as_bytes(start=0, end=512)
            content_text = content_start.decode('utf-8', errors='ignore').strip()
            
            # Check if content looks like SVG
            is_svg = (
                content_text.startswith('<?xml') and '<svg' in content_text or
                content_text.startswith('<svg')
            )
            
            if not is_svg:
                continue
            
            # Update Content-Type
            print(f"Fixing {blob.name}: {blob.content_type} → image/svg+xml")
            blob.content_type = 'image/svg+xml'
            blob.patch()
            fixed_count += 1
            
        except Exception as e:
            print(f"⚠️  Error processing {blob.name}: {e}")
            error_count += 1
            continue
    
    print(f"\n✅ Done! Fixed {fixed_count} files, skipped {skipped_count} files")
    return fixed_count, skipped_count


def main():
    """Main migration function"""
    # For dev environment
    print("\n=== DEV ENVIRONMENT ===")
    db_dev = init.dev()
    # Get bucket name from your Firebase config
    # Typically: ent-tavla-dev.appspot.com or similar
    dev_bucket = "ent-tavla-dev.appspot.com"
    try:
        fix_svg_content_types(dev_bucket)
    except Exception as e:
        print(f"❌ Error in dev: {e}")
    
    print("\n" + "="*50)
    response = input("\nDo you want to run this on PROD as well? (yes/no): ")
    
    if response.lower() == "yes":
        print("\n=== PROD ENVIRONMENT ===")
        db_prod = init.prod()
        # Get prod bucket name
        prod_bucket = "ent-tavla-prd.appspot.com"
        try:
            fix_svg_content_types(prod_bucket)
        except Exception as e:
            print(f"❌ Error in prod: {e}")
    else:
        print("Skipping PROD")


if __name__ == "__main__":
    main()
