from app.services.video_service import (
    get_videos_service,
    get_video_by_mongo_id_service
)

def get_videos_controller(request):
    return get_videos_service(request)

def get_video_by_mongo_id_controller(request, mongo_id):
    return get_video_by_mongo_id_service(request, mongo_id) 