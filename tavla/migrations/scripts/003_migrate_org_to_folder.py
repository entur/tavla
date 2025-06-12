"""
Purpose: Copy "organizations"-collection to new collection "folders"

Description:
    We cannot rename an existing collection in Firestore, so this migration script creates a new
    collection called "folders" and copies all data from "organizations" to "folders". 
    We exclude deprecated fields no longer in use: meta.tags, defaults.columns, defaults.counties, 
    and footer. This is done recursively to find and skip all instances specified. 

Python specifications:
    lambda:             Inline anonymous function (used for simple operations)
    defaultdict():      dict subclass that provides default values for missing keys (from collections)
    .items():           Returns key-value pairs of a dictionary as tuples
    .stream():          Firestore method that streams all documents in a collection
    isinstance():       Checks if an object is of a specified type

Usage:
    ./migration run scripts/003_migrate_org_to_footer.py

Date: 2025-06-11
Author: Silje
"""

from google.cloud import firestore
from typing import List, Dict
from collections import defaultdict

import init

organizations = "organizations"
folders = "folders"
excluded_fields = ["meta.tags", "defaults.columns", "defaults.counties", "defaults.font", "footer"]

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


# Formats excluded_fields
def build_exclusion_tree(paths: List[str]):
    # Function that builds a nested dictionary structure without a predefined size/shape
    # Creates nodes as it traverses through the excluded fields
    tree = lambda: defaultdict(tree)
    
    root = tree()

    for path in paths:
        path_parts = path.split(".")
        current = root
        for field in path_parts:
            current = current[field]

    return root

# Recursively filter out specific keys from the nested dictionary of data
# Returns a "filtered" dictionary
def filter_nested_fields(data: Dict, exclusion_tree) -> Dict:
    
    if not isinstance(data, dict):
        return data

    # Create empty dictionary and add all data that is not in the exclusion tree
    filtered = {}
    for key, value in data.items():
        if key in exclusion_tree:
            if isinstance(value, dict):
                # Recursively look deeper for keys/values to skip if key is a nested dictionary
                excluded_field = filter_nested_fields(value, exclusion_tree[key])
                if excluded_field:  # Skip if empty
                    filtered[key] = excluded_field
            # If value is not a dict && it's listed in the exclusion tree, skip it (e.g. "footer")
            continue
        else:
            filtered[key] = filter_nested_fields(value, {})
    return filtered

# Copies each document in the database, ensures filtering of the data
def copy_document(doc_ref_src, doc_ref_dest, exclusion_tree, log_file):
    # Convert "organizations" data to dict
    src_data = doc_ref_src.get().to_dict()

    if not src_data:
        return
    
    # Remove unnecessary subcollections and fields, set to destination document ("folders")
    filtered_data = filter_nested_fields(src_data, exclusion_tree)
    doc_ref_dest.set(filtered_data)
    
    log_file.write(f"🦺 Copied doc path: {doc_ref_dest.path}\n")
    log_file.write(f"📈 Source data: {src_data}\n")
    log_file.write(f"📉 Filtered data: {filtered_data}\n")
    log_file.write(f"❎ Removed data: {compare_data(src_data, filtered_data)}\n")

# Iterates through all docs in "organizations" and copies the document to "folders"
def copy_orgs_to_folder(db: firestore.Client):
    org_collection = db.collection(organizations).stream()
    
    exclusion_tree = build_exclusion_tree(excluded_fields)

    with open("create_new_folder_collection.txt", "a") as log_file:
        
        for organization in org_collection:
            
            org_id = organization.id

            log_file.write(f"-----> 🏁 Starting with: {org_id}\n")

            doc_ref_src = db.collection(organizations).document(org_id)
            doc_ref_dest = db.collection(folders).document(org_id)

            copy_document(doc_ref_src, doc_ref_dest, exclusion_tree, log_file)

def copy(): 
    db = init.local()
    print(f"db: {db.project}, {db._emulator_host}")
    copy_orgs_to_folder(db)

copy()