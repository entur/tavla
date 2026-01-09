

from google.cloud import firestore
import time
import copy
import init

collection_name = "boards"

@firestore.transactional
def remove_last_active_from_board_meta(transaction, doc_ref, log_file) -> bool:
    doc_snap = doc_ref.get(transaction=transaction)
    
    if not doc_snap.exists:
        log_file.write(f"❌ Document doesn't exist\n")
        return False
        
    data = doc_snap.to_dict()
    if not data:
        log_file.write(f"❌ No data..\n")
        return False

    if "meta" in data and isinstance(data["meta"], dict):
        if "lastActive" in data["meta"]:
            old_value = data["meta"]["lastActive"]
            transaction.update(doc_ref, {
                "meta.lastActive": firestore.DELETE_FIELD
            })
            log_file.write(f"🧹 Meta field: {data['meta']}\n")
            log_file.write(f"🧹 Removed 'lastActive' from meta: {old_value}\n")
            return True
    
    return False

def stream_documents_in_batches(collection_ref, batch_size=500):
    """Generator that yields all documents in batches to avoid Firestore timeouts."""
    last_doc = None
    while True:
        query = collection_ref.order_by("__name__").limit(batch_size)
        if last_doc:
            query = query.start_after(last_doc)

        docs = list(query.stream())
        if not docs:
            break

        for d in docs:
            yield d

        last_doc = docs[-1]
        print(f"📦 Processed batch up to document: {last_doc.id}")
        time.sleep(1)  # Optional small pause between batches


def update_documents(db: firestore.Client):
    collection_ref = db.collection(collection_name)

    success_count = 0
    fail_count = 0
    total_count = 0

    with open("remove_last_active_log_local_4.txt", "a", encoding="utf-8") as log_file:
        for i, doc_snap in enumerate(stream_documents_in_batches(collection_ref, batch_size=500)):
            total_count += 1
            doc_id = doc_snap.id
            log_file.write(f"\n-----> 🏁 Checking document: {doc_id}\n")
            transaction = db.transaction()

            try:
                doc_ref = db.collection(collection_name).document(doc_id)
                transaction = db.transaction()
                
                was_updated = remove_last_active_from_board_meta(transaction, doc_ref, log_file)
                
                if was_updated:
                    success_count += 1
                    log_file.write(f"✅ Updated document {doc_id}\n")
                else:
                    log_file.write(f"ℹ️ No change needed for {doc_id}\n")

            except Exception as e:
                fail_count += 1
                log_file.write(f"❌ Error updating {doc_id}: {str(e)}\n")

            if i % 15 == 0 and i != 0:
                log_file.write(f"\n💤 Sleeping after {i} documents...\n\n")
                log_file.flush()
                time.sleep(2)

        log_file.write(
            f"\n🎉 Finished: {success_count} updated, {fail_count} failed, {total_count} total 🎉\n"
        )

def run():
    db = init.local()
    print(f"Connected to project: {db.project}, host: {getattr(db, '_emulator_host', None)}")
    update_documents(db)


if __name__ == "__main__":
    run()
