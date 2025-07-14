from flask import jsonify, request
from app.utils.mongo import get_playlists_collection
from app.middlewares.auth import require_admin_token

def get_playlists_service(request):
    playlists_collection = get_playlists_collection()
    playlists = list(playlists_collection.find({'active': True}))
    for pl in playlists:
        pl['_id'] = str(pl['_id'])
    return jsonify(playlists)

def add_playlist_service(request):
    require_admin_token(request)
    data = request.get_json()

    if not data or not data.get("name"):
        return jsonify({"error": "Playlist name is required"}), 400

    playlistId = data.get("playlistId", "")
    name = data["name"]
    author = data.get("author", "")

    playlists_collection = get_playlists_collection()

    # ✅ Check for existing playlist with same playlistId
    if playlistId:
        existing = playlists_collection.find_one({"playlistId": playlistId})
        if existing:
            return jsonify({"error": "A playlist with this ID already exists."}), 400

    # Optionally also check for duplicate by name
    existing_name = playlists_collection.find_one({"name": name})
    if existing_name:
        return jsonify({"error": "A playlist with this name already exists."}), 400

    playlist = {
        "name": name,
        "playlistId": playlistId,
        "author": author,
        "active": True,
    }

    playlists_collection.insert_one(playlist)
    return jsonify({"message": "Playlist added successfully"}), 201
