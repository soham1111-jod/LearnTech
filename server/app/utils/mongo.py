from pymongo import MongoClient
import os
from dotenv import load_dotenv

mongo_client = None

def init_mongo(app=None):
    global mongo_client
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI")
    mongo_client = MongoClient(mongo_uri)
    if app is not None:
        app.db = mongo_client['genai']
        # Ensure index on status for efficient queries
        app.db['projects'].create_index('status')
        print(f"MongoDB connection successful: {mongo_client.address}")

# Collection getters

def get_db():
    global mongo_client
    return mongo_client['genai']

def get_videos_collection():
    return get_db()['videos']

def get_playlists_collection():
    return get_db()['playlists']

def get_projects_collection():
    return get_db()['projects'] 