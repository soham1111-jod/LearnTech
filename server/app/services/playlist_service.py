from flask import jsonify
from app.utils.mongo import get_playlists_collection

def get_playlists_service(request):
    playlists_collection = get_playlists_collection()
    playlists = list(playlists_collection.find({'active': True}))
    for pl in playlists:
        pl['_id'] = str(pl['_id'])
    return jsonify(playlists) 