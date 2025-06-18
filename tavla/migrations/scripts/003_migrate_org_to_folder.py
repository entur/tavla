"""
Purpose: Copy "organizations"-collection to new collection "folders"

Description:
    We cannot rename an existing collection in Firestore, so this migration script creates a new
    collection called "folders" and copies all data from "organizations" to "folders". 
    We exclude deprecated fields no longer in use: meta.tags, defaults.columns, defaults.counties, 
    and footer. This is done recursively to find and skip all instances specified. 

Python specifications:
    .stream():          Firestore method, streams all documents in a collection (includes real-time updates to the collection)
    isinstance():       Checks if an object is a specified type
    .enumerate()        Counts the number of items in any iterable
    .flush()            Force the buffer to empty all file writes instead of waiting for it to fill up
    .sleep()            Adds deliberate pause in the program

Usage:
    ./migration run scripts/003_migrate_org_to_footer.py

Date: 2025-06-11
Author: Silje
"""

from google.cloud import firestore
from typing import List, Dict
from collections import defaultdict
import time

import init

organizations = "organizations"
folders = "folders"

# Helper function for document comparison, only used in logs
def compare_data(src_data, filtered_data):
    if not isinstance(src_data, dict) or not isinstance(filtered_data, dict):
        return {}
    
    removed_data = {}
    for key in src_data:
        if key not in filtered_data:
            removed_data[key] = src_data[key]
        else:
            nested_fields = compare_data(src_data[key], filtered_data[key])
            if nested_fields:
                removed_data[key] = nested_fields

    return removed_data

# Returns a "filtered" dictionary with no unnecessary fields:
# ["meta.tags", "defaults.columns", "defaults.counties", "defaults.font", "footer"]
def filter_nested_fields(data: Dict) -> Dict:
    
    if not isinstance(data, dict):
        return data

    filtered = {}
    for key in data:
        value = data[key]

        if key == "footer":
            continue

        if key == "meta" and isinstance(value, dict):
            meta = dict(value) # copies the source meta dict
            meta.pop("tags", None)
            filtered["meta"] = meta
            continue

        if key == "defaults" and isinstance(value, dict):
            defaults = dict(value) # copies the source defaults dict
            for field in ["columns", "counties", "font"]:
                defaults.pop(field, None)
            filtered["defaults"] = defaults
            continue

        filtered[key] = value

    return filtered
    

# Copies each document in the database, ensures filtering of the data
def copy_document(doc_ref_src, doc_ref_dest, log_file):
    # Convert "organizations" data to dict
    src_data = doc_ref_src.get().to_dict()

    if not src_data:
        return
    
    # Remove unnecessary subcollections and fields, set to destination document ("folders")
    filtered_data = filter_nested_fields(src_data)
    doc_ref_dest.set(filtered_data)
    
    log_file.write(f"🦺 Copied doc path: {doc_ref_dest.path}\n")
    log_file.write(f"📈 Source data: {src_data}\n")
    log_file.write(f"📉 Filtered data: {filtered_data}\n")
    log_file.write(f"❎ Removed data: {compare_data(src_data, filtered_data)}\n")

# Iterates through all docs in "organizations" and copies the document to "folders"
def copy_orgs_to_folder(db: firestore.Client):
    org_collection = db.collection(organizations).stream()

    with open("create_folder_collection.txt", "a") as log_file:
        
        for i, organization in enumerate(org_collection):
            
            org_id = organization.id

            log_file.write(f"-----> 🏁 Starting with: {org_id}\n")

            doc_ref_src = db.collection(organizations).document(org_id)
            doc_ref_dest = db.collection(folders).document(org_id)

            copy_document(doc_ref_src, doc_ref_dest, log_file)

            if i % 15 == 0:
                log_file.write(f"💤 Sleep after {i} documents 💤\n")
                log_file.flush()
                time.sleep(2)
                
def copy(): 
    db = init.local()
    print(f"db: {db.project}, {db._emulator_host}")
    copy_orgs_to_folder(db)

copy()