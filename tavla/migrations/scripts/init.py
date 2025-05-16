import os
import firebase_admin
from firebase_admin import credentials
import firebase_admin.firestore
from google.cloud import firestore

# Init local database with default credentials
def local(name = "ent-tavla-local") -> firestore.Client:
    # Use the application default credentials.
    cred = credentials.ApplicationDefault()

    options = {
        "databaseURL": "http://localhost:8080"
    }

    os.environ["FIRESTORE_EMULATOR_HOST"] = "127.0.0.1:8080"
    
    app = firebase_admin.initialize_app(cred, options, name=name)

    print(f"Connected to: {app.name}")

    return firebase_admin.firestore.client(app)

# Init dev database with the right service key for dev credentials
def dev() -> firestore.Client:
    cred = credentials.Certificate("../ent-tavla-dev-875a70280651.json")

    options = {
        "projectId": "ent-tavla-dev"
    }
    
    app = firebase_admin.initialize_app(cred, options, name="ent-tavla-dev")
    
    print(f"Connected to: {app.name}")
    
    return firebase_admin.firestore.client(app)

# Init prod database with the right service key for prod credentials
def prod() -> firestore.Client:
    cred = credentials.Certificate("../ent-tavla-prd-54ef424ea2f0.json")

    options = {
        "projectId": "ent-tavla-prd"
    }
    
    app = firebase_admin.initialize_app(cred, options, name="ent-tavla-prd")
    
    print(f"Connected to: {app.name}")
    
    return firebase_admin.firestore.client(app)
