from flask import jsonify, request
from app.utils.mongo import get_videos_collection

def get_videos_service(request):
    playlist_id = request.args.get('playlistId')
    videos_collection = get_videos_collection()
    if playlist_id:
        query = {'playlistId': playlist_id}
    else:
        query = {'type': 'concept'}
    videos = list(videos_collection.find(query))
    for video in videos:
        video['_id'] = str(video['_id'])
    return jsonify(videos)

def get_video_by_mongo_id_service(request, mongo_id):
    from bson.objectid import ObjectId
    videos_collection = get_videos_collection()
    try:
        video = videos_collection.find_one({'_id': ObjectId(mongo_id)})
        if video:
            video['_id'] = str(video['_id'])
            return jsonify(video)
        else:
            return jsonify({'error': 'Video not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Invalid id: {e}'}), 400 